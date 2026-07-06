'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { EntityRecord } from '../../lib/types/entity'
import {
  countEntityExplorerFilters,
  ENTITY_FILTER_VALUES,
  filterEntityExplorerRecords,
  getExplorerView,
  parseEntityExplorerState,
  serializeEntityExplorerState,
  sortEntityExplorerRecords,
  type EntityExplorerState,
} from '../../lib/explorer/entity-query'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { URL_STATUS_LABELS } from '../../lib/utils/url-meta'
import styles from './entity-explorer-client.module.css'

const INITIAL_VISIBLE = 40
const LOAD_MORE_STEP = 40

type Props = { entities: EntityRecord[]; reviewedOrigins: string[] }
type MultiKey = 'type' | 'status' | 'death_reason' | 'official_url_status' | 'confidence' | 'country_or_origin'

function titleCase(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function FilterGroup({ title, count, children }: { title: string; count: number | string; children: ReactNode }) {
  return (
    <details className={styles.filterGroup}>
      <summary>{title} <span>{count}</span></summary>
      {children}
    </details>
  )
}

function CheckboxList({ values, selected, labelFor, onToggle }: {
  values: string[]
  selected: string[]
  labelFor: (value: string) => string
  onToggle: (value: string) => void
}) {
  return (
    <div className={styles.optionList}>
      {values.map((value) => (
        <label className={styles.option} key={value}>
          <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} />
          <span>{labelFor(value)}</span>
        </label>
      ))}
    </div>
  )
}

function DateRange({ from, to, onFrom, onTo }: {
  from: string
  to: string
  onFrom: (value: string) => void
  onTo: (value: string) => void
}) {
  return (
    <div className={styles.dateGrid}>
      <label className={styles.dateLabel}>From
        <input type="date" className={styles.dateInput} value={from} onChange={(event) => onFrom(event.target.value)} />
      </label>
      <label className={styles.dateLabel}>To
        <input type="date" className={styles.dateInput} value={to} onChange={(event) => onTo(event.target.value)} />
      </label>
    </div>
  )
}

function EntityResults({ entities, state }: { entities: EntityRecord[]; state: EntityExplorerState }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const visible = entities.slice(0, visibleCount)
  const remaining = Math.max(entities.length - visible.length, 0)

  return (
    <>
      <div className="results-meta">
        <div>{entities.length} matching entities</div>
        <div>Showing {visible.length} of {entities.length}</div>
      </div>

      <div className="desktop-table">
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Death reason</th><th>Years</th><th>Origin</th><th>URL status</th><th>Archive</th></tr></thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={8}><div className="name-cell"><span className="name-main">No matching entities</span><span className="name-sub">The current query state resolves to an empty reviewed record set.</span></div></td></tr>
            ) : visible.map((entity) => (
              <tr key={entity.id}>
                <td><div className="name-cell"><Link className="name-main subtle-link" href={`/exchange/${entity.slug}/`}>{entity.canonical_name}</Link><span className="name-sub">{entity.aliases.length > 0 ? entity.aliases.join(', ') : entity.slug}</span></div></td>
                <td><span className="chip type">{entity.type.toUpperCase()}</span></td>
                <td><span className={`chip ${entity.status}`}>{STATUS_LABELS[entity.status]}</span></td>
                <td>{entity.death_reason ? <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span> : <span className="muted">—</span>}</td>
                <td>{formatYears(entity.launch_date, entity.death_date)}</td>
                <td>{entity.country_or_origin ?? '—'}</td>
                <td>{URL_STATUS_LABELS[entity.official_url_status]}</td>
                <td>{entity.archived_url ? <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">archive</a> : <span className="muted">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="compact-list">
        {visible.length === 0 ? (
          <div className="record-empty"><div className="name-cell"><span className="name-main">No matching entities</span><span className="name-sub">Clear filters or use a broader reviewed record query.</span></div></div>
        ) : (
          <div className="record-list">
            {visible.map((entity) => (
              <div className="record-item" key={entity.id}>
                <div className="record-top">
                  <div className="record-main"><Link className="record-title subtle-link" href={`/exchange/${entity.slug}/`}>{entity.canonical_name}</Link></div>
                  <div className="record-chips"><span className="chip type">{entity.type.toUpperCase()}</span><span className={`chip ${entity.status}`}>{STATUS_LABELS[entity.status]}</span></div>
                </div>
                <div className="record-meta">
                  {entity.death_reason ? <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span> : null}
                  <span>{formatYears(entity.launch_date, entity.death_date)}</span>
                  <span>{entity.country_or_origin ?? 'Unknown origin'}</span>
                  <span>{URL_STATUS_LABELS[entity.official_url_status]}</span>
                  {entity.archived_url ? <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">Archive</a> : <span className="muted">No archive</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {remaining > 0 ? (
        <div className="registry-load-more">
          <button type="button" className="btn" onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}>Load {Math.min(LOAD_MORE_STEP, remaining)} more</button>
          <div className="registry-load-more-note">{remaining} remaining in current query</div>
        </div>
      ) : null}
      <div className={styles.resultHint}>Sort: {titleCase(state.sort)} · Query state is shareable through the current URL.</div>
    </>
  )
}

export default function EntityExplorerClient({ entities, reviewedOrigins }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = getExplorerView(searchParams)
  const state = useMemo(() => parseEntityExplorerState(searchParams, reviewedOrigins), [searchParams, reviewedOrigins])

  const updateState = (nextState: EntityExplorerState) => {
    router.replace(`${pathname}?${serializeEntityExplorerState(nextState, reviewedOrigins)}`, { scroll: false })
  }
  const patchState = (patch: Partial<EntityExplorerState>) => updateState({ ...state, ...patch, view: 'entities' })
  const toggleMulti = (key: MultiKey, value: string) => {
    const current = state[key] as string[]
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    patchState({ [key]: next } as Partial<EntityExplorerState>)
  }

  const filteredAndSorted = useMemo(
    () => sortEntityExplorerRecords(filterEntityExplorerRecords(entities, state), state.sort),
    [entities, state],
  )
  const filterCount = countEntityExplorerFilters(state)
  const resultKey = serializeEntityExplorerState(state, reviewedOrigins)

  return (
    <section className={`panel table-panel ${styles.shell}`}>
      <nav className={styles.viewTabs} aria-label="Explorer views">
        <Link className={`${styles.viewTab} ${view === 'entities' ? styles.viewTabActive : ''}`} href="/explore/?view=entities">Entity Explorer</Link>
        <Link className={`${styles.viewTab} ${view === 'events' ? styles.viewTabActive : ''}`} href="/explore/?view=events">Event Explorer</Link>
      </nav>

      {view === 'events' ? (
        <div className={styles.placeholder}>
          <h3>Event Explorer follows in E5-3</h3>
          <p>The shared query contract already recognizes the Event view. Event filtering and reviewed parent-exchange context are implemented in the next phase; this placeholder does not expose incomplete or unreviewed event search behavior.</p>
          <div><Link className="btn btn-primary" href="/explore/?view=entities">Open Entity Explorer</Link></div>
        </div>
      ) : (
        <>
          <div className={styles.controlStack}>
            <div className={styles.primaryControls}>
              <div className="search"><input className="field" aria-label="Search reviewed entities" placeholder="Search name, alias, slug, summary, or origin" value={state.q} onChange={(event) => patchState({ q: event.target.value })} /></div>
              <select className="field" aria-label="Archive availability" value={state.archive_available} onChange={(event) => patchState({ archive_available: event.target.value as EntityExplorerState['archive_available'] })}>
                <option value="">Any archive state</option><option value="true">Archive available</option><option value="false">No archive URL</option>
              </select>
              <select className="field" aria-label="Sort entities" value={state.sort} onChange={(event) => patchState({ sort: event.target.value as EntityExplorerState['sort'] })}>
                {ENTITY_FILTER_VALUES.sort.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}
              </select>
            </div>

            <div className={styles.filterGrid}>
              <FilterGroup title="Type" count={state.type.length || 'all'}><CheckboxList values={ENTITY_FILTER_VALUES.type} selected={state.type} labelFor={(value) => value === 'hybrid' ? 'Hybrid' : value.toUpperCase()} onToggle={(value) => toggleMulti('type', value)} /></FilterGroup>
              <FilterGroup title="Status" count={state.status.length || 'all'}><CheckboxList values={ENTITY_FILTER_VALUES.status} selected={state.status} labelFor={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS]} onToggle={(value) => toggleMulti('status', value)} /></FilterGroup>
              <FilterGroup title="Death reason" count={state.death_reason.length || 'all'}><CheckboxList values={ENTITY_FILTER_VALUES.death_reason} selected={state.death_reason} labelFor={(value) => DEATH_REASON_LABELS[value as keyof typeof DEATH_REASON_LABELS]} onToggle={(value) => toggleMulti('death_reason', value)} /></FilterGroup>
              <FilterGroup title="Launch date" count={state.launch_from || state.launch_to ? 'set' : 'all'}><DateRange from={state.launch_from} to={state.launch_to} onFrom={(value) => patchState({ launch_from: value })} onTo={(value) => patchState({ launch_to: value })} /></FilterGroup>
              <FilterGroup title="Death date" count={state.death_from || state.death_to ? 'set' : 'all'}><DateRange from={state.death_from} to={state.death_to} onFrom={(value) => patchState({ death_from: value })} onTo={(value) => patchState({ death_to: value })} /></FilterGroup>
              <FilterGroup title="URL status" count={state.official_url_status.length || 'all'}><CheckboxList values={ENTITY_FILTER_VALUES.official_url_status} selected={state.official_url_status} labelFor={(value) => URL_STATUS_LABELS[value as keyof typeof URL_STATUS_LABELS]} onToggle={(value) => toggleMulti('official_url_status', value)} /></FilterGroup>
              <FilterGroup title="Confidence" count={state.confidence.length || 'all'}><CheckboxList values={ENTITY_FILTER_VALUES.confidence} selected={state.confidence} labelFor={titleCase} onToggle={(value) => toggleMulti('confidence', value)} /></FilterGroup>
              <FilterGroup title="Country / origin" count={state.country_or_origin.length || 'all'}>
                <div className={styles.originHelp}>Select one or more reviewed canonical origin values.</div>
                <div className={styles.optionList}>
                  <select className={styles.originSelect} multiple value={state.country_or_origin} onChange={(event) => patchState({ country_or_origin: Array.from(event.currentTarget.selectedOptions).map((option) => option.value) })} aria-label="Country or origin values">
                    {reviewedOrigins.map((origin) => <option key={origin} value={origin}>{origin}</option>)}
                  </select>
                </div>
              </FilterGroup>
            </div>

            <div className={styles.toolbar}>
              <div className={styles.toolbarMeta}>{filterCount === 0 ? 'No active filters · default Entity view' : `${filterCount} active query constraints`}</div>
              <div className={styles.toolbarActions}>{filterCount > 0 ? <button type="button" className="btn btn-ghost" onClick={() => router.replace(`${pathname}?view=entities`, { scroll: false })}>Clear all filters</button> : null}</div>
            </div>
          </div>
          <EntityResults key={resultKey} entities={filteredAndSorted} state={state} />
        </>
      )}
    </section>
  )
}
