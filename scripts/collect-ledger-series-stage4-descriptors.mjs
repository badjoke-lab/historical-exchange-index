const descriptors = [
  ['hei', 'https://hei.badjoke-lab.com/data/series/registry.json'],
  ['mag', 'https://mag.badjoke-lab.com/data/series/registry.json'],
  ['sog', 'https://www.stableorgone.com/data/series/registry.json'],
  ['cya', 'https://cya.badjoke-lab.com/data/series/registry.json'],
  ['bir', 'https://bir.badjoke-lab.com/data/series/registry.json'],
  ['wlr', 'https://wlr.badjoke-lab.com/data/series/registry.json'],
  ['ai-tools', 'https://ai-tools-history-archive.pages.dev/data/series/registry.json'],
  ['api-deprecation', 'https://api-deprecation-archive.pages.dev/data/series/registry.json'],
]

async function fetchJson(label, url) {
  const response = await fetch(`${url}?stage4=${Date.now()}-${label}`, {
    cache: 'no-store',
    headers: { 'user-agent': 'ledger-series-stage4-descriptor-collector' },
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(`${label} ${url} returned ${response.status}`)
  return response.json()
}

function summarize(label, descriptorUrl, raw) {
  return {
    label,
    descriptor_url: descriptorUrl,
    top_level_keys: Object.keys(raw).sort(),
    raw,
  }
}

const output = []
for (const [label, url] of descriptors) {
  const raw = await fetchJson(label, url)
  output.push(summarize(label, url, raw))
}

console.log('STAGE4_DESCRIPTOR_SNAPSHOT_BEGIN')
console.log(JSON.stringify({ collected_at: new Date().toISOString(), descriptors: output }, null, 2))
console.log('STAGE4_DESCRIPTOR_SNAPSHOT_END')
