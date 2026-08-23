# HEI material concerns retroactive audit — pass 01

Status: in progress
Parent: #853
Spec: `docs/HEI_MATERIAL_CONCERNS_AND_RETROACTIVE_AUDIT_SPEC.md`

## Canonical authority inspected

The current HEI canonical data authority contains `data/entities.json`, `data/events.json`, `data/evidence.json`, and `data/registry-updates.json`. Material-concern presentation must be derived from those authorities; it must not create an independent safety-rating dataset.

## Audit dimensions

Every canonical exchange is to be classified for operator/jurisdiction, registration/regulatory actions, custody/withdrawal restrictions, service suspension, insolvency/failure, fraud/scam allegation versus finding, unsafe/repurposed domain, and ownership/control changes.

Each dimension is `derivable`, `research_required`, or `not_applicable`. `active` remains lifecycle only. Missing event/evidence is not a favorable safety conclusion.

## Derivation rule

Existing events/evidence should drive the public material-concern summary wherever possible. Confirmed regulatory/fraud findings must retain their actual event meaning; allegations must remain allegations. The summary is an index into canonical history, not a replacement for it.

## Stage 6 boundary

No canonical/entity/event/evidence/relationship mutation for IZAKA-YA is authorized inside the current Phase 9 Stage 6 one-shot read-only equality execution. This audit may proceed independently; canonical intake waits for an authorized mutation boundary.

## IZAKA-YA boundary

When the mutation boundary permits, IZAKA-YA is reviewed against existing HEI scope/type rules using exchange/swap evidence. Yield-specific history remains CYA authority, wallet/key-control remains WLR authority, and JPYR stable-asset facts remain SOG authority.
