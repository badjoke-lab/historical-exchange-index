import { buildDetailView } from '../../../lib/data/build-detail-view'
import { loadEntities } from '../../../lib/data/load-entities'
import { formatDate } from '../../../lib/utils/format-date'
import { formatYears } from '../../../lib/utils/format-years'
import { STATUS_LABELS } from '../../../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../../../lib/utils/death-reason-meta'
import { URL_STATUS_LABELS } from '../../../lib/utils/url-meta'

type DetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return loadEntities().map((entity) => ({
    slug: entity.slug,
  }))
}

export default async function ExchangeDetailPage({ params }: DetailPageProps) {
  const { slug } = await params
  const detail = buildDetailView(slug)

  if (!detail) {
    return (
      <main style={{ padding: '24px', fontFamily: 'sans-serif' }}>
        <h1>Entry not found</h1>
        <p>No record exists for this slug yet.</p>
      </main>
    )
  }

  const { entity, events, evidence } = detail

  return (
    <main style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Exchange record</p>
        <h1 style={{ margin: '8px 0 12px', fontSize: '32px' }}>{entity.canonical_name}</h1>
        <p style={{ maxWidth: '760px', lineHeight: 1.6 }}>{entity.summary}</p>
      </header>

      <section style={{ marginBottom: '24px' }}>
        <h2>Facts</h2>
        <ul>
          <li>Type: {entity.type}</li>
          <li>Status: {STATUS_LABELS[entity.status]}</li>
          <li>
            Death reason: {entity.death_reason ? DEATH_REASON_LABELS[entity.death_reason] : '—'}
          </li>
          <li>Years: {formatYears(entity.launch_date, entity.death_date)}</li>
          <li>Origin: {entity.country_or_origin ?? '—'}</li>
          <li>Confidence: {entity.confidence}</li>
          <li>Last verified: {formatDate(entity.last_verified_at)}</li>
        </ul>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2>URL handling</h2>
        <ul>
          <li>Original URL: {entity.official_url_original ?? '—'}</li>
          <li>Domain: {entity.official_domain_original ?? '—'}</li>
          <li>URL status: {URL_STATUS_LABELS[entity.official_url_status]}</li>
          <li>Archived URL: {entity.archived_url ?? '—'}</li>
        </ul>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2>Timeline</h2>
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id} style={{ marginBottom: '12px' }}>
                <strong>{formatDate(event.event_date)}</strong> — {event.title}
                <div style={{ fontSize: '14px', lineHeight: 1.5 }}>{event.description}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  type={event.event_type} / impact={event.impact_level} / status_effect={event.event_status_effect}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Evidence</h2>
        {evidence.length === 0 ? (
          <p>No evidence yet.</p>
        ) : (
          <ul>
            {evidence.map((item) => (
              <li key={item.id} style={{ marginBottom: '12px' }}>
                <strong>{item.title}</strong>
                <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
                  {item.publisher} / {formatDate(item.published_at)} / {item.source_type} / {item.reliability}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>claim_scope={item.claim_scope}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
