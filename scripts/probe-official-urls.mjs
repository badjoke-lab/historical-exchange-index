import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const reportPath = path.join(root, 'data-staging', 'audits', 'invalid-official-url-status.json')
const source = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const probes = []

async function request(url, method) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 HEI-URL-Audit/1.0',
        accept: 'text/html,application/xhtml+xml',
      },
    })
  } finally {
    clearTimeout(timer)
  }
}

for (const entity of source.invalid) {
  let response = null
  let method = 'HEAD'
  let error = null

  try {
    response = await request(entity.official_url_original, 'HEAD')
    if ([403, 405, 501].includes(response.status)) {
      method = 'GET'
      response = await request(entity.official_url_original, 'GET')
    }
  } catch (headError) {
    try {
      method = 'GET'
      response = await request(entity.official_url_original, 'GET')
    } catch (getError) {
      error = getError instanceof Error ? getError.message : String(getError)
    }
  }

  probes.push({
    id: entity.id,
    slug: entity.slug,
    original_url: entity.official_url_original,
    method,
    ok: response?.ok ?? false,
    status: response?.status ?? null,
    final_url: response?.url ?? null,
    redirected: response?.redirected ?? false,
    error,
  })
}

const outputPath = path.join(root, 'data-staging', 'audits', 'official-url-http-probes.json')
fs.writeFileSync(outputPath, `${JSON.stringify({ generated_at: new Date().toISOString(), probes }, null, 2)}\n`, 'utf8')
console.log(JSON.stringify(probes, null, 2))
