# Scan: verified-unadded rows 0151-0200

Status: add-now queue resolved / research batches 01-03 resolved

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
| needs_research | 13 |
| pending_thin | 13 |
| out_of_scope_or_duplicate | 15 |

All nine `add_now` rows are resolved. Seven rows still classified as `needs_research` have already been resolved through research batches because the machine-readable scan preserves their original research class; six research rows remain unresolved.

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
- `0158` BeraSwap -> existing `hei_ex_000377` BEX
- `0161` BetterSwap -> `hei_ex_000576`
- `0155` Beldex -> moved to `out_of_scope_or_duplicate`
- `0157` Beralis V3 -> moved to `pending_thin`

## Resolved research batch 02

- `0166` Biconomy -> existing `hei_ex_000094` Biconomy Exchange
- `0187` BIT.TEAM -> `hei_ex_000577`
- `0159` BETCONIX -> moved to `pending_thin`
- `0171` BIKA -> moved to `pending_thin`

## Resolved research batch 03

- `0162` BEVMSwap -> `hei_ex_000578`
- `0182` Birake -> `hei_ex_000579`
- `0184` BisonFi -> moved to `pending_thin`

BEVMSwap is represented as an active BEVM-ecosystem DEX. Birake is represented as an active exchange network with Estonia-to-Georgia operating history. BisonFi is a measurable Solana prop AMM, but no dedicated official service page or stable first-party operator identity was found, so it remains non-canonical.

## Unresolved needs research

`0185`, `0189`, `0190`, `0195`, `0197`, `0199`.

## Pending thin

`0157`, `0159`, `0164`, `0168`, `0170`, `0171`, `0174`, `0183`, `0184`, `0188`, `0191`, `0196`, `0198`.

Database or aggregator presence alone is insufficient for promotion.

## Existing, duplicate, or product rows

- `0151`-`0153` -> existing Beets `hei_ex_000371`
- `0166` -> existing Biconomy Exchange `hei_ex_000094`
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

Process the six unresolved research candidates as the final CEX and legacy-exchange batch. Strongly evidenced active records may be promoted; unresolved rows should move to `pending_thin` rather than remain indefinitely open.
