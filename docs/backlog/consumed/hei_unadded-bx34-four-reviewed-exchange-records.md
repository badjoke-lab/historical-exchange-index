# Consumed backlog — HEI D-1000 BX34

Date: 2026-07-28  
Status: consumed into reviewed record batch

## Added

```text
Orderly Network hei_ex_001052 active
Satori Finance hei_ex_001053 active
Lynx Finance hei_ex_001054 active
Contango V2 hei_ex_001055 active
```

## Evidence IDs

```text
hei_src_012329 through hei_src_012336
```

## Selection rationale

The four selected entities have current first-party exchange documentation and independent non-zero activity evidence.

- Orderly Network operates one shared omnichain perpetual order book with self-custody and on-chain settlement.
- Satori Finance operates multi-chain perpetual markets using off-chain aggregation and on-chain settlement.
- Lynx Finance exposes self-custodial perpetual trading with multi-token collateral across multiple chains.
- Contango V2 constructs leveraged and perpetual-like positions through integrated spot and lending markets across EVM networks.

## Held or rejected during review

- Boros and Nado were rejected after direct canonical-path reads found existing reviewed records.
- MYX Finance was held because recent independently reported trading was effectively inactive.
- BSX Exchange was held because independent status data marked the protocol deprecated.
- Trove Markets lacked sufficient independent current activity evidence.
- Treble Perps remained unselected because stronger active candidates were available.
- Regional or white-label interfaces were not split into separate entities without independent identity evidence.

## Count effect

```text
Entities: 931 -> 935
Events:   1014 -> 1014
Evidence: 3632 -> 3640
Remaining to D-1000: 65
```

No lifecycle event was consumed. The next event ID remains `hei_ev_010091`.
