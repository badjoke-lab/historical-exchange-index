import { buildRegistryView } from '../lib/data/build-registry-view'
import { formatYears } from '../lib/utils/format-years'
import { STATUS_LABELS } from '../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../lib/utils/death-reason-meta'

export default function HomePage() {
  const { entities, summary } = buildRegistryView()

  return (
    <main style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Historical Exchange Index</p>
        <h1 style={{ margin: '8px 0 12px', fontSize: '32px' }}>Historical Exchange Index</h1>
        <p style={{ maxWidth: '760px', lineHeight: 1.6 }}>
          A historical registry of crypto exchanges. HEI tracks entity identity, status, major lifecycle
          events, and supporting records in a structured archive-style format.
        </p>
      </header>

      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>Total: {summary.total}</div>
        <div>Active-side: {summary.activeSide}</div>
        <div>Dead-side: {summary.deadSide}</div>
        <div>CEX: {summary.cex}</div>
        <div>DEX: {summary.dex}</div>
        <div>Hybrid: {summary.hybrid}</div>
      </section>

      <section>
        <h2 style={{ marginBottom: '12px' }}>Registry slice</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Death reason</th>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Years</th>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Origin</th>
              <th style={{ textAlign: 'left', padding: '10px 8px' }}>Domain</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id} style={{ borderTop: '1px solid #ddd' }}>
                <td style={{ padding: '10px 8px' }}>
                  <div>{entity.canonical_name}</div>
                  {entity.aliases.length > 0 ? (
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{entity.aliases.join(', ')}</div>
                  ) : null}
                </td>
                <td style={{ padding: '10px 8px' }}>{entity.type}</td>
                <td style={{ padding: '10px 8px' }}>{STATUS_LABELS[entity.status]}</td>
                <td style={{ padding: '10px 8px' }}>
                  {entity.death_reason ? DEATH_REASON_LABELS[entity.death_reason] : '—'}
                </td>
                <td style={{ padding: '10px 8px' }}>{formatYears(entity.launch_date, entity.death_date)}</td>
                <td style={{ padding: '10px 8px' }}>{entity.country_or_origin ?? '—'}</td>
                <td style={{ padding: '10px 8px' }}>{entity.official_domain_original ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
