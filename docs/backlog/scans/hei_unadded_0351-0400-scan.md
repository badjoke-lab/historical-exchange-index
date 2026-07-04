# Scan: verified-unadded rows 0351-0400

Status: closed / all add-now and research rows resolved

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

## Promoted add-now rows

- `0352` ChainEX -> `hei_ex_000627`
- `0353` Chainflip -> `hei_ex_000628`
- `0361` Changelly PRO -> `hei_ex_000629`
- `0368` Choice -> `hei_ex_000630`
- `0369` Chronos -> `hei_ex_000631`
- `0373` ClaimSwap -> `hei_ex_000632`
- `0378` Clipper -> `hei_ex_000633`
- `0382` CobaltX -> `hei_ex_000634`

## Promoted research rows

- `0355` Chainge Finance -> `hei_ex_000635`
- `0359` ChampagneSwap -> `hei_ex_000636`
- `0364` Cherryswap -> `hei_ex_000637`
- `0367` ChimpX AI DEX -> `hei_ex_000638`
- `0372` CITEX -> `hei_ex_000640`
- `0375` Cleo -> parent Cleopatra `hei_ex_000641`
- `0379` Clober V1 identity review -> parent Clober `hei_ex_000639`
- `0399` CoinCasso -> `hei_ex_000642`

## Remaining needs-research queue

None.

## Pending thin

- `0351` Chaince
- `0356` ChainRift
- `0357` ChainX
- `0358` Chamber Ex
- `0362` ChaoEX
- `0365` ChileBit
- `0381` Clutch Anvil AMM
- `0383` CODEX
- `0384` CODEX Exchange
- `0385` Coin Galaxy
- `0386` Coin Republic
- `0387` Coin163
- `0388` Coinall
- `0389` CoinAmount
- `0395` Coinbe
- `0396` COINBIG
- `0397` Coinbit
- `0398` Coinbuy cash
- `0400` CoinCex

These rows remain non-canonical because reviewed evidence is too thin, lifecycle status is unresolved, or identity collisions could not be safely resolved.

## Out of scope or duplicate rows

- `0354` Chainflip AMM — protocol surface under `hei_ex_000628`
- `0360` Changelly PRO — duplicate source row consumed under `hei_ex_000629`
- `0363` Chapool — source category is Physical TCG, outside HEI exchange scope
- `0366` Chiliz — blockchain and fan-token ecosystem rather than a distinct exchange entity in this review
- `0370` Chronos V1 — version row under `hei_ex_000631`
- `0371` Chronos V2 — version row under `hei_ex_000631`
- `0374` ClaimSwap V1 — version row under `hei_ex_000632`
- `0376` Cleopatra CL — product/version row consumed under `hei_ex_000641`
- `0377` Cleopatra Legacy — product/version row consumed under `hei_ex_000641`
- `0380` Clober V2 — version row consumed under `hei_ex_000639`
- `0390` Coinbase — existing `hei_ex_000012` Coinbase Exchange parent
- `0391` Coinbase International Exchange — product/regional surface under existing Coinbase parent
- `0392` coinbaseadvanced — product/API row under existing Coinbase parent
- `0393` coinbaseexchange — duplicate connector row for existing Coinbase Exchange
- `0394` coinbaseinternational — duplicate connector row for Coinbase International surface

## Current range position

```text
range records:                 50
promoted add_now:               8
promoted research:              8
unresolved add_now:             0
unresolved needs_research:      0
pending_thin:                  19
out_of_scope_or_duplicate:     15
range status:                  closed
```

## Next step

Scan and process verified-unadded range 0401-0450, then continue reviewed growth until at least 550 entities.
