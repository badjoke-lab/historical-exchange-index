# Scan: verified-unadded rows 0201-0250

Status: closed

## Integrity binding

- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-04`

## Initial classification

| class | count |
|---|---:|
| add_now | 7 |
| needs_research | 14 |
| pending_thin | 26 |
| out_of_scope_or_duplicate | 3 |

## Promoted add-now rows

- `0202` Bitex.la -> `hei_ex_000584`
- `0214` Bitinka -> `hei_ex_000587`
- `0220` Bitocto Exchange -> `hei_ex_000588`
- `0223` Bitpanda Pro -> `hei_ex_000585`
- `0226` BitPreco -> `hei_ex_000589` Bitypreco
- `0230` BitShares DEX -> `hei_ex_000590`
- `0243` BL3P -> `hei_ex_000586`

## Promoted research rows

- `0206` BitFlip -> `hei_ex_000593`
- `0210` BitGlobal -> `hei_ex_000591`
- `0212` Bithumb Singapore -> `hei_ex_000592`
- `0215` BITKER -> `hei_ex_000594`
- `0229` Bitsdaq -> `hei_ex_000595`
- `0246` Blitz AMM -> `hei_ex_000596` Blitz Exchange
- `0248` Blockbid -> `hei_ex_000597`
- `0250` Blockchain.io -> `hei_ex_000598`

Related correction:

- existing `hei_ex_000199` Bitholic: `dead` -> `rebranded`

## Research rows moved to pending-thin

- `0211` Bithesap
- `0219` Bitnaru
- `0227` Bits Blockchain
- `0245` BLEX

These rows remain non-canonical because operator identity, lifecycle, or source depth is insufficient.

## Excluded rows

- `0209` Bitget Wallet Card — card product
- `0222` Bitonic — broker/direct purchase service; BL3P represents the order-book exchange
- `0236` Bittylicious — broker marketplace
- `0241` Bitzyswap V3 — version/deployment row
- `0244` Bleap Card — card product

## Final range result

```text
range records:                50
promoted add_now:              7
promoted research:             8
pending_thin:                 30
excluded:                      5
unresolved research:           0
range status:             closed
```

## Next step

Open and scan the next verified-unadded range, rows `0251-0300`.
