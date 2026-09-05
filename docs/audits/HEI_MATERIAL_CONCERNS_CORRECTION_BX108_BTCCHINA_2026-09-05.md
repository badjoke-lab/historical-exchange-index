# HEI material-concerns correction — BX108 BTCChina — 2026-09-05

## Scope

This batch repairs the zero-evidence legacy bundle for `hei_ex_000260` (BTCChina) tracked under #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical changes are included.

## Findings

- BTCC's contemporaneous 2015-09-15 announcement states that BTCChina was rebranding to BTCC that day.
- The same announcement states that BTCChina was founded in 2011 and was China's first bitcoin exchange.
- TechCrunch independently reported the BTCChina-to-BTCC rebrand on 2015-09-15.
- The reviewed evidence supports the existing `status: rebranded`, `death_reason: rebrand`, `death_date: 2015-09-15`, and BTCC successor linkage.
- The previous exact `launch_date: 2011-06-01` was not supported by reviewed first-party material. The evidence supports only a 2011 founding year, so the exact date has been removed rather than preserved as false precision.

## Canonical additions

- `hei_ev_010231` — BTCChina rebranded to BTCC on 2015-09-15
- `hei_src_012777` — BTCC-issued contemporaneous rebrand announcement
- `hei_src_012778` — independent TechCrunch same-day report

## Entity correction

- `launch_date`: `2011-06-01` -> `null`
- `status`: unchanged (`rebranded`)
- `death_reason`: unchanged (`rebrand`)
- `death_date`: unchanged (`2015-09-15`)
- `successor_id`: unchanged (`hei_ex_000410`)
- summary / notes / verification date refreshed to reflect the recovered evidence and the exact-date correction.

## Material-concerns disposition

No safety inference is made from the absence or presence of reviewed incidents. This repair is limited to identity and lifecycle evidence. Later BTCC regulatory, trading-restriction, ownership, or operational events belong to the BTCC successor record rather than being back-projected onto the historical BTCChina brand record.
