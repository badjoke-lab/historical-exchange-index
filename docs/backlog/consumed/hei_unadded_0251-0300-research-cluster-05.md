# Range 0251-0300 research cluster 05

Reviewed at: 2026-07-05

## Rows

- `0282` BTCMEX
- `0283` BTCsquare
- `0284` BtcTrade.im
- `0289` Buenbit
- `0294` BurrBear
- `0296` BW

## Results

- BTCMEX -> moved to `pending_thin`; no canonical record.
- BTCsquare -> moved to `pending_thin`; no canonical record.
- BtcTrade.im -> moved to `pending_thin`; no canonical record.
- Buenbit -> added as `hei_ex_000607`, active, with a 2025 Nexo acquisition event.
- BurrBear -> added as `hei_ex_000608`, active DEX.
- BW -> moved to `pending_thin`; no canonical record.

## BTCMEX decision

The candidate originates from the CoinPaprika exchange feed, but this review did not recover a sufficiently reliable operator identity, official domain, launch marker, or lifecycle evidence set. The row remains non-canonical.

## BTCsquare decision

The candidate remains too thin for canonical promotion. The reviewed material did not establish a defensible official domain, operator identity, or lifecycle history beyond the source-list row.

## BtcTrade.im decision

The candidate name and source-list row are insufficient to establish a public-quality exchange identity and lifecycle. No canonical record is created.

## Buenbit decision

Buenbit is promoted as an active centralized exchange entity. The candidate source identifies the exchange, while Reuters reported on December 11, 2025 that Nexo was acquiring the Argentina-based crypto trading platform. HEI records that transaction as an acquisition event but does not infer a terminal status change from the ownership transaction alone.

## BurrBear decision

BurrBear is promoted as an active Berachain DEX. The source candidate comes from the DefiLlama DEX feed, and the first-party BurrBear development organization publishes a maintained contract-address package. Launch date and canonical website domain remain null because this review did not recover sufficiently strong markers for either field.

## BW decision

`BW` is a short and highly ambiguous candidate name. The reviewed source-list row did not provide enough reliable material to establish a unique exchange operator, canonical official domain, and lifecycle history. The row remains non-canonical.

## Batch output

- new entities: 2
- new events: 1
- new evidence: 4
- moved to pending_thin: 4

No Cloudflare or deployment changes are included.
