# HEI Post-D1000 Growth BX88 — ExMarkets

Date: 2026-08-29
Lane: A / reviewed canonical exchange growth
Candidate: `hei_unadded_0717 ExMarkets`

## Result

Promoted as a new canonical exchange entity after a fresh duplicate search found no existing ExMarkets canonical record.

- entity: `hei_ex_001184`
- type: `cex`
- status: `inactive`
- death_reason: `null`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `Lithuania`
- official_url_status: `unknown`
- events: `[]`
- evidence: `hei_src_012733`–`hei_src_012736`

## Evidence and boundaries

The European Commission EU Digital Finance Platform lists ExMarkets with location Vilnius, Lithuania, launch year 2017 and an exmarkets.com trading URL. Other historical sources often cite 2018 and a British Virgin Islands operating company, so this batch does not manufacture an exact launch date or collapse corporate-registration history into the country field.

Cryptowisser reported on 2024-09-18 that the ExMarkets website was inaccessible and marked the exchange inactive/dead. CoinPaprika reports its last exchange data input as 2024-05-22 and currently shows no markets or volume. These independent signals support `inactive`, but HEI does not promote the stronger `dead` state because no first-party shutdown notice or exact terminal date/cause was found.

The legacy ExMarkets Kayako support center remains reachable. It is used only as first-party identity/support evidence and is not interpreted as proof that exchange trading is active.

No lifecycle event is emitted because no exact dated launch or terminal event meets HEI evidence requirements.

## Integrity

No schema, enum, validator, allowlist, or quality-gate changes are included in BX88.
