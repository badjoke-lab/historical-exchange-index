# Range 0501-0550 D-750 Batch B1

Reviewed at: 2026-07-08

## Results

- `0527` DeDust -> `hei_ex_000674`, active DEX
- `0529` DeepBook V2/V3 group -> `hei_ex_000671`, active DEX
- `0545` DeGate -> `hei_ex_000672`, active DEX
- `0511` DackieSwap V2/V3 group -> `hei_ex_000673`, active DEX

## Consolidation handling

- `0527` and `0528` are one DeDust entity.
- `0529` DeepBook V2 and `0530` DeepBook V3 are one DeepBook entity; version history is not counted as separate entities.
- `0511` DackieSwap V2 plus `0512` and `0513` DackieSwap V3 rows are one DackieSwap entity.

## Decision notes

DeepBook is promoted from first-party DeepBook and Sui documentation that describe a decentralized central limit order book on Sui and explicitly distinguish current V3 from deprecated V2 without implying separate canonical entities. DeGate is promoted from current first-party documentation describing a non-custodial multichain trading platform. DackieSwap is promoted from current first-party documentation and application access describing a multichain decentralized exchange. DeDust is promoted from its live first-party DEX domain with secondary exchange and DEX registry corroboration; exact launch date is intentionally left unset pending a precise first-party source.

## Batch output

- new entities: 4
- new events: 0
- new evidence: 12
- version/duplicate rows consolidated: 4
- projected entity count: 558
- projected event count: 1004
- projected evidence count: 2643
- remaining to D-750 after projected merge: 192

No Cloudflare configuration changes are included. The record additions are reviewed public-data changes and must pass overlap, duplicate, ID-collision, entity-quality, projected-enum, country/origin, count-semantics, machine-readable, and public-output validation gates before merge.
