import fs from 'node:fs'

const origins = [
  'https://hei.badjoke-lab.com',
  'https://historical-exchange-index.pages.dev',
  'https://audit-post394-check.historical-exchange-index.pages.dev',
]
const paths = [
  '/', '/dead/', '/active/', '/stats/', '/version.json', '/data/manifest.json',
  '/data/entities.json', '/data/events.json', '/data/evidence.json', '/llms.txt',
  '/ai.txt', '/sitemap.xml', '/robots.txt',
]
const report = { checked_at: new Date().toISOString(), origins: [] }

for (const origin of origins) {
  const originResult = { origin, endpoints: [] }
  for (const path of paths) {
    try {
      const response = await fetch(`${origin}${path}?probe=${Date.now()}`, {
        headers: { accept: '*/*', 'user-agent': 'HEI deployment origin probe' },
        redirect: 'follow',
        signal: AbortSignal.timeout(25000),
      })
      const body = await response.text()
      const countMatches = [...body.matchAll(/.{0,55}\b(386|412|189|223|687|1594)\b.{0,55}/g)]
        .slice(0, 12)
        .map((match) => match[0].replace(/\s+/g, ' '))
      let parsed = null
      if ((path === '/version.json' || path === '/data/manifest.json') && response.ok) {
        try {
          const json = JSON.parse(body)
          parsed = path === '/version.json'
            ? { schema_version: json.schema_version, build: json.build, data: json.data }
            : {
                schema_version: json.schema_version,
                generated_at: json.generated_at,
                record_counts: json.record_counts,
                record_count_breakdown: json.record_count_breakdown,
              }
        } catch (error) {
          parsed = { parse_error: error instanceof Error ? error.message : String(error) }
        }
      }
      originResult.endpoints.push({
        path,
        status: response.status,
        final_url: response.url,
        content_type: response.headers.get('content-type'),
        cf_cache_status: response.headers.get('cf-cache-status'),
        last_modified: response.headers.get('last-modified'),
        body_length: body.length,
        count_matches: countMatches,
        parsed,
        body_prefix: body.slice(0, 280).replace(/\s+/g, ' '),
      })
    } catch (error) {
      originResult.endpoints.push({ path, fetch_error: error instanceof Error ? error.message : String(error) })
    }
  }
  report.origins.push(originResult)
}

fs.writeFileSync('hei-origin-probe.json', `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
