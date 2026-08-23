# Consumed candidate — BX66 IDCM / Klickl lineage

Date: 2026-08-23

The current-main verified-unadded candidate artifact still contained IDCM at the tail of the reviewed candidate set. BX66 consumes that unresolved exchange identity by resolving the historical brand transition rather than creating a thin IDCM-only row.

## Canonical result

- IDCM -> `hei_ex_001161`, terminal state `rebranded`
- Klickl -> `hei_ex_001162`, current state `active`
- explicit predecessor/successor linkage in both directions

## Why two records

The reviewed sources establish a genuine brand transition in May 2022: IDCM changed its name and domain to Klickl while exchange functionality continued and the product family expanded. Keeping one timeless entity would erase the historical IDCM terminal state; creating unrelated IDCM and Klickl records would lose the explicit lineage. Two linked entities preserve both facts.

## Candidate-safety note

Candidate IDs in regenerated backlog artifacts are not treated as durable canonical identifiers. The consumed decision is anchored to the reviewed IDCM identity/name and current-main source artifact, while permanent identity is represented only by `hei_ex_*` canonical IDs.

## Separate unresolved work

FYB-SG/FYB-SE research remains tracked in #819 and is not consumed by this batch.
