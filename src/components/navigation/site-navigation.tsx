'use client'

import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { SupportedLocale } from '../../i18n/config'
import LocaleSwitcher from './locale-switcher'
import styles from '../layout/site-chrome.module.css'

export type SiteNavigationItem = {
  href: string
  label: string
  secondary?: boolean
}

type Props = {
  locale: SupportedLocale
  primaryAriaLabel: string
  items: SiteNavigationItem[]
  donateHref: string
  donateLabel: string
  menuLabel: string
  closeLabel: string
  languageAriaLabel: string
  englishLabel: string
  japaneseLabel: string
}

function normalizePathname(value: string): string {
  const pathname = value.split('?')[0]?.split('#')[0] || '/'
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

function isCurrentPath(pathname: string, href: string): boolean {
  try {
    const target = new URL(href, 'https://hei.local')
    return normalizePathname(pathname) === normalizePathname(target.pathname)
  } catch {
    return false
  }
}

export default function SiteNavigation({
  locale,
  primaryAriaLabel,
  items,
  donateHref,
  donateLabel,
  menuLabel,
  closeLabel,
  languageAriaLabel,
  englishLabel,
  japaneseLabel,
}: Props) {
  const pathname = usePathname()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const [open, setOpen] = useState(false)

  function closeMenu(returnFocus = false) {
    if (detailsRef.current) detailsRef.current.open = false
    setOpen(false)
    if (returnFocus) summaryRef.current?.focus()
  }

  useEffect(() => {
    closeMenu(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => firstLinkRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !detailsRef.current?.open) return
      event.preventDefault()
      closeMenu(true)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderItem = (item: SiteNavigationItem, mobile = false, index = 0) => {
    const active = isCurrentPath(pathname, item.href)
    const className = [
      styles.navLink,
      active ? styles.activeLink : '',
    ].filter(Boolean).join(' ')

    return (
      <Link
        key={`${mobile ? 'mobile' : 'desktop'}-${item.href}`}
        ref={mobile && index === 0 ? firstLinkRef : undefined}
        className={className}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        onClick={mobile ? () => closeMenu(false) : undefined}
      >
        {item.label}
      </Link>
    )
  }

  const donateActive = isCurrentPath(pathname, donateHref)

  return (
    <div className={styles.navigationShell}>
      <div className={styles.mobileControls}>
        <div className={styles.mobileLocale}>
          <Suspense fallback={null}>
            <LocaleSwitcher
              ariaLabel={languageAriaLabel}
              englishLabel={englishLabel}
              japaneseLabel={japaneseLabel}
            />
          </Suspense>
        </div>

        <details
          ref={detailsRef}
          className={styles.mobileNav}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary
            ref={summaryRef}
            className={styles.mobileSummary}
            aria-controls="hei-mobile-navigation"
            aria-expanded={open}
            data-mobile-menu-trigger
          >
            {open ? closeLabel : menuLabel}
          </summary>
          <div className={styles.mobilePanel}>
            <nav id="hei-mobile-navigation" className={styles.mobileMenuNav} aria-label={primaryAriaLabel}>
              {items.map((item, index) => renderItem(item, true, index))}
              <Link
                className={`${styles.utilityLink} ${donateActive ? styles.activeLink : ''}`}
                href={donateHref}
                aria-current={donateActive ? 'page' : undefined}
                onClick={() => closeMenu(false)}
              >
                {donateLabel}
              </Link>
            </nav>
          </div>
        </details>
      </div>

      <nav className={styles.desktopNav} aria-label={primaryAriaLabel}>
        {items.map((item, index) => renderItem(item, false, index))}
        <Link
          className={`${styles.utilityLink} ${donateActive ? styles.activeLink : ''}`}
          href={donateHref}
          aria-current={donateActive ? 'page' : undefined}
        >
          {donateLabel}
        </Link>
        <div className={styles.desktopLocale}>
          <Suspense fallback={null}>
            <LocaleSwitcher
              ariaLabel={languageAriaLabel}
              englishLabel={englishLabel}
              japaneseLabel={japaneseLabel}
            />
          </Suspense>
        </div>
      </nav>
    </div>
  )
}
