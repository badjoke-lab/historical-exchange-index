# HEI Post-D-1000 Growth — BX59

Date: 2026-08-11  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX59 adds one independently reviewed centralized exchange record for BitradeX with a deliberately conservative status and event boundary.

Added reviewed entity candidate:

```text
BitradeX  limited / cex / origin unresolved
```

Added event: 1  
Added evidence: 3

Projected reviewed public state after merge:

```text
Entities: 1030
Events:   1032
Evidence: 3847
```

## Evidence standard

The record separates current entity/status evidence from the August incident signal.

- BitradeX first-party public website establishes current exchange identity and a live official domain.
- CoinMarketCap provides an independent current market listing with spot and derivatives data and links to the same official domain.
- A 2026-08-11 Japanese community post is retained as low-reliability event evidence because it summarizes an alleged BitradeX announcement about staged return/release of existing user assets while explicitly warning that detailed rules were not yet available.

HEI has not yet captured the underlying first-party August notice or detailed release rules.

## Status handling

BitradeX uses:

```text
status: limited
death_reason: null
death_date: null
confidence: medium
```

The public site and independent market listing remain live, so `inactive` or `dead` would overstate the available evidence. The August public signal is material enough that `active` would also overstate normal availability. `limited` is therefore the conservative interim classification.

## Event handling

BX59 adds:

```text
event_type: other
event_status_effect: limited
impact_level: high
```

The event is titled `Asset-release restrictions reported during platform changes` and is intentionally framed as a reported restriction, not a confirmed technical or financial root cause.

BX59 does **not** assert:

- a hot-wallet hack;
- insolvency;
- bankruptcy;
- scam/rug classification;
- terminal shutdown;
- that recruiting new users is a confirmed condition for faster asset release;
- that any particular daily release rate is confirmed.

Those claims require the primary August notice or stronger independent evidence before canonical promotion.

## Identity and scope controls

- `BitradeX` is the canonical entity name.
- `Bitrade X` is retained only as a search/identity alias.
- No exact launch date is invented from the year-only secondary description.
- No country/origin is inferred from promotional corporate claims without dedicated jurisdiction review.
- Current public trading surfaces are not treated as proof that all customer assets are freely withdrawable.

## Identifier allocation

```text
Entity:   hei_ex_001150
Event:    hei_ev_010108
Evidence: hei_src_012541 through hei_src_012543
```

Exact repository search before branch creation found these identifiers unused on the reviewed main state.

## Count impact

```text
Before BX59
Entities: 1029
Events:   1031
Evidence: 3844

After BX59
Entities: 1030
Events:   1032
Evidence: 3847
```

## L-2 relationship

This reviewed data-growth candidate does not change the L-2 localization decision. L-2 remains `HOLD / EVIDENCE CAPTURE`, and no additional language is authorized.

## Deployment decision

This PR changes `records/**`, so public output changes after merge. Under the Cloudflare deployment policy, a branch preview is not required for a reviewed record-only addition. GitHub validation must pass before merge. After merge, production verification must confirm the deployed `main` commit and machine/public count consistency.

## Completion condition

BX59 is complete only after record validation, overlap/duplicate checks, ID-collision checks, country/origin checks, URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.

If the underlying BitradeX August notice or detailed release rules become available before merge, the event and evidence should be strengthened in this PR rather than converting an unverified interpretation into a stronger canonical claim.
