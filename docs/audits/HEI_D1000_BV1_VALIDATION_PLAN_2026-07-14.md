# HEI D-1000 BV1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BV1 reviewed exchange update:

```text
HollaEx  hei_ex_000916 active — new entity
GalaSwap hei_ex_000709 active — implementation evidence refresh
```

## Required checks

```text
record schema validation
overlap audit
name/slug/domain/alias duplicate audit
entity/event/evidence ID collision audit
verified-unadded scan integrity
candidate consumption integrity
country/origin strict gate
projected enum validation
entity quality gate
URL safety
count semantics regression
machine-readable build and validation
public build and validation
Japanese route count parity
L-2 evaluation remains HOLD
maintainer recovery counts == 796 / 1004 / 3347
```

## Expected projected state

```text
Entities: 796
Events:   1004
Evidence: 3347
English dossiers:  796
Japanese dossiers: 796
Sitemap routes:     1616
```

## Evidence boundary

- HollaEx is supported by its current first-party exchange platform and current API documentation covering public market data and authenticated trading, account, deposit, withdrawal, conversion, WebSocket, and administrative interfaces.
- Existing GalaSwap `hei_ex_000709` receives current official GalaChain DEX chaincode evidence from a repository updated in July 2026.
- Neither record invents a launch date, jurisdiction, legal entity, terminal date, shutdown cause, predecessor, or successor.

## Overlap finding

Records validation identified the proposed `gala-swap` record as a duplicate of existing `galaswap.json` / `hei_ex_000709` through normalized slug, name, and `swap.gala.com`. The duplicate record was removed and only the strongest additive implementation evidence was attached to the existing entity.

Exact file and repository-wide identity checks found no current-main record for HollaEx.

The surrounding G-H candidate ranges remain heavily stale. Fraxswap, Fulcrom, FusionX, FWX DEX, Hashflow, HashKey Global, HeliSwap, Hercules, Honeyswap, HakuSwap, HARD Swap, Hashlock Markets, Heaven, HiBT, HitBTC, HiveSwap, and other candidates were rejected as existing records rather than duplicated.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
