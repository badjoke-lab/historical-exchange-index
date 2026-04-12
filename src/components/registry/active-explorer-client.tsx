'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { EntityRecord } from '../../lib/types/entity'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { URL_STATUS_LABELS } from '../../lib/utils/url-meta'

type ActiveSummary = {
  total: number
  active: number
  limited: number
  inactive: number
  liveVerified: number
  archiveCoverage: number
}

type Props = {
  entities: EntityRecord[]
  summary: ActiveSummary
}

type TypeFilter = 'all' | 'cex' | 'dex' | 'hybrid'
type StatusFilter = 'all' | 'active' | 'limited' | 'inactive'
type UrlFilter =
  | 'all'
  | 'live_verified'
  | 'live_unverified'
  | 'dead_domain'
  | 'redirected'
  | 'repurposed'
  | 'unsafe'
  | 'unknown'

const INITIAL_VISIBLE = 24
const LOAD_MORE_STEP = 24

function chipClass(status: string) {
  return `chip ${status}`
}

function formatLaunchYear(value: string | null) {
  return value ? value.slice(0, 4) : '—'
}

function ActiveRegistrySlice({ filtered }: { filtered: EntityRecord[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const remaining = Math.max(filtered.length - visible.length, 0)

  return (
    <>
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Launch year</th>
              <th>Origin</th>
              <th>Domain</th>
              <th>URL status</th>
              <th>Archive</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="name-cell">
                    <span className="name-main">No matching records</span>
                    <span className="name-sub">Try clearing filters or broadening the search query.</span>
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((entity) => (
                <tr key={entity.id}>
                  <td>
                    <div className="name-cell">
                      <Link className="name-main subtle-link" href={`/exchange/${entity.slug}/`}>
                        {entity.canonical_name}
                      </Link>
                      <span className="name-sub">
                        {entity.aliases.length > 0 ? entity.aliases.join(', ') : entity.type.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="chip type">{entity.type.toUpperCase()}</span>
                  </td>
                  <td>
                    <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                  </td>
                  <td>{formatLaunchYear(entity.launch_date)}</td>
                  <td>{entity.country_or_origin ?? '—'}</td>
                  <td>{entity.official_domain_original ?? '—'}</td>
                  <td>{URL_STATUS_LABELS[entity.official_url_status]}</td>
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
        {visible.length === 0 ? (
          <div className="record-empty">
            <div className="name-cell">
              <span className="name-main">No matching records</span>
              <span className="name-sub">Try clearing filters or broadening the search query.</span>
            </div>
          </div>
        ) : (
          <div className="record-list">
            {visible.map((entity) => (
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
                  <span>{formatLaunchYear(entity.launch_date)}</span>
                  <span>{URL_STATUS_LABELS[entity.official_url_status]}</span>
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

      {remaining > 0 ? (
        <div className="registry-load-more">
          <button
            type="button"
            className="btn"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
          >
            Load more
          </button>
          <div className="registry-load-more-note">{remaining} remaining in current slice</div>
        </div>
      ) : null}
    </>
  )
}

export default function ActiveExplorerClient({ entities, summary }: Props) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [urlFilter, setUrlFilter] = useState<UrlFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return entities.filter((entity) => {
      if (typeFilter !== 'all' && entity.type !== typeFilter) return false
      if (statusFilter !== 'all' && entity.status !== statusFilter) return false
      if (urlFilter !== 'all' && entity.official_url_status !== urlFilter) return false

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
  }, [entities, query, typeFilter, statusFilter, urlFilter])

  const sliceKey = `${query.trim().toLowerCase()}::${typeFilter}::${statusFilter}::${urlFilter}`

  return (
    <>
      <section className="panel summary-strip summary-strip-active">
        <div className="summary-tile tile-active-total">
          <div className="label">Active-side total</div>
          <div className="value">{summary.total}</div>
          <div className="hint">active / limited / inactive</div>
        </div>
        <div className="summary-tile tile-active-active">
          <div className="label">Active</div>
          <div className="value">{summary.active}</div>
          <div className="hint">currently active</div>
        </div>
        <div className="summary-tile tile-active-limited">
          <div className="label">Limited</div>
          <div className="value">{summary.limited}</div>
          <div className="hint">partially limited</div>
        </div>
        <div className="summary-tile tile-active-inactive">
          <div className="label">Inactive</div>
          <div className="value">{summary.inactive}</div>
          <div className="hint">not conclusively dead</div>
        </div>
        <div className="summary-tile tile-active-live">
          <div className="label">Live verified</div>
          <div className="value">{summary.liveVerified}</div>
          <div className="hint">URL status live verified</div>
        </div>
        <div className="summary-tile tile-active-archive">
          <div className="label">Archive coverage</div>
          <div className="value">{summary.archiveCoverage}%</div>
          <div className="hint">entries with archived URLs</div>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="controls">
          <div className="search">
            <input
              className="field"
              placeholder="Search active-side by name, alias, domain, origin, summary"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            className="field mobile-hide"
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
            <option value="all">All active-side statuses</option>
            <option value="active">Active</option>
            <option value="limited">Limited</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="field"
            value={urlFilter}
            onChange={(event) => setUrlFilter(event.target.value as UrlFilter)}
          >
            <option value="all">All URL statuses</option>
            <option value="live_verified">Live verified</option>
            <option value="live_unverified">Live unverified</option>
            <option value="dead_domain">Dead domain</option>
            <option value="redirected">Redirected</option>
            <option value="repurposed">Repurposed</option>
            <option value="unsafe">Unsafe</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="results-meta">
          <div>
            {query ? `Search: "${query}" · ` : ''}
            type={typeFilter} · status={statusFilter} · url={urlFilter}
          </div>
          <div>Showing {Math.min(filtered.length, INITIAL_VISIBLE)}+ / {filtered.length}</div>
        </div>

        <ActiveRegistrySlice key={sliceKey} filtered={filtered} />
      </section>
    </>
  )
}
