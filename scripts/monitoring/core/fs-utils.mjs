import { mkdir, readFile, writeFile, access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonFile(filePath, fallback = null) {
  if (!(await pathExists(filePath))) {
    return fallback;
  }

  const raw = await readFile(filePath, 'utf8');
  if (!raw.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const wrapped = new Error(`Failed to parse JSON file: ${filePath}: ${error.message}`);
    wrapped.cause = error;
    throw wrapped;
  }
}

export async function writeJsonFile(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function writeTextFile(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, value.endsWith('\n') ? value : `${value}\n`, 'utf8');
}

export async function listJsonFiles(dirPath) {
  if (!(await pathExists(dirPath))) {
    return [];
  }

  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listJsonFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

export async function safeStat(filePath) {
  try {
    return await stat(filePath);
  } catch {
    return null;
  }
}
