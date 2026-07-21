import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import IncidentTimelinePage from '../../../../components/incidents/incident-timeline-page'
import {
  incidentPageCount,
  incidentPageHref,
} from '../../../../lib/incidents/incident-pagination'
import { SITE_NAME, SITE_URL } from '../../../../lib/site-constants'

type IncidentPageProps = {
  params: Promise<{ page: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  const totalPages = incidentPageCount()
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    page: String(index + 2),
  }))
}

function parsePage(value: string) {
  if (!/^\d+$/.test(value)) return null
  const pageNumber = Number(value)
  if (!Number.isSafeInteger(pageNumber) || pageNumber < 2 || pageNumber > incidentPageCount()) return null
  return pageNumber
}

export async function generateMetadata({ params }: IncidentPageProps): Promise<Metadata> {
  const { page } = await params
  const pageNumber = parsePage(page)
  if (!pageNumber) return { title: 'Incident page not found' }

  const canonical = incidentPageHref(pageNumber)
  const title = `Exchange Incident Timeline — Page ${pageNumber}`
  const description = `Reviewed Historical Exchange Index incident records, page ${pageNumber} of ${incidentPageCount()}.`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${canonical}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
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

export default async function PaginatedIncidentTimelinePage({ params }: IncidentPageProps) {
  const { page } = await params
  const pageNumber = parsePage(page)
  if (!pageNumber) notFound()
  return <IncidentTimelinePage pageNumber={pageNumber} />
}
