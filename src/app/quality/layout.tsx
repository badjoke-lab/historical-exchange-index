import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Evidence Health & Data Quality',
  description: 'Coverage, confidence, completeness, and review freshness metrics for the Historical Exchange Index.',
  canonicalPath: '/quality',
})

export default function QualityLayout({ children }: { children: ReactNode }) {
  return children
}
