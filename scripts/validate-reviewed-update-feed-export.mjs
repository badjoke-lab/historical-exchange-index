import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
const origin = 'https://hei.badjoke-lab.com'

function assert(condition, message) {
  if (!condition) throw new Error(`feed export validation failed: ${message}`)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${path.relative(root, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readText(filePath) {
  assert(fs.existsSync(filePath), `missing ${path.relative(root, filePath)}`)
  return fs.readFileSync(filePath, 'utf8')
}

const source = readJson(path.join(root, 'data', 'registry-updates.json'))
assert(source.version === 1 && Array.isArray(source.updates), 'source shape is invalid')

const updates = [...source.updates].sort((a, b) => {
  const dateOrder = b.date.localeCompare(a.date)
  return dateOrder !== 0 ? dateOrder : a.id.localeCompare(b.id)
})

const jsonFeed = readJson(path.join(outDir, 'feeds', 'updates.json'))
const rssFeed = readText(path.join(outDir, 'feeds', 'updates.xml'))
const updatesHtml = readText(path.join(outDir, 'updates', 'index.html'))

assert(jsonFeed.version === 'https://jsonfeed.org/version/1.1', 'JSON Feed version is incorrect')
assert(jsonFeed.home_page_url === `${origin}/updates/`, 'JSON Feed home URL is incorrect')
assert(jsonFeed.feed_url === `${origin}/feeds/updates.json`, 'JSON Feed self URL is incorrect')
assert(jsonFeed.items.length === updates.length, 'JSON Feed item count differs from source')

for (let index = 0; index < updates.length; index += 1) {
  const update = updates[index]
  const item = jsonFeed.items[index]
  assert(item.id === `urn:hei:registry-update:${update.id}`, `JSON Feed ID mismatch: ${update.id}`)
  assert(item.url === `${origin}/updates/#${update.id}`, `JSON Feed URL mismatch: ${update.id}`)
  assert(item.date_published === `${update.date}T00:00:00.000Z`, `JSON Feed date mismatch: ${update.id}`)
  assert(item.title === update.title, `JSON Feed title mismatch: ${update.id}`)
  assert(item.summary === update.summary, `JSON Feed summary mismatch: ${update.id}`)
  assert(item._hei?.reviewed_public_only === true, `JSON Feed review marker missing: ${update.id}`)
}

assert(rssFeed.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'RSS declaration is missing')
assert(rssFeed.includes('<rss version="2.0">'), 'RSS root is missing')
const rssGuids = [...rssFeed.matchAll(/<guid isPermaLink="false">([^<]+)<\/guid>/g)].map((match) => match[1])
const expectedGuids = updates.map((update) => `urn:hei:registry-update:${update.id}`)
assert(JSON.stringify(rssGuids) === JSON.stringify(expectedGuids), 'RSS GUID order differs from source')
assert((rssFeed.match(/<item>/g) || []).length === updates.length, 'RSS item count differs from source')
assert(updatesHtml.includes('/feeds/updates.json'), 'updates page is missing JSON Feed link')
assert(updatesHtml.includes('/feeds/updates.xml'), 'updates page is missing RSS link')

console.log(`Validated reviewed update feed export: ${updates.length} items.`)
