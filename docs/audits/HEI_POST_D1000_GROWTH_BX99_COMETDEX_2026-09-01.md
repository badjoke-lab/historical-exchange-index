# HEI post-D1000 growth audit — BX99 CometDEX

Date: 2026-09-01

## Scope

Resolve open Issue #921 for Comet / CometDEX on Stellar as a full HEI entity + incident event + evidence package rather than an exploit-only thin record.

## Identity decision

- canonical entity: `hei_ex_001190`
- canonical name: `CometDEX`
- aliases: `Comet`, `Comet AMM`
- type: `dex`
- origin: `Stellar ecosystem`

Current repository search on main found no canonical Comet / CometDEX / Comet AMM record before allocation.

## Current-state decision

Status is `limited`.

First-party CometDEX repositories establish the Soroban AMM identity. Current Stellar technical indexing states that the only mainnet Comet deployment is Blend Backstop V2 and that Comet is not actively maintained as a standalone DEX. The affected backstop is currently paused/empty after the August exploit.

This supports neither an unqualified `active` classification nor terminal `dead`/`inactive` status. HEI therefore preserves a conservative `limited` state pending stronger evidence of independent exchange operation or permanent cessation.

## Incident decision

Event `hei_ev_010214` records the 2026-08-25 exploit.

SlowMist reports that the BLND-USDC CometDEX pool on Stellar was exploited through an accounting bug allowing same-asset USDC-to-USDC swaps to corrupt reserve calculations, with approximately 717,518.92 USDC lost. Contemporary Stellar ecosystem reporting corroborates the incident and subsequent recovery/remediation activity.

The event is scoped to the affected pool/backstop deployment and does not imply that every deployment of Comet code ceased permanently.

## Precision boundaries

- `launch_date`: `null`; no exact launch date promoted.
- `death_date`: `null`; no terminal date established.
- `death_reason`: `null`; the exploit is not treated as proof of terminal death.
- no fabricated shutdown or recovery event is added.

## Evidence

- `hei_src_012753` — first-party CometDEX contract repository
- `hei_src_012754` — current Stellar Index technical deployment audit
- `hei_src_012755` — SlowMist exploit record
- `hei_src_012756` — contemporary Stellar ecosystem postmortem summary

## Quality boundary

No schema, validator, allowlist, canonical guard, monitoring gate, or publication gate is weakened by this batch.
