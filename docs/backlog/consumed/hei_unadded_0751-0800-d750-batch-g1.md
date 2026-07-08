# Range 0751-0800 D-750 Batch G1

Reviewed at: 2026-07-08

## Results

- `0756` Figure Markets plus `0757` OTC marketplace row -> `hei_ex_000689`, active hybrid
- `0760` First Ledger -> `hei_ex_000690`, active DEX
- `0779`-`0784` Fluid chain/DEX/Lite rows -> `hei_ex_000691`, active DEX

## Consolidation handling

- Figure Markets and the OTC marketplace source representation are modeled as one Figure Markets entity.
- Fluid Arbitrum, Ethereum, Plasma, generic DEX, and DEX Lite source rows are modeled as one Fluid DEX entity.

## Decision notes

Figure Markets is promoted from its current first-party exchange website and Figure corporate material. The current platform exposes Exchange, Trade, and Pro Trade products and emphasizes decentralized custody, on-chain control, and Provenance Blockchain settlement; HEI therefore classifies it as hybrid. First Ledger is promoted from its current first-party trading platform and documentation, both of which identify XRPL trading and DEX functionality. Fluid DEX is promoted from current first-party technical documentation covering DEX V2, DEX, DEX Lite, swap routing, liquidity-source integration, and active contract architecture.

ForkDelta is not consumed by this batch despite high historical value because its lifecycle, predecessor relationship, and current/terminal state require a dedicated historical record rather than an active-style thin entity bundle.

Flamingo Finance remains outside this batch because the live first-party frontend is JavaScript-only and stronger public documentation/history sources are being collected before classification. FlowX also remains for separate source review.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- product/deployment/source rows consolidated: 6
- projected entity count: 575
- projected event count: 1004
- projected evidence count: 2694
- remaining to D-750 after projected merge: 175

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
