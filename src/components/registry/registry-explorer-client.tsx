'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { EntityRecord } from '../../lib/types/entity'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { CORRECTION_HREF } from '../../lib/site-constants'

type RegistrySummary = {
  total: number
  activeSide: number
  deadSide: number
  cex: number
  dex: number
  hybrid: number
}

type Props = {
  entities: EntityRecord[]
  summary: RegistrySummary
  archiveCoverage: number
}

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

type TypeFilter = 'all' | 'cex' | 'dex' | 'hybrid'
type StatusFilter =
  | 'all'
  | 'dead_side'
  | 'active_side'
  | 'active'
  | 'limited'
  | 'inactive'
  | 'dead'
  | 'merged'
  | 'acquired'
  | 'rebranded'
type SortMode = 'registry' | 'name_asc' | 'launch_desc' | 'death_desc'

function chipClass(status: string) {
  return `chip ${status}`
}

function matchesStatusFilter(status: string, filter: StatusFilter) {
  if (filter === 'all') return true
  if (filter === 'dead_side') return DEAD_SIDE.has(status)
  if (filter === 'active_side') return ACTIVE_SIDE.has(status)
  return status === filter
}

function sortRegistryLike(items: EntityRecord[]) {
  return [...items].sort((a, b) => {
    const aDead = DEAD_SIDE.has(a.status) ? 1 : 0
    const bDead = DEAD_SIDE.has(b.status) ? 1 : 0

    if (aDead !== bDead) return bDead - aDead

    if (aDead === 1 && bDead === 1) {
      const aDate = a.death_date ?? ''
      const bDate = b.death_date ?? ''
      if (aDate !== bDate) return aDate < bDate ? 1 : -1
    }

    return a.canonical_name.localeCompare(b.canonical_name)
  })
}

function sortByMode(items: EntityRecord[], mode: SortMode) {
  if (mode === 'registry') return sortRegistryLike(items)

  if (mode === 'name_asc') {
    return [...items].sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))
  }

  if (mode === 'launch_desc') {
    return [...items].sort((a, b) => {
      const aDate = a.launch_date ?? ''
      const bDate = b.launch_date ?? ''
      if (aDate !== bDate) return aDate < bDate ? 1 : -1
      return a.canonical_name.localeCompare(b.canonical_name)
    })
  }

  return [...items].sort((a, b) => {
    const aDate = a.death_date ?? ''
    const bDate = b.death_date ?? ''
    if (aDate !== bDate) return aDate < bDate ? 1 : -1
    return a.canonical_name.localeCompare(b.canonical_name)
  })
}

export default function RegistryExplorerClient({ entities, summary, archiveCoverage }: Props) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('registry')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    const slice = entities.filter((entity) => {
      if (typeFilter !== 'all' && entity.type !== typeFilter) return false
      if (!matchesStatusFilter(entity.status, statusFilter)) return false

      if (!q) return true

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

    return sortByMode(slice, sortMode)
  }, [entities, query, typeFilter, statusFilter, sortMode])

  const featured = filtered[0] ?? entities[0] ?? null
  const featuredArchive = featured?.archived_url ? 'Available' : 'Missing'

  return (
    <>
      <section className="hero">
        <div className="panel hero-main">
          <div className="eyebrow">Entity-first registry · Archive-aware · Evidence-backed</div>
          <h2>Track the lifecycle of exchanges, not just who is still alive.</h2>
          <p>
            HEI is designed as a historical registry rather than a ranking table. It keeps active entities,
            dead exchanges, absorbed brands, rebrands, timeline events, and evidence in one place.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/dead">Browse dead-side entries</Link>
            <Link className="btn" href="/methodology">Read methodology</Link>
            <a className="btn" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
              Submit a correction
            </a>
          </div>
        </div>

        <aside className="panel hero-side">
          <div className="stat-card">
            <div className="label">Total entities</div>
            <div className="value">{summary.total}</div>
            <div className="delta">Entity-level count, v0 model</div>
          </div>
          <div className="stat-card">
            <div className="label">Dead-side</div>
            <div className="value">{summary.deadSide}</div>
            <div className="delta">dead · merged · acquired · rebranded</div>
          </div>
          <div className="stat-card">
            <div className="label">Active-side</div>
            <div className="value">{summary.activeSide}</div>
            <div className="delta">active · limited · inactive</div>
          </div>
          <div className="stat-card">
            <div className="label">Archive coverage</div>
            <div className="value">{archiveCoverage}%</div>
            <div className="delta">entries with archived URLs</div>
          </div>
        </aside>
      </section>

      <section className="overview">
        <div className="panel table-panel">
          <div className="controls">
            <div className="search">
              <input
                className="field"
                placeholder="Search by name, alias, domain, origin, summary"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <select
              className="field"
              style={{ maxWidth: '180px' }}
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            >
              <option value="all">All types</option>
              <option value="cex">CEX</option>
              <option value="dex">DEX</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              className="field"
              style={{ maxWidth: '210px' }}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="dead_side">Dead-side</option>
              <option value="active_side">Active-side</option>
              <option value="active">Active</option>
              <option value="limited">Limited</option>
              <option value="inactive">Inactive</option>
              <option value="dead">Dead</option>
              <option value="merged">Merged</option>
              <option value="acquired">Acquired</option>
              <option value="rebranded">Rebranded</option>
            </select>

            <select
              className="field"
              style={{ maxWidth: '210px' }}
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
            >
              <option value="registry">Registry order</option>
              <option value="name_asc">Name A–Z</option>
              <option value="launch_desc">Newest launch</option>
              <option value="death_desc">Newest death</option>
            </select>
          </div>

          <div className="results-meta">
            <div>
              {query ? `Search: "${query}" · ` : ''}
              type={typeFilter} · status={statusFilter} · sort={sortMode}
            </div>
            <div>{filtered.length} results in current slice</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Death reason</th>
                <th>Years</th>
                <th>Origin</th>
                <th>Domain</th>
                <th>Archive</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td data-label="Results" colSpan={8}>
                    <div className="name-cell">
                      <span className="name-main">No matching records</span>
                      <span className="name-sub">
                        Try clearing filters or broadening the search query.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((entity) => (
                  <tr key={entity.id}>
                    <td data-label="Name">
                      <div className="name-cell">
                        <Link className="name-main subtle-link" href={`/exchange/${entity.slug}/`}>
                          {entity.canonical_name}
                        </Link>
                        <span className="name-sub">
                          {entity.aliases.length > 0
                            ? entity.aliases.join(', ')
                            : entity.official_domain_original ?? '—'}
                        </span>
                      </div>
                    </td>
                    <td data-label="Type">
                      <span className="chip type">{entity.type.toUpperCase()}</span>
                    </td>
                    <td data-label="Status">
                      <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                    </td>
                    <td data-label="Death reason">
                      {entity.death_reason ? (
                        <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td data-label="Years">{formatYears(entity.launch_date, entity.death_date)}</td>
                    <td data-label="Origin">{entity.country_or_origin ?? '—'}</td>
                    <td data-label="Domain">{entity.official_domain_original ?? '—'}</td>
                    <td data-label="Archive">
                      {entity.archived_url ? (
                        <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">
                          archive
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="panel detail-panel">
          {featured ? (
            <>
              <div className="detail-header">
                <div>
                  <h3>{featured.canonical_name}</h3>
                  <p>{featured.summary}</p>
                </div>
                <div className="chips">
                  <span className="chip type">{featured.type.toUpperCase()}</span>
                  <span className={chipClass(featured.status)}>{STATUS_LABELS[featured.status]}</span>
                </div>
              </div>

              <div className="section">
                <h4>Current slice lead</h4>
                <div className="fact-grid">
                  <div className="fact"><div className="k">Launch</div><div className="v">{featured.launch_date?.slice(0, 4) ?? '—'}</div></div>
                  <div className="fact"><div className="k">Death</div><div className="v">{featured.death_date ?? '—'}</div></div>
                  <div className="fact"><div className="k">Origin</div><div className="v">{featured.country_or_origin ?? '—'}</div></div>
                  <div className="fact"><div className="k">Archive</div><div className="v">{featuredArchive}</div></div>
                </div>
              </div>

              <div className="section">
                <h4>Quick actions</h4>
                <div className="fact-grid">
                  <div className="fact">
                    <div className="k">Detail page</div>
                    <div className="v">
                      <Link className="archive-link" href={`/exchange/${featured.slug}/`}>Open record</Link>
                    </div>
                  </div>
                  <div className="fact">
                    <div className="k">Correction</div>
                    <div className="v">
                      <a className="subtle-link" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
                        Report an error
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout">
                Search and filters only affect the current client-side slice. Records may still be incomplete,
                revised, or reclassified as evidence improves.
              </div>
            </>
          ) : null}
        </aside>
      </section>
    </>
  )
}
