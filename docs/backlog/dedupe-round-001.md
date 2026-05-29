# Backlog dedupe round 001

Status: in progress

## Purpose

This file starts the dedupe workflow for `hei-unadded-candidate-backlog-1000-v0.md`.

The 1,000-row backlog is **not** a guaranteed unadded list. It is a working queue. Some rows may already exist in HEI and must be marked as duplicates or existing before any record PR is opened.

## Required checks per named row

Each named row must be checked in this order:

1. Public HEI site search
2. `data/entities.json` name / slug / alias / domain / URL check
3. `records/exchanges/<slug>.json` direct check
4. Repository search by name and domain
5. Evidence source check
6. ID availability check

## Status values

- `existing`: already present in HEI; do not add as new record
- `candidate`: not found in HEI and evidence appears sufficient for a future record PR
- `pending_research`: not found or unclear, but evidence is insufficient
- `out_of_scope`: not suitable for current HEI exchange scope
- `conflict_review`: possible duplicate, predecessor/successor, alias, or domain overlap

## Immediate known result

| backlog id | name | status | reason |
|---|---|---|---|
| hei_cand_0086 | AAX | existing | Public HEI site shows AAX as an existing dead-side record. Do not add as new record. |
| hei_cand_0087 | Atom Asset Exchange | conflict_review | Alias/context for AAX; must not be added as a separate entity without explicit review. |

## Next batch

Next work is rows `hei_cand_0001` through `hei_cand_0100`, classified only after all required checks above are completed.
