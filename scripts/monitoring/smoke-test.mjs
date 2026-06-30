import { MONITOR_NAMES } from './core/constants.mjs';
import { monitorRegistryNames, MONITOR_REGISTRY } from './core/monitor-registry.mjs';
import { loadCanonicalData } from './core/load-canonical-data.mjs';
import { createMonitorResult, runMonitorSafely } from './core/finding-utils.mjs';
import { buildSummaryMarkdown } from './core/summary-writer.mjs';
import { extractCandidateNameFromNews } from './core/news-extract.mjs';
import { normalizeSitemapUrl } from './adapters/sitemap-check.mjs';
import { runReviewedBundleAggregationRegression } from '../test-reviewed-bundle-aggregation.mjs';
import { buildRegistryMetrics, parseReviewMonth } from '../review/monthly-registry-core.mjs';
import { runMonthlyWatchlistBacklogRegression } from '../review/test-monthly-watchlist-core.mjs';
import { runMonthlyReviewBuilderRegression } from '../review/test-monthly-review-builder.mjs';
import { runMonthlyReviewIntegrationRegression } from '../review/test-monthly-review-integration.mjs';
import { runMonthlyReviewWorkflowRegression } from '../review/test-monthly-review-workflow.mjs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertSameSet(left, right, message) {
  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();
  assert(JSON.stringify(leftSorted) === JSON.stringify(rightSorted), `${message}: left=${leftSorted.join(',')} right=${rightSorted.join(',')}`);
}

function validateMonitorResult(result, expectedName) {
  assert(result && typeof result === 'object', `${expectedName} did not return an object`);
  assert(result.monitor === expectedName, `${expectedName} returned monitor=${result.monitor}`);
  assert(['ok', 'degraded'].includes(result.status), `${expectedName} returned invalid status=${result.status}`);
  assert(typeof result.started_at === 'string' && result.started_at, `${expectedName} missing started_at`);
  assert(typeof result.finished_at === 'string' && result.finished_at, `${expectedName} missing finished_at`);
  assert(Array.isArray(result.findings), `${expectedName} findings must be an array`);
  assert(Array.isArray(result.candidates), `${expectedName} candidates must be an array`);
  assert(Array.isArray(result.errors), `${expectedName} errors must be an array`);
  assert(result.summary && typeof result.summary === 'object', `${expectedName} missing summary object`);
  assert(Number.isInteger(result.summary.findings_count), `${expectedName} summary.findings_count must be integer`);
  assert(Number.isInteger(result.summary.candidate_count), `${expectedName} summary.candidate_count must be integer`);
  assert(Number.isInteger(result.summary.errors_count), `${expectedName} summary.errors_count must be integer`);
}

function runMonitoringOutputRegressions() {
  assert(
    normalizeSitemapUrl('https://hei.badjoke-lab.com/dead/') === normalizeSitemapUrl('https://hei.badjoke-lab.com/dead'),
    'sitemap URL comparison must ignore a non-root trailing slash',
  );
  assert(
    normalizeSitemapUrl('https://hei.badjoke-lab.com/') === 'https://hei.badjoke-lab.com/',
    'sitemap root URL must retain its slash',
  );

  const extractedName = extractCandidateNameFromNews({
    title: 'Oxium Shuts Down as Revenue Collapse Forces DEX Closure',
    snippet: 'The Sei ecosystem exchange will close its interface.',
  });
  assert(extractedName === 'Oxium', `news extraction must identify Oxium instead of a headline fragment: ${extractedName}`);

  const summary = buildSummaryMarkdown({
    runId: '20260630-smoke',
    mode: 'smoke',
    startedAt: '2026-06-30T00:00:00.000Z',
    finishedAt: '2026-06-30T00:00:01.000Z',
    hasMeaningfulFindings: false,
    results: [
      {
        monitor: 'monitoring-health-watch',
        findings: [],
        candidates: [],
        watchlist_state: {
          candidate_queue_files: 2,
          raw_candidate_occurrences: 12,
          unique_candidate_identities: 9,
          repeated_occurrences_collapsed: 3,
          watchlist_class_counts: { A: 1, B: 7, C: 1 },
          manual_staging_packages: 4,
          historical_resolution_files: 5,
          resolution_index_entries: 6,
          resolution_coverage_errors: 0,
        },
      },
    ],
  });

  assert(!summary.includes('undefined'), 'monitoring summary must not render undefined watchlist values');
  assert(summary.includes('candidate_queue_files: 2'), 'monitoring summary must use the current watchlist state schema');
  assert(summary.includes('unique_candidate_identities: 9'), 'monitoring summary must report deduplicated candidate identities');
}

async function main() {
  assertSameSet(MONITOR_NAMES, monitorRegistryNames(), 'MONITOR_NAMES and MONITOR_REGISTRY are out of sync');

  const canonicalData = await loadCanonicalData();
  assert(Array.isArray(canonicalData.entities), 'entities must load as array');
  assert(Array.isArray(canonicalData.events), 'events must load as array');
  assert(Array.isArray(canonicalData.evidence), 'evidence must load as array');

  const context = {
    runId: 'smoke-test',
    mode: 'smoke',
    canonicalData,
  };

  for (const [name, fn] of MONITOR_REGISTRY) {
    const result = await runMonitorSafely(name, fn, context);
    validateMonitorResult(result, name);
  }

  const synthetic = createMonitorResult({
    monitor: 'smoke-synthetic',
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
  });
  validateMonitorResult(synthetic, 'smoke-synthetic');

  runMonitoringOutputRegressions();
  runReviewedBundleAggregationRegression();
  runMonthlyWatchlistBacklogRegression();
  runMonthlyReviewBuilderRegression();
  await runMonthlyReviewIntegrationRegression();
  runMonthlyReviewWorkflowRegression();

  const reviewMonth = parseReviewMonth('2026-05');
  const monthlyMetrics = buildRegistryMetrics(canonicalData, reviewMonth);
  assert(reviewMonth.previous_month === '2026-04', 'monthly review previous month is incorrect');
  assert(monthlyMetrics.counts.entities === canonicalData.entities.length, 'monthly entity count mismatch');
  assert(monthlyMetrics.counts.events === canonicalData.events.length, 'monthly event count mismatch');
  assert(monthlyMetrics.counts.evidence === canonicalData.evidence.length, 'monthly evidence count mismatch');

  console.log('HEI monitoring smoke test passed.');
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
