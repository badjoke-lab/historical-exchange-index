# HEI D-1000 Batch BX12 Validation Plan

Date: 2026-07-17  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx12-four-active-dex-records`

## 1. Scope

BX12 adds four reviewed active decentralized exchange or integrated trading-platform entities:

```text
NOXA             hei_ex_000962
Somnia Exchange  hei_ex_000963
SectorOne        hei_ex_000964
Somnex           hei_ex_000965
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX12 also completes the merged BX11 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX12.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 845
Events:   1004
Evidence: 3449
English dossiers:  845
Japanese dossiers: 845
Sitemap routes:     1714
```

Remaining to D-1000: 155 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases
parent and child product identity
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected identity surfaces:

```text
noxa.fi
somnia.exchange
sectorone.xyz
somnex.xyz
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

Bean Exchange was excluded after direct path inspection found existing record `hei_ex_000559`. SomeSwap remained held because current independent activity was visible but a sufficiently strong current first-party identity surface was not confirmed for this reviewed batch.

NOXA DEX and NOXA Fun are recorded as one NOXA entity. SectorOne DLMM and its vault products remain one SectorOne entity. Somnex DEX, Somnex V3, SpotX aggregation, perpetuals, and meme-launch trading remain one Somnex entity. Child metric labels must not become duplicate exchange records.

## 4. Evidence boundary

```text
NOXA:
  current first-party protocol website
  current first-party protocol documentation

Somnia Exchange:
  current first-party mainnet exchange application
  current official Somnia ecosystem documentation

SectorOne:
  current first-party DLMM documentation
  current independent multi-chain volume, fee, revenue, and TVL metrics

Somnex:
  current first-party integrated trading-platform documentation
  current independent Somnia spot-volume, fee, and liquidity metrics
```

All four are classified `active` with `high` confidence. Current official surfaces and current non-zero trading or protocol activity support the classifications.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

## 5. Required validation

All pull-request workflows must pass on the final head, including:

```text
Records validation
Candidate scan gate
Watchlist resolution gate
Count semantics regression
Maintainer recovery gate
Machine/public consistency gate
URL safety gate
Japanese Pilot readiness gate
L2 localization evaluation gate
v1 baseline checkpoint gate
CI
```

Merge only after all 20 workflows complete successfully on the same final head SHA.

## 6. Roadmap safety

The roadmap update must preserve the exact frozen-baseline phrase:

```text
G-7 v1.0 Baseline Checkpoint
```

The roadmap must not duplicate the exact L-2 current-item literal from the active L-2 plan. The active L-2 plan and recovery contract remain authoritative for that item.

## 7. Localization boundary

L-2 remains `HOLD`.

BX12 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
