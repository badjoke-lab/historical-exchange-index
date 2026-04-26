import { createMonitorResult } from '../core/finding-utils.mjs';

export async function runSiteAndSeoWatch(context, { startedAt } = {}) {
  const started_at = startedAt || new Date().toISOString();
  return createMonitorResult({
    monitor: 'site-and-seo-watch',
    started_at,
    finished_at: new Date().toISOString(),
    findings: [],
    candidates: [],
    errors: [],
    extra: {
      note: 'Skeleton monitor. Site route, sitemap, robots, and metadata checks are implemented in later phases.',
    },
  });
}
