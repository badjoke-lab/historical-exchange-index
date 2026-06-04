# Pending review: verified-unadded rows 0453-0500

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo preserves the `hei_unadded_0453-0500` scan without promoting weak candidates into canonical records.

This window is dominated by active-looking DEX/protocol rows, chain/version variants, and database-only CEX rows. No candidate in this scan was promoted directly to `records/exchanges/*.json` because the reviewed context did not provide enough meaningful event/evidence value for public-ready HEI records.

## Operating rule

Do not add database-only or `listed_reference`-only candidates to canonical records.

Canonical additions should have clear identity, meaningful event value, preferably two or more evidence items, safe URL/status handling, and no unresolved duplicate or scope concern.

## Classification summary

```text
add_now: 0
needs_research: 11
pending_thin: 23
active_seed_later: 8
out_of_scope_or_duplicate: 6
```

## Reviewed candidate groups

### needs_research

These may be HEI-relevant, but need stronger source, event, duplicate, or scope review before canonical inclusion.

```text
hei_unadded_0455 Capricorn
hei_unadded_0456 Capricorn
hei_unadded_0457 Capricorn Finance
hei_unadded_0458 Capybara Dexs
hei_unadded_0459 CapybaraDEX V2
hei_unadded_0467 Cashierest
hei_unadded_0470 Catex
hei_unadded_0471 Catex
hei_unadded_0482 Cellana
hei_unadded_0488 CEX
hei_unadded_0496 ChainEX
```

Notes:

- Capricorn / Capybara / Catex / Cellana require cluster or duplicate review.
- Cashierest and ChainEX look exchange-like but need stronger event/status/evidence review.
- `CEX` is too ambiguous to add without confirmed identity and domain.

### pending_thin

These were too thin for canonical record creation in this scan, usually database-only or listed-reference-only.

```text
hei_unadded_0453 Canonic
hei_unadded_0454 Canto Dex
hei_unadded_0466 Carbonswap
hei_unadded_0468 CashPayz Exchange
hei_unadded_0469 Catalist DEX
hei_unadded_0473 Cauldron
hei_unadded_0478 CBX
hei_unadded_0479 Ccore
hei_unadded_0480 CCRYPTOEX
hei_unadded_0481 CCXCanada
hei_unadded_0485 Centex
hei_unadded_0489 Cex-Trade
hei_unadded_0491 Cexius
hei_unadded_0492 Cexland
hei_unadded_0493 CexZ
hei_unadded_0494 CGCX
hei_unadded_0495 Chaince
hei_unadded_0500 ChainRift
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

### active_seed_later

These look more suitable for a dedicated active CEX / DEX seed phase than for the current historical-event-first batch.

```text
hei_unadded_0460 Carbon Defi
hei_unadded_0463 Carbon Defi (Ethereum)
hei_unadded_0474 CaviarNine
hei_unadded_0483 Cellana Finance
hei_unadded_0484 Cellana Finance
hei_unadded_0486 Cetus CLMM
hei_unadded_0497 Chainflip
hei_unadded_0499 Chainge Finance
```

Notes:

- Carbon DeFi, CaviarNine, Cellana, Cetus, Chainflip, and Chainge should be considered in DEX/protocol seed work, not as thin one-off rows.
- v0 should avoid splitting chain/deployment variants unless the methodology changes.

### out_of_scope_or_duplicate

These appear to be chain/deployment/submodule variants, category-mismatched items, or duplicate-like rows.

```text
hei_unadded_0461 Carbon DeFi (Celo)
hei_unadded_0462 Carbon DeFi (Celo)
hei_unadded_0464 Carbon DeFi (Ethereum)
hei_unadded_0465 Carbon DeFi (Sei)
hei_unadded_0472 Catton
hei_unadded_0475 CaviarNine Agg
hei_unadded_0476 CaviarNine LSU Pool
hei_unadded_0477 CaviarNine Shape Liquidity
hei_unadded_0487 Cetus DLMM
hei_unadded_0498 Chainflip AMM
```

Notes:

- Carbon DeFi variants should fold into a single Carbon DeFi entity if added later.
- CaviarNine variants should fold into a single CaviarNine entity if added later.
- Cetus DLMM should fold into a Cetus cluster if added later.
- Chainflip AMM should fold into a Chainflip cluster if added later.
- Catton was marked as CDP in the reviewed row and needs scope confirmation before any HEI treatment.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: adding from this window now would mostly increase entity count with thin active/protocol rows, not improve HEI as a historical exchange registry.

## Next action

1. Continue scanning `hei_unadded_0501-0550`.
2. Look for candidates with shutdown, acquisition, rebrand, incident, regulatory, launch, or archive-backed event value.
3. Keep active-looking DEX/CEX clusters for dedicated seed phases.
4. Do not add deployment/variant rows as separate v0 entities.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
