import './globals.css'
import './home-recent-mobile-fix.css'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import GoogleAnalytics from '../components/analytics/google-analytics'
import {
  CONTACT_HREF,
  DONATE_HREF,
  GA_MEASUREMENT_ID,
  GSC_VERIFICATION_TOKEN,
  ISSUES_HREF,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from '../lib/site-constants'

type RootLayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  verification: GSC_VERIFICATION_TOKEN
    ? {
        google: GSC_VERIFICATION_TOKEN,
      }
    : undefined,
}

export const viewport: Viewport = {
  themeColor: '#0b0f14',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <style>{`
@media (max-width: 767px) {
  .home-list-item-recent {
    display: block !important;
    min-height: 0 !important;
    padding: 10px 12px !important;
  }

  .home-list-item-recent .home-item-main {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  .home-list-item-recent .home-item-main > div:first-child {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 10px !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
    min-width: 0 !important;
    margin-bottom: 6px !important;
  }

  .home-list-item-recent .home-item-main > div:first-child > .home-item-title {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    line-height: 1.25 !important;
  }

  .home-list-item-recent .home-item-main > div:first-child > .btn-compact {
    flex: 0 0 auto !important;
    width: auto !important;
    white-space: nowrap !important;
    padding: 7px 10px !important;
  }

  .home-list-item-recent .home-item-main > .home-item-meta {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    margin: 0 10px 0 0 !important;
    vertical-align: middle !important;
    text-align: left !important;
    line-height: 1.35 !important;
    font-size: 11px !important;
  }

  .home-list-item-recent .home-item-main > .home-item-meta:last-child {
    margin-right: 0 !important;
  }
}

@media (max-width: 389px) {
  .home-list-item-recent .home-item-main > div:first-child {
    flex-wrap: wrap !important;
    align-items: flex-start !important;
  }

  .home-list-item-recent .home-item-main > .home-item-meta {
    display: flex !important;
    margin: 4px 0 0 !important;
  }
}
        `}</style>

        <div className="page">
          <header className="topbar">
            <div className="brand">
              <div className="brand-mark">HEI</div>
              <div className="brand-copy">
                <h1>Historical Exchange Index</h1>
                <p>A quiet registry of crypto exchanges, active and gone.</p>
              </div>
            </div>

            <nav className="nav">
              <Link className="nav-link" href="/">Home</Link>
              <Link className="nav-link" href="/dead">Dead</Link>
              <Link className="nav-link" href="/active">Active</Link>
              <Link className="nav-link" href="/stats">Stats</Link>
              <Link className="nav-link nav-secondary" href="/methodology">Methodology</Link>
              <Link className="nav-link nav-secondary" href="/about">About</Link>
              <Link className="utility" href={DONATE_HREF}>Donate</Link>
            </nav>
          </header>

          {children}

          <footer className="footer">
            <div className="footer-copy">Historical Exchange Index — quiet registry / archive-first / history-first</div>
            <div className="footer-links">
              <a className="archive-link" href={CONTACT_HREF} target="_blank" rel="noreferrer">
                Contact / Corrections
              </a>
              <span className="muted footer-sep"> · </span>
              <a className="archive-link" href={ISSUES_HREF} target="_blank" rel="noreferrer">
                GitHub Issues
              </a>
              <span className="muted footer-sep"> · </span>
              <Link className="archive-link" href="/stats">Stats</Link>
              <span className="muted footer-sep"> · </span>
              <Link className="archive-link" href={DONATE_HREF}>Support HEI</Link>
              <span className="muted footer-sep"> · </span>
              <Link href="/about">About</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
