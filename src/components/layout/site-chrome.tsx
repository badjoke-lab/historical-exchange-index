import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import type { SupportedLocale } from '../../i18n/config'
import { getDictionary, translate } from '../../lib/i18n/get-dictionary'
import { buildLocalePath } from '../../lib/i18n/locale-routes'
import {
  CONTACT_HREF,
  DONATE_HREF,
  ISSUES_HREF,
} from '../../lib/site-constants'
import ExchangeCompareContextLink from '../navigation/exchange-compare-context-link'
import LocaleSwitcher from '../navigation/locale-switcher'

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

  const navItems = [
    { key: 'nav.home', href: localHref('/', locale) },
    { key: 'nav.dead', href: localHref('/dead', locale) },
    { key: 'nav.active', href: localHref('/active', locale) },
    { key: 'nav.explorer', href: localHref('/explore', locale) },
    { key: 'nav.compare', href: '/compare' },
    { key: 'nav.stats', href: localHref('/stats', locale) },
    { key: 'nav.updates', href: localHref('/updates', locale) },
    { key: 'nav.incidents', href: localHref('/incidents', locale) },
  ]

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">HEI</div>
          <div className="brand-copy">
            <h1>{t('brand.title', 'Historical Exchange Index')}</h1>
            <p>{t('brand.tagline', 'A quiet registry of crypto exchanges, active and gone.')}</p>
          </div>
        </div>

        <nav className="nav" aria-label={locale === 'ja' ? '主要ナビゲーション' : 'Primary navigation'}>
          {navItems.map((item) => (
            <Link key={item.key} className="nav-link" href={item.href}>
              {t(item.key)}
            </Link>
          ))}
          <Link className="nav-link nav-secondary" href={localHref('/methodology', locale)}>
            {t('nav.methodology')}
          </Link>
          <Link className="nav-link nav-secondary" href={localHref('/about', locale)}>
            {t('nav.about')}
          </Link>
          <Link className="utility" href={DONATE_HREF}>{t('nav.donate')}</Link>
          <Suspense fallback={null}>
            <LocaleSwitcher
              ariaLabel={t('language.switcherLabel')}
              englishLabel={t('language.english')}
              japaneseLabel={t('language.japanese')}
            />
          </Suspense>
        </nav>
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
