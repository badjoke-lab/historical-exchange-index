import assert from 'node:assert/strict'
import { classifyReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

function canonicalEntity() {
  return {
    id: 'hei_ex_000001',
    slug: 'canonical-one',
    canonical_name: 'Canonical One',
    aliases: [],
    type: 'cex',
    status: 'active',
    launch_date: '2020-01-01',
    summary: 'Canonical summary.',
    official_domain_original: 'canonical-one.test',
    official_url_original: 'https://canonical-one.test/',
    confidence: 'medium',
    last_verified_at: '2026-01-01',
    notes: '',
  }
}

function correctedCanonicalEntity() {
  return {
    ...canonicalEntity(),
    launch_date: '2019-12-01',
    summary: 'Corrected canonical summary.',
    confidence: 'high',
    last_verified_at: '2026-03-01',
    notes: 'Reviewed correction.',
  }
}

function correction() {
  return {
    entity_id: 'hei_ex_000001',
    expected: {
      launch_date: '2020-01-01',
      summary: 'Canonical summary.',
      confidence: 'medium',
      last_verified_at: '2026-01-01',
      notes: '',
    },
    changes: {
      launch_date: '2019-12-01',
      summary: 'Corrected canonical summary.',
      confidence: 'high',
      last_verified_at: '2026-03-01',
      notes: 'Reviewed correction.',
    },
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

function reviewedEntries() {
  return [
    {
      fileName: 'repair-existing.json',
      bundle: {
        entity: correctedCanonicalEntity(),
        entity_correction: correction(),
        events: [{ ...canonicalEvent, title: 'Ignored bundle mirror' }, repairEvent],
        evidence: [{ ...canonicalEvidence, title: 'Ignored evidence mirror' }, repairEvidence],
      },
    },
    {
      fileName: 'add-new-entity.json',
      bundle: {
        entity: newEntity(),
        events: [newEntityEvent],
        evidence: [newEntityEvidence],
      },
    },
    {
      fileName: 'duplicate-new-entity.json',
      bundle: {
        entity: newEntity(),
        events: [newEntityEvent],
        evidence: [newEntityEvidence],
      },
    },
  ]
}

export function runReviewedBundleAggregationRegression() {
  const canonicalEntities = [canonicalEntity()]
  const canonicalEvents = [canonicalEvent]
  const canonicalEvidenceRecords = [canonicalEvidence]
  const { all, newEntityBundles } = classifyReviewedBundles(canonicalEntities, reviewedEntries())

  const correctedEntities = applyReviewedEntityCorrections(canonicalEntities, all)
  const entities = [...correctedEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
  const events = mergeRecords(canonicalEvents, all, 'events', 'event')
  const evidence = mergeRecords(canonicalEvidenceRecords, all, 'evidence', 'evidence')

  assert.equal(entities.length, 2, 'existing-entity repair bundle must not increase entity count')
  assert.equal(events.length, 3, 'all reviewed bundle events must be included once')
  assert.equal(evidence.length, 3, 'all reviewed bundle evidence must be included once')
  assert.deepEqual(entities[0], correctedCanonicalEntity())
  assert.equal(events.find((event) => event.id === canonicalEvent.id)?.title, canonicalEvent.title)
  assert.equal(evidence.find((item) => item.id === canonicalEvidence.id)?.title, canonicalEvidence.title)

  const conflictingEntries = [
    ...all,
    {
      fileName: 'conflicting-duplicate.json',
      bundle: {
        entity: newEntity(),
        events: [{ ...newEntityEvent, title: 'Conflicting event content' }],
        evidence: [newEntityEvidence],
      },
    },
  ]
  assert.throws(
    () => mergeRecords(canonicalEvents, conflictingEntries, 'events', 'event'),
    /conflicting event id: hei_ev_000003/,
  )

  const staleCorrection = reviewedEntries()
  staleCorrection[0].bundle.entity_correction.expected.launch_date = '2018-01-01'
  assert.throws(
    () => applyReviewedEntityCorrections(canonicalEntities, staleCorrection),
    /stale entity_correction expected value/,
  )

  const identityCorrection = reviewedEntries()
  identityCorrection[0].bundle.entity_correction = {
    entity_id: 'hei_ex_000001',
    expected: { slug: 'canonical-one' },
    changes: { slug: 'renamed-one' },
  }
  assert.throws(
    () => applyReviewedEntityCorrections(canonicalEntities, identityCorrection),
    /entity_correction field is not allowed: slug/,
  )

  const duplicateCorrection = reviewedEntries()
  duplicateCorrection.push({
    fileName: 'second-correction.json',
    bundle: {
      entity: correctedCanonicalEntity(),
      entity_correction: {
        entity_id: 'hei_ex_000001',
        expected: { launch_date: '2019-12-01' },
        changes: { launch_date: '2019-11-01' },
      },
      events: [],
      evidence: [],
    },
  })
  assert.throws(
    () => applyReviewedEntityCorrections(canonicalEntities, duplicateCorrection),
    /entity field already corrected/,
  )

  console.log('Reviewed bundle aggregation regression test passed.')
}
