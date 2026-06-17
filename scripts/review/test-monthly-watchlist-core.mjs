import assert from 'node:assert/strict'
import { parseReviewMonth } from './monthly-registry-core.mjs'
import { buildWatchlistBacklog } from './monthly-watchlist-core.mjs'

export function runMonthlyWatchlistBacklogRegression() {
  const monthInfo = parseReviewMonth('2026-05')
  const watchlists = [
    {
      created_at: '2026-03-01',
      candidates: [
        {
          candidate_id: 'alpha',
          canonical_name: 'Alpha Exchange',
          candidate_class: 'A',
          next_action: 'review_and_stage_public_quality_record',
        },
        {
          candidate_id: 'beta',
          canonical_name: 'Beta Exchange',
          candidate_class: 'B',
          next_action: 'hold_for_active_baseline_or_batch_add',
        },
      ],
    },
    {
      created_at: '2026-05-10',
      candidates: [
        {
          candidate_id: 'alpha-repeat',
          canonical_name: 'Alpha Exchange',
          candidate_class: 'A',
        },
        {
          candidate_id: 'gamma',
          canonical_name: 'Gamma DEX',
          candidate_class: 'C',
        },
      ],
    },
    {
      created_at: '2026-06-01',
      candidates: [
        {
          candidate_id: 'future',
          canonical_name: 'Future Exchange',
          candidate_class: 'A',
        },
      ],
    },
  ]

  const resolutionDocuments = [
    {
      resolution_type: 'watchlist_candidates_canonicalized',
      created_at: '2026-05-20',
      promoted_to_canonical: [
        {
          canonical_name: 'Alpha Exchange',
          resolution: 'promoted_to_canonical',
          entity_id: 'hei_ex_999999',
        },
      ],
    },
  ]

  const backlog = buildWatchlistBacklog(watchlists, resolutionDocuments, monthInfo)

  assert.equal(backlog.unique_candidates_seen, 3)
  assert.equal(backlog.new_candidates_in_month, 1)
  assert.equal(backlog.resolved_candidates, 1)
  assert.equal(backlog.unresolved_candidates, 2)
  assert.deepEqual(backlog.by_class, { A: 1, B: 1, C: 1 })
  assert.deepEqual(backlog.unresolved_by_class, { B: 1, C: 1 })
  assert.equal(backlog.aging.b_90_plus, 1)
  assert.equal(backlog.overdue.length, 1)
  assert.equal(backlog.overdue[0].canonical_name, 'Beta Exchange')

  const alpha = backlog.items.find((item) => item.canonical_name === 'Alpha Exchange')
  assert(alpha)
  assert.equal(alpha.closed, true)
  assert.equal(alpha.resolution, 'promoted_to_canonical')
  assert.equal(alpha.entity_id, 'hei_ex_999999')
  assert.equal(alpha.occurrences, 2)
  assert.equal(alpha.days_open, 80)

  const gamma = backlog.items.find((item) => item.canonical_name === 'Gamma DEX')
  assert(gamma)
  assert.equal(gamma.days_open, 21)
  assert.equal(backlog.items.some((item) => item.canonical_name === 'Future Exchange'), false)

  console.log('Monthly watchlist backlog regression test passed.')
}
