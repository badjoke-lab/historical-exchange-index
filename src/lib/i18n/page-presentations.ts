import type { Metadata } from 'next'
import {
  publicLocales,
  type SupportedLocale,
} from '../../i18n/config'
import { SITE_NAME, SITE_URL } from '../site-constants'
import { getDictionary, translate } from './get-dictionary'
import { buildLocalePath } from './locale-routes'

export const PILOT_PAGE_KEYS = [
  'home',
  'dead',
  'active',
  'about',
  'methodology',
  'stats',
  'quality',
  'explore',
  'updates',
  'incidents',
  'monthly',
  'exchange',
] as const

export type PilotPageKey = (typeof PILOT_PAGE_KEYS)[number]

export type PagePresentation = {
  title: string
  description: string
  eyebrow: string
  heading: string
  intro: string
}

const PRESENTATION_FIELDS = [
  'title',
  'description',
  'eyebrow',
  'heading',
  'intro',
] as const

function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname === '/' ? '/' : pathname}`
}

export function getPagePresentation(
  locale: SupportedLocale,
  page: PilotPageKey,
): PagePresentation {
  const dictionary = getDictionary(locale).common
  const values = Object.fromEntries(PRESENTATION_FIELDS.map((field) => {
    const key = `page.${page}.${field}`
    const value = translate(dictionary, key)
    if (value === key) {
      throw new Error(`Missing page presentation key: ${key} (${locale})`)
    }
    return [field, value]
  }))

  return values as PagePresentation
}

type LocalizedMetadataInput = {
  locale: SupportedLocale
  page: PilotPageKey
  pathname: string
  titleOverride?: string
  descriptionOverride?: string
}

export function buildLocalizedPageMetadata({
  locale,
  page,
  pathname,
  titleOverride,
  descriptionOverride,
}: LocalizedMetadataInput): Metadata {
  const presentation = getPagePresentation(locale, page)
  const canonicalPath = buildLocalePath(pathname, locale)
  const title = titleOverride ?? presentation.title
  const description = descriptionOverride ?? presentation.description
  const languages = Object.fromEntries(publicLocales.map((publicLocale) => [
    publicLocale,
    buildLocalePath(pathname, publicLocale),
  ]))

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: 'website',
      url: absoluteUrl(canonicalPath),
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ['/twitter-image'],
    },
  }
}
