import { MONITOR_NAMES } from './core/constants.mjs';
import { monitorRegistryNames, MONITOR_REGISTRY } from './core/monitor-registry.mjs';
import { loadCanonicalData } from './core/load-canonical-data.mjs';
import { createMonitorResult, runMonitorSafely } from './core/finding-utils.mjs';

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

  console.log('HEI monitoring smoke test passed.');
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
