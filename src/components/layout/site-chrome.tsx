import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import type { SupportedLocale } from '../../i18n/config'
import { getDictionary, translate } from '../../lib/i18n/get-dictionary'
import { buildLocalePath } from '../../lib/i18n/locale-routes'
import ExchangeCompareContextLink from '../navigation/exchange-compare-context-link'
import SiteNavigation, { type SiteNavigationItem } from '../navigation/site-navigation'
import SupportStrip from '../support/support-strip'
import headingStyles from './semantic-heading-compat.module.css'
import ProjectFooter from './project-footer'
import styles from './site-chrome.module.css'

type SiteChromeProps = {
  locale: SupportedLocale
  children: ReactNode
}

function localHref(pathname: string, locale: SupportedLocale) {
  if (locale === 'en') return pathname
  return buildLocalePath(pathname, locale)
}

export default function SiteChrome({ locale, children }: SiteChromeProps) {
  const dictionary = getDictionary(locale).common
  const t = (key: string, fallback?: string) => translate(dictionary, key, fallback)
  const supportHref = localHref('/donate', locale)

  const navItems: SiteNavigationItem[] = [
    { label: t('nav.home'), href: localHref('/', locale) },
    { label: t('nav.dead'), href: localHref('/dead', locale) },
    { label: t('nav.active'), href: localHref('/active', locale) },
    { label: t('nav.explorer'), href: localHref('/explore', locale) },
    { label: t('nav.compare'), href: '/compare' },
    { label: t('nav.stats'), href: localHref('/stats', locale) },
    { label: t('nav.updates'), href: localHref('/updates', locale) },
    { label: t('nav.incidents'), href: localHref('/incidents', locale) },
    { label: t('nav.methodology'), href: localHref('/methodology', locale), secondary: true },
    { label: t('nav.about'), href: localHref('/about', locale), secondary: true },
  ]

  const primaryAriaLabel = locale === 'ja' ? '主要ナビゲーション' : 'Primary navigation'
  const brandTitle = t('brand.title', 'Historical Exchange Index')

  return (
    <div className={`page ${headingStyles.scope}`}>
      <header className={styles.topbar}>
        <Link
          className={styles.brandLink}
          href={localHref('/', locale)}
          aria-label={locale === 'ja' ? `${brandTitle} ホーム` : `${brandTitle} home`}
        >
          <span className={styles.brandMark} aria-hidden="true">HEI</span>
          <span className={styles.brandCopy}>
            <span className={styles.brandTitle}>{brandTitle}</span>
            <span className={styles.brandTagline}>{t('brand.tagline', 'A quiet registry of crypto exchanges, active and gone.')}</span>
          </span>
        </Link>

        <Suspense fallback={null}>
          <SiteNavigation
            primaryAriaLabel={primaryAriaLabel}
            items={navItems}
            donateHref={supportHref}
            donateLabel={t('nav.donate')}
            menuLabel={locale === 'ja' ? 'メニュー' : 'Menu'}
            closeLabel={locale === 'ja' ? '閉じる' : 'Close'}
            languageAriaLabel={t('language.switcherLabel')}
            englishLabel={t('language.english')}
            japaneseLabel={t('language.japanese')}
          />
        </Suspense>
      </header>

      <ExchangeCompareContextLink />
      {children}
      <SupportStrip locale={locale} href={supportHref} />
      <ProjectFooter locale={locale} supportHref={supportHref} />
    </div>
  )
}
