const origin = (process.env.HEI_PUBLIC_ORIGIN || 'https://hei.badjoke-lab.com').replace(/\/$/, '')
const expectedCommit = process.env.EXPECTED_COMMIT?.trim() || null
const maxAttempts = Number(process.env.SMOKE_MAX_ATTEMPTS || 12)
const retryDelayMs = Number(process.env.SMOKE_RETRY_DELAY_MS || 30000)

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson(path, cacheKey) {
  const response = await fetch(`${origin}${path}?hei_stats_smoke=${encodeURIComponent(cacheKey)}`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache', 'user-agent': 'HEI stats production checker' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })
  assert(response.ok, `${path} returned HTTP ${response.status}`)
  const contentType = (response.headers.get('content-type') || '').toLowerCase()
  assert(contentType.includes('application/json'), `${path} returned unexpected content-type: ${contentType}`)
  return response.json()
}

async function verifyProduction() {
  const cacheKey = expectedCommit || Date.now().toString()
  const [version, manifest, stats, history] = await Promise.all([
    fetchJson('/version.json', cacheKey),
    fetchJson('/data/manifest.json', cacheKey),
    fetchJson('/stats.json', cacheKey),
    fetchJson('/stats-history.json', cacheKey),
  ])

  if (expectedCommit) assert(version.build?.commit === expectedCommit, `deployment is not current: expected ${expectedCommit}, got ${version.build?.commit}`)
  const expectedDiscovery = {
    snapshot: '/stats.json',
    history: '/stats-history.json',
    canonical_only: true,
    source: 'reviewed_entity_event_evidence_aggregation',
  }
  assert(JSON.stringify(version.stats) === JSON.stringify(expectedDiscovery), 'version stats discovery mismatch')
  assert(JSON.stringify(manifest.stats) === JSON.stringify(expectedDiscovery), 'manifest stats discovery mismatch')

  const counts = version.data?.record_counts
  assert(stats.totals?.total_entities === counts?.primary_records, 'production stats entity count mismatch')
  assert(stats.totals?.total_events === counts?.events, 'production stats event count mismatch')
  assert(stats.totals?.total_evidence === counts?.evidence, 'production stats evidence count mismatch')
  assert(stats.totals?.dead_side_total === version.data?.record_count_breakdown?.dead_side, 'production stats dead-side count mismatch')
  assert(stats.totals?.active_side_total === version.data?.record_count_breakdown?.active_side, 'production stats active-side count mismatch')
  assert(!Number.isNaN(Date.parse(stats.generated_at)), 'production stats generated_at invalid')

  assert(Array.isArray(history.snapshots) && history.snapshots.length >= 1, 'production stats history has no snapshots')
  const latest = history.snapshots.at(-1)
  assert(latest.total_entities === counts.primary_records, 'production stats history entity count mismatch')
  assert(latest.total_events === counts.events, 'production stats history event count mismatch')
  assert(latest.total_evidence === counts.evidence, 'production stats history evidence count mismatch')
  assert(Array.isArray(history.launch_year_counts), 'production launch_year_counts missing')
  assert(Array.isArray(history.death_year_counts), 'production death_year_counts missing')

  const serialized = `${JSON.stringify(stats)}\n${JSON.stringify(history)}`
  for (const forbidden of ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']) {
    assert(!serialized.includes(forbidden), `production stats leaked forbidden marker: ${forbidden}`)
  }

  console.log(`Production stats verified at ${origin}`)
  console.log(`commit=${version.build?.commit}, entities=${counts.primary_records}, snapshots=${history.snapshots.length}`)
}

let lastError
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    console.log(`Stats production verification attempt ${attempt}/${maxAttempts}`)
    await verifyProduction()
    process.exit(0)
  } catch (error) {
    lastError = error
    console.error(error instanceof Error ? error.message : error)
    if (attempt < maxAttempts) await sleep(retryDelayMs)
  }
}

throw lastError
