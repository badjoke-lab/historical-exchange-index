import Link from 'next/link'
import type { Metadata } from 'next'
import { buildDetailView } from '../../../lib/data/build-detail-view'
import { SITE_NAME, SITE_URL } from '../../../lib/site-constants'
import styles from './incident-report.module.css'

const pathname = '/incidents/binance-2026-security-breach/'
const headline = 'Binance 2026 Security Breach: Wallet Transfers, Service Restrictions and Recovery'
const summary = 'Evidence-led history of Binance’s October 29, 2026 unauthorized wallet transfers: verified Ethereum transactions, preliminary security findings, the estimated affected amount, asset freezes and unresolved recovery.'
const published = '2026-10-30'

export const metadata: Metadata = {
  title: headline,
  description: summary,
  alternates: { canonical: pathname },
  openGraph: {
    title: headline,
    description: summary,
    type: 'article',
    url: pathname,
    publishedTime: published,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: headline,
    description: summary,
    images: ['/twitter-image'],
  },
}

const milestones = [
  {
    when: '29 Oct, 20:20:59 UTC',
    label: 'Observed delegation',
    body: 'A type-4 Ethereum transaction applied an EIP-7702 code delegation to the wallet publicly labelled Binance 14. This is an on-chain observation, not a completed finding about how the attacker obtained valid authorization.',
    source: 'Independent transaction analysis',
  },
  {
    when: '29 Oct, 20:24:23 UTC',
    label: 'Primary Ethereum sweep',
    body: 'An Ethereum transaction succeeded, moving 167,464 ETH and about 1.615 billion USDT alongside many other tokens from Binance 14. The recorded destination was 0x5227f603c1ee34ce3c06efe6477003bdfccb2f8c.',
    source: 'On-chain transaction receipt',
  },
  {
    when: '29 Oct, 20:24–23:04 UTC',
    label: 'Further transfers across networks',
    body: 'Aave’s published incident response describes additional outflows from a second Binance hot wallet and on several chains, as well as another Avalanche inflow at 23:04 UTC. These flows require chain-by-chain deduplication before they can be converted into a final loss figure.',
    source: 'Aave risk-team incident analysis',
  },
  {
    when: '29–30 Oct',
    label: 'Restrictions and containment',
    body: 'Binance paused withdrawals for security checks; deposits remained available after a later official clarification, revoked affected address authorization, and worked with issuers, blockchain intelligence firms and law enforcement to freeze or trace affected assets.',
    source: 'Binance initial incident statement',
  },
  {
    when: '30 Oct',
    label: 'Initial company disclosure',
    body: 'Binance estimated about USD 6.3 billion in affected assets and around USD 3 billion frozen on-chain. It cited a possibly compromised DevOps laptop and service-container access, found no evidence of wallet private-key leakage, and promised SAFU/company-funded coverage and a detailed post-mortem.',
    source: 'Binance official announcement',
  },
]

const references = [
  { group: 'Company / primary', name: 'Binance — Security Incident Update (30 October 2026)', href: 'https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7', detail: 'Initial mechanism hypothesis, asset-impact estimate, freezes, restrictions and remediation promises.' },
  { group: 'On-chain', name: 'Ethereum sweep receipt — 0x53bd38b8…e2f3', href: 'https://app.blocksec.com/phalcon/explorer/tx/eth/0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3', detail: 'Transaction success, block number, UTC time, calling address and transfers; not a finding of attacker identity.' },
  { group: 'Independent investigation', name: 'Reuters — Binance breach and asset-freeze investigation', href: 'https://www.reuters.com/legal/transactional/tether-circle-freeze-238-billion-after-binance-reports-security-incident-2026-10-29/', detail: 'Independent reporting about exchange operations, asset tracing, freeze totals and differing attribution claims.' },
  { group: 'Connected protocol / primary', name: 'LlamaRisk / Aave — Binance Hot Wallet Exploit: Aave’s Response', href: 'https://governance.aave.com/t/binance-hot-wallet-exploit-aaves-response/25954', detail: 'Cross-chain outflow chronology and the operational effect on a separate lending protocol.' },
  { group: 'Independent technical analysis', name: 'EIP-7702 authorization analysis — transaction chronology', href: 'https://808bits.com/articles/binance-hot-wallet-eip-7702-delegations/', detail: 'Analysis of the authorization-list transaction and delegation; interpretation is distinct from Binance’s uncompleted root-cause investigation.' },
  { group: 'SAFU / Binance primary', name: 'Binance homepage — SAFU BTC wallet and February 2026 balance', href: 'https://www.binance.com/en', detail: '15,000 BTC disclosed as of February 2026, not a measure of all corporate liquidity.' },
  { group: 'SAFU / Binance primary', name: 'Binance — Open Letter on BTC reserve conversion', href: 'https://www.binance.com/en/blog/community/7001232677846823071', detail: 'Plan to shift a roughly USD 1 billion stablecoin SAFU reserve to BTC and replenish if it falls below USD 800M.' },
  { group: 'SAFU / independent', name: 'CoinDesk — SAFU conversion completed on February 12', href: 'https://www.coindesk.com/business/2026/02/12/binance-converts-its-usd1-billion-safu-fund-into-15-000-btc', detail: 'Reports 15,000 BTC at the conversion completion on February 12, 2026.' },
  { group: 'Binance / later operational clarification', name: 'Binance — Deposits operating normally during withdrawal pause', href: 'https://www.binance.com/en/square/post/10-30-2026-binance-deposits-are-no-longer-affected-pledges-to-cover-losses-related-to-the-incident-382683663031259', detail: 'Corrects the initial notice: deposits remained available; withdrawals paused pending security upgrades.' },
  { group: 'Binance Japan / primary', name: 'Binance Japan — October 30 client assets and service notice', href: 'https://prtimes.jp/main/html/rd/p/000000061.000126862.html', detail: 'Separated cold wallets and no observed direct client loss; precautionary crypto withdrawal pause.' },
  { group: 'Security intelligence / analysis', name: 'Elliptic — Analysis of suspected North Korean attribution', href: 'https://www.elliptic.co/insights/binance-largest-hack-in-history/', detail: 'Investigative attribution; not established as a final legal finding.' },

]

const reviewQuestions = [
  'When did withdrawals fully resume, on which networks, and were deposits already available earlier?',
  'Which signed authorizations, service credentials or operational approvals enabled the unauthorized transfers?',
  'What is the final, non-duplicated net loss after freezes, returns, recoveries and internal transfers?',
  'What amounts have been reimbursed to customers, from which sources, and on what dates?',
  'What did the promised technical post-mortem and updated Proof of Reserves establish?',
]

export default function Binance2026IncidentReport() {
  const dossier = buildDetailView('binance')
  const reviewedEvents = dossier?.events.filter((event) =>
    (event.event_date ?? '').startsWith('2026-10-29') ||
    (event.event_date ?? '').startsWith('2026-10-30'),
  ) ?? []
  const eventIds = new Set(reviewedEvents.map((event) => event.id))
  const linkedEvidence = dossier?.evidence.filter((source) =>
    source.event_id !== null && eventIds.has(source.event_id),
  ) ?? []

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: summary,
    datePublished: published,
    dateModified: published,
    url: SITE_URL + pathname,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    about: { '@type': 'Organization', name: 'Binance', url: SITE_URL + '/exchange/binance/' },
    mainEntityOfPage: SITE_URL + pathname,
    citation: references.map((reference) => reference.href),
  }

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Registry</Link><span>/</span>
        <Link href="/incidents/">Incident timeline</Link><span>/</span>
        <span>Binance 2026</span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.eyebrow}>HISTORICAL CASE FILE <span>·</span> 29 OCTOBER 2026 <span>·</span> REVIEWED 30 OCTOBER</div>
        <h1>{headline}</h1>
        <p className={styles.dek}>A massive exchange security incident, a contested technical mechanism and an incomplete recovery picture. This dossier separates what the chain records, what Binance has stated, and what remains unverified.</p>
        <div className={styles.heroLinks}>
          <Link href="/exchange/binance/">Open canonical Binance record</Link>
          <Link href="/incidents/">Browse exchange incident history</Link>
        </div>
      </header>

      <section className={styles.metricStrip} aria-label="Initial company estimates and case status">
        <div><span>Company-estimated affected assets</span><strong>~$6.3B</strong><small>Preliminary estimate — not net loss</small></div>
        <div><span>Assets frozen on-chain</span><strong>~$3.0B</strong><small>Reported by Binance, 30 Oct</small></div>
        <div><span>Confirmed final loss</span><strong>Unknown</strong><small>Not established by initial disclosure</small></div>
        <div><span>Exchange status at review</span><strong>Limited</strong><small>Service restoration needs verification</small></div>
      </section>

      <section className={styles.summary} aria-labelledby="case-finding">
        <div className={styles.sectionLabel}>01 / CASE FINDING</div>
        <div className={styles.summaryBody}>
          <h2 id="case-finding">What the evidence establishes</h2>
          <p>Binance confirmed unauthorized withdrawal transactions associated with a major security event. Its October 30 initial investigation pointed to a possible compromise of a DevOps engineer’s laptop and subsequent access to a service container. Binance said it had found <strong>no evidence of leaked wallet private keys</strong>, while promising a fuller investigation. This is a preliminary operational hypothesis, not a final technical post-mortem.</p>
          <p>A successful Ethereum transaction at 20:24:23 UTC moved 167,464 ETH and numerous tokens from an address labelled Binance 14. Separate analysis identifies an EIP-7702 delegation applied minutes earlier. The chain establishes transaction execution; it cannot by itself settle whether the root cause was a stolen key, a malicious signing workflow, a compromised service container or a combination.</p>
          <p>Binance reported approximately $6.3 billion as the total affected amount and approximately $3 billion frozen on-chain. <strong>Asset movement, frozen balances, recovered funds and customer losses must not be counted as the same thing.</strong></p>
        </div>
      </section>

      <section className={styles.chronology} aria-labelledby="case-timeline">
        <div className={styles.sectionLabel}>02 / RECONSTRUCTED CHRONOLOGY</div>
        <div>
          <h2 id="case-timeline">The first hours</h2>
          <p className={styles.sectionIntro}>Times are UTC. Event descriptions distinguish transaction observations from issuer statements and outside analysis.</p>
          <ol className={styles.timeline}>
            {milestones.map((item) => (
              <li key={item.when}>
                <time>{item.when}</time>
                <div className={styles.timelineText}><h3>{item.label}</h3><p>{item.body}</p><small>Basis: {item.source}</small></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.provenance} aria-labelledby="case-confidence">
        <div className={styles.sectionLabel}>03 / EVIDENCE GRADES</div>
        <div>
          <h2 id="case-confidence">Confirmed events versus unresolved claims</h2>
          <div className={styles.claims}>
            <div><span>ON-CHAIN OBSERVATION</span><h3>Ethereum transfers and delegation</h3><p>Successful transactions, amounts, timestamps and contract calls can be checked against public receipts. Wallet labels and attribution require separate provenance.</p></div>
            <div><span>COMPANY STATEMENT</span><h3>Initial access hypothesis and compensation pledge</h3><p>Binance described the possible DevOps-laptop and service-container path, said customer funds were safe and promised to cover losses. Payment completion is not established by a pledge.</p></div>
            <div><span>THIRD-PARTY ANALYSIS</span><h3>Actor attribution and multi-chain totals</h3><p>Security firms have linked the flows to North Korean actors in reporting. These conclusions are attributed to those firms, not presented here as a final law-enforcement determination.</p></div>
            <div><span>UNRESOLVED</span><h3>Final losses and complete service recovery</h3><p>The exact net loss, ownership of all traced wallets, full withdrawal restoration, reimbursement totals and final root cause remain open at this review checkpoint.</p></div>
          </div>
        </div>
      </section>

      <section className={styles.provenance} aria-labelledby="case-safu">
        <div className={styles.sectionLabel}>04 / SAFU &amp; CLAIMED COVERAGE</div>
        <div>
          <h2 id="case-safu">What the emergency fund can—and cannot—prove</h2>
          <p>Binance lists <strong>15,000 BTC in its SAFU wallet as of February 2026</strong>. Its previously stablecoin-denominated, roughly USD 1 billion SAFU reserve was converted to BTC; the completed 15,000 BTC position was reported on <strong>February 12, 2026</strong>, not February 9. Binance also pledged to replenish the fund if its market value dropped below USD 800 million.</p>
          <p>As an illustrative snapshot only, 15,000 BTC at USD 77,000 is worth about USD 1.155 billion—roughly 18% of Binance’s initial USD 6.3 billion affected-asset estimate. If all USD 3 billion reported frozen were returned, an illustrative remaining USD 3.3 billion would leave the BTC fund equivalent to about 35%. <strong>Neither figure is a confirmed reimbursement rate, loss rate or solvency ratio.</strong> Frozen assets are not automatically recovered; Bitcoin prices fluctuate; and Binance’s available corporate resources are not measured by this wallet.</p>
          <p>Binance has pledged to cover losses using <strong>both SAFU and company funds</strong>. The completed restitution amount, deployable corporate liquidity, realized loss, and ultimate recovery remain unverified. Past security incidents, regulatory settlements and hypothetical future compliance costs are separate categories and cannot legitimately be summed as one lifetime hacking-loss total.</p>
        </div>
      </section>

      <section className={styles.canonical} aria-labelledby="case-region">
        <div className={styles.sectionLabel}>05 / REGIONAL EFFECTS</div>
        <div>
          <h2 id="case-region">Binance Japan: assets and availability are different claims</h2>
          <p>Binance Japan said on October 30 that its client assets were held separately in cold wallets, with <strong>no direct client-asset loss identified</strong> from this incident. It nevertheless temporarily suspended cryptocurrency withdrawals. Cryptocurrency deposits, trading and fiat transfers remained operational. This precautionary restriction is not evidence of a Binance Japan wallet exploit.</p>
          <p>Analysis from blockchain intelligence firms including Elliptic attributes the global attack to North Korean actors, but that judgment remains <strong>third-party attribution</strong>, not Binance’s completed forensic conclusion or a judicial finding. DeFi self-custody and DEX trading can reduce exchange-custody exposure, but do not eliminate smart-contract, approval, phishing or routing risks.</p>
        </div>
      </section>

      <section className={styles.canonical} aria-labelledby="case-registry">
        <div className={styles.sectionLabel}>06 / REGISTRY CONNECTION</div>
        <div>
          <h2 id="case-registry">Canonical HEI record</h2>
          <p>This article is explanatory analysis, not an alternative source of truth. HEI’s reviewed Binance entity, dated events and event-specific evidence remain the canonical historical record.</p>
          {reviewedEvents.length > 0 ? (
            <ul className={styles.recordEvents}>
              {reviewedEvents.map((event) => (
                <li key={event.id}><time>{event.event_date}</time><div><strong>{event.title}</strong><span>{event.event_type} · {event.impact_level} impact · {event.confidence} confidence</span></div></li>
              ))}
            </ul>
          ) : <p>No reviewed events have been linked to this incident yet.</p>}
          <p className={styles.recordNote}>{reviewedEvents.length} reviewed incident-related events and {linkedEvidence.length} linked evidence entries at build time. <Link href="/exchange/binance/">Inspect the full evidence and record history.</Link></p>
        </div>
      </section>

      <section className={styles.followup} aria-labelledby="case-open-questions">
        <div className={styles.sectionLabel}>07 / HISTORICAL FOLLOW-THROUGH</div>
        <div>
          <h2 id="case-open-questions">What remains to be verified</h2>
          <ul>{reviewQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
          <p>At this checkpoint, Binance anticipated withdrawal resumption after additional security work, but a forecast is not evidence that all affected services have reopened. A future status change from <strong>limited</strong> requires a new, verifiable service restoration event.</p>
        </div>
      </section>

      <section className={styles.sources} aria-labelledby="case-sources">
        <div className={styles.sectionLabel}>08 / SOURCES</div>
        <div>
          <h2 id="case-sources">Source trail</h2>
          <p>Primary statements and transaction records are listed separately from analyses. Links do not turn third-party hypotheses into official findings.</p>
          <ol>
            {references.map((ref) => (
              <li key={ref.href}><span>{ref.group}</span><a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.name} ↗</a><p>{ref.detail}</p></li>
            ))}
          </ol>
          <p className={styles.lastChecked}>First published and reviewed: 30 October 2026. All amounts and status labels are time-bound and may be revised against new primary evidence.</p>
        </div>
      </section>
    </main>
  )
}
