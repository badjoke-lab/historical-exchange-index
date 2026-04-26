import {
  STATUS_VALUES,
  TYPE_VALUES,
  DEATH_REASON_VALUES,
  EVENT_TYPE_VALUES,
  IMPACT_LEVEL_VALUES,
  EVENT_STATUS_EFFECT_VALUES,
  SOURCE_TYPE_VALUES,
  RELIABILITY_VALUES,
  CLAIM_SCOPE_VALUES,
  DEAD_SIDE_STATUSES,
} from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';

function findDuplicates(items, getValue) {
  const seen = new Map();
  const duplicates = [];
  for (const item of items) {
    const value = getValue(item);
    if (!value) continue;
    if (seen.has(value)) {
      duplicates.push(value);
    } else {
      seen.set(value, item);
    }
  }
  return [...new Set(duplicates)];
}

function isDateLike(value) {
  return value === null || value === undefined || /^\d{4}(-\d{2}){0,2}$/.test(String(value));
}

function isUrlLike(value) {
  if (value === null || value === undefined || value === '') return true;
  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
}

function addDuplicateFindings(findings, monitor, label, values) {
  for (const value of values) {
    findings.push(createFinding({
      monitor,
      severity: 'critical',
      category: `duplicate_${label}`,
      title: `Duplicate ${label}: ${value}`,
      summary: `Canonical data contains duplicate ${label} value ${value}.`,
      recommended_action: 'fix_canonical_data_before_more_batches',
      confidence: 'high',
      dedupe_key: `${monitor}:duplicate_${label}:${value}`,
    }));
  }
}

export async function runEvidenceAndRecordQualityWatch(context, { startedAt } = {}) {
  const monitor = 'evidence-and-record-quality-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const { entities = [], events = [], evidence = [] } = context.canonicalData || {};

  const entityIds = new Set(entities.map((entity) => entity.id));
  const eventIds = new Set(events.map((event) => event.id));

  addDuplicateFindings(findings, monitor, 'entity_id', findDuplicates(entities, (entity) => entity.id));
  addDuplicateFindings(findings, monitor, 'entity_slug', findDuplicates(entities, (entity) => entity.slug));
  addDuplicateFindings(findings, monitor, 'event_id', findDuplicates(events, (event) => event.id));
  addDuplicateFindings(findings, monitor, 'evidence_id', findDuplicates(evidence, (source) => source.id));

  for (const entity of entities) {
    if (!TYPE_VALUES.includes(entity.type)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_type', title: `Invalid type on ${entity.id}`, summary: `type=${entity.type}`, recommended_action: 'fix_entity_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_type:${entity.id}` }));
    }
    if (!STATUS_VALUES.includes(entity.status)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_status', title: `Invalid status on ${entity.id}`, summary: `status=${entity.status}`, recommended_action: 'fix_entity_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_status:${entity.id}` }));
    }
    if (DEAD_SIDE_STATUSES.includes(entity.status) && !entity.death_reason) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'dead_side_missing_death_reason', title: `Dead-side entity missing death_reason: ${entity.canonical_name}`, summary: entity.id, recommended_action: 'review_death_reason', confidence: 'high', dedupe_key: `${monitor}:missing_death_reason:${entity.id}` }));
    }
    if (entity.death_reason && !DEATH_REASON_VALUES.includes(entity.death_reason)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_death_reason', title: `Invalid death_reason on ${entity.id}`, summary: `death_reason=${entity.death_reason}`, recommended_action: 'fix_entity_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_death_reason:${entity.id}` }));
    }
    if (!isDateLike(entity.launch_date) || !isDateLike(entity.death_date) || !isDateLike(entity.last_verified_at)) {
      findings.push(createFinding({ monitor, severity: 'medium', category: 'bad_entity_date_format', title: `Bad date format on ${entity.id}`, summary: 'Expected YYYY, YYYY-MM, YYYY-MM-DD, null, or empty.', recommended_action: 'fix_date_format', confidence: 'medium', dedupe_key: `${monitor}:bad_date:${entity.id}` }));
    }
    for (const key of ['official_url_original', 'archived_url']) {
      if (!isUrlLike(entity[key])) {
        findings.push(createFinding({ monitor, severity: 'medium', category: 'bad_entity_url_format', title: `Bad URL format on ${entity.id}`, summary: `${key}=${entity[key]}`, recommended_action: 'fix_url_format', confidence: 'medium', dedupe_key: `${monitor}:bad_url:${entity.id}:${key}` }));
      }
    }
  }

  for (const event of events) {
    if (!entityIds.has(event.exchange_id)) {
      findings.push(createFinding({ monitor, severity: 'critical', category: 'event_missing_entity_reference', title: `Event references missing entity: ${event.id}`, summary: `exchange_id=${event.exchange_id}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:event_missing_entity:${event.id}` }));
    }
    if (!EVENT_TYPE_VALUES.includes(event.event_type)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_event_type', title: `Invalid event_type on ${event.id}`, summary: `event_type=${event.event_type}`, recommended_action: 'fix_event_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_event_type:${event.id}` }));
    }
    if (event.impact_level && !IMPACT_LEVEL_VALUES.includes(event.impact_level)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_impact_level', title: `Invalid impact_level on ${event.id}`, summary: `impact_level=${event.impact_level}`, recommended_action: 'fix_event_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_impact:${event.id}` }));
    }
    if (event.event_status_effect && !EVENT_STATUS_EFFECT_VALUES.includes(event.event_status_effect)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_event_status_effect', title: `Invalid event_status_effect on ${event.id}`, summary: `event_status_effect=${event.event_status_effect}`, recommended_action: 'fix_event_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_event_status_effect:${event.id}` }));
    }
    if (!isDateLike(event.event_date) || !isDateLike(event.start_date) || !isDateLike(event.end_date)) {
      findings.push(createFinding({ monitor, severity: 'medium', category: 'bad_event_date_format', title: `Bad date format on ${event.id}`, summary: 'Expected YYYY, YYYY-MM, YYYY-MM-DD, null, or empty.', recommended_action: 'fix_date_format', confidence: 'medium', dedupe_key: `${monitor}:bad_event_date:${event.id}` }));
    }
  }

  const evidenceByEntity = new Map();
  for (const source of evidence) {
    if (!entityIds.has(source.exchange_id)) {
      findings.push(createFinding({ monitor, severity: 'critical', category: 'evidence_missing_entity_reference', title: `Evidence references missing entity: ${source.id}`, summary: `exchange_id=${source.exchange_id}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:evidence_missing_entity:${source.id}` }));
    }
    if (source.event_id && !eventIds.has(source.event_id)) {
      findings.push(createFinding({ monitor, severity: 'critical', category: 'evidence_missing_event_reference', title: `Evidence references missing event: ${source.id}`, summary: `event_id=${source.event_id}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:evidence_missing_event:${source.id}` }));
    }
    if (source.source_type && !SOURCE_TYPE_VALUES.includes(source.source_type)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_source_type', title: `Invalid source_type on ${source.id}`, summary: `source_type=${source.source_type}`, recommended_action: 'fix_evidence_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_source_type:${source.id}` }));
    }
    if (source.reliability && !RELIABILITY_VALUES.includes(source.reliability)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_reliability', title: `Invalid reliability on ${source.id}`, summary: `reliability=${source.reliability}`, recommended_action: 'fix_evidence_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_reliability:${source.id}` }));
    }
    if (source.claim_scope && !CLAIM_SCOPE_VALUES.includes(source.claim_scope)) {
      findings.push(createFinding({ monitor, severity: 'high', category: 'invalid_claim_scope', title: `Invalid claim_scope on ${source.id}`, summary: `claim_scope=${source.claim_scope}`, recommended_action: 'fix_evidence_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_claim_scope:${source.id}` }));
    }
    if (!isUrlLike(source.url) || !isUrlLike(source.archived_url)) {
      findings.push(createFinding({ monitor, severity: 'medium', category: 'bad_evidence_url_format', title: `Bad URL format on ${source.id}`, summary: 'Evidence url or archived_url is not URL-like.', recommended_action: 'fix_url_format', confidence: 'medium', dedupe_key: `${monitor}:bad_evidence_url:${source.id}` }));
    }
    evidenceByEntity.set(source.exchange_id, (evidenceByEntity.get(source.exchange_id) || 0) + 1);
  }

  for (const entity of entities) {
    const count = evidenceByEntity.get(entity.id) || 0;
    if (DEAD_SIDE_STATUSES.includes(entity.status) && count < 2) {
      findings.push(createFinding({ monitor, severity: 'medium', category: 'dead_side_thin_evidence', title: `Dead-side entity has fewer than 2 evidence records: ${entity.canonical_name}`, summary: `${entity.id} has ${count} evidence records.`, recommended_action: 'add_second_source_or_archive', confidence: 'medium', dedupe_key: `${monitor}:thin_evidence:${entity.id}` }));
    }
  }

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors: [],
  });
}
