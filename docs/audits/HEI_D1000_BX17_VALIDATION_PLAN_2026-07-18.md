# HEI D-1000 Batch BX17 Validation Plan

Date: 2026-07-18  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx17-four-held-active-derivatives-records`

## 1. Scope

BX17 promotes four previously held active decentralized derivatives-exchange candidates:

```text
Ethereal   hei_ex_000982
Boros      hei_ex_000983
Moonlander hei_ex_000984
Reya       hei_ex_000985
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX17 also completes the merged BX16 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX17.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 865
Events:   1004
Evidence: 3489
English dossiers:  865
Japanese dossiers: 865
Sitemap routes:     1754
```

Remaining to D-1000: 135 entities.

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
ethereal.trade
boros.pendle.finance
moonlander.trade
reya.xyz
```

Repository searches, reviewed `data/entities.json`, and direct normal and alternate canonical-path checks found no current-main identity or domain match for the final four records.

Hydration, Rhea, and Fulcrom were excluded after direct canonical inspection found existing entities `hei_ex_000699`, `hei_ex_000224`, and `hei_ex_000704`.

Ethereal protocol, perpetual interface, and appchain remain one entity. Boros trading and Pendle-hosted documentation remain one Boros entity. Moonlander trading, liquidity, staking, and prediction extensions remain one entity. Reya Network, ReyaChain, perpetual interface, API, and margin surfaces remain one entity.

## 4. Watchlist resolution validation

The dated resolution override must close all four held candidates:

```text
candidate:ethereal-dex promoted -> hei_ex_000982
candidate:boros        promoted -> hei_ex_000983
candidate:moonlander   promoted -> hei_ex_000984
candidate:reya-perps   promoted -> hei_ex_000985
```

The historical base resolution index remains unchanged. Candidate scan and Watchlist resolution must both pass on the projected public entity set.

## 5. Evidence boundary

```text
Ethereal:
  current first-party exchange and appchain documentation
  current independent perpetual volume, TVL, fee, revenue, and open-interest metrics

Boros:
  current first-party Pendle application and Boros documentation
  current independent volume, TVL, fee, revenue, and open-interest metrics

Moonlander:
  current first-party application and documentation
  current independent perpetual volume, TVL, fee, and open-interest metrics

Reya:
  current first-party website and trading documentation
  current independent perpetual volume, TVL, fee, revenue, and open-interest metrics
```

All four records are classified `active` with `high` confidence.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

Regional access restrictions on Boros do not establish global termination and must not be modeled as a death event.

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

BX17 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
