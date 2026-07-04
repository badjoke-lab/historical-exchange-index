# Scan: verified-unadded rows 0301-0350

Status: reviewed initial scan / implementation not started

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0301-0350-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-05`

## Initial classification summary

| class | count |
|---|---:|
| add_now | 5 |
| needs_research | 15 |
| pending_thin | 10 |
| out_of_scope_or_duplicate | 20 |

## Add-now queue

- `0311` Capricorn — parent DEX candidate with direct exchange domain
- `0316` Carbon Defi — parent protocol row; deployment rows are collapsed under it
- `0327` Catex — exchange candidate with direct domain; duplicate source row `0326` is consumed with it
- `0330` CaviarNine — parent exchange/protocol candidate; product-surface rows are collapsed under it
- `0339` Cellana Finance — parent DEX candidate; duplicate source rows are collapsed under it

## Needs-research queue

- `0303` C-Patex
- `0305` Cables Finance
- `0306` Caliber
- `0307` Canary
- `0308` CandySwap
- `0309` Canonic
- `0310` Canto Dex
- `0313` Capricorn Finance
- `0314` Capybara Dexs
- `0322` Carbonswap
- `0323` Cashierest
- `0325` Catalist DEX
- `0329` Cauldron
- `0337` CCXCanada
- `0350` CGCX

These rows appear exchange-like or protocol-like but need stronger operator identity, lifecycle, domain, or status evidence before canonical promotion.

## Pending thin

- `0324` CashPayz Exchange
- `0334` CBX
- `0335` Ccore
- `0336` CCRYPTOEX
- `0341` Centex
- `0344` CEX
- `0345` Cex-Trade
- `0347` Cexius
- `0348` Cexland
- `0349` CexZ

These rows currently have only thin list-level signals or ambiguous identity and are not implementation candidates without better evidence.

## Out of scope or duplicate rows

- `0301` bybiteu — regional Bybit connector row; existing parent `hei_ex_000011`
- `0302` BYDFi Spot — product row under existing `hei_ex_000414`
- `0304` C3 Exchange — source category identifies a cross-chain bridge rather than an exchange registry entity
- `0312` Capricorn — duplicate parent-source row for `0311`
- `0315` CapybaraDEX V2 — version/product row; parent review remains at `0314`
- `0317`-`0321` Carbon DeFi network/deployment rows — collapse under parent `0316`
- `0326` Catex — duplicate source row for `0327`
- `0328` Catton — source category is CDP, outside HEI exchange scope
- `0331`-`0333` CaviarNine product surfaces — collapse under parent `0330`
- `0338` and `0340` Cellana source duplicates — collapse under parent `0339`
- `0342` Cetus CLMM — product surface under existing `hei_ex_000231`
- `0343` Cetus DLMM — product surface under existing `hei_ex_000231`
- `0346` CEX.IO Broker — product row under existing `hei_ex_000079`

## Current range position

```text
range records:                 50
promoted add_now:               0
promoted research:              0
unresolved add_now:             5
unresolved needs_research:     15
pending_thin:                  10
out_of_scope_or_duplicate:     20
range status:                  open
```

## Next step

Promote the five add-now parent entities in reviewed batches, then process the needs-research queue in evidence-backed clusters.
