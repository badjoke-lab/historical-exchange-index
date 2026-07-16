# HEI Unadded Candidate Batch — D-1000 BX11

Date: 2026-07-16  
Status: consumed by reviewed batch

## Added

```text
Deriverse    hei_ex_000958 active
Rabbit Swap  hei_ex_000959 active
Alt Fun       hei_ex_000960 active
Hyperlynx     hei_ex_000961 active
```

## Evidence boundary

Deriverse uses its current first-party Solana mainnet product website and production volume API.

Rabbit Swap uses its current first-party exchange website and official RabbitDEX GitHub organization.

Alt Fun uses its current first-party product surface and current independently maintained Buy and Sell contract tracking. Its confidence remains `medium` because the product combines launchpad and trading behavior.

Hyperlynx uses its current official implementation organization and current independently maintained V3 trading profile. Its confidence remains `medium` because a distinct first-party web domain was not confirmed.

## Excluded or held during review

- dreamDEX — existing reviewed record `hei_ex_000942` found by direct canonical-path inspection.
- Temple Lightspeed — existing reviewed record `hei_ex_000945` found at an alternate canonical path.
- Ocelex — current tracked exchange activity too weak for this active-growth batch.
- Bond — held because a distinct first-party product or implementation surface was not confirmed.

## Overlap controls

Normal, alternate, and legacy nested canonical paths were checked before drafting. Repository-wide name and identity searches were also run, but direct path reads remain authoritative because search indexing previously missed existing reviewed records.

## Canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 841
Events:   1004
Evidence: 3441
```
