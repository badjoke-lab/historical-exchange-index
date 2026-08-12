# HEI Post-D-1000 Growth — BX60

Date: 2026-08-13  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX60 adds one independently reviewed CryptoPanda record with a conservative hybrid classification and two first-party lifecycle events.

Added reviewed entity candidate:

```text
CryptoPanda  active / hybrid / Global
```

Added events: 2  
Added evidence: 5

Projected reviewed public state after merge:

```text
Entities: 1031
Events:   1034
Evidence: 3854
```

## Discovery source boundary

CryptoPanda entered this review from the cross-site candidate intake tracked in Issue #753. The originating external "non-recommended service" list is discovery-only and is not used as evidence in this record.

Canonical promotion is based on sources reviewed independently from that list.

## Evidence standard

The record separates current service identity, protocol structure, lifecycle events, and secondary service-surface corroboration.

- CryptoPanda's current first-party website establishes a live service offering JPY/crypto conversion, multiple supported crypto assets, and self-custody exchange functionality.
- CryptoPanda's terms identify CryptoPanda Foundation and describe access to an Ethereum-based decentralized CryptoPanda Protocol used by swappers and liquidity providers through smart contracts. The same terms describe the platform as a P2P transaction venue.
- A first-party 2026-04-10 notice records a temporary suspension of the BUY function for system maintenance.
- A first-party 2026-04-16 notice records completion of that maintenance and resumption of the BUY service.
- A separate-domain CryptoPawn explainer is retained as medium-reliability secondary corroboration that CryptoPanda supports direct JPY-to-USDT purchase and conversion back to JPY. It is not used as evidence of licensing, safety, independence, or regulatory status.

## Status handling

CryptoPanda uses:

```text
status: active
death_reason: null
death_date: null
confidence: medium
```

The public service is currently reachable and presents active exchange functionality. The April 2026 BUY interruption was explicitly temporary and followed by a first-party resumption notice, so it does not justify a current `limited`, `inactive`, or `dead` classification.

Confidence remains `medium` because the reviewed material does not independently establish the operator's legal jurisdiction or regulatory authorization.

## Type handling

CryptoPanda uses:

```text
type: hybrid
```

This avoids forcing the service into a pure CEX or pure DEX category. The current public surface offers fiat-to-crypto exchange functionality, while the terms separately describe an Ethereum-based decentralized protocol, smart-contract interaction, swappers/liquidity providers, and a P2P venue.

HEI does not infer from these descriptions that every current transaction uses the same execution path.

## Event handling

BX60 adds:

```text
2026-04-10  service_outage  limited
2026-04-16  reopened        active
```

The first event is scoped narrowly to the BUY function. It does **not** assert that the entire platform was offline.

The second event records restoration of BUY functionality. It does **not** represent a relaunch of the entire CryptoPanda service.

## Identity and scope controls

- `CryptoPanda` is the canonical entity name.
- `クリプトパンダ` and `CryptoPanda Protocol` are retained as aliases for discovery and identity matching.
- Repository searches on the reviewed `main` state found no existing `CryptoPanda`, `cryptopanda.app`, or `cryptopanda.money` record.
- The terms mention `cryptopanda.money` in connection with CryptoPanda; HEI does not create a second entity from that domain mention.
- No launch date is inferred from the terms update date, site copyright range, or later news history.
- The operator's legal jurisdiction is not independently established. HEI uses `Global` rather than inventing a country from the Japanese-facing service.
- First-party statements about security, auditing, travel-rule treatment, partnerships, or regulatory-style characteristics are not promoted into independent HEI conclusions without separate verification.
- The record does not assert that CryptoPanda is licensed or regulated in Japan or any other jurisdiction.

## Identifier allocation

```text
Entity:   hei_ex_001151
Events:   hei_ev_010109 through hei_ev_010110
Evidence: hei_src_012546 through hei_src_012550
```

Exact repository searches before branch creation found these identifiers unused, and there were no open pull requests competing for the allocation.

## Count impact

```text
Before BX60
Entities: 1030
Events:   1032
Evidence: 3849

After BX60
Entities: 1031
Events:   1034
Evidence: 3854
```

## L-2 relationship

This reviewed data-growth candidate does not change the L-2 localization decision. L-2 remains `HOLD / EVIDENCE CAPTURE`, and no additional language is authorized.

## Deployment decision

This PR changes `records/**`, so public output changes after merge. Under the Cloudflare deployment policy, a branch preview is not required for a reviewed record-only addition. GitHub validation must pass before merge.

After merge, production verification must confirm the deployed `main` commit, machine/public count consistency, the CryptoPanda dossier, and the two lifecycle events.

## Completion condition

BX60 is complete only after record validation, overlap/duplicate checks, ID-collision checks, country/origin checks, URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.

Until those gates pass, the branch and PR are review candidates rather than canonical authority.
