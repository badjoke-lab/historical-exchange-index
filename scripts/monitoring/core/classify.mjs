import { isExchangeLikeText, isLikelyOutOfScopeText, normalizeText } from './normalize.mjs';
import { evaluateHistoricalDeadSignals } from './historical-dead-signals.mjs';

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

export function classifyCandidate(candidate, duplicateCheck) {
  const text = normalizeText([
    candidate?.canonical_name,
    candidate?.name,
    candidate?.description,
    candidate?.headline,
    candidate?.notes,
    ...(candidate?.signals || []),
  ].filter(Boolean).join(' '));
  const historical = evaluateHistoricalDeadSignals(candidate);

  const hasShutdown = includesAny(text, [
    'shutdown',
    'shut down',
    'closed',
    'closure',
    'cease operations',
    'ceased operations',
    'wind down',
    'service ended',
    'service discontinued',
  ]);
  const hasIncident = includesAny(text, [
    'hack',
    'hacked',
    'exploit',
    'breach',
    'unauthorized withdrawal',
    'hot wallet',
    'stolen',
    'drained',
  ]);
  const hasSuspension = includesAny(text, [
    'withdrawals suspended',
    'deposits suspended',
    'trading halted',
    'paused withdrawals',
    'halted trading',
  ]);
  const hasRegulatory = includesAny(text, [
    'regulatory',
    'license',
    'sanction',
    'enforcement',
    'regional exit',
    'warning list',
  ]);
  const exchangeLike = isExchangeLikeText(text) || candidate?.likely_type === 'cex' || candidate?.likely_type === 'dex' || candidate?.likely_type === 'hybrid';
  const outOfScope = isLikelyOutOfScopeText(text);

  let candidateClass = 'B';
  let likelyStatus = historical.suggested_status || candidate?.likely_status || 'unknown';
  let likelyDeathReason = historical.suggested_death_reason || candidate?.likely_death_reason || null;
  let recordShape = duplicateCheck.matched_existing_entity ? 'existing_entity_event_update' : 'new_entity';
  let nextAction = 'hold_for_review';
  let heiRelevance = 'Potential HEI candidate, but requires scope/source review.';

  if (outOfScope || !exchangeLike) {
    candidateClass = 'C';
    recordShape = 'out_of_scope';
    nextAction = 'ignore_or_keep_for_reference';
    heiRelevance = 'Likely out of scope or too weak for canonical insertion.';
  } else if (historical.historical_dead_strength === 'strong') {
    candidateClass = 'A';
    likelyStatus = historical.suggested_status;
    likelyDeathReason = historical.suggested_death_reason;
    recordShape = duplicateCheck.matched_existing_entity ? 'existing_entity_event_update' : 'new_entity';
    nextAction = 'review_and_stage_public_quality_record';
    heiRelevance = 'Likely HEI-relevant historical dead/continuity candidate.';
  } else if (hasShutdown) {
    candidateClass = 'A';
    likelyStatus = 'dead';
    likelyDeathReason = hasRegulatory ? 'regulation' : 'voluntary_shutdown';
    nextAction = 'review_and_stage_public_quality_record';
    heiRelevance = 'Likely HEI-relevant shutdown / wind-down candidate.';
  } else if (hasIncident || hasSuspension) {
    candidateClass = 'A';
    likelyStatus = duplicateCheck.matched_existing_entity ? 'active' : 'unknown';
    nextAction = 'review_for_event_or_entity_staging';
    heiRelevance = 'Likely HEI-relevant active-side incident or service restriction candidate.';
  } else if (hasRegulatory) {
    candidateClass = 'B';
    likelyStatus = 'limited';
    nextAction = 'hold_for_regulatory_scope_review';
    heiRelevance = 'Potential HEI regulatory candidate; do not mark dead unless service closure is proven.';
  } else if (historical.historical_dead_strength === 'medium') {
    candidateClass = 'B';
    likelyStatus = historical.suggested_status;
    likelyDeathReason = historical.suggested_death_reason;
    nextAction = 'hold_for_more_sources_or_scope_decision';
    heiRelevance = 'Potential historical dead/continuity candidate; needs more source review.';
  } else if (!duplicateCheck.matched_existing_entity) {
    candidateClass = 'B';
    likelyStatus = candidate?.likely_status || 'active';
    recordShape = 'new_entity';
    nextAction = 'hold_for_active_baseline_or_batch_add';
    heiRelevance = 'Potential active exchange motherlist candidate.';
  }

  return {
    candidate_class: candidateClass,
    likely_status: likelyStatus,
    likely_death_reason: likelyDeathReason,
    record_shape: recordShape,
    hei_relevance: heiRelevance,
    next_action: nextAction,
    historical_dead_score: historical.historical_dead_score,
    historical_dead_strength: historical.historical_dead_strength,
    historical_dead_tags: historical.historical_dead_tags,
  };
}
