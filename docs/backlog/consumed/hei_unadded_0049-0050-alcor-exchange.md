# Consumed backlog rows: hei_unadded_0049 / hei_unadded_0050

Status: added

## Candidate

- backlog_id: `hei_unadded_0049`
- backlog_name: `Alcor`
- backlog_id: `hei_unadded_0050`
- backlog_name: `Alcor Exchange`
- added_record_path: `records/exchanges/alcor-exchange.json`
- added_entity_id: `hei_ex_000356`

## Source confirmation

The source rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before this record was created.

Confirmed nearby mapping:

- `hei_unadded_0048` = `Aktionariat`
- `hei_unadded_0049` = `Alcor`
- `hei_unadded_0050` = `Alcor Exchange`

## Pre-add duplicate checks

- repository search: no existing `Alcor` hit
- repository search: no existing `Alcor Exchange` hit
- domain search: no existing `alcor.exchange` hit
- direct bundle check: `records/exchanges/alcor-exchange.json` not found
- direct bundle check: `records/exchanges/alcor.json` not found
- PR search: earlier invalid PR #280 existed but was closed without merge due to wrong backlog mapping
- PR search: no existing merged Alcor record PR identified
- public site check: no existing public HEI entry found during the pre-add check
- official/public website check: `alcor.exchange` displayed a public decentralized trading / swap / spot / liquidity platform during this pass
- ID checks: `hei_ex_000356`, `hei_ev_000664`, `hei_src_001451`, `hei_src_001452`, and `hei_src_001453` unused before creation

## Decision

Create one record bundle for Alcor Exchange and consume both rows together.

Reason:

- `hei_unadded_0049` uses the name `Alcor` and domain `alcor.exchange`
- `hei_unadded_0050` uses the name `Alcor Exchange`
- both refer to the same public Alcor Exchange / Alcor DEX identity
- creating separate records would duplicate the same entity

## Notes

This is a low-confidence active DEX record. It should be improved later with stronger historical launch or operational evidence if available.
