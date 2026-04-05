import { loadEntities } from '../../lib/data/load-entities'
import { formatYears } from '../../lib/utils/format-years'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { STATUS_LABELS } from '../../lib/utils/status-meta'

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])

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
    <main>
      <section className="page-section">
        <p className="muted">Dead Exchanges</p>
        <h1>Dead-side registry</h1>
        <p>
          Closed, absorbed, rebranded, or otherwise gone exchanges. Archive-aware historical browsing,
          ordered by latest known end date first.
        </p>
      </section>

      <section className="page-section">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Death reason</th>
              <th>Years</th>
              <th>Origin</th>
              <th>Archive</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id}>
                <td>
                  <div>{entity.canonical_name}</div>
                  <div className="muted">{entity.official_domain_original ?? '—'}</div>
                </td>
                <td>{STATUS_LABELS[entity.status]}</td>
                <td>{entity.death_reason ? DEATH_REASON_LABELS[entity.death_reason] : '—'}</td>
                <td>{formatYears(entity.launch_date, entity.death_date)}</td>
                <td>{entity.country_or_origin ?? '—'}</td>
                <td>{entity.archived_url ? 'Archive available' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
