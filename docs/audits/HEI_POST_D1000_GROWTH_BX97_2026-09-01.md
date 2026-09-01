# HEI post-D1000 growth audit — BX97 Glue Hub canonical refresh

Date: 2026-09-01

## Scope

Review backlog candidate `hei_unadded_0863 Glue Hub` against current main and preserve entity-first deduplication.

## Current-main finding

`Glue Hub` is already represented as canonical `hei_ex_000756` in `records/exchanges/glue-hub.json`. No new entity ID is allocated.

## Evidence refresh

Current first-party Glue material now provides stronger exchange-boundary evidence than the July 2026 record:

- `https://hub.glue.net/` is live and exposes market, buy/sell, earn, transfer/pay and account/history functionality.
- `https://docs.glue.net/learn/glue-hub` explicitly describes Glue Hub as a fully decentralized interface that aggregates protocols and routes users toward execution prices rather than acting as a custodial centralized exchange.
- current CoinGecko Glue Hub exchange data reports an active market pair and exchange volume.

## Canonical decision

- entity: `hei_ex_000756`
- type: `dex`
- status: `active`
- confidence: `high`
- official URL: `https://hub.glue.net/`
- launch_date: `null`
- events: unchanged (`[]`)

No exact first-party launch day is established. Secondary establishment-year metadata is not promoted to an exact date, and routine current activity is not converted into a lifecycle event.

## Backlog handling

`hei_unadded_0863` is consumed against existing `hei_ex_000756`. This prevents stale scan metadata from allocating a duplicate exchange entity.

No schema, validator, allowlist or quality-gate weakening is introduced.
