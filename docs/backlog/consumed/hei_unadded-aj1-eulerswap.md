# D-750 Batch AJ1 — EulerSwap

Reviewed at: 2026-07-09

## Results

- `0699` EulerSwap -> `hei_ex_000740`, active DEX

## Consolidation and classification

- EulerSwap is modeled as one exchange entity within the Euler ecosystem.
- Individual pools, vault integrations, Uniswap V4 hook paths, direct pool swap calls, periphery contracts, and registry entries remain components under the same entity.
- Confidence is `medium` because the official Euler website is broader than the EulerSwap product and this initial record does not rely on a dedicated public trading frontend.

## Decision notes

EulerSwap is promoted from the official EulerSwap implementation repository, recent first-party maintenance evidence, and the June 2026 DEX discovery source.

The official `euler-xyz/euler-swap` repository identifies EulerSwap as an AMM integrated with Euler credit vaults and documents direct swaps, exact-in/out helpers, quoting, just-in-time liquidity, shared liquidity across pools, pool deployment, pool registry behavior, and configurable AMM mechanics.

A substantive first-party EulerSwap documentation update dated 2026-01-21 demonstrates continued maintenance of the AMM model and codebase. The June 2026 DEX candidate source independently identifies EulerSwap as a multichain DEX candidate.

Exact bundle-path checks on current main found no existing `records/exchanges/eulerswap.json`. Repository PR search found only the completed 0651-0700 scan, which classifies candidate `0699` as `add_now`.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 624
- projected event count: 1004
- projected evidence count: 2841
- remaining to D-750 after projected merge: 126

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
