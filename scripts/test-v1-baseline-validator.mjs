import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function sameSet(a, b) {
  return JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort())
}

function sitemapFindings(xml, expectedCount, queryVariantsAllowed) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const findings = []
  if (urls.length !== expectedCount) findings.push('count')
  if (new Set(urls).size !== urls.length) findings.push('duplicate')
  if (!queryVariantsAllowed && urls.some((url) => new URL(url).search)) findings.push('query')
  return findings
}

assert(sameSet(['b', 'a', 'a'], ['a', 'b']), 'sameSet must ignore order and duplicate inputs')
assert(!sameSet(['a'], ['a', 'b']), 'sameSet must detect missing values')

const cleanSitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/explore/</loc></url></urlset>'
assert(sitemapFindings(cleanSitemap, 2, false).length === 0, 'clean sitemap fixture failed')

const querySitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/explore/?view=events</loc></url></urlset>'
assert(sitemapFindings(querySitemap, 2, false).includes('query'), 'query sitemap fixture was not detected')

const duplicateSitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/</loc></url></urlset>'
assert(sitemapFindings(duplicateSitemap, 2, false).includes('duplicate'), 'duplicate sitemap fixture was not detected')

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-v1-baseline-selftest-'))
try {
  const contract = {
    known_deferred_items: [
      'Compare v1',
      'Japanese public pilot',
      'additional languages',
      'Discovery Log trial',
      'NL Filter Translator',
      'API expansion',
    ],
  }
  const contractPath = path.join(tempDir, 'contract.json')
  fs.writeFileSync(contractPath, JSON.stringify(contract))
  const loaded = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  assert(loaded.known_deferred_items.length === 6, 'deferred-item contract fixture failed')
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

console.log('HEI v1 baseline validator self-test passed.')
