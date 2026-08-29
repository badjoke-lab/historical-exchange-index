# HEI post-D1000 growth audit — BX88 ExMarkets inactive reconstruction

Date: 2026-08-29
Base main: `9fe7da0c712650a3aeb6d1f2941952bc5b3ca81d`

## Candidate

- backlog row: `hei_unadded_0717 ExMarkets`
- prior disposition: `needs_research`
- fresh canonical/code search found no existing ExMarkets exchange entity

## Evidence

1. The European Commission EU Digital Finance Platform lists ExMarkets with launch year 2017, location Vilnius, Lithuania, and an exmarkets.com trading URL.
2. A preserved copy of ExMarkets Terms of Service defines ExMarkets as Chain Framework Ltd., B.V.I. and describes the trading service.
3. The branded ExMarkets Kayako support center remains reachable.
4. Current exchange-directory monitoring classifies ExMarkets as discontinued/inactive and records the main exmarkets.com site as offline.

## Modeling

- entity: `hei_ex_001184`
- type: `cex`
- status: `inactive`
- death_reason: `unknown`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `Lithuania`
- official_url_status: `dead_domain`
- events: none
- evidence: `hei_src_012733`–`hei_src_012736`

## Boundary decisions

The Commission source supports a Lithuanian location/origin and a 2017 launch year, but not an exact launch day; HEI therefore does not fabricate a date. The preserved Terms of Service supports the BVI operating legal entity, so the record notes the Lithuania/BVI distinction rather than forcing both concepts into one jurisdiction field.

The main exchange domain being offline is sufficient, together with current exchange-directory status, to support `inactive`, but it is not sufficient to prove an exact shutdown date or a terminal cause. The residual support center also means HEI should not infer that all operator infrastructure disappeared on the first observed domain-offline date. No dated shutdown event is created.

## Delta

- +1 entity
- +0 events
- +4 evidence
- +0 lineage edges

No schema, validator, monitoring, localization, or Phase 9 production changes are included.
