# HEI D-1000 BV1 Validation Plan

Date: 2026-07-14

## Scope

Validate two new reviewed exchange entities:

```text
HollaEx  hei_ex_000916 active
GalaSwap hei_ex_000917 active
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
maintainer recovery counts == 797 / 1004 / 3348
```

## Expected projected state

```text
Entities: 797
Events:   1004
Evidence: 3348
English dossiers:  797
Japanese dossiers: 797
Sitemap routes:     1618
```

## Evidence boundary

- HollaEx is supported by its current first-party exchange platform and current API documentation covering public market data and authenticated trading, account, deposit, withdrawal, conversion, WebSocket, and administrative interfaces.
- GalaSwap is supported by its current first-party GalaChain DEX application and the official GalaChain DEX chaincode repository updated in July 2026.
- Neither record invents a launch date, jurisdiction, legal entity, terminal date, shutdown cause, predecessor, or successor.

## Overlap expectation

Exact file checks and repository-wide name, slug, and text searches found no current-main record for HollaEx or GalaSwap.

The surrounding G-H candidate ranges remain heavily stale. Fraxswap, Fulcrom, FusionX, FWX DEX, Hashflow, HashKey Global, HeliSwap, Hercules, Honeyswap, HakuSwap, HARD Swap, Hashlock Markets, Heaven, HiBT, HitBTC, HiveSwap, and other candidates were rejected as existing records rather than duplicated.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
