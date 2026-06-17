import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const repoRoot = process.cwd()
const buildScript = path.join(repoRoot, 'scripts', 'build-machine-readable-layer.mjs')
const validateScript = path.join(repoRoot, 'scripts', 'validate-machine-readable-layer.mjs')

async function writeJson(root, relativePath, value) {
  const filePath = path.join(root, relativePath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

async function readJson(root, relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), 'utf8'))
}

function runNode(script, cwd, { expectFailure = false } = {}) {
  const result = spawnSync(process.execPath, [script], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GITHUB_SHA: 'fixture-sha',
      GITHUB_REF_NAME: 'fixture-branch',
    },
  })

  if (expectFailure) {
    assert.notEqual(result.status, 0, `Expected ${path.basename(script)} to fail`)
    return result
  }

  assert.equal(
    result.status,
    0,
    `${path.basename(script)} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  )
  return result
}

function canonicalEntity() {
  return {
    id: 'hei_ex_000001',
    slug: 'canonical-one',
    canonical_name: 'Canonical One',
    aliases: [],
    type: 'cex',
    status: 'active',
    official_domain_original: 'canonical-one.test',
    official_url_original: 'https://canonical-one.test/',
    last_verified_at: '2026-01-01',
  }
}

function newEntity() {
  return {
    id: 'hei_ex_000002',
    slug: 'new-two',
    canonical_name: 'New Two',
    aliases: [],
    type: 'dex',
    status: 'active',
    official_domain_original: 'new-two.test',
    official_url_original: 'https://new-two.test/',
    last_verified_at: '2026-02-01',
  }
}

const canonicalEvent = {
  id: 'hei_ev_000001',
  exchange_id: 'hei_ex_000001',
  event_type: 'launched',
  event_date: '2020-01-01',
  title: 'Canonical launch',
}

const repairEvent = {
  id: 'hei_ev_000002',
  exchange_id: 'hei_ex_000001',
  event_type: 'regulatory_action',
  event_date: '2021-01-01',
  title: 'Repair event',
}

const newEntityEvent = {
  id: 'hei_ev_000003',
  exchange_id: 'hei_ex_000002',
  event_type: 'launched',
  event_date: '2022-01-01',
  title: 'New entity launch',
}

const canonicalEvidence = {
  id: 'hei_src_000001',
  exchange_id: 'hei_ex_000001',
  event_id: 'hei_ev_000001',
  source_type: 'official_statement',
  title: 'Canonical source',
  url: 'https://canonical-one.test/source',
}

const repairEvidence = {
  id: 'hei_src_000002',
  exchange_id: 'hei_ex_000001',
  event_id: 'hei_ev_000002',
  source_type: 'regulatory_notice',
  title: 'Repair source',
  url: 'https://regulator.test/repair',
}

const newEntityEvidence = {
  id: 'hei_src_000003',
  exchange_id: 'hei_ex_000002',
  event_id: 'hei_ev_000003',
  source_type: 'official_statement',
  title: 'New entity source',
  url: 'https://new-two.test/source',
}

async function prepareFixture(root) {
  await writeJson(root, 'data/entities.json', [canonicalEntity()])
  await writeJson(root, 'data/events.json', [canonicalEvent])
  await writeJson(root, 'data/evidence.json', [canonicalEvidence])

  await writeJson(root, 'records/exchanges/repair-existing.json', {
    entity: canonicalEntity(),
    events: [canonicalEvent, repairEvent],
    evidence: [canonicalEvidence, repairEvidence],
  })

  await writeJson(root, 'records/exchanges/add-new-entity.json', {
    entity: newEntity(),
    events: [newEntityEvent],
    evidence: [newEntityEvidence],
  })

  await writeJson(root, 'records/exchanges/duplicate-new-entity.json', {
    entity: newEntity(),
    events: [newEntityEvent],
    evidence: [newEntityEvidence],
  })
}

async function verifySuccessfulAggregation(root) {
  runNode(buildScript, root)

  const version = await readJson(root, 'public/version.json')
  const manifest = await readJson(root, 'public/data/manifest.json')
  const expectedCounts = {
    primary_records: 2,
    events: 3,
    evidence: 3,
  }

  assert.deepEqual(version.data.record_counts, expectedCounts)
  assert.deepEqual(manifest.record_counts, expectedCounts)
  assert.equal(version.data.record_count_breakdown.active_side, 2)
  assert.equal(version.data.record_count_breakdown.type.cex, 1)
  assert.equal(version.data.record_count_breakdown.type.dex, 1)

  assert.equal(Object.hasOwn(version, 'data_schema_version'), false)
  assert.equal(Object.hasOwn(version, 'verification_marker'), false)
  assert.equal(version.data.data_schema_version, 'hei_entity_event_evidence_v1')
  assert.equal(version.build.verification_marker, 'hei_machine_readable_layer_v1')

  runNode(validateScript, root)
}

async function verifyBundleConflictFails(root) {
  await writeJson(root, 'records/exchanges/conflicting-duplicate.json', {
    entity: newEntity(),
    events: [{ ...newEntityEvent, title: 'Conflicting event content' }],
    evidence: [newEntityEvidence],
  })

  const result = runNode(buildScript, root, { expectFailure: true })
  const output = `${result.stdout}\n${result.stderr}`
  assert.match(output, /conflicting event id: hei_ev_000003/)
}

const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hei-reviewed-bundle-test-'))

try {
  await prepareFixture(fixtureRoot)
  await verifySuccessfulAggregation(fixtureRoot)
  await verifyBundleConflictFails(fixtureRoot)
  console.log('Reviewed bundle aggregation regression test passed.')
} finally {
  await fs.rm(fixtureRoot, { recursive: true, force: true })
}
