# HEI D-1000 Batch BX6 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx6-four-active-dex-records`

## 1. Scope

BX6 adds four reviewed active decentralized exchange or swap-aggregator entities:

```text
Ooga Booga       hei_ex_000938
Honeypot Finance hei_ex_000939
Reactor DEX      hei_ex_000940
Doma DEX         hei_ex_000941
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX6 also completes the merged BX5 checkpoint and advances the maintainer recovery reference and L-2 parallel-growth count text.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 821
Events:   1004
Evidence: 3401
English dossiers:  821
Japanese dossiers: 821
Sitemap routes:     1666
```

Remaining to D-1000: 179 entities.

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
oogabooga.io
honeypotfinance.xyz
reactor.exchange
app.doma.xyz
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

Investigated exclusions included existing Bulla Exchange `hei_ex_000412`, BurrBear `hei_ex_000608`, BEX `hei_ex_000377`, Kuru `hei_ex_000917`, Bean Exchange `hei_ex_000559`, Capricorn `hei_ex_000611`, and the existing Kaia DragonSwap identity `hei_ex_000681`. The different Sei project using the same DragonSwap name was not drafted because the normalized-name collision requires separate identity work rather than a growth-batch shortcut.

## 4. Evidence boundary

Each final record uses two current first-party sources.

```text
Ooga Booga:
  current multi-chain router deployments
  current Swap API and execution documentation

Honeypot Finance:
  current official trading and liquidity platform
  current concentrated-liquidity DEX documentation

Reactor DEX:
  current official exchange domain
  current public Reactor-Fuel DEX implementation repository

Doma DEX:
  current official swap application
  current official Doma Protocol documentation
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

BX6 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
