# HEI D-1000 Batch BX8 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx8-four-active-dex-records`

## 1. Scope

BX8 adds four reviewed active decentralized exchange entities:

```text
SwapX    hei_ex_000946
Raindex  hei_ex_000947
Sour     hei_ex_000948
Metric   hei_ex_000949
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX8 also completes the merged BX7 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution roadmap from the stale BX4 checkpoint to BX8.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 829
Events:   1004
Evidence: 3417
English dossiers:  829
Japanese dossiers: 829
Sitemap routes:     1682
```

Remaining to D-1000: 171 entities.

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
swapx.fi
rainlang.xyz
sour.finance
metric.xyz
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

BrownFi was initially considered but direct canonical-path inspection found the existing reviewed record `hei_ex_000606`, so it was excluded before drafting.

HyperLynx was not drafted because a distinct first-party official domain could not be confirmed beyond the official GitHub organization; the identity remains suitable for later dedicated review.

## 4. Evidence boundary

```text
SwapX:
  current official application
  current official SwapX Algebra implementation

Raindex:
  current Rainlang documentation
  current official orderbook, subgraph, and contract repository

Sour:
  current official Solana mainnet perp-DEX site
  current first-party trading application

Metric:
  current official protocol domain
  current independent multi-chain TVL and Swap-event volume profile
```

Metric confidence remains `medium` because public first-party technical documentation is limited. The other three records use two current first-party surfaces.

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

BX8 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
