# Scan: verified-unadded rows 0351-0400

Status: reviewed initial scan / implementation not started

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0351-0400-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-05`

## Initial classification summary

| class | count |
|---|---:|
| add_now | 8 |
| needs_research | 17 |
| pending_thin | 11 |
| out_of_scope_or_duplicate | 14 |

## Add-now queue

- `0352` ChainEX
- `0353` Chainflip
- `0361` Changelly PRO
- `0368` Choice
- `0369` Chronos
- `0373` ClaimSwap
- `0378` Clipper
- `0382` CobaltX

## Needs-research queue

- `0351` Chaince
- `0355` Chainge Finance
- `0359` ChampagneSwap
- `0364` Cherryswap
- `0365` ChileBit
- `0366` Chiliz
- `0367` ChimpX AI DEX
- `0372` CITEX
- `0375` Cleo
- `0379` Clober V1 identity review
- `0381` Clutch Anvil AMM
- `0383` CODEX
- `0384` CODEX Exchange
- `0395` Coinbe
- `0397` Coinbit
- `0399` CoinCasso
- `0400` CoinCex

## Pending thin

- `0356` ChainRift
- `0357` ChainX
- `0358` Chamber Ex
- `0362` ChaoEX
- `0385` Coin Galaxy
- `0386` Coin Republic
- `0387` Coin163
- `0388` Coinall
- `0389` CoinAmount
- `0396` COINBIG
- `0398` Coinbuy cash

## Out of scope or duplicate rows

- `0354` Chainflip AMM — protocol surface under parent Chainflip candidate `0353`
- `0360` Changelly PRO — duplicate source row for `0361`
- `0363` Chapool — source category is Physical TCG, outside HEI exchange scope
- `0370` Chronos V1 — version row under parent Chronos `0369`
- `0371` Chronos V2 — version row under parent Chronos `0369`
- `0374` ClaimSwap V1 — version row under parent ClaimSwap `0373`
- `0376` Cleopatra CL — product/version row under parent identity review `0375`
- `0377` Cleopatra Legacy — product/version row under parent identity review `0375`
- `0380` Clober V2 — version row held under the Clober parent identity review at `0379`
- `0390` Coinbase — existing `hei_ex_000012` Coinbase Exchange parent
- `0391` Coinbase International Exchange — product/regional surface under existing Coinbase parent
- `0392` coinbaseadvanced — product/API row under existing Coinbase parent
- `0393` coinbaseexchange — duplicate connector row for existing Coinbase Exchange
- `0394` coinbaseinternational — duplicate connector row for Coinbase International surface

## Current range position

```text
range records:                 50
promoted add_now:               0
promoted research:              0
unresolved add_now:             8
unresolved needs_research:     17
pending_thin:                  11
out_of_scope_or_duplicate:     14
range status:                  open
```

## Next step

Promote the eight add-now parent entities in reviewed batches, then process the seventeen research rows in evidence-backed clusters.
