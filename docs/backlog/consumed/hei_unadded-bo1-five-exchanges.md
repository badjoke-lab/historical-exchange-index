# D-1000 Batch BO1 — AstroSwap, BCSwap, Beamex AMM, Baseline (Base), and Blitz AMM

Reviewed at: 2026-07-12

## Results

- `0098` AstroSwap -> `hei_ex_000887`, limited DEX
- `0147` BCSwap -> `hei_ex_000888`, limited DEX
- `0149` Beamex AMM -> `hei_ex_000889`, limited DEX
- `0139` Baseline (Base) -> `hei_ex_000890`, active DEX
- `0246` Blitz AMM -> `hei_ex_000891`, limited DEX

Additional repair:

- `hei_ex_000541` AutoShark remains dead; former official domain status repaired from `dead_domain` to `unsafe`, with one new URL-history evidence record.

## Status decisions

- AstroSwap is `limited`, not `active` or `dead`, because its first-party site and residual Velas TVL remain while recent trading is negligible or zero.
- BCSwap is `limited`, not `active` or `dead`, because its BCHyper identity and reachable project domain remain while tracked TVL is zero and a functioning trading interface was not independently verified.
- Beamex AMM is `limited`, not `active` or `dead`, because substantial cumulative Moonbeam volume remains documented while strong recent activity and a stable first-party application were not recovered.
- Baseline (Base) is `active` because its first-party trading application remains reachable and current exchange data reports recently updated markets and material 24-hour volume.
- Blitz AMM is `limited`, not `active` or `dead`, because substantial cumulative Blast exchange volume remains documented while recent activity evidence and a stable first-party application were not recovered.
- AutoShark remains `dead` because the 2022 first-party shutdown announcement is authoritative. Residual third-party metrics do not override the terminal event.

## URL safety repair

The former AutoShark official domain now serves unrelated gambling content.

HEI therefore changes:

```text
official_url_status: dead_domain -> unsafe
```

The canonical shutdown history and death date remain unchanged. The repair prevents the repurposed domain from being presented as a safe current exchange destination.

## Stale-overlap findings

The verified-unadded backlog contained rows that already resolve to reviewed entities. BO1 excluded, among others:

- Astroport variants, Astrovault, Atlantis, Atmos, Auragi, AuroraSwap, and AutoShark.
- AuraSwap, already reviewed as `hei_ex_000554` under `auraswap-polygon`.
- BarterSwap Superposition, already reviewed as `hei_ex_000560` under `barter`.
- Basin Exchange, already reviewed as `hei_ex_000557` under `basin`.
- Beam Swap, already represented by existing Beam network / Beamswap records.
- AUX Exchange, Axial, BabyDogeSwap, BabySwap, BaseX, Bancor, Bean Exchange, BenSwap, Beralis V3, BetterSwap, BEVMSwap, and BisonFi.

These stale rows were not duplicated.

## Evidence decisions

### AstroSwap

The first-party site remains reachable. Current protocol data preserves residual TVL and cumulative history but almost no recent trading. Confidence is `medium`.

### BCSwap

The project domain remains reachable and current registry data preserves the BCHyper AMM identity, but tracked TVL is zero. Confidence is `medium`.

### Beamex AMM

Current registry data preserves the Moonbeam exchange identity and roughly $75 million in cumulative volume, but does not establish strong recent activity. Confidence is `medium`.

### Baseline (Base)

The first-party application remains reachable. Current exchange data reports four coins, five pairs, recently updated markets, and material non-zero 24-hour volume. Confidence is `medium`.

### Blitz AMM

Current registry data preserves the Blast order-book exchange identity and roughly $140 million in cumulative volume, but recent activity evidence is insufficient. Confidence is `medium`.

### AutoShark repair

The former project domain is currently repurposed into unrelated gambling content. The existing high-confidence 2022 shutdown record remains authoritative; the repair concerns URL safety only.

## Batch output

- new entities: 5
- repaired entities: 1
- new events: 0
- new evidence: 16
- projected entity count: 775
- projected event count: 1004
- projected evidence count: 3295
- projected remaining to D-1000: 225

## Operating mode

BO1 is the fifth five-entity D-1000 growth batch during the L-2 initial HOLD period. It also includes one safety-preserving repair. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.