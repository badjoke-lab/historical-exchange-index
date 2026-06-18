import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content)
}

function replaceRequired(content, before, after, label) {
  if (content.includes(after)) return content
  if (!content.includes(before)) throw new Error(`Could not find expected ${label}`)
  return content.replace(before, after)
}

const entitiesPath = 'data/entities.json'
const entities = JSON.parse(read(entitiesPath))
const byId = new Map(entities.map((entity) => [entity.id, entity]))

const localCryptos = byId.get('hei_ex_000268')
if (!localCryptos) throw new Error('Missing LocalCryptos entity')
localCryptos.notes = replaceRequired(
  localCryptos.notes,
  'The website and wallet interface may remain available, so official_url_status is partial rather than offline.',
  'The original domain remains reachable under the LocalCryptos identity, so official_url_status is live_verified even though new trade creation is disabled.',
  'LocalCryptos legacy URL note',
)

const southXchange = byId.get('hei_ex_000278')
if (!southXchange) throw new Error('Missing SouthXchange entity')
southXchange.notes = replaceRequired(
  southXchange.notes,
  'The site may remain reachable for notice / withdrawal context, so official_url_status is partial rather than offline.',
  'The original domain may remain reachable for notice or withdrawal context; current first-party behavior could not be fully verified, so official_url_status is live_unverified.',
  'SouthXchange legacy URL note',
)

write(entitiesPath, `${JSON.stringify(entities, null, 2)}\n`)

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
let roadmap = read(roadmapPath)
roadmap = replaceRequired(
  roadmap,
  `Roadmap checkpoint: A1\nState: official_url_status normalization in progress\nActive implementation branch: fix/a1-official-url-status-normalization-20260619\nInterrupt fix already merged: PR #393 / cb3d80e4b5751537b7589d140821262a740bb491`,
  `Roadmap checkpoint: A1 complete / A2 next\nState: A1 implementation completed in PR #394\nNext implementation item: A2 fill missing country_or_origin\nInterrupt fix baseline: PR #393 / cb3d80e4b5751537b7589d140821262a740bb491`,
  'roadmap active checkpoint',
)
roadmap = replaceRequired(
  roadmap,
  `Complete A1 validation, merge the normalization PR, verify invalid \`official_url_status\` count remains zero, then begin A2 country-of-origin completion.`,
  `Begin A2 country-of-origin completion from the post-PR #394 main branch, preserving the fixed official URL status enum and strict CI gate.`,
  'roadmap next action',
)
roadmap = replaceRequired(
  roadmap,
  `Status: **IN PROGRESS**\n\n## A2. Fill missing \`country_or_origin\``,
  `Status: **COMPLETED**\n\n## A2. Fill missing \`country_or_origin\``,
  'A1 completion status',
)
write(roadmapPath, roadmap)

const auditPath = 'docs/audits/HEI_A1_OFFICIAL_URL_STATUS_AUDIT_2026-06-19.md'
let audit = read(auditPath)
audit = replaceRequired(
  audit,
  '- invalid `official_url_status`: expected 0',
  '- invalid `official_url_status`: observed 0',
  'audit completion result',
)
audit = replaceRequired(
  audit,
  '- strict CI command: `npm run data:check-official-url-statuses`',
  '- strict CI command: `npm run data:check-official-url-statuses`\n- reviewed public counts remain 412 entities / 687 events / 1594 evidence',
  'audit count result',
)
write(auditPath, audit)

console.log('Finalized A1 notes, audit results, and roadmap checkpoint.')
