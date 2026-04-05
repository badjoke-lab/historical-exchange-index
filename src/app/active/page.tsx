import { loadEntities } from '../../lib/data/load-entities'
import { formatYears } from '../../lib/utils/format-years'
import { STATUS_LABELS } from '../../lib/utils/status-meta'
import { URL_STATUS_LABELS } from '../../lib/utils/url-meta'

const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

export default function ActivePage() {
  const entities = loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))

  return (
    <main>
      <section className="page-section">
        <p className="muted">Active Exchanges</p>
        <h1>Active-side registry</h1>
        <p>
          Active, limited, and inactive-side entries. This view emphasizes current classification and URL
          handling rather than ranking.
        </p>
      </section>

      <section className="page-section">
        <table className="data-table">
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
                <td>{entity.canonical_name}</td>
                <td>{STATUS_LABELS[entity.status]}</td>
                <td>{formatYears(entity.launch_date, null).split('–')[0]}</td>
                <td>{entity.country_or_origin ?? '—'}</td>
                <td>{entity.official_domain_original ?? '—'}</td>
                <td>{URL_STATUS_LABELS[entity.official_url_status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
