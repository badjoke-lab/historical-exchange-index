import { Suspense } from 'react'
import type { Metadata } from 'next'
import ActiveExplorerClient from '../../components/registry/active-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import { CORRECTION_HREF } from '../../lib/site-constants'

const ACTIVE_SIDE = new Set<string>(['active', 'limited', 'inactive'])

export const metadata: Metadata = {
  title: 'Active exchanges',
  description:
    'Browse the active-side registry of crypto exchanges, including active, limited, and inactive records with URL handling and launch timing.',
  alternates: {
    canonical: '/active',
  },
}

export default function ActivePage() {
  const entities = loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))

  const summary = {
    total: entities.length,
    active: entities.filter((item) => item.status === 'active').length,
    limited: entities.filter((item) => item.status === 'limited').length,
    inactive: entities.filter((item) => item.status === 'inactive').length,
    liveVerified: entities.filter((item) => item.official_url_status === 'live_verified').length,
    archiveCoverage: entities.length > 0
      ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
      : 0,
  }

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Active Exchanges</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Active-side registry</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>
              Active, limited, and inactive-side entries. This page emphasizes active-side classification,
              URL status clarity, and launch timing without turning the registry into a ranking page.
            </p>
          </div>

          <div className="hero-actions" style={{ marginTop: 0 }}>
            <a className="btn" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
              Submit correction
            </a>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="panel table-panel">
            <div className="results-meta">
              <div>Loading registry…</div>
            </div>
          </section>
        }
      >
        <ActiveExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </main>
  )
}
