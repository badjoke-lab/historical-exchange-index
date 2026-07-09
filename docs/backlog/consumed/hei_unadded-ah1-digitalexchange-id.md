# D-750 Batch AH1 — digitalexchange.id

Reviewed at: 2026-07-09

## Results

- `0580` Digitalexchange.id -> `hei_ex_000738`, active CEX

## Consolidation and classification

- digitalexchange.id is modeled as one Indonesian centralized exchange entity.
- Web, mobile, market, portfolio, deposit/withdrawal, and support surfaces remain products/components under the same entity.
- Current first-party About, homepage, and market pages support `active` status and `high` confidence.
- The 2018-08-14 date on the About page is treated as company establishment context, not forced into `launch_date` without an exact exchange-launch source.

## Decision notes

digitalexchange.id is promoted from current first-party About, trading-platform, and market evidence.

The first-party About page identifies digitalexchange.id as a crypto-asset buy/sell platform operated by PT Indonesia Digital Exchange, states the company establishment date, and provides leadership and corporate-history context.

The current platform exposes login and registration, buy/sell crypto functionality, portfolio management, IDR and crypto deposits and withdrawals, 24-hour transaction access, and maker/taker trading guidance. The current market page exposes IDR-denominated markets with last price, percentage change, 24-hour high and low, and volume fields.

Exact bundle-path checks on current main found no existing `records/exchanges/digitalexchange-id.json`. Repository PR history contains only the completed 0551-0600 scan reference, which classifies candidate `0580` as `add_now`.

## Dependency note

This branch is based on AG1 head, which is itself based on AF1 head. AF1 owns `hei_ex_000736` and evidence through `hei_src_011520`; AG1 owns `hei_ex_000737` and `hei_src_011521` through `hei_src_011523`; AH1 intentionally begins at `hei_ex_000738` and `hei_src_011524`. Merge order must be AF1 -> AG1 -> AH1.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count after AF1 + AG1 + AH1: 622
- projected event count: 1004
- projected evidence count: 2835
- remaining to D-750 after projected merges: 128

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
