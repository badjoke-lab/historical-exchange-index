# HEI D-1000 Batch BX7 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx7-four-active-dex-records`

## 1. Scope

BX7 adds four reviewed active decentralized exchange or protocol-native AMM entities:

```text
dreamDEX          hei_ex_000942
Pool Party        hei_ex_000943
Tempo Fee AMM     hei_ex_000944
Temple Lightspeed hei_ex_000945
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX7 also completes the merged BX6 checkpoint and advances the maintainer recovery reference and L-2 parallel-growth count text.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 825
Events:   1004
Evidence: 3409
English dossiers:  825
Japanese dossiers: 825
Sitemap routes:     1674
```

Remaining to D-1000: 175 entities.

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
dreamdex.io
cantonwallet.com
tempo.xyz
templedigitalgroup.com
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

The records intentionally distinguish protocol-native exchange surfaces from unrelated similarly named products. Records validation, Candidate scan, and Watchlist resolution remain authoritative.

## 4. Evidence boundary

Each final record uses two current first-party sources.

```text
dreamDEX:
  current official protocol documentation
  current Somnia organization mainnet bot kit and API configuration

Pool Party:
  current Canton Wallet pools interface
  current Send Foundation mainnet volume and fee API

Tempo Fee AMM:
  current official Fee AMM specification
  current official Tempo precompile implementation

Temple Lightspeed:
  current Temple Digital Group organization domain
  current public production exchange ticker API
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

BX7 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
