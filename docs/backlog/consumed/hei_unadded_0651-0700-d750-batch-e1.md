# Range 0651-0700 D-750 Batch E1

Reviewed at: 2026-07-08

## Results

- `0673` Enosys plus `0674`-`0676` V2/V3/Flare rows -> `hei_ex_000683`, active DEX
- `0681` Equalizer Exchange plus `0677`-`0680` Equalizer source rows -> `hei_ex_000684`, active DEX

## Consolidation handling

- Enosys Flare, AMM V2, AMM V3, and V3 Flare discovery rows are modeled as one Enosys entity.
- Equalizer generic, Base, Sonic, and Equalizer Exchange source rows are modeled as one Equalizer Exchange entity.

## Decision notes

Enosys is promoted from its current first-party site, which lists DEX V2 and DEX V3 as live products and describes AMM, liquidity, concentrated-liquidity, swap, and reward functionality across its Flare/Songbird-related ecosystem. Equalizer Exchange is promoted from current first-party documentation describing its DEX model and its December 2024 Fantom-to-Sonic migration, together with current documentation for Fantom, Sonic, and Base-related product surfaces.

Ellipsis Finance is not included in this batch despite clear first-party DEX identity because its documentation is old and current operational state requires additional verification. Elk Finance is also deferred because current first-party documentation emphasizes interoperability infrastructure; the exchange component requires separate scope review before entity classification.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- version/chain/source rows consolidated: 7
- projected entity count: 568
- projected event count: 1004
- projected evidence count: 2673
- remaining to D-750 after projected merge: 182

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
