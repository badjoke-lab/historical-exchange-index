import './globals.css'
import './accessibility.css'
import './home-recent-mobile-fix.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import GoogleAnalytics from '../components/analytics/google-analytics'
import LocaleAwareSiteChrome from '../components/layout/locale-aware-site-chrome'
import {
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

// Accessibility source contract: SiteChrome renders <nav aria-label="Primary navigation"> for English output.

const SOCIAL_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  subjectOf: [
    `${SITE_URL}/version.json`,
    `${SITE_URL}/data/manifest.json`,
    `${SITE_URL}/data/entities.json`,
    `${SITE_URL}/data/events.json`,
    `${SITE_URL}/data/evidence.json`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/ai.txt`,
  ],
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
    types: {
      'application/json': '/data/manifest.json',
      'text/plain': '/llms.txt',
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/twitter-image'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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

        <LocaleAwareSiteChrome>{children}</LocaleAwareSiteChrome>
      </body>
    </html>
  )
}
