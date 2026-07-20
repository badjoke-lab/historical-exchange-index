import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const root = process.cwd()
const baseUrl = String(process.env.HEI_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '')
const outputRoot = path.join(root, 'artifacts/representative-visual-review')
const config = JSON.parse(
  fs.readFileSync(path.join(root, 'config/representative-visual-review-matrix.json'), 'utf8'),
)

fs.rmSync(outputRoot, { recursive: true, force: true })
fs.mkdirSync(outputRoot, { recursive: true })

const browser = await chromium.launch({ headless: true })
const records = []
const navigationRecords = []
const failures = []

function routeUrl(route) {
  return `${baseUrl}${route.startsWith('/') ? route : `/${route}`}`
}

function fileSafe(value) {
  return value.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '')
}

try {
  for (const state of config.visual_review_matrix) {
    const context = await browser.newContext({
      viewport: state.viewport,
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    const stateFailures = []

    try {
      const response = await page.goto(routeUrl(state.route), {
        waitUntil: 'networkidle',
        timeout: 60_000,
      })
      if (!response?.ok()) {
        stateFailures.push(`HTTP ${response?.status() ?? 'no response'}`)
      }

      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(350)

      const metrics = await page.evaluate(() => {
        const html = document.documentElement
        const body = document.body
        const main = document.querySelector('main')
        const header = document.querySelector('header.topbar, header')
        const isVisible = (node) => {
          if (!(node instanceof HTMLElement)) return false
          const style = getComputedStyle(node)
          const rect = node.getBoundingClientRect()
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
        }
        const visibleH1s = [...document.querySelectorAll('h1')].filter(isVisible)
        const primaryHeading = visibleH1s[0] ?? main?.querySelector('h2') ?? null
        const mainH1 = main?.querySelector('h1') ?? null
        const headingRect = primaryHeading?.getBoundingClientRect() ?? null
        const mainRect = main?.getBoundingClientRect() ?? null
        const describe = (node) => {
          if (!(node instanceof HTMLElement)) return null
          const rect = node.getBoundingClientRect()
          return {
            tag: node.tagName.toLowerCase(),
            id: node.id || null,
            className: typeof node.className === 'string' ? node.className : '',
            ariaLabel: node.getAttribute('aria-label'),
            text: (node.getAttribute('aria-label') || node.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 140),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
          }
        }
        const withinViewport = (node) => {
          if (!(node instanceof HTMLElement) || !isVisible(node)) return false
          const rect = node.getBoundingClientRect()
          return rect.left >= -1
            && rect.right <= html.clientWidth + 1
            && rect.top >= -1
            && rect.bottom <= window.innerHeight + 1
        }

        const pageControlSelectors = [
          'nav[aria-label="Stats Explorer drilldowns"]',
          'nav[aria-label="Related HEI surfaces"]',
          'main input',
          'main select',
          'main textarea',
          'main form',
          'main [data-filter]',
          'main [data-filters]',
          'main [class*="filter" i]',
          'main [class*="control" i]',
        ]
        const controls = [...document.querySelectorAll(pageControlSelectors.join(', '))]
          .filter((node) => isVisible(node) && !node.closest('header'))
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
        const firstControl = controls[0] ?? null
        const firstControlRect = firstControl?.getBoundingClientRect() ?? null
        const controlsBeforeHeading = Boolean(
          firstControlRect && headingRect && firstControlRect.top + 1 < headingRect.top,
        )

        const topLevel = main
          ? [...main.children].filter(isVisible).map((node) => {
              const heading = node.querySelector('h1, h2, h3')
              const rect = node.getBoundingClientRect()
              return {
                tag: node.tagName.toLowerCase(),
                className: typeof node.className === 'string' ? node.className : '',
                heading: heading?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) ?? '',
                top: Math.round(rect.top + window.scrollY),
                bottom: Math.round(rect.bottom + window.scrollY),
              }
            })
          : []

        const topLevelOverlaps = []
        for (let index = 0; index < topLevel.length - 1; index += 1) {
          const current = topLevel[index]
          const next = topLevel[index + 1]
          if (current.bottom > next.top + 1) {
            topLevelOverlaps.push({ current, next, overlap: current.bottom - next.top })
          }
        }

        const fixedOrSticky = [...document.querySelectorAll('body *')]
          .filter((node) => {
            if (!(node instanceof HTMLElement) || !isVisible(node)) return false
            const position = getComputedStyle(node).position
            return position === 'fixed' || position === 'sticky'
          })
          .map(describe)
          .filter(Boolean)

        const stickyHeadingOverlaps = fixedOrSticky.filter((item) => {
          if (!headingRect) return false
          return item.bottom > headingRect.top + 1 && item.top < headingRect.bottom - 1
        })

        const overflowElements = [...document.querySelectorAll('body *')]
          .filter((node) => {
            if (!(node instanceof HTMLElement) || !isVisible(node)) return false
            const rect = node.getBoundingClientRect()
            return rect.right > html.clientWidth + 1 || rect.left < -1
          })
          .slice(0, 30)
          .map(describe)

        const headerInteractiveElements = header
          ? [...header.querySelectorAll('a, button, input, select, [role="button"]')].filter(isVisible)
          : []
        const headerClippedInteractiveElements = headerInteractiveElements
          .filter((node) => !withinViewport(node))
          .map(describe)
          .filter(Boolean)

        const localeSwitchers = header
          ? [...header.querySelectorAll('.locale-switcher')].filter(isVisible)
          : []
        const localeSwitcher = localeSwitchers[0] ?? null
        const localeLinks = localeSwitcher
          ? [...localeSwitcher.querySelectorAll('a[hrefLang]')].filter(isVisible)
          : []
        const localeSwitcherAvailable = Boolean(
          localeSwitcher
          && localeLinks.length >= 2
          && localeLinks.every(withinViewport),
        )

        const mobileMenuControl = header?.querySelector(
          'button[aria-controls][aria-expanded], summary[aria-controls], [data-mobile-menu-trigger]',
        ) ?? null

        const incidentHistory = main?.querySelector('section[aria-label="Exchange incident history"]') ?? null
        const incidentItems = incidentHistory ? [...incidentHistory.querySelectorAll('article')] : []
        const incidentPagination = main?.querySelector(
          '[data-incident-pagination], nav[aria-label*="Incident pagination" i]',
        ) ?? null

        return {
          documentTitle: document.title,
          lang: html.lang,
          initialScrollY: Math.round(window.scrollY),
          viewportWidth: html.clientWidth,
          viewportHeight: window.innerHeight,
          scrollWidth: Math.max(html.scrollWidth, body.scrollWidth),
          bodyHeight: Math.max(html.scrollHeight, body.scrollHeight),
          horizontalOverflow: Math.max(html.scrollWidth, body.scrollWidth) > html.clientWidth + 1,
          mainPresent: Boolean(main),
          mainTop: mainRect ? Math.round(mainRect.top) : null,
          pageH1Count: visibleH1s.length,
          pageH1s: visibleH1s.map(describe).filter(Boolean),
          mainH1Present: Boolean(mainH1),
          primaryHeadingPresent: Boolean(primaryHeading),
          primaryHeadingTag: primaryHeading?.tagName.toLowerCase() ?? null,
          primaryHeadingText: primaryHeading?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 180) ?? '',
          primaryHeadingTop: headingRect ? Math.round(headingRect.top) : null,
          primaryHeadingBottom: headingRect ? Math.round(headingRect.bottom) : null,
          primaryHeadingVisibleInInitialViewport: Boolean(
            headingRect && headingRect.bottom > 0 && headingRect.top < window.innerHeight,
          ),
          firstControl: describe(firstControl),
          controlsBeforeHeading,
          controlCount: controls.length,
          topLevel,
          topLevelOverlaps,
          fixedOrSticky,
          stickyHeadingOverlaps,
          overflowElements,
          headerInteractiveCount: headerInteractiveElements.length,
          headerClippedInteractiveElements,
          localeSwitcherPresent: Boolean(localeSwitcher),
          localeSwitcherAvailable,
          localeLinkCount: localeLinks.length,
          mobileMenuControlPresent: Boolean(mobileMenuControl && isVisible(mobileMenuControl)),
          mobileMenuControl: describe(mobileMenuControl),
          incidentItemCount: incidentItems.length,
          incidentPaginationPresent: Boolean(incidentPagination && isVisible(incidentPagination)),
          incidentPagination: describe(incidentPagination),
        }
      })

      if (!metrics.mainPresent) stateFailures.push('main landmark missing')
      if (!metrics.primaryHeadingPresent) stateFailures.push('primary page heading missing')
      if (!metrics.primaryHeadingVisibleInInitialViewport) stateFailures.push('primary page heading is not visible in the initial viewport')
      if (config.failure_gates.single_page_h1_required && metrics.pageH1Count !== 1) {
        stateFailures.push(`expected exactly one visible h1, found ${metrics.pageH1Count}: ${JSON.stringify(metrics.pageH1s)}`)
      }
      if (config.failure_gates.primary_heading_must_be_h1 && metrics.primaryHeadingTag !== 'h1') {
        stateFailures.push(`primary page heading must be h1, found ${metrics.primaryHeadingTag ?? 'none'}`)
      }
      if (metrics.initialScrollY > config.failure_gates.initial_scroll_y_max) {
        stateFailures.push(`initial scrollY ${metrics.initialScrollY} exceeds ${config.failure_gates.initial_scroll_y_max}`)
      }
      if (metrics.horizontalOverflow && config.failure_gates.horizontal_page_overflow_prohibited) {
        stateFailures.push(`horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewportWidth}px`)
      }
      if (metrics.controlsBeforeHeading && config.failure_gates.controls_before_primary_heading_prohibited) {
        stateFailures.push(`page controls or related navigation appear above the primary heading: ${JSON.stringify(metrics.firstControl)}`)
      }
      if (metrics.topLevelOverlaps.length > 0 && config.failure_gates.main_content_overlap_prohibited) {
        stateFailures.push(`overlapping main sections: ${JSON.stringify(metrics.topLevelOverlaps)}`)
      }
      if (metrics.stickyHeadingOverlaps.length > 0 && config.failure_gates.main_content_overlap_prohibited) {
        stateFailures.push(`fixed/sticky element overlaps primary heading: ${JSON.stringify(metrics.stickyHeadingOverlaps)}`)
      }
      if (
        config.failure_gates.header_clipped_interactive_elements_prohibited
        && metrics.headerClippedInteractiveElements.length > 0
      ) {
        stateFailures.push(`header interactive elements are outside the viewport: ${JSON.stringify(metrics.headerClippedInteractiveElements)}`)
      }
      if (state.viewport.width <= 480 && config.failure_gates.mobile_menu_required && !metrics.mobileMenuControlPresent) {
        stateFailures.push('mobile navigation control missing')
      }
      if (
        state.viewport.width <= 480
        && state.locale_switcher_required === true
        && config.failure_gates.mobile_locale_switcher_required
        && !metrics.localeSwitcherAvailable
      ) {
        stateFailures.push(`mobile locale switcher unavailable: present=${metrics.localeSwitcherPresent} links=${metrics.localeLinkCount}`)
      }
      if (state.template === 'incidents') {
        if (metrics.incidentItemCount > config.failure_gates.incidents_max_initial_items) {
          stateFailures.push(`incidents initial item count ${metrics.incidentItemCount} exceeds ${config.failure_gates.incidents_max_initial_items}`)
        }
        if (metrics.bodyHeight > config.failure_gates.incidents_max_body_height) {
          stateFailures.push(`incidents body height ${metrics.bodyHeight}px exceeds ${config.failure_gates.incidents_max_body_height}px`)
        }
        if (config.failure_gates.incidents_pagination_required && !metrics.incidentPaginationPresent) {
          stateFailures.push('incidents pagination missing')
        }
      }

      const baseName = fileSafe(state.id)
      const viewportFile = `${baseName}-viewport.png`
      const fullFile = `${baseName}-full.png`
      await page.screenshot({
        path: path.join(outputRoot, viewportFile),
        fullPage: false,
        animations: 'disabled',
      })
      await page.screenshot({
        path: path.join(outputRoot, fullFile),
        fullPage: true,
        animations: 'disabled',
      })

      records.push({
        ...state,
        viewport_file: viewportFile,
        full_file: fullFile,
        metrics,
        failures: stateFailures,
        automated_gate: stateFailures.length ? 'fail' : 'pass',
        owner_status: 'pending',
      })
      failures.push(...stateFailures.map((message) => `${state.id}: ${message}`))
    } catch (error) {
      const message = error instanceof Error ? error.stack || error.message : String(error)
      failures.push(`${state.id}: capture exception: ${message}`)
      records.push({
        ...state,
        viewport_file: null,
        full_file: null,
        metrics: null,
        failures: [`capture exception: ${message}`],
        automated_gate: 'fail',
        owner_status: 'pending',
      })
    } finally {
      await context.close()
    }
  }

  const navigationContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const navigationPage = await navigationContext.newPage()
  try {
    for (const target of config.navigation_targets) {
      const record = { target, link_found: false, scroll_y: null, status: 'not_tested', failure: null }
      try {
        await navigationPage.goto(routeUrl('/'), { waitUntil: 'networkidle', timeout: 60_000 })
        await navigationPage.evaluate(() => document.fonts.ready)
        await navigationPage.evaluate(() => window.scrollTo(0, Math.min(1400, document.documentElement.scrollHeight - innerHeight)))
        await navigationPage.waitForTimeout(100)

        const selector = await navigationPage.evaluate((pathname) => {
          const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`
          const link = [...document.querySelectorAll('a[href]')].find((node) => {
            try {
              const url = new URL(node.href)
              const candidate = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`
              return candidate === normalized
            } catch {
              return false
            }
          })
          if (!(link instanceof HTMLAnchorElement)) return null
          link.setAttribute('data-visual-navigation-target', pathname)
          return `a[data-visual-navigation-target="${CSS.escape(pathname)}"]`
        }, target)

        if (!selector) {
          record.status = 'skipped_no_link'
          record.failure = 'navigation target link not found on the home page'
          failures.push(`navigation ${target}: ${record.failure}`)
          navigationRecords.push(record)
          continue
        }

        record.link_found = true
        await navigationPage.locator(selector).click()
        await navigationPage.waitForLoadState('networkidle')
        await navigationPage.evaluate(() => document.fonts.ready)
        await navigationPage.waitForTimeout(200)
        record.scroll_y = await navigationPage.evaluate(() => Math.round(window.scrollY))
        record.status = record.scroll_y <= config.failure_gates.navigation_scroll_y_max ? 'pass' : 'fail'
        if (record.status === 'fail') {
          record.failure = `navigation retained scrollY ${record.scroll_y}`
          failures.push(`navigation ${target}: ${record.failure}`)
        }
      } catch (error) {
        record.status = 'error'
        record.failure = error instanceof Error ? error.message : String(error)
        failures.push(`navigation ${target}: ${record.failure}`)
      }
      navigationRecords.push(record)
    }
  } finally {
    await navigationContext.close()
  }
} finally {
  await browser.close()
}

if (records.length !== config.failure_gates.expected_state_count) {
  failures.push(`expected ${config.failure_gates.expected_state_count} states, captured ${records.length}`)
}

const manifest = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  contract_id: config.contract_id,
  status: failures.length ? 'failed' : 'awaiting_owner_review',
  automated_capture_counts_as_approval: false,
  owner_approval: false,
  expected_state_count: config.failure_gates.expected_state_count,
  state_count: records.length,
  screenshot_count: records.reduce(
    (count, record) => count + (record.viewport_file ? 1 : 0) + (record.full_file ? 1 : 0),
    0,
  ),
  failure_count: failures.length,
  records,
  navigation_records: navigationRecords,
  failures,
}

fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({
  ok: failures.length === 0,
  states: records.length,
  screenshots: manifest.screenshot_count,
  failures: failures.length,
  output: 'artifacts/representative-visual-review',
}, null, 2))

if (failures.length) process.exit(1)
