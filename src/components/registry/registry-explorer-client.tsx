'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { EntityRecord } from '../../lib/types/entity'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { CONTACT_HREF } from '../../lib/site-constants'

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

  return (
    <>
      <section className="hero compact-hero">
        <div className="panel hero-main">
          <div className="eyebrow">Entity-first registry · Archive-aware · Evidence-backed</div>
          <h2>Track exchange history without turning the registry into a landing page.</h2>
          <p>
            HEI is a quiet registry of crypto exchanges. The home page should surface the records quickly:
            compact summary, compact controls, dense desktop table, and compact tablet/mobile rows.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/dead">Browse dead-side entries</Link>
            <Link className="btn" href="/methodology">Read methodology</Link>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">
              Contact / corrections
            </a>
          </div>
        </div>
      </section>

      <section className="panel summary-strip summary-strip-home">
        <div className="summary-tile tile-home-total">
          <div className="label">Total</div>
          <div className="value">{summary.total}</div>
          <div className="hint">entity-level count</div>
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
        <div className="summary-tile tile-home-cex">
          <div className="label">CEX</div>
          <div className="value">{summary.cex}</div>
          <div className="hint">centralized exchanges</div>
        </div>
        <div className="summary-tile tile-home-archive">
          <div className="label">Archive coverage</div>
          <div className="value">{archiveCoverage}%</div>
          <div className="hint">entries with archived URLs</div>
        </div>
      </section>

      <section className="overview-single">
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
              className="field mobile-hide"
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

          <div className="desktop-table">
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
                    <td colSpan={8}>
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
                      <td>
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
                      <td>
                        <span className="chip type">{entity.type.toUpperCase()}</span>
                      </td>
                      <td>
                        <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                      </td>
                      <td>
                        {entity.death_reason ? (
                          <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>{formatYears(entity.launch_date, entity.death_date)}</td>
                      <td>{entity.country_or_origin ?? '—'}</td>
                      <td>{entity.official_domain_original ?? '—'}</td>
                      <td>
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

          <div className="compact-list">
            {filtered.length === 0 ? (
              <div className="record-empty">
                <div className="name-cell">
                  <span className="name-main">No matching records</span>
                  <span className="name-sub">Try clearing filters or broadening the search query.</span>
                </div>
              </div>
            ) : (
              <div className="record-list">
                {filtered.map((entity) => (
                  <div className="record-item" key={entity.id}>
                    <div className="record-top">
                      <div className="record-main">
                        <Link className="record-title subtle-link" href={`/exchange/${entity.slug}/`}>
                          {entity.canonical_name}
                        </Link>
                      </div>

                      <div className="record-chips">
                        <span className="chip type">{entity.type.toUpperCase()}</span>
                        <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                      </div>
                    </div>

                    <div className="record-meta">
                      <span>{formatYears(entity.launch_date, entity.death_date)}</span>
                      <span>{entity.country_or_origin ?? '—'}</span>
                      {entity.archived_url ? (
                        <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">
                          Archive
                        </a>
                      ) : (
                        <span className="muted">No archive</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
