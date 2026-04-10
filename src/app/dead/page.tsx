import Link from 'next/link'
import { loadEntities } from '../../lib/data/load-entities'
import { formatYears } from '../../lib/utils/format-years'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { CORRECTION_HREF } from '../../lib/site-constants'

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])

function chipClass(status: string) {
  return `chip ${status}`
}

export default function DeadPage() {
  const entities = loadEntities()
    .filter((item) => DEAD_SIDE.has(item.status))
    .sort((a, b) => {
      const aDate = a.death_date ?? ''
      const bDate = b.death_date ?? ''
      if (aDate !== bDate) return aDate < bDate ? 1 : -1
      return a.canonical_name.localeCompare(b.canonical_name)
    })

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Dead Exchanges</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Dead-side registry</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>
              Closed, absorbed, rebranded, or otherwise gone exchanges. This page emphasizes end state,
              disappearance cause, and archive-aware lookup.
            </p>
          </div>

          <div className="hero-actions" style={{ marginTop: 0 }}>
            <a className="btn" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
              Submit correction
            </a>
          </div>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="results-meta">
          <div>Showing dead / merged / acquired / rebranded entries</div>
          <div>{entities.length} results</div>
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
              {entities.map((entity) => (
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="compact-list">
          <div className="record-list">
            {entities.map((entity) => (
              <div className="record-item" key={entity.id}>
                <div className="record-top">
                  <div className="record-main">
                    <Link className="record-title subtle-link" href={`/exchange/${entity.slug}/`}>
                      {entity.canonical_name}
                    </Link>
                    {entity.aliases.length > 0 ? (
                      <div className="record-subtitle">{entity.aliases.join(', ')}</div>
                    ) : null}
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

                <div className="record-meta record-meta-secondary">
                  <span>{entity.country_or_origin ?? '—'}</span>
                  <span className="record-domain">{entity.official_domain_original ?? '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
