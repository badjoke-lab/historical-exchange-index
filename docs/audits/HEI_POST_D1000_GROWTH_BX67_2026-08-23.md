# HEI post-D-1000 growth audit — BX67 Hanbitco

Date: 2026-08-23

## Scope

BX67 adds one historical South Korean exchange record after revisiting a candidate previously deferred for insufficient terminal-state evidence.

## Canonical decision

- Hanbitco / 한빗코 -> `hei_ex_001163`
- type: `cex`
- origin: South Korea
- status: `dead`
- death reason: `voluntary_shutdown`
- launch: year-level 2018 marker normalized to `2018-01-01`
- terminal exchange date: `2024-05-16`, the reviewed trading-support end date

## Evidence review

Reviewed evidence now resolves the prior uncertainty:

1. Hanbitco's official company social profile says the company was founded in 2017 and that the exchange launched in 2018, and identifies `hanbitco.com` as the historical website.
2. The Republic of Korea Financial Services Commission lists Hanbitco among exchanges that formally announced business closure and places the closure in May 2024.
3. Bithumb's 2024-05-09 notice identifies Hanbitco's exchange-service termination as the reason for stopping high-value transfers to the exchange.
4. Flybit's contemporaneous notice reproduces the Hanbitco shutdown schedule: new registrations and deposits ended 2024-05-09, trading support ended 2024-05-16, and withdrawal support continued through 2024-07-16.

The post-trading withdrawal period is treated as orderly asset-return run-off, not continued exchange operation.

## Identity boundary

A separate current platform at `hanbitco.io` describes itself as a Europe-founded exchange launched in 2022. No reviewed evidence establishes continuity, acquisition, rebrand, or migration from the South Korean Hanbitco. BX67 therefore does not merge the identities and does not create a lineage edge.

## Canonical delta

- entities: +1
- events: +2
- evidence: +4

Allocated IDs:

- `hei_ex_001163`
- `hei_ev_010137`-`hei_ev_010138`
- `hei_src_012609`-`hei_src_012612`

## Boundaries

BX67 changes reviewed canonical data only. It does not change Cloudflare configuration, monitoring publication behavior, localization breadth, L-2 HOLD, schema contracts, or Ledger Series Phase 9 implementation.
