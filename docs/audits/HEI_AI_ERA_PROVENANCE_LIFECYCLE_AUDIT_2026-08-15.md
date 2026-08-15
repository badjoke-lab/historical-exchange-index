# HEI AI-era Provenance and Lifecycle Audit — 2026-08-15

Status: bounded audit / backlog authority

Authority:
- `docs/HEI_V1_EXECUTION_ROADMAP.md`
- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`

This audit satisfies the bounded representative review required by Stage B. It does not change canonical records and does not authorize automatic promotion of monitoring findings.

## Scope

Representative records were chosen to cover current active, limited, inactive, recent regulatory, and terminal cases with different lifecycle shapes:

- HTX — `hei_ex_000019`
- EXMO — `hei_ex_000685`
- Bitget — `hei_ex_000028`
- BTCBOX — `hei_ex_000602`
- BitradeX — `hei_ex_001150`
- Shelbit — `hei_ex_001137`
- HKVAEX — `hei_ex_000508`

Review dimensions:

- post-event follow-up completeness
- `last_verified_at` recency and meaning
- evidence provenance and archive visibility
- unresolved status/final-state ambiguity
- successor/predecessor or related-entity handling
- claims, recovery, distribution, reopening, or final-state follow-up when applicable

## Findings

### P0 — BTCBOX follow-up is overdue

Current canonical state records the 2026-08-03 partial reopening and explicitly states that Japanese-yen withdrawals were planned for 2026-08-10, with remaining services planned for sequential reopening from September. The canonical record was last verified on 2026-08-03.

Required follow-up:

1. verify whether the announced 2026-08-10 yen-withdrawal restart actually occurred;
2. verify the current state of crypto withdrawals, exchange trading, easy-buy, and account functions;
3. add only effective-state events supported by first-party evidence;
4. update status only if current service evidence supports it.

Priority: **P0 / immediate reviewed lifecycle pass**.

### P0 — BitradeX primary event evidence is missing

The August 2026 asset-release event remains supported only by a low-reliability community reference. The record itself explicitly says the underlying first-party August announcement and detailed release rules have not been captured.

Required follow-up:

1. recover the first-party August announcement and release rules if publicly available;
2. archive the primary source when possible;
3. verify whether staged release, referral-linked acceleration, withdrawal restrictions, or other mechanics are actually stated;
4. revise the event description/status classification only to the extent the primary evidence supports it.

Priority: **P0 / provenance repair**.

### P1 — Shelbit final-state ambiguity remains unresolved

The record correctly preserves conflicting evidence: Shelbit said it ceased operations in January 2026, while VARA stated in July that unlicensed activity had continued. The current canonical status is `inactive`, with no death date or death reason.

Required follow-up:

1. check post-sanctions regulator, company, domain, and exchange-surface evidence;
2. determine whether a terminal shutdown can now be supported;
3. preserve `inactive` if evidence remains contradictory;
4. do not synthesize a death date from the company statement alone.

Priority: **P1 / final-state review**.

### P1 — Bitget has scheduled future lifecycle checkpoints

The canonical record contains a Japan withdrawal announcement with close-only restrictions scheduled for 2026-11-01 and forced closure of remaining positions from 2026-12-31. Global entity status correctly remains `active`.

Required follow-up:

- on or after 2026-11-01, verify the close-only stage from first-party evidence;
- on or after 2026-12-31, verify the forced-closure/end-state stage;
- keep the events jurisdiction-specific and do not convert them into a global shutdown.

Priority: **P1 / date-triggered lifecycle follow-up**.

### P2 — HTX and EXMO recent EU action has strong provenance but needs later effect verification

Both records now contain primary EUR-Lex evidence plus independent corroboration for the EU action adopted in July 2026 and effective 2026-08-23. Their global entity status remains `active`, which is appropriate because the action is jurisdiction-specific.

Required follow-up:

- after 2026-08-23, verify material exchange-level implementation effects if first-party or regulator evidence becomes available;
- do not infer global operational restriction from the legal listing alone.

Priority: **P2 / effective-date verification**.

### P3 — HKVAEX is a good terminal-reference shape

HKVAEX already contains launch, licence-withdrawal regulatory action, phased shutdown, regulator evidence, independent closure evidence, archive coverage, and a terminal `dead` state. It is useful as a reference record for complete event/evidence presentation.

No immediate canonical change identified from this bounded audit.

Priority: **P3 / reference-quality control case**.

## Provenance/product implications

The representative review shows that the largest AI-era value gap is not basic entity identity. It is lifecycle continuation and explicit provenance state:

- some records have strong event evidence but need later effective-state verification;
- some have known future checkpoints that should not be forgotten;
- some preserve unresolved contradictions correctly and need a later final-state pass;
- some contain event claims whose primary source has not yet been captured.

Stage C record-level machine-readable output should therefore expose, directly from canonical data where available:

- entity identity and current status;
- ordered reviewed events;
- evidence references per event;
- source type, publisher, reliability, claim scope, archive URL, and access date;
- `last_verified_at`;
- predecessor/successor fields when canonical;
- unresolved notes rather than silently replacing them with generated summaries.

No separate AI-only source of truth should be created.

## Bounded backlog

Execution order from this audit:

1. `BTCBOX` — verify post-2026-08-03 reopening stages.
2. `BitradeX` — recover primary August release evidence.
3. `Shelbit` — re-check final operating state after July/August enforcement.
4. `HTX` / `EXMO` — verify implementation effects after 2026-08-23.
5. `Bitget` — scheduled 2026-11-01 and 2026-12-31 follow-ups.

These are review tasks, not automatic canonical mutations. Each canonical change still requires its own evidence-backed reviewed PR.

## Stage B result

Stage B is **COMPLETE as an audit/backlog step** when this document is merged with normal repository validation green. It does not mean the backlog items themselves are complete; those feed Stage G lifecycle follow-up and ordinary Lane A quality work.

The next AI-era implementation stage is Stage C: define and ship deterministic record-level machine-readable output without interrupting the active L-2 HOLD/evidence-capture lane.