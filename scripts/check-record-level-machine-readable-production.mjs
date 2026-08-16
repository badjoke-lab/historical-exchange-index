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
  const separator = path.includes('?') ? '&' : '?'
  const response = await fetch(`${origin}${path}${separator}hei_record_smoke=${encodeURIComponent(cacheKey)}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'HEI record-level production smoke checker',
      'cache-control': 'no-cache',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })
  assert(response.ok, `${path} returned HTTP ${response.status}`)
  const contentType = (response.headers.get('content-type') || '').toLowerCase()
  assert(contentType.includes('application/json'), `${path} returned unexpected content-type: ${contentType}`)
  return response.json()
}

function verifyRecord(record, expected) {
  assert(record.schema_version === '1.0.0', `${expected.slug} schema_version mismatch`)
  assert(record.data_schema_version === 'hei_entity_event_evidence_v1', `${expected.slug} data_schema_version mismatch`)
  assert(record.project_id === 'historical-exchange-index', `${expected.slug} project_id mismatch`)
  assert(record.record_type === 'exchange_record_bundle', `${expected.slug} record_type mismatch`)
  assert(record.canonical_only === true, `${expected.slug} canonical_only mismatch`)
  assert(record.canonical_origin === origin, `${expected.slug} canonical_origin mismatch`)
  assert(record.entity?.id === expected.id, `${expected.slug} entity id mismatch`)
  assert(record.entity?.slug === expected.slug, `${expected.slug} entity slug mismatch`)
  assert(record.entity?.record_type === 'exchange_entity', `${expected.slug} entity record_type mismatch`)
  assert(record.canonical_page_url === `${origin}/exchange/${expected.slug}/`, `${expected.slug} canonical page mismatch`)
  assert(record.record_json_url === `${origin}/data/exchanges/${expected.slug}.json`, `${expected.slug} record URL mismatch`)
  assert(record.counts?.events === record.events?.length, `${expected.slug} event count mismatch`)
  assert(record.counts?.evidence === record.evidence?.length, `${expected.slug} evidence count mismatch`)

  const evidenceIds = new Set((record.evidence || []).map((item) => item.id))
  assert((record.events || []).every((event) => event.exchange_id === expected.id && event.exchange_slug === expected.slug), `${expected.slug} event ownership mismatch`)
  assert((record.evidence || []).every((item) => item.exchange_id === expected.id && item.exchange_slug === expected.slug), `${expected.slug} evidence ownership mismatch`)
  for (const event of record.events || []) {
    assert(Array.isArray(event.evidence_ids), `${expected.slug} event evidence_ids missing: ${event.id}`)
    assert(event.evidence_ids.every((id) => evidenceIds.has(id)), `${expected.slug} event references unknown evidence: ${event.id}`)
  }

  const serialized = JSON.stringify(record)
  for (const forbidden of ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']) {
    assert(!serialized.includes(forbidden), `${expected.slug} leaked forbidden marker: ${forbidden}`)
  }
}

async function verifyProduction() {
  const cacheKey = expectedCommit || Date.now().toString()
  const [version, manifest, index] = await Promise.all([
    fetchJson('/version.json', cacheKey),
    fetchJson('/data/manifest.json', cacheKey),
    fetchJson('/data/exchanges/index.json', cacheKey),
  ])

  if (expectedCommit) {
    assert(version.build?.commit === expectedCommit, `deployment is not current: expected ${expectedCommit}, received ${version.build?.commit}`)
  }

  const expectedCount = version.data?.record_counts?.primary_records
  assert(Number.isInteger(expectedCount) && expectedCount > 0, 'version primary record count is invalid')
  const expectedDiscovery = {
    index: '/data/exchanges/index.json',
    record_url_template: '/data/exchanges/{slug}.json',
    record_count: expectedCount,
    canonical_only: true,
  }
  assert(JSON.stringify(version.record_level) === JSON.stringify(expectedDiscovery), 'version record_level discovery mismatch')
  assert(JSON.stringify(manifest.record_level) === JSON.stringify(expectedDiscovery), 'manifest record_level discovery mismatch')

  assert(index.schema_version === '1.0.0', 'record index schema_version mismatch')
  assert(index.data_schema_version === 'hei_entity_event_evidence_v1', 'record index data_schema_version mismatch')
  assert(index.project_id === 'historical-exchange-index', 'record index project_id mismatch')
  assert(index.record_type === 'exchange_record_bundle_index', 'record index record_type mismatch')
  assert(index.canonical_only === true, 'record index canonical_only mismatch')
  assert(index.canonical_origin === origin, 'record index canonical_origin mismatch')
  assert(index.generated_at === version.build?.generated_at, 'record index generated_at mismatch')
  assert(index.record_count === expectedCount, 'record index count mismatch')
  assert(index.records?.length === expectedCount, 'record index records length mismatch')
  assert(index.record_url_template === `${origin}/data/exchanges/{slug}.json`, 'record index URL template mismatch')

  const representatives = [
    { slug: 'htx', id: 'hei_ex_000019' },
    { slug: 'btcbox', id: 'hei_ex_000602' },
    { slug: 'bitradex', id: 'hei_ex_001150' },
  ]
  for (const representative of representatives) {
    const indexItem = index.records.find((item) => item.id === representative.id)
    assert(indexItem?.slug === representative.slug, `record index missing ${representative.slug}`)
    const record = await fetchJson(`/data/exchanges/${representative.slug}.json`, cacheKey)
    assert(record.generated_at === version.build?.generated_at, `${representative.slug} generated_at mismatch`)
    verifyRecord(record, representative)
  }

  console.log(`Production record-level machine-readable layer verified at ${origin}`)
  console.log(`commit=${version.build?.commit}, records=${expectedCount}`)
}

let lastError
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    console.log(`Record-level production verification attempt ${attempt}/${maxAttempts}`)
    await verifyProduction()
    process.exit(0)
  } catch (error) {
    lastError = error
    console.error(error instanceof Error ? error.message : error)
    if (attempt < maxAttempts) await sleep(retryDelayMs)
  }
}

throw lastError
