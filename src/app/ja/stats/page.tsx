import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { loadEntities } from '../../../lib/data/load-entities'
import { loadEvents } from '../../../lib/data/load-events'
import { loadEvidence } from '../../../lib/data/load-evidence'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'stats', pathname: '/stats/' })
}

export default function JapaneseStatsPage() {
  const entities = loadEntities()
  const events = loadEvents()
  const evidence = loadEvidence()
  const deadSide = entities.filter((entity) => DEAD_SIDE.has(entity.status)).length
  const activeSide = entities.filter((entity) => ACTIVE_SIDE.has(entity.status)).length
  const archiveCoverage = entities.length > 0
    ? Math.round((entities.filter((entity) => entity.archived_url).length / entities.length) * 100)
    : 0
  const highConfidence = entities.length > 0
    ? Math.round((entities.filter((entity) => entity.confidence === 'high').length / entities.length) * 100)
    : 0

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'stats')} englishHref="/stats/">
      <section className="panel summary-strip">
        <div className="summary-tile"><div className="label">Entities</div><div className="value">{entities.length}</div><div className="hint">レビュー済みentity</div></div>
        <div className="summary-tile"><div className="label">終了側</div><div className="value">{deadSide}</div><div className="hint">dead-side total</div></div>
        <div className="summary-tile"><div className="label">稼働側</div><div className="value">{activeSide}</div><div className="hint">active-side total</div></div>
        <div className="summary-tile"><div className="label">Events</div><div className="value">{events.length}</div><div className="hint">timeline records</div></div>
        <div className="summary-tile"><div className="label">Evidence</div><div className="value">{evidence.length}</div><div className="hint">supporting records</div></div>
        <div className="summary-tile"><div className="label">Archive coverage</div><div className="value">{archiveCoverage}%</div><div className="hint">archive URLあり</div></div>
        <div className="summary-tile"><div className="label">High confidence</div><div className="value">{highConfidence}%</div><div className="hint">entity confidence</div></div>
      </section>
    </JapanesePilotSurface>
  )
}
