# Pending backlog row: hei_unadded_0048

Status: pending

## Candidate

- backlog_id: `hei_unadded_0048`
- backlog_name: `Aktionariat`
- candidate_slug: `aktionariat`
- source: `defillama_dexs`
- source_url: `https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume`
- source_id: `aktionariat`

## Source confirmation

The source row was checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before this pending decision was created.

Confirmed nearby mapping:

- `hei_unadded_0047` = `AjuBit`
- `hei_unadded_0048` = `Aktionariat`
- `hei_unadded_0049` = `Alcor`

## Pre-add checks

- repository search: no existing `Aktionariat` hit
- slug search: no existing `aktionariat` hit
- domain search: no existing `aktionariat.com` hit
- direct bundle check: `records/exchanges/aktionariat.json` not found
- PR search: only nearby-row references found, no existing Aktionariat record PR identified
- public site check: no existing public HEI entry found during the pre-add check
- official/public website check: `aktionariat.com` displayed a public tokenized-equity / investing-and-trading platform during this pass

## Decision

Do not create a record bundle yet.

Reason:

- the verified-unadded row comes from DefiLlama DEX data, but category is `RWA`
- the official site presents Aktionariat primarily as tokenized-equity infrastructure for private markets
- the official site includes investing/trading and buy/sell share functionality, but the HEI scope fit is ambiguous
- creating a DEX or exchange record now would risk mixing RWA equity-tokenization infrastructure into the exchange registry without a clearer scope decision

## Next action

Revisit after deciding whether HEI should include tokenized equity / RWA trading infrastructure listed by DEX aggregators. If included later, build a low-confidence hybrid or dex/protocol record with official site and DefiLlama evidence.
