# Range 0401-0450 Phase C 550-entity milestone batch

Reviewed at: 2026-07-05

## Results

- `0412` Coinhouse -> `hei_ex_000658`, active hybrid
- `0430` Coinut -> `hei_ex_000659`, active hybrid
- `0445` Counos Exchange -> parent Counos `hei_ex_000660`, active hybrid
- `0423` Coinsbit -> `hei_ex_000661`, inactive CEX
- `0408` CoinField -> `hei_ex_000662`, inactive CEX
- `0426` CoinTiger -> `hei_ex_000663`, inactive CEX
- `0407` CoinExchange -> `hei_ex_000664`, inactive CEX
- `0449` CPDAX -> `hei_ex_000665`, inactive CEX
- `0432` CoinZest -> `hei_ex_000666`, inactive CEX

## Decision notes

Coinhouse, COINUT, and Counos are promoted from current first-party service evidence. Historical CEX candidates are classified inactive rather than dead because registry and archive evidence supports identity and historical operation, while this batch does not assert unverified terminal dates or causes. CoinExchange remains explicit `country_or_origin = Unknown` after documented review instead of receiving a guessed origin.

## Batch output

- new entities: 9
- new events: 0
- new evidence: 18
- projected entity count: 550
- unresolved needs-research remaining in range: 6

No Cloudflare or production deployment changes are included.
