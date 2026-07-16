# HEI D-1000 Batch BX5 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx5-four-active-dex-records`

## 1. Scope

BX5 adds four reviewed active DEX entities:

```text
Project X hei_ex_000934
Haiko     hei_ex_000935
nest      hei_ex_000936
Valantis  hei_ex_000937
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX5 also repairs the stale post-merge BX4 checkpoint and advances the maintainer recovery reference and L-2 parallel-growth count text.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 817
Events:   1004
Evidence: 3393
English dossiers:  817
Japanese dossiers: 817
Sitemap routes:     1658
```

Remaining to D-1000: 183 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
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
prjx.com
haiko.xyz
usenest.xyz
valantis.xyz
```

Repository searches and direct normal and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

HyperSwap and Hybra Finance were excluded after direct canonical-path reads confirmed existing reviewed records `hei_ex_000762` and `hei_ex_000729`. No duplicate proposal was retained.

## 4. Evidence boundary

Each final record uses two current first-party sources.

```text
Project X:
  current swap interface
  current liquidity interface

Haiko:
  official mainnet AMM documentation
  current public application

nest:
  official unified-AMM documentation
  current deployed-contract registry

Valantis:
  official LST-specific DEX documentation
  current STEX AMM source repository
```

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

## 6. Localization boundary

L-2 remains `HOLD`.

BX5 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
