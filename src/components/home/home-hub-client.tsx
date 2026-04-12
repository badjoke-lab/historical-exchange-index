'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { EntityRecord } from '../../lib/types/entity'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'

type HomeSummary = {
  total: number
  activeSide: number
  deadSide: number
  cex: number
  dex: number
  hybrid: number
}

type Props = {
  entities: EntityRecord[]
  summary: HomeSummary
  archiveCoverage: number
}

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

function chipClass(status: string) {
  return `chip ${status}`
}

function sortPreview(items: EntityRecord[]) {
  return [...items].sort((a, b) => {
    const aDead = DEAD_SIDE.has(a.status) ? 1 : 0
    const bDead = DEAD_SIDE.has(b.status) ? 1 : 0

    if (aDead !== bDead) return bDead - aDead

    const aDate = a.death_date ?? a.launch_date ?? ''
    const bDate = b.death_date ?? b.launch_date ?? ''
    if (aDate !== bDate) return aDate < bDate ? 1 : -1

    return a.canonical_name.localeCompare(b.canonical_name)
  })
}

export default function HomeHubClient({ entities, summary, archiveCoverage }: Props) {
  const [query, setQuery] = useState('')

  const recentUpdated = useMemo(() => {
    return [...entities]
      .sort((a, b) => {
        if (a.last_verified_at !== b.last_verified_at) {
          return a.last_verified_at < b.last_verified_at ? 1 : -1
        }
        return a.canonical_name.localeCompare(b.canonical_name)
      })
      .slice(0, 6)
  }, [entities])

  const searchState = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) {
      return {
        total: 0,
        deadCount: 0,
        activeCount: 0,
        preview: [] as EntityRecord[],
      }
    }

    const matches = entities.filter((entity) => {
      const haystack = [
        entity.canonical_name,
        ...entity.aliases,
        entity.official_domain_original ?? '',
        entity.country_or_origin ?? '',
        entity.summary,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })

    return {
      total: matches.length,
      deadCount: matches.filter((item) => DEAD_SIDE.has(item.status)).length,
      activeCount: matches.filter((item) => ACTIVE_SIDE.has(item.status)).length,
      preview: sortPreview(matches).slice(0, 6),
    }
  }, [entities, query])

  return (
    <main className="home-hub">
      <section className="hero compact-hero">
        <div className="panel hero-main">
          <div className="eyebrow">Archive-first · History-first · Quiet registry</div>
          <h2>Historical Exchange Index</h2>
          <p>
            A quiet registry of crypto exchanges, active and gone. Use home to search the registry and
            choose whether to browse the dead-side or active-side history views.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/dead">Browse Dead</Link>
            <Link className="btn" href="/active">Browse Active</Link>
          </div>
        </div>
      </section>

      <section className="panel summary-strip summary-strip-home">
        <div className="summary-tile tile-home-total">
          <div className="label">Total records</div>
          <div className="value">{summary.total}</div>
          <div className="hint">entity-level registry count</div>
        </div>
        <div className="summary-tile tile-home-dead">
          <div className="label">Dead-side</div>
          <div className="value">{summary.deadSide}</div>
          <div className="hint">dead · merged · acquired · rebranded</div>
        </div>
        <div className="summary-tile tile-home-active">
          <div className="label">Active-side</div>
          <div className="value">{summary.activeSide}</div>
          <div className="hint">active · limited · inactive</div>
        </div>
        <div className="summary-tile tile-home-archive">
          <div className="label">Archive coverage</div>
          <div className="value">{archiveCoverage}%</div>
          <div className="hint">entries with archived URLs</div>
        </div>
      </section>

      <section className="panel home-search-panel">
        <div className="home-section-copy">
          <h3>Search all records</h3>
          <p>Search across the registry by exchange name, alias, domain, origin, or summary.</p>
        </div>
        <div className="search">
          <input
            className="field"
            placeholder="Search by exchange name / alias / domain / origin"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </section>

      <section className="home-entry-grid">
        <section className="panel home-entry-card">
          <div className="home-section-copy">
            <h3>Dead-side registry</h3>
            <p>Closed, merged, acquired, or rebranded exchanges. Default browse path: newest death first.</p>
          </div>
          <div className="home-inline-meta">
            <span className="chip dead">{summary.deadSide} records</span>
            <span className="muted">dead / merged / acquired / rebranded</span>
          </div>
          <div>
            <Link className="btn btn-primary" href="/dead">Open Dead</Link>
          </div>
        </section>

        <section className="panel home-entry-card">
          <div className="home-section-copy">
            <h3>Active-side registry</h3>
            <p>Active, limited, or inactive exchanges. Default browse path: stable scan order for current records.</p>
          </div>
          <div className="home-inline-meta">
            <span className="chip active">{summary.activeSide} records</span>
            <span className="muted">active / limited / inactive</span>
          </div>
          <div>
            <Link className="btn" href="/active">Open Active</Link>
          </div>
        </section>
      </section>

      {query.trim() ? (
        <section className="panel home-preview-panel">
          <div className="home-section-copy">
            <h3>Search preview</h3>
            <p>
              {searchState.total} matches · {searchState.deadCount} dead-side · {searchState.activeCount} active-side
            </p>
          </div>

          {searchState.preview.length === 0 ? (
            <div className="record-empty">
              <div className="name-cell">
                <span className="name-main">No matching records</span>
                <span className="name-sub">Try a broader name, alias, or domain.</span>
              </div>
            </div>
          ) : (
            <div className="home-list">
              {searchState.preview.map((entity) => (
                <div className="home-list-item" key={entity.id}>
                  <div className="home-item-main">
                    <Link className="home-item-title subtle-link" href={`/exchange/${entity.slug}/`}>
                      {entity.canonical_name}
                    </Link>
                    <div className="home-item-meta">
                      <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                      <span>{formatYears(entity.launch_date, entity.death_date)}</span>
                      <span>{entity.country_or_origin ?? '—'}</span>
                    </div>
                  </div>
                  <div>
                    <Link className="btn" href={`/exchange/${entity.slug}/`}>Open</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="home-preview-actions">
            <Link className="btn btn-primary" href="/dead">Open Dead registry</Link>
            <Link className="btn" href="/active">Open Active registry</Link>
          </div>
        </section>
      ) : null}

      <section className="panel home-recent-panel">
        <div className="home-section-copy">
          <h3>Recently updated</h3>
          <p>Latest verified or revised records in the registry.</p>
        </div>
        <div className="home-list">
          {recentUpdated.map((entity) => (
            <div className="home-list-item" key={entity.id}>
              <div className="home-item-main">
                <Link className="home-item-title subtle-link" href={`/exchange/${entity.slug}/`}>
                  {entity.canonical_name}
                </Link>
                <div className="home-item-meta">
                  <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                  <span>{formatYears(entity.launch_date, entity.death_date)}</span>
                  <span>verified {entity.last_verified_at.slice(0, 10)}</span>
                </div>
              </div>
              <div>
                <Link className="btn" href={`/exchange/${entity.slug}/`}>Open</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
