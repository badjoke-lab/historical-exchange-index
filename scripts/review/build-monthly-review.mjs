import fs from 'node:fs'
import path from 'node:path'
import { loadCanonicalData } from '../monitoring/core/load-canonical-data.mjs'
import { buildMonthlyReview, previousUtcMonth, writeMonthlyReview } from './monthly-review-core.mjs'

function parseArgs(argv) {
  const args = {
    month: null,
    inputRoots: [],
    outputRoot: 'data-staging/monthly-reviews',
  }

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]
    if (arg === '--month') {
      args.month = next
      index += 1
    } else if (arg === '--input-root') {
      args.inputRoots.push(next)
      index += 1
    } else if (arg === '--output-root') {
      args.outputRoot = next
      index += 1
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return args
}

async function main() {
  const args = parseArgs(process.argv)
  const root = process.cwd()
  const month = args.month || previousUtcMonth()
  const inputRoots = args.inputRoots.length > 0 ? args.inputRoots : [root]
  const outputRoot = path.resolve(root, args.outputRoot)
  const canonicalData = await loadCanonicalData()
  const review = await buildMonthlyReview({
    root,
    month,
    inputRoots,
    outputRoot,
    canonicalData,
  })

  await writeMonthlyReview(review)

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `monthly_review_dir=${review.outputDir}\n`)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `review_month=${review.monthInfo.month}\n`)
  }

  const metrics = review.files['metrics.json']
  const health = review.files['monitoring-health.json']
  console.log(
    `Built HEI monthly review ${review.monthInfo.month}: `
    + `${metrics.counts.entities} entities, ${health.observed_unique_runs} monitoring runs.`,
  )
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error)
  process.exit(1)
})
