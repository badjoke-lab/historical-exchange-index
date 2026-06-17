import assert from 'node:assert/strict'
import fs from 'node:fs'

export function runMonthlyReviewWorkflowRegression() {
  const workflow = fs.readFileSync('.github/workflows/hei-monthly-review.yml', 'utf8')

  const requiredSnippets = [
    'cron: "0 4 1 * *"',
    'workflow_dispatch:',
    'review_month:',
    'overwrite_existing:',
    'contents: write',
    'pull-requests: write',
    'ref: main',
    'fetch-depth: 0',
    "date -u -d 'last month' +%Y-%m",
    'gh pr list --state all --limit 200 --json number,title,mergedAt',
    'Auto monitoring report: $REVIEW_MONTH-',
    'any(.[]; .mergedAt != null)',
    'pull/$PR_NUMBER/head:$REF',
    'data-staging/monthly-review-input/$REVIEW_MONTH',
    'npm run machine:build',
    'node scripts/review/build-monthly-review.mjs --month "$REVIEW_MONTH"',
    'node scripts/review/validate-monthly-review.mjs --month "$REVIEW_MONTH"',
    'data/entities.json data/events.json data/evidence.json',
    'git add "$OUTPUT_DIR"',
    '--title "Monthly review: $REVIEW_MONTH"',
  ]

  for (const snippet of requiredSnippets) {
    assert(workflow.includes(snippet), `monthly review workflow is missing: ${snippet}`)
  }

  assert.equal(workflow.includes('git add .'), false)
  assert.equal(workflow.includes('git add data/entities.json'), false)
  assert.equal(workflow.includes('git add data/events.json'), false)
  assert.equal(workflow.includes('git add data/evidence.json'), false)

  console.log('Monthly review workflow regression test passed.')
}
