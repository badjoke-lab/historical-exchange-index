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
  ACTIVE_SIDE_STATUSES,
  OFFICIAL_URL_STATUS_VALUES,
} from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';

function findDuplicates(items, getValue) {
  const seen = new Map();
  const duplicates = [];
  for (const item of items) {
    const value = getValue(item);
    if (!value) continue;
    if (seen.has(value)) duplicates.push(value);
    else seen.set(value, item);
  }
  return [...new Set(duplicates)];
}

function isDateLike(value) {
  return value === null || value === undefined || value === '' || /^\d{4}(-\d{2}){0,2}$/.test(String(value));
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

function textLength(value) {
  return typeof value === 'string' ? value.trim().length : 0;
}

function hasProvisionalText(value) {
  if (typeof value !== 'string') return false;
  return /\b(todo|tbd|placeholder|needs? verification|verify|unknown source|temporary|draft)\b/i.test(value);
}

function addFinding(findings, payload) {
  findings.push(createFinding(payload));
}

function addDuplicateFindings(findings, monitor, label, values) {
  for (const value of values) {
    addFinding(findings, {
      monitor,
      severity: 'critical',
      category: `duplicate_${label}`,
      title: `Duplicate ${label}: ${value}`,
      summary: `Canonical data contains duplicate ${label} value ${value}.`,
      recommended_action: 'fix_canonical_data_before_more_batches',
      confidence: 'high',
      dedupe_key: `${monitor}:duplicate_${label}:${value}`,
    });
  }
}

function groupCount(items, keyName) {
  const map = new Map();
  for (const item of items) {
    const key = item[keyName];
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

function sourceCountForEvent(evidence, eventId) {
  return evidence.filter((source) => source.event_id === eventId).length;
}

export async function runEvidenceAndRecordQualityWatch(context, { startedAt } = {}) {
  const monitor = 'evidence-and-record-quality-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const { entities = [], events = [], evidence = [] } = context.canonicalData || {};

  const entityIds = new Set(entities.map((entity) => entity.id));
  const eventIds = new Set(events.map((event) => event.id));
  const eventsByEntity = groupCount(events, 'exchange_id');
  const evidenceByEntity = groupCount(evidence, 'exchange_id');

  addDuplicateFindings(findings, monitor, 'entity_id', findDuplicates(entities, (entity) => entity.id));
  addDuplicateFindings(findings, monitor, 'entity_slug', findDuplicates(entities, (entity) => entity.slug));
  addDuplicateFindings(findings, monitor, 'event_id', findDuplicates(events, (event) => event.id));
  addDuplicateFindings(findings, monitor, 'evidence_id', findDuplicates(evidence, (source) => source.id));

  for (const entity of entities) {
    const entityLabel = entity.canonical_name || entity.slug || entity.id;
    const entityEvidenceCount = evidenceByEntity.get(entity.id) || 0;
    const entityEventCount = eventsByEntity.get(entity.id) || 0;

    if (!entity.id || !entity.slug || !entity.canonical_name) {
      addFinding(findings, { monitor, severity: 'critical', category: 'entity_required_field_missing', title: `Entity required field missing: ${entityLabel}`, summary: `id=${entity.id}, slug=${entity.slug}, canonical_name=${entity.canonical_name}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:entity_required:${entity.id || entity.slug || entityLabel}` });
    }
    if (!TYPE_VALUES.includes(entity.type)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_type', title: `Invalid type on ${entity.id}`, summary: `type=${entity.type}`, recommended_action: 'fix_entity_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_type:${entity.id}` });
    }
    if (!STATUS_VALUES.includes(entity.status)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_status', title: `Invalid status on ${entity.id}`, summary: `status=${entity.status}`, recommended_action: 'fix_entity_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_status:${entity.id}` });
    }
    if (DEAD_SIDE_STATUSES.includes(entity.status) && !entity.death_reason) {
      addFinding(findings, { monitor, severity: 'high', category: 'dead_side_missing_death_reason', title: `Dead-side entity missing death_reason: ${entityLabel}`, summary: entity.id, recommended_action: 'review_death_reason', confidence: 'high', dedupe_key: `${monitor}:missing_death_reason:${entity.id}` });
    }
    if (ACTIVE_SIDE_STATUSES.includes(entity.status) && entity.death_reason) {
      addFinding(findings, { monitor, severity: 'high', category: 'active_side_has_death_reason', title: `Active-side entity has death_reason: ${entityLabel}`, summary: `${entity.id} death_reason=${entity.death_reason}`, recommended_action: 'remove_or_review_death_reason', confidence: 'high', dedupe_key: `${monitor}:active_has_death_reason:${entity.id}` });
    }
    if (entity.death_reason && !DEATH_REASON_VALUES.includes(entity.death_reason)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_death_reason', title: `Invalid death_reason on ${entity.id}`, summary: `death_reason=${entity.death_reason}`, recommended_action: 'fix_entity_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_death_reason:${entity.id}` });
    }
    if (entity.official_url_status && !OFFICIAL_URL_STATUS_VALUES.includes(entity.official_url_status)) {
      addFinding(findings, { monitor, severity: 'medium', category: 'invalid_official_url_status', title: `Invalid official_url_status on ${entity.id}`, summary: `official_url_status=${entity.official_url_status}`, recommended_action: 'fix_entity_enum', confidence: 'medium', dedupe_key: `${monitor}:invalid_official_url_status:${entity.id}` });
    }
    if (!isDateLike(entity.launch_date) || !isDateLike(entity.death_date) || !isDateLike(entity.last_verified_at)) {
      addFinding(findings, { monitor, severity: 'medium', category: 'bad_entity_date_format', title: `Bad date format on ${entity.id}`, summary: 'Expected YYYY, YYYY-MM, YYYY-MM-DD, null, or empty.', recommended_action: 'fix_date_format', confidence: 'medium', dedupe_key: `${monitor}:bad_date:${entity.id}` });
    }
    for (const key of ['official_url_original', 'archived_url']) {
      if (!isUrlLike(entity[key])) {
        addFinding(findings, { monitor, severity: 'medium', category: 'bad_entity_url_format', title: `Bad URL format on ${entity.id}`, summary: `${key}=${entity[key]}`, recommended_action: 'fix_url_format', confidence: 'medium', dedupe_key: `${monitor}:bad_url:${entity.id}:${key}` });
      }
    }

    if (entityEvidenceCount === 0) {
      addFinding(findings, { monitor, severity: 'high', category: 'entity_without_evidence', title: `Entity has no evidence records: ${entityLabel}`, summary: `${entity.id} has 0 evidence records.`, recommended_action: 'add_evidence_or_review_scope', confidence: 'high', dedupe_key: `${monitor}:no_evidence:${entity.id}` });
    }
    if (DEAD_SIDE_STATUSES.includes(entity.status) && entityEvidenceCount < 2) {
      addFinding(findings, { monitor, severity: 'medium', category: 'dead_side_thin_evidence', title: `Dead-side entity has fewer than 2 evidence records: ${entityLabel}`, summary: `${entity.id} has ${entityEvidenceCount} evidence records.`, recommended_action: 'add_second_source_or_archive', confidence: 'medium', dedupe_key: `${monitor}:thin_evidence:${entity.id}` });
    }
    if (entityEventCount === 0) {
      addFinding(findings, { monitor, severity: 'medium', category: 'entity_without_events', title: `Entity has no event records: ${entityLabel}`, summary: `${entity.id} has 0 event records.`, recommended_action: 'add_minimum_event_or_review_record_shape', confidence: 'medium', dedupe_key: `${monitor}:no_events:${entity.id}` });
    }
    if (DEAD_SIDE_STATUSES.includes(entity.status) && !entity.archived_url) {
      addFinding(findings, { monitor, severity: 'medium', category: 'dead_side_missing_archive_url', title: `Dead-side entity missing archived_url: ${entityLabel}`, summary: entity.id, recommended_action: 'find_or_add_archive_url', confidence: 'medium', dedupe_key: `${monitor}:missing_archive:${entity.id}` });
    }
    if (!entity.official_url_status || entity.official_url_status === 'unknown') {
      addFinding(findings, { monitor, severity: 'low', category: 'official_url_status_unknown', title: `official_url_status unknown: ${entityLabel}`, summary: entity.id, recommended_action: 'review_official_url_status_when_available', confidence: 'medium', dedupe_key: `${monitor}:unknown_url_status:${entity.id}` });
    }
    if (!entity.country_or_origin || /^unknown$/i.test(entity.country_or_origin)) {
      addFinding(findings, { monitor, severity: 'low', category: 'origin_unknown', title: `country_or_origin unknown: ${entityLabel}`, summary: entity.id, recommended_action: 'add_origin_if_sourceable', confidence: 'medium', dedupe_key: `${monitor}:origin_unknown:${entity.id}` });
    }
    if (textLength(entity.summary) < 60) {
      addFinding(findings, { monitor, severity: 'low', category: 'summary_short', title: `Summary may be too short: ${entityLabel}`, summary: `${entity.id} summary length=${textLength(entity.summary)}`, recommended_action: 'expand_summary_when_record_is_touched', confidence: 'medium', dedupe_key: `${monitor}:summary_short:${entity.id}` });
    }
    if (hasProvisionalText(entity.notes) || hasProvisionalText(entity.summary)) {
      addFinding(findings, { monitor, severity: 'medium', category: 'provisional_text', title: `Provisional text found: ${entityLabel}`, summary: entity.id, recommended_action: 'replace_provisional_notes_with_reviewed_text', confidence: 'medium', dedupe_key: `${monitor}:provisional_text:${entity.id}` });
    }
    if (['low', 'medium'].includes(entity.confidence) && entityEvidenceCount < 2) {
      addFinding(findings, { monitor, severity: 'medium', category: 'low_confidence_thin_evidence', title: `Low/medium confidence with thin evidence: ${entityLabel}`, summary: `${entity.id} confidence=${entity.confidence}, evidence=${entityEvidenceCount}`, recommended_action: 'improve_evidence_or_review_confidence', confidence: 'medium', dedupe_key: `${monitor}:low_conf_thin:${entity.id}` });
    }
    const lineageText = `${entity.summary || ''} ${entity.notes || ''}`;
    if (!entity.successor_id && /\b(successor|migrat|transfer|acquir|merged|rebrand|renamed)\b/i.test(lineageText)) {
      addFinding(findings, { monitor, severity: 'low', category: 'possible_successor_missing', title: `Possible successor/predecessor link missing: ${entityLabel}`, summary: entity.id, recommended_action: 'review_lineage_fields_when_record_is_touched', confidence: 'low', dedupe_key: `${monitor}:possible_lineage_missing:${entity.id}` });
    }
  }

  for (const event of events) {
    if (!event.id || !event.exchange_id || !event.event_type || !event.title) {
      addFinding(findings, { monitor, severity: 'critical', category: 'event_required_field_missing', title: `Event required field missing: ${event.id || event.title || 'unknown event'}`, summary: `id=${event.id}, exchange_id=${event.exchange_id}, event_type=${event.event_type}, title=${event.title}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:event_required:${event.id || event.title}` });
    }
    if (!entityIds.has(event.exchange_id)) {
      addFinding(findings, { monitor, severity: 'critical', category: 'event_missing_entity_reference', title: `Event references missing entity: ${event.id}`, summary: `exchange_id=${event.exchange_id}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:event_missing_entity:${event.id}` });
    }
    if (!EVENT_TYPE_VALUES.includes(event.event_type)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_event_type', title: `Invalid event_type on ${event.id}`, summary: `event_type=${event.event_type}`, recommended_action: 'fix_event_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_event_type:${event.id}` });
    }
    if (event.impact_level && !IMPACT_LEVEL_VALUES.includes(event.impact_level)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_impact_level', title: `Invalid impact_level on ${event.id}`, summary: `impact_level=${event.impact_level}`, recommended_action: 'fix_event_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_impact:${event.id}` });
    }
    if (event.event_status_effect && !EVENT_STATUS_EFFECT_VALUES.includes(event.event_status_effect)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_event_status_effect', title: `Invalid event_status_effect on ${event.id}`, summary: `event_status_effect=${event.event_status_effect}`, recommended_action: 'fix_event_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_event_status_effect:${event.id}` });
    }
    if (!isDateLike(event.event_date) || !isDateLike(event.start_date) || !isDateLike(event.end_date)) {
      addFinding(findings, { monitor, severity: 'medium', category: 'bad_event_date_format', title: `Bad date format on ${event.id}`, summary: 'Expected YYYY, YYYY-MM, YYYY-MM-DD, null, or empty.', recommended_action: 'fix_date_format', confidence: 'medium', dedupe_key: `${monitor}:bad_event_date:${event.id}` });
    }
    const actualSourceCount = sourceCountForEvent(evidence, event.id);
    if (Number.isFinite(event.source_count) && event.source_count !== actualSourceCount) {
      addFinding(findings, { monitor, severity: 'medium', category: 'source_count_mismatch', title: `source_count mismatch on ${event.id}`, summary: `declared=${event.source_count}, actual=${actualSourceCount}`, recommended_action: 'review_event_source_count', confidence: 'medium', dedupe_key: `${monitor}:source_count_mismatch:${event.id}` });
    }
  }

  for (const source of evidence) {
    if (!source.id || !source.exchange_id || !source.url || !source.title) {
      addFinding(findings, { monitor, severity: 'critical', category: 'evidence_required_field_missing', title: `Evidence required field missing: ${source.id || source.title || 'unknown evidence'}`, summary: `id=${source.id}, exchange_id=${source.exchange_id}, url=${source.url}, title=${source.title}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:evidence_required:${source.id || source.url}` });
    }
    if (!entityIds.has(source.exchange_id)) {
      addFinding(findings, { monitor, severity: 'critical', category: 'evidence_missing_entity_reference', title: `Evidence references missing entity: ${source.id}`, summary: `exchange_id=${source.exchange_id}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:evidence_missing_entity:${source.id}` });
    }
    if (source.event_id && !eventIds.has(source.event_id)) {
      addFinding(findings, { monitor, severity: 'critical', category: 'evidence_missing_event_reference', title: `Evidence references missing event: ${source.id}`, summary: `event_id=${source.event_id}`, recommended_action: 'fix_canonical_data_before_more_batches', confidence: 'high', dedupe_key: `${monitor}:evidence_missing_event:${source.id}` });
    }
    if (source.source_type && !SOURCE_TYPE_VALUES.includes(source.source_type)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_source_type', title: `Invalid source_type on ${source.id}`, summary: `source_type=${source.source_type}`, recommended_action: 'fix_evidence_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_source_type:${source.id}` });
    }
    if (source.reliability && !RELIABILITY_VALUES.includes(source.reliability)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_reliability', title: `Invalid reliability on ${source.id}`, summary: `reliability=${source.reliability}`, recommended_action: 'fix_evidence_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_reliability:${source.id}` });
    }
    if (source.claim_scope && !CLAIM_SCOPE_VALUES.includes(source.claim_scope)) {
      addFinding(findings, { monitor, severity: 'high', category: 'invalid_claim_scope', title: `Invalid claim_scope on ${source.id}`, summary: `claim_scope=${source.claim_scope}`, recommended_action: 'fix_evidence_enum', confidence: 'high', dedupe_key: `${monitor}:invalid_claim_scope:${source.id}` });
    }
    if (!isDateLike(source.published_at) || !isDateLike(source.accessed_at)) {
      addFinding(findings, { monitor, severity: 'medium', category: 'bad_evidence_date_format', title: `Bad evidence date format on ${source.id}`, summary: 'Expected YYYY, YYYY-MM, YYYY-MM-DD, null, or empty.', recommended_action: 'fix_date_format', confidence: 'medium', dedupe_key: `${monitor}:bad_evidence_date:${source.id}` });
    }
    if (!isUrlLike(source.url) || !isUrlLike(source.archived_url)) {
      addFinding(findings, { monitor, severity: 'medium', category: 'bad_evidence_url_format', title: `Bad URL format on ${source.id}`, summary: 'Evidence url or archived_url is not URL-like.', recommended_action: 'fix_url_format', confidence: 'medium', dedupe_key: `${monitor}:bad_evidence_url:${source.id}` });
    }
    if (!source.archived_url) {
      addFinding(findings, { monitor, severity: 'low', category: 'evidence_archive_missing', title: `Evidence archived_url missing: ${source.id}`, summary: `${source.publisher || 'unknown publisher'} — ${source.title || 'untitled'}`, recommended_action: 'add_archive_when_record_is_touched', confidence: 'medium', dedupe_key: `${monitor}:evidence_archive_missing:${source.id}` });
    }
  }

  const completionSummary = {
    entities: entities.length,
    events: events.length,
    evidence: evidence.length,
    entities_without_events: entities.filter((entity) => (eventsByEntity.get(entity.id) || 0) === 0).length,
    entities_without_evidence: entities.filter((entity) => (evidenceByEntity.get(entity.id) || 0) === 0).length,
    dead_side_with_fewer_than_two_evidence: entities.filter((entity) => DEAD_SIDE_STATUSES.includes(entity.status) && (evidenceByEntity.get(entity.id) || 0) < 2).length,
    evidence_without_archive: evidence.filter((source) => !source.archived_url).length,
  };

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors: [],
    extra: {
      completion_summary: completionSummary,
    },
  });
}
