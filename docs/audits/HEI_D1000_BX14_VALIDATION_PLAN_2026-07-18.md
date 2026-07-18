# HEI D-1000 Batch BX14 Validation Plan

Date: 2026-07-18  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx14-four-active-dex-aggregators`

## 1. Scope

BX14 adds four reviewed active decentralized exchange aggregator or integrated trading-platform entities:

```text
LiquidMesh         hei_ex_000970
fly.trade          hei_ex_000971
Defi App           hei_ex_000972
Nordstern.Finance  hei_ex_000973
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX14 also completes the merged BX13 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX14.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 853
Events:   1004
Evidence: 3465
English dossiers:  853
Japanese dossiers: 853
Sitemap routes:     1730
```

Remaining to D-1000: 147 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases and prior brand identity
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected identity surfaces:

```text
liquidmesh.io
fly.trade
defi.app
nordstern.finance
```

Repository searches, reviewed `data/entities.json`, and direct normal and alternate canonical-path checks found no current-main identity or domain match for the final records.

Fly and Magpie Protocol remain one lifecycle entity. Defi App swap, perpetual, wallet, and yield surfaces remain one entity. LiquidMesh API products remain one LiquidMesh entity. Nordstern chain integrations and API routes remain one Nordstern.Finance entity. Child products, chain deployments, tokens, and metric labels must not become duplicate exchange records.

## 4. Evidence boundary

```text
LiquidMesh:
  current first-party website and API documentation
  current independent DEX aggregator volume metrics

fly.trade:
  current first-party cross-chain and on-chain swap documentation
  current independent DEX aggregator volume metrics and former-brand identity

Defi App:
  current first-party swap and perpetual-trading documentation
  current independent DEX and perpetual aggregator volume metrics

Nordstern.Finance:
  current first-party swap API and routing documentation
  current independent DEX aggregator volume metrics
```

LiquidMesh, fly.trade, and Nordstern.Finance are classified `active` with `high` confidence. Defi App is classified `active` with `medium` confidence because exchange activity is combined with wallet, yield, and broader application functions.

No exact launch date, rebrand date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

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

BX14 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
