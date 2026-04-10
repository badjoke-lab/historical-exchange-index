import Link from 'next/link'
import { loadEntities } from '../../lib/data/load-entities'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { URL_STATUS_LABELS } from '../../lib/utils/url-meta'
import { CORRECTION_HREF } from '../../lib/site-constants'

const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

function chipClass(status: string) {
  return `chip ${status}`
}

function formatLaunchYear(value: string | null) {
  return value ? value.slice(0, 4) : '—'
}

export default function ActivePage() {
  const entities = loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Active Exchanges</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Active-side registry</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>
              Active, limited, and inactive-side entries. This page emphasizes current classification and URL
              handling rather than ranking or recommendation.
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
          <div>Showing active / limited / inactive entries</div>
          <div>{entities.length} results</div>
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
              {entities.map((entity) => (
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
                  <span>{formatLaunchYear(entity.launch_date)}</span>
                  <span>{entity.country_or_origin ?? '—'}</span>
                  <span>{URL_STATUS_LABELS[entity.official_url_status]}</span>
                </div>

                <div className="record-meta record-meta-secondary">
                  <span className="record-domain">{entity.official_domain_original ?? '—'}</span>
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
        </div>
      </section>
    </main>
  )
}
