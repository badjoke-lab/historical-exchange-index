# HEI reviewed backlog consumption — D-1000 BX19

Date: 2026-07-19  
State: consumed by reviewed BX19 branch

## Reviewed additions

```text
ApeX Omni  hei_ex_000990 active
Rysk V12   hei_ex_000991 active
AFX        hei_ex_000992 active
Antarctic  hei_ex_000993 active
```

## Source candidate rows

```text
data-staging/watchlists/review/20260614-active-later-01.json
  Apex Omni
  Rysk V12

data-staging/watchlists/review/20260614-active-later-02.json
  AFX
  Antarctic
```

## Resolution

```text
candidate:apex-omni promoted -> hei_ex_000990
candidate:rysk-v12  promoted -> hei_ex_000991
candidate:afx       promoted -> hei_ex_000992
candidate:antarctic promoted -> hei_ex_000993
```

Resolution override:

```text
data-staging/watchlists/resolution/overrides/20260719-bx19-four-promotions.json
```

## Dedupe controls

Before drafting, BX19 checked direct canonical paths, alternate slugs, repository names, official domains, reviewed `data/entities.json`, and existing resolution overrides.

No current-main canonical record was found for the four final additions.

Byte Exchange was rejected as duplicate after direct inspection found:

```text
records/exchanges/byte-exchange.json
hei_ex_000416
```

BULK was not promoted in this batch because its current independent metric represents Season 1 pre-deposits and does not yet establish exchange trading activity equivalent to the four selected records.

## Evidence boundary

Each record includes:

```text
one current first-party identity or product source
one current independently maintained activity source
```

No exact launch date, jurisdiction, legal entity, predecessor, successor, shutdown date, or shutdown cause was inferred.

Antarctic is typed `hybrid` because first-party material describes off-chain order matching with on-chain settlement. ApeX Omni, Rysk V12, and AFX are typed `dex`.

## Projected reviewed delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected state:

```text
Entities: 873
Events:   1004
Evidence: 3505
English dossiers:  873
Japanese dossiers: 873
Sitemap routes:     1770
Remaining to D-1000: 127
```
