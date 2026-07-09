# D-750 Batch AB1 — Coins.ph

Reviewed at: 2026-07-09

## Results

- `0424` coinsph -> `hei_ex_000733`, active CEX

## Consolidation and classification

- Coins.ph is modeled as one centralized exchange entity despite also providing wallet, payments, remittance, and broader financial-service surfaces.
- Coins Pro is treated as a professional trading product/alias under the same Coins.ph exchange entity rather than a separate HEI entity.
- The launch date is stored as `2014-01-01` because the first-party About page gives January 2014 rather than an exact day.

## Decision notes

Coins.ph is promoted from current first-party About, trading-platform, and developer documentation.

The first-party About page states that Coins.ph launched in 2014, identifies it as an established Philippine crypto brand, and states Bangko Sentral ng Pilipinas regulation. The current platform exposes Spot trading with live order books, Markets, institutional OTC/FX, Coins Pro professional exchange access, crypto exchange services, login, and signup flows.

The current Coins.ph developer hub publishes API documentation, reference material, product and service documentation, integration guides, and a changelog.

The completed 0401-0450 scan classifies candidate `0424` as `add_now`. Exact bundle-path checks on current main found no existing `records/exchanges/coinsph.json`.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 617
- projected event count: 1004
- projected evidence count: 2820
- remaining to D-750 after projected merge: 133

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
