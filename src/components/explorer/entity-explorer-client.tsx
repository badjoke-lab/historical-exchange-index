'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { EntityRecord } from '../../lib/types/entity'
import {
  countEntityExplorerFilters,
  ENTITY_DEFAULT_SORT,
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

type Props = {
  entities: EntityRecord[]
  reviewedOrigins: string[]
}

type MultiKey =
  | 'type'
  | 'status'
  | 'death_reason'
  | 'official_url_status'
  | 'confidence'
  | 'country_or_origin'

function titleCase(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function FilterCheckboxes({
  values,
  selected,
  labelFor,
  onToggle,
}: {
  values: string[]
  selected: string[]
  labelFor: (value: string) => string
  onToggle: (value: string) => void
}) {
  return (
    <div className={styles.optionList}>
      {values.map((value) => (
        <label className={styles.option} key={value}>
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
          />
          <span>{labelFor(value)}</span>
        </label>
      ))}
    </div>
  )
}

function EntityResults({ entities, state }: { entities: EntityRecord[]; state: EntityExplorerState }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const visible = entities.slice(0, visibleCount)
  const remaining = Math.max(entities.length - visible.length, 0)
  const nextLoadCount = Math.min(LOAD_MORE_STEP, remaining)

  return (
    <>
      <div className="results-meta">
        <div>{entities.length} matching entities</div>
        <div>Showing {visible.length} of {entities.length}</div>
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
              <th>URL status</th>
              <th>Archive</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="name-cell">
                    <span className="name-main">No matching entities</span>
                    <span className="name-sub">The current query state resolves to an empty reviewed record set.</span>
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
                        {entity.aliases.length > 0 ? entity.aliases.join(', ') : entity.slug}
                      </span>
                    </div>
                  </td>
                  <td><span className="chip type">{entity.type.toUpperCase()}</span></td>
                  <td><span className={`chip ${entity.status}`}>{STATUS_LABELS[entity.status]}</span></td>
                  <td>
                    {entity.death_reason ? (
                      <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
                    ) : <span className="muted">—</span>}
                  </td>
                  <td>{formatYears(entity.launch_date, entity.death_date)}</td>
                  <td>{entity.country_or_origin ?? '—'}</td>
                  <td>{URL_STATUS_LABELS[entity.official_url_status]}</td>
                  <td>
                    {entity.archived_url ? (
                      <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">archive</a>
                    ) : <span className="muted">—</span>}
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
              <span className="name-main">No matching entities</span>
              <span className="name-sub">Clear filters or use a broader reviewed record query.</span>
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
                    <span className={`chip ${entity.status}`}>{STATUS_LABELS[entity.status]}</span>
                  </div>
                </div>
                <div className="record-meta">
                  {entity.death_reason ? (
                    <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
                  ) : null}
                  <span>{formatYears(entity.launch_date, entity.death_date)}</span>
                  <span>{entity.country_or_origin ?? 'Unknown origin'}</span>
                  <span>{URL_STATUS_LABELS[entity.official_url_status]}</span>
                  {entity.archived_url ? (
                    <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">Archive</a>
                  ) : <span className="muted">No archive</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {remaining > 0 ? (
        <div className="registry-load-more">
          <button type="button" className="btn" onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}>
            Load {nextLoadCount} more
          </button>
          <div className="registry-load-more-note">{remaining} remaining in current query</div>
        </div>
      ) : null}

      <div className={styles.resultHint}>
        Sort: {titleCase(state.sort)} · Query state is shareable through the current URL.
      </div>
    </>
  )
}

export default function EntityExplorerClient({ entities, reviewedOrigins }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = getExplorerView(searchParams)
  const state = useMemo(
    () => parseEntityExplorerState(searchParams, reviewedOrigins),
    [searchParams, reviewedOrigins],
  )

  const updateState = (nextState: EntityExplorerState) => {
    const query = serializeEntityExplorerState(nextState, reviewedOrigins)
    router.replace(`${pathname}?${query}`, { scroll: false })
  }

  const patchState = (patch: Partial<EntityExplorerState>) => {
    updateState({ ...state, ...patch, view: 'entities' })
  }

  const toggleMulti = (key: MultiKey, value: string) => {
    const current = state[key] as string[]
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    patchState({ [key]: next } as Partial<EntityExplorerState>)
  }

  const filteredAndSorted = useMemo(() => {
    const filtered = filterEntityExplorerRecords(entities, state)
    return sortEntityExplorerRecords(filtered, state.sort)
  }, [entities, state])

  const filterCount = countEntityExplorerFilters(state)
  const resultKey = serializeEntityExplorerState(state, reviewedOrigins)

  return (
    <section className={`panel table-panel ${styles.shell}`}>
      <nav className={styles.viewTabs} aria-label="Explorer views">
        <Link
          className={`${styles.viewTab} ${view === 'entities' ? styles.viewTabActive : ''}`}
          href="/explore/?view=entities"
        >
          Entity Explorer
        </Link>
        <Link
          className={`${styles.viewTab} ${view === 'events' ? styles.viewTabActive : ''}`}
          href="/explore/?view=events"
        >
          Event Explorer
        </Link>
      </nav>

      {view === 'events' ? (
        <div className={styles.placeholder}>
          <h3>Event Explorer follows in E5-3</h3>
          <p>
            The shared query contract already recognizes the Event view. Event filtering and reviewed parent-exchange context are implemented in the next phase; this placeholder does not expose incomplete or unreviewed event search behavior.
          </p>
          <div><Link className="btn btn-primary" href="/explore/?view=entities">Open Entity Explorer</Link></div>
        </div>
      ) : (
        <>
          <div className={styles.controlStack}>
            <div className={styles.primaryControls}>
              <div className="search">
                <input
                  className="field"
                  aria-label="Search reviewed entities"
                  placeholder="Search name, alias, slug, summary, or origin"
                  value={state.q}
                  onChange={(event) => patchState({ q: event.target.value })}
                />
              </div>

              <select
                className="field"
                aria-label="Archive availability"
                value={state.archive_available}
                onChange={(event) => patchState({ archive_available: event.target.value as EntityExplorerState['archive_available'] })}
              >
                <option value="">Any archive state</option>
                <option value="true">Archive available</option>
                <option value="false">No archive URL</option>
              </select>

              <select
                className="field"
                aria-label="Sort entities"
                value={state.sort}
                onChange={(event) => patchState({ sort: event.target.value as EntityExplorerState['sort'] })}
              >
                {ENTITY_FILTER_VALUES.sort.map((value) => (
                  <option value={value} key={value}>{titleCase(value)}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGrid}>
              <details className={styles.filterGroup}>
                <summary>Type <span>{state.type.length || 'all'}</span></summary>
                <FilterCheckboxes
                  values={ENTITY_FILTER_VALUES.type}
                  selected={state.type}
                  labelFor={(value) => value === 'hybrid' ? 'Hybrid' : value.toUpperCase()}
                  onToggle={(value) => toggleMulti('type', value)}
                />
              </details>

              <details className={styles.filterGroup}>
                <summary>Status <span>{state.status.length || 'all'}</span></summary>
                <FilterCheckboxes
                  values={ENTITY_FILTER_VALUES.status}
                  selected={state.status}
                  labelFor={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS]}
                  onToggle={(value) => toggleMulti('status', value)}
                />
              </details>

              <details className={styles.filterGroup}>
                <summary>Death reason <span>{state.death_reason.length || 'all'}</span></summary>
                <FilterCheckboxes
                  values={ENTITY_FILTER_VALUES.death_reason}
                  selected={state.death_reason}
                  labelFor={(value) => DEATH_REASON_LABELS[value as keyof typeof DEATH_REASON_LABELS]}
                  onToggle={(value) => toggleMulti('death_reason', value)}
                />
              </details>

              <details className={styles.filterGroup}>
                <summary>Launch date <span>{state.launch_from || state.launch_to ? 'set' : 'all'}</span></summary>
                <div className={styles.dateGrid}>
                  <label className={styles.dateLabel}>From
                    <input className={styles.dateInput} placeholder="YYYY or YYYY-MM-DD" value={state.launch_from} onChange={(event) => patchState({ launch_from: event.target.value })} />
                  </label>
                  <label className={styles.dateLabel}>To
                    <input className={styles.dateInput} placeholder="YYYY or YYYY-MM-DD" value={state.launch_to} onChange={(event) => patchState({ launch_to: event.target.value })} />
                  </label>
                </div>
              </details>

              <details className={styles.filterGroup}>
                <summary>Death date <span>{state.death_from || state.death_to ? 'set' : 'all'}</span></summary>
                <div className={styles.dateGrid}>
                  <label className={styles.dateLabel}>From
                    <input className={styles.dateInput} placeholder="YYYY or YYYY-MM-DD" value={state.death_from} onChange={(event) => patchState({ death_from: event.target.value })} />
                  </label>
                  <label className={styles.dateLabel}>To
                    <input className={styles.dateInput} placeholder="YYYY or YYYY-MM-DD" value={state.death_to} onChange={(event) => patchState({ death_to: event.target.value })} />
                  </label>
                </div>
              </details>

              <details className={styles.filterGroup}>
                <summary>URL status <span>{state.official_url_status.length || 'all'}</span></summary>
                <FilterCheckboxes
                  values={ENTITY_FILTER_VALUES.official_url_status}
                  selected={state.official_url_status}
                  labelFor={(value) => URL_STATUS_LABELS[value as keyof typeof URL_STATUS_LABELS]}
                  onToggle={(value) => toggleMulti('official_url_status', value)}
                />
              </details>

              <details className={styles.filterGroup}>
                <summary>Confidence <span>{state.confidence.length || 'all'}</span></summary>
                <FilterCheckboxes
                  values={ENTITY_FILTER_VALUES.confidence}
                  selected={state.confidence}
                  labelFor={titleCase}
                  onToggle={(value) => toggleMulti('confidence', value)}
                />
              </details>

              <details className={styles.filterGroup}>
                <summary>Country / origin <span>{state.country_or_origin.length || 'all'}</span></summary>
                <div className={styles.originHelp}>Select one or more reviewed canonical origin values.</div>
                <div className={styles.optionList}>
                  <select
                    className={styles.originSelect}
                    multiple
                    value={state.country_or_origin}
                    onChange={(event) => {
                      const values = Array.from(event.currentTarget.selectedOptions).map((option) => option.value)
                      patchState({ country_or_origin: values })
                    }}
                    aria-label="Country or origin values"
                  >
                    {reviewedOrigins.map((origin) => <option key={origin} value={origin}>{origin}</option>)}
                  </select>
                </div>
              </details>
            </div>

            <div className={styles.toolbar}>
              <div className={styles.toolbarMeta}>
                {filterCount === 0 ? 'No active filters · default Entity view' : `${filterCount} active query constraints`}
              </div>
              <div className={styles.toolbarActions}>
                {filterCount > 0 ? (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => router.replace(`${pathname}?view=entities`, { scroll: false })}
                  >
                    Clear all filters
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <EntityResults key={resultKey} entities={filteredAndSorted} state={state} />
        </>
      )}
    </section>
  )
}
