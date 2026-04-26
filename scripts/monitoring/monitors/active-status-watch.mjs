import { createMonitorResult } from '../core/finding-utils.mjs';

export async function runActiveStatusWatch(context, { startedAt } = {}) {
  const started_at = startedAt || new Date().toISOString();
  return createMonitorResult({
    monitor: 'active-status-watch',
    started_at,
    finished_at: new Date().toISOString(),
    findings: [],
    candidates: [],
    errors: [],
    extra: {
      note: 'Skeleton monitor. Official site/domain checks and active status-change candidates are implemented in later phases.',
    },
  });
}
