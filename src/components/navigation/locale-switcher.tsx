'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { publicLocales, type SupportedLocale } from '../../i18n/config'
import { trackAnalyticsEvent } from '../../lib/analytics/track-event'
import {
  buildLocalePath,
  isJapanesePilotPath,
  stripLocalePrefix,
} from '../../lib/i18n/locale-routes'

type LocaleSwitcherProps = {
  ariaLabel: string
  englishLabel: string
  japaneseLabel: string
}

export default function LocaleSwitcher({
  ariaLabel,
  englishLabel,
  japaneseLabel,
}: LocaleSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = stripLocalePrefix(pathname)
  const locales = (publicLocales as SupportedLocale[]).filter((locale) => {
    return locale !== 'ja' || isJapanesePilotPath(current.pathname)
  })

  if (locales.length < 2) return null

  const query = searchParams.toString()

  function labelFor(locale: SupportedLocale) {
    return locale === 'ja' ? japaneseLabel : englishLabel
  }

  function trackSwitch(targetLocale: SupportedLocale) {
    if (targetLocale === current.locale) return
    trackAnalyticsEvent('hei_language_switch', {
      from_locale: current.locale,
      to_locale: targetLocale,
      source_path: current.pathname,
    })
  }

  return (
    <div className="locale-switcher" aria-label={ariaLabel}>
      {locales.map((locale) => {
        const route = buildLocalePath(current.pathname, locale)
        const href = query ? `${route}?${query}` : route
        const isCurrent = current.locale === locale

        return (
          <Link
            key={locale}
            className={isCurrent ? 'nav-link active' : 'nav-link'}
            href={href}
            hrefLang={locale}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => trackSwitch(locale)}
          >
            {labelFor(locale)}
          </Link>
        )
      })}
    </div>
  )
}
