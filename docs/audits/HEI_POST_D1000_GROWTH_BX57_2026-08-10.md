# HEI Post-D-1000 Growth — BX57

Date: 2026-08-10  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX57 adds four independently reviewed decentralized trading entities surfaced through monitoring and re-reviewed before canonical inclusion.

Added reviewed entities:

```text
Perpl         active  / dex / Monad ecosystem
Deri Protocol active  / dex / Multi-chain EVM ecosystem
AwakenSwap    active  / dex / aelf ecosystem
WX Network    limited / dex / Waves ecosystem
```

Added evidence: 8  
Added events: 0

Projected reviewed public state after merge:

```text
Entities: 1025
Events:   1031
Evidence: 3836
```

## Evidence standard

Each record uses current first-party exchange/trading evidence plus an independent current status source.

- Perpl: first-party exchange site plus DefiLlama current perpetual metrics.
- Deri Protocol: first-party trading site plus DefiLlama current protocol metrics.
- AwakenSwap: first-party DEX site plus DefiLlama current AMM metrics.
- WX Network: first-party DEX protocol documentation plus CoinGecko current exchange listing.

Monitoring output remains candidate-discovery input only.

## Status handling

Perpl, Deri Protocol, and AwakenSwap use:

```text
status: active
death_reason: null
death_date: null
```

WX Network uses:

```text
status: limited
death_reason: null
death_date: null
```

Current WX first-party materials still expose exchange functionality, but current independent market observations are weak and inconsistent enough that `active` would overstate present use.

## Identity handling

BX57 deliberately avoids identity inflation:

- Deri Protocol versions remain one entity.
- AwakenSwap and Awaken Finance naming remain one exchange identity.
- Waves DEX, Waves.Exchange, Waves Exchange, and WX Network are normalized under the current WX Network entity for this batch.
- Historical name transitions are not converted into precise events without dedicated lineage review.

Deri Protocol is distinct from the existing Derive exchange record.

## Scope controls

BX57 does not infer:

- exact launch dates from incomplete current source wording;
- legal jurisdiction from ecosystem origin;
- regulatory authorization;
- separate entities for Deri versions;
- exact WX Network rebrand dates;
- strong active-use status from site availability alone.

## L-2 relationship

This batch does not change the L-2 localization decision. Canonical growth remains allowed during HOLD. Required Search Console, GA4, indexing, language-switch, and operator-burden evidence remain separate L-2 requirements.

## Next identifiers

```text
Entity:   hei_ex_001146
Event:    hei_ev_010108
Evidence: hei_src_012533
```

## Deployment decision

This PR changes `records/**`, so production output changes after merge. Per the Cloudflare deployment policy, a branch preview is not required for a reviewed record-only addition. Normal GitHub validation must pass before merge, followed by production verification against the deployed `main` commit and machine/public counts.

## Completion condition

BX57 is complete only after normal record validation, overlap and ID checks, country and URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.
