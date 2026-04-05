import Link from 'next/link'
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

function chipClass(status: string) {
  return `chip ${status}`
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
      <main className="detail-layout">
        <section className="panel detail-main">
          <div className="detail-header">
            <div>
              <h3>Entry not found</h3>
              <p>No record exists for this slug yet.</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const { entity, events, evidence } = detail
  const originalUrlClickable =
    entity.official_url_status === 'live_verified' || entity.official_url_status === 'live_unverified'

  return (
    <main className="detail-layout">
      <section className="panel detail-main">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: 0, fontSize: '12px' }}>Exchange record</p>
            <h3 style={{ marginTop: '8px' }}>{entity.canonical_name}</h3>
            <p>{entity.summary}</p>
          </div>
          <div className="chips">
            <span className="chip type">{entity.type.toUpperCase()}</span>
            <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
            {entity.death_reason ? (
              <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
            ) : null}
          </div>
        </div>

        <div className="section">
          <h4>Summary</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
            {entity.aliases.length > 0 ? `Also known as: ${entity.aliases.join(', ')}.` : 'No aliases listed.'}
          </p>
        </div>

        <div className="section">
          <h4>Timeline</h4>
          <div className="timeline">
            {events.length === 0 ? (
              <div className="event">
                <div className="event-title">No events yet</div>
                <p>This record does not have timeline entries yet.</p>
              </div>
            ) : (
              events.map((event) => (
                <div className="event" key={event.id}>
                  <div className="event-top">
                    <span className="event-title">{event.title}</span>
                    <div className="chips">
                      <span className="chip accent">{formatDate(event.event_date)}</span>
                      <span className="chip type">{event.event_type}</span>
                      <span className={chipClass(event.event_status_effect)}>{event.impact_level}</span>
                    </div>
                  </div>
                  <p>{event.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="section">
          <h4>Evidence</h4>
          <div className="evidence-list">
            {evidence.length === 0 ? (
              <div className="evidence">
                <div className="evidence-title">No evidence yet</div>
                <div className="evidence-meta">
                  <span>This record does not yet have supporting items.</span>
                </div>
              </div>
            ) : (
              evidence.map((item) => (
                <div className="evidence" key={item.id}>
                  <div className="evidence-title">
                    {item.url ? (
                      <a className="subtle-link" href={item.url} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </div>
                  <div className="evidence-meta">
                    <span>{item.publisher}</span>
                    <span>{formatDate(item.published_at)}</span>
                    <span>{item.source_type}</span>
                    <span>{item.reliability} reliability</span>
                    <span>{item.claim_scope}</span>
                    {item.archived_url ? (
                      <a className="archive-link" href={item.archived_url} target="_blank" rel="noreferrer">
                        archive
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <aside className="panel detail-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h4>Key facts</h4>
          <div className="fact-grid">
            <div className="fact"><div className="k">Launch</div><div className="v">{entity.launch_date ?? '—'}</div></div>
            <div className="fact"><div className="k">Death</div><div className="v">{entity.death_date ?? '—'}</div></div>
            <div className="fact"><div className="k">Origin</div><div className="v">{entity.country_or_origin ?? '—'}</div></div>
            <div className="fact"><div className="k">Confidence</div><div className="v">{entity.confidence}</div></div>
            <div className="fact"><div className="k">Years</div><div className="v">{formatYears(entity.launch_date, entity.death_date)}</div></div>
            <div className="fact"><div className="k">Last verified</div><div className="v">{formatDate(entity.last_verified_at)}</div></div>
          </div>
        </div>

        <div className="section">
          <h4>URL handling</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Original URL</div>
              <div className="v">
                {entity.official_url_original ? (
                  originalUrlClickable ? (
                    <a className="subtle-link" href={entity.official_url_original} target="_blank" rel="noreferrer">
                      {entity.official_url_original}
                    </a>
                  ) : (
                    entity.official_url_original
                  )
                ) : '—'}
              </div>
            </div>
            <div className="fact">
              <div className="k">URL status</div>
              <div className="v">{URL_STATUS_LABELS[entity.official_url_status]}</div>
            </div>
            <div className="fact">
              <div className="k">Domain</div>
              <div className="v">{entity.official_domain_original ?? '—'}</div>
            </div>
            <div className="fact">
              <div className="k">Archived URL</div>
              <div className="v">
                {entity.archived_url ? (
                  <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">
                    View archived site
                  </a>
                ) : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="callout">
          This record may be incomplete or revised. Dead-side entries prefer archived URLs over original domains.
          Dates, causes, and classifications may change when stronger evidence becomes available.
        </div>

        <div className="section">
          <h4>Navigation</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Registry</div>
              <div className="v"><Link className="subtle-link" href="/">Back to home</Link></div>
            </div>
            <div className="fact">
              <div className="k">Dead-side</div>
              <div className="v"><Link className="subtle-link" href="/dead">Open dead view</Link></div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  )
}
