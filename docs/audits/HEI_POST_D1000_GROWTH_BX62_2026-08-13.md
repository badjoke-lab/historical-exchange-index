# HEI Post-D-1000 Growth — BX62

Date: 2026-08-13  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX62 closes the remaining addable HEI candidates from the Aug 12 cross-site intake by adding two independently reviewed records: MSX and IZAKA-YA.

Added reviewed entities:

```text
MSX       active / cex    / Global
IZAKA-YA  active / hybrid / Hong Kong
```

Added events:

```text
2026-06-05  MSX       other        none  X Card launch announcement
2025-05-01  IZAKA-YA  partnership  none  CryptoPanda collaboration campaign
```

Added evidence: 9

Projected reviewed public state after merge:

```text
Entities: 1034
Events:   1037
Evidence: 3867
```

## Candidate-intake boundary

Issue #753 was created from an external service-watchlist item and is discovery-only. The originating list is not canonical evidence.

The HEI review sequence was:

```text
CryptoPanda -> CoinChief -> MSX -> IZAKA-YA
```

CryptoPanda and CoinChief were independently reviewed and merged before BX62. BX62 handles the remaining two addable HEI entities. MEXC and BTCC were already present in HEI and were not duplicated.

## MSX evidence standard

- The current first-party MSX site describes a digital-asset trading platform providing spot and derivatives trading for assets including Bitcoin and Ethereum, alongside RWA token trading.
- First-party MSX API documentation exposes REST/WebSocket spot trading, account/asset queries, market data, and U-margined contract trading interfaces.
- Apple currently distributes an MSX crypto-exchange application whose developer is identified as Mystonks Holding LTD.; HEI uses this only as medium-reliability current-distribution corroboration.
- An MSX-authored paid press release carried by CoinDesk states that MSX launched X Card on 2026-06-05. HEI uses it only to establish MSX's own product-launch announcement.

MSX classification:

```text
type: cex
status: active
country_or_origin: Global
confidence: medium
```

The active classification is supported by current first-party trading and API surfaces plus current app distribution. The CEX classification is based on centralized account/trading interfaces and authenticated API surfaces. The reviewed evidence does not independently establish the operator's legal jurisdiction, so HEI uses `Global`. No launch date is inferred.

The X Card item is recorded only as a non-terminal product event. Promotional licensing, security, network, geographic-availability, reserve and safety claims are not independently promoted into canonical HEI facts.

## IZAKA-YA evidence standard

- The current first-party IZAKA-YA site exposes lending, crypto-to-crypto swap, wallet and crypto-purchase functions.
- The first-party company profile identifies Izakaya Limited and a Hong Kong operating address. It states a December 2023 service-start month, but no exact launch day is established.
- First-party project documentation describes permissionless smart-contract-based lending, swapping and token management.
- Official wallet-support documentation describes account-based cryptocurrency management, lending, swapping, deposits/transfers, balances and transaction history.
- A first-party 2025-05-01 campaign page documents an IZAKA-YA x CryptoPanda collaboration requiring linked registration and a CryptoPanda transaction connected to an IZAKA-YA wallet.

IZAKA-YA classification:

```text
type: hybrid
status: active
country_or_origin: Hong Kong
confidence: medium
```

HEI uses `hybrid` because current service surfaces include account/wallet and service-side transaction functions while first-party project documentation describes permissionless smart-contract/DeFi architecture. `Hong Kong` is supported by the first-party operator profile. The known service-start month is not converted into an invented exact launch date.

IZAKA-YA and CryptoPanda remain separate entities. The documented collaboration is represented as a `partnership` event, not as an alias, merger, acquisition, common-ownership claim, or predecessor/successor relationship.

## Identifier allocation

```text
MSX
Entity:   hei_ex_001153
Event:    hei_ev_010112
Evidence: hei_src_012555 through hei_src_012558

IZAKA-YA
Entity:   hei_ex_001154
Event:    hei_ev_010113
Evidence: hei_src_012559 through hei_src_012563
```

Exact repository searches after BX61 merged found these identifiers unused. Duplicate name/domain searches found no existing MSX or IZAKA-YA record, and there was no competing open PR at allocation time.

## Count impact

```text
Before BX62
Entities: 1032
Events:   1035
Evidence: 3858

After BX62
Entities: 1034
Events:   1037
Evidence: 3867
```

## L-2 relationship

This reviewed data-growth batch does not change the localization decision. L-2 remains `HOLD / EVIDENCE CAPTURE`, and no additional language is authorized.

## Deployment decision

This PR changes `records/**`, so reviewed public output changes after merge. Under the current Cloudflare deployment policy, no branch preview is required for this reviewed record batch. GitHub validation must pass before merge.

## Completion condition

BX62 is complete only after record validation, duplicate/overlap checks, ID-collision checks, country/origin checks, URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.
