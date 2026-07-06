'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { EntityRecord } from '../../lib/types/entity'
import type { EventRecord } from '../../lib/types/event'
import {
  countEventExplorerFilters,
  EVENT_FILTER_VALUES,
  filterEventExplorerRecords,
  parseEventExplorerState,
  serializeEventExplorerState,
  sortEventExplorerRecords,
  type EventExplorerState,
} from '../../lib/explorer/event-query'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import styles from './entity-explorer-client.module.css'

const INITIAL_VISIBLE = 50
const LOAD_MORE_STEP = 50

type Props = {
  events: EventRecord[]
  entities: EntityRecord[]
}

type MultiKey = 'event_type' | 'impact_level' | 'event_status_effect' | 'confidence' | 'entity_type' | 'entity_status'

function titleCase(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function FilterGroup({ title, count, children }: { title: string; count: number | string; children: ReactNode }) {
  return <details className={styles.filterGroup}><summary>{title} <span>{count}</span></summary>{children}</details>
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

function effectLabel(value: string) {
  return value === 'none' ? 'None' : STATUS_LABELS[value as keyof typeof STATUS_LABELS] ?? titleCase(value)
}

function EventResults({ events, entityById, state }: {
  events: EventRecord[]
  entityById: Map<string, EntityRecord>
  state: EventExplorerState
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const visible = events.slice(0, visibleCount)
  const remaining = Math.max(events.length - visible.length, 0)

  return (
    <>
      <div className="results-meta"><div>{events.length} matching events</div><div>Showing {visible.length} of {events.length}</div></div>

      <div className="desktop-table">
        <table>
          <thead><tr><th>Date</th><th>Event</th><th>Exchange</th><th>Type</th><th>Impact</th><th>Status effect</th><th>Confidence</th></tr></thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><div className="name-cell"><span className="name-main">No matching events</span><span className="name-sub">The current query state resolves to an empty reviewed event set.</span></div></td></tr>
            ) : visible.map((event) => {
              const parent = entityById.get(event.exchange_id)
              return (
                <tr key={event.id}>
                  <td>{event.event_date ?? '—'}</td>
                  <td><div className="name-cell"><span className="name-main">{event.title}</span><span className="name-sub">{event.description}</span></div></td>
                  <td>{parent ? <Link className="subtle-link" href={`/exchange/${parent.slug}/`}>{parent.canonical_name}</Link> : '—'}</td>
                  <td><span className="chip reason">{titleCase(event.event_type)}</span></td>
                  <td>{titleCase(event.impact_level)}</td>
                  <td>{effectLabel(event.event_status_effect)}</td>
                  <td>{titleCase(event.confidence)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="compact-list">
        {visible.length === 0 ? (
          <div className="record-empty"><div className="name-cell"><span className="name-main">No matching events</span><span className="name-sub">Clear filters or broaden the reviewed event query.</span></div></div>
        ) : (
          <div className="record-list">
            {visible.map((event) => {
              const parent = entityById.get(event.exchange_id)
              return (
                <div className="record-item" key={event.id}>
                  <div className="record-top">
                    <div className="record-main"><span className="record-title">{event.title}</span></div>
                    <div className="record-chips"><span className="chip reason">{titleCase(event.event_type)}</span></div>
                  </div>
                  <div className="record-meta">
                    <span>{event.event_date ?? 'Unknown date'}</span>
                    {parent ? <Link className="subtle-link" href={`/exchange/${parent.slug}/`}>{parent.canonical_name}</Link> : null}
                    <span>{titleCase(event.impact_level)} impact</span>
                    <span>{effectLabel(event.event_status_effect)} effect</span>
                    <span>{titleCase(event.confidence)} confidence</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {remaining > 0 ? (
        <div className="registry-load-more">
          <button type="button" className="btn" onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}>Load {Math.min(LOAD_MORE_STEP, remaining)} more</button>
          <div className="registry-load-more-note">{remaining} remaining in current query</div>
        </div>
      ) : null}
      <div className={styles.resultHint}>Sort: {titleCase(state.sort)} · Parent exchange context is reviewed HEI entity data.</div>
    </>
  )
}

export default function EventExplorerPanel({ events, entities }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const state = useMemo(() => parseEventExplorerState(searchParams), [searchParams])
  const entityById = useMemo(() => new Map(entities.map((entity) => [entity.id, entity])), [entities])

  const updateState = (next: EventExplorerState) => router.replace(`${pathname}?${serializeEventExplorerState(next)}`, { scroll: false })
  const patchState = (patch: Partial<EventExplorerState>) => updateState({ ...state, ...patch, view: 'events' })
  const toggleMulti = (key: MultiKey, value: string) => {
    const current = state[key] as string[]
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    patchState({ [key]: next } as Partial<EventExplorerState>)
  }

  const filteredAndSorted = useMemo(
    () => sortEventExplorerRecords(filterEventExplorerRecords(events, entityById, state), entityById, state.sort),
    [events, entityById, state],
  )
  const filterCount = countEventExplorerFilters(state)
  const resultKey = serializeEventExplorerState(state)

  return (
    <>
      <div className={styles.controlStack}>
        <div className={styles.primaryControls}>
          <div className="search"><input className="field" aria-label="Search reviewed events" placeholder="Search event text or parent exchange context" value={state.q} onChange={(event) => patchState({ q: event.target.value })} /></div>
          <select className="field" aria-label="Sort events" value={state.sort} onChange={(event) => patchState({ sort: event.target.value as EventExplorerState['sort'] })}>
            {EVENT_FILTER_VALUES.sort.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}
          </select>
        </div>

        <div className={styles.filterGrid}>
          <FilterGroup title="Event type" count={state.event_type.length || 'all'}><CheckboxList values={EVENT_FILTER_VALUES.event_type} selected={state.event_type} labelFor={titleCase} onToggle={(value) => toggleMulti('event_type', value)} /></FilterGroup>
          <FilterGroup title="Event date" count={state.date_from || state.date_to ? 'set' : 'all'}><DateRange from={state.date_from} to={state.date_to} onFrom={(value) => patchState({ date_from: value })} onTo={(value) => patchState({ date_to: value })} /></FilterGroup>
          <FilterGroup title="Impact level" count={state.impact_level.length || 'all'}><CheckboxList values={EVENT_FILTER_VALUES.impact_level} selected={state.impact_level} labelFor={titleCase} onToggle={(value) => toggleMulti('impact_level', value)} /></FilterGroup>
          <FilterGroup title="Status effect" count={state.event_status_effect.length || 'all'}><CheckboxList values={EVENT_FILTER_VALUES.event_status_effect} selected={state.event_status_effect} labelFor={effectLabel} onToggle={(value) => toggleMulti('event_status_effect', value)} /></FilterGroup>
          <FilterGroup title="Confidence" count={state.confidence.length || 'all'}><CheckboxList values={EVENT_FILTER_VALUES.confidence} selected={state.confidence} labelFor={titleCase} onToggle={(value) => toggleMulti('confidence', value)} /></FilterGroup>
          <FilterGroup title="Parent type" count={state.entity_type.length || 'all'}><CheckboxList values={EVENT_FILTER_VALUES.entity_type} selected={state.entity_type} labelFor={(value) => value === 'hybrid' ? 'Hybrid' : value.toUpperCase()} onToggle={(value) => toggleMulti('entity_type', value)} /></FilterGroup>
          <FilterGroup title="Parent status" count={state.entity_status.length || 'all'}><CheckboxList values={EVENT_FILTER_VALUES.entity_status} selected={state.entity_status} labelFor={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS]} onToggle={(value) => toggleMulti('entity_status', value)} /></FilterGroup>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.toolbarMeta}>{filterCount === 0 ? 'No active filters · default Event view' : `${filterCount} active query constraints`}</div>
          <div className={styles.toolbarActions}>{filterCount > 0 ? <button type="button" className="btn btn-ghost" onClick={() => router.replace(`${pathname}?view=events`, { scroll: false })}>Clear all filters</button> : null}</div>
        </div>
      </div>

      <EventResults key={resultKey} events={filteredAndSorted} entityById={entityById} state={state} />
    </>
  )
}
