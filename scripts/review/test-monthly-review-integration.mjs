import assert from 'node:assert/strict'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { buildMonthlyReviewArtifacts } from './build-monthly-review.mjs'
import { loadMonthlyReviewArtifacts, validateMonthlyReviewArtifacts } from './validate-monthly-review.mjs'

function canonicalFixture() {
  return {
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
}

function monthlyArtifacts(canonicalData) {
  const publicCounts = { primary_records: 2, events: 2, evidence: 2 }
  return buildMonthlyReviewArtifacts({
    month: '2026-05',
    canonicalData,
    monitoringManifests: [
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
    ],
    watchlists: [
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
    ],
    resolutionDocuments: [],
    previousMetrics: null,
    publicVersion: { data: { record_counts: publicCounts } },
    publicManifest: { record_counts: publicCounts },
    generatedAt: '2026-06-01T04:00:00.000Z',
  })
}

async function writeArtifacts(directory, artifacts) {
  await fsp.mkdir(directory, { recursive: true })
  for (const [fileName, value] of Object.entries(artifacts)) {
    const content = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
    await fsp.writeFile(path.join(directory, fileName), content, 'utf8')
  }
}

export async function runMonthlyReviewIntegrationRegression() {
  const canonicalData = canonicalFixture()
  const fixtureRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 'hei-monthly-review-'))

  try {
    await writeArtifacts(fixtureRoot, monthlyArtifacts(canonicalData))
    const loaded = await loadMonthlyReviewArtifacts(fixtureRoot)
    const result = validateMonthlyReviewArtifacts(loaded, { month: '2026-05', canonicalData })

    assert.deepEqual(result, {
      month: '2026-05',
      files: 9,
      entities: 2,
      monitoring_runs: 1,
      watchlist_items: 1,
    })

    const invalidArtifacts = {
      ...loaded,
      'metrics.json': {
        ...loaded['metrics.json'],
        counts: { ...loaded['metrics.json'].counts, entities: 3 },
      },
    }

    assert.throws(
      () => validateMonthlyReviewArtifacts(invalidArtifacts, { month: '2026-05', canonicalData }),
      /metrics entity count does not match canonical data/,
    )

    await fsp.writeFile(path.join(fixtureRoot, 'unexpected.json'), '{}\n', 'utf8')
    await assert.rejects(
      () => loadMonthlyReviewArtifacts(fixtureRoot),
      /monthly review output file set mismatch/,
    )

    console.log('Monthly review validator integration regression passed.')
  } finally {
    await fsp.rm(fixtureRoot, { recursive: true, force: true })
  }
}
