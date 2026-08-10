# BX57 consumed candidate set — four reviewed DEX records

Date: 2026-08-10  
Status: consumed

## Added reviewed entities

```text
Perpl         -> hei_ex_001142
Deri Protocol -> hei_ex_001143
AwakenSwap    -> hei_ex_001144
WX Network    -> hei_ex_001145
```

## Candidate origin

The four names were surfaced from HEI candidate monitoring / external discovery and then independently re-reviewed. Monitoring output itself is not canonical evidence.

## Pre-add overlap checks

Direct current-main path and repository checks found no reviewed bundle for:

```text
records/exchanges/perpl.json
records/exchanges/deri-protocol.json
records/exchanges/awaken-swap.json
records/exchanges/wx-network.json
records/exchanges/waves-exchange.json
```

Related-identity controls:

- Deri Protocol is distinct from the existing Derive record.
- Current Deri versions are represented as one protocol-level entity; BX57 does not create separate Deri V4 lineage records.
- AwakenSwap / Awaken Finance naming is normalized to one exchange entity.
- Waves DEX, Waves.Exchange, Waves Exchange, and WX Network naming is normalized to one current WX Network entity in this batch. A separate lineage/rebrand event is not asserted without dedicated historical review.

## Evidence threshold

Each entity has current first-party exchange/trading evidence plus an independent current status source.

```text
Perpl         first-party exchange + DefiLlama current perp metrics
Deri Protocol first-party exchange + DefiLlama current protocol metrics
AwakenSwap    first-party exchange + DefiLlama current protocol metrics
WX Network    first-party exchange docs + CoinGecko current exchange listing
```

## Status boundary

Perpl, Deri Protocol, and AwakenSwap are `active` because current first-party trading surfaces and independent current activity evidence are both present.

WX Network is `limited`, not `active`: first-party trading functionality remains published and independent exchange data still tracks the venue, but observed current market liquidity and volume are very small or inconsistent. BX57 preserves this uncertainty rather than treating mere site availability as strong active-use evidence.

## Result

BX57 consumes only these four reviewed candidates. No automated monitoring status or generic list entry is promoted directly into canonical data.
