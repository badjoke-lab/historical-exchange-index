import type { ReactNode } from 'react'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Donate',
  description: 'Support Historical Exchange Index and its ongoing registry maintenance, verification, and archive work.',
  canonicalPath: '/donate',
})

export default function DonateLayout({ children }: { children: ReactNode }) {
  return children
}
