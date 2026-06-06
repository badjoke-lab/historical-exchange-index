# Pending review: verified-unadded rows 0901-0950

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0901-0950` before canonical record creation.

This window contains mostly active-looking DEX/protocol rows, thin CEX/exchange-like rows, product/category rows, and cluster candidates such as Ferro, Figure Markets, Firefly, FlowSwap, FlowX, Fluid, FluxBeam, Fluxion, FMFW.io, and Ferra-adjacent continuity from the prior scan. ForkDelta is flagged for separate historical DEX review because of its relationship to EtherDelta-era DEX history.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Classification summary

```text
add_now: 0
needs_research: 7
pending_thin: 19
active_seed_later: 17
out_of_scope_or_duplicate: 7
```

## needs_research

```text
hei_unadded_0907 Figure Markets
hei_unadded_0912 Fisco
hei_unadded_0920 FlatQube
hei_unadded_0941 Flybit
hei_unadded_0942 FMFW.io
hei_unadded_0943 FMFW.io
hei_unadded_0947 ForkDelta
```

Notes:

- Figure Markets is a recognizable active venue but needs stronger event/status evidence before canonical inclusion.
- Fisco, Flybit, and FMFW.io are exchange-like rows that need cluster/status/event review.
- FlatQube is a recognizable DEX candidate but needs separate source/event review.
- ForkDelta should be reviewed separately as a possible historical DEX record, not merged automatically into EtherDelta.

## pending_thin

```text
hei_unadded_0903 fex
hei_unadded_0904 Fibercoin Exchange
hei_unadded_0905 Fibonacci Dex
hei_unadded_0906 Fides Exchange
hei_unadded_0913 Five Star Exchange
hei_unadded_0916 Flaexchange
hei_unadded_0917 Flame
hei_unadded_0918 Flamingo Finance
hei_unadded_0919 Flashnet
hei_unadded_0921 Float SV
hei_unadded_0923 FlowSwap
hei_unadded_0924 FlowSwap
hei_unadded_0936 FluxBeam
hei_unadded_0938 FluxFlow V3
hei_unadded_0939 Fluxion
hei_unadded_0940 Fluxion Network
hei_unadded_0944 Folgory
hei_unadded_0945 Forest V1
hei_unadded_0946 Forge
hei_unadded_0948 Fortaleza
hei_unadded_0949 Forus Platform
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

```text
hei_unadded_0901 Ferro
hei_unadded_0902 Ferro Protocol
hei_unadded_0909 firefly
hei_unadded_0910 Firefly
hei_unadded_0911 First Ledger
hei_unadded_0925 FlowSwap V2
hei_unadded_0926 FlowSwap V3
hei_unadded_0927 FlowX CLMM
hei_unadded_0928 FlowX V2
hei_unadded_0929 FlowX V3
hei_unadded_0930 Fluid (Arbitrum)
hei_unadded_0931 Fluid (Ethereum)
hei_unadded_0932 Fluid (Ethereum)
hei_unadded_0933 Fluid (Plasma)
hei_unadded_0934 Fluid DEX
hei_unadded_0935 Fluid DEX Lite
```

Notes:

- Ferro, Firefly, FlowSwap, FlowX, and Fluid should be handled as clusters if added later.
- Chain/version/product rows should not be split into separate v0 entities without a deployment-level methodology.
- First Ledger may be an active exchange-like seed candidate but needs separate methodology review.

## out_of_scope_or_duplicate

```text
hei_unadded_0908 Figure Markets Exchange
hei_unadded_0914 Fjord V1
hei_unadded_0915 Fjord V2
hei_unadded_0922 FlowBot Prediction
hei_unadded_0950 four.meme
```

Notes:

- Figure Markets Exchange is marked as OTC Marketplace and should be reviewed with Figure Markets before any split.
- Fjord V1/V2 and four.meme are marked as Launchpad.
- FlowBot Prediction is marked as Interface.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes recognizable names, especially Figure Markets, FlatQube, FMFW.io, Fluid, and ForkDelta, but adding them now would either create thin records, split product/version clusters, or require separate historical event review.

## Next action

1. Review ForkDelta separately as a possible historical DEX record.
2. Review FMFW.io as a possible exchange rebrand/history cluster if stronger evidence is available.
3. Keep Ferro, Firefly, FlowSwap, FlowX, Fluid, FluxBeam, and Fluxion as cluster candidates for later DEX/protocol seed work.
4. Continue scanning `hei_unadded_0951-1000` while avoiding product/version splitting.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
