import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`L2 localization telemetry test failed: ${message}`)
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const switcher = read('src/components/navigation/locale-switcher.tsx')
const helper = read('src/lib/analytics/track-event.ts')
const analytics = read('src/components/analytics/google-analytics.tsx')

assert(switcher.includes("trackAnalyticsEvent('hei_language_switch'"), 'language switch event name missing')
assert(switcher.includes('from_locale: current.locale'), 'from_locale parameter missing')
assert(switcher.includes('to_locale: targetLocale'), 'to_locale parameter missing')
assert(switcher.includes('source_path: current.pathname'), 'source_path parameter missing')
assert(switcher.includes('if (targetLocale === current.locale) return'), 'current-locale click suppression missing')
assert(switcher.includes('onClick={() => trackSwitch(locale)}'), 'locale switch click hook missing')

assert(helper.includes("window.gtag?.('event', eventName, params)"), 'analytics helper does not emit GA4 event command')
assert(helper.includes("if (typeof window === 'undefined') return"), 'analytics helper lacks server safety guard')
assert(analytics.includes("gtag('config', '${measurementId}')"), 'GA4 pageview configuration contract missing')

console.log('L2 localization telemetry source tests passed: GA4 pageviews plus hei_language_switch event instrumentation verified.')
