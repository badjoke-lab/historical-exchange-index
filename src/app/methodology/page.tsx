import type { Metadata } from 'next'
import { CONTACT_HREF, ISSUES_HREF } from '../../lib/site-constants'

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'How Historical Exchange Index defines crypto exchange records, status, death reasons, evidence reliability, URL handling, and uncertainty.',
  alternates: {
    canonical: '/methodology',
  },
}

const statusDefinitions = [
  {
    key: 'active',
    meaning: 'The exchange appears to be operating normally.',
    when: 'Used when the service is live and there is no strong evidence of major restriction or closure.',
  },
  {
    key: 'limited',
    meaning: 'The exchange appears partially restricted or degraded.',
    when: 'Used when withdrawals, deposits, registration, regions, products, or operations appear limited.',
  },
  {
    key: 'inactive',
    meaning: 'The exchange does not appear clearly active, but closure is not certain.',
    when: 'Used as a cautious state when the evidence is not strong enough to classify the exchange as dead.',
  },
  {
    key: 'dead',
    meaning: 'The exchange has effectively ended as an operating exchange.',
    when: 'Used when closure, bankruptcy, shutdown, abandonment, or non-operation is supported by evidence.',
  },
  {
    key: 'merged',
    meaning: 'The exchange was merged into another service or entity.',
    when: 'Used when the independent exchange record ended through merger.',
  },
  {
    key: 'acquired',
    meaning: 'The exchange was acquired or absorbed under another owner or brand.',
    when: 'Used when ownership or control changed in a way that affects the exchange’s independent identity.',
  },
  {
    key: 'rebranded',
    meaning: 'The exchange continued primarily through a successor brand.',
    when: 'Used when the historical identity changed into a clearly related new brand.',
  },
  {
    key: 'unknown',
    meaning: 'The status cannot be classified with enough confidence.',
    when: 'Used when available evidence is too weak or conflicting.',
  },
]

const deathReasonDefinitions = [
  ['hack', 'A hack, exploit, or asset loss was the main cause of collapse or shutdown.'],
  ['insolvency', 'The exchange failed due to insolvency, bankruptcy, liquidity failure, or inability to meet obligations.'],
  ['regulation', 'Regulatory action, legal pressure, licensing issues, sanctions, or enforcement were the main cause.'],
  ['scam_rug', 'The exchange appears to have been a scam, exit scam, rug pull, or intentionally deceptive operation.'],
  ['merger', 'The exchange ended as an independent entity because it merged into another service.'],
  ['acquisition', 'The exchange ended or changed identity mainly because it was acquired.'],
  ['rebrand', 'The exchange continued mainly through a new name or successor brand.'],
  ['voluntary_shutdown', 'The operator chose to shut down without a clearly dominant hack, insolvency, or regulatory cause.'],
  ['chain_failure', 'The exchange depended on a chain, ecosystem, or infrastructure that failed or disappeared.'],
  ['unknown', 'The primary reason is unclear, disputed, or not supported strongly enough.'],
] as const

const urlStatusDefinitions = [
  ['live_verified', 'The URL appears live and currently relevant.'],
  ['live_unverified', 'The URL appears live, but has not been recently verified.'],
  ['dead_domain', 'The domain appears unavailable, expired, or non-resolving.'],
  ['redirected', 'The URL redirects to another location.'],
  ['repurposed', 'The domain appears to be used for a different purpose than the original exchange.'],
  ['unsafe', 'The URL may be unsafe or misleading.'],
  ['unknown', 'The current URL state has not been determined.'],
] as const

const sourceTypeDefinitions = [
  ['official_statement', 'A direct statement from the exchange or related official party.'],
  ['official_blog', 'A post from an official exchange blog or announcement channel.'],
  ['official_social', 'An official social media post.'],
  ['archive_capture', 'An archived page, usually from a historical snapshot.'],
  ['news_article', 'Reporting from a media source.'],
  ['court_document', 'Court filing, bankruptcy record, legal document, or similar material.'],
  ['regulatory_notice', 'Notice or action from a regulator or public authority.'],
  ['database_reference', 'Reference from an exchange database, directory, or structured public dataset.'],
  ['community_reference', 'Forum, community, or user-generated reference.'],
  ['other', 'Evidence that does not fit the above categories.'],
] as const

const reliabilityDefinitions = [
  ['high', 'Strong primary or authoritative source, such as official statements, court documents, regulatory materials, or clear archive evidence.'],
  ['medium', 'Useful secondary source, reporting, database reference, or official page with limited context.'],
  ['low', 'Weak, indirect, incomplete, community-based, or difficult-to-verify source.'],
] as const

const claimScopeDefinitions = [
  ['entity', 'Supports the existence or identity of the exchange.'],
  ['event', 'Supports a specific lifecycle event.'],
  ['status', 'Supports the current or terminal status.'],
  ['death_reason', 'Supports the reason the exchange disappeared or changed state.'],
  ['launch_date', 'Supports the launch date or approximate launch period.'],
  ['death_date', 'Supports the shutdown, collapse, merger, acquisition, or rebrand date.'],
  ['url_history', 'Supports the historical use or current state of a URL/domain.'],
  ['ownership', 'Supports ownership, acquisition, merger, or parent/successor relationships.'],
] as const

function DefinitionTable({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Value</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, meaning]) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td className="muted">{meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function MethodologyPage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">Methodology</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>How HEI classifies crypto exchange records</h2>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '82ch' }}>
          Historical Exchange Index is a historical registry of crypto exchanges. This page explains how HEI
          defines exchange records, classifies status, handles evidence, treats old URLs, and deals with uncertainty.
        </p>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '82ch' }}>
          HEI is not a live ranking, trading tool, safety score, or investment guide. It is a structured record
          system for tracking crypto exchanges across their lifecycle: active, limited, inactive, dead, merged,
          acquired, or rebranded.
        </p>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h4>Core principles</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Registry first</div>
              <div className="v">HEI records exchange identity, lifecycle status, meaningful events, and supporting evidence.</div>
            </div>
            <div className="fact">
              <div className="k">Entity-first</div>
              <div className="v">HEI currently counts exchange entities, not every deployment, chain instance, pair, or product surface.</div>
            </div>
            <div className="fact">
              <div className="k">Archive-aware</div>
              <div className="v">Dead-side records prioritize archived URLs and historical evidence over direct links to old domains.</div>
            </div>
            <div className="fact">
              <div className="k">Uncertainty visible</div>
              <div className="v">Unknown values are kept when available sources are not strong enough to support a definitive claim.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Scope</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI includes centralized crypto exchanges, decentralized exchange protocols, hybrid exchange cases,
            dead-side outcomes, active-side records, lifecycle events, and evidence links that support key claims.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI does not prioritize token prices, TVL, order book metrics, trading volume rankings, broker-only
            directories, every deployment of every DEX protocol, or general crypto company listings with no exchange function.
          </p>
        </div>

        <div className="section">
          <h4>Counting unit</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI counts exchange entities. An entity is a recognizable exchange, protocol, or exchange brand that can
            be tracked as a historical record. A centralized exchange brand is usually counted as one entity. A
            decentralized exchange protocol is also usually counted as one entity in the current version.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI does not currently split multi-chain DEXs into separate deployment-level records. Deployment-level
            modeling may be introduced later if entity-level records become insufficient.
          </p>
        </div>

        <div className="section">
          <h4>Record model</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Exchange entity</div>
              <div className="v">The main record: canonical name, aliases, type, status, dates, origin, URLs, confidence, and summary.</div>
            </div>
            <div className="fact">
              <div className="k">Exchange event</div>
              <div className="v">A meaningful lifecycle event such as launch, hack, regulatory action, acquisition, rebrand, or shutdown.</div>
            </div>
            <div className="fact" style={{ gridColumn: '1 / -1' }}>
              <div className="k">Exchange evidence</div>
              <div className="v">A supporting source used to back identity, status, date, URL history, ownership, or event claims.</div>
            </div>
          </div>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            An entity can have multiple events. An entity can have multiple evidence records. An event can also have
            evidence directly attached to it.
          </p>
        </div>

        <div className="section">
          <h4>Status definitions</h4>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Meaning</th>
                  <th>When used</th>
                </tr>
              </thead>
              <tbody>
                {statusDefinitions.map((item) => (
                  <tr key={item.key}>
                    <td>
                      <code>{item.key}</code>
                    </td>
                    <td className="muted">{item.meaning}</td>
                    <td className="muted">{item.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            <code>dead</code>, <code>merged</code>, <code>acquired</code>, and <code>rebranded</code> are treated as
            dead-side outcomes in HEI browsing and statistics.
          </p>
        </div>

        <div className="section">
          <h4>Death reason definitions</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            <code>death_reason</code> is used mainly for dead-side outcomes. It describes the primary reason an exchange
            disappeared, lost its independent identity, or stopped operating in its previous form.
          </p>
          <DefinitionTable rows={deathReasonDefinitions} />
          <p className="muted" style={{ lineHeight: 1.75 }}>
            When evidence is weak, HEI prefers <code>unknown</code> or a lower-confidence classification rather than
            forcing a definitive cause.
          </p>
        </div>

        <div className="section">
          <h4>Status vs death reason</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Status and death reason are separate fields. <code>status</code> describes the current or terminal state of
            the exchange record. <code>death_reason</code> describes the primary cause of disappearance or terminal transition.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            For example, an exchange can have <code>status = dead</code> and <code>death_reason = insolvency</code>. An
            acquired exchange can have <code>status = acquired</code> and <code>death_reason = acquisition</code>. An
            inactive exchange may have no death reason if closure is not proven.
          </p>
        </div>

        <div className="section">
          <h4>URL handling</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI preserves original exchange URLs as historical records. However, old exchange domains are not always
            safe or authoritative today. A domain that once belonged to an exchange may later expire, redirect, become
            a parked page, be acquired by another party, or be used for unrelated purposes.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            For dead-side entries, the archived URL is usually treated as the safer primary reference. The original
            URL may be shown as historical information, but it may not always be clickable.
          </p>
          <DefinitionTable rows={urlStatusDefinitions} />
        </div>

        <div className="section">
          <h4>Evidence and reliability</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Evidence is the basis for HEI records. HEI uses evidence to support claims about entity identity, launch
            date, death date, status, death reason, URL history, ownership, and lifecycle events.
          </p>
          <h4 style={{ marginTop: '22px' }}>Source types</h4>
          <DefinitionTable rows={sourceTypeDefinitions} />
          <h4 style={{ marginTop: '22px' }}>Reliability levels</h4>
          <DefinitionTable rows={reliabilityDefinitions} />
          <p className="muted" style={{ lineHeight: 1.75 }}>
            A high-reliability source does not automatically make every claim certain. HEI still considers whether
            the evidence directly supports the specific claim.
          </p>
        </div>

        <div className="section">
          <h4>Claim scope</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Each evidence record can have a claim scope. This describes what the evidence is being used to support.
            This prevents evidence from being treated as a generic link.
          </p>
          <DefinitionTable rows={claimScopeDefinitions} />
        </div>

        <div className="section">
          <h4>Event rules</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI events are reserved for meaningful lifecycle developments: launches, hacks or exploits, withdrawal
            suspensions, deposit suspensions, trading halts, regulatory actions, lawsuits, bankruptcy filings,
            insolvency declarations, acquisitions, mergers, rebrands, shutdown announcements, effective shutdowns,
            reopenings, and chain shutdown impacts.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI generally excludes routine token listings, normal trading volume changes, minor UI updates, short-lived
            promotional campaigns, ordinary product marketing, and unsupported rumors.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Multiple events of the same type can exist for the same exchange. Events are ordered by event date, with
            additional sort order used when multiple events occur on the same date.
          </p>
        </div>

        <div className="section">
          <h4>Data quality and uncertainty</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI is designed to make uncertainty visible. Some dates are approximate. Some causes are disputed. Some
            records may be revised as better sources become available.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI does not force unknown values into false certainty. If a field cannot be supported, it may remain
            unknown, low-confidence, or incomplete. Low-confidence records should not be treated as definitive.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            A record’s confidence level reflects the strength and clarity of available evidence, not the importance of
            the exchange. When a classification is uncertain, HEI prefers cautious labeling over aggressive conclusions.
          </p>
        </div>

        <div className="section">
          <h4>Corrections and submissions</h4>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            HEI is expected to improve over time. Corrections are welcome, especially when they include source links.
            Useful correction reports should include the exchange name, HEI page URL, what appears wrong or incomplete,
            supporting source links, and archived links when available.
          </p>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            Corrections may concern identity, status, death reason, dates, URL history, ownership, or evidence.
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

        <div className="section">
          <h4>Current version note</h4>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            HEI currently uses static JSON records for entities, events, evidence, and generated stats. The current
            model is entity-level.
          </p>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Deployment-level records, automated verification, expanded localization, richer relationship modeling,
            and deeper statistics may be added later. The methodology may also change as the registry grows and edge
            cases become clearer.
          </p>
        </div>
      </section>

      <section className="callout">
        HEI records are for historical and informational use. They are not financial advice, legal advice, trading
        recommendations, safety ratings, or proof that an exchange is trustworthy or untrustworthy today. Always verify
        important claims with the linked sources when possible.
      </section>
    </main>
  )
}
