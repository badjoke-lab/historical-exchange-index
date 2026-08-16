import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const versionPath = path.join(publicDir, 'version.json')
const manifestPath = path.join(publicDir, 'data', 'manifest.json')
const llmsPath = path.join(publicDir, 'llms.txt')
const aiPath = path.join(publicDir, 'ai.txt')

function assertFile(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`stats discovery requires ${path.relative(root, filePath)}`)
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function appendOnce(filePath, marker, block) {
  const current = fs.readFileSync(filePath, 'utf8').trimEnd()
  if (current.includes(marker)) return
  fs.writeFileSync(filePath, `${current}\n\n${block.trim()}\n`, 'utf8')
}

for (const filePath of [versionPath, manifestPath, llmsPath, aiPath]) assertFile(filePath)

const discovery = {
  snapshot: '/stats.json',
  history: '/stats-history.json',
  canonical_only: true,
  source: 'reviewed_entity_event_evidence_aggregation',
}

const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'))
version.stats = discovery
writeJson(versionPath, version)

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
manifest.stats = discovery
writeJson(manifestPath, manifest)

appendOnce(llmsPath, '/stats-history.json', `## Registry statistics
- Current deterministic snapshot: /stats.json
- Deterministic history/trend input: /stats-history.json
- Both outputs are derived from reviewed entity/event/evidence data and do not add fields to canonical records.`)

appendOnce(aiPath, '/stats-history.json', `Registry statistics:
/stats.json
/stats-history.json
These deterministic aggregate files are derived from reviewed entity/event/evidence data only.`)

console.log('Registered HEI stats machine-readable endpoints.')
