# Range 0451-0500 D-750 Batch A

Reviewed at: 2026-07-08

## Results

- `0465` Cryptal -> `hei_ex_000667`, active CEX
- `0485` Cube -> `hei_ex_000668`, active hybrid
- `0476` Cryptomus -> `hei_ex_000669`, active CEX
- `0478` Cryptonex -> `hei_ex_000670`, active CEX

## Duplicate handling

- `0486` Cube is treated as the same Cube Exchange entity as `0485`; no second entity is created.
- The separate CEX/DEX discovery representations are consolidated into one hybrid entity based on first-party Cube descriptions and HEI entity-first counting rules.

## Decision notes

Cryptal is promoted from first-party evidence that describes the platform as the first Georgian crypto exchange and states that it emerged in 2018; the date is stored as a year-level approximation. Cube Exchange is promoted as one hybrid entity because the first-party About page describes the platform as a crypto exchange, explicitly presents a CEX & DEX model, and states Founded 2023. Cryptomus and Cryptonex are promoted from current first-party pages that expose active exchange/trading services, with registry listings retained only as secondary corroboration.

Candidates with weaker lifecycle evidence or ambiguous current identity, including CrossTower and Currency.com, are not consumed by this batch and remain outside the reviewed entity count pending separate investigation.

## Batch output

- new entities: 4
- new events: 0
- new evidence: 10
- duplicate rows consolidated: 1
- projected entity count: 554
- remaining to D-750 after projected merge: 196

No Cloudflare configuration changes are included. The record additions are public-data changes and must pass the permanent overlap, duplicate, ID-collision, entity-quality, projected-enum, count-semantics, machine-readable, and public-output validation gates before merge.
