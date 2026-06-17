import assert from 'node:assert/strict'
import { buildMonthlyReviewArtifacts } from './build-monthly-review.mjs'

export function runMonthlyReviewBuilderRegression() {
  const canonicalData = {
    entities: [
      {
        id: 'hei_ex_000001',
        status: 'active',
        type: 'cex',
        confidence: 'high',
        country_or_origin: 'Japan',
        launch_date: '2020-01-01',
        official_url_status: 'live_verified',
        last_verified_at: '2026-05-15',
      },
      {
        id: 'hei_ex_000002',
        status: 'dead',
        type: 'dex',
        confidence: 'medium',
        country_or_origin: null,
        launch_date: '2021-01-01',
        death_date: '2026-05-20',
        archived_url: null,
        official_url_status: 'dead_domain',
        last_verified_at: '2026-05-20',
      },
    ],
    events: [
      {
        id: 'hei_ev_000001',
        exchange_id: 'hei_ex_000001',
        event_type: 'launched',
        event_date: '2020-01-01',
        title: 'Launch',
      },
      {
        id: 'hei_ev_000002',
        exchange_id: 'hei_ex_000002',
        event_type: 'shutdown_effective',
        event_date: '2026-05-20',
        title: 'Shutdown',
      },
    ],
    evidence: [
      { id: 'hei_src_000001', exchange_id: 'hei_ex_000001' },
      { id: 'hei_src_000002', exchange_id: 'hei_ex_000002' },
    ],
  }

  const monitoringManifests = [
    {
      run_id: 'run-2026-05-04',
      started_at: '2026-05-04T03:00:00.000Z',
      finished_at: '2026-05-04T03:01:00.000Z',
      mode: 'scheduled',
      monitors: [
        {
          name: 'candidate-discovery',
          status: 'ok',
          findings_count: 2,
          candidate_count: 1,
          errors_count: 0,
        },
      ],
    },
  ]

  const watchlists = [
    {
      created_at: '2026-02-01',
      candidates: [
        {
          canonical_name: 'Old B Exchange',
          candidate_class: 'B',
          next_action: 'review',
        },
      ],
    },
  ]

  const previousMetrics = {
    counts: { entities: 1, events: 1, evidence: 1, active_side: 1, dead_side: 0 },
    quality: {
      entities_without_events: 0,
      entities_without_evidence: 0,
      entities_with_one_evidence: 1,
      dead_side_with_fewer_than_two_evidence: 0,
      dead_side_missing_archive: 0,
      url_status_unknown_or_missing: 0,
      origin_missing: 0,
      launch_date_missing: 0,
      dead_side_death_date_missing: 0,
      low_confidence: 0,
      last_verified_older_than_one_year: 0,
    },
    coverage: {
      dead_side_archive_percent: 0,
      high_confidence_percent: 100,
      origin_known_percent: 100,
    },
  }

  const publicCounts = { primary_records: 2, events: 2, evidence: 2 }
  const artifacts = buildMonthlyReviewArtifacts({
    month: '2026-05',
    canonicalData,
    monitoringManifests,
    watchlists,
    resolutionDocuments: [],
    previousMetrics,
    publicVersion: { data: { record_counts: publicCounts } },
    publicManifest: { record_counts: publicCounts },
    generatedAt: '2026-06-01T04:00:00.000Z',
  })

  assert.deepEqual(Object.keys(artifacts), [
    'manifest.json',
    'summary.md',
    'metrics.json',
    'monitoring-health.json',
    'watchlist-backlog.json',
    'quality-delta.json',
    'consistency-check.json',
    'event-snapshot.json',
    'next-month-plan.md',
  ])
  assert.equal(artifacts['manifest.json'].review_month, '2026-05')
  assert.equal(artifacts['manifest.json'].canonical_data_changed, false)
  assert.equal(artifacts['metrics.json'].counts.entities, 2)
  assert.equal(artifacts['monitoring-health.json'].observed_unique_runs, 1)
  assert.equal(artifacts['watchlist-backlog.json'].aging.b_90_plus, 1)
  assert.equal(artifacts['quality-delta.json'].available, true)
  assert.equal(artifacts['quality-delta.json'].counts.entities, 1)
  assert.equal(artifacts['consistency-check.json'].status, 'pass')
  assert.equal(artifacts['event-snapshot.json'].total, 1)
  assert.match(artifacts['summary.md'], /## Watchlist backlog/)
  assert.match(artifacts['summary.md'], /## Next-month priorities/)
  assert.match(artifacts['next-month-plan.md'], /Reclassify B candidates open for 90\+ days/)

  console.log('Monthly review builder regression test passed.')
}
