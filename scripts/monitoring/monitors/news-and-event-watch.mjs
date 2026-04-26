import { createMonitorResult } from '../core/finding-utils.mjs';

export async function runNewsAndEventWatch(context, { startedAt } = {}) {
  const started_at = startedAt || new Date().toISOString();
  return createMonitorResult({
    monitor: 'news-and-event-watch',
    started_at,
    finished_at: new Date().toISOString(),
    findings: [],
    candidates: [],
    errors: [],
    extra: {
      note: 'Skeleton monitor. News/RSS, regulatory, incident, suspension, and continuity detection are implemented in later phases.',
    },
  });
}
