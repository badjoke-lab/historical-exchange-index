# HEI Post-D1000 Growth — BX96 — 2026-09-01

## Target

- reviewed candidate identity: `hei_unadded_0795` — Forest V1
- existing canonical entity: `hei_ex_000863` — Forest (`forest`)

## Canonical decision

No new exchange entity is created. `Forest V1` is already represented by the existing Forest canonical identity, so BX96 is a status/evidence refresh rather than a duplicate promotion.

The existing record moves from `limited` to `active`.

## Current evidence

The prior July 2026 review used `limited` because it did not recover a stable first-party operating surface or strong recent utilization evidence.

Current review now has both:

- the first-party Forest Protocol site at `https://forest.inc/` is live and presents the BNB Chain product/trading surface;
- current DefiLlama Forest V1 metrics classify the protocol as a BNB Chain DEX/AMM and report non-zero TVL plus recent 30-day, 7-day, and 24-hour DEX volume;
- the maintained DefiLlama adapter configuration continues to identify Forest V1 on BNB Chain.

Together these support present `active` status rather than the older conservative `limited` classification.

## Fields refreshed

- status: `limited` -> `active`
- official URL: `https://forest.inc/`
- official domain: `forest.inc`
- official URL status: `live_verified`
- confidence: `high`
- `last_verified_at`: `2026-09-01`
- evidence bundle refreshed to current first-party and current DEX metrics

## Evidence boundaries

HEI does not convert the maintained adapter's start timestamp into an exact `launch_date`; that value is not treated as a first-party launch announcement. `launch_date` remains `null`.

No lifecycle event is emitted from routine current activity. `death_reason` and `death_date` remain `null`.

## Backlog integrity note

The older pending-batch memo for the 0751-0800 window contains a stale mapping that labels `hei_unadded_0795` as `edgeX Spot`. Current verified candidate authority and the later reviewed scan identify `hei_unadded_0795` as `Forest V1`; `edgeX Spot` is separately represented by candidate `hei_unadded_0644` and is already canonical as `hei_ex_000911`.

BX96 follows the current verified candidate authority and does not consume or alter the already-resolved edgeX identity.

## Integrity

No schema, validator, allowlist, overlap gate, or quality-gate change is included.