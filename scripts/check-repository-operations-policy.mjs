import fs from 'node:fs'

const requiredFiles = [
  'docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md',
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
  if (!agents.includes('docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md')) {
    failures.push('AGENTS.md must reference the Cloudflare deployment policy.')
  }
}

if (fs.existsSync('.github/pull_request_template.md')) {
  const template = fs.readFileSync('.github/pull_request_template.md', 'utf8')
  if (!template.includes('I reviewed `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`')) {
    failures.push('Pull request template must require deployment policy review.')
  }
  if (!template.includes('Cloudflare preview explicitly required')) {
    failures.push('Pull request template must record the preview decision.')
  }
}

if (fs.existsSync('README.md')) {
  const readme = fs.readFileSync('README.md', 'utf8')
  if (!readme.includes('docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md')) {
    failures.push('README.md must link to the Cloudflare deployment policy.')
  }
}

if (fs.existsSync('docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md')) {
  const policy = fs.readFileSync('docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md', 'utf8')
  const requiredPolicyStatements = [
    'Preview deployments are disabled by default',
    'Compare `/version.json` with the expected Git commit',
    '[CF-Pages-Skip]',
    'GitHub Actions validates every commit',
  ]

  for (const statement of requiredPolicyStatements) {
    if (!policy.includes(statement)) {
      failures.push(`Deployment policy is missing required statement: ${statement}`)
    }
  }
}

if (failures.length > 0) {
  console.error('Repository operations policy check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Repository operations policy check passed.')
