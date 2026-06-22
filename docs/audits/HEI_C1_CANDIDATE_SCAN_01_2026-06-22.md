# HEI C1 candidate scan 01 — 2026-06-22

## Result

The first Phase C scan covers every open candidate in the B2 authoritative resolution index.

```text
Candidates reviewed:        42
Add now:                    10
Needs further research:      1
Pending thin:               31
Out of scope or duplicate:   0
```

No canonical entity, event, or evidence record changed in this scan PR.

## Review standard

An `add_now` decision requires:

- a distinct HEI exchange identity;
- no canonical duplicate or unresolved alias collision;
- a likely exchange type and operating status;
- at least one official source;
- at least one independent source;
- at least one meaningful lifecycle event;
- at least two expected evidence records;
- medium or high review confidence;
- assignment to a fixed growth batch.

Candidates that do not yet meet this shape remain `needs_research` or `pending_thin`.

## Priority review decisions

### First growth batch — eight entities

```text
Curve Finance
DX.Exchange
dYdX
LFJ
Orca
Osmosis
QuickSwap
THORChain
```

These candidates have a distinct entity boundary, clear duplicate result, official and independent source coverage, and sufficient expected event/evidence shape for record drafting.

Entity-name corrections applied before drafting:

- `Curve DEX` → `Curve Finance`;
- `dYdX V4` → `dYdX`, with V4 modeled as platform evolution;
- `Joe DEX` → `LFJ`, with Trader Joe retained as an alias and rebrand stage;
- `Orca DEX` → `Orca`;
- `Osmosis DEX` → `Osmosis`;
- `Quickswap Dex` → `QuickSwap`;
- `Thorchain DEX` → `THORChain`.

`DX.Exchange` remains the canonical historical name.

### Second growth batch — two entities

```text
Aevo
gTrade
```

- `Aevo Perps` is treated as a product surface of the distinct Aevo derivatives exchange;
- `Gains Network` is retained as a builder/protocol alias while the exchange identity is modeled as `gTrade`.

Both require one additional chronology check during record drafting but meet the minimum add-now source shape.

### Still needs research — one candidate

```text
Jupiter Perpetuals
```

Official material supports the existence of a perpetual exchange product, but the entity boundary versus the wider Jupiter trading platform remains unresolved. The candidate is not assigned to a growth batch until an independent launch/status source and a stable identity decision are available.

## Pending-thin queue

Thirty-one previously held candidates remain `pending_thin`. They are not rejected, but they currently lack sufficient official and independent source coverage or a settled entity boundary for public record drafting.

## Permanent safeguards

The C1 scan gate verifies:

- the scan exactly covers all open B2 resolution entries;
- candidate keys are unique;
- terminal resolution entries cannot enter the scan;
- scan size remains within the planned 30–50 candidate range;
- every candidate has one allowed disposition;
- `add_now` entries meet the complete source, identity, event, evidence, confidence, and batch-assignment requirements;
- first-growth-batch entries are all reviewed `add_now` candidates;
- stored disposition counts match the manifest contents.

## Count impact

```text
Entities:  412
Events:    691
Evidence: 1620
```

## Next step

Draft reviewed record bundles for the first growth batch of eight entities. The batch may be split into smaller implementation PRs, but the selected identities and canonical naming decisions are fixed by this scan.
