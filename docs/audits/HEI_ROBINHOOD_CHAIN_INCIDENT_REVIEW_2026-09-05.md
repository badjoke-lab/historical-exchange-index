# HEI Robinhood Chain incident review — 2026-09-05

Status: **HOLD — monitoring/research only; no canonical mutation**  
Scope: reported Robinhood Chain disruption on 2026-09-04 and HEI exchange records that explicitly depend on Robinhood Chain

## Trigger

A public social alert on 2026-09-04 reported that Robinhood Chain was down and pointed to the Robinhood Chain Blockscout explorer. The social post is treated as a discovery trigger only, not as canonical HEI evidence.

## Reviewed public reporting

Two current reports materially disagree about what happened:

- BeInCrypto reports that Robinhood Chain stopped producing blocks for at least 14 minutes and that transactions stalled. It says Robinhood had not disclosed the cause at publication time: `https://beincrypto.com/robinhood-chain-outage-blocks-stalled/`.
- Crypto Briefing reports the opposite interpretation: Robinhood Chain continued producing L2 blocks while Ethereum blob submissions stopped for roughly 14 minutes, with the sequencer continuing to run: `https://cryptobriefing.com/robinhood-chain-blob-gap-ethereum-disruption/`.

The relevant public explorer is `https://robinhoodchain.blockscout.com/`.

This review did not capture a reproducible first-party incident statement or a durable block-level proof that resolves the conflict between an L2 execution halt and an L1 data-posting/blob gap. HEI therefore must not turn the headline into a reviewed lifecycle event yet.

## HEI scope

Robinhood Chain is infrastructure, not an exchange entity, so no new HEI entity should be created for the chain itself.

Current reviewed exchange bundles that explicitly name Robinhood Chain are:

- `records/exchanges/arcus.json` — Arcus is modeled as an active DEX on the Robinhood Chain ecosystem.
- `records/exchanges/rialto.json` — Rialto is modeled as an active DEX spanning Robinhood Chain and Arbitrum ecosystems.
- `records/exchanges/based.json` — Based is modeled as an active DEX/trading interface spanning Hyperliquid, Polygon, and Robinhood Chain ecosystems.

HEI already supports `chain_shutdown_impact` as a reviewed event type. `records/exchanges/mantra-finance.json` provides the existing precedent: a chain-level halt can be recorded as `chain_shutdown_impact` without reclassifying the exchange itself as hacked or dead when the evidence supports only infrastructure disruption.

## Canonical decision

Do **not** add a Robinhood Chain incident event to Arcus, Rialto, or Based in this review.

Do **not** change any of their entity statuses. They remain `active` unless separate reviewed evidence establishes a status change.

Do **not** assign `death_reason`.

The canonical gate is:

1. obtain a first-party Robinhood/Robinhood Chain incident statement, or durable direct block-level evidence, that resolves whether L2 execution actually stopped;
2. establish the material impact on each exchange record individually rather than propagating one chain headline to every multi-chain venue;
3. only then open a separate reviewed canonical PR.

If a true L2 execution halt is proven:

- Arcus is the strongest `chain_shutdown_impact` candidate because its reviewed record is explicitly Robinhood-Chain based;
- Rialto requires evidence that its Robinhood venue/execution path was affected; its Arbitrum presence means the whole entity must not be assumed unavailable;
- Based requires evidence that its Robinhood-connected trading surface or routing was materially affected; its multi-ecosystem platform must not be marked broadly limited from the chain event alone.

If the evidence instead confirms only an Ethereum blob/data-posting gap while L2 execution continued, no exchange lifecycle event should be added from this incident.

## Monitoring gap found

The current monitoring news query set covers exchange shutdowns, hacks, suspensions, regulatory events, and acquisition/migration/rebrand events, but it has no dedicated chain/sequencer/block-production outage category even though `chain_shutdown_impact` is a supported canonical event type.

A second query-selection problem also exists: the normal news query cap is 20 while the pre-change query groups contain 25 queries. The old flatten-then-slice implementation can therefore silently starve categories placed later in the list.

This branch repairs both monitoring gaps by:

- adding a `chain_infrastructure_outage` query group mapped to `chain_shutdown_impact`;
- changing capped query selection to balanced round-robin category coverage;
- adding a smoke regression that requires every current news category, including chain infrastructure, to survive the normal 20-query cap;
- updating the monitoring operations runbook.

## Canonical impact

```text
entities: 0
events:   0
evidence: 0
```

This audit is intentionally monitoring/research only. Canonical lifecycle changes, if later justified, must be made in a separate reviewed data PR.
