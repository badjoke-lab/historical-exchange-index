# D-1000 Batch BO1 — Four New Entities, BMX Trade Enrichment, and AutoShark Repair

Reviewed at: 2026-07-12

## Results

New entities:

- `0098` AstroSwap -> `hei_ex_000887`, limited DEX
- `0147` BCSwap -> `hei_ex_000888`, limited DEX
- `0149` Beamex AMM -> `hei_ex_000889`, limited DEX
- `0245` BLEX -> `hei_ex_000890`, active DEX

Existing entity enrichment:

- `0261` BMX Classic AMM -> existing `hei_ex_000610` BMX Trade, entity-first alias and evidence consolidation

Additional repair:

- `hei_ex_000541` AutoShark remains dead; former official domain status repaired from `dead_domain` to `unsafe`, with one new URL-history evidence record.

## Status decisions

- AstroSwap is `limited` because its first-party site and residual Velas TVL remain while recent trading is negligible or zero.
- BCSwap is `limited` because its BCHyper identity and reachable project domain remain while tracked TVL is zero and a functioning trading interface was not independently verified.
- Beamex AMM is `limited` because substantial cumulative Moonbeam volume remains documented while strong recent activity and a stable first-party application were not recovered.
- BLEX is `active` because current Arbitrum data reports non-zero TVL, fee generation, and substantial perpetual volume.
- BMX Trade remains `active`. BMX Classic AMM is not a separate entity because it shares the `bmx.trade` domain and Morphex/BMX identity; its aliases, Base and Mode coverage, and cumulative-volume evidence are consolidated into BMX Trade.
- AutoShark remains `dead` because the 2022 first-party shutdown announcement is authoritative.

## URL safety repair

The former AutoShark official domain now serves unrelated gambling content.

```text
official_url_status: dead_domain -> unsafe
```

The canonical shutdown history and death date remain unchanged. The repair prevents the repurposed domain from being presented as a safe current exchange destination.

## Stale-overlap findings

The verified-unadded backlog contains extensive stale version, slug, product, domain, and alias rows. During BO1, the overlap gate rejected or consolidated:

- AuraSwap -> existing `hei_ex_000554`
- BarterSwap Superposition -> existing `hei_ex_000560`
- Basin Exchange -> existing `hei_ex_000557`
- Beam Swap -> existing Beam network / Beamswap records
- Baseline (Base) -> existing `hei_ex_000556`
- Blitz AMM -> existing `hei_ex_000596`
- bopAMM -> existing Bebop `hei_ex_000609`
- BMX Classic AMM -> existing BMX Trade `hei_ex_000610`

Other reviewed overlaps include Astroport variants, Astrovault, Atlantis, Atmos, Auragi, AuroraSwap, AutoShark, AUX Exchange, Axial, BabyDogeSwap, BabySwap, BaseX, Bancor, Bean Exchange, BenSwap, Beralis V3, BetterSwap, BEVMSwap, BisonFi, Blue Planet, and BrownFi.

These rows were not duplicated.

## Evidence decisions

### AstroSwap

The first-party site remains reachable. Current protocol data preserves residual TVL and cumulative history but almost no recent trading. Confidence is `medium`.

### BCSwap

The project domain remains reachable and current registry data preserves the BCHyper AMM identity, but tracked TVL is zero. Confidence is `medium`.

### Beamex AMM

Current registry data preserves the Moonbeam exchange identity and roughly $75 million in cumulative volume, but does not establish strong recent activity. Confidence is `medium`.

### BLEX

Current Arbitrum protocol data reports non-zero TVL, annualized fees, cumulative fees, and roughly $40 million in cumulative perpetual volume. Confidence is `medium`.

### BMX Trade enrichment

Current registry data preserves the BMX Classic AMM product name, Base and Mode chain associations, and roughly $690 million in cumulative DEX volume. Because the product resolves to the same `bmx.trade` domain and Morphex/BMX identity as existing BMX Trade, the evidence is attached to `hei_ex_000610` rather than creating a second entity.

### AutoShark repair

The former project domain is currently repurposed into unrelated gambling content. The existing high-confidence 2022 shutdown record remains authoritative; the repair concerns URL safety only.

## Batch output

- new entities: 4
- enriched entities: 1
- repaired entities: 1
- new events: 0
- new evidence: 16
- projected entity count: 774
- projected event count: 1004
- projected evidence count: 3295
- projected remaining to D-1000: 226

## Operating mode

BO1 is the fifth D-1000 growth batch during the L-2 initial HOLD period. It preserves entity-first counting, adds reviewed canonical data, enriches one existing record, and includes one safety repair. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
