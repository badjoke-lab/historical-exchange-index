import { runCandidateDiscovery } from '../monitors/candidate-discovery.mjs';
import { runNewsAndEventWatch } from '../monitors/news-and-event-watch.mjs';
import { runActiveStatusWatch } from '../monitors/active-status-watch.mjs';
import { runEvidenceAndRecordQualityWatch } from '../monitors/evidence-and-record-quality-watch.mjs';
import { runEvidenceHealthWatch } from '../monitors/evidence-health-watch.mjs';
import { runSiteAndSeoWatch } from '../monitors/site-and-seo-watch.mjs';
import { runMonitoringHealthWatch } from '../monitors/monitoring-health-watch.mjs';

export const MONITOR_REGISTRY = [
  ['candidate-discovery', runCandidateDiscovery],
  ['news-and-event-watch', runNewsAndEventWatch],
  ['active-status-watch', runActiveStatusWatch],
  ['evidence-and-record-quality-watch', runEvidenceAndRecordQualityWatch],
  ['evidence-health-watch', runEvidenceHealthWatch],
  ['site-and-seo-watch', runSiteAndSeoWatch],
  ['monitoring-health-watch', runMonitoringHealthWatch],
];

export function monitorRegistryNames() {
  return MONITOR_REGISTRY.map(([name]) => name);
}
