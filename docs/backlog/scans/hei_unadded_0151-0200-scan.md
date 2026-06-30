# Scan: verified-unadded rows 0151-0200

Status: rebuilt scan complete / growth work not yet started

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0151-0200-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`
- reviewed_at: `2026-06-30`

The integrity checker verifies candidate ID, name, slug, range, and disposition counts against the current source JSONL. The archived pre-repair classification is no longer used.

## Classification summary

| class | count |
|---|---:|
| add_now | 10 |
| needs_research | 17 |
| pending_thin | 9 |
| out_of_scope_or_duplicate | 14 |

## Add now

These candidates have enough historical or operating significance to enter public-quality record research immediately. `add_now` does not authorize direct canonical insertion; each still requires exact identity, event, evidence, URL, date, and duplicate review.

- `0163` BHEX
- `0165` Bibox
- `0167` Bidesk
- `0172` Bilaxy
- `0176` Binance DEX
- `0178` Binance JEX (Spot)
- `0185` Bit.com Futures — model as one Bit.com entity, not separate spot/futures entities
- `0192` BitcoinToYou
- `0193` BitcoinTrade
- `0194` BitcoinVN

## Needs research

These candidates appear potentially in scope but need stronger identity, current-state, terminal-state, or first-party evidence before promotion.

- `0155` Beldex
- `0156` BenSwap
- `0157` Beralis V3
- `0158` Beraswap
- `0159` BETCONIX
- `0161` BetterSwap
- `0162` BEVMSwap
- `0166` Biconomy
- `0171` BIKA
- `0182` Birake
- `0184` BisonFi
- `0187` BIT.TEAM
- `0189` BitAsset
- `0190` BitBegin
- `0195` BITCOIVA
- `0197` Bitcratic
- `0199` Bitenium

## Existing canonical and product/version rows

- `0151` Beethoven X (Optimism) -> existing `hei_ex_000371` Beets
- `0152` Beethoven X (Optimism) -> existing `hei_ex_000371` Beets
- `0153` Beets (Sonic) -> existing `hei_ex_000371` Beets
- `0173` Bilaxy -> duplicate source row for `0172`
- `0175` Binance Alpha -> product/interface of existing Binance, not a separate exchange entity
- `0177` Binance Futures -> product market of existing Binance, not a separate exchange entity
- `0179` Binance JEX Futures -> same JEX exchange identity as `0178`
- `0180` binancecoinm -> CCXT Binance product adapter, not a separate entity
- `0181` binanceusdm -> CCXT Binance product adapter, not a separate entity
- `0186` Bit.com Spot -> same Bit.com exchange identity as `0185`
- `0200` Bitenium Futures -> same exchange identity as `0199`

The v0 entity-first model does not split chain deployments, protocol versions, spot/futures market adapters, or product interfaces into separate entities.

## Out of scope

- `0154` Beezie: physical trading-card marketplace rather than a crypto exchange entity
- `0160` Betmoar.fun: interface row rather than an independently modeled exchange entity
- `0169` BigPump: token launchpad rather than an exchange entity

## Pending thin

The following rows remain non-canonical because the current evidence is too thin to establish a reliable public record. Database presence alone is insufficient.

- `0164` Bibo
- `0168` Bigmarkets Limited
- `0170` BiHODL
- `0174` Bimex
- `0183` Birich
- `0188` Bit2Bit
- `0191` BitBunch
- `0196` BitConx
- `0198` BITENGEN

## Safety rules for promotion

Before any `add_now` or `needs_research` candidate becomes canonical:

1. Check exact canonical name, aliases, slug, and domain against projected and record-bundle data.
2. Resolve product, version, deployment, predecessor, successor, acquisition, and rebrand relationships.
3. Require meaningful lifecycle events rather than a database listing alone.
4. Require public-quality evidence and matching `source_count` values.
5. Keep uncertain terminal states as active, limited, inactive, or pending rather than forcing `dead`.
6. Build in small batches and run all record, duplicate, count, country/origin, lineage, machine-readable, and public-output gates.

## Next step

Start with a small reviewed batch from the `add_now` queue. Recommended first research cohort:

```text
BHEX
Bibox
Bidesk
Bilaxy
Binance DEX
```

The remaining candidates stay classified in this scan until a later batch changes their disposition through reviewed evidence.
