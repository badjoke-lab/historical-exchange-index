import assert from 'node:assert/strict'
import fs from 'node:fs'

export function runMonthlyReviewWorkflowRegression() {
  const workflow = fs.readFileSync('.github/workflows/hei-monthly-review.yml', 'utf8')

  const requiredSnippets = [
    'cron: "0 4 1 * *"',
    'workflow_dispatch:',
    'review_month:',
    'contents: read',
    'pull-requests: read',
    'ref: main',
    'fetch-depth: 0',
    "date -u -d 'last month' +%Y-%m",
    'gh pr list --state all --limit 200 --json number,title,mergedAt',
    'Auto monitoring report: $REVIEW_MONTH-',
    'any(.[]; .mergedAt != null)',
    'pull/$PR_NUMBER/head:$REF',
    'data-staging/monthly-review-input/$REVIEW_MONTH',
    'Invalid monitoring path: $FILE_PATH',
    'npm run machine:build',
    'node scripts/review/build-monthly-review.mjs --month "$REVIEW_MONTH"',
    'node scripts/review/validate-monthly-review.mjs --month "$REVIEW_MONTH"',
    'data/entities.json data/events.json data/evidence.json',
    'actions/upload-artifact@v6',
    'hei-monthly-review-${{ steps.month.outputs.review_month }}',
    'if-no-files-found: error',
    'retention-days: 30',
  ]

  for (const snippet of requiredSnippets) {
    assert(workflow.includes(snippet), `monthly review workflow is missing: ${snippet}`)
  }

  for (const forbidden of [
    'contents: write',
    'pull-requests: write',
    'git add .',
    'git push',
    'gh pr create',
    'git checkout -b',
  ]) {
    assert.equal(workflow.includes(forbidden), false, `monthly review workflow must not contain: ${forbidden}`)
  }

  console.log('Monthly review workflow regression test passed.')
}
