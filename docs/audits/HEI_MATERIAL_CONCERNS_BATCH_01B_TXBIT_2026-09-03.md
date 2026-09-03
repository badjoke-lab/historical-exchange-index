# HEI Material Concerns Batch 01B — Txbit — 2026-09-03

Parent: #857
Sub-batch: #954

## Scope

Bounded evidence repair for `hei_ex_000312` Txbit only. No schema, workflow, validator, Phase 9, or unrelated canonical changes.

## Existing classification reviewed

- entity: `hei_ex_000312`
- type: `cex`
- status: `dead`
- death reason: `voluntary_shutdown`
- existing terminal date: `2023-09-14`
- official historical domain: `txbit.io`

The existing bundle had zero events and zero evidence despite asserting a voluntary shutdown and an exact terminal date.

## First-party evidence recovered

Txbit Exchange's first-party Medium statement dated 2023-08-14 states that Txbit would close its services on 2023-09-14. It says trading would be disabled on 2023-08-14, withdrawals would remain available during the wind-down, the website would remain accessible until 12:00 PM UTC on 2023-09-14, and funds left after that deadline would not be retrievable. The operator cited adverse market shifts, regulatory uncertainty, rising compliance costs, and margin pressure.

Source: `https://txbit.medium.com/the-txbit-journey-ends-here-txbit-will-be-closing-down-on-september-14th-2023-4c546ddb8f8f`

## Canonical decision

Preserve `dead`, `voluntary_shutdown`, and `death_date: 2023-09-14`. Add:

- `hei_ev_010221` — shutdown announced on 2023-08-14
- `hei_ev_010222` — shutdown effective on 2023-09-14
- `hei_src_012764` — first-party announcement evidence
- `hei_src_012765` — first-party terminal-date evidence

The year-level launch marker is not tightened because this repair does not recover equally strong first-party launch evidence. `country_or_origin` remains `Unknown` because the previously documented jurisdiction ambiguity is not resolved by the closure notice.

## Material-concern boundary

This evidence establishes the shutdown lifecycle. It does not support a hack, insolvency filing, fraud finding, acquisition, rebrand, or regulatory enforcement event. Absence of such evidence is not interpreted as proof that those concerns never existed.
