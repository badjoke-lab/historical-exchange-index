# HEI Post-D-1000 Growth — BX61

Date: 2026-08-13  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX61 adds one independently reviewed CoinChief record with a conservative active CEX classification and one non-terminal strategic-cooperation event.

Added reviewed entity candidate:

```text
CoinChief  active / cex / Global
```

Added events: 1  
Added evidence: 4

Projected reviewed public state after merge:

```text
Entities: 1032
Events:   1035
Evidence: 3858
```

## Discovery source boundary

CoinChief entered this review from the cross-site candidate intake tracked in Issue #753. The originating external service-watchlist post and supporter/referral material are discovery-only and are not used as evidence in this record.

Canonical promotion is based on independently reviewed first-party, database-reference, and issuer-press-release evidence.

## Evidence standard

- The current first-party CoinChief site exposes Spot, USDⓈ-M Futures, Copy Trading, Earn, and Spot/P2P/Futures account and order surfaces, alongside live spot-market entries.
- The first-party OpenAPI documentation exposes Spot, Margin and Contract/Futures trading plus account, withdrawal, order, market-data and WebSocket interfaces.
- CoinMarketCap currently maintains a CoinChief exchange page linked to `coinchief.live` and identifies Spot, Perpetual and Futures market categories. HEI uses this only as a medium-reliability database reference and does not adopt exchange-supplied claims about founding date, licenses, reserves, security, reach, or jurisdiction without separate verification.
- A GMTech-authored 2026-05-11 press release distributed via ACCESS Newswire and carried by Nasdaq states that GMTech intended to make a strategic investment in Coin Chief Tech INC. and had entered preliminary strategic-cooperation discussions. The same release explicitly states that no definitive agreement had been finalized.

## Status handling

CoinChief uses:

```text
status: active
death_reason: null
death_date: null
confidence: medium
```

Current first-party surfaces and a current external exchange database support an active classification.

Confidence remains `medium` because the reviewed evidence does not independently establish the operator's exact legal jurisdiction, an exact launch date, or the regulatory claims appearing in external profile copy.

## Type handling

CoinChief uses:

```text
type: cex
```

The reviewed first-party site presents centralized account, wallet, order, spot, P2P and futures surfaces, and the API documentation exposes authenticated account/trading endpoints. HEI therefore uses CEX rather than DEX or hybrid.

## Event handling

BX61 adds:

```text
2026-05-11  other  none
```

The event records GMTech's proposed strategic investment and cooperation discussions.

It is deliberately **not** modeled as:

```text
acquired
merged
rebranded
ownership transfer
completed investment
successor relationship
```

The source explicitly says the discussions were preliminary and that no definitive agreement had been finalized.

## Identity and scope controls

- `CoinChief` is the canonical exchange name.
- `Coin Chief`, `Coin Chief Tech INC.`, and `C网` are retained as identity/discovery aliases.
- Repository search on reviewed `main` found no existing CoinChief record before branch creation.
- No launch date is taken from CoinMarketCap profile copy because it was not independently verified.
- The operator's legal jurisdiction is not independently established. HEI uses `Global` rather than inferring a country from third-party compliance claims.
- CoinMarketCap statements concerning U.S./Canada MSB status, reserves, security, 100+ country reach, and founding year are not promoted into HEI canonical facts by this batch.
- The current first-party footer identifies Coin Chief Tech INC.; this does not by itself establish a jurisdiction.
- Supporter/promotional descriptions connecting CoinChief with 9D Assets or StaX are excluded from canonical lineage/ownership claims here. Those relationships remain separate cross-site research items.

## Identifier allocation

```text
Entity:   hei_ex_001152
Event:    hei_ev_010111
Evidence: hei_src_012551 through hei_src_012554
```

Exact repository searches after BX60 merged found these identifiers unused, and there were no open pull requests competing for the allocation.

## Count impact

```text
Before BX61
Entities: 1031
Events:   1034
Evidence: 3854

After BX61
Entities: 1032
Events:   1035
Evidence: 3858
```

## L-2 relationship

This reviewed data-growth candidate does not change the L-2 localization decision. L-2 remains `HOLD / EVIDENCE CAPTURE`, and no additional language is authorized.

## Deployment decision

This PR changes `records/**`, so public output changes after merge. Under the Cloudflare deployment policy, a branch preview is not required for a reviewed record-only addition. GitHub validation must pass before merge.

After merge, production verification must confirm the deployed `main` commit, machine/public count consistency, the CoinChief dossier, and the preliminary 2026-05-11 event.

## Completion condition

BX61 is complete only after record validation, duplicate/overlap checks, ID-collision checks, country/origin checks, URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.

Until those gates pass, the branch and PR are review candidates rather than canonical authority.
