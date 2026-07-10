import Link from 'next/link'
import type { Metadata } from 'next'
import { buildRegistryView } from '../../lib/data/build-registry-view'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'home', pathname: '/' })
}

export default function JapaneseHomePage() {
  const { summary } = buildRegistryView()
  const presentation = getPagePresentation('ja', 'home')

  return (
    <main className="home-hub">
      <section className="hero compact-hero">
        <div className="panel hero-main">
          <div className="eyebrow">{presentation.eyebrow}</div>
          <h2>{presentation.heading}</h2>
          <p>{presentation.intro}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/ja/dead/">終了側を見る</Link>
            <Link className="btn" href="/ja/active/">稼働側を見る</Link>
            <Link className="btn" href="/ja/explore/">エクスプローラー</Link>
          </div>
        </div>
      </section>

      <section className="panel summary-strip summary-strip-home">
        <div className="summary-tile"><div className="label">取引所レコード</div><div className="value">{summary.total}</div><div className="hint">entity単位</div></div>
        <div className="summary-tile"><div className="label">終了側</div><div className="value">{summary.deadSide}</div><div className="hint">dead・merged・acquired・rebranded</div></div>
        <div className="summary-tile"><div className="label">稼働側</div><div className="value">{summary.activeSide}</div><div className="hint">active・limited・inactive</div></div>
        <div className="summary-tile"><div className="label">公開言語</div><div className="value">EN / JA</div><div className="hint">日本語パイロット</div></div>
      </section>

      <section className="home-entry-grid">
        <section className="panel home-entry-card"><div className="home-section-copy"><h3>方法論</h3><p>status、death_reason、証拠、URL安全性、不確実性の扱いを確認します。</p></div><Link className="btn" href="/ja/methodology/">開く</Link></section>
        <section className="panel home-entry-card"><div className="home-section-copy"><h3>統計と品質</h3><p>台帳の規模、構成、カバレッジ、証拠の厚さを確認します。</p></div><div className="hero-actions"><Link className="btn" href="/ja/stats/">統計</Link><Link className="btn" href="/ja/quality/">品質</Link></div></section>
      </section>
    </main>
  )
}
