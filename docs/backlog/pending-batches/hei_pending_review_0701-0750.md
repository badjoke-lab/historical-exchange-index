# Pending review: verified-unadded rows 0701-0750

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0701-0750` before canonical record creation.

This window contains active-looking DEX/protocol rows, exchange-like database rows, and cluster candidates such as Deribit, Demex, DerpDEX, DeversiFi, Dex-Trade, Dexalot, Dfyn, DODO, and Delta/Delta Exchange.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Classification summary

```text
add_now: 0
needs_research: 7
pending_thin: 26
active_seed_later: 13
out_of_scope_or_duplicate: 5
```

## needs_research

```text
hei_unadded_0700 Delta Exchange
hei_unadded_0707 Deribit
hei_unadded_0708 Deribit Spot
hei_unadded_0712 DeversiFi
hei_unadded_0713 Dex-Trade
hei_unadded_0714 Dex-Trade
hei_unadded_0731 DIFX
```

Notes:

- Deribit should be reviewed as one cluster, not split by spot/product row.
- DeversiFi may have rebrand/history value and should be checked separately.
- Dex-Trade and DIFX need stronger event/status evidence before inclusion.
- Delta Exchange was flagged in the previous scan and remains a separate review candidate.

## pending_thin

```text
hei_unadded_0701 DeltaDeFi
hei_unadded_0702 DeltaSwap
hei_unadded_0704 DeltaTrade
hei_unadded_0710 DerpDEX
hei_unadded_0717 dexie
hei_unadded_0718 Dexlab
hei_unadded_0719 Dexomy
hei_unadded_0720 dexSWAP
hei_unadded_0721 Dexter Exchange
hei_unadded_0722 Dexzbitz
hei_unadded_0723 Dezswap
hei_unadded_0724 DFLOW
hei_unadded_0726 DFX V2
hei_unadded_0727 Dfyn
hei_unadded_0730 Dgtmarket
hei_unadded_0732 DigiDinar
hei_unadded_0735 Dinosaur Eggs
hei_unadded_0736 DipCoin Spot
hei_unadded_0737 Diviswap
hei_unadded_0739 DNAX
hei_unadded_0740 DOBI
hei_unadded_0746 DogeSwap
hei_unadded_0747 Dogex Global
hei_unadded_0748 Doma DEX V3
hei_unadded_0749 Domitai
hei_unadded_0750 DOOAR (Polygon)
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

```text
hei_unadded_0705 Demex
hei_unadded_0706 Demex AMM
hei_unadded_0715 Dexalot
hei_unadded_0716 Dexalot DEX
hei_unadded_0728 Dfyn
hei_unadded_0729 Dfyn Network
hei_unadded_0733 Digitalexchange.id
hei_unadded_0738 DiviSwap
hei_unadded_0741 DODO
hei_unadded_0742 DODO (BSC)
hei_unadded_0743 DODO (Ethereum)
hei_unadded_0744 DODO (Polygon)
hei_unadded_0745 DODO AMM
```

Notes:

- Demex, Dexalot, Dfyn, and DODO should be handled as clusters if added later.
- DODO rows should be consolidated into one DODO / DODO Exchange record if a future seed or event-backed review supports canonical inclusion.
- Digitalexchange.id may be an active CEX seed candidate, but no event-backed reason was confirmed in this scan.

## out_of_scope_or_duplicate

```text
hei_unadded_0703 DeltaSwap (Arbitrum)
hei_unadded_0709 derive
hei_unadded_0711 DerpDEX (opBnb)
hei_unadded_0725 DFlow Prediction Market
hei_unadded_0734 Dinari
```

Notes:

- DeltaSwap (Arbitrum) and DerpDEX (opBnb) should not be split from their parent protocol rows without a deployment-level methodology.
- DFlow Prediction Market and Dinari are category/scope-mismatched for HEI v0 unless exchange functionality is confirmed.
- `derive` needs separate identity review before it can be mapped to a canonical entity.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes recognizable names, especially Deribit, DODO, Dex-Trade, and Delta Exchange, but adding them now would either create thin records, split product/version clusters, or pull active venues into canonical records without a specific event-backed or active-seed decision.

## Next action

1. Review Deribit separately for possible event-backed active CEX record.
2. Review DeversiFi separately for possible rebrand/history record.
3. Review DODO later as a DEX/protocol seed cluster, not per-chain rows.
4. Continue scanning `hei_unadded_0751-0800` while avoiding product/version splitting.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
