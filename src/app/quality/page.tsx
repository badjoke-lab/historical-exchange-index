import Link from 'next/link'
import type { Metadata } from 'next'
import { buildQualitySummary } from '../../lib/data/build-quality-summary'
import {
  buildLocalizedPageMetadata,
  getPagePresentation,
} from '../../lib/i18n/page-presentations'
import type { StatsBreakdownItem, StatsMetricItem } from '../../lib/types/stats'
import { CONTACT_HREF } from '../../lib/site-constants'
import styles from './quality.module.css'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({
    locale: 'en',
    page: 'quality',
    pathname: '/quality/',
  })
}

function Breakdown({ items }: { items: StatsBreakdownItem[] }) {
  return (
    <div className={styles.breakdown}>
      {items.map((item) => (
        <div className={styles.breakdownRow} key={item.key}>
          <div className={styles.breakdownTop}>
            <span>{item.label}</span>
            <strong>{item.count} · {item.share}%</strong>
          </div>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${Math.max(item.share, item.count > 0 ? 2 : 0)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function MetricTable({ items }: { items: StatsMetricItem[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.metricTable}>
        <thead>
          <tr><th>Metric</th><th>Value</th><th>Denominator / note</th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td>{item.label}</td>
              <td><strong>{item.value}</strong></td>
              <td>{item.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function EvidenceHealthDataQualityPage() {
  const summary = buildQualitySummary()
  const presentation = getPagePresentation('en', 'quality')

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">{presentation.eyebrow}</p>
            <h1 className={styles.pageTitle}>{presentation.heading}</h1>
            <p className={styles.lead}>{presentation.intro}</p>
          </div>
          <div className={styles.headerActions}>
            <Link className="btn" href="/stats">Full Stats</Link>
            <Link className="btn" href="/methodology">Methodology</Link>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">Submit correction</a>
          </div>
        </div>

        <div className={styles.registryStrip}>
          <div><span>Entities</span><strong>{summary.totals.entities}</strong></div>
          <div><span>Events</span><strong>{summary.totals.events}</strong></div>
          <div><span>Evidence</span><strong>{summary.totals.evidence}</strong></div>
          <div><span>Generated</span><strong className={styles.dateValue}>{summary.generatedAt.slice(0, 10)}</strong></div>
        </div>
      </section>

      <section className={styles.headlineGrid} aria-label="Quality headline metrics">
        {summary.headline.map((item) => (
          <article className={`panel ${styles.headlineCard}`} key={item.key}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.note ?? '—'}</p>
          </article>
        ))}
      </section>

      <section className={styles.twoColumn}>
        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Entity confidence</h3>
            <p>Reviewed confidence classification on exchange entity records.</p>
          </div>
          <Breakdown items={summary.entityConfidence} />
        </article>

        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Evidence reliability</h3>
            <p>Reviewed reliability classification on public evidence records.</p>
          </div>
          <Breakdown items={summary.evidenceReliability} />
        </article>
      </section>

      <section className={styles.twoColumn}>
        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Evidence depth by entity</h3>
            <p>Number of evidence records associated with each reviewed exchange entity.</p>
          </div>
          <Breakdown items={summary.evidenceDepth} />
        </article>

        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Record freshness</h3>
            <p>Time since the entity record was last reviewed, using last_verified_at.</p>
          </div>
          <Breakdown items={summary.freshness} />
        </article>
      </section>

      <section className={`panel ${styles.sectionPanel}`}>
        <div className={styles.sectionHead}>
          <h3>Coverage</h3>
          <p>Archive, date, origin, domain, and confidence coverage with explicit denominators.</p>
        </div>
        <MetricTable items={summary.coverage} />
      </section>

      <section className={styles.twoColumn}>
        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Evidence source types</h3>
            <p>Composition of the public evidence layer by source category.</p>
          </div>
          <Breakdown items={summary.sourceTypes} />
        </article>

        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Evidence claim scope</h3>
            <p>What kind of registry claim each evidence record is intended to support.</p>
          </div>
          <Breakdown items={summary.claimScopes} />
        </article>
      </section>

      <section className={styles.twoColumn}>
        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Selected missing-field counts</h3>
            <p>Visible selected field gaps. A retained unknown value is not automatically an error.</p>
          </div>
          <MetricTable items={summary.unknownFields} />
        </article>

        <article className={`panel ${styles.sectionPanel}`}>
          <div className={styles.sectionHead}>
            <h3>Completeness indicators</h3>
            <p>Selected public coverage indicators. These do not form a hidden quality score.</p>
          </div>
          <MetricTable items={summary.completeness} />
        </article>
      </section>

      <section className={`panel ${styles.sectionPanel}`}>
        <div className={styles.sectionHead}>
          <h3>Metric definitions</h3>
          <p>Definitions and denominators used to interpret this public summary.</p>
        </div>
        <dl className={styles.definitionList}>
          {summary.definitions.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.definition}</dd>
              <dd className={styles.denominator}>{item.denominator}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="callout">
        This summary is generated from reviewed public HEI records. Internal monitoring findings, private research notes, unresolved candidate queues, and operator-only repair priorities are not published here.
      </section>
    </main>
  )
}
