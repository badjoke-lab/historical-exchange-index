import { chromium } from 'playwright'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const origin = (process.env.AUDIT_ORIGIN || 'https://hei.badjoke-lab.com').replace(/\/$/, '')
const outputRoot = process.env.AUDIT_OUTPUT || 'artifacts/all-page-visual-audit'
const concurrency = Math.max(1, Number(process.env.AUDIT_CONCURRENCY || 6))
const timeoutMs = Math.max(10_000, Number(process.env.AUDIT_TIMEOUT_MS || 45_000))

const coreRoutes = [
  '/', '/dead/', '/active/', '/explore/', '/stats/', '/quality/', '/updates/', '/incidents/',
  '/monthly/', '/methodology/', '/about/', '/donate/', '/ja/', '/ja/dead/', '/ja/active/',
  '/ja/explore/', '/ja/stats/', '/ja/quality/', '/ja/updates/', '/ja/incidents/', '/ja/monthly/',
  '/ja/methodology/', '/ja/about/', '/ja/donate/'
]

const queryRoutes = [
  '/explore/?view=entities&status=dead',
  '/explore/?view=events&event_type=hack',
  '/explore/?view=entities&status=dead&status=merged&archive_available=true',
  '/explore/?view=events&date_from=2026-06-01&date_to=2026-06-30'
]

function routeKey(route) {
  const url = new URL(route, origin)
  const base = `${url.pathname}${url.search}`
  const hash = createHash('sha1').update(base).digest('hex').slice(0, 10)
  const readable = (url.pathname === '/' ? 'home' : url.pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-'))
    .slice(-90) || 'home'
  return `${readable}__${hash}`
}

function xmlUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gsi)]
    .map((match) => match[1].trim().replace(/&amp;/g, '&'))
    .filter(Boolean)
}

async function loadRoutes() {
  const sitemapResponse = await fetch(`${origin}/sitemap.xml`, { redirect: 'follow' })
  if (!sitemapResponse.ok) throw new Error(`sitemap fetch failed: ${sitemapResponse.status}`)
  const sitemapXml = await sitemapResponse.text()
  const urls = xmlUrls(sitemapXml)
  const routes = urls
    .map((value) => {
      const url = new URL(value)
      if (url.origin !== origin) return null
      return `${url.pathname}${url.search}`
    })
    .filter(Boolean)
  return [...new Set([...coreRoutes, ...queryRoutes, ...routes])].sort()
}

function familyForRoute(route) {
  const pathname = new URL(route, origin).pathname
  if (pathname === '/' || pathname === '/ja/') return 'home'
  if (pathname.includes('/exchange/')) return pathname.startsWith('/ja/') ? 'exchange-ja' : 'exchange-en'
  if (pathname.includes('/event/')) return pathname.startsWith('/ja/') ? 'event-ja' : 'event-en'
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'ja') return `ja-${parts[1] || 'home'}`
  return parts[0] || 'home'
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = window.innerHeight
    const visible = (el) => {
      const style = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0
    }
    const selectorFor = (el) => {
      if (el.id) return `#${el.id}`
      const classes = [...el.classList].slice(0, 3).join('.')
      return `${el.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`
    }
    const candidates = [...document.querySelectorAll('body *')].filter(visible)
    const overflow = []
    for (const el of candidates) {
      const rect = el.getBoundingClientRect()
      if (rect.left < -2 || rect.right > viewportWidth + 2) {
        overflow.push({ selector: selectorFor(el), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) })
        if (overflow.length >= 30) break
      }
    }
    const landmarkSelector = [
      'header', 'nav', 'main', 'main > section', 'main > div', 'h1', 'h2', 'form',
      '[class*="hero" i]', '[class*="filter" i]', '[class*="control" i]', '[class*="toolbar" i]',
      '[class*="search" i]', '[class*="header" i]', '[id*="filter" i]', '[id*="hero" i]'
    ].join(',')
    const landmarks = [...document.querySelectorAll(landmarkSelector)]
      .filter(visible)
      .slice(0, 80)
      .map((el) => {
        const rect = el.getBoundingClientRect()
        return {
          selector: selectorFor(el),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140),
          top: Math.round(rect.top + window.scrollY),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          position: getComputedStyle(el).position,
          zIndex: getComputedStyle(el).zIndex,
        }
      })
    const main = document.querySelector('main')
    const mainChildren = main
      ? [...main.children].filter(visible).map((el) => {
          const rect = el.getBoundingClientRect()
          return { selector: selectorFor(el), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100), top: Math.round(rect.top + window.scrollY), height: Math.round(rect.height) }
        })
      : []
    const overlaps = []
    for (let index = 1; index < mainChildren.length; index += 1) {
      const previous = mainChildren[index - 1]
      const current = mainChildren[index]
      const previousBottom = previous.top + previous.height
      if (current.top < previousBottom - 2) overlaps.push({ previous, current, overlapPx: previousBottom - current.top })
    }
    return {
      title: document.title,
      initialScrollY: Math.round(window.scrollY),
      viewportWidth,
      viewportHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - viewportWidth),
      overflow,
      landmarks,
      mainChildren,
      overlaps,
      h1: [...document.querySelectorAll('h1')].map((el) => (el.textContent || '').trim()),
      h2: [...document.querySelectorAll('h2')].slice(0, 10).map((el) => (el.textContent || '').trim()),
    }
  })
}

async function captureRoute(browser, route, index, total) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', deviceScaleFactor: 1 })
  const page = await context.newPage()
  page.setDefaultTimeout(timeoutMs)
  const started = Date.now()
  const key = routeKey(route)
  const family = familyForRoute(route)
  const result = { index, total, route, family, key, status: 'unknown', error: null }
  try {
    const response = await page.goto(new URL(route, origin).href, { waitUntil: 'networkidle', timeout: timeoutMs })
    await page.evaluate(() => document.fonts?.ready)
    await page.waitForTimeout(250)
    const metrics = await inspectPage(page)
    result.status = response?.status() ?? 0
    result.finalUrl = page.url()
    Object.assign(result, metrics)
    await page.screenshot({ path: path.join(outputRoot, 'initial', `${key}.jpg`), type: 'jpeg', quality: 58, fullPage: false })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(50)
    await page.screenshot({ path: path.join(outputRoot, 'full', family, `${key}.jpg`), type: 'jpeg', quality: 50, fullPage: true })
  } catch (error) {
    result.status = 'error'
    result.error = error instanceof Error ? error.stack || error.message : String(error)
  } finally {
    result.durationMs = Date.now() - started
    await context.close()
  }
  console.log(`[${index}/${total}] ${route} -> ${result.status} (${result.durationMs}ms)`)
  return result
}

async function runPool(items, workerCount, worker) {
  const results = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: workerCount }, async () => {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= items.length) return
      results[index] = await worker(items[index], index)
    }
  })
  await Promise.all(workers)
  return results
}

async function captureNavigationFlows(browser) {
  const results = []
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', deviceScaleFactor: 1 })
  const page = await context.newPage()
  page.setDefaultTimeout(timeoutMs)
  for (const route of coreRoutes.filter((value) => !value.startsWith('/ja/') && value !== '/')) {
    const item = { route, topStart: null, scrolledStart: null, error: null }
    try {
      await page.goto(`${origin}/`, { waitUntil: 'networkidle' })
      await page.evaluate(() => window.scrollTo(0, 0))
      const topLink = page.locator(`a[href="${route}"]`).first()
      if (await topLink.count()) {
        await topLink.click()
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(200)
        item.topStart = { scrollY: await page.evaluate(() => Math.round(window.scrollY)), url: page.url() }
        await page.screenshot({ path: path.join(outputRoot, 'navigation', `${routeKey(`${route}?flow=top`)}.jpg`), type: 'jpeg', quality: 60 })
      }
      await page.goto(`${origin}/`, { waitUntil: 'networkidle' })
      await page.evaluate(() => window.scrollTo(0, Math.min(900, document.documentElement.scrollHeight - innerHeight)))
      const before = await page.evaluate(() => Math.round(window.scrollY))
      const scrolledLink = page.locator(`a[href="${route}"]`).first()
      if (await scrolledLink.count()) {
        await scrolledLink.click()
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(200)
        item.scrolledStart = { before, scrollY: await page.evaluate(() => Math.round(window.scrollY)), url: page.url() }
        await page.screenshot({ path: path.join(outputRoot, 'navigation', `${routeKey(`${route}?flow=scrolled`)}.jpg`), type: 'jpeg', quality: 60 })
      }
    } catch (error) {
      item.error = error instanceof Error ? error.message : String(error)
    }
    results.push(item)
  }
  await context.close()
  return results
}

async function writeGallery(results) {
  const rows = results.map((item) => `<article><a href="full/${item.family}/${item.key}.jpg"><img loading="lazy" src="initial/${item.key}.jpg" alt="${item.route.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"></a><code>${item.route}</code><small>${item.status} · scrollY ${item.initialScrollY ?? '—'} · overflow ${item.horizontalOverflowPx ?? '—'}px</small></article>`).join('\n')
  const html = `<!doctype html><meta charset="utf-8"><title>HEI all-page visual audit</title><style>body{font:14px system-ui;background:#111;color:#eee;margin:20px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}article{border:1px solid #333;padding:10px;display:grid;gap:8px}img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;border:1px solid #333}code,small{overflow-wrap:anywhere;color:#ccc}</style><h1>HEI all-page visual audit</h1><p>${results.length} routes from ${origin}</p><main>${rows}</main>`
  await writeFile(path.join(outputRoot, 'index.html'), html)
}

await mkdir(path.join(outputRoot, 'initial'), { recursive: true })
await mkdir(path.join(outputRoot, 'full'), { recursive: true })
await mkdir(path.join(outputRoot, 'navigation'), { recursive: true })

const routes = await loadRoutes()
await writeFile(path.join(outputRoot, 'routes.json'), JSON.stringify({ origin, generatedAt: new Date().toISOString(), routes }, null, 2))
console.log(`Auditing ${routes.length} routes from ${origin} with concurrency ${concurrency}`)

const browser = await chromium.launch({ headless: true })
const results = await runPool(routes, concurrency, (route, zeroIndex) => captureRoute(browser, route, zeroIndex + 1, routes.length))
const navigationFlows = await captureNavigationFlows(browser)
await browser.close()

const findings = {
  non200: results.filter((item) => typeof item.status === 'number' && (item.status < 200 || item.status >= 400)),
  errors: results.filter((item) => item.error),
  initialScroll: results.filter((item) => Number(item.initialScrollY) > 0),
  horizontalOverflow: results.filter((item) => Number(item.horizontalOverflowPx) > 1),
  mainOverlaps: results.filter((item) => Array.isArray(item.overlaps) && item.overlaps.length > 0),
  navigationScrollRetention: navigationFlows.filter((item) => Number(item.topStart?.scrollY) > 0 || Number(item.scrolledStart?.scrollY) > 0),
}

await writeFile(path.join(outputRoot, 'report.json'), JSON.stringify({ origin, generatedAt: new Date().toISOString(), routeCount: routes.length, concurrency, results, navigationFlows, findings }, null, 2))
await writeFile(path.join(outputRoot, 'summary.json'), JSON.stringify({ routeCount: routes.length, counts: Object.fromEntries(Object.entries(findings).map(([key, value]) => [key, value.length])), navigationFlows }, null, 2))
await writeGallery(results)

console.log(JSON.stringify({ routeCount: routes.length, findings: Object.fromEntries(Object.entries(findings).map(([key, value]) => [key, value.length])) }, null, 2))
if (findings.errors.length > 0 || findings.non200.length > 0) process.exitCode = 1
