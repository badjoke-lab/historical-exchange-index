import fs from 'node:fs'

const files = [
  '.github/workflows/audit-official-url-status.yml',
  '.github/workflows/audit-url-probe.yml',
  '.github/workflows/run-a1-migration.yml',
  'scripts/migrate-official-url-status.mjs',
  'scripts/probe-official-urls.mjs',
  'scripts/update-roadmap-a1.mjs',
  'data-staging/audits/invalid-official-url-status.json',
  'data-staging/audits/official-url-http-probes.json',
]

for (const file of files) {
  if (fs.existsSync(file)) fs.rmSync(file)
}

console.log(`Removed ${files.length} temporary A1 files.`)
