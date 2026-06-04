# Pending review: verified-unadded rows 0651-0700

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0651-0700` before canonical record creation.

This window contains mostly active-looking DEX/protocol rows, exchange-like database rows, and several cluster candidates such as Cypher, DackieSwap, DeDust, DeepBook, DeFi Kingdoms, DefiPlaza, DefiTuna, and Delta Exchange.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Operating rule

Do not add database-only or `listed_reference`-only candidates to canonical records.

Canonical additions should have clear identity, meaningful event value, preferably two or more evidence items, safe URL/status handling, and no unresolved duplicate or scope concern.

## Classification summary

```text
add_now: 0
needs_research: 7
pending_thin: 23
active_seed_later: 15
out_of_scope_or_duplicate: 5
```

## needs_research

These may be HEI-relevant, but need stronger source, event, duplicate, or scope review before canonical inclusion.

```text
hei_unadded_0653 Cypher
hei_unadded_0672 Dcoin
hei_unadded_0673 DDEX
hei_unadded_0675 Decoin
hei_unadded_0694 DeGate
hei_unadded_0699 delta
hei_unadded_0700 Delta Exchange
```

Notes:

- Cypher may have event-backed history and should be checked separately before any canonical record.
- Dcoin, DDEX, Decoin, DeGate, and Delta Exchange are exchange-like but need stronger event/status evidence before inclusion.
- `delta` and `Delta Exchange` require duplicate / product / venue review before consolidation.

## pending_thin

These were too thin for canonical record creation in this scan, usually database-only or listed-reference-only.

```text
hei_unadded_0651 Cyberblast V3
hei_unadded_0652 Cyberperp
hei_unadded_0657 cytoswap
hei_unadded_0658 Cytoswap
hei_unadded_0659 Dach Exchange
hei_unadded_0663 Daexs
hei_unadded_0664 Dano Finance
hei_unadded_0665 DAO Swap
hei_unadded_0666 dappOS IntentEX
hei_unadded_0667 Darb Finance
hei_unadded_0668 Darb Finance
hei_unadded_0669 Dark KnightSwap
hei_unadded_0670 Darkness
hei_unadded_0671 DataDex
hei_unadded_0680 Deepcoin Derivative
hei_unadded_0684 DeFi Scan
hei_unadded_0685 Defi Swap
hei_unadded_0686 DefiBox
hei_unadded_0687 DefiChain DEX
hei_unadded_0689 DefiPlaza
hei_unadded_0693 DeFive
hei_unadded_0696 Degenswap
hei_unadded_0697 Deliondex
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

These look more suitable for a dedicated active CEX / DEX seed phase than for the current historical-event-first batch.

```text
hei_unadded_0655 Cypher V2
hei_unadded_0656 Cypher V4
hei_unadded_0660 DackieSwap V2
hei_unadded_0661 DackieSwap V3
hei_unadded_0662 DackieSwap V3
hei_unadded_0676 DeDust
hei_unadded_0677 DeDust
hei_unadded_0678 DeepBook V2
hei_unadded_0679 DeepBook V3
hei_unadded_0682 Defi Kingdoms
hei_unadded_0683 Defi Kingdoms (Crystalvale)
hei_unadded_0688 DeFiChain DEX
hei_unadded_0690 DefiPlaza (Radix)
hei_unadded_0691 DefiTuna
hei_unadded_0692 DefiTuna AMM
```

Notes:

- Cypher V2/V4 should be reviewed as part of a Cypher cluster.
- DackieSwap V2/V3 should be handled as one DackieSwap cluster if added later.
- DeDust rows should be consolidated if added later.
- DeepBook V2/V3 should not be split into deployment/version records without a methodology decision.
- DeFi Kingdoms and DefiTuna rows are active/protocol candidates and should be handled in a later seed phase.

## out_of_scope_or_duplicate

These appear to be card issuer rows, product/version variants, launchpad/games/prediction market rows, or non-exchange categories.

```text
hei_unadded_0654 Cypher Card
hei_unadded_0674 death.fun
hei_unadded_0681 Deeptrade
hei_unadded_0695 Degen Express
hei_unadded_0698 Delphi
```

Notes:

- Cypher Card is marked as a crypto card issuer and should not be folded into a DEX/exchange entity without a scope decision.
- death.fun, Deeptrade, Degen Express, and Delphi are category/scope-mismatched candidates for HEI v0 unless exchange functionality is confirmed.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes several recognizable names, but adding them now would either create thin records, split version/deployment clusters, or pull product/category rows into canonical records too early.

## Next action

1. Review Cypher separately for possible event-backed history.
2. Review DDEX and Delta Exchange separately if stronger status/event sources are available.
3. Continue scanning `hei_unadded_0701-0750` while avoiding version/deployment splitting.
4. Keep active DEX/protocol clusters for a dedicated seed phase.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
