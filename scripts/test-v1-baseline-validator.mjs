import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function sameSet(a, b) {
  return JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort())
}

function sameOrder(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function sitemapFindings(xml, baselineCount, queryVariantsAllowed) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const findings = []
  if (urls.length < baselineCount) findings.push('below_baseline')
  if (new Set(urls).size !== urls.length) findings.push('duplicate')
  if (!queryVariantsAllowed && urls.some((url) => new URL(url).search)) findings.push('query')
  return findings
}

assert(sameSet(['b', 'a', 'a'], ['a', 'b']), 'sameSet must ignore order and duplicate inputs')
assert(!sameSet(['a'], ['a', 'b']), 'sameSet must detect missing values')
assert(sameOrder(['H', '750', 'L1', 'L2', '1000'], ['H', '750', 'L1', 'L2', '1000']), 'sameOrder must accept exact order')
assert(!sameOrder(['H', 'L1', '750'], ['H', '750', 'L1']), 'sameOrder must reject reordered milestones')

const cleanSitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/explore/</loc></url></urlset>'
assert(sitemapFindings(cleanSitemap, 2, false).length === 0, 'clean sitemap fixture failed')

const expandedSitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/explore/</loc></url><url><loc>https://example.test/compare/</loc></url></urlset>'
assert(sitemapFindings(expandedSitemap, 2, false).length === 0, 'post-v1 sitemap expansion should remain above baseline floor')

const belowBaselineSitemap = '<urlset><url><loc>https://example.test/</loc></url></urlset>'
assert(sitemapFindings(belowBaselineSitemap, 2, false).includes('below_baseline'), 'below-baseline sitemap fixture was not detected')

const querySitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/explore/?view=events</loc></url></urlset>'
assert(sitemapFindings(querySitemap, 2, false).includes('query'), 'query sitemap fixture was not detected')

const duplicateSitemap = '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/</loc></url></urlset>'
assert(sitemapFindings(duplicateSitemap, 2, false).includes('duplicate'), 'duplicate sitemap fixture was not detected')

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-v1-baseline-selftest-'))
try {
  const contract = {
    localization_foundation: {
      japanese_public_pilot_min_reviewed_entities: 750,
      third_language_gate_min_reviewed_entities: 1000,
      third_language_preselected: false,
      max_new_language_pilots_at_once: 1,
    },
    post_v1_priority_sequence: [
      'Phase H — Compare v1',
      'D-750 Reviewed Entity Milestone',
      'L-1 Japanese Pilot',
      'L-2 Localization Evaluation Gate',
      'D-1000 Reviewed Entity Milestone',
      'Language Selection Gate',
      'Phase I — Discovery Log Trial',
    ],
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
  assert(loaded.localization_foundation.japanese_public_pilot_min_reviewed_entities === 750, 'Japanese Pilot gate fixture failed')
  assert(loaded.localization_foundation.third_language_gate_min_reviewed_entities === 1000, 'third-language gate fixture failed')
  assert(loaded.localization_foundation.third_language_preselected === false, 'third-language preselection fixture failed')
  assert(loaded.localization_foundation.max_new_language_pilots_at_once === 1, 'language-pilot concurrency fixture failed')
  assert(loaded.post_v1_priority_sequence[1] === 'D-750 Reviewed Entity Milestone', '750 milestone order fixture failed')
  assert(loaded.post_v1_priority_sequence[4] === 'D-1000 Reviewed Entity Milestone', '1000 milestone order fixture failed')
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

console.log('HEI v1 baseline validator self-test passed.')
