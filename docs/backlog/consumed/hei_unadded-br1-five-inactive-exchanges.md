# D-1000 Batch BR1 — Five Registry-Backed Inactive Exchanges

Reviewed at: 2026-07-14

## Results

- `0960` Huobi US (HBUS) -> `hei_ex_000899`, inactive CEX
- `0419` CoinPlace -> `hei_ex_000900`, inactive CEX
- `0227` Bits Blockchain -> `hei_ex_000901`, inactive CEX
- `0242` BJS -> `hei_ex_000902`, inactive CEX
- `0168` Bigmarkets Limited -> `hei_ex_000903`, inactive CEX

## Status decisions

All five candidate rows are preserved by CoinPaprika with an inactive classification. BR1 records that state without inferring a terminal date, death reason, or shutdown event.

HBUS has a separately preserved historical website archive reference and is modeled as the United States venue identity rather than as a duplicate of the global Huobi/HTX exchange.

For CoinPlace, Bits Blockchain, BJS, and Bigmarkets Limited, reliable first-party domains and jurisdictions were not recovered. Their canonical records therefore retain null URL fields and conservative global origin labels rather than inventing specific corporate facts.

## Deferred candidates

```text
CoinExchange -> old registry status conflicts with known historical closure context; stronger source recovery required
Hanbitco     -> current or terminal state not established
HCoin        -> current or terminal state not established
Hubi         -> current or terminal state not established
IDCM         -> current or terminal state not established
```

## Evidence decisions

Each entity receives an entity-specific CoinPaprika registry reference plus the registry corpus reference. HBUS additionally uses the historical website archive as its second evidence item rather than the corpus reference.

The evidence supports identity and inactive state only. It does not support precise lifecycle dates or causes.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 10
- projected entity count: 785
- projected event count: 1004
- projected evidence count: 3323
- projected remaining to D-1000: 215

## Operating mode

BR1 is the eighth D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
