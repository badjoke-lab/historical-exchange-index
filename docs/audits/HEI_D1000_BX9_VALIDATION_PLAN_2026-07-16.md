# HEI D-1000 Batch BX9 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx9-four-active-dex-records`

## 1. Scope

BX9 adds four reviewed active decentralized exchange entities:

```text
PunchSwap    hei_ex_000950
DropSwap     hei_ex_000951
Rubin        hei_ex_000952
LiquidLaunch hei_ex_000953
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX9 also completes the merged BX8 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX9.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 833
Events:   1004
Evidence: 3425
English dossiers:  833
Japanese dossiers: 833
Sitemap routes:     1690
```

Remaining to D-1000: 167 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected domains:

```text
swap.kittypunch.xyz
dropswap.finance
rubin.trade
liquidlaunch.app
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

1DEX was initially drafted but Records validation identified the existing legacy nested record `records/exchanges/records/exchanges/one-dex.json` (`hei_ex_000349`). The draft was removed and replaced with DropSwap before final validation.

Other existing records found and excluded during screening included Angstrom, Full Sail, DipCoin, HARD Swap, EagleFi, CobaltX, and BrownFi. Flowr was excluded because its tracked activity is an on-chain game economy rather than an exchange venue. Interest Protocol DEX was held because current first-party material places the relevant product among older products and current volume evidence was insufficient.

## 4. Evidence boundary

```text
PunchSwap:
  current official KittyPunch product documentation
  current first-party PunchSwap trade and liquidity application

DropSwap:
  current first-party multi-chain swap application
  current first-party daily fees and revenue API by chain

Rubin:
  current official organization mainnet trading repository
  current first-party mainnet perpetual-markets indexer

LiquidLaunch:
  current first-party application
  current independently maintained on-chain purchase, sale, bond, LP-fee, and staking adapter
```

LiquidLaunch confidence remains `medium` because public first-party technical documentation is limited. PunchSwap, DropSwap, and Rubin use two current first-party surfaces.

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

BX9 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
