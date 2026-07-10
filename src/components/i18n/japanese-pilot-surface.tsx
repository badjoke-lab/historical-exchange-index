import Link from 'next/link'
import type { ReactNode } from 'react'
import type { PagePresentation } from '../../lib/i18n/page-presentations'

type JapanesePilotSurfaceProps = {
  presentation: PagePresentation
  englishHref: string
  children?: ReactNode
  actions?: ReactNode
}

export default function JapanesePilotSurface({
  presentation,
  englishHref,
  children,
  actions,
}: JapanesePilotSurfaceProps) {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>
              {presentation.eyebrow}
            </p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>
              {presentation.heading}
            </h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '82ch' }}>
              {presentation.intro}
            </p>
          </div>
          <div className="hero-actions" style={{ marginTop: 0 }}>
            {actions}
            <Link className="btn" href={englishHref} hrefLang="en">
              English full view
            </Link>
          </div>
        </div>
      </section>

      {children}

      <section className="callout">
        日本語パイロットでは、ナビゲーション、ページ概要、主要ラベルを日本語化しています。
        レコード本文や一部の分析ラベルは、canonical dataを分岐させないため英語をfallback表示する場合があります。
      </section>
    </main>
  )
}
