import { monitoringConfig } from './config.mjs';
import { loadCanonicalData } from './core/load-canonical-data.mjs';
import { assertCanonicalUnchanged, checkCanonicalGuard } from './core/guard-canonical.mjs';
import { createRunId, writeAllReports } from './core/report-writer.mjs';
import { buildSummaryMarkdown } from './core/summary-writer.mjs';
import { hasMeaningfulFindings, runMonitorSafely } from './core/finding-utils.mjs';
import { loadMonitoringState, applyNoiseControl, writeMonitoringState, writeGitHubOutput } from './core/state-store.mjs';
import { MONITOR_REGISTRY } from './core/monitor-registry.mjs';

async function main() {
  const runId = process.env.HEI_MONITORING_RUN_ID || createRunId();
  const startedAt = new Date().toISOString();
  const canonicalData = await loadCanonicalData();
  const context = {
    runId,
    mode: monitoringConfig.mode,
    canonicalData,
  };

  const rawResults = [];
  for (const [name, fn] of MONITOR_REGISTRY) {
    rawResults.push(await runMonitorSafely(name, fn, context));
  }

  const previousState = await loadMonitoringState();
  const finishedAt = new Date().toISOString();
  const noise = applyNoiseControl(rawResults, previousState, finishedAt);
  const results = noise.results;
  await writeMonitoringState(noise.state);

  const meaningfulFindings = hasMeaningfulFindings(results);
  const preWriteGuard = await checkCanonicalGuard();

  const summaryMarkdown = buildSummaryMarkdown({
    runId,
    mode: monitoringConfig.mode,
    startedAt,
    finishedAt,
    results,
    hasMeaningfulFindings: meaningfulFindings,
    noiseSummary: noise.summary,
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

  await writeGitHubOutput({
    meaningful_findings: meaningfulFindings ? 'true' : 'false',
    visible_findings: String(noise.summary.visible_count),
    suppressed_findings: String(noise.summary.suppressed_count),
  });

  if (monitoringConfig.shouldFailOnCanonicalChange) {
    await assertCanonicalUnchanged();
  }

  console.log(`HEI monitoring run complete: ${runId}`);
  console.log(`Reports written to: ${runDir}`);
  console.log(`Meaningful findings: ${meaningfulFindings ? 'yes' : 'no'}`);
  console.log(`Suppressed repeated low findings: ${noise.summary.suppressed_count}`);
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
