'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
type ActiveSort = 'name_asc' | 'name_desc' | 'launch_desc' | 'launch_asc'

const INITIAL_VISIBLE = 24
const LOAD_MORE_STEP = 24
const DEFAULT_SORT: ActiveSort = 'name_asc'

function chipClass(status: string) {
  return `chip ${status}`
}

function formatLaunchYear(value: string | null) {
  return value ? value.slice(0, 4) : '—'
}

function getTypeLabel(value: TypeFilter) {
  return value === 'hybrid' ? 'Hybrid' : value.toUpperCase()
}

function getActiveSortLabel(sort: ActiveSort) {
  if (sort === 'name_desc') return 'Name Z–A'
  if (sort === 'launch_desc') return 'Newest launches'
  if (sort === 'launch_asc') return 'Earliest launches'
  return 'Name A–Z'
}

function isTypeFilter(value: string | null): value is Exclude<TypeFilter, 'all'> {
  return value === 'cex' || value === 'dex' || value === 'hybrid'
}

function isStatusFilter(value: string | null): value is Exclude<StatusFilter, 'all'> {
  return value === 'active' || value === 'limited' || value === 'inactive'
}

function isUrlFilter(value: string | null): value is Exclude<UrlFilter, 'all'> {
  return (
    value === 'live_verified' ||
    value === 'live_unverified' ||
    value === 'dead_domain' ||
    value === 'redirected' ||
    value === 'repurposed' ||
    value === 'unsafe' ||
    value === 'unknown'
  )
}

function isActiveSort(value: string | null): value is ActiveSort {
  return value === 'name_asc' || value === 'name_desc' || value === 'launch_desc' || value === 'launch_asc'
}

function compareMaybeDateDesc(a: string | null, b: string | null) {
  const aa = a ?? ''
  const bb = b ?? ''
  if (aa !== bb) return aa < bb ? 1 : -1
  return 0
}

function compareMaybeDateAsc(a: string | null, b: string | null) {
  const aa = a ?? ''
  const bb = b ?? ''
  if (aa !== bb) return aa > bb ? 1 : -1
  return 0
}

function sortActiveEntities(items: EntityRecord[], sort: ActiveSort) {
  return [...items].sort((a, b) => {
    if (sort === 'name_desc') {
      return b.canonical_name.localeCompare(a.canonical_name)
    }

    if (sort === 'launch_desc') {
      const cmp = compareMaybeDateDesc(a.launch_date, b.launch_date)
      return cmp !== 0 ? cmp : a.canonical_name.localeCompare(b.canonical_name)
    }

    if (sort === 'launch_asc') {
      const cmp = compareMaybeDateAsc(a.launch_date, b.launch_date)
      return cmp !== 0 ? cmp : a.canonical_name.localeCompare(b.canonical_name)
    }

    return a.canonical_name.localeCompare(b.canonical_name)
  })
}

function ActiveRegistrySlice({
  filtered,
  metaText,
}: {
  filtered: EntityRecord[]
  metaText: string
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const remaining = Math.max(filtered.length - visible.length, 0)
  const nextLoadCount = Math.min(LOAD_MORE_STEP, remaining)

  return (
    <>
      <div className="results-meta">
        <div>{metaText}</div>
        <div>Showing {visible.length} of {filtered.length}</div>
      </div>

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
            Load {nextLoadCount} more
          </button>
          <div className="registry-load-more-note">{remaining} remaining in current slice</div>
        </div>
      ) : null}
    </>
  )
}

export default function ActiveExplorerClient({ entities, summary }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const rawType = searchParams.get('type')
  const rawStatus = searchParams.get('status')
  const rawUrl = searchParams.get('url')
  const rawSort = searchParams.get('sort')

  const typeFilter: TypeFilter = isTypeFilter(rawType) ? rawType : 'all'
  const statusFilter: StatusFilter = isStatusFilter(rawStatus) ? rawStatus : 'all'
  const urlFilter: UrlFilter = isUrlFilter(rawUrl) ? rawUrl : 'all'
  const sort: ActiveSort = isActiveSort(rawSort) ? rawSort : DEFAULT_SORT

  const setParam = (key: string, value: string, defaultValue = 'all') => {
    const params = new URLSearchParams(searchParams.toString())
    const trimmed = value.trim()

    if (!trimmed || trimmed === defaultValue) {
      params.delete(key)
    } else {
      params.set(key, trimmed)
    }

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }

  const clearAll = () => {
    router.replace(pathname, { scroll: false })
  }

  const hasActiveFilters =
    Boolean(query.trim()) ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    urlFilter !== 'all' ||
    sort !== DEFAULT_SORT

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    const base = entities.filter((entity) => {
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

    return sortActiveEntities(base, sort)
  }, [entities, query, typeFilter, statusFilter, urlFilter, sort])

  const metaParts = []
  if (query) metaParts.push(`Search: "${query}"`)
  if (typeFilter !== 'all') metaParts.push(`Type: ${getTypeLabel(typeFilter)}`)
  if (statusFilter !== 'all') metaParts.push(`Status: ${STATUS_LABELS[statusFilter]}`)
  if (urlFilter !== 'all') metaParts.push(`URL: ${URL_STATUS_LABELS[urlFilter]}`)
  metaParts.push(`Sort: ${getActiveSortLabel(sort)}`)

  const sliceKey = `${query.trim().toLowerCase()}::${typeFilter}::${statusFilter}::${urlFilter}::${sort}`
  const metaText = metaParts.join(' · ')

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
              onChange={(event) => setParam('q', event.target.value, '')}
            />
          </div>

          <select
            className="field mobile-hide"
            value={typeFilter}
            onChange={(event) => setParam('type', event.target.value)}
          >
            <option value="all">All types</option>
            <option value="cex">CEX</option>
            <option value="dex">DEX</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            className="field"
            value={statusFilter}
            onChange={(event) => setParam('status', event.target.value)}
          >
            <option value="all">All active-side statuses</option>
            <option value="active">Active</option>
            <option value="limited">Limited</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="field"
            value={urlFilter}
            onChange={(event) => setParam('url', event.target.value)}
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

          <select
            className="field"
            value={sort}
            onChange={(event) => setParam('sort', event.target.value, DEFAULT_SORT)}
          >
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="launch_desc">Newest launches</option>
            <option value="launch_asc">Earliest launches</option>
          </select>
        </div>

        {hasActiveFilters ? (
          <div className="registry-toolbar-actions">
            <button type="button" className="btn btn-ghost" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        ) : null}

        <ActiveRegistrySlice key={sliceKey} filtered={filtered} metaText={metaText} />
      </section>
    </>
  )
}
