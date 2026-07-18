# HEI D-1000 Batch BX16 Validation Plan

Date: 2026-07-18  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx16-four-held-active-dex-records`

## 1. Scope

BX16 promotes four previously held active decentralized exchange candidates:

```text
Avantis         hei_ex_000978
Ostium          hei_ex_000979
Pacifica        hei_ex_000980
Manifest Trade  hei_ex_000981
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX16 also completes the merged BX15 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX16.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 861
Events:   1004
Evidence: 3481
English dossiers:  861
Japanese dossiers: 861
Sitemap routes:     1746
```

Remaining to D-1000: 139 entities.

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
avantisfi.com
ostium.com
pacifica.fi
manifest.trade
```

Repository searches, reviewed `data/entities.json`, and direct normal and alternate canonical-path checks found no current-main identity or domain match for the final four records.

Extended was excluded after direct canonical-path inspection found existing record `hei_ex_000688`.

Avantis trading, vault, rewards, and SDK surfaces remain one entity. Ostium protocol, application, vault, and execution services remain one entity. Pacifica perpetual, spot, account, subaccount, REST API, and websocket surfaces remain one entity. Manifest core order book, application, API, Destiny vault, and open-source program surfaces remain one entity.

Comparative or marketing language that calls Manifest a later generation of Solana order books must not create unsupported predecessor or successor relationships.

## 4. Watchlist resolution validation

The dated resolution override must close all four held candidates:

```text
candidate:avantis          promoted -> hei_ex_000978
candidate:ostium           promoted -> hei_ex_000979
candidate:pacifica-perps   promoted -> hei_ex_000980
candidate:manifest-trade   promoted -> hei_ex_000981
```

The historical base resolution index remains unchanged. Candidate scan and Watchlist resolution must both pass on the projected public entity set.

## 5. Evidence boundary

```text
Avantis:
  current first-party protocol and trading documentation
  current independent perpetual volume, TVL, fee, and open-interest metrics

Ostium:
  current first-party protocol and market documentation
  current independent perpetual volume, TVL, fee, revenue, and open-interest metrics

Pacifica:
  current first-party website, trading documentation, and public API surfaces
  current independent perpetual and spot volume, TVL, and open-interest metrics

Manifest Trade:
  current first-party website, live application, and open-source implementation
  current independent spot DEX volume and TVL metrics
```

All four records are classified `active` with `high` confidence.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

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

BX16 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
