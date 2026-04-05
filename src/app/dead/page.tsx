import Link from 'next/link'
import { loadEntities } from '../../lib/data/load-entities'
import { formatYears } from '../../lib/utils/format-years'
import { DEATH_REASON_LABELS } from '../../lib/utils/death-reason-meta'
import { STATUS_LABELS } from '../../lib/utils/status-meta'

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
        <p className="muted">Dead Exchanges</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>Dead-side registry</h2>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          Closed, absorbed, rebranded, or otherwise gone exchanges. This page emphasizes end state,
          disappearance cause, and archive-aware lookup.
        </p>
      </section>

      <section className="panel table-panel">
        <div className="results-meta">
          <div>Showing dead / merged / acquired / rebranded entries</div>
          <div>{entities.length} results</div>
        </div>

        <table>
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
                <td data-label="Name">
                  <div className="name-cell">
                    <Link className="name-main subtle-link" href={`/exchange/${entity.slug}/`}>
                      {entity.canonical_name}
                    </Link>
                    <span className="name-sub">{entity.official_domain_original ?? '—'}</span>
                  </div>
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
      </section>
    </main>
  )
}
