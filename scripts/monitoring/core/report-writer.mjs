import path from 'node:path';
import { OUTPUT_ROOT, MONITOR_NAMES } from './constants.mjs';
import { ensureDir, writeJsonFile, writeTextFile } from './fs-utils.mjs';

function pad(value) {
  return String(value).padStart(2, '0');
}

export function createRunId(date = new Date()) {
  const yyyy = date.getUTCFullYear();
  const mm = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const min = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

export function getRunDate(runId) {
  return runId.slice(0, 8);
}

export function getRunDir(runId) {
  return path.join(OUTPUT_ROOT, getRunDate(runId));
}

export async function createRunDir(runId) {
  const runDir = getRunDir(runId);
  await ensureDir(runDir);
  return runDir;
}

export async function writeJsonReport(runDir, name, data) {
  const filePath = path.join(runDir, `${name}.json`);
  await writeJsonFile(filePath, data);
  return filePath;
}

export async function writeSummary(runDir, markdown) {
  const filePath = path.join(runDir, 'summary.md');
  await writeTextFile(filePath, markdown);
  return filePath;
}

export function buildManifest({ runId, mode, startedAt, finishedAt, results, canonicalGuard }) {
  const monitorEntries = MONITOR_NAMES.map((name) => {
    const result = results.find((item) => item.monitor === name);
    return {
      name,
      status: result?.status || 'not_run',
      findings_count: result?.summary?.findings_count || 0,
      candidate_count: result?.summary?.candidate_count || 0,
      errors_count: result?.summary?.errors_count || 0,
    };
  });

  return {
    run_id: runId,
    created_at: finishedAt,
    started_at: startedAt,
    finished_at: finishedAt,
    mode,
    monitors: monitorEntries,
    canonical_guard: canonicalGuard || {
      canonical_files_modified: false,
      modified_paths: [],
    },
  };
}

export async function writeAllReports({ runId, mode, startedAt, finishedAt, results, summaryMarkdown, canonicalGuard }) {
  const runDir = await createRunDir(runId);

  for (const result of results) {
    await writeJsonReport(runDir, result.monitor, result);
  }

  const manifest = buildManifest({ runId, mode, startedAt, finishedAt, results, canonicalGuard });
  await writeJsonReport(runDir, 'manifest', manifest);
  await writeSummary(runDir, summaryMarkdown);

  return {
    runDir,
    manifest,
  };
}
