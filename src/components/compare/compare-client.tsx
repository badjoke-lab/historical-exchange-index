'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { CompareContextMap, CompareEntityContext } from '../../lib/compare/compare-context'
import {
  COMPARE_MAX,
  calculateLifespanDays,
  isComparisonReady,
  parseCompareState,
  resolveComparedEntities,
  serializeCompareState,
  type CompareState,
} from '../../lib/compare/compare-state'
import type { EntityRecord } from '../../lib/types/entity'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { formatDate } from '../../lib/utils/format-date'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { URL_STATUS_LABELS } from '../../lib/utils/url-meta'
import styles from './compare-client.module.css'

type Props = {
  entities: EntityRecord[]
  context: CompareContextMap
}

type Row = {
  label: string
  render: (entity: EntityRecord, entityContext: CompareEntityContext) => ReactNode
}

const EMPTY_CONTEXT: CompareEntityContext = {
  event_count: 0,
  evidence_count: 0,
  selected_major_events: [],
}

function titleCase(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const rows: Row[] = [
  {
    label: 'Type',
    render: (entity) => <span className="chip type">{entity.type.toUpperCase()}</span>,
  },
  {
    label: 'Launch date',
    render: (entity) => formatDate(entity.launch_date),
  },
  {
    label: 'Terminal date',
    render: (entity) => formatDate(entity.death_date),
  },
  {
    label: 'Lifespan',
    render: (entity) => {
      const days = calculateLifespanDays(entity)
      return days === null ? <span className="muted">Unknown</span> : `${days.toLocaleString()} days`
    },
  },
  {
    label: 'Status',
    render: (entity) => <span className={`chip ${entity.status}`}>{STATUS_LABELS[entity.status]}</span>,
  },
  {
    label: 'Death reason',
    render: (entity) => entity.death_reason
      ? <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
      : <span className="muted">Unknown / not applicable</span>,
  },
  {
    label: 'Country / origin',
    render: (entity) => entity.country_or_origin ?? <span className="muted">Unknown</span>,
  },
  {
    label: 'Confidence',
    render: (entity) => titleCase(entity.confidence),
  },
  {
    label: 'Original domain',
    render: (entity) => entity.official_domain_original ?? <span className="muted">Unknown</span>,
  },
  {
    label: 'URL status',
    render: (entity) => URL_STATUS_LABELS[entity.official_url_status],
  },
  {
    label: 'Archive',
    render: (entity) => entity.archived_url
      ? <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">View archive</a>
      : <span className="muted">No reviewed archive URL</span>,
  },
  {
    label: 'Reviewed events',
    render: (_entity, entityContext) => entityContext.event_count.toLocaleString(),
  },
  {
    label: 'Reviewed evidence',
    render: (_entity, entityContext) => entityContext.evidence_count.toLocaleString(),
  },
  {
    label: 'Record',
    render: (entity) => <Link className="subtle-link" href={`/exchange/${entity.slug}/`}>Open dossier</Link>,
  },
]

function buildUrl(pathname: string, state: CompareState): string {
  const query = serializeCompareState(state)
  return query ? `${pathname}?${query}` : pathname
}

export default function CompareClient({ entities, context }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [candidateSlug, setCandidateSlug] = useState('')

  const sortedEntities = useMemo(
    () => [...entities].sort((a, b) => a.canonical_name.localeCompare(b.canonical_name) || a.id.localeCompare(b.id)),
    [entities],
  )
  const reviewedSlugs = useMemo(() => sortedEntities.map((entity) => entity.slug), [sortedEntities])
  const state = useMemo(() => parseCompareState(searchParams, reviewedSlugs), [searchParams, reviewedSlugs])
  const selectedEntities = useMemo(() => resolveComparedEntities(entities, state), [entities, state])
  const selectedSet = useMemo(() => new Set(state.slugs), [state.slugs])
  const availableEntities = useMemo(
    () => sortedEntities.filter((entity) => !selectedSet.has(entity.slug)),
    [sortedEntities, selectedSet],
  )
  const ready = isComparisonReady(state)

  const replaceState = (next: CompareState) => {
    router.replace(buildUrl(pathname, next), { scroll: false })
  }

  const addCandidate = () => {
    if (!candidateSlug || state.slugs.length >= COMPARE_MAX || selectedSet.has(candidateSlug)) return
    replaceState({ slugs: [...state.slugs, candidateSlug] })
    setCandidateSlug('')
  }

  const removeSlug = (slug: string) => {
    replaceState({ slugs: state.slugs.filter((value) => value !== slug) })
  }

  return (
    <section className={`panel ${styles.shell}`}>
      <div className={styles.controls}>
        <div className={styles.controlCopy}>
          <div className={styles.controlTitle}>Select reviewed exchanges</div>
          <div className={styles.controlHint}>Choose 2–4 entities. Selection order is preserved in the shareable URL and comparison columns.</div>
        </div>

        <div className={styles.addRow}>
          <label className={styles.selectLabel}>
            <span>Add exchange</span>
            <select
              className="field"
              aria-label="Add reviewed exchange to comparison"
              value={candidateSlug}
              onChange={(event) => setCandidateSlug(event.target.value)}
              disabled={state.slugs.length >= COMPARE_MAX}
            >
              <option value="">Select a reviewed exchange</option>
              {availableEntities.map((entity) => (
                <option key={entity.id} value={entity.slug}>{entity.canonical_name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addCandidate}
            disabled={!candidateSlug || state.slugs.length >= COMPARE_MAX}
          >
            Add
          </button>
        </div>

        <div className={styles.selectionStrip} aria-label="Selected exchanges">
          {selectedEntities.length === 0 ? (
            <span className={styles.emptySelection}>No exchanges selected.</span>
          ) : selectedEntities.map((entity, index) => (
            <div className={styles.selectionItem} key={entity.id}>
              <span className={styles.selectionOrder}>{index + 1}</span>
              <span>{entity.canonical_name}</span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeSlug(entity.slug)}
                aria-label={`Remove ${entity.canonical_name} from comparison`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.stateBar}>
        <span>{selectedEntities.length} of {COMPARE_MAX} selected</span>
        <span>{ready ? 'Comparison ready' : selectedEntities.length === 1 ? 'Add one more exchange to compare' : 'Select at least two exchanges'}</span>
      </div>

      {ready ? (
        <>
          <div className={styles.matrixScroller}>
            <table className={styles.matrix}>
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  {selectedEntities.map((entity) => (
                    <th scope="col" key={entity.id}>
                      <div className={styles.entityHeading}>
                        <Link className="subtle-link" href={`/exchange/${entity.slug}/`}>{entity.canonical_name}</Link>
                        <span>{entity.slug}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {selectedEntities.map((entity) => (
                      <td key={entity.id}>{row.render(entity, context[entity.slug] ?? EMPTY_CONTEXT)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.majorEventsSection}>
            <div className={styles.sectionHeading}>
              <strong>Selected major events</strong>
              <span>Up to five reviewed events per entity, selected by the fixed deterministic Compare contract.</span>
            </div>
            <div className={styles.majorEventsGrid}>
              {selectedEntities.map((entity) => {
                const majorEvents = (context[entity.slug] ?? EMPTY_CONTEXT).selected_major_events
                return (
                  <article className={styles.majorEventsColumn} key={entity.id}>
                    <div className={styles.majorEventsTitle}>{entity.canonical_name}</div>
                    {majorEvents.length === 0 ? (
                      <div className={styles.noEvents}>No reviewed high-impact or explicit major event is available for this record.</div>
                    ) : (
                      <div className={styles.eventList}>
                        {majorEvents.map((event) => (
                          <div className={styles.eventItem} key={event.id}>
                            <div className={styles.eventMeta}>
                              <span>{formatDate(event.event_date)}</span>
                              <span className="chip reason">{titleCase(event.event_type)}</span>
                              <span>{titleCase(event.impact_level)}</span>
                            </div>
                            <div className={styles.eventTitle}>{event.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <strong>Comparison not ready</strong>
          <span>Use the reviewed-entity selector above. HEI does not compare unreviewed candidates or infer missing lifecycle facts.</span>
        </div>
      )}
    </section>
  )
}
