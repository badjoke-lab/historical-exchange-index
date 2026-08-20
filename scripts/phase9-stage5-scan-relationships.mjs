import fs from 'node:fs';
import path from 'node:path';

const registries = [
  ['historical-exchange-index', 'https://hei.badjoke-lab.com'],
  ['minted-and-gone', 'https://mag.badjoke-lab.com'],
  ['stable-or-gone', 'https://www.stableorgone.com'],
  ['crypto-yield-archive', 'https://cya.badjoke-lab.com'],
  ['bridge-incident-registry', 'https://bir.badjoke-lab.com'],
  ['cryptocurrency-wallet-lifecycle-registry', 'https://wlr.badjoke-lab.com'],
  ['ai-tools-history-archive', 'https://ai-tools-history-archive.pages.dev'],
  ['api-deprecation-archive', 'https://api-deprecation-archive.pages.dev'],
];

const outRoot = 'stage5-relationship-audit';
fs.mkdirSync(outRoot, { recursive: true });

async function getJson(url, attempts = 3) {
  let last;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'badjoke-lab-ledger-series-stage5-full-scan/1.0' },
      });
      if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      last = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw last;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function valueAt(object, dotted) {
  return dotted.split('.').reduce((value, key) => value == null ? undefined : value[key], object);
}

function collectKeyValues(value, wanted, prefix = '', out = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectKeyValues(item, wanted, `${prefix}[${index}]`, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    const current = prefix ? `${prefix}.${key}` : key;
    if (wanted.has(key)) out.push({ path: current, value: child });
    collectKeyValues(child, wanted, current, out);
  }
  return out;
}

function collectScalarStrings(value, prefix = '', out = []) {
  if (typeof value === 'string') {
    out.push({ path: prefix, value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectScalarStrings(item, `${prefix}[${index}]`, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    collectScalarStrings(child, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

const indexes = new Map();
for (const [registryId, origin] of registries) {
  const index = await getJson(`${origin}/data/series/index.json`);
  if (index.registry_id !== registryId || !Array.isArray(index.records)) {
    throw new Error(`${registryId}: invalid Series index identity or records array`);
  }
  indexes.set(registryId, index);
}

const globalByNativeId = new Map();
const localMaps = new Map();
for (const [registryId] of registries) {
  const records = indexes.get(registryId).records;
  const byId = new Map();
  const bySlug = new Map();
  for (const row of records) {
    if (row.native_record_id) {
      byId.set(row.native_record_id, row);
      if (!globalByNativeId.has(row.native_record_id)) globalByNativeId.set(row.native_record_id, []);
      globalByNativeId.get(row.native_record_id).push({ registry_id: registryId, row });
    }
    if (row.slug) bySlug.set(row.slug, row);
  }
  localMaps.set(registryId, { byId, bySlug });
}

const candidates = [];
const unresolved = [];
const crossRegistryExactIdRefs = [];
const registrySummaries = [];

function identity(registryId, row) {
  return {
    registry_id: registryId,
    global_record_key: row.global_record_key,
    native_record_type: row.native_record_type,
    native_record_id: row.native_record_id,
    slug: row.slug,
  };
}

function resolveLocal(registryId, value) {
  if (!value) return null;
  const { byId, bySlug } = localMaps.get(registryId);
  if (typeof value === 'object') {
    if (value.id && byId.has(value.id)) return byId.get(value.id);
    if (value.native_record_id && byId.has(value.native_record_id)) return byId.get(value.native_record_id);
    if (value.slug && bySlug.has(value.slug)) return bySlug.get(value.slug);
    return null;
  }
  if (byId.has(value)) return byId.get(value);
  if (bySlug.has(value)) return bySlug.get(value);
  return null;
}

function addCandidate(registryId, sourceRow, type, targetValue, nativePath, nativeValue, note = null) {
  const targetRow = resolveLocal(registryId, targetValue);
  if (!targetRow) {
    unresolved.push({
      registry_id: registryId,
      source: identity(registryId, sourceRow),
      proposed_type: type,
      native_path: nativePath,
      native_value: nativeValue,
      reason: 'explicit_native_reference_does_not_resolve_to_current_series_record',
      note,
    });
    return;
  }
  candidates.push({
    relationship_type: type,
    source: identity(registryId, sourceRow),
    target: identity(registryId, targetRow),
    support: {
      kind: 'explicit_reviewed_native_reference',
      native_path: nativePath,
      native_value: nativeValue,
      note,
    },
  });
}

function addUnresolved(registryId, sourceRow, nativePath, nativeValue, reason, proposedType = null) {
  unresolved.push({
    registry_id: registryId,
    source: identity(registryId, sourceRow),
    proposed_type: proposedType,
    native_path: nativePath,
    native_value: nativeValue,
    reason,
  });
}

for (const [registryId] of registries) {
  const index = indexes.get(registryId);
  console.log(`${registryId}: scanning ${index.records.length} Series envelopes`);
  const envelopes = await mapLimit(index.records, 12, async (row) => ({ row, envelope: await getJson(row.machine_url) }));
  let candidateBefore = candidates.length;
  let unresolvedBefore = unresolved.length;

  for (const { row, envelope } of envelopes) {
    if (envelope.global_record_key && envelope.global_record_key !== row.global_record_key) {
      throw new Error(`${registryId}:${row.slug}: global_record_key mismatch`);
    }

    const native = envelope?.current_state?.native ?? null;

    if (registryId === 'historical-exchange-index') {
      const predecessor = valueAt(native, 'bundle.relationships.predecessor_id') ?? valueAt(native, 'bundle.entity.predecessor_id');
      const successor = valueAt(native, 'bundle.relationships.successor_id') ?? valueAt(native, 'bundle.entity.successor_id');
      if (predecessor) addCandidate(registryId, row, 'successor_of', predecessor, 'current_state.native.bundle.relationships.predecessor_id', predecessor);
      if (successor) addCandidate(registryId, row, 'predecessor_of', successor, 'current_state.native.bundle.relationships.successor_id', successor);
    }

    if (registryId === 'minted-and-gone') {
      const predecessor = native?.predecessor_marketplace;
      const successor = native?.successor_marketplace;
      if (predecessor) addCandidate(registryId, row, 'successor_of', predecessor, 'current_state.native.predecessor_marketplace', predecessor);
      if (successor) addCandidate(registryId, row, 'predecessor_of', successor, 'current_state.native.successor_marketplace', successor);
    }

    if (registryId === 'bridge-incident-registry') {
      const record = native?.record || {};
      if (row.native_record_type === 'incident') {
        const bridgeId = native?.parent_bridge?.id || record.bridge_id;
        if (bridgeId) addCandidate(registryId, row, 'incident_of', bridgeId, 'current_state.native.parent_bridge.id|record.bridge_id', bridgeId);
      } else if (row.native_record_type === 'bridge') {
        if (record.predecessor_id) addCandidate(registryId, row, 'successor_of', record.predecessor_id, 'current_state.native.record.predecessor_id', record.predecessor_id);
        if (record.successor_id) addCandidate(registryId, row, 'predecessor_of', record.successor_id, 'current_state.native.record.successor_id', record.successor_id);
        if (record.replacement_bridge_id) addUnresolved(registryId, row, 'current_state.native.record.replacement_bridge_id', record.replacement_bridge_id, 'replacement_direction_requires_separate_review', 'replacement_for');
        if (record.duplicate_of) addUnresolved(registryId, row, 'current_state.native.record.duplicate_of', record.duplicate_of, 'native_duplicate_semantics_not_in_frozen_typed_vocabulary');
        if (record.merged_into) addUnresolved(registryId, row, 'current_state.native.record.merged_into', record.merged_into, 'native_merge_semantics_not_in_frozen_typed_vocabulary');
      }
    }

    if (registryId === 'cryptocurrency-wallet-lifecycle-registry') {
      if (String(row.native_record_type).includes('product-record')) {
        const parentId = native?.parent_entity?.id;
        if (parentId) addCandidate(registryId, row, 'product_of', parentId, 'current_state.native.parent_entity.id', parentId);
        if (native?.predecessor_product_id) addCandidate(registryId, row, 'successor_of', native.predecessor_product_id, 'current_state.native.predecessor_product_id', native.predecessor_product_id);
        if (native?.successor_product_id) addCandidate(registryId, row, 'predecessor_of', native.successor_product_id, 'current_state.native.successor_product_id', native.successor_product_id);
      }
    }

    if (registryId === 'stable-or-gone') {
      const stableRels = native?.related?.stable_asset_relationships;
      if (Array.isArray(stableRels)) {
        for (const rel of stableRels) {
          addUnresolved(registryId, row, 'current_state.native.related.stable_asset_relationships', rel, 'native_stable_asset_relationship_requires_type_and_direction_review');
        }
      }
      const orgRels = native?.related?.organization_relationships;
      if (Array.isArray(orgRels) && orgRels.length) {
        addUnresolved(registryId, row, 'current_state.native.related.organization_relationships', { count: orgRels.length }, 'organization_targets_are_not_stage3_series_record_types');
      }
    }

    if (registryId === 'ai-tools-history-archive') {
      const related = collectKeyValues(envelope, new Set(['related_records']));
      for (const fact of related) {
        const values = Array.isArray(fact.value) ? fact.value : [fact.value];
        for (const value of values) {
          if (typeof value === 'string' || (value && typeof value === 'object')) {
            addCandidate(registryId, row, 'related_to', value, fact.path, value, 'generic native related_records mapped only to weak related_to');
          }
        }
      }
    }

    if (registryId === 'api-deprecation-archive') {
      const explicitIds = collectKeyValues(envelope, new Set(['replacement_id', 'replacement_entity_id', 'replacement_record_id']));
      for (const fact of explicitIds) {
        const target = resolveLocal(registryId, fact.value);
        if (target) {
          candidates.push({
            relationship_type: 'replacement_for',
            source: identity(registryId, target),
            target: identity(registryId, row),
            support: { kind: 'explicit_reviewed_native_reference', native_path: fact.path, native_value: fact.value, note: 'direction inverted because native record identifies its replacement' },
          });
        } else {
          addUnresolved(registryId, row, fact.path, fact.value, 'explicit_replacement_id_not_resolved_to_series_record', 'replacement_for');
        }
      }
      if (!explicitIds.length && native?.replacement) {
        addUnresolved(registryId, row, 'current_state.native.replacement', native.replacement, 'replacement_is_reviewed_text_without_series_target_identity', 'replacement_for');
      }
    }

    if (registryId === 'crypto-yield-archive') {
      const productCount = native?.related_record_counts?.product_profiles || 0;
      if (productCount > 0) {
        addUnresolved(registryId, row, 'current_state.native.supporting_records.products', { count: productCount }, 'supporting_products_are_not_stage3_series_record_types');
      }
    }

    for (const scalar of collectScalarStrings(envelope)) {
      const targets = globalByNativeId.get(scalar.value);
      if (!targets) continue;
      for (const target of targets) {
        if (target.registry_id === registryId) continue;
        crossRegistryExactIdRefs.push({
          source: identity(registryId, row),
          target: identity(target.registry_id, target.row),
          native_path: scalar.path,
          native_value: scalar.value,
        });
      }
    }
  }

  registrySummaries.push({
    registry_id: registryId,
    envelopes_scanned: envelopes.length,
    accepted_candidate_rows_added: candidates.length - candidateBefore,
    unresolved_rows_added: unresolved.length - unresolvedBefore,
  });
}

function dedupe(items, keyFn) {
  const map = new Map();
  for (const item of items) map.set(keyFn(item), item);
  return [...map.values()];
}

const accepted = dedupe(candidates, (x) => `${x.relationship_type}|${x.source.global_record_key}|${x.target.global_record_key}|${x.support.native_path}`)
  .sort((a, b) => `${a.source.global_record_key}|${a.relationship_type}|${a.target.global_record_key}`.localeCompare(`${b.source.global_record_key}|${b.relationship_type}|${b.target.global_record_key}`));
const unresolvedDeduped = dedupe(unresolved, (x) => `${x.source.global_record_key}|${x.native_path}|${JSON.stringify(x.native_value)}|${x.reason}`);
const crossDeduped = dedupe(crossRegistryExactIdRefs, (x) => `${x.source.global_record_key}|${x.target.global_record_key}|${x.native_path}`);

const byRegistry = {};
for (const [registryId] of registries) {
  byRegistry[registryId] = {
    accepted_candidates: accepted.filter((x) => x.source.registry_id === registryId).length,
    unresolved: unresolvedDeduped.filter((x) => x.registry_id === registryId).length,
    cross_registry_exact_id_refs: crossDeduped.filter((x) => x.source.registry_id === registryId).length,
  };
}

const report = {
  schema_version: '1.0.0',
  audit_scope: 'ledger_series_phase9_stage5_full_relationship_inventory',
  generated_at: new Date().toISOString(),
  contract_rules: {
    inference_from_name_similarity: false,
    accepted_support: 'explicit reviewed native ID/slug reference resolving to an existing Series index record',
    publication_authorized: false,
  },
  registry_summaries: registrySummaries,
  counts: {
    accepted_candidates: accepted.length,
    unresolved_native_facts: unresolvedDeduped.length,
    cross_registry_exact_id_refs: crossDeduped.length,
  },
  by_registry: byRegistry,
  accepted_candidates: accepted,
  unresolved_native_facts: unresolvedDeduped,
  cross_registry_exact_id_refs: crossDeduped,
};

const output = path.join(outRoot, 'relationship-inventory.json');
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ counts: report.counts, by_registry: byRegistry }, null, 2));
console.log(`Wrote ${output}`);
