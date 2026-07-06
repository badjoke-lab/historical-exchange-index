import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Exchange Incident Timeline',
  description: 'Reviewed exchange incidents and shutdown milestones recorded in the Historical Exchange Index.',
  canonicalPath: '/incidents',
})

export default function IncidentsLayout({ children }: { children: ReactNode }) {
  return children
}
