# HEI Unadded Candidate Scan — 0851-0900

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0851-0900-scan.json`

## Summary

```text
add_now:                    21
needs_research:              5
pending_thin:                9
out_of_scope_or_duplicate:  15
--------------------------------
total:                      50
```

This range contains active CEX candidates, DEX candidates, wallet/product rows, and existing reviewed protocol versions. Direct bundle checks protect existing GMX and gTrade records from duplicate growth.

## Add-now queue

```text
Glide Finance
Gliquid
Globe
Globiance
Glue Hub
Glyph
GMO Coin Japan
Goblins AMM
GoonFi
GooseFX
GoPax
Gravis Finance
Gravity Finance
Greenhouse
Grizzly Trade
GRVT
GT3
Gull Network
H2 Finance
HadesSwap
Hadouken AMM
```

Recommended first research group:

```text
GMO Coin Japan
GoPax
GRVT
Glide Finance
GooseFX
H2 Finance
```

The group combines regulated/established CEX candidates with well-defined DEX identities rather than maximizing thin active listings.

## Consolidation and existing-record groups

```text
Gleec wallet/product rows -> no separate exchange entity from those rows
Glide Finance duplicate rows -> one entity
Gliquid duplicate rows -> one entity
GMX V1/V2 AMM rows -> existing hei_ex_000244
GOPAX duplicate rows -> one entity
Gravity Finance duplicate rows -> one entity
GT3 duplicate rows -> one entity
gTrade row -> existing hei_ex_000515
H2 Finance V2/V3 -> one entity
```

## Needs-research queue

```text
Gleec BTC Exchange
Globitex
GO.Exchange
GokuMarket
Graviex
```

These require identity-boundary, jurisdiction, domain-history, or current/terminal-state work before public drafting.

## Pending-thin queue

```text
Globalcryptox
GlobeCryptoTrade
Go4mark
Gokuex
Goldexco.in
GoSwap
GOZO
Guava
GuldenTrader
```

These remain too thin for immediate public record work.

## Scope/product handling

- Gleec Wallet rows are wallet/product representations and are not counted as separate exchange entities from this scan.
- GMGN is categorized as Telegram Bot.
- Gnosis Pay is categorized as Crypto Card Issuer.
- GraFun is categorized as Launchpad.
- GMX V1/V2 AMM rows remain under existing GMX.
- gTrade remains under existing reviewed gTrade entity.

## Direct existing-bundle checks

```text
GMX    existing hei_ex_000244
gTrade existing hei_ex_000515
```

Direct bundle checks supplement, but do not replace, the permanent overlap and duplicate gates.

## D-750 impact

This scan itself does not change reviewed counts. Current merged reviewed state after G1 is:

```text
Entities:  575
Events:    1004
Evidence:  2694
Remaining to D-750: 175
```

Recommended next execution:

```text
Batch D750-I1
  strongest official/regulatory candidates from GMO Coin Japan / GoPax / GRVT / Glide Finance / GooseFX / H2 Finance

Historical research
  GO.Exchange
  Graviex
  GokuMarket

Batch D750-I2
  next strong add-now group
```

Only reviewed merged records count toward D-750.
