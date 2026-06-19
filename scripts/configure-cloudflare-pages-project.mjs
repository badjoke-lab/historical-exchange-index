import fs from 'node:fs'
import process from 'node:process'

const CONFIG_PATH = 'config/cloudflare-pages-project.json'
const API_BASE = 'https://api.cloudflare.com/client/v4'
const VALID_MODES = new Set(['print', 'plan', 'apply'])

function fail(message) {
  console.error(message)
  process.exit(1)
}

function parseMode(argv) {
  const raw = argv.find((arg) => arg.startsWith('--')) ?? '--print'
  const mode = raw.slice(2)
  if (!VALID_MODES.has(mode)) {
    fail(`Unsupported mode: ${mode}. Use --print, --plan, or --apply.`)
  }
  return mode
}

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) fail(`Missing ${CONFIG_PATH}`)
  const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))

  if (parsed.schema_version !== '1.0.0') fail('Unsupported Cloudflare policy schema_version.')
  if (!parsed.project_name) fail('Cloudflare policy requires project_name.')
  if (!parsed.production_branch) fail('Cloudflare policy requires production_branch.')
  if (!parsed.source_config || typeof parsed.source_config !== 'object') {
    fail('Cloudflare policy requires source_config.')
  }
  if (parsed.source_config.preview_deployment_setting !== 'none') {
    fail('HEI policy requires preview_deployment_setting to be none.')
  }
  if (parsed.source_config.production_deployments_enabled !== true) {
    fail('HEI policy requires production_deployments_enabled to be true.')
  }

  return parsed
}

async function cloudflareRequest(path, init = {}) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  if (!accountId || !apiToken) {
    fail('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required for plan/apply modes.')
  }

  const response = await fetch(`${API_BASE}/accounts/${accountId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.success) {
    const details = body?.errors?.map((error) => `${error.code}: ${error.message}`).join('; ')
    fail(`Cloudflare API request failed (${response.status}): ${details || 'unknown error'}`)
  }

  return body.result
}

function selectedState(project) {
  const source = project?.source
  const config = source?.config ?? {}
  return {
    project_name: project?.name ?? null,
    production_branch: project?.production_branch ?? null,
    source_type: source?.type ?? null,
    production_deployments_enabled: config.production_deployments_enabled ?? null,
    preview_deployment_setting: config.preview_deployment_setting ?? null,
    pr_comments_enabled: config.pr_comments_enabled ?? null,
    path_includes: config.path_includes ?? [],
    path_excludes: config.path_excludes ?? [],
  }
}

function desiredState(policy) {
  return {
    project_name: policy.project_name,
    production_branch: policy.production_branch,
    source_type: 'github',
    ...policy.source_config,
  }
}

function stable(value) {
  return JSON.stringify(value, Object.keys(value).sort(), 2)
}

function buildPatch(currentProject, policy) {
  const source = currentProject?.source
  if (!source || source.type !== 'github') {
    fail('The existing Pages project must use GitHub source integration.')
  }

  return {
    production_branch: policy.production_branch,
    source: {
      type: source.type,
      config: {
        ...source.config,
        deployments_enabled: true,
        production_branch: policy.production_branch,
        production_deployments_enabled: policy.source_config.production_deployments_enabled,
        preview_deployment_setting: policy.source_config.preview_deployment_setting,
        pr_comments_enabled: policy.source_config.pr_comments_enabled,
        path_includes: policy.source_config.path_includes,
        path_excludes: policy.source_config.path_excludes,
        preview_branch_includes: [],
        preview_branch_excludes: [],
      },
    },
  }
}

const mode = parseMode(process.argv.slice(2))
const policy = readConfig()

if (mode === 'print') {
  console.log(JSON.stringify(desiredState(policy), null, 2))
  process.exit(0)
}

const projectPath = `/pages/projects/${encodeURIComponent(policy.project_name)}`
const current = await cloudflareRequest(projectPath)
const currentSelected = selectedState(current)
const desiredSelected = desiredState(policy)

console.log('Current selected Cloudflare Pages state:')
console.log(JSON.stringify(currentSelected, null, 2))
console.log('Desired selected Cloudflare Pages state:')
console.log(JSON.stringify(desiredSelected, null, 2))

if (stable(currentSelected) === stable(desiredSelected)) {
  console.log('Cloudflare Pages project already matches repository policy.')
  process.exit(0)
}

if (mode === 'plan') {
  console.log('Configuration differs. Re-run with --apply to update the project.')
  process.exit(0)
}

const patch = buildPatch(current, policy)
await cloudflareRequest(projectPath, {
  method: 'PATCH',
  body: JSON.stringify(patch),
})

const verified = await cloudflareRequest(projectPath)
const verifiedSelected = selectedState(verified)

if (stable(verifiedSelected) !== stable(desiredSelected)) {
  console.error('Verified state:')
  console.error(JSON.stringify(verifiedSelected, null, 2))
  fail('Cloudflare Pages configuration verification failed after PATCH.')
}

console.log('Cloudflare Pages project configuration applied and verified.')
