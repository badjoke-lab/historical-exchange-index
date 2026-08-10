# HEI Post-D-1000 Growth — BX56

Date: 2026-08-10  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX56 adds four reviewed active decentralized trading entities that were surfaced by monitoring but independently re-reviewed before canonical inclusion.

Added reviewed entities:

```text
MUX Protocol  active / dex / Arbitrum ecosystem
Storm Trade   active / dex / TON ecosystem
Metal X       active / dex / XPR Network ecosystem
Hegic         active / dex / Arbitrum ecosystem
```

Added evidence: 8  
Added events: 0

Projected reviewed public state after merge:

```text
Entities: 1021
Events:   1031
Evidence: 3828
```

## Evidence standard

Each record uses one current first-party source plus one current independent status source.

- MUX Protocol: current MUX documentation plus DefiLlama protocol / perpetual metrics.
- Storm Trade: current Storm Trade documentation plus DefiLlama perpetual metrics.
- Metal X: current Metal X documentation plus DefiLlama MetalX DEX metrics.
- Hegic: current Hegic trading site plus DefiLlama options metrics.

Monitoring output is candidate-discovery input only and is not cited as canonical evidence.

## Status handling

All four records use:

```text
status: active
death_reason: null
death_date: null
```

Current first-party trading surfaces are available and independent metrics report current non-zero activity. No terminal state is inferred.

## Product identity handling

BX56 deliberately avoids product-level duplication:

- MUX perpetual trading protocols and the MUX Perpetual Aggregator remain one MUX Protocol entity.
- Storm Trade web and Telegram interfaces remain one entity.
- Metal X / MetalX DEX and related trading surfaces remain one Metal X entity.
- Hegic call, put, and strategy products remain one Hegic entity.

## Scope controls

BX56 does not infer:

- legal jurisdiction from ecosystem origin;
- regulatory authorization;
- exact launch dates from approximate or month-level source wording;
- MCDEX -> MUX predecessor/successor lineage without a dedicated review;
- separate entities for product labels that share one supported protocol identity.

AnyHedge was reviewed and rejected from this batch because current first-party material describes a derivatives contract protocol that can power exchanges rather than a single exchange venue appropriate for one HEI exchange entity.

The existing pending Aequinox, AjuBit, Aktionariat, and Aldrin decisions remain unchanged.

## L-2 relationship

This batch does not change the L-2 localization decision. Canonical growth remains allowed during HOLD. Required Search Console, GA4, indexing, language-switch, and operator-burden evidence remain separate L-2 requirements.

## Next identifiers

```text
Entity:   hei_ex_001142
Event:    hei_ev_010108
Evidence: hei_src_012525
```

## Deployment decision

This PR changes `records/**`, so production output changes after merge. Per the Cloudflare deployment policy, a branch preview is not required for a reviewed record-only addition. Normal GitHub validation must pass before merge, followed by production verification against the deployed `main` commit and machine/public counts.

## Completion condition

BX56 is complete only after normal record validation, overlap and ID checks, country and URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, merge to `main`, and production verification succeed.
