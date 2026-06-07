# Pending review: verified-unadded rows 0951-1000

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0951-1000` before canonical record creation.

This window contains active-looking DEX/protocol rows, thin CEX/exchange-like rows, product/category rows, and several cluster candidates such as Fraxswap, FTX Futures, Full Sail, FusionX, Gala Swap, Gaming DEX, Gate, GBX, GDAC, and Giottus.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Classification summary

```text
add_now: 0
needs_research: 12
pending_thin: 12
active_seed_later: 18
out_of_scope_or_duplicate: 8
```

## needs_research

```text
hei_unadded_0954 FreiExchange
hei_unadded_0957 FTX Futures
hei_unadded_0971 FYB-SE
hei_unadded_0972 FYB-SG
hei_unadded_0986 gate
hei_unadded_0987 Gate
hei_unadded_0988 Gate
hei_unadded_0990 Gate Futures
hei_unadded_0992 GBX Digital Asset Exchange
hei_unadded_0994 GDAC
hei_unadded_0999 Giottus
hei_unadded_1000 Giottus
```

Notes:

- Gate should be reviewed as a single active CEX cluster, not split across CCXT / CoinPaprika / CoinGecko / futures rows.
- FTX Futures should not be added as a standalone row without reviewing the broader FTX / FTX derivatives entity relationship.
- GBX and GDAC may have historical/status value but need stronger event evidence before canonical inclusion.
- Giottus should be reviewed as a single active CEX cluster.
- FYB-SE and FYB-SG may require separate entity/status review before any canonical treatment.

## pending_thin

```text
hei_unadded_0962 Furxe
hei_unadded_0967 FVM Exchange
hei_unadded_0973 FynEx
hei_unadded_0979 Ganza
hei_unadded_0981 Garlix
hei_unadded_0982 Garts Exchange
hei_unadded_0993 GCB Exchange
hei_unadded_0995 Geco one
hei_unadded_0996 GetBTC
hei_unadded_0997 Gin Finance
hei_unadded_0998 Ginseng Swap
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

```text
hei_unadded_0951 Frax Swap
hei_unadded_0952 Fraxswap
hei_unadded_0953 Fraxswap (Ethereum)
hei_unadded_0958 Fulcrom AMM
hei_unadded_0959 Full Sail
hei_unadded_0960 Full Sail
hei_unadded_0961 Funnel
hei_unadded_0963 FusionX V2
hei_unadded_0964 FusionX V3
hei_unadded_0965 FusionX V3
hei_unadded_0966 Futarchy AMM
hei_unadded_0969 FWX DEX
hei_unadded_0975 Gala Swap
hei_unadded_0976 Gala Swap
hei_unadded_0977 Gaming DEX
hei_unadded_0978 Gaming DEX (Oasys)
hei_unadded_0983 Garuda DeFi
hei_unadded_0984 GarudaDefi
hei_unadded_0991 Gate Swap
```

Notes:

- Fraxswap, Full Sail, FusionX, Gala Swap, Gaming DEX, and Garuda DeFi should be handled as clusters if added later.
- Chain/version/product rows should not be split into separate v0 entities without a deployment-level methodology.
- Gate Swap should be reviewed with the broader Gate cluster before any split.

## out_of_scope_or_duplicate

```text
hei_unadded_0955 FrenFlow
hei_unadded_0956 friend.tech V1
hei_unadded_0968 Fwog.fun
hei_unadded_0970 FXDX
hei_unadded_0974 Gacha
hei_unadded_0980 Garden
hei_unadded_0985 GasPump
hei_unadded_0989 Gate Fun
```

Notes:

- FrenFlow and Gacha are marked as Prediction Market in the reviewed rows.
- friend.tech V1 is marked as SoFi.
- Fwog.fun and GasPump are marked as Launchpad.
- Garden is marked as Cross Chain Bridge.
- FXDX is marked as Derivatives and needs scope review before any HEI treatment.
- Gate Fun should not be split from Gate without a product/venue methodology decision.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes recognizable names, especially Gate, FTX Futures, GBX, GDAC, Giottus, Fraxswap, and FusionX, but adding them now would either create thin records, split product/version clusters, or require separate historical event review.

## Next action

1. Review Gate separately as a major active CEX cluster if meaningful event history is confirmed.
2. Review FTX Futures only together with the broader FTX record/entity relationship.
3. Review GBX and GDAC separately if stronger closure/status/security evidence is found.
4. Keep Fraxswap, Full Sail, FusionX, Gala Swap, Gaming DEX, and Garuda DeFi as cluster candidates for later DEX/protocol seed work.
5. Continue scanning `hei_unadded_1001-1050` while avoiding product/version splitting.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
