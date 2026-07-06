import Link from 'next/link'
import { buildStatsView } from '../../lib/stats/build-stats'
import { buildExplorerHref, yearRangeParams } from '../../lib/explorer/build-explorer-href'
import styles from './stats-explorer-drilldowns.module.css'

const DEAD_SIDE = ['dead', 'merged', 'acquired', 'rebranded'] as const
const ACTIVE_SIDE = ['active', 'limited', 'inactive'] as const

function DrilldownLinks({ items }: { items: Array<{ href: string; label: string }> }) {
  return (
    <div className={styles.links}>
      {items.map((item) => (
        <Link className={styles.link} href={item.href} key={`${item.label}:${item.href}`}>
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default function StatsExplorerDrilldowns() {
  const { snapshot, history } = buildStatsView()
  const topCountry = snapshot.country_origin.strict_countries[0]?.key
  const launchYears = [...history.launch_year_counts].slice(-10)
  const deathYears = [...history.death_year_counts].slice(-10)

  const statusLinks = snapshot.by_status.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('entities', { status: item.key }),
  }))
  const typeLinks = snapshot.by_type.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('entities', { type: item.key }),
  }))
  const deathReasonLinks = snapshot.dead_analysis.death_reason_breakdown.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('entities', { death_reason: item.key }),
  }))
  const urlStatusLinks = snapshot.coverage.url_status_breakdown.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('entities', { official_url_status: item.key }),
  }))
  const confidenceLinks = snapshot.quality.confidence_breakdown.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('entities', { confidence: item.key }),
  }))
  const countryLinks = snapshot.country_origin.strict_countries.slice(0, 8).map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('entities', { country_or_origin: item.key }),
  }))

  const launchYearLinks = launchYears.map((item) => ({
    label: `${item.year} · ${item.count}`,
    href: buildExplorerHref('entities', yearRangeParams('launch', item.year)),
  }))
  const deathYearLinks = deathYears.map((item) => ({
    label: `${item.year} · ${item.count}`,
    href: buildExplorerHref('entities', yearRangeParams('death', item.year)),
  }))

  const archiveLinks = [
    {
      label: 'All with archive',
      href: buildExplorerHref('entities', { archive_available: 'true' }),
    },
    {
      label: 'Dead-side with archive',
      href: buildExplorerHref('entities', { archive_available: 'true', status: DEAD_SIDE }),
    },
    {
      label: 'Active-side with archive',
      href: buildExplorerHref('entities', { archive_available: 'true', status: ACTIVE_SIDE }),
    },
  ]

  const eventTypeLinks = snapshot.events.event_type_breakdown.slice(0, 12).map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('events', { event_type: item.key }),
  }))
  const impactLinks = snapshot.events.impact_level_breakdown.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('events', { impact_level: item.key }),
  }))
  const statusEffectLinks = snapshot.events.status_effect_breakdown.map((item) => ({
    label: `${item.label} · ${item.count}`,
    href: buildExplorerHref('events', { event_status_effect: item.key }),
  }))

  const originCompoundLinks = topCountry
    ? [
        { label: `${topCountry} · all`, href: buildExplorerHref('entities', { country_or_origin: topCountry }) },
        { label: `${topCountry} · dead-side`, href: buildExplorerHref('entities', { country_or_origin: topCountry, status: DEAD_SIDE }) },
        { label: `${topCountry} · active-side`, href: buildExplorerHref('entities', { country_or_origin: topCountry, status: ACTIVE_SIDE }) },
        { label: `${topCountry} · CEX`, href: buildExplorerHref('entities', { country_or_origin: topCountry, type: 'cex' }) },
        { label: `${topCountry} · DEX`, href: buildExplorerHref('entities', { country_or_origin: topCountry, type: 'dex' }) },
        { label: `${topCountry} · Hybrid`, href: buildExplorerHref('entities', { country_or_origin: topCountry, type: 'hybrid' }) },
      ]
    : []

  return (
    <nav className={`panel ${styles.nav}`} aria-label="Stats Explorer drilldowns">
      <div className={styles.header}>
        <p className="muted">Research handoff</p>
        <h2>Open these distributions in Explorer</h2>
        <p>
          These links preserve the reviewed Stats-to-Explorer contract. Direct values use canonical enums,
          year bars use inclusive date ranges, and compound links use OR within a repeated key and AND across keys.
        </p>
      </div>

      <div className={styles.grid}>
        <section className={styles.group}>
          <h3>Entity classification</h3>
          <p>Status and type distributions map directly to reviewed entity fields.</p>
          <DrilldownLinks items={[...statusLinks, ...typeLinks]} />
        </section>

        <section className={styles.group}>
          <h3>End-state and URL handling</h3>
          <p>Death reason and reviewed URL status remain separate deterministic filters.</p>
          <DrilldownLinks items={[...deathReasonLinks, ...urlStatusLinks]} />
        </section>

        <section className={styles.group}>
          <h3>Confidence and strict country/origin</h3>
          <p>Only exact reviewed origin values become direct Explorer filters.</p>
          <DrilldownLinks items={[...confidenceLinks, ...countryLinks]} />
        </section>

        <section className={styles.group}>
          <h3>Archive availability</h3>
          <p>Side-specific archive views use one boolean filter plus repeated status values.</p>
          <DrilldownLinks items={archiveLinks} />
        </section>

        <section className={styles.group}>
          <h3>Launch and death years</h3>
          <p>Year bars become inclusive January 1 through December 31 ranges.</p>
          <div className={styles.compound}>
            <strong>Launch years</strong>
            <DrilldownLinks items={launchYearLinks} />
          </div>
          <div className={styles.compound}>
            <strong>Death years</strong>
            <DrilldownLinks items={deathYearLinks} />
          </div>
        </section>

        <section className={styles.group}>
          <h3>Event dimensions</h3>
          <p>Event type, impact level, and status effect open Event Explorer queries.</p>
          <DrilldownLinks items={[...eventTypeLinks, ...impactLinks, ...statusEffectLinks]} />
        </section>

        {originCompoundLinks.length > 0 ? (
          <section className={styles.group}>
            <h3>Origin compound examples</h3>
            <p>Compound links demonstrate exact origin combined with side status groups or exchange type.</p>
            <DrilldownLinks items={originCompoundLinks} />
          </section>
        ) : null}
      </div>
    </nav>
  )
}
