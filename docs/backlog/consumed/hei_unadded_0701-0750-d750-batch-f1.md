# Range 0701-0750 D-750 Batch F1

Reviewed at: 2026-07-08

## Results

- `0718`/`0719` EXMO source rows -> `hei_ex_000685`, active CEX
- `0738` Fathom AMM + `0739` Fathom DEX -> `hei_ex_000686`, active DEX
- `0750` Ferro -> `hei_ex_000687`, active DEX
- `0722` extended -> `hei_ex_000688`, active DEX

## Consolidation handling

- Duplicate EXMO registry rows are modeled as one centralized exchange entity.
- Fathom AMM and Fathom DEX source rows are modeled as one exchange entity within the Fathom Protocol ecosystem.
- Extended is modeled as one perpetuals DEX entity under its current first-party identity.

## Decision notes

EXMO is promoted from its current official exchange website and About page, which state that the platform was founded in 2014 and continues to provide active cryptocurrency trading services. Fathom DEX is promoted from current official protocol pages and dedicated DEX documentation describing liquidity pools, automated market making, and token swaps. Ferro is promoted from current official application and documentation identifying a Cronos StableSwap AMM with swap and liquidity-pool functionality. Extended is promoted from its current official website and recently updated first-party documentation describing a self-custodial perpetuals DEX on Starknet.

Fenix Finance is not consumed by this batch because its old documentation URL currently redirects into Accelera documentation. The current Fenix/Accelera lineage and whether the DEX remains a distinct active exchange entity require separate investigation before classification.

## Batch output

- new entities: 4
- new events: 0
- new evidence: 12
- duplicate/product rows consolidated: 3
- projected entity count: 572
- projected event count: 1004
- projected evidence count: 2685
- remaining to D-750 after projected merge: 178

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
