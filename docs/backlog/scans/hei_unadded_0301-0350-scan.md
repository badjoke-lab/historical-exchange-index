# Scan: verified-unadded rows 0301-0350

Status: reviewed initial scan / add-now queue consumed / research cluster 01 reviewed

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

## Promoted add-now rows

- `0311` Capricorn -> `hei_ex_000611`
- `0316` Carbon Defi -> `hei_ex_000612`
- `0327` Catex -> `hei_ex_000613`
- `0330` CaviarNine -> `hei_ex_000614`
- `0339` Cellana Finance -> `hei_ex_000615`

## Promoted research rows

- `0303` C-Patex -> `hei_ex_000616`
- `0305` Cables Finance -> `hei_ex_000617`
- `0306` Caliber -> `hei_ex_000618`
- `0307` Canary -> `hei_ex_000619`

## Remaining needs-research queue

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

These rows remain under review for stronger operator identity, lifecycle, domain, or status evidence.

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
- `0312` Capricorn — duplicate parent-source row consumed under `hei_ex_000611`
- `0315` CapybaraDEX V2 — version/product row; parent review remains at `0314`
- `0317`-`0321` Carbon DeFi network/deployment rows — consumed under `hei_ex_000612`
- `0326` Catex — duplicate source row consumed under `hei_ex_000613`
- `0328` Catton — source category is CDP, outside HEI exchange scope
- `0331`-`0333` CaviarNine product surfaces — consumed under `hei_ex_000614`
- `0338` and `0340` Cellana source duplicates — consumed under `hei_ex_000615`
- `0342` Cetus CLMM — product surface under existing `hei_ex_000231`
- `0343` Cetus DLMM — product surface under existing `hei_ex_000231`
- `0346` CEX.IO Broker — product row under existing `hei_ex_000079`

## Current range position

```text
range records:                 50
promoted add_now:               5
promoted research:              4
unresolved add_now:             0
unresolved needs_research:     11
pending_thin:                  10
out_of_scope_or_duplicate:     20
range status:                  open
```

## Next step

Process the remaining eleven needs-research rows in evidence-backed clusters and close the range when every research row is resolved.
