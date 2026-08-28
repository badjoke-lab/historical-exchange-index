# HEI post-D1000 growth — BX82 — GCB Exchange

Reviewed at: 2026-08-28
Base main: `deb0c9ab54f3809de0113aac4b3746f35ea11e92`

## Result

GCB Exchange (GCBEX) is promoted from the stale pending-thin backlog into canonical HEI after fresh source verification.

## Canonical decision

- entity: `hei_ex_001179`
- type: `cex`
- status: `active`
- death_reason: `null`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `Global`
- confidence: `high`

The official roadmap places the exchange launch in Q1 2024, but no exact date was confirmed. HEI therefore does not normalize the quarter to an invented day.

## Evidence

1. GCB first-party cryptocurrency-exchange documentation identifies the product and its spot/P2P/perpetual/leveraged-ETF functionality.
2. GCB first-party roadmap records Exchange Launch in Q1 2024 and further Exchange Core work in Q2 2024.
3. The first-party GCBEX trading surface remains live with market, trade, futures, deposit, OTC, login/signup, and application-download paths.

## Overlap check

Current-main search found no canonical GCB Exchange / GCBEX / gcbex.com record before this branch was created.

## Public modeling boundary

The source set supports current active exchange identity and quarter-level historical launch context. It does not support an exact launch day or a durable legal-jurisdiction assignment, so those are not inferred.

## Delta

- +1 entity
- +0 events
- +3 evidence
- +0 lineage edges

## Integrity

No schema, validator, monitoring, localization, or Phase 9 production changes are included. IDs were allocated from exact base main and must be replayed if main advances before merge.