import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Monthly Historical Exchange Snapshot',
  description: 'A reviewed monthly snapshot of significant exchange lifecycle and incident events recorded in the Historical Exchange Index.',
  canonicalPath: '/monthly',
})

export default function MonthlyLayout({ children }: { children: ReactNode }) {
  return children
}
