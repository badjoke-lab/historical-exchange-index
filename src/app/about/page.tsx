import type { Metadata } from 'next'
import { CONTACT_HREF, ISSUES_HREF } from '../../lib/site-constants'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn why Historical Exchange Index exists, what it is, what it is not, and how corrections are handled.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">About</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>Why HEI exists</h2>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          Historical Exchange Index exists to keep exchange identity, status shifts, major lifecycle events,
          and supporting records in one place. The goal is not to hype current winners, but to preserve a
          readable historical ledger of crypto exchange history.
        </p>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h4>What HEI is</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Quiet registry</div>
              <div className="v">A structured reference surface built for lookup, comparison of records, and historical browsing.</div>
            </div>
            <div className="fact">
              <div className="k">History-first</div>
              <div className="v">Designed to show what happened to exchanges over time, not just which ones still exist.</div>
            </div>
            <div className="fact">
              <div className="k">Evidence-aware</div>
              <div className="v">Built around identity, events, and supporting records rather than marketing copy.</div>
            </div>
            <div className="fact">
              <div className="k">Archive-aware</div>
              <div className="v">Treats dead-side URLs and historical captures carefully instead of assuming live links are safe.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>What HEI is not</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Not a trading platform</div>
              <div className="v">HEI does not execute trades or act as an exchange interface.</div>
            </div>
            <div className="fact">
              <div className="k">Not a leaderboard</div>
              <div className="v">It does not exist to rank exchanges by hype, volume, or recommendation score.</div>
            </div>
            <div className="fact">
              <div className="k">Not investment advice</div>
              <div className="v">Records should not be treated as investment guidance or safety guarantees.</div>
            </div>
            <div className="fact">
              <div className="k">Not a news feed</div>
              <div className="v">HEI is a registry surface, not a social stream or announcement wall.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Current scope</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            v0 focuses on a public registry built from canonical entity, event, and evidence records. It begins
            as a static site with a quiet, dense presentation rather than a feature-heavy application surface.
          </p>
        </div>

        <div className="section" id="corrections">
          <h4>Contact and corrections</h4>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            If you notice a missing record, broken classification, wrong date, unsafe URL treatment, or an
            important omission, use the contact / correction form below. If you prefer a public report path,
            GitHub Issues is also available.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href={CONTACT_HREF} target="_blank" rel="noreferrer">
              Open contact / corrections form
            </a>
            <a className="btn" href={ISSUES_HREF} target="_blank" rel="noreferrer">
              Open GitHub issues
            </a>
          </div>
        </div>
      </section>

      <section className="callout">
        HEI favors durable records over noise. Some records will stay provisional until stronger confirmation
        exists.
      </section>
    </main>
  )
}
