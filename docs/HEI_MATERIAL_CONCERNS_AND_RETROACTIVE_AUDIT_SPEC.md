# HEI material concerns and retroactive audit specification

Status: canonical implementation specification
Parent issue: #853

## Purpose

HEI is a historical exchange registry. Canonical inclusion and `active` status are lifecycle facts, not safety endorsements. Evidence verification establishes support for a claim; it does not establish that an exchange is safe, solvent, regulated or recommended.

## Public material-concern summary

Every canonical exchange detail page must support evidence-backed presentation of material operator/jurisdiction facts; registration and regulatory actions; custody/withdrawal dependencies and restrictions; service suspensions; insolvency/failure events; fraud/scam allegations versus findings; unsafe or repurposed-domain state; and material ownership/control changes.

The UI must distinguish confirmed findings, reported/alleged claims, unresolved unknowns and not-applicable fields. A competent fraud/scam finding must not be weakened into a generic concern, while an allegation must never be promoted into a finding. HEI must not create a proprietary safety score.

## Retroactive audit

Apply this contract to every existing canonical exchange. For each dimension classify coverage as `derivable`, `research_required`, or `not_applicable`. Existing event/evidence data should be used to derive summaries where possible; material gaps must become research work rather than favorable defaults. Required corrections must be made in reviewable batches.

## IZAKA-YA first application

IZAKA-YA is the first new intake governed by this specification. Add it only to the extent exchange/swap evidence satisfies HEI scope and existing type taxonomy. Record operator, launch/service history, swap/custody integration, jurisdiction/terms and the operator's statement concerning Japanese FSA registration as evidence permits. Lending-specific yield history remains authoritative in CYA; wallet/key-control detail remains authoritative in WLR; JPYR stable-asset facts remain authoritative in SOG.

## Phase 9 safety boundary

This specification does not authorize mutation prohibited by an active Phase 9 Stage 6 authority/implementation contract. Issue #853 implementation must respect the exact current Stage 6 boundary and must not be mixed into a one-shot read-only equality execution.

## Completion gate

Issue #853 is not complete until relevant methodology/UI/roadmap documentation references this contract, every existing canonical exchange has been audited, required correction batches are merged, material-concern presentation is implemented, IZAKA-YA is reviewed under the same rules, cross-registry links are added when authorized, and repository validation/build/production parity gates pass.
