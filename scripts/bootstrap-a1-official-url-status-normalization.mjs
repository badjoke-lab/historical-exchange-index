import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const verifiedAt = '2026-06-19'

const mappings = [
  {
    id: 'hei_ex_000159',
    name: 'Coinbase Pro',
    from: 'redirected_or_retired',
    to: 'redirected',
    rationale: 'The original Pro URL redirects to Coinbase Advanced.',
    observed: 'https://pro.coinbase.com/ -> https://www.coinbase.com/advanced-trade/spot/BTC-USD',
  },
  {
    id: 'hei_ex_000268',
    name: 'LocalCryptos',
    from: 'partial',
    to: 'live_verified',
    rationale: 'The original domain remains reachable under the LocalCryptos identity; exchange trading is terminal, but URL reachability is a separate field.',
    observed: 'https://localcryptos.com/',
  },
  {
    id: 'hei_ex_000273',
    name: 'CoinGather',
    from: 'offline',
    to: 'dead_domain',
    rationale: 'The registered domain has no web server configured.',
    observed: 'https://www.coingather.com/',
  },
  {
    id: 'hei_ex_000275',
    name: 'BitMarket.eu',
    from: 'offline',
    to: 'repurposed',
    rationale: 'The original exchange domain now serves an unrelated Bitcoin magazine/blog.',
    observed: 'https://bitmarket.eu/',
  },
  {
    id: 'hei_ex_000277',
    name: 'Stocks.exchange',
    from: 'offline',
    to: 'unknown',
    rationale: 'The domain remains registered, but current first-party behavior could not be verified reliably enough to distinguish redirect, live continuity, or repurposing.',
    observed: 'https://stocks.exchange/',
  },
  {
    id: 'hei_ex_000278',
    name: 'SouthXchange',
    from: 'partial',
    to: 'live_unverified',
    rationale: 'Recent external checks report the original site online, but the first-party response could not be independently verified during this audit.',
    observed: 'https://www.southxchange.com/',
  },
  {
    id: 'hei_ex_000279',
    name: 'AEX',
    from: 'partial',
    to: 'repurposed',
    rationale: 'The original exchange domain now serves an A-Trust/AUSD creditor and asset-disposal page rather than exchange trading.',
    observed: 'https://www.aex.com/ -> https://aex.com/',
  },
  {
    id: 'hei_ex_000301',
    name: 'BCM Exchange',
    from: 'redirect_or_acquired',
    to: 'live_verified',
    rationale: 'The original BCM domain remains a first-party acquisition and account-migration notice that directs users to Kraken.',
    observed: 'https://www.bcmtoday.com/ -> https://www.bcmtoday.com/en',
  },
  {
    id: 'hei_ex_000302',
    name: 'BITBOX',
    from: 'rebranded',
    to: 'dead_domain',
    rationale: 'The original BITBOX domain remains registered but has no web server configured.',
    observed: 'https://www.bitbox.me/',
  },
  {
    id: 'hei_ex_000306',
    name: 'AlfaCashier',
    from: 'rebranded',
    to: 'redirected',
    rationale: 'The historical AlfaCashier identity was moved to the official Alfacash successor at alfa.cash.',
    observed: 'https://www.alfacashier.com/ -> https://www.alfa.cash/',
  },
  {
    id: 'hei_ex_000309',
    name: 'Bingbon',
    from: 'rebranded',
    to: 'redirected',
    rationale: 'Bingbon was replaced by BingX and the former domain is treated as a successor redirect rather than a service-state label.',
    observed: 'https://www.bingbon.com/ -> https://bingx.com/',
  },
  {
    id: 'hei_ex_000310',
    name: 'Anyswap',
    from: 'rebranded',
    to: 'live_unverified',
    rationale: 'The original Anyswap domain is still referenced for the legacy dashboard, but current first-party behavior was not fully verifiable.',
    observed: 'https://anyswap.exchange/',
  },
  {
    id: 'hei_ex_000313',
    name: 'CoinFLEX',
    from: 'dead_or_redirected',
    to: 'repurposed',
    rationale: 'The original domain now hosts an independent creditor initiative that explicitly states it is not operated by the CoinFLEX company.',
    observed: 'https://coinflex.com/',
  },
]

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function write(relativePath, content) {
  const target = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

function replaceRequired(content, before, after, label) {
  if (content.includes(after)) return content
  if (!content.includes(before)) throw new Error(`Could not find expected ${label}`)
  return content.replace(before, after)
}

const entitiesPath = 'data/entities.json'
const entities = JSON.parse(read(entitiesPath))
const entityById = new Map(entities.map((entity) => [entity.id, entity]))
for (const mapping of mappings) {
  const entity = entityById.get(mapping.id)
  if (!entity) throw new Error(`Missing A1 entity ${mapping.id} (${mapping.name})`)
  if (entity.canonical_name !== mapping.name && !entity.aliases?.includes(mapping.name)) {
    throw new Error(`Unexpected canonical identity for ${mapping.id}: ${entity.canonical_name}`)
  }
  if (entity.official_url_status === mapping.from) {
    entity.official_url_status = mapping.to
  } else if (entity.official_url_status !== mapping.to) {
    throw new Error(
      `Unexpected official_url_status for ${mapping.id}: ${entity.official_url_status}; expected ${mapping.from} or ${mapping.to}`,
    )
  }
  entity.last_verified_at = verifiedAt
}
write(entitiesPath, `${JSON.stringify(entities, null, 2)}\n`)

const constantsPath = 'scripts/monitoring/core/constants.mjs'
let constants = read(constantsPath)
constants = constants.replace("  'partial',\n", '')
constants = constants.replace("  'offline',\n", '')
write(constantsPath, constants)

const enumAuditPath = 'scripts/audit-legacy-enums.mjs'
let enumAudit = read(enumAuditPath)
enumAudit = replaceRequired(
  enumAudit,
  "const root = process.cwd()\nconst events = JSON.parse",
  "const root = process.cwd()\nconst entities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'entities.json'), 'utf8'))\nconst events = JSON.parse",
  'entities dataset load',
)
enumAudit = replaceRequired(
  enumAudit,
  "const allowed = {\n  event_type:",
  "const allowed = {\n  official_url_status: new Set([\n    'live_verified', 'live_unverified', 'dead_domain', 'redirected',\n    'repurposed', 'unsafe', 'unknown',\n  ]),\n  event_type:",
  'official URL status allowlist',
)
enumAudit = replaceRequired(
  enumAudit,
  "const report = {\n  event_type:",
  "const report = {\n  official_url_status: summarize(entities, 'official_url_status'),\n  event_type:",
  'official URL status report',
)
write(enumAuditPath, enumAudit)

const packagePath = 'package.json'
const packageJson = JSON.parse(read(packagePath))
packageJson.scripts['data:check-official-url-statuses'] =
  'node scripts/audit-legacy-enums.mjs --scope=official_url_status --strict'
write(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)

const ciPath = '.github/workflows/ci.yml'
let ci = read(ciPath)
ci = replaceRequired(
  ci,
  "      - name: Validate canonical event types\n        run: npm run data:check-event-types\n\n      - name: Validate canonical evidence source types",
  "      - name: Validate canonical event types\n        run: npm run data:check-event-types\n\n      - name: Validate canonical official URL statuses\n        run: npm run data:check-official-url-statuses\n\n      - name: Validate canonical evidence source types",
  'CI official URL status step',
)
write(ciPath, ci)

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
let roadmap = read(roadmapPath)
roadmap = replaceRequired(
  roadmap,
  `Baseline date: 2026-06-18\nLast confirmed main SHA: 23c0ea46c05df2e2ef607effe157e6ce04569c04\nLast merged implementation PR: #391 Normalize legacy evidence claim scopes`,
  `Baseline date: 2026-06-19\nLast confirmed main SHA: cb3d80e4b5751537b7589d140821262a740bb491\nLast merged implementation PR: #393 Unify public HTML and machine-readable registry state`,
  'roadmap baseline checkpoint',
)
roadmap = replaceRequired(
  roadmap,
  `- machine-readable public layer and validation`,
  `- machine-readable public layer and validation\n- public HTML / JSON / metadata count unification and production-output consistency checks`,
  'completed consistency work',
)
roadmap = replaceRequired(
  roadmap,
  `Roadmap checkpoint: R0\nState: roadmap file being placed in the repository\nImplementation work after roadmap: A1 official_url_status normalization\nActive implementation branch after this PR: none assumed; create from current main`,
  `Roadmap checkpoint: A1\nState: official_url_status normalization in progress\nActive implementation branch: fix/a1-official-url-status-normalization-20260619\nInterrupt fix already merged: PR #393 / cb3d80e4b5751537b7589d140821262a740bb491`,
  'active work checkpoint',
)
roadmap = replaceRequired(
  roadmap,
  `Create the A1 branch from the then-current \`main\`, rerun the entity-quality audit, and normalize all invalid \`official_url_status\` values with record-specific decisions.`,
  `Complete A1 validation, merge the normalization PR, verify invalid \`official_url_status\` count remains zero, then begin A2 country-of-origin completion.`,
  'next action',
)
roadmap = replaceRequired(
  roadmap,
  `Status: **IN PROGRESS**\n\n---\n\n# Phase A — Structural entity-quality debt`,
  `Status: **COMPLETED**\n\n---\n\n# Phase A — Structural entity-quality debt`,
  'R0 completion status',
)
roadmap = replaceRequired(
  roadmap,
  `invalid official_url_status = 0\nno historical URL deleted merely because it is dead\nstrict validation enabled in CI\n\`\`\`\n\nStatus: **NEXT**`,
  `invalid official_url_status = 0\nno historical URL deleted merely because it is dead\nstrict validation enabled in CI\n\`\`\`\n\nStatus: **IN PROGRESS**`,
  'A1 status',
)
write(roadmapPath, roadmap)

const reportRows = mappings
  .map(
    (mapping) =>
      `| ${mapping.id} | ${mapping.name} | \`${mapping.from}\` | \`${mapping.to}\` | ${mapping.rationale} |`,
  )
  .join('\n')
const sourceRows = mappings
  .map((mapping) => `- **${mapping.name}:** ${mapping.observed}`)
  .join('\n')
const report = `# HEI A1 official URL status normalization audit\n\nAudit date: ${verifiedAt}  \nBranch: \`fix/a1-official-url-status-normalization-20260619\`  \nCanonical input: \`data/entities.json\`\n\n## Purpose\n\nNormalize the 13 legacy \`official_url_status\` values to the fixed seven-value enum without deleting historical original URLs or archive references. Service state remains represented by \`status\` / \`death_reason\`; this field describes the current handling of the stored original URL.\n\n## Fixed enum\n\n- \`live_verified\`\n- \`live_unverified\`\n- \`dead_domain\`\n- \`redirected\`\n- \`repurposed\`\n- \`unsafe\`\n- \`unknown\`\n\n## Record decisions\n\n| Entity ID | Record | Previous | Normalized | Decision basis |\n| --- | --- | --- | --- | --- |\n${reportRows}\n\n## Observed URLs and targets\n\n${sourceRows}\n\n## Safety notes\n\n- No \`official_url_original\` value was removed or replaced.\n- No \`archived_url\` value was removed or replaced.\n- Ambiguous current behavior is represented as \`unknown\` or \`live_unverified\`, not guessed as \`dead_domain\`.\n- \`last_verified_at\` is updated to ${verifiedAt} for the 13 audited records.\n- The CI allowlist intentionally excludes the legacy convenience values \`partial\`, \`offline\`, \`rebranded\`, \`redirected_or_retired\`, \`redirect_or_acquired\`, and \`dead_or_redirected\`.\n\n## Completion checks\n\n- invalid \`official_url_status\`: expected 0\n- canonical entity count: unchanged\n- historical original URLs: preserved\n- archive references: preserved\n- strict CI command: \`npm run data:check-official-url-statuses\`\n`
write('docs/audits/HEI_A1_OFFICIAL_URL_STATUS_AUDIT_2026-06-19.md', report)

console.log(`Normalized ${mappings.length} official_url_status records.`)
