# D-750 Batch AE1 — DeFiChain DEX

Reviewed at: 2026-07-09

## Results

- `0538` DeFiChain DEX -> `hei_ex_000735`, active DEX
- `0539` DeFiChain DEX / defichain source row -> consolidated under `hei_ex_000735`

## Consolidation and classification

- The DeFiChain DEX and `defichain` discovery rows are modeled as one exchange entity.
- Wallet applications, chain RPC surfaces, pool pairs, and pool-swap implementation components are not separate HEI entities.
- Confidence is `medium` because the selected public wallet documentation is older and the current operational classification is additionally corroborated by the June 2026 DEX candidate source.

## Decision notes

DeFiChain DEX is promoted from first-party DeFiChain wallet documentation, the official DeFiChain chain implementation, and the completed June 2026 DEX discovery source.

The first-party `DeFiCh/defichain-app` repository explicitly states that the wallet can be used to liquidity mine and use the DEX. The official `DeFiCh/ain` implementation contains pool-pair and pool-swap RPC infrastructure supporting the native decentralized exchange and liquidity-pool system.

The June 2026 DEX candidate source identifies DeFiChain DEX in the DEX category. Duplicate candidate rows `0538` and `0539` are consolidated into one entity.

Exact bundle-path checks on current main found no existing `records/exchanges/defichain-dex.json`. Repository PR history records the pair as an entity-first consolidation group but does not contain a prior reviewed record addition.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 619
- projected event count: 1004
- projected evidence count: 2826
- remaining to D-750 after projected merge: 131

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
