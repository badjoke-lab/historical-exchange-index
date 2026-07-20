import Link from 'next/link'
import type { Metadata } from 'next'
import { buildDetailView } from '../../../../lib/data/build-detail-view'
import { loadEntities } from '../../../../lib/data/load-entities'
import { getEntityCopyOverlay, getEventCopyOverlay } from '../../../../lib/i18n/get-copy-overlays'
import { mergeEntityCopy } from '../../../../lib/i18n/merge-entity-copy'
import { mergeEventCopy } from '../../../../lib/i18n/merge-event-copy'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../../lib/i18n/page-presentations'
import { formatDate } from '../../../../lib/utils/format-date'
import { formatYears } from '../../../../lib/utils/format-years'

type JapaneseDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return loadEntities().map((entity) => ({ slug: entity.slug }))
}

export async function generateMetadata({ params }: JapaneseDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const detail = buildDetailView(slug)

  if (!detail) {
    return buildLocalizedPageMetadata({
      locale: 'ja',
      page: 'exchange',
      pathname: `/exchange/${slug}/`,
      titleOverride: '取引所レコードが見つかりません',
      descriptionOverride: 'このslugに対応するレビュー済みHEIレコードはありません。',
    })
  }

  const { entity } = detail
  return buildLocalizedPageMetadata({
    locale: 'ja',
    page: 'exchange',
    pathname: `/exchange/${entity.slug}/`,
    titleOverride: `${entity.canonical_name} — 取引所レコード`,
    descriptionOverride: `${entity.canonical_name}のHEI歴史レコード。status、URL履歴、event、evidenceを確認できます。`,
  })
}

function safeOriginalUrl(status: string | null | undefined) {
  return status === 'live_verified' || status === 'live_unverified'
}

export default async function JapaneseExchangeDetailPage({ params }: JapaneseDetailPageProps) {
  const { slug } = await params
  const detail = buildDetailView(slug)
  const presentation = getPagePresentation('ja', 'exchange')

  if (!detail) {
    return (
      <main className="longform">
        <section className="panel longform-panel">
          <p className="muted">{presentation.eyebrow}</p>
          <h1>レコードが見つかりません</h1>
          <p className="muted">このslugに対応するレビュー済みHEIレコードはありません。</p>
        </section>
      </main>
    )
  }

  const { entity, events, evidence, relatedEntities, prefersArchive } = detail
  const entityOverlay = getEntityCopyOverlay('ja')
  const eventOverlay = getEventCopyOverlay('ja')
  const localizedEntity = mergeEntityCopy(entity, entityOverlay)
  const localizedEvents = events.map((event) => mergeEventCopy(event, eventOverlay))
  const originalClickable = safeOriginalUrl(entity.official_url_status)

  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div className="muted" style={{ fontSize: '12px', marginBottom: '18px' }}>
          <Link className="subtle-link" href="/ja/">ホーム</Link>
          <span> / </span>
          <Link className="subtle-link" href={['dead', 'merged', 'acquired', 'rebranded'].includes(entity.status) ? '/ja/dead/' : '/ja/active/'}>
            {['dead', 'merged', 'acquired', 'rebranded'].includes(entity.status) ? '終了側' : '稼働側'}
          </Link>
          <span> / </span>
          <span>{entity.canonical_name}</span>
        </div>

        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>{presentation.eyebrow}</p>
            <h1 style={{ margin: 0, fontSize: '34px', letterSpacing: '-0.04em' }}>{entity.canonical_name}</h1>
            <p className="muted" style={{ marginTop: '10px', lineHeight: 1.7 }}>{localizedEntity.summary}</p>
          </div>
          <div className="chips">
            <span className="chip type">{entity.type.toUpperCase()}</span>
            <span className={`chip ${entity.status}`}>{entity.status}</span>
            {entity.death_reason ? <span className="chip reason">{entity.death_reason}</span> : null}
          </div>
        </div>

        {entity.aliases.length > 0 ? (
          <p className="muted" style={{ fontSize: '13px' }}>別名: {entity.aliases.join(', ')}</p>
        ) : null}
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h2>基本情報</h2>
          <div className="fact-grid">
            <div className="fact"><div className="k">期間</div><div className="v">{formatYears(entity.launch_date, entity.death_date)}</div></div>
            <div className="fact"><div className="k">Origin</div><div className="v">{entity.country_or_origin ?? 'Unknown'}</div></div>
            <div className="fact"><div className="k">Confidence</div><div className="v">{entity.confidence}</div></div>
            <div className="fact"><div className="k">Last verified</div><div className="v">{entity.last_verified_at}</div></div>
          </div>
        </div>

        <div className="section">
          <h2>URL履歴</h2>
          <div className="fact-grid">
            <div className="fact"><div className="k">Original domain</div><div className="v">{entity.official_domain_original ?? 'Unknown'}</div></div>
            <div className="fact"><div className="k">URL status</div><div className="v">{entity.official_url_status ?? 'unknown'}</div></div>
          </div>
          <div className="hero-actions" style={{ marginTop: '14px' }}>
            {entity.archived_url ? <a className="btn btn-primary" href={entity.archived_url} target="_blank" rel="noreferrer">アーカイブを見る</a> : null}
            {entity.official_url_original && originalClickable ? <a className="btn" href={entity.official_url_original} target="_blank" rel="noreferrer">Original URL</a> : null}
            {entity.official_url_original && !originalClickable ? <span className="muted">旧URL: {entity.official_url_original}</span> : null}
          </div>
          {prefersArchive ? <p className="muted">このレコードでは安全性と史料性のためarchive導線を優先します。</p> : null}
        </div>

        <div className="section">
          <h2>Timeline</h2>
          {localizedEvents.length > 0 ? (
            <div className="record-list">
              {localizedEvents.map((event) => (
                <article className="record-item" key={event.id}>
                  <div className="record-main">
                    <strong className="record-title">{event.title}</strong>
                    <div className="record-meta"><span>{event.event_date ? formatDate(event.event_date) : 'Unknown date'}</span><span>{event.event_type}</span><span>{event.impact_level}</span></div>
                    <p className="muted" style={{ marginBottom: 0 }}>{event.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="muted">公開eventはまだありません。</p>}
        </div>

        <div className="section">
          <h2>Evidence</h2>
          {evidence.length > 0 ? (
            <div className="record-list">
              {evidence.map((source) => (
                <article className="record-item" key={source.id}>
                  <div className="record-main">
                    <a className="record-title subtle-link" href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                    <div className="record-meta"><span>{source.publisher}</span><span>{source.reliability}</span><span>{source.claim_scope ?? 'entity'}</span></div>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="muted">公開evidenceはまだありません。</p>}
        </div>

        {relatedEntities.length > 0 ? (
          <div className="section">
            <h2>関連entity</h2>
            <div className="hero-actions">
              {relatedEntities.map((related) => <Link className="btn" href={`/ja/exchange/${related.slug}/`} key={related.id}>{related.canonical_name}</Link>)}
            </div>
          </div>
        ) : null}

        <div className="section">
          <Link className="btn" href={`/exchange/${entity.slug}/`} hrefLang="en">English full dossier</Link>
        </div>
      </section>
    </main>
  )
}
