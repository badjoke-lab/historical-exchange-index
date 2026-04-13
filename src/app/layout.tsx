import './globals.css'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import GoogleAnalytics from '../components/analytics/google-analytics'
import {
  CORRECTION_HREF,
  GA_MEASUREMENT_ID,
  GSC_VERIFICATION_TOKEN,
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
              <Link className="nav-link nav-secondary" href="/methodology">Methodology</Link>
              <Link className="nav-link nav-secondary" href="/about">About</Link>
              <Link className="utility" href="/donate">Donate</Link>
            </nav>
          </header>

          {children}

          <footer className="footer">
            <div className="footer-copy">Historical Exchange Index — quiet registry / archive-first / history-first</div>
            <div className="footer-links">
              <a className="archive-link" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
                Corrections
              </a>
              <span className="muted footer-sep"> · </span>
              <Link className="archive-link" href="/donate">Support HEI</Link>
              <span className="muted footer-sep"> · </span>
              <Link href="/about">About</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
