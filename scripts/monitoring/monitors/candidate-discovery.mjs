import { createMonitorResult } from '../core/finding-utils.mjs';

export async function runCandidateDiscovery(context, { startedAt } = {}) {
  const started_at = startedAt || new Date().toISOString();
  return createMonitorResult({
    monitor: 'candidate-discovery',
    started_at,
    finished_at: new Date().toISOString(),
    findings: [],
    candidates: [],
    errors: [],
    extra: {
      note: 'Skeleton monitor. External list diff and candidate discovery are implemented in later phases.',
    },
  });
}
