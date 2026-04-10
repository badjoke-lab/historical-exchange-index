import Link from 'next/link'
import { buildDetailView } from '../../../lib/data/build-detail-view'
import { loadEntities } from '../../../lib/data/load-entities'
import { formatDate } from '../../../lib/utils/format-date'
import { formatYears } from '../../../lib/utils/format-years'
import { STATUS_LABELS } from '../../../lib/utils/status-meta'
import { DEATH_REASON_LABELS } from '../../../lib/utils/death-reason-meta'
import { URL_STATUS_LABELS } from '../../../lib/utils/url-meta'
import { CORRECTION_HREF } from '../../../lib/site-constants'

type DetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])

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
      <main className="longform">
        <section className="panel longform-panel">
          <div className="detail-header">
            <div>
              <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Exchange record</p>
              <h2 style={{ margin: 0, fontSize: '34px', letterSpacing: '-0.04em' }}>Entry not found</h2>
              <p className="muted" style={{ marginTop: '10px', lineHeight: 1.7 }}>
                No record exists for this slug yet.
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const { entity, events, evidence, relatedEntities, prefersArchive } = detail
  const isDeadSide = DEAD_SIDE.has(entity.status)

  const originalUrlClickable =
    entity.official_url_status === 'live_verified' ||
    entity.official_url_status === 'live_unverified'

  const shouldRenderOriginalAsPlainText =
    !originalUrlClickable ||
    entity.official_url_status === 'repurposed' ||
    entity.official_url_status === 'dead_domain' ||
    entity.official_url_status === 'unsafe'

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div style={{ display: 'grid', gap: '18px' }}>
          <div className="muted" style={{ fontSize: '12px' }}>
            <Link className="subtle-link" href="/">Home</Link>
            <span> / </span>
            <Link className="subtle-link" href={isDeadSide ? '/dead' : '/active'}>
              {isDeadSide ? 'Dead' : 'Active'}
            </Link>
            <span> / </span>
            <span>{entity.canonical_name}</span>
          </div>

          <div className="detail-header">
            <div>
              <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Exchange record</p>
              <h2 style={{ margin: 0, fontSize: '34px', letterSpacing: '-0.04em' }}>{entity.canonical_name}</h2>
              <p className="muted" style={{ marginTop: '10px', lineHeight: 1.7 }}>
                {entity.summary}
              </p>
            </div>

            <div className="chips">
              <span className="chip type">{entity.type.toUpperCase()}</span>
              <span className={chipClass(entity.status)}>{STATUS_LABELS[entity.status]}</span>
              {entity.death_reason ? (
                <span className="chip reason">{DEATH_REASON_LABELS[entity.death_reason]}</span>
              ) : null}
            </div>
          </div>

          {entity.aliases.length > 0 ? (
            <div className="muted" style={{ fontSize: '13px', lineHeight: 1.7 }}>
              Also known as: {entity.aliases.join(', ')}
            </div>
          ) : null}

          <div className="section">
            <h4>Key facts</h4>
            <div className="fact-grid">
              <div className="fact">
                <div className="k">Launch date</div>
                <div className="v">{entity.launch_date ?? '—'}</div>
              </div>
              <div className="fact">
                <div className="k">Death date</div>
                <div className="v">{entity.death_date ?? '—'}</div>
              </div>
              <div className="fact">
                <div className="k">Years</div>
                <div className="v">{formatYears(entity.launch_date, entity.death_date)}</div>
              </div>
              <div className="fact">
                <div className="k">Origin</div>
                <div className="v">{entity.country_or_origin ?? '—'}</div>
              </div>
              <div className="fact">
                <div className="k">Confidence</div>
                <div className="v">{entity.confidence}</div>
              </div>
              <div className="fact">
                <div className="k">Last verified</div>
                <div className="v">{formatDate(entity.last_verified_at)}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h4>URL handling</h4>
            <div className="fact-grid">
              <div className="fact">
                <div className="k">Preferred action</div>
                <div className="v">
                  {prefersArchive
                    ? 'Use archived URL first for historical viewing.'
                    : 'Use current URL handling based on status below.'}
                </div>
              </div>

              <div className="fact">
                <div className="k">URL status</div>
                <div className="v">{URL_STATUS_LABELS[entity.official_url_status]}</div>
              </div>

              <div className="fact">
                <div className="k">Original URL</div>
                <div className="v">
                  {entity.official_url_original ? (
                    shouldRenderOriginalAsPlainText ? (
                      entity.official_url_original
                    ) : (
                      <a
                        className="subtle-link"
                        href={entity.official_url_original}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {entity.official_url_original}
                      </a>
                    )
                  ) : (
                    '—'
                  )}
                </div>
              </div>

              <div className="fact">
                <div className="k">Archived URL</div>
                <div className="v">
                  {entity.archived_url ? (
                    <a className="archive-link" href={entity.archived_url} target="_blank" rel="noreferrer">
                      View archived site
                    </a>
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <h4>Summary</h4>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              {entity.summary}
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
                        <span className="chip reason">{event.impact_level}</span>
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

          <div className="section">
            <h4>Related records</h4>
            <div className="fact-grid">
              {relatedEntities.length === 0 ? (
                <div className="fact" style={{ gridColumn: '1 / -1' }}>
                  <div className="k">Related</div>
                  <div className="v">No related records suggested yet.</div>
                </div>
              ) : (
                relatedEntities.map((item) => (
                  <div className="fact" key={item.id}>
                    <div className="k">{item.type.toUpperCase()}</div>
                    <div className="v">
                      <Link className="subtle-link" href={`/exchange/${item.slug}/`}>
                        {item.canonical_name}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="section">
            <h4>Notes and record state</h4>
            <div className="fact-grid">
              <div className="fact">
                <div className="k">Record note</div>
                <div className="v">{entity.notes ? entity.notes : 'No additional record note yet.'}</div>
              </div>
              <div className="fact">
                <div className="k">Revision state</div>
                <div className="v">
                  Records may be incomplete, approximate, contested, or revised as better evidence becomes available.
                </div>
              </div>
            </div>
          </div>

          <div className="callout">
            This record may be incomplete or revised. Dead-side entries prefer archived URLs over original domains.
            Dates, causes, and classifications may change when stronger evidence becomes available.
            <span> </span>
            <a className="archive-link" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
              Submit correction
            </a>
          </div>

          <div className="section">
            <h4>Navigation</h4>
            <div className="fact-grid">
              <div className="fact">
                <div className="k">Registry</div>
                <div className="v"><Link className="subtle-link" href="/">Back to home</Link></div>
              </div>
              <div className="fact">
                <div className="k">{isDeadSide ? 'Dead-side' : 'Active-side'}</div>
                <div className="v">
                  <Link className="subtle-link" href={isDeadSide ? '/dead' : '/active'}>
                    Open {isDeadSide ? 'dead' : 'active'} view
                  </Link>
                </div>
              </div>
              <div className="fact">
                <div className="k">Correction</div>
                <div className="v">
                  <a className="subtle-link" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
                    Report an issue
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
