# HEI post-D-1000 growth audit — BX80 — 2026-08-28

## Scope

Lane A canonical repair. Reconciles the stale backlog candidate `hei_unadded_0992 GBX Digital Asset Exchange` against the already-reviewed canonical `records/exchanges/gbx.json` from BX63, then improves the existing GBX record instead of creating a duplicate entity.

Base main: `6b08f992af0a2d0c6b2dc9203df9e0a4341add75`.

## Duplicate prevention

The 0951–1000 pending-review memo was stale: GBX had already been promoted in BX63 as `hei_ex_001159`. The initial BX80 draft attempted a new GBX entity and correctly failed `records:validate` through the overlap/duplicate guard. The duplicate draft was removed; no new GBX entity/event IDs are retained.

## Repair applied

1. Correct public launch date from normalized month marker `2018-07-01` to exact `2018-07-23` using contemporaneous launch reporting while retaining the first-party July-2018 source.
2. Update `hei_ev_010128` to the exact 2018-07-23 public opening date and increase `source_count` from 1 to 2.
3. Add evidence `hei_src_012710` for the contemporaneous launch report.
4. Link the already-canonical Mine Digital entity (`hei_ex_001169`) as `counterparty_exchange_id` on GBX acquisition/closure events.
5. Update stale notes that previously said no reviewed Mine Digital canonical entity was resolved; retain the no-successor-edge decision because Mine Digital did not continue the GBX banner/platform.
6. Refresh reviewed/access dates to 2026-08-28 where touched.

## Source-count check

- `hei_ev_010128`: 2 directly linked evidence
- `hei_ev_010129`: 2 directly linked evidence
- `hei_ev_010130`: 1 directly linked evidence

## Delta

- entities: +0
- events: +0
- evidence: +1 (`hei_src_012710`)
- existing entity repaired: `hei_ex_001159`
- existing event dates/counterparty references repaired
- lineage edges: +0

## Boundaries

No schema, validator, monitoring, localization, Phase 9 production, or machine-readable contract weakening is included. The validator failure was resolved by removing the duplicate entity and repairing canonical data, not by changing validation rules.

If main advances before merge, recheck the evidence ID and replay against current main rather than merging a stale collision.
