import fs from 'node:fs'

const POLICY_PATH = 'docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md'
const CLOUDFLARE_CONFIG_PATH = 'config/cloudflare-pages-project.json'

const requiredFiles = [
  POLICY_PATH,
  CLOUDFLARE_CONFIG_PATH,
  'scripts/configure-cloudflare-pages-project.mjs',
  '.github/workflows/configure-cloudflare-pages.yml',
  'AGENTS.md',
  '.github/pull_request_template.md',
  'README.md',
]

const failures = []

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    failures.push(`Missing required operations file: ${file}`)
    continue
  }

  if (!fs.readFileSync(file, 'utf8').trim()) {
    failures.push(`Required operations file is empty: ${file}`)
  }
}

if (fs.existsSync('AGENTS.md')) {
  const agents = fs.readFileSync('AGENTS.md', 'utf8')
  if (!agents.includes(POLICY_PATH)) {
    failures.push('AGENTS.md must reference the Cloudflare deployment policy.')
  }
  if (!agents.includes(CLOUDFLARE_CONFIG_PATH)) {
    failures.push('AGENTS.md must reference the machine-readable Cloudflare project policy.')
  }
}

if (fs.existsSync('.github/pull_request_template.md')) {
  const template = fs.readFileSync('.github/pull_request_template.md', 'utf8')
  if (!template.includes(`I reviewed \`${POLICY_PATH}\``)) {
    failures.push('Pull request template must require deployment policy review.')
  }
  if (!template.includes('Cloudflare preview explicitly required')) {
    failures.push('Pull request template must record the preview decision.')
  }
}

if (fs.existsSync('README.md')) {
  const readme = fs.readFileSync('README.md', 'utf8')
  if (!readme.includes(POLICY_PATH)) {
    failures.push('README.md must link to the Cloudflare deployment policy.')
  }
}

if (fs.existsSync(POLICY_PATH)) {
  const policy = fs.readFileSync(POLICY_PATH, 'utf8')
  const normalizedPolicy = policy.toLowerCase()
  const requiredPolicyStatements = [
    'preview deployments are disabled by default',
    'compare `/version.json` with the expected git commit',
    '[cf-pages-skip]',
    'github actions validates every commit',
    CLOUDFLARE_CONFIG_PATH.toLowerCase(),
  ]

  for (const statement of requiredPolicyStatements) {
    if (!normalizedPolicy.includes(statement)) {
      failures.push(`Deployment policy is missing required statement: ${statement}`)
    }
  }
}

if (fs.existsSync(CLOUDFLARE_CONFIG_PATH)) {
  try {
    const config = JSON.parse(fs.readFileSync(CLOUDFLARE_CONFIG_PATH, 'utf8'))
    const source = config.source_config ?? {}
    const includes = source.path_includes ?? []
    const excludes = source.path_excludes ?? []

    if (config.schema_version !== '1.0.0') {
      failures.push('Cloudflare project policy schema_version must be 1.0.0.')
    }
    if (config.project_name !== 'historical-exchange-index') {
      failures.push('Cloudflare project_name must be historical-exchange-index.')
    }
    if (config.production_branch !== 'main') {
      failures.push('Cloudflare production_branch must be main.')
    }
    if (source.production_deployments_enabled !== true) {
      failures.push('Automatic production deployments must remain enabled in the current phase.')
    }
    if (source.preview_deployment_setting !== 'none') {
      failures.push('Automatic preview deployments must be disabled.')
    }
    if (!Array.isArray(includes) || includes.length === 0) {
      failures.push('Cloudflare path_includes must be a non-empty array.')
    }
    if (includes.includes('*') || includes.includes('scripts/*')) {
      failures.push('Cloudflare path_includes must not broadly include the whole repository or all scripts.')
    }

    const requiredIncludes = [
      'src/*',
      'public/*',
      'data/*',
      'records/*',
      'scripts/build-machine-readable-layer.mjs',
      'scripts/lib/*',
      'package.json',
      'package-lock.json',
      'next.config.ts',
      'tsconfig.json',
    ]
    for (const path of requiredIncludes) {
      if (!includes.includes(path)) failures.push(`Cloudflare path_includes is missing ${path}.`)
    }

    const requiredExcludes = ['docs/*', '.github/*', 'AGENTS.md', 'README.md']
    if (!Array.isArray(excludes)) {
      failures.push('Cloudflare path_excludes must be an array.')
    } else {
      for (const path of requiredExcludes) {
        if (!excludes.includes(path)) failures.push(`Cloudflare path_excludes is missing ${path}.`)
      }
    }
  } catch (error) {
    failures.push(`Cloudflare project policy is invalid JSON: ${error.message}`)
  }
}

if (failures.length > 0) {
  console.error('Repository operations policy check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Repository operations policy check passed.')
