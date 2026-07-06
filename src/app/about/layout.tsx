import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'About',
  description: 'About Historical Exchange Index, a historical registry of crypto exchanges across active and terminal lifecycle states.',
  canonicalPath: '/about',
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
