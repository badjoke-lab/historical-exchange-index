# Scan: verified-unadded rows 0151-0200

Status: range resolved / no unresolved add-now or research rows

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
| needs_research | 11 |
| pending_thin | 15 |
| out_of_scope_or_duplicate | 15 |

The disposition values preserve each row's reviewed class. All `add_now` and `needs_research` rows have now received an operator resolution through canonical promotion, existing-entity matching, or explicit reclassification. Unresolved actionable rows: **0**.

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
- `0185`-`0186` Bit.com -> moved into research before final resolution

## Resolved research batch 01

- `0156` BenSwap -> `hei_ex_000575`
- `0158` BeraSwap -> existing `hei_ex_000377` BEX
- `0161` BetterSwap -> `hei_ex_000576`
- `0155` Beldex -> `out_of_scope_or_duplicate`
- `0157` Beralis V3 -> `pending_thin`

## Resolved research batch 02

- `0166` Biconomy -> existing `hei_ex_000094` Biconomy Exchange
- `0187` BIT.TEAM -> `hei_ex_000577`
- `0159` BETCONIX -> `pending_thin`
- `0171` BIKA -> `pending_thin`

## Resolved research batch 03

- `0162` BEVMSwap -> `hei_ex_000578`
- `0182` Birake -> `hei_ex_000579`
- `0184` BisonFi -> `pending_thin`

## Resolved final research batch

- `0185`-`0186` Bit.com spot/futures -> `hei_ex_000580` Bit.com Exchange
- `0190` BitBegin -> `hei_ex_000581`
- `0195` BITCOIVA -> `hei_ex_000582`
- `0197` Bitcratic -> `hei_ex_000583`
- `0189` BitAsset -> `pending_thin`
- `0199`-`0200` Bitenium spot/futures -> `pending_thin` / duplicate product row

Bit.com is recorded as a closed historical exchange, separate from the current BIT financial-services group now using the bit.com domain. BitBegin, BITCOIVA, and Bitcratic are active. BitAsset and Bitenium remain non-canonical because their original operator identities and terminal states are not supported by sufficient first-party lifecycle evidence.

## Pending thin

`0157`, `0159`, `0164`, `0168`, `0170`, `0171`, `0174`, `0183`, `0184`, `0188`, `0189`, `0191`, `0196`, `0198`, `0199`.

These rows are intentionally non-canonical. Database or aggregator presence alone is insufficient for promotion.

## Existing, duplicate, or product rows

- `0151`-`0153` -> existing Beets `hei_ex_000371`
- `0166` -> existing Biconomy Exchange `hei_ex_000094`
- `0173` -> duplicate Bilaxy row
- `0175`, `0177`, `0180`, `0181` -> Binance products or adapters
- `0179` -> Binance JEX futures row merged into existing `hei_ex_000308`
- `0186` -> Bit.com spot row represented by `hei_ex_000580`
- `0200` -> Bitenium futures product row represented by pending-thin `0199`

## Out of scope

- `0154` Beezie — physical trading-card marketplace
- `0155` Beldex — blockchain and privacy-asset project
- `0160` Betmoar.fun — interface row
- `0169` BigPump — token launchpad

## Closure condition

```text
range records:                 50
unresolved add_now:             0
unresolved needs_research:      0
canonical promotions/matches:  complete
pending-thin decisions:         explicit
range status:                   closed
```

## Next step

Begin a clean machine-readable scan for verified-unadded rows `0201-0250`. Do not reopen this range unless new first-party evidence materially changes a pending-thin or lifecycle decision.
