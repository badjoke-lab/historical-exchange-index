# Scan: verified-unadded rows 0201-0250

Status: reviewed / add-now queue promoted / first research cluster resolved

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0201-0250-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-03`

## Initial classification

| class | count |
|---|---:|
| add_now | 7 |
| needs_research | 14 |
| pending_thin | 26 |
| out_of_scope_or_duplicate | 3 |

## Promoted add-now rows

Batch 01:

- `0202` Bitex.la -> `hei_ex_000584`
- `0223` Bitpanda Pro -> `hei_ex_000585`
- `0243` BL3P -> `hei_ex_000586`

Batch 02:

- `0214` Bitinka -> `hei_ex_000587`
- `0220` Bitocto Exchange -> `hei_ex_000588`
- `0226` BitPreco -> `hei_ex_000589` Bitypreco
- `0230` BitShares DEX -> `hei_ex_000590`

## Resolved needs-research rows

Research cluster 01:

- `0210` BitGlobal -> `hei_ex_000591`
- `0212` Bithumb Singapore -> `hei_ex_000592`

The shared Bithumb name did not represent one entity. Bithumb Korea, BitGlobal, and Bithumb Singapore are modeled as three separate exchange identities.

## Remaining needs-research queue

`0206`, `0211`, `0215`, `0219`, `0222`, `0227`, `0229`, `0236`, `0245`-`0246`, `0248`, `0250`.

## Pending thin

`0201`, `0203`-`0205`, `0207`-`0208`, `0213`, `0216`-`0218`, `0221`, `0224`-`0225`, `0228`, `0231`-`0235`, `0237`-`0240`, `0242`, `0247`, `0249`.

## Out of scope or product/version rows

- `0209` Bitget Wallet Card
- `0241` Bitzyswap V3
- `0244` Bleap Card

## Current range position

```text
range records:                 50
promoted add_now:               7
resolved needs_research:        2
unresolved needs_research:     12
pending-thin decisions:        26
out-of-scope/product rows:      3
range status:                  open
```

## Next step

Research the historical terminal-state cluster for BitFlip, BITKER, and Bitnaru, while keeping Bithesap separate because its present operator and lifecycle evidence remain weaker.
