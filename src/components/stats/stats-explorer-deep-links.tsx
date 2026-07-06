import Link from 'next/link'
import { buildStatsView } from '../../lib/stats/build-stats'

function href(view: 'entities' | 'events', key: string, value: string) {
  const params = new URLSearchParams()
  params.set('view', view)
  params.append(key, value)
  return `/explore/?${params.toString()}`
}

function yearHref(keyFrom: string, keyTo: string, year: number) {
  const params = new URLSearchParams()
  params.set('view', 'entities')
  params.set(keyFrom, `${year}-01-01`)
  params.set(keyTo, `${year}-12-31`)
  return `/explore/?${params.toString()}`
}

function compoundArchiveHref(statuses: string[]) {
  const params = new URLSearchParams()
  params.set('view', 'entities')
  for (const status of statuses) params.append('status', status)
  params.set('archive_available', 'true')
  return `/explore/?${params.toString()}`
}

export default function StatsExplorerDeepLinks() {
  const { snapshot, history } = buildStatsView()
  const recentLaunchYears = [...history.launch_year_counts].sort((a, b) => b.year - a.year).slice(0, 5)
  const recentDeathYears = [...history.death_year_counts].sort((a, b) => b.year - a.year).slice(0, 5)
  const eventTypes = snapshot.events.event_type_breakdown.slice(0, 6)

  return (
    <section className="panel" style={{ padding: '18px', marginBottom: '18px' }}>
      <div className="detail-header" style={{ marginBottom: '14px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Explore these distributions</h2>
          <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
            Open deterministic Entity or Event Explorer queries for direct, range, and reviewed compound Stats dimensions.
          </p>
        </div>
      </div>

      <div className="home-grid">
        <div className="panel" style={{ padding: '14px' }}>
          <h3 style={{ marginTop: 0 }}>Entity status &amp; type</h3>
          <div className="record-meta">
            {snapshot.by_status.map((item) => <Link className="btn btn-compact" href={href('entities', 'status', item.key)} key={`status-${item.key}`}>{item.label} · {item.count}</Link>)}
            {snapshot.by_type.map((item) => <Link className="btn btn-compact" href={href('entities', 'type', item.key)} key={`type-${item.key}`}>{item.label} · {item.count}</Link>)}
          </div>
        </div>

        <div className="panel" style={{ padding: '14px' }}>
          <h3 style={{ marginTop: 0 }}>Death reasons &amp; archives</h3>
          <div className="record-meta">
            {snapshot.dead_analysis.death_reason_breakdown.slice(0, 6).map((item) => <Link className="btn btn-compact" href={href('entities', 'death_reason', item.key)} key={item.key}>{item.label} · {item.count}</Link>)}
            <Link className="btn btn-compact" href={compoundArchiveHref(['active', 'limited', 'inactive'])}>Active-side with archive</Link>
            <Link className="btn btn-compact" href={compoundArchiveHref(['dead', 'merged', 'acquired', 'rebranded'])}>Dead-side with archive</Link>
          </div>
        </div>

        <div className="panel" style={{ padding: '14px' }}>
          <h3 style={{ marginTop: 0 }}>Entity year ranges</h3>
          <div className="record-meta">
            {recentLaunchYears.map((item) => <Link className="btn btn-compact" href={yearHref('launch_from', 'launch_to', item.year)} key={`launch-${item.year}`}>Launch {item.year} · {item.count}</Link>)}
            {recentDeathYears.map((item) => <Link className="btn btn-compact" href={yearHref('death_from', 'death_to', item.year)} key={`death-${item.year}`}>Death {item.year} · {item.count}</Link>)}
          </div>
        </div>

        <div className="panel" style={{ padding: '14px' }}>
          <h3 style={{ marginTop: 0 }}>Event dimensions</h3>
          <div className="record-meta">
            {eventTypes.map((item) => <Link className="btn btn-compact" href={href('events', 'event_type', item.key)} key={`event-${item.key}`}>{item.label} · {item.count}</Link>)}
            {snapshot.events.impact_level_breakdown.map((item) => <Link className="btn btn-compact" href={href('events', 'impact_level', item.key)} key={`impact-${item.key}`}>{item.label} · {item.count}</Link>)}
            {snapshot.events.status_effect_breakdown.map((item) => <Link className="btn btn-compact" href={href('events', 'event_status_effect', item.key)} key={`effect-${item.key}`}>{item.label} · {item.count}</Link>)}
          </div>
        </div>
      </div>

      <p className="muted" style={{ margin: '14px 0 0', fontSize: '12px' }}>
        Derived metrics such as age bands, evidence depth, freshness, averages, and origin buckets remain analytical only and are not converted into Explorer filters.
      </p>
    </section>
  )
}
