import { Suspense } from 'react'
import type { Metadata } from 'next'
import DeadExplorerClient from '../../components/registry/dead-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import { CORRECTION_HREF } from '../../lib/site-constants'

const DEAD_SIDE = new Set<string>(['dead', 'merged', 'acquired', 'rebranded'])

export const metadata: Metadata = {
  title: 'Dead exchanges',
  description:
    'Browse the dead-side registry of crypto exchanges, including dead, merged, acquired, and rebranded records with archive-aware handling.',
  alternates: {
    canonical: '/dead',
  },
}

export default function DeadPage() {
  const entities = loadEntities()
    .filter((item) => DEAD_SIDE.has(item.status))
    .sort((a, b) => {
      const aDate = a.death_date ?? ''
      const bDate = b.death_date ?? ''
      if (aDate !== bDate) return aDate < bDate ? 1 : -1
      return a.canonical_name.localeCompare(b.canonical_name)
    })

  const summary = {
    total: entities.length,
    dead: entities.filter((item) => item.status === 'dead').length,
    merged: entities.filter((item) => item.status === 'merged').length,
    acquired: entities.filter((item) => item.status === 'acquired').length,
    rebranded: entities.filter((item) => item.status === 'rebranded').length,
    archiveCoverage: entities.length > 0
      ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
      : 0,
  }

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Dead Exchanges</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Dead-side registry</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>
              Closed, absorbed, rebranded, or otherwise gone exchanges. This page emphasizes death reason,
              archive access, and dense graveyard browsing.
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
        <DeadExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </main>
  )
}
