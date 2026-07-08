# Range 0551-0600 D-750 Batch C1

Reviewed at: 2026-07-08

## Results

- `0554` Demex / `0555` Demex AMM -> `hei_ex_000678`, active DEX
- `0556` derive -> `hei_ex_000679`, active hybrid
- `0562` Dexalot / `0563` Dexalot DEX -> `hei_ex_000680`, active DEX

## Consolidation and classification

- Demex and Demex AMM are modeled as one Demex entity.
- Derive is classified as hybrid because first-party documentation describes a centralized limit order book combined with self-custodial, trustless settlement through Derive Protocol and Derive Chain.
- Dexalot and the separate DEX registry representation are modeled as one entity.

## Decision notes

Demex is promoted from official documentation describing a decentralized L1 trading venue with fully on-chain spot, perpetual, and futures order books plus AMM-backed liquidity. Derive is promoted from current first-party documentation and website evidence describing options, perpetuals, and spot trading, together with the Exchange/Protocol/Chain settlement architecture. Dexalot is promoted from current first-party documentation and exchange application evidence covering order-book trading, APIs, smart contracts, liquidity programs, and omnichain exchange infrastructure.

DODO remains outside this batch because the official top-level page returned a service-unavailability notice during review. No active classification is made until current operational state is investigated separately.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- product/source rows consolidated: 2
- projected entity count: 564
- projected event count: 1004
- projected evidence count: 2661
- remaining to D-750 after projected merge: 186

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
