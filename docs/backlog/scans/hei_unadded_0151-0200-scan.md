# Scan: verified-unadded rows 0151-0200

Status: rebuilt scan / growth batches 01-02 resolved

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0151-0200-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`
- reviewed_at: `2026-06-30`

The integrity checker verifies candidate IDs, names, slugs, range, and disposition counts against the current source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 10 |
| needs_research | 17 |
| pending_thin | 9 |
| out_of_scope_or_duplicate | 14 |

The counts above preserve the initial reviewed classification. Promotion history is recorded below and in `docs/backlog/consumed/`.

## Resolved in batch 01

- `0163` BHEX -> `hei_ex_000566`
- `0167` Bidesk -> `hei_ex_000567`
- `0172`-`0173` Bilaxy -> `hei_ex_000568`
- `0176` Binance DEX -> `hei_ex_000569`

## Resolved in batch 02

- `0178`-`0179` Binance JEX spot/futures -> existing `hei_ex_000308`
- `0193` BitcoinTrade -> `hei_ex_000571`
- `0194` BitcoinVN candidate -> `hei_ex_000572` VBTC

Binance JEX is an existing regulation-related staged-closure entity strengthened by this batch. BitcoinTrade is the historical Brazilian predecessor that became Ripio Trade. VBTC remains limited because its planned end-of-2026 shutdown has not yet occurred.

## Remaining add-now research

- `0165` Bibox — current active-side state requires separate review
- `0185`-`0186` Bit.com spot/futures — one entity; continuing OTC activity requires scope review
- `0192` BitcoinToYou — current and terminal state require stronger evidence

## Needs research

`0155`, `0156`, `0157`, `0158`, `0159`, `0161`, `0162`, `0166`, `0171`, `0182`, `0184`, `0187`, `0189`, `0190`, `0195`, `0197`, `0199`.

## Pending thin

`0164`, `0168`, `0170`, `0174`, `0183`, `0188`, `0191`, `0196`, `0198`.

Database presence alone is insufficient for promotion.

## Existing, duplicate, or product rows

- `0151`-`0153` -> existing Beets `hei_ex_000371`
- `0173` -> duplicate Bilaxy row
- `0175`, `0177`, `0180`, `0181` -> Binance products or adapters
- `0179` -> Binance JEX futures row merged into existing `hei_ex_000308`
- `0186` -> same Bit.com identity as `0185`
- `0200` -> same Bitenium identity as `0199`

## Out of scope

- `0154` Beezie — physical trading-card marketplace
- `0160` Betmoar.fun — interface row
- `0169` BigPump — token launchpad

## Safety rules

1. Recheck exact name, alias, slug, and domain before promotion.
2. Collapse product, version, deployment, and duplicate rows.
3. Require meaningful lifecycle events and public-quality evidence.
4. Keep uncertain terminal states out of `dead`.
5. Run all record, duplicate, count, lineage, machine-readable, and public-output gates.

## Next step

Review Bibox, Bit.com, and BitcoinToYou separately. Downgrade them rather than forcing record creation if public-quality state remains ambiguous.
