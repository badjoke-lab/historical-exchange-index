import type { Metadata } from 'next'
import IncidentTimelinePage from '../../components/incidents/incident-timeline-page'
import { buildLocalizedPageMetadata } from '../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({
    locale: 'en',
    page: 'incidents',
    pathname: '/incidents/',
  })
}

export default function ExchangeIncidentTimelinePage() {
  return <IncidentTimelinePage pageNumber={1} />
}
