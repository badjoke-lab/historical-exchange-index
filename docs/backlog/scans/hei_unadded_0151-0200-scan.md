# Scan: verified-unadded rows 0151-0200

Status: add-now queue resolved / research batch 01 resolved

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0151-0200-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`
- reviewed_at: `2026-07-02`

The integrity checker verifies candidate IDs, names, slugs, range, and disposition counts against the current source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 9 |
| needs_research | 16 |
| pending_thin | 10 |
| out_of_scope_or_duplicate | 15 |

All nine `add_now` rows are resolved. Of the sixteen rows still classified as `needs_research`, three have now been resolved through research batch 01; thirteen remain unresolved.

## Resolved growth batches

### Batch 01

- `0163` BHEX -> `hei_ex_000566`
- `0167` Bidesk -> `hei_ex_000567`
- `0172`-`0173` Bilaxy -> `hei_ex_000568`
- `0176` Binance DEX -> `hei_ex_000569`

### Batch 02

- `0178`-`0179` Binance JEX -> existing `hei_ex_000308`
- `0193` BitcoinTrade -> `hei_ex_000571`
- `0194` BitcoinVN -> `hei_ex_000572` VBTC

### Batch 03

- `0165` Bibox -> `hei_ex_000573`
- `0192` BitcoinToYou -> `hei_ex_000574`
- `0185`-`0186` Bit.com -> moved to `needs_research`

## Resolved research batch 01

- `0156` BenSwap -> `hei_ex_000575`
- `0158` BeraSwap -> normalized to existing `hei_ex_000377` BEX
- `0161` BetterSwap -> `hei_ex_000576`
- `0155` Beldex -> moved to `out_of_scope_or_duplicate`
- `0157` Beralis V3 -> moved to `pending_thin`

Beldex is a privacy blockchain and asset project rather than an exchange entity. Beralis V3 remains non-canonical because no stable first-party identity and lifecycle evidence were recovered.

## Unresolved needs research

`0159`, `0162`, `0166`, `0171`, `0182`, `0184`, `0185`, `0187`, `0189`, `0190`, `0195`, `0197`, `0199`.

## Pending thin

`0157`, `0164`, `0168`, `0170`, `0174`, `0183`, `0188`, `0191`, `0196`, `0198`.

Database or aggregator presence alone is insufficient for promotion.

## Existing, duplicate, or product rows

- `0151`-`0153` -> existing Beets `hei_ex_000371`
- `0173` -> duplicate Bilaxy row
- `0175`, `0177`, `0180`, `0181` -> Binance products or adapters
- `0179` -> Binance JEX futures row merged into existing `hei_ex_000308`
- `0186` -> same Bit.com identity as `0185`
- `0200` -> same Bitenium identity as `0199`

## Out of scope

- `0154` Beezie — physical trading-card marketplace
- `0155` Beldex — blockchain and privacy-asset project
- `0160` Betmoar.fun — interface row
- `0169` BigPump — token launchpad

## Safety rules

1. Recheck exact name, alias, slug, and domain before promotion.
2. Collapse product, version, deployment, and duplicate rows.
3. Require meaningful lifecycle events and public-quality evidence.
4. Keep uncertain terminal states out of `dead`.
5. Run all record, duplicate, count, lineage, machine-readable, and public-output gates.

## Next step

Process the thirteen unresolved research candidates in small CEX and DEX batches. Strongly evidenced records may be promoted; unresolved rows should move to `pending_thin` or `out_of_scope_or_duplicate` rather than remain indefinitely open.
