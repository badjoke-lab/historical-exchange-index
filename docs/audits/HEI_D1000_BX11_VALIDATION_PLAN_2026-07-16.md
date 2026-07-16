# HEI D-1000 Batch BX11 Validation Plan

Date: 2026-07-16  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx11-four-active-dex-records`

## 1. Scope

BX11 adds four reviewed active decentralized exchange or on-chain trading entities:

```text
Deriverse    hei_ex_000958
Rabbit Swap  hei_ex_000959
Alt Fun       hei_ex_000960
Hyperlynx     hei_ex_000961
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX11 also completes the merged BX10 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX11.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 841
Events:   1004
Evidence: 3441
English dossiers:  841
Japanese dossiers: 841
Sitemap routes:     1706
```

Remaining to D-1000: 159 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases
official domain or first-party identity surface
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected identity surfaces:

```text
deriverse.io
rabbitswap.xyz
alt.fun
github.com/HyperlynxFi
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity match for the final records.

dreamDEX was excluded after direct canonical-path inspection found existing record `hei_ex_000942`. Temple Lightspeed was excluded after the alternate path `records/exchanges/temple-lightspeed.json` found existing record `hei_ex_000945`. These findings confirm that direct path reads remain mandatory even when repository search returns no match.

Ocelex was excluded from this active-growth batch because current tracked exchange activity was negligible despite a remaining protocol footprint. Bond remained held because a distinct first-party web or implementation surface was not confirmed beyond its social identity and independent protocol profile.

## 4. Evidence boundary

```text
Deriverse:
  current first-party Solana mainnet product website
  current first-party mainnet volume API

Rabbit Swap:
  current first-party exchange website
  current official RabbitDEX GitHub organization

Alt Fun:
  current first-party Hyperliquid launch-and-trade website
  current independently maintained Buy/Sell contract adapter

Hyperlynx:
  current official HyperlynxFi GitHub organization
  current independently maintained Hyperlynx V3 volume profile
```

Alt Fun confidence remains `medium` because it combines launchpad and trading functions. Hyperlynx confidence remains `medium` because a distinct first-party web domain was not confirmed and the official GitHub organization is used as the identity surface.

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

BX11 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
