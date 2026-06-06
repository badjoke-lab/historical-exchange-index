# Pending review: verified-unadded rows 0851-0900

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0851-0900` before canonical record creation.

This window contains mostly database-only CEX rows, active-looking DEX/protocol rows, product/category rows, and cluster candidates such as EXMO, FameEX, Fathom, Fenix, and Ferra. ezBtc and ExtStock are flagged for separate historical-status review.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Classification summary

```text
add_now: 0
needs_research: 8
pending_thin: 24
active_seed_later: 12
out_of_scope_or_duplicate: 6
```

## needs_research

```text
hei_unadded_0870 ExMarkets
hei_unadded_0871 Exmo
hei_unadded_0872 EXMO
hei_unadded_0876 ExtStock
hei_unadded_0878 ezBtc
hei_unadded_0880 FameEX
hei_unadded_0881 FameEX
hei_unadded_0889 Fatbtc
```

Notes:

- EXMO and FameEX should be reviewed as clusters, not as duplicate rows.
- ezBtc may have historical/regulatory value and should be checked separately before canonical inclusion.
- ExtStock is marked inactive in the candidate row and needs stronger shutdown/status evidence before inclusion.
- ExMarkets and Fatbtc look exchange-like but need stronger identity, status, and event evidence before canonical inclusion.

## pending_thin

```text
hei_unadded_0851 Ethex
hei_unadded_0852 Etor
hei_unadded_0854 EurekaX
hei_unadded_0856 Everdex
hei_unadded_0857 EverySwap
hei_unadded_0859 EX24
hei_unadded_0860 Ex4ange
hei_unadded_0862 Exbito
hei_unadded_0863 Exbitron
hei_unadded_0864 EXC Cripto
hei_unadded_0865 Excalibur
hei_unadded_0866 Exchange BDCASH
hei_unadded_0867 eXchangily
hei_unadded_0868 EXCOINCIAL
hei_unadded_0869 ExinSwap
hei_unadded_0873 EXNCE
hei_unadded_0874 Exrates
hei_unadded_0875 Extrading
hei_unadded_0877 EXX
hei_unadded_0879 FairySwap V1
hei_unadded_0883 Fanáticos Criptos
hei_unadded_0886 Fargobase
hei_unadded_0892 Fcex Exchange
hei_unadded_0893 FCON DEX
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

```text
hei_unadded_0853 EulerSwap
hei_unadded_0884 FanX Protocol
hei_unadded_0885 FanX Protocol
hei_unadded_0890 Fathom AMM
hei_unadded_0891 Fathom DEX
hei_unadded_0894 FeeFree
hei_unadded_0895 Fenix Concentrated Liquidity
hei_unadded_0896 Fenix Finance
hei_unadded_0897 Fenix Standard Pools
hei_unadded_0898 Ferra (DLMM)
hei_unadded_0899 Ferra CLMM
hei_unadded_0900 Ferra DLMM
```

Notes:

- Fathom, Fenix, and Ferra should be handled as clusters if added later.
- Chain/version/product rows should not be split into separate v0 entities without a deployment-level methodology.
- EulerSwap and FanX Protocol are active-looking DEX/protocol candidates better suited for a dedicated seed phase.

## out_of_scope_or_duplicate

```text
hei_unadded_0855 evently
hei_unadded_0858 EVplusAI
hei_unadded_0861 Exa Card
hei_unadded_0882 FameEX Derivatives
hei_unadded_0887 FarmCats Market
hei_unadded_0888 FastJPEG
```

Notes:

- evently is marked as Prediction Market in the reviewed row.
- EVplusAI is marked as Interface.
- Exa Card is marked as Crypto Card Issuer.
- FameEX Derivatives should not be split from FameEX without a product/venue methodology decision.
- FarmCats Market is marked as NFT Marketplace.
- FastJPEG is marked as Launchpad.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes recognizable names, especially EXMO, ezBtc, ExtStock, FameEX, Fathom, Fenix, and Ferra, but adding them now would either create thin records, split product/version clusters, or require separate historical event review.

## Next action

1. Review ezBtc separately as a possible event-backed historical CEX record.
2. Review EXMO as an active CEX cluster if meaningful event history is confirmed.
3. Review ExtStock only if stronger shutdown/inactivity evidence is found.
4. Keep Fathom, Fenix, and Ferra as cluster candidates for later DEX/protocol seed work.
5. Continue scanning `hei_unadded_0901-0950` while avoiding product/version splitting.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
