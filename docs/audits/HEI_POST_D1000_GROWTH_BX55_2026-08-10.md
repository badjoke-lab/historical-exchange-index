# HEI Post-D-1000 Growth — BX55

Date: 2026-08-10  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX55 adds one complex current-event exchange record rather than padding the batch with thin active-list entries.

Added reviewed entity:

```text
Shelbit  inactive / cex / United Arab Emirates
```

Added evidence: 3  
Added events: 2

Projected reviewed public state after merge:

```text
Entities: 1017
Events:   1031
Evidence: 3820
```

## Why a single-record batch

Shelbit is a high-value historical-registry case with a recent regulator enforcement action, conflicting operational-status evidence, and a later sanctions event. Current record-growth policy allows a single-record PR for a complex case where bundling unrelated thin candidates would reduce review quality.

## Evidence standard

The record uses:

- a first-party July 24, 2026 VARA enforcement notice identifying Shelbit General Trading L.L.C and the Shelbit / Shelbit Exchange trade names, documenting continued unlicensed virtual-asset activity, financial penalties, and an immediate cease-and-desist direction;
- a July 31 Reuters investigation identifying Shelbit as a Dubai-based crypto exchange and documenting the absence of identifiable public trading access at that time;
- an August 7 Reuters report documenting the U.S. sanctions action and Shelbit's statement that it had ceased operations in January 2026.

The record does not rely on anonymous directory listings or monitoring output as canonical evidence.

## Status handling

BX55 uses:

```text
status: inactive
death_reason: null
death_date: null
confidence: medium
```

This is deliberately conservative. Shelbit's own reported statement that operations ceased in January 2026 conflicts with VARA's July finding that the entity had continued providing virtual-asset services in and from Dubai. The available reviewed evidence does not establish a clean permanent shutdown date or a single terminal cause, so BX55 does not classify the entity as dead.

## Lifecycle events

### 2026-07-24 — VARA enforcement

Recorded as `regulatory_action` with `event_status_effect: limited`. The regulator imposed financial penalties and directed Shelbit to cease all unlicensed virtual-asset activity in or from Dubai.

### 2026-08-07 — U.S. sanctions

Recorded as a second `regulatory_action` with `event_status_effect: none`. The event is historically material, but the sanctions action is not used as a synthetic operational shutdown marker.

## URL handling

The historical official domain is preserved as:

```text
shelbit.com
```

Because current safe public trading availability could not be established consistently from the reviewed evidence, `official_url_status` remains `unknown`. The record includes an archive wildcard and does not use the original domain as proof of current activity.

## Scope control

BX55 does not infer:

- an exact launch date from Reuters' approximate May 2024 activity reference;
- a January 2026 death date from Shelbit's later self-reported cessation statement;
- a fraud/scam death reason from enforcement or sanctions allegations;
- a continuing active classification solely from regulator descriptions of transaction activity.

## L-2 relationship

This batch does not change the L-2 localization decision. Canonical growth remains allowed during HOLD. Required Search Console, GA4, indexing, language-switch, and operator-burden evidence remain separate L-2 requirements.

## Next identifiers

```text
Entity:   hei_ex_001138
Event:    hei_ev_010108
Evidence: hei_src_012517
```

## Deployment decision

This PR changes `records/**`, so production output changes after merge. Per the Cloudflare deployment policy, a branch preview is not required for a reviewed record-only addition. Normal GitHub validation must pass before merge, followed by production verification against the deployed `main` commit and machine/public counts.

## Completion condition

BX55 is complete only after normal record validation, overlap and ID checks, country and URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.
