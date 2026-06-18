import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const filePath = path.join(root, 'data', 'entities.json')
const entities = JSON.parse(fs.readFileSync(filePath, 'utf8'))

const decisions = new Map([
  ['hei_ex_000159', {
    expected: 'redirected_or_retired',
    status: 'redirected',
    note: 'The original Coinbase Pro URL now redirects to Coinbase Advanced Trade.',
  }],
  ['hei_ex_000268', {
    expected: 'partial',
    status: 'repurposed',
    note: 'The original domain is retained for non-trading wallet or publication functions rather than an active exchange marketplace.',
  }],
  ['hei_ex_000273', {
    expected: 'offline',
    status: 'dead_domain',
    note: 'The original domain did not return a usable exchange service during the bounded URL audit; archived access is preferred.',
  }],
  ['hei_ex_000275', {
    expected: 'offline',
    status: 'repurposed',
    note: 'The original domain now serves a Bitcoin magazine rather than the former exchange.',
  }],
  ['hei_ex_000277', {
    expected: 'offline',
    status: 'dead_domain',
    note: 'The original domain did not return a usable exchange service during the bounded URL audit; archived access is preferred.',
  }],
  ['hei_ex_000278', {
    expected: 'partial',
    status: 'dead_domain',
    note: 'The wind-down period has ended and the original domain did not return a usable service during the bounded URL audit.',
  }],
  ['hei_ex_000279', {
    expected: 'partial',
    status: 'repurposed',
    note: 'The original domain now serves A-Trust creditor and AUSD recovery information rather than the former exchange.',
  }],
  ['hei_ex_000301', {
    expected: 'redirect_or_acquired',
    status: 'repurposed',
    note: 'The original domain now serves a post-acquisition migration page directing former BCM users to Kraken.',
  }],
  ['hei_ex_000302', {
    expected: 'rebranded',
    status: 'dead_domain',
    note: 'The original BITBOX domain did not return a usable service during the bounded URL audit; the successor relationship remains recorded separately.',
  }],
  ['hei_ex_000306', {
    expected: 'rebranded',
    status: 'redirected',
    note: 'The original ALFAcashier URL redirects to the successor alfa.cash service.',
  }],
  ['hei_ex_000309', {
    expected: 'rebranded',
    status: 'dead_domain',
    note: 'The original Bingbon domain did not return a usable service during the bounded URL audit; the BingX successor relationship remains recorded separately.',
  }],
  ['hei_ex_000310', {
    expected: 'rebranded',
    status: 'live_unverified',
    note: 'The original Anyswap domain still responds but the bounded audit could not verify a current maintained exchange surface.',
  }],
  ['hei_ex_000313', {
    expected: 'dead_or_redirected',
    status: 'repurposed',
    note: 'The original CoinFLEX domain now serves creditor recovery and court-information content rather than the former exchange.',
  }],
])

const seen = new Set()
for (const entity of entities) {
  const decision = decisions.get(entity.id)
  if (!decision) continue
  if (entity.official_url_status !== decision.expected) {
    throw new Error(`${entity.id}: expected ${decision.expected}, found ${entity.official_url_status}`)
  }
  entity.official_url_status = decision.status
  entity.last_verified_at = '2026-06-18'
  entity.notes = entity.notes
    ? `${entity.notes} URL audit 2026-06-18: ${decision.note}`
    : `URL audit 2026-06-18: ${decision.note}`
  seen.add(entity.id)
}

if (seen.size !== decisions.size) {
  const missing = [...decisions.keys()].filter((id) => !seen.has(id))
  throw new Error(`Missing migration targets: ${missing.join(', ')}`)
}

fs.writeFileSync(filePath, `${JSON.stringify(entities, null, 2)}\n`, 'utf8')
console.log(`Normalized ${seen.size} official_url_status values.`)
