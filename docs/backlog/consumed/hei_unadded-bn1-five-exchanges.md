# D-1000 Batch BN1 — Archer Exchange, ArtexSwap, Asset Chain Swap, Astrolescent, and AquaSpace V3

Reviewed at: 2026-07-12

## Results

- `0074` Archer Exchange -> `hei_ex_000882`, active DEX
- `0076` ArtexSwap -> `hei_ex_000883`, limited DEX
- `0085` Asset Chain Swap -> `hei_ex_000884`, active DEX
- `0088` Astrolescent -> `hei_ex_000885`, active DEX
- `0067` AquaSpace V3 -> `hei_ex_000886`, active DEX

## Status decisions

- Archer Exchange is `active` because its first-party site remains reachable and current Solana data reports TVL, substantial recent volume, active addresses, and transactions.
- ArtexSwap is `limited`, not `active` or `dead`, because its Artela exchange identity and cumulative history remain while current TVL and recent fee windows are zero and no verified shutdown announcement was recovered.
- Asset Chain Swap is `active` because its first-party application remains reachable and current Asset Chain data reports liquidity, fees, and non-zero recent volume.
- Astrolescent is `active` because current Radix data reports liquidity, staked value, and non-zero 24-hour, 7-day, and 30-day volume.
- AquaSpace V3 is `active` because the PumpSpace application remains reachable and current exchange data reports recently updated markets and substantial 24-hour volume.

## Entity-first decisions

- AquaSpace V3 remains the canonical exchange identity; PumpSpace is retained as an alias and current application brand.
- Version labels and application brands are not split into additional entities.

## Stale-overlap findings

The verified-unadded backlog also contained rows that already resolve to reviewed entities:

- `0075` Archly V1 and `0077` Archly V2 already resolve to `hei_ex_000538`.
- `0079` Ascent Exchange V1 and `0080` Ascent Exchange V3 already resolve to `hei_ex_000535`.
- `0083` Ashswap already resolves to `hei_ex_000528`.
- `0086` Aster Spot already resolves to `hei_ex_000529`.

These stale rows were excluded from BN1 and were not duplicated.

## Evidence decisions

### Archer Exchange

The first-party site remains reachable. Current Solana protocol data reports TVL, substantial recent volume, active addresses, and transactions. Confidence is `medium`.

### ArtexSwap

Current registry data preserves the Artela-native AMM and its cumulative history, but current TVL and recent fees are zero. Confidence is `medium`, and status is limited.

### Asset Chain Swap

The first-party application remains reachable. Current Asset Chain protocol data reports liquidity, fees, and recent DEX volume. Confidence is `medium`.

### Astrolescent

Current Radix data reports liquidity, staked protocol value, and non-zero recent spot volume. A stable first-party application URL was not promoted. Confidence is `medium`.

### AquaSpace V3

The PumpSpace JavaScript application remains reachable. Current CoinGecko data reports recently updated Avalanche markets, 11 coins, 30 pairs, and substantial 24-hour volume. Confidence is `medium`.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 770
- projected event count: 1004
- projected evidence count: 3279
- projected remaining to D-1000: 230

## Operating mode

BN1 is the fourth five-entity D-1000 growth batch during the L-2 initial HOLD period. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.