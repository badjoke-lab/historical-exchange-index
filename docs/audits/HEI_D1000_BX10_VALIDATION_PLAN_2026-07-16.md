# HEI D-1000 Batch BX10 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx10-four-active-dex-records`

## 1. Scope

BX10 adds four reviewed active decentralized exchange entities:

```text
Topaz               hei_ex_000954
Markets by Kinetiq  hei_ex_000955
Upheaval V3         hei_ex_000956
Ryze Protocol       hei_ex_000957
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX10 also completes the merged BX9 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX10.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 837
Events:   1004
Evidence: 3433
English dossiers:  837
Japanese dossiers: 837
Sitemap routes:     1698
```

Remaining to D-1000: 163 entities.

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
topazdex.com
markets.xyz
upheaval.fi
ryze.pro
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

Archer Exchange was excluded after direct path inspection found existing record `hei_ex_000882`. The prior BX9 1DEX collision demonstrates that direct legacy-path checks remain mandatory even when repository search returns no match.

## 4. Evidence boundary

```text
Topaz:
  current first-party DEX website and production application links
  current first-party protocol documentation

Markets by Kinetiq:
  current first-party trading application
  current first-party documentation updated 2026-05-05

Upheaval V3:
  current first-party HyperEVM exchange application
  current first-party fee and concentrated-liquidity documentation

Ryze Protocol:
  current first-party protocol domain
  current independently maintained Base factory, pool, Swap-event, volume, and fee adapter
```

Ryze Protocol confidence remains `medium` because its current first-party landing copy is limited. Active classification is supported by current deployed Base contracts and tracked Swap events rather than by a broad current public product description.

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

BX10 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
