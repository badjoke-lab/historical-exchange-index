import Link from 'next/link'
import type { ReactNode } from 'react'
import type { SupportedLocale } from '../../i18n/config'
import { getDictionary, translate } from '../../lib/i18n/get-dictionary'
import { buildLocalePath } from '../../lib/i18n/locale-routes'
import {
  CONTACT_HREF,
  DONATE_HREF,
  ISSUES_HREF,
} from '../../lib/site-constants'
import ExchangeCompareContextLink from '../navigation/exchange-compare-context-link'
import SiteNavigation, { type SiteNavigationItem } from '../navigation/site-navigation'
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
    <div className="page">
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

        <SiteNavigation
          locale={locale}
          primaryAriaLabel={primaryAriaLabel}
          items={navItems}
          donateHref={DONATE_HREF}
          donateLabel={t('nav.donate')}
          menuLabel={locale === 'ja' ? 'メニュー' : 'Menu'}
          closeLabel={locale === 'ja' ? '閉じる' : 'Close'}
          languageAriaLabel={t('language.switcherLabel')}
          englishLabel={t('language.english')}
          japaneseLabel={t('language.japanese')}
        />
      </header>

      <ExchangeCompareContextLink />
      {children}

      <footer className="footer">
        <div className="footer-copy">{t('footer.registryTagline')}</div>
        <div className="footer-links">
          <a className="archive-link" href="https://badjoke-lab.com/">
            BadJoke-Lab project hub
          </a>
          <span className="muted footer-sep"> · </span>
          <a className="archive-link" href={CONTACT_HREF} target="_blank" rel="noreferrer">
            {t('footer.contactCorrections')}
          </a>
          <span className="muted footer-sep"> · </span>
          <a className="archive-link" href={ISSUES_HREF} target="_blank" rel="noreferrer">
            {t('footer.githubIssues')}
          </a>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={localHref('/explore', locale)}>{t('nav.explorer')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href="/compare">{t('nav.compare')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={localHref('/updates', locale)}>{t('nav.updates')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={localHref('/incidents', locale)}>{t('nav.incidents')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={localHref('/monthly', locale)}>{t('nav.monthly')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={localHref('/quality', locale)}>{t('nav.quality')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={localHref('/stats', locale)}>{t('nav.stats')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link className="archive-link" href={DONATE_HREF}>{t('footer.supportHei')}</Link>
          <span className="muted footer-sep"> · </span>
          <Link href={localHref('/about', locale)}>{t('nav.about')}</Link>
        </div>
      </footer>
    </div>
  )
}
