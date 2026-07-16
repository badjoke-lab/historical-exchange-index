# HEI D-1000 Batch BX4 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx4-four-active-dex-records`

## 1. Scope

BX4 adds four reviewed active DEX entities:

```text
Shadow Exchange hei_ex_000930
Kittenswap      hei_ex_000931
Metropolis      hei_ex_000932
Momentum        hei_ex_000933
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX4 also repairs the stale post-merge BX3 checkpoint and advances the maintainer recovery reference.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 813
Events:   1004
Evidence: 3385
English dossiers:  813
Japanese dossiers: 813
Sitemap routes:     1650
```

Remaining to D-1000: 187 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
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
shadow.so
kittenswap.finance
metropolis.exchange
mmt.finance
```

Repository searches found no current-main name/domain matches for the final records. Direct canonical-path checks were also used because repository search indexing did not surface existing candidates during research.

Blackhole and Kodiak were excluded after direct canonical-path reads confirmed existing reviewed records `hei_ex_000399` and `hei_ex_000918`.

Equalizer was removed after the first Records validation run detected the existing reviewed record `hei_ex_000684`. Kittenswap replaced it rather than bypassing the overlap gate.

## 4. Evidence boundary

Each final record uses two current first-party sources.

```text
Shadow Exchange:
  official Sonic exchange documentation
  current deployed contract registry

Kittenswap:
  official HyperEVM DEX introduction
  current active deployed contract registry

Metropolis:
  official Sonic DLMM DEX documentation
  current Sonic mainnet smart contracts

Momentum:
  official Sui DEX whitepaper and product documentation
  current official platform and application links
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
CI
```

Merge only after all 20 workflows complete successfully.

## 6. Localization boundary

L-2 remains `HOLD`.

BX4 adds reviewed canonical records and matching English/Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
