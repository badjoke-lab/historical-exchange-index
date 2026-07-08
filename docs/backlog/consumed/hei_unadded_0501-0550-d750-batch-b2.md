# Range 0501-0550 D-750 Batch B2

Reviewed at: 2026-07-08

## Results

- `0533` DeFi Kingdoms -> `hei_ex_000675`, active DEX
- `0542` DefiTuna / `0543` DefiTuna AMM -> `hei_ex_000676`, active DEX
- `0540` DefiPlaza / `0541` DefiPlaza (Radix) -> `hei_ex_000677`, active DEX

## Consolidation handling

- DeFi Kingdoms and the Crystalvale discovery representation are modeled as one entity; official documentation describes current DEX operation across DeFi Kingdoms realms.
- DefiTuna and DefiTuna AMM are modeled as one entity; the AMM row is a product/source representation, not a second canonical entity.
- DefiPlaza and DefiPlaza Radix are modeled as one entity across Ethereum and Radix implementations.

## Decision notes

DeFi Kingdoms is promoted from its official whitepaper and dedicated decentralized-exchange documentation describing current DEXs, token swaps, and liquidity pools. DefiTuna is promoted from official documentation describing a Spot Market, maker/taker orders, liquidity pools, leveraged spot positions, and a Solana AMM/DEX experience. DefiPlaza is promoted from official documentation describing AMM trading and DEX designs on Ethereum and Radix, plus a live first-party liquidity application.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- deployment/product rows consolidated: 3
- projected entity count: 561
- projected event count: 1004
- projected evidence count: 2652
- remaining to D-750 after projected merge: 189

No Cloudflare configuration changes are included. The record additions are reviewed public-data changes and must pass overlap, duplicate, ID-collision, entity-quality, projected-enum, country/origin, count-semantics, machine-readable, URL-safety, and public-output validation gates before merge.
