# HEI D-1000 Batch BX18 Validation Plan

Date: 2026-07-19  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx18-four-held-active-exchange-records`

## 1. Scope

BX18 promotes four previously held active exchange candidates:

```text
Decibel    hei_ex_000986
Lista DEX  hei_ex_000987
Sovryn     hei_ex_000988
GMTrade    hei_ex_000989
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX18 also completes the merged BX17 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX18.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 869
Events:   1004
Evidence: 3497
English dossiers:  869
Japanese dossiers: 869
Sitemap routes:     1762
```

Remaining to D-1000: 131 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases and product identity
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected identity surfaces:

```text
decibel.trade
lista.org
sovryn.com
gmtrade.org
```

Repository searches, reviewed `data/entities.json`, and direct normal and alternate canonical-path checks found no current-main identity or domain match for the final four records.

GalaSwap, Fluid DEX, Figure Markets, and Fraxswap were excluded after direct canonical inspection found existing entities `hei_ex_000709`, `hei_ex_000691`, `hei_ex_000689`, and `hei_ex_000703`.

Decibel exchange, order-book, clearinghouse, trader, and cross-chain deposit surfaces remain one entity. Lista DEX remains one exchange entity distinct from Lista DAO's lending, stablecoin, liquid-staking, and RWA products. Sovryn swap, spot, margin, Alpha, and liquidity surfaces remain one exchange entity. GMTrade crypto, foreign-exchange, commodity, stock, and index perpetual markets remain one exchange entity.

## 4. Watchlist resolution validation

The dated resolution override must close all four held candidates:

```text
candidate:decibel    promoted -> hei_ex_000986
candidate:lista-dex  promoted -> hei_ex_000987
candidate:sovryn-dex promoted -> hei_ex_000988
candidate:gmtrade    promoted -> hei_ex_000989
```

The historical base resolution index remains unchanged. Candidate scan and Watchlist resolution must both pass on the projected public entity set.

## 5. Evidence boundary

```text
Decibel:
  current first-party exchange documentation
  current independent perpetual volume, TVL, fee, revenue, and open-interest metrics

Lista DEX:
  current first-party Smart Swap application
  current independent DEX volume, TVL, fee, and revenue metrics

Sovryn:
  current first-party trading platform and documentation
  current independent DEX volume and TVL metrics

GMTrade:
  current first-party perpetual exchange platform
  current independent perpetual volume, TVL, fee, revenue, and open-interest metrics
```

All four records are classified `active` with `high` confidence.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

Sovryn's broader lending and governance products do not create additional exchange entities. Lista DAO's non-exchange products are not folded into the Lista DEX exchange record as exchange functionality.

## 6. Required validation

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

## 7. Roadmap safety

The roadmap update must preserve the exact frozen-baseline phrase:

```text
G-7 v1.0 Baseline Checkpoint
```

The roadmap must not duplicate the exact L-2 current-item literal from the active L-2 plan. The active L-2 plan and recovery contract remain authoritative for that item.

## 8. Localization boundary

L-2 remains `HOLD`.

BX18 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
