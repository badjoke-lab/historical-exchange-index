import type { ReactNode } from 'react'
import type { PagePresentation } from '../../lib/i18n/page-presentations'

type LocalizedPageHeaderProps = {
  presentation: PagePresentation
  actions?: ReactNode
  footer?: ReactNode
  compact?: boolean
}

export default function LocalizedPageHeader({
  presentation,
  actions,
  footer,
  compact = false,
}: LocalizedPageHeaderProps) {
  return (
    <section className={compact ? 'panel longform-panel' : 'panel longform-panel'}>
      <div className={actions ? 'detail-header' : undefined}>
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
          {footer}
        </div>
        {actions ? <div className="hero-actions" style={{ marginTop: 0 }}>{actions}</div> : null}
      </div>
    </section>
  )
}
