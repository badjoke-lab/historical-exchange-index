# D-750 Batch Q1 — Grvt, Hotcoin, and Giottus

Reviewed at: 2026-07-09

## Results

- `0889` grvt -> `hei_ex_000711`, active hybrid exchange
- `0946` Hotcoin -> `hei_ex_000712`, active CEX
- `0849`/`0850` Giottus duplicate source rows -> `hei_ex_000713`, active CEX

## Consolidation and classification

- Grvt is modeled as a hybrid exchange because current first-party architecture documentation explicitly combines off-chain matching with on-chain settlement and margin management.
- Hotcoin is modeled as one centralized exchange entity, consolidating the Hotcoin Global naming into an alias rather than a separate entity.
- Duplicate Giottus registry source rows are modeled as one Indian centralized exchange entity.

## Decision notes

Grvt is promoted from current first-party architecture, spot-trading, and API documentation. The architecture material describes a hybrid exchange model with off-chain order matching and on-chain settlement; current help and API documentation cover spot markets, perpetual trading, order types, market data, trading APIs, WebSocket feeds, and CCXT integration.

Hotcoin is promoted from current first-party platform, introduction, and API documentation covering spot and leveraged trading, perpetual futures, P2P/C2C services, trading interfaces, apps, and public APIs. The platform states a 2017 founding year, but HEI does not infer an exact launch date from the company-founding statement.

Giottus is promoted from its current first-party website and About page, which identify an Indian cryptocurrency trading platform and describe exchange infrastructure, order matching, banking and payment integrations, security, compliance controls, and founding team. A secondary exchange registry entry is retained only as corroborating discovery evidence.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- duplicate source rows consolidated: 1
- projected entity count: 597
- projected event count: 1004
- projected evidence count: 2760
- remaining to D-750 after projected merge: 153

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
