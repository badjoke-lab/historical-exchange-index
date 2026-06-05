# Pending review: verified-unadded rows 0751-0800

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0751-0800` before canonical record creation.

This window contains mostly active-looking DEX/protocol rows, exchange-like database rows, and cluster candidates such as DoveSwap, DragonSwap, Drift, Dswap, Dusa, DYORSwap, Dystopia, Ebisu's Bay, EchoDEX, EddyFinance, dYdX, and Ekubo.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Classification summary

```text
add_now: 0
needs_research: 6
pending_thin: 19
active_seed_later: 20
out_of_scope_or_duplicate: 5
```

## needs_research

```text
hei_unadded_0753 Dove Wallet
hei_unadded_0762 Dsdaq Global
hei_unadded_0774 dydx
hei_unadded_0784 EarnBIT
hei_unadded_0798 EGERA
hei_unadded_0800 Ekubo
```

Notes:

- dYdX is a major venue/protocol and should be reviewed separately as an event-backed or active-seed cluster.
- Ekubo is a recognizable DEX/protocol candidate but needs separate source/event review.
- Dove Wallet, Dsdaq Global, EarnBIT, and EGERA look exchange-like but need stronger identity, status, and event evidence before canonical inclusion.

## pending_thin

```text
hei_unadded_0751 DotSwap
hei_unadded_0752 Dove Swap V3
hei_unadded_0756 Dracula Finance
hei_unadded_0763 Dswap
hei_unadded_0765 DTX Dex V3
hei_unadded_0766 Duality
hei_unadded_0768 DuckyDeFi
hei_unadded_0769 Durianfun AMM
hei_unadded_0771 Dusa
hei_unadded_0773 DX25
hei_unadded_0775 DYORSwap
hei_unadded_0782 E3
hei_unadded_0783 EagleFi
hei_unadded_0785 Earnium
hei_unadded_0791 Eco Exchange
hei_unadded_0792 Econia
hei_unadded_0796 EFC Global
hei_unadded_0797 EGAS swap
hei_unadded_0799 Einax
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

```text
hei_unadded_0754 DoveSwap V3
hei_unadded_0755 DPEX
hei_unadded_0757 DragonSwap V2 Kaia
hei_unadded_0758 DragonSwap V3 (Kaia)
hei_unadded_0759 DragonSwap V3 Kaia
hei_unadded_0760 Drift AMM
hei_unadded_0764 DSWAP
hei_unadded_0772 Dusa Protocol
hei_unadded_0777 DYORSwap (Plasma)
hei_unadded_0778 DyorSwap AMM
hei_unadded_0780 Dystopia
hei_unadded_0781 Dystopia
hei_unadded_0786 Ebisu's bay
hei_unadded_0787 Ebisu's Bay
hei_unadded_0788 EchoDEX
hei_unadded_0789 EchoDEX V2
hei_unadded_0790 EchoDEX V3
hei_unadded_0793 EddyFinance
hei_unadded_0794 EddyFinance AMM
hei_unadded_0795 edgeX Spot
```

Notes:

- DragonSwap, Dusa, DYORSwap, Dystopia, Ebisu's Bay, EchoDEX, and EddyFinance should be treated as clusters if added later.
- Drift and edgeX may be better handled in a dedicated DEX/perps seed phase or separate event-backed review.

## out_of_scope_or_duplicate

```text
hei_unadded_0761 Drip.Trade
hei_unadded_0767 Ducata
hei_unadded_0770 Durianfun Launchpad
hei_unadded_0776 DyorSwap (Monad)
hei_unadded_0779 DyorSwap Launchpad
```

Notes:

- Drip.Trade is marked as NFT Marketplace in the reviewed row.
- Ducata is marked as Yield in the reviewed row.
- Launchpad rows should not be folded into exchange records without a scope decision.
- DYORSwap chain/product variants should not become separate v0 records without a deployment-level methodology.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes recognizable names, especially dYdX, Drift, Dystopia, EchoDEX, EddyFinance, and Ekubo, but adding them now would either create thin records, split cluster variants, or pull active protocol rows into canonical records without a specific event-backed or seed-phase decision.

## Next action

1. Review dYdX separately as a major exchange/protocol cluster.
2. Review Drift and Ekubo separately if stronger event or status sources are available.
3. Keep Dystopia, EchoDEX, EddyFinance, and DYORSwap as cluster candidates for a later DEX/protocol seed phase.
4. Continue scanning `hei_unadded_0801-0850` while avoiding product/version splitting.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
