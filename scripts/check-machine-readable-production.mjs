const origin = (process.env.HEI_PUBLIC_ORIGIN || 'https://hei.badjoke-lab.com').replace(/\/$/, '')
const expectedCommit = process.env.EXPECTED_COMMIT?.trim() || null
const maxAttempts = Number(process.env.SMOKE_MAX_ATTEMPTS || 12)
const retryDelayMs = Number(process.env.SMOKE_RETRY_DELAY_MS || 30000)

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function deepEqual(actual, expected, message) {
  assert(stableStringify(actual) === stableStringify(expected), message)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchEndpoint(path, expectedContentType, cacheKey) {
  const separator = path.includes('?') ? '&' : '?'
  const url = `${origin}${path}${separator}hei_smoke=${encodeURIComponent(cacheKey)}`
  const response = await fetch(url, {
    headers: {
      accept: expectedContentType,
      'user-agent': 'HEI production smoke checker',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })

  assert(response.ok, `${path} returned HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  assert(contentType.toLowerCase().includes(expectedContentType), `${path} returned unexpected content-type: ${contentType}`)
  return response.text()
}

function assertPositiveInteger(value, label) {
  assert(Number.isInteger(value) && value > 0, `${label} must be a positive integer`)
}

async function verifyProduction() {
  const cacheKey = expectedCommit || Date.now().toString()
  const [versionText, manifestText, llms, ai] = await Promise.all([
    fetchEndpoint('/version.json', 'application/json', cacheKey),
    fetchEndpoint('/data/manifest.json', 'application/json', cacheKey),
    fetchEndpoint('/llms.txt', 'text/plain', cacheKey),
    fetchEndpoint('/ai.txt', 'text/plain', cacheKey),
  ])

  const version = JSON.parse(versionText)
  const manifest = JSON.parse(manifestText)

  assert(version.schema_version === '1.0.0', 'version schema_version is incorrect')
  assert(version.project_id === 'historical-exchange-index', 'version project_id is incorrect')
  assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry_family is incorrect')
  assert(version.registry_type === 'historical_crypto_exchange_registry', 'version registry_type is incorrect')
  assert(version.canonical_origin === origin, 'version canonical_origin is incorrect')
  assert(version.build?.verification_marker === 'hei_machine_readable_layer_v1', 'verification marker is incorrect')
  assert(version.build?.commit && version.build.commit !== 'unknown', 'deployed build commit is missing')
  assert(version.build?.branch === 'main', `deployed build branch is ${version.build?.branch}, expected main`)
  assert(!Number.isNaN(Date.parse(version.build?.generated_at)), 'version generated_at is invalid')

  if (expectedCommit) {
    assert(version.build.commit === expectedCommit, `deployment is not current: expected ${expectedCommit}, received ${version.build.commit}`)
  }

  const counts = version.data?.record_counts
  assertPositiveInteger(counts?.primary_records, 'primary_records')
  assertPositiveInteger(counts?.events, 'events')
  assertPositiveInteger(counts?.evidence, 'evidence')
  assert(version.data?.record_count_breakdown?.exchanges === counts.primary_records, 'exchange breakdown does not match primary count')
  assert(version.data?.record_count_breakdown?.active_side + version.data?.record_count_breakdown?.dead_side === counts.primary_records, 'active/dead totals do not match primary count')

  assert(manifest.schema_version === version.schema_version, 'manifest/version schema mismatch')
  assert(manifest.project_id === version.project_id, 'manifest/version project mismatch')
  assert(manifest.canonical_origin === version.canonical_origin, 'manifest/version origin mismatch')
  assert(manifest.registry_family === version.registry_family, 'manifest/version family mismatch')
  assert(manifest.registry_type === version.registry_type, 'manifest/version type mismatch')
  deepEqual(manifest.record_counts, counts, 'manifest/version record counts differ')
  deepEqual(manifest.record_count_breakdown, version.data.record_count_breakdown, 'manifest/version breakdowns differ')
  deepEqual(manifest.data_safety, {
    canonical_only: true,
    includes_unreviewed_candidates: false,
    includes_internal_monitoring: false,
    includes_private_notes: false,
  }, 'production safety flags are incorrect')
  deepEqual(manifest.public_files, {
    version: '/version.json',
    manifest: '/data/manifest.json',
    llms: '/llms.txt',
    ai: '/ai.txt',
  }, 'production public file map is incorrect')

  const requiredRoutes = ['/', '/dead/', '/active/', '/exchange/{slug}/', '/stats/', '/methodology/', '/about/', '/donate/']
  for (const route of requiredRoutes) {
    assert(manifest.main_routes?.includes(route), `manifest is missing route ${route}`)
    assert(llms.includes(route), `llms.txt is missing route ${route}`)
    assert(ai.includes(route), `ai.txt is missing route ${route}`)
  }

  assert(llms.includes(`${origin}/`), 'llms.txt is missing canonical site')
  assert(ai.includes(origin), 'ai.txt is missing canonical origin')
  assert(ai.includes('do not include unreviewed candidates'), 'ai.txt is missing safety boundary')

  console.log(`Production machine-readable layer verified at ${origin}`)
  console.log(`commit=${version.build.commit}`)
  console.log(`records=${counts.primary_records}, events=${counts.events}, evidence=${counts.evidence}`)
}

let lastError
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    console.log(`Production verification attempt ${attempt}/${maxAttempts}`)
    await verifyProduction()
    process.exit(0)
  } catch (error) {
    lastError = error
    console.error(error instanceof Error ? error.message : error)
    if (attempt < maxAttempts) await sleep(retryDelayMs)
  }
}

throw lastError
