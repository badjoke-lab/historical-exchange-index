import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { CANONICAL_PATHS } from './constants.mjs';

const execFileAsync = promisify(execFile);

export async function getModifiedPaths() {
  const { stdout } = await execFileAsync('git', ['status', '--porcelain']);
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .map((line) => line.replace(/^"|"$/g, ''));
}

export async function checkCanonicalGuard() {
  const modifiedPaths = await getModifiedPaths();
  const canonicalModified = modifiedPaths.filter((filePath) => CANONICAL_PATHS.includes(filePath));

  return {
    canonical_files_modified: canonicalModified.length > 0,
    modified_paths: canonicalModified,
  };
}

export async function assertCanonicalUnchanged() {
  const result = await checkCanonicalGuard();
  if (result.canonical_files_modified) {
    throw new Error(`Monitoring run modified canonical data files: ${result.modified_paths.join(', ')}`);
  }
  return result;
}
