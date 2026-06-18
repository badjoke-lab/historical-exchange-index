import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const reportPath = path.join(root, 'data-staging', 'audits', 'invalid-official-url-status.json')
const source = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const probes = []

for (const entity of source.invalid) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(entity.official_url_original, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'HEI-URL-Audit/1.0' },
    })
    probes.push({
      id: entity.id,
      slug: entity.slug,
      original_url: entity.official_url_original,
      ok: response.ok,
      status: response.status,
      final_url: response.url,
      redirected: response.redirected,
      error: null,
    })
  } catch (error) {
    probes.push({
      id: entity.id,
      slug: entity.slug,
      original_url: entity.official_url_original,
      ok: false,
      status: null,
      final_url: null,
      redirected: false,
      error: error instanceof Error ? error.message : String(error),
    })
  } finally {
    clearTimeout(timer)
  }
}

const outputPath = path.join(root, 'data-staging', 'audits', 'official-url-http-probes.json')
fs.writeFileSync(outputPath, `${JSON.stringify({ generated_at: new Date().toISOString(), probes }, null, 2)}\n`, 'utf8')
console.log(JSON.stringify(probes, null, 2))
