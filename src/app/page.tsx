import Link from 'next/link'
import { buildRegistryView } from '../lib/data/build-registry-view'
import { buildDetailView } from '../lib/data/build-detail-view'
import { formatYears } from '../lib/utils/format-years'
import { STATUS_LABELS } from '../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../lib/utils/death-reason-meta'

function chipClass(status: string) {
  return `chip ${status}`
}

export default function HomePage() {
  const { entities, summary } = buildRegistryView()
  const featured = entities[0]
  const featuredDetail = featured ? buildDetailView(featured.slug) : null
  const archiveCoverage = entities.length > 0
    ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
    : 0

  return (
    <main>
      <section className="hero">
        <div className="panel hero-main">
          <div className="eyebrow">Entity-first registry · Archive-aware · Evidence-backed</div>
          <h2>Track the lifecycle of exchanges, not just who is still alive.</h2>
          <p>
            HEI is designed as a historical registry rather than a ranking table. It keeps active entities,
            dead exchanges, absorbed brands, rebrands, timeline events, and evidence in one place.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/dead">Browse dead-side entries</Link>
            <Link className="btn" href="/methodology">Read methodology</Link>
          </div>
        </div>

        <aside className="panel hero-side">
          <div className="stat-card">
            <div className="label">Total entities</div>
            <div className="value">{summary.total}</div>
            <div className="delta">Entity-level count, v0 model</div>
          </div>
          <div className="stat-card">
            <div className="label">Dead-side</div>
            <div className="value">{summary.deadSide}</div>
            <div className="delta">dead · merged · acquired · rebranded</div>
          </div>
          <div className="stat-card">
            <div className="label">Active-side</div>
            <div className="value">{summary.activeSide}</div>
            <div className="delta">active · limited · inactive</div>
          </div>
          <div className="stat-card">
            <div className="label">Archive coverage</div>
            <div className="value">{archiveCoverage}%</div>
            <div className="delta">entries with archived URLs</div>
          </div>
        </aside>
      </section>

      <section className="overview">
        <div className="panel table-panel">
          <div className="controls">
            <div className="search">
              <input className="field" placeholder="Search by name, alias, or domain" readOnly />
            </div>
            <select className="field" style={{ maxWidth: '180px' }} disabled>
              <option>All types</option>
            </select>
            <select className="field" style={{ maxWidth: '210px' }} disabled>
              <option>Dead-side first</option>
            </select>
          </div>

          <div className="results-meta">
            <div>Showing all entities · dead-side entries first · sorted by latest death where available</div>
            <div>{entities.length} results in current slice</div>
          </div>

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
                  <td data-label="Name">
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
                  <td data-label="Type">
                    <span className="chip type">{entity.type.toUpperCase()}</span>
                  </td>
                  <td data-label="Status">
                    <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                  </td>
                  <td data-label="Death reason">
                    {entity.death_reason ? (
                      <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td data-label="Years">{formatYears(entity.launch_date, entity.death_date)}</td>
                  <td data-label="Origin">{entity.country_or_origin ?? '—'}</td>
                  <td data-label="Domain">{entity.official_domain_original ?? '—'}</td>
                  <td data-label="Archive">
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

        <aside className="panel detail-panel">
          {featured && featuredDetail ? (
            <>
              <div className="detail-header">
                <div>
                  <h3>{featured.canonical_name}</h3>
                  <p>{featured.summary}</p>
                </div>
                <div className="chips">
                  <span className="chip type">{featured.type.toUpperCase()}</span>
                  <span className={chipClass(featured.status)}>{STATUS_LABELS[featured.status]}</span>
                </div>
              </div>

              <div className="section">
                <h4>Key facts</h4>
                <div className="fact-grid">
                  <div className="fact"><div className="k">Launch</div><div className="v">{featured.launch_date?.slice(0, 4) ?? '—'}</div></div>
                  <div className="fact"><div className="k">Death</div><div className="v">{featured.death_date ?? '—'}</div></div>
                  <div className="fact"><div className="k">Origin</div><div className="v">{featured.country_or_origin ?? '—'}</div></div>
                  <div className="fact"><div className="k">Confidence</div><div className="v">{featured.confidence}</div></div>
                </div>
              </div>

              <div className="section">
                <h4>URL handling</h4>
                <div className="fact-grid">
                  <div className="fact"><div className="k">Original URL</div><div className="v">{featured.official_domain_original ?? '—'}</div></div>
                  <div className="fact"><div className="k">URL status</div><div className="v">{featured.official_url_status}</div></div>
                  <div className="fact" style={{ gridColumn: '1 / -1' }}>
                    <div className="k">Detail page</div>
                    <div className="v"><Link className="archive-link" href={`/exchange/${featured.slug}/`}>Open record</Link></div>
                  </div>
                </div>
              </div>

              <div className="callout">
                This record may be incomplete or revised. Dead-side entries prefer archived URLs over original
                domains. Use the detail page before treating the entry as final.
              </div>
            </>
          ) : null}
        </aside>
      </section>
    </main>
  )
}
