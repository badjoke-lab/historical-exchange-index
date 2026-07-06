const DEFAULT_ORIGIN = 'https://hei.badjoke-lab.com'

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function asUtcDate(date) {
  return `${date}T00:00:00.000Z`
}

function asRssDate(date) {
  return new Date(asUtcDate(date)).toUTCString()
}

function updateUrl(origin, update) {
  return `${origin}/updates/#${encodeURIComponent(update.id)}`
}

function stableFeedId(update) {
  return `urn:hei:registry-update:${update.id}`
}

function countSummary(update) {
  const entityDelta = update.counts.entities_after - update.counts.entities_before
  const eventDelta = update.counts.events_after - update.counts.events_before
  const evidenceDelta = update.counts.evidence_after - update.counts.evidence_before
  const signed = (value) => value > 0 ? `+${value}` : String(value)
  return `Entities ${update.counts.entities_after} (${signed(entityDelta)}); Events ${update.counts.events_after} (${signed(eventDelta)}); Evidence ${update.counts.evidence_after} (${signed(evidenceDelta)}).`
}

function contentText(update) {
  const parts = [update.summary, countSummary(update)]
  if (update.added_entities.length > 0) parts.push(`Added entities: ${update.added_entities.map((entity) => entity.name).join(', ')}.`)
  if (update.updated_entities.length > 0) parts.push(`Updated entities: ${update.updated_entities.map((entity) => entity.name).join(', ')}.`)
  if (update.notes.length > 0) parts.push(`Notes: ${update.notes.join(' ')}`)
  return parts.join('\n\n')
}

export function normalizeReviewedUpdates(file) {
  if (!file || file.version !== 1 || !Array.isArray(file.updates)) {
    throw new Error('reviewed update feed source has unsupported shape')
  }

  const seenIds = new Set()
  const updates = [...file.updates]
  for (const update of updates) {
    if (!update.id || seenIds.has(update.id)) throw new Error(`reviewed update feed id is missing or duplicated: ${update.id}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(update.date)) throw new Error(`reviewed update feed date is invalid: ${update.id}`)
    if (!update.title || !update.summary) throw new Error(`reviewed update feed title or summary is missing: ${update.id}`)
    if (!Array.isArray(update.added_entities) || !Array.isArray(update.updated_entities) || !Array.isArray(update.notes)) {
      throw new Error(`reviewed update feed arrays are invalid: ${update.id}`)
    }
    seenIds.add(update.id)
  }

  return updates.sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date)
    return dateOrder !== 0 ? dateOrder : a.id.localeCompare(b.id)
  })
}

export function buildReviewedUpdateFeeds(file, { origin = DEFAULT_ORIGIN } = {}) {
  const updates = normalizeReviewedUpdates(file)
  const feedUrlJson = `${origin}/feeds/updates.json`
  const feedUrlRss = `${origin}/feeds/updates.xml`
  const newestDate = updates[0]?.date ?? '1970-01-01'

  const json = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Historical Exchange Index — Registry Updates',
    home_page_url: `${origin}/updates/`,
    feed_url: feedUrlJson,
    description: 'Reviewed public registry updates from the Historical Exchange Index.',
    language: 'en',
    items: updates.map((update) => ({
      id: stableFeedId(update),
      url: updateUrl(origin, update),
      title: update.title,
      content_text: contentText(update),
      summary: update.summary,
      date_published: asUtcDate(update.date),
      tags: [update.update_type],
      _hei: {
        update_id: update.id,
        update_type: update.update_type,
        counts: update.counts,
        added_entities: update.added_entities.length,
        updated_entities: update.updated_entities.length,
        evidence_added: update.evidence_added,
        reviewed_public_only: true,
      },
    })),
  }

  const rssItems = updates.map((update) => {
    const url = updateUrl(origin, update)
    const description = `${update.summary} ${countSummary(update)}`
    return [
      '    <item>',
      `      <title>${xmlEscape(update.title)}</title>`,
      `      <link>${xmlEscape(url)}</link>`,
      `      <guid isPermaLink="false">${xmlEscape(stableFeedId(update))}</guid>`,
      `      <pubDate>${xmlEscape(asRssDate(update.date))}</pubDate>`,
      `      <category>${xmlEscape(update.update_type)}</category>`,
      `      <description>${xmlEscape(description)}</description>`,
      '    </item>',
    ].join('\n')
  }).join('\n')

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>Historical Exchange Index — Registry Updates</title>',
    `    <link>${xmlEscape(`${origin}/updates/`)}</link>`,
    '    <description>Reviewed public registry updates from the Historical Exchange Index.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${xmlEscape(asRssDate(newestDate))}</lastBuildDate>`,
    `    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${xmlEscape(feedUrlRss)}" rel="self" type="application/rss+xml" />`,
    rssItems,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')

  return { json, rss, updates }
}
