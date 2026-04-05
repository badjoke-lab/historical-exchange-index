import Link from 'next/link'
import { loadEntities } from '../../lib/data/load-entities'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { URL_STATUS_LABELS } from '../../lib/utils/url-meta'

const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

function chipClass(status: string) {
  return `chip ${status}`
}

export default function ActivePage() {
  const entities = loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">Active Exchanges</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>Active-side registry</h2>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          Active, limited, and inactive-side entries. This page emphasizes current classification and URL
          handling rather than ranking or recommendation.
        </p>
      </section>

      <section className="panel table-panel">
        <div className="results-meta">
          <div>Showing active / limited / inactive entries</div>
          <div>{entities.length} results</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Launch year</th>
              <th>Origin</th>
              <th>Domain</th>
              <th>URL status</th>
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
                    <span className="name-sub">{entity.type.toUpperCase()}</span>
                  </div>
                </td>
                <td data-label="Status">
                  <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
                </td>
                <td data-label="Launch year">{formatYears(entity.launch_date, null).split('–')[0]}</td>
                <td data-label="Origin">{entity.country_or_origin ?? '—'}</td>
                <td data-label="Domain">{entity.official_domain_original ?? '—'}</td>
                <td data-label="URL status">{URL_STATUS_LABELS[entity.official_url_status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
