# HEI C1 candidate scan 01 — corrected 2026-06-22

## Corrected result

The first Phase C scan covered 42 candidates, but its initial duplicate decisions were stale because the B2 resolution index had not been reconciled against all reviewed record bundles.

A projected-public overlap audit performed before C2 record creation found 12 candidates already represented by public HEI entities.

```text
Candidates reviewed:             42
Add now:                          1
Needs further research:           0
Pending thin:                    29
Already canonical / duplicate:   12
```

No canonical entity, event, or evidence record changed in this correction.

## Already-canonical corrections

```text
Aevo Perps                 -> hei_ex_000519 Aevo
Byte Exchange              -> hei_ex_000416 Byte Exchange
Curve DEX                  -> hei_ex_000511 Curve Finance
dYdX V3                    -> hei_ex_000517 dYdX
dYdX V4                    -> hei_ex_000517 dYdX
Gains Network              -> hei_ex_000515 gTrade
Joe DEX                    -> hei_ex_000520 LFJ
Jupiter Perpetual Exchange -> hei_ex_000518 Jupiter
Orca DEX                   -> hei_ex_000513 Orca
Osmosis DEX                -> hei_ex_000514 Osmosis
Quickswap Dex              -> hei_ex_000512 QuickSwap
Thorchain DEX              -> hei_ex_000516 THORChain
```

The first C1 review had correctly reasoned about several entity names and product boundaries, but incorrectly treated these identities as unadded. The correction changes their resolution state to `already_canonical`, adds the canonical target ID, and removes them from growth batches.

## Corrected first growth batch

```text
DX.Exchange
```

DX.Exchange is the only reviewed `add_now` candidate from the original priority set that does not overlap the projected public registry.

## Pending-thin queue

Twenty-nine held candidates remain `pending_thin`. They are not rejected, but they do not yet meet the complete public-record source and entity-boundary requirements.

## Root cause

The original candidate-scan gate verified the stored `duplicate_status` and required open resolution coverage, but it did not independently compare candidate names, proposed canonical names, aliases, and product/version labels against the projected public entity set.

This allowed stale `held` and `needs_research` entries to survive after their corresponding reviewed bundles had already entered the public registry.

## Permanent safeguards

The corrected gates now verify:

- every open resolution candidate against projected entity canonical names, slugs, and aliases;
- proposed canonical names and proposed aliases against projected entities;
- open candidates fail validation when they overlap a public entity;
- `already_canonical` entries require a valid `target_entity_id`;
- candidate identities must resolve to that target entity;
- terminal duplicate states require `out_of_scope_or_duplicate` disposition;
- `add_now` candidates cannot overlap projected entities unless they have subsequently been promoted;
- the candidate scan may retain historical reviewed entries while current open resolution entries must remain covered.

## Resolution-state impact

```text
promoted:          14
held:              29
out_of_scope:       8
duplicate:          0
already_canonical: 14
needs_research:     1
```

The remaining `needs_research` entry is DX.Exchange until its reviewed record bundle is promoted.

## Public count impact

```text
Entities:  412
Events:    691
Evidence: 1620
```

## Next step

Draft and validate the DX.Exchange record bundle. Before selecting later growth batches, run the projected-public overlap gate against the remaining 29 pending-thin candidates.
