import type { ReactNode } from 'react'
import RelatedSurfaceLinks from '../../components/navigation/related-surface-links'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Stats',
  description: 'Snapshot, coverage, and historical distributions across the Historical Exchange Index registry.',
  canonicalPath: '/stats',
})

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RelatedSurfaceLinks links={[{ href: '/quality', label: 'Evidence Health & Data Quality' }]} />
      {children}
    </>
  )
}
