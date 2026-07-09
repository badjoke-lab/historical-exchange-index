# D-750 Batch AD1 — Defibox

Reviewed at: 2026-07-09

## Results

- `0537` DefiBox -> `hei_ex_000734`, active DEX

## Consolidation and classification

- Defibox is modeled as one multichain DEX/liquidity entity rather than separate entities per chain deployment.
- Swap, LP-token, APY, lending, and other protocol surfaces remain products/components under the same entity.
- Confidence is `medium` because the current first-party application is live while the selected public first-party documentation set is older.

## Decision notes

Defibox is promoted from the reachable first-party application, the official DefiboxTeam documentation repository, and the June 2026 DEX discovery source.

The official application endpoint remains reachable. The first-party DefiboxTeam repository preserves Swap APY APIs, liquidity-provider token documentation, audit reports, data structures, and related protocol documentation supporting Defibox's exchange and liquidity-platform identity.

The June 2026 DEX candidate source identifies Defibox in the DEX category across BNB Chain, Vaulta, and WAX, providing current multichain deployment corroboration.

Exact bundle-path checks on current main found no existing `records/exchanges/defibox.json`. The completed 0501-0550 scan classifies candidate `0537` as `add_now`.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 618
- projected event count: 1004
- projected evidence count: 2823
- remaining to D-750 after projected merge: 132

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
