import { monitoringConfig } from './config.mjs';
import { loadCanonicalData } from './core/load-canonical-data.mjs';
import { assertCanonicalUnchanged, checkCanonicalGuard } from './core/guard-canonical.mjs';
import { createRunId, writeAllReports } from './core/report-writer.mjs';
import { buildSummaryMarkdown } from './core/summary-writer.mjs';
import { hasMeaningfulFindings, runMonitorSafely } from './core/finding-utils.mjs';
import { runCandidateDiscovery } from './monitors/candidate-discovery.mjs';
import { runNewsAndEventWatch } from './monitors/news-and-event-watch.mjs';
import { runActiveStatusWatch } from './monitors/active-status-watch.mjs';
import { runEvidenceAndRecordQualityWatch } from './monitors/evidence-and-record-quality-watch.mjs';
import { runEvidenceHealthWatch } from './monitors/evidence-health-watch.mjs';
import { runSiteAndSeoWatch } from './monitors/site-and-seo-watch.mjs';
import { runMonitoringHealthWatch } from './monitors/monitoring-health-watch.mjs';

const monitorFns = [
  ['candidate-discovery', runCandidateDiscovery],
  ['news-and-event-watch', runNewsAndEventWatch],
  ['active-status-watch', runActiveStatusWatch],
  ['evidence-and-record-quality-watch', runEvidenceAndRecordQualityWatch],
  ['evidence-health-watch', runEvidenceHealthWatch],
  ['site-and-seo-watch', runSiteAndSeoWatch],
  ['monitoring-health-watch', runMonitoringHealthWatch],
];

async function main() {
  const runId = process.env.HEI_MONITORING_RUN_ID || createRunId();
  const startedAt = new Date().toISOString();
  const canonicalData = await loadCanonicalData();
  const context = {
    runId,
    mode: monitoringConfig.mode,
    canonicalData,
  };

  const results = [];
  for (const [name, fn] of monitorFns) {
    results.push(await runMonitorSafely(name, fn, context));
  }

  const meaningfulFindings = hasMeaningfulFindings(results);
  const finishedAt = new Date().toISOString();
  const preWriteGuard = await checkCanonicalGuard();

  const summaryMarkdown = buildSummaryMarkdown({
    runId,
    mode: monitoringConfig.mode,
    startedAt,
    finishedAt,
    results,
    hasMeaningfulFindings: meaningfulFindings,
  });

  const { runDir } = await writeAllReports({
    runId,
    mode: monitoringConfig.mode,
    startedAt,
    finishedAt,
    results,
    summaryMarkdown,
    canonicalGuard: preWriteGuard,
  });

  if (monitoringConfig.shouldFailOnCanonicalChange) {
    await assertCanonicalUnchanged();
  }

  console.log(`HEI monitoring run complete: ${runId}`);
  console.log(`Reports written to: ${runDir}`);
  console.log(`Meaningful findings: ${meaningfulFindings ? 'yes' : 'no'}`);
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
