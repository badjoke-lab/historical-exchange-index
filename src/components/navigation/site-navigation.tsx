'use client'

import Link from 'next/link'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import LocaleSwitcher from './locale-switcher'
import styles from '../layout/site-chrome.module.css'

export type SiteNavigationItem = {
  href: string
  label: string
  secondary?: boolean
}

type Props = {
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

type MenuState = {
  pathname: string
  open: boolean
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
  const [menuState, setMenuState] = useState<MenuState>({ pathname, open: false })
  const open = menuState.pathname === pathname && menuState.open

  const closeMenu = useCallback((returnFocus = false) => {
    if (detailsRef.current) detailsRef.current.open = false
    setMenuState({ pathname, open: false })
    if (returnFocus) summaryRef.current?.focus()
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => firstLinkRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node) || detailsRef.current?.contains(target)) return
      closeMenu(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      const details = detailsRef.current
      if (!details?.open) return

      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu(true)
        return
      }

      if (event.key !== 'Tab') return
      const focusable = [...details.querySelectorAll<HTMLElement>(
        'summary, a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, open])

  const renderItem = (item: SiteNavigationItem, mobile = false, index = 0) => {
    const active = isCurrentPath(pathname, item.href)
    const className = [styles.navLink, active ? styles.activeLink : ''].filter(Boolean).join(' ')

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
          key={pathname}
          ref={detailsRef}
          className={styles.mobileNav}
          onToggle={(event) => setMenuState({ pathname, open: event.currentTarget.open })}
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

      <nav className={`nav ${styles.desktopNav}`} aria-label={primaryAriaLabel}>
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
