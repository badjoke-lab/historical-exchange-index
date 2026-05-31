# Pending backlog row: hei_unadded_0047

Status: pending

## Candidate

- backlog_id: `hei_unadded_0047`
- backlog_name: `AjuBit`
- candidate_slug: `ajubit`
- source: `coinpaprika_exchanges`
- source_url: `https://api.coinpaprika.com/v1/exchanges`
- source_id: `ajubit`

## Source confirmation

The source row was checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before this pending decision was created.

Confirmed nearby mapping:

- `hei_unadded_0046` = `Aivora Exchange`
- `hei_unadded_0047` = `AjuBit`
- `hei_unadded_0048` = `Aktionariat`

## Pre-add checks

- repository search: no existing `AjuBit` hit
- slug search: no existing `ajubit` hit
- direct bundle check: `records/exchanges/ajubit.json` not found
- PR search: only nearby-row references found, no existing AjuBit record PR identified
- public site check: no existing public HEI entry found during the pre-add check
- official/public website check: no reliable official domain or public website confirmed during this pass

## Decision

Do not create a record bundle yet.

Reason:

- the verified-unadded row has no domain
- no official/public site was confirmed during this pass
- available evidence is limited to a database-style CoinPaprika source reference
- creating an active exchange record now would be weaker than the current public-ready threshold

## Next action

Revisit if a reliable official domain, archive, or stronger public source is found.
