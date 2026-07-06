import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Methodology',
  description: 'How Historical Exchange Index defines records, status, evidence reliability, URL handling, and uncertainty.',
  canonicalPath: '/methodology',
})

export default function MethodologyLayout({ children }: { children: ReactNode }) {
  return children
}
