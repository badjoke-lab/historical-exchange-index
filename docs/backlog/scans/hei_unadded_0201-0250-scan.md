# Scan: verified-unadded rows 0201-0250

Status: reviewed initial scan / actionable rows open

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0201-0250-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`
- reviewed_at: `2026-07-03`

## Classification summary

| class | count |
|---|---:|
| add_now | 7 |
| needs_research | 14 |
| pending_thin | 26 |
| out_of_scope_or_duplicate | 3 |

Actionable rows at scan creation: **21**.

## Add-now queue

- `0202` Bitex.la
- `0214` Bitinka
- `0220` Bitocto Exchange
- `0223` Bitpanda Pro
- `0226` BitPreço
- `0230` BitShares DEX
- `0243` BL3P

These rows have a clear exchange identity and a plausible evidence path, but still require normal record drafting, overlap review, and CI before canonical promotion.

## Needs-research queue

`0206`, `0210`-`0212`, `0215`, `0219`, `0222`, `0227`, `0229`, `0236`, `0245`-`0246`, `0248`, `0250`.

The main unresolved questions are terminal state, operator identity, regional/product boundaries, or exchange-versus-broker scope.

## Pending thin

`0201`, `0203`-`0205`, `0207`-`0208`, `0213`, `0216`-`0218`, `0221`, `0224`-`0225`, `0228`, `0231`-`0235`, `0237`-`0240`, `0242`, `0247`, `0249`.

These rows currently rely mainly on tracker presence or weak lifecycle evidence and remain non-canonical.

## Out of scope or product/version rows

- `0209` Bitget Wallet Card — card product, not an exchange entity.
- `0241` Bitzyswap V3 — version/deployment row without a separate lifecycle identity.
- `0244` Bleap Card — card product, not an exchange entity.

## Execution order

1. Bitex.la, Bitpanda Pro, and BL3P.
2. Bitinka, Bitocto Exchange, BitPreço, and BitShares DEX.
3. BitGlobal and Bithumb Singapore identity-boundary review.
4. Remaining research rows in small evidence-backed batches.
5. Pending-thin rows stay non-canonical unless better evidence appears.

## Closure condition

```text
range records:                 50
unresolved add_now:             7
unresolved needs_research:     14
pending-thin decisions:        26
out-of-scope/product rows:      3
range status:                  open
```

## Next step

Draft the first reviewed batch for Bitex.la, Bitpanda Pro, and BL3P.
