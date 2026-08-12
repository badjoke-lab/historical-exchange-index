# HEI Post-D-1000 Growth — BX62

Date: 2026-08-13  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX62 adds one independently reviewed MSX record and one non-terminal product event.

Added reviewed entity:

```text
MSX  active / cex / Global
```

Added event:

```text
2026-06-05  other  none  X Card launch announcement
```

Added evidence: 4

Projected reviewed public state after merge:

```text
Entities: 1033
Events:   1036
Evidence: 3862
```

## Evidence standard

- The current first-party MSX site describes a digital-asset trading platform providing spot and derivatives trading for assets including Bitcoin and Ethereum, alongside RWA token trading.
- First-party MSX API documentation exposes REST/WebSocket spot trading, account/asset queries, market data, and U-margined contract trading interfaces.
- Apple currently distributes an MSX crypto-exchange application whose developer is identified as Mystonks Holding LTD.; HEI uses this only as medium-reliability current-distribution corroboration.
- An MSX-authored paid press release carried by CoinDesk states that MSX launched X Card on 2026-06-05. HEI uses it only to establish MSX's own product-launch announcement.

## Status and type

```text
type: cex
status: active
country_or_origin: Global
confidence: medium
```

The active classification is supported by current first-party trading and API surfaces plus current app distribution.

The CEX classification is based on centralized account/trading interfaces and authenticated API surfaces. MSX's community-driven and on-chain marketing language does not by itself make the exchange a DEX.

The footer identifies Mystonks Holding LTD., but the reviewed evidence does not independently establish the operator's legal jurisdiction. HEI therefore uses `Global` and does not infer a country.

No launch date is inferred.

## X Card event boundary

The X Card item is recorded as a product event only:

```text
2026-06-05  other  none
```

It does not alter MSX's active exchange status.

The issuer-authored release contains broader operational and promotional assertions. HEI does not independently promote those assertions into canonical licensing, security, geographic-availability, network, reserve, or safety facts.

## Identifier allocation

```text
Entity:   hei_ex_001153
Event:    hei_ev_010112
Evidence: hei_src_012555 through hei_src_012558
```

Exact repository searches after BX61 merged found these identifiers unused, and no open PR competed for the allocation.

## Count impact

```text
Before BX62
Entities: 1032
Events:   1035
Evidence: 3858

After BX62
Entities: 1033
Events:   1036
Evidence: 3862
```

## L-2 relationship

This reviewed data-growth batch does not change the localization decision. L-2 remains `HOLD / EVIDENCE CAPTURE`, and no additional language is authorized.

## Deployment decision

This PR changes `records/**`, so reviewed public output changes after merge. Under the current Cloudflare deployment policy, no branch preview is required for this record-only addition. GitHub validation must pass before merge.

## Completion condition

BX62 is complete only after record validation, duplicate/overlap checks, ID-collision checks, country/origin checks, URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.
