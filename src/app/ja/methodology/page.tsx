import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'methodology', pathname: '/methodology/' })
}

const principles = [
  ['Registry first', 'HEIはランキングではなく、取引所のidentity・status・event・evidenceを記録する歴史台帳です。'],
  ['Entity first', '現在の集計単位はentityです。DEXのchain deploymentを別entityとして水増ししません。'],
  ['Archive aware', '終了側の旧domainは史料として保持し、archiveを安全な主導線として優先します。'],
  ['Uncertainty visible', '根拠が弱い場合はdeadと断定せず、inactiveやunknownを残します。'],
]

export default function JapaneseMethodologyPage() {
  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'methodology')} englishHref="/methodology/">
      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h3>中核原則</h3>
          <div className="fact-grid">
            {principles.map(([title, body]) => (
              <div className="fact" key={title}>
                <div className="k">{title}</div>
                <div className="v">{body}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <h3>statusとdeath_reason</h3>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            statusは現在または終端の状態、death_reasonは消滅・終了の主因を表します。内部enum値は全言語で共通です。
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            dead・merged・acquired・rebrandedは終了側、active・limited・inactiveは稼働側として閲覧します。
          </p>
        </div>
        <div className="section">
          <h3>evidenceとURL安全性</h3>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            evidenceはentity、event、status、death_reason、date、URL history、ownershipなど特定のclaimを支えるために使います。
            repurposed・unsafe・dead_domainの旧URLは通常リンクとして扱いません。
          </p>
        </div>
      </section>
    </JapanesePilotSurface>
  )
}
