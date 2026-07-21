import type { ReactNode } from 'react'
import RelatedSurfaceLinks from '../../components/navigation/related-surface-links'
import StatsExplorerDeepLinks from '../../components/stats/stats-explorer-deep-links'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Stats',
  description: 'Snapshot, coverage, and historical distributions across the Historical Exchange Index registry.',
  canonicalPath: '/stats',
})

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div style={{ margin: '22px 0 12px' }}>
        <p className="muted" style={{ margin: '0 0 6px', fontSize: '12px' }}>Registry analytics</p>
        <h1 style={{ margin: 0, fontSize: '34px', letterSpacing: '-0.04em' }}>Stats</h1>
      </div>
      {children}
      <StatsExplorerDeepLinks />
      <RelatedSurfaceLinks links={[{ href: '/quality', label: 'Evidence Health & Data Quality' }]} />
    </div>
  )
}
