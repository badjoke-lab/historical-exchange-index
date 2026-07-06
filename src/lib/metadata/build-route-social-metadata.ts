import type { Metadata } from 'next'
import { SITE_NAME } from '../site-constants'

type RouteSocialMetadataInput = {
  title: string
  description: string
  canonicalPath: string
}

export function buildRouteSocialMetadata({
  title,
  description,
  canonicalPath,
}: RouteSocialMetadataInput): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`

  return {
    openGraph: {
      type: 'website',
      url: canonicalPath,
      title: socialTitle,
      description,
      siteName: SITE_NAME,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: ['/twitter-image'],
    },
  }
}
