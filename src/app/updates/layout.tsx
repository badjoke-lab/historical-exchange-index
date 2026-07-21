import type { ReactNode } from 'react'
import RelatedSurfaceLinks from '../../components/navigation/related-surface-links'
import { buildRouteSocialMetadata } from '../../lib/metadata/build-route-social-metadata'

export const metadata = buildRouteSocialMetadata({
  title: 'Registry Updates',
  description: 'Reviewed public changes to the Historical Exchange Index registry.',
  canonicalPath: '/updates',
})

export default function UpdatesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <RelatedSurfaceLinks
        links={[
          { href: '/incidents', label: 'Incident Timeline' },
          { href: '/monthly', label: 'Monthly Snapshot' },
        ]}
      />
    </>
  )
}
