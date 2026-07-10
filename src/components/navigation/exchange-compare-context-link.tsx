'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getDictionary, translate } from '../../lib/i18n/get-dictionary'
import { buildLocalePath, stripLocalePrefix } from '../../lib/i18n/locale-routes'
import styles from './exchange-compare-context-link.module.css'

const EXCHANGE_ROUTE = /^\/exchange\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/

export default function ExchangeCompareContextLink() {
  const rawPathname = usePathname()
  const { locale, pathname } = stripLocalePrefix(rawPathname)
  const match = pathname.match(EXCHANGE_ROUTE)
  if (!match) return null

  const slug = match[1]
  const dictionary = getDictionary(locale).common
  const t = (key: string, fallback?: string) => translate(dictionary, key, fallback)
  const explorerPath = buildLocalePath('/explore/', locale)
  const compareLabel = locale === 'ja'
    ? t('research.compareExchangeEnglish')
    : t('research.compareExchange')

  return (
    <aside className={styles.bar} aria-label={t('research.exchangeActions')}>
      <span>{t('research.prompt')}</span>
      <div className={styles.actions}>
        <Link className="subtle-link" href={`/compare/?exchange=${encodeURIComponent(slug)}`}>
          {compareLabel}
        </Link>
        <Link className="subtle-link" href={`${explorerPath}?view=entities&q=${encodeURIComponent(slug)}`}>
          {t('research.openInExplorer')}
        </Link>
      </div>
    </aside>
  )
}
