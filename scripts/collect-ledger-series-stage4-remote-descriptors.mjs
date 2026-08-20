import fs from 'node:fs'

const descriptors = [
  ['mag', 'https://mag.badjoke-lab.com/data/series/registry.json'],
  ['sog', 'https://www.stableorgone.com/data/series/registry.json'],
  ['cya', 'https://cya.badjoke-lab.com/data/series/registry.json'],
  ['bir', 'https://bir.badjoke-lab.com/data/series/registry.json'],
  ['wlr', 'https://wlr.badjoke-lab.com/data/series/registry.json'],
  ['ai-tools', 'https://ai-tools-history-archive.pages.dev/data/series/registry.json'],
  ['api-deprecation', 'https://api-deprecation-archive.pages.dev/data/series/registry.json'],
]

async function fetchJson(label, url) {
  const response = await fetch(`${url}?stage4_corrective=${Date.now()}-${label}`, {
    cache: 'no-store',
    headers: { 'user-agent': 'ledger-series-stage4-corrective-descriptor-collector' },
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(`${label} ${url} returned ${response.status}`)
  return response.json()
}

const output = []
for (const [label, url] of descriptors) {
  const raw = await fetchJson(label, url)
  output.push({ label, descriptor_url: url, raw })
}

const snapshot = { collected_at: new Date().toISOString(), descriptors: output }
fs.writeFileSync('stage4-remote-descriptors.json', `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
console.log('STAGE4_CORRECTIVE_DESCRIPTOR_SNAPSHOT_BEGIN')
console.log(JSON.stringify(snapshot, null, 2))
console.log('STAGE4_CORRECTIVE_DESCRIPTOR_SNAPSHOT_END')
