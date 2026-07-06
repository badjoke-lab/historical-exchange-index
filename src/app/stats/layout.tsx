import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Stats',
  description: 'Snapshot, coverage, and historical distributions across the Historical Exchange Index registry.',
  canonicalPath: '/stats',
})

export default function StatsLayout({ children }: { children: ReactNode }) {
  return children
}
