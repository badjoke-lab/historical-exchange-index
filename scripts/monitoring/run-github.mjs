import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

function flag(value) {
  return String(value).toLowerCase() === 'true' || String(value) === '1' ? '1' : '0'
}

const scheduled = process.env.GITHUB_EVENT_NAME === 'schedule'
const env = {
  ...process.env,
  HEI_MONITORING_MODE: scheduled ? 'scheduled-external' : 'manual',
  HEI_MONITORING_ENABLE_REMOTE_LISTS: scheduled ? '1' : flag(process.env.MANUAL_ENABLE_EXTERNAL_LISTS),
  HEI_MONITORING_ENABLE_NEWS_RSS: scheduled ? '1' : flag(process.env.MANUAL_ENABLE_NEWS_RSS),
  HEI_MONITORING_ENABLE_DOMAIN_CHECKS: scheduled ? '1' : flag(process.env.MANUAL_ENABLE_DOMAIN_CHECKS),
  HEI_MONITORING_ENABLE_EVIDENCE_URL_CHECKS: scheduled ? '1' : flag(process.env.MANUAL_ENABLE_EVIDENCE_URL_CHECKS),
  HEI_MONITORING_ENABLE_REGULATORY_WATCH: scheduled ? '1' : flag(process.env.MANUAL_ENABLE_REGULATORY_WATCH),
  HEI_MONITORING_ENABLE_SITE_SEO_CHECKS: scheduled ? '1' : flag(process.env.MANUAL_ENABLE_SITE_SEO_CHECKS),
  HEI_MONITORING_SITE_URL: process.env.MANUAL_SITE_URL || 'https://hei.badjoke-lab.com',
  HEI_MONITORING_NEWS_QUERY_LIMIT: scheduled ? '20' : process.env.MANUAL_NEWS_QUERY_LIMIT || '20',
  HEI_MONITORING_REGULATORY_QUERY_LIMIT: scheduled ? '25' : process.env.MANUAL_REGULATORY_QUERY_LIMIT || '25',
  HEI_MONITORING_DOMAIN_CHECK_LIMIT: scheduled ? '25' : process.env.MANUAL_DOMAIN_CHECK_LIMIT || '50',
  HEI_MONITORING_EVIDENCE_URL_CHECK_LIMIT: scheduled ? '25' : process.env.MANUAL_EVIDENCE_URL_CHECK_LIMIT || '50',
}

console.log(`Monitoring run mode: ${env.HEI_MONITORING_MODE}`)
console.log(`Remote lists: ${env.HEI_MONITORING_ENABLE_REMOTE_LISTS}`)
console.log(`News RSS: ${env.HEI_MONITORING_ENABLE_NEWS_RSS}`)
console.log(`Regulatory watch: ${env.HEI_MONITORING_ENABLE_REGULATORY_WATCH}`)
console.log(`Domain checks: ${env.HEI_MONITORING_ENABLE_DOMAIN_CHECKS}`)
console.log(`Evidence URL checks: ${env.HEI_MONITORING_ENABLE_EVIDENCE_URL_CHECKS}`)
console.log(`Site and SEO checks: ${env.HEI_MONITORING_ENABLE_SITE_SEO_CHECKS}`)

const runFile = path.resolve('scripts/monitoring/run.mjs')
const result = spawnSync(process.execPath, [runFile], { env, stdio: 'inherit' })
if (result.error) throw result.error
process.exit(result.status ?? 1)
