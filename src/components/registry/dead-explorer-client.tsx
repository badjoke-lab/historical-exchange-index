'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { EntityRecord } from '../../lib/types/entity'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'

type DeadSummary = {
  total: number
  dead: number
  merged: number
  acquired: number
  rebranded: number
  archiveCoverage: number
}

type Props = {
  entities: EntityRecord[]
  summary: DeadSummary
}

type TypeFilter = 'all' | 'cex' | 'dex' | 'hybrid'
type StatusFilter = 'all' | 'dead' | 'merged' | 'acquired' | 'rebranded'
type ReasonFilter =
  | 'all'
  | 'hack'
  | 'insolvency'
  | 'regulation'
  | 'scam_rug'
  | 'merger'
  | 'acquisition'
  | 'rebrand'
  | 'voluntary_shutdown'
  | 'chain_failure'
  | 'unknown'

function chipClass(status: string) {
  return `chip ${status}`
}

export default function DeadExplorerClient({ entities, summary }: Props) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [reasonFilter, setReasonFilter] = useState<ReasonFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return entities.filter((entity) => {
      if (typeFilter !== 'all' && entity.type !== typeFilter) return false
      if (statusFilter !== 'all' && entity.status !== statusFilter) return false
      if (reasonFilter !== 'all' && entity.death_reason !== reasonFilter) return false

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
  }, [entities, query, typeFilter, statusFilter, reasonFilter])

  return (
    <>
      <section className="panel summary-strip">
        <div className="summary-tile">
          <div className="label">Dead-side total</div>
          <div className="value">{summary.total}</div>
          <div className="hint">dead / merged / acquired / rebranded</div>
        </div>
        <div className="summary-tile">
          <div className="label">Dead</div>
          <div className="value">{summary.dead}</div>
          <div className="hint">terminal dead-side records</div>
        </div>
        <div className="summary-tile">
          <div className="label">Merged</div>
          <div className="value">{summary.merged}</div>
          <div className="hint">merged into another entity</div>
        </div>
        <div className="summary-tile">
          <div className="label">Acquired</div>
          <div className="value">{summary.acquired}</div>
          <div className="hint">ownership absorbed</div>
        </div>
        <div className="summary-tile">
          <div className="label">Rebranded</div>
          <div className="value">{summary.rebranded}</div>
          <div className="hint">brand lineage tracked</div>
        </div>
        <div className="summary-tile">
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
              placeholder="Search dead-side by name, alias, domain, origin, summary"
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
            <option value="all">All dead-side statuses</option>
            <option value="dead">Dead</option>
            <option value="merged">Merged</option>
            <option value="acquired">Acquired</option>
            <option value="rebranded">Rebranded</option>
          </select>

          <select
            className="field"
            value={reasonFilter}
            onChange={(event) => setReasonFilter(event.target.value as ReasonFilter)}
          >
            <option value="all">All death reasons</option>
            <option value="hack">Hack</option>
            <option value="insolvency">Insolvency</option>
            <option value="regulation">Regulation</option>
            <option value="scam_rug">Scam / rug</option>
            <option value="merger">Merger</option>
            <option value="acquisition">Acquisition</option>
            <option value="rebrand">Rebrand</option>
            <option value="voluntary_shutdown">Voluntary shutdown</option>
            <option value="chain_failure">Chain failure</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="results-meta">
          <div>
            {query ? `Search: "${query}" · ` : ''}
            type={typeFilter} · status={statusFilter} · reason={reasonFilter}
          </div>
          <div>{filtered.length} results</div>
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
                      <span className="name-sub">Try clearing filters or broadening the search query.</span>
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
                          {entity.aliases.length > 0 ? entity.aliases.join(', ') : entity.official_domain_original ?? '—'}
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
                    {entity.death_reason ? (
                      <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                    <span>{formatYears(entity.launch_date, entity.death_date)}</span>
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
      </section>
    </>
  )
}
