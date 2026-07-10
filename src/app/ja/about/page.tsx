import Link from 'next/link'
import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'about', pathname: '/about/' })
}

export default function JapaneseAboutPage() {
  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'about')} englishHref="/about/">
      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h3>HEIとは</h3>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Historical Exchange Indexは、暗号資産取引所のidentity、status、重要なevent、URL履歴、evidenceを一つの歴史台帳として扱うプロジェクトです。
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            ランキングや投資推奨ではなく、稼働中と終了済みを同じregistryで追跡し、後から検証できる形で残すことを目的としています。
          </p>
        </div>
        <div className="section">
          <h3>日本語パイロット</h3>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            日本語版は段階導入です。UI、概要、主要導線から始め、canonical dataは英語版と共通の単一source of truthを使います。
          </p>
          <Link className="btn" href="/ja/methodology/">日本語の方法論概要へ</Link>
        </div>
      </section>
    </JapanesePilotSurface>
  )
}
