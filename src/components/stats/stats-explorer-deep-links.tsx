import Link from 'next/link'
import { buildExplorerHref, yearRangeParams } from '../../lib/explorer/build-explorer-href'
import { buildStatsView } from '../../lib/stats/build-stats'

const DEAD_SIDE = ['dead', 'merged', 'acquired', 'rebranded'] as const
const ACTIVE_SIDE = ['active', 'limited', 'inactive'] as const

function LinkGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="panel" style={{ padding: '14px' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div className="record-meta">{children}</div>
    </div>
  )
}

export default function StatsExplorerDeepLinks() {
  const { snapshot, history } = buildStatsView()
  const recentLaunchYears = [...history.launch_year_counts].sort((a, b) => b.year - a.year).slice(0, 8)
  const recentDeathYears = [...history.death_year_counts].sort((a, b) => b.year - a.year).slice(0, 8)
  const topCountries = snapshot.country_origin.strict_countries.slice(0, 8)
  const topCountry = topCountries[0]?.key

  return (
    <nav className="panel" aria-label="Stats Explorer drilldowns" style={{ padding: '18px', marginBottom: '18px' }}>
      <div className="detail-header" style={{ marginBottom: '14px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Explore these distributions</h2>
          <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
            Open deterministic Entity or Event Explorer queries for direct, range, and reviewed compound Stats dimensions.
          </p>
        </div>
      </div>

      <div className="home-grid">
        <LinkGroup title="Entity status & type">
          {snapshot.by_status.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { status: item.key })} key={`status-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
          {snapshot.by_type.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { type: item.key })} key={`type-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
        </LinkGroup>

        <LinkGroup title="Death reasons & URL status">
          {snapshot.dead_analysis.death_reason_breakdown.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { death_reason: item.key })} key={`death-reason-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
          {snapshot.coverage.url_status_breakdown.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { official_url_status: item.key })} key={`url-status-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
        </LinkGroup>

        <LinkGroup title="Confidence & strict country/origin">
          {snapshot.quality.confidence_breakdown.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { confidence: item.key })} key={`confidence-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
          {topCountries.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { country_or_origin: item.key })} key={`country-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
        </LinkGroup>

        <LinkGroup title="Archive availability">
          <Link className="btn btn-compact" href={buildExplorerHref('entities', { archive_available: 'true' })}>
            All with archive
          </Link>
          <Link className="btn btn-compact" href={buildExplorerHref('entities', { status: ACTIVE_SIDE, archive_available: 'true' })}>
            Active-side with archive
          </Link>
          <Link className="btn btn-compact" href={buildExplorerHref('entities', { status: DEAD_SIDE, archive_available: 'true' })}>
            Dead-side with archive
          </Link>
        </LinkGroup>

        <LinkGroup title="Entity year ranges">
          {recentLaunchYears.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', yearRangeParams('launch', item.year))} key={`launch-${item.year}`}>
              Launch {item.year} · {item.count}
            </Link>
          ))}
          {recentDeathYears.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('entities', yearRangeParams('death', item.year))} key={`death-${item.year}`}>
              Death {item.year} · {item.count}
            </Link>
          ))}
        </LinkGroup>

        <LinkGroup title="Event dimensions">
          {snapshot.events.event_type_breakdown.slice(0, 12).map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('events', { event_type: item.key })} key={`event-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
          {snapshot.events.impact_level_breakdown.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('events', { impact_level: item.key })} key={`impact-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
          {snapshot.events.status_effect_breakdown.map((item) => (
            <Link className="btn btn-compact" href={buildExplorerHref('events', { event_status_effect: item.key })} key={`effect-${item.key}`}>
              {item.label} · {item.count}
            </Link>
          ))}
        </LinkGroup>

        {topCountry ? (
          <LinkGroup title={`Compound origin examples · ${topCountry}`}>
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { country_or_origin: topCountry, status: DEAD_SIDE })}>
              Dead-side
            </Link>
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { country_or_origin: topCountry, status: ACTIVE_SIDE })}>
              Active-side
            </Link>
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { type: 'cex', country_or_origin: topCountry })}>
              CEX
            </Link>
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { type: 'dex', country_or_origin: topCountry })}>
              DEX
            </Link>
            <Link className="btn btn-compact" href={buildExplorerHref('entities', { type: 'hybrid', country_or_origin: topCountry })}>
              Hybrid
            </Link>
          </LinkGroup>
        ) : null}
      </div>

      <p className="muted" style={{ margin: '14px 0 0', fontSize: '12px' }}>
        Derived metrics such as age bands, evidence depth, freshness, averages, and origin buckets remain analytical only and are not converted into Explorer filters.
      </p>
    </nav>
  )
}
