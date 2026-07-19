# HEI D-1000 Batch BX19 Validation Plan

Date: 2026-07-19  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx19-four-held-active-exchange-records`

## 1. Scope

BX19 promotes four previously held exchange candidates:

```text
BULK       hei_ex_000990 limited
Rysk V12   hei_ex_000991 active
AFX        hei_ex_000992 active
Antarctic  hei_ex_000993 active
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX19 also completes the merged BX18 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX19.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 873
Events:   1004
Evidence: 3505
English dossiers:  873
Japanese dossiers: 873
Sitemap routes:     1770
```

Remaining to D-1000: 127 entities.

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
bulk.trade
app.rysk.finance
app.afx.xyz
antarctic.exchange
```

The initial BX19 head proposed ApeX Omni as `hei_ex_000990`. Records validation correctly rejected it because `records/exchanges/apex-protocol.json` already models ApeX Protocol, ApeX Pro, and ApeX Omni as canonical entity `hei_ex_000537` on `apex.exchange`. The duplicate record was removed and the ID slot was reassigned to BULK.

Byte Exchange was also excluded after direct canonical inspection found existing entity `hei_ex_000416`.

Repository searches, reviewed `data/entities.json`, and direct normal and alternate canonical-path checks found no current-main identity or domain match for BULK, Rysk V12, AFX, or Antarctic.

BULK, BULK Exchange, the execution layer, vault, testnet, and pre-deposit surfaces remain one entity. Rysk, Rysk Finance, and Rysk V12 remain one current options-exchange entity. AFX chain, application, explorer, vault, and exchange surfaces remain one entity. Antarctic, Antarctic Exchange, AX, AMLP, AHLP, and supported-chain account surfaces remain one hybrid exchange entity.

## 4. Watchlist resolution validation

The dated resolution override must close all four held candidates:

```text
candidate:bulk      promoted -> hei_ex_000990
candidate:rysk-v12  promoted -> hei_ex_000991
candidate:afx       promoted -> hei_ex_000992
candidate:antarctic promoted -> hei_ex_000993
```

The historical base resolution index remains unchanged. Candidate scan and Watchlist resolution must both pass on the projected public entity set.

## 5. Evidence and status boundary

```text
BULK:
  current first-party exchange architecture, testnet, and staged-access documentation
  current independent Season 1 pre-deposit TVL
  limited because pre-deposits do not establish broadly available live mainnet trading

Rysk V12:
  current first-party live HyperEVM RFQ options documentation
  current independent options premium and notional volume metrics

AFX:
  current first-party sovereign on-chain trading platform
  current independent perpetual volume, TVL, fee, revenue, open-interest, and user metrics

Antarctic:
  current first-party perpetual exchange documentation and mainnet surface
  current independent perpetual volume, TVL, fee, revenue, and open-interest metrics
```

BULK is classified `limited` with `high` confidence. Rysk V12, AFX, and Antarctic are classified `active` with `high` confidence.

Antarctic is classified `hybrid` because current first-party material describes off-chain order matching with on-chain settlement. The other three are classified `dex`.

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

BX19 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
