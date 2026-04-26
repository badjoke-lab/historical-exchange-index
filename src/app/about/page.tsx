import type { Metadata } from 'next'
import { CONTACT_HREF, ISSUES_HREF } from '../../lib/site-constants'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Historical Exchange Index, a historical registry of crypto exchanges covering active, dead, merged, acquired, and rebranded exchange records.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">About</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>Why Historical Exchange Index exists</h2>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '82ch' }}>
          Historical Exchange Index exists to keep crypto exchange identity, status shifts, major lifecycle events,
          archived URLs, and supporting evidence in one place. The goal is not to hype current winners, but to
          preserve a readable historical registry of crypto exchange history.
        </p>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '82ch' }}>
          Existing information is often split across live exchange lists, DEX trackers, news articles, shutdown notices,
          archived pages, and exchange graveyards. HEI tries to bring those fragments into one structured registry view.
        </p>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h4>What HEI is</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Quiet registry</div>
              <div className="v">A structured reference surface built for lookup, record comparison, and historical browsing.</div>
            </div>
            <div className="fact">
              <div className="k">History-first</div>
              <div className="v">Designed to show what happened to exchanges over time, not just which ones still exist.</div>
            </div>
            <div className="fact">
              <div className="k">Evidence-aware</div>
              <div className="v">Built around identity, events, source links, and supporting records rather than marketing copy.</div>
            </div>
            <div className="fact">
              <div className="k">Archive-aware</div>
              <div className="v">Treats dead-side URLs and historical captures carefully instead of assuming old live links are safe.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>What HEI is not</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Not a trading platform</div>
              <div className="v">HEI does not execute trades, custody funds, or act as an exchange interface.</div>
            </div>
            <div className="fact">
              <div className="k">Not a leaderboard</div>
              <div className="v">It does not exist to rank exchanges by hype, liquidity, volume, or recommendation score.</div>
            </div>
            <div className="fact">
              <div className="k">Not investment advice</div>
              <div className="v">Records should not be treated as investment guidance, legal advice, or safety guarantees.</div>
            </div>
            <div className="fact">
              <div className="k">Not complete or final</div>
              <div className="v">The registry can contain missing, approximate, provisional, or later-revised records.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Current scope</h4>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            HEI currently provides an entity-level registry, dead-side and active-side views, individual exchange
            record pages, methodology notes, evidence links, archive-aware URL handling, and a stats page summarizing
            registry coverage and composition.
          </p>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            The current model is intentionally conservative: entity-level records first, deployment-level splitting later
            if it becomes necessary. The site is built as a quiet, dense registry rather than a feature-heavy application.
          </p>
        </div>

        <div className="section">
          <h4>What the current version includes</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Entity-level records</div>
              <div className="v">Canonical exchange records with type, status, dates, origin, URLs, summary, and confidence.</div>
            </div>
            <div className="fact">
              <div className="k">Dead and active views</div>
              <div className="v">Separate browsing surfaces for dead-side outcomes and active-side records.</div>
            </div>
            <div className="fact">
              <div className="k">Timeline and evidence</div>
              <div className="v">Exchange detail pages can show lifecycle events and supporting source links.</div>
            </div>
            <div className="fact">
              <div className="k">Stats overview</div>
              <div className="v">A registry-level snapshot of composition, coverage, and data quality signals.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>What the current version does not include</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            HEI does not currently provide user accounts, public comments, live exchange monitoring, trading functions,
            automated verification, safety guarantees, liquidity ranking, or full deployment-level views for every DEX
            chain instance.
          </p>
        </div>

        <div className="section">
          <h4>Data sources and approach</h4>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            HEI is built from public records, archived pages, official statements, exchange notices, regulatory or court
            materials where available, reporting, public databases, and user-submitted corrections.
          </p>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            A source link is not treated as generic decoration. Evidence should support a specific claim such as identity,
            status, death reason, date, ownership, event history, or URL history. When evidence is weak or conflicting,
            HEI prefers cautious wording over forced certainty.
          </p>
        </div>

        <div className="section" id="corrections">
          <h4>Contact and corrections</h4>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            If you notice a missing record, broken classification, wrong date, unsafe URL treatment, weak evidence, or an
            important omission, use the contact / correction form below. If you prefer a public report path, GitHub Issues
            is also available.
          </p>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            Useful corrections include the exchange name, HEI page URL, what appears wrong or incomplete, and supporting
            source links. Archived links are especially useful for dead-side records.
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
        HEI favors durable records over noise. Records can be incomplete, approximate, or revised. Always verify
        important claims with the linked sources when possible.
      </section>
    </main>
  )
}
