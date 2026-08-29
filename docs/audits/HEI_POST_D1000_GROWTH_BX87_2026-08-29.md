# HEI post-D1000 growth audit — BX87 Exbitron shutdown transition

Date: 2026-08-29
Base main: `833c458d7c9cd75871592f40434b1b7f9266bc63`

## Candidate

- backlog row: `hei_unadded_0710 Exbitron`
- prior disposition: `needs_research`
- fresh canonical/code search found no existing Exbitron exchange entity

## First-party evidence

1. Exbitron's current application page states that Exbitron is shutting down permanently, tells users to withdraw all funds, and warns that assets will no longer be accessible after closure. Login and withdrawal access remain available.
2. The same first-party shutdown narrative says Exbitron started in 2020, but gives no exact launch date.
3. Exbitron's historical press kit identifies the service as a centralized cryptocurrency exchange and states in its FAQ that the exchange is based in Germany.
4. The shutdown narrative retrospectively mentions a serious exploit, bear-market pressure, service-provider/infrastructure/compliance costs, and unsuccessful investment/takeover/partnership efforts. These statements do not provide an exact exploit date or a sufficiently bounded terminal cause.

## Corroboration

Nexa Forum lists a June 10, 2026 topic titled `Important Notice: Exbitron is Shutting Down Permanently`. This is community corroboration only. HEI does not use that date as the first-party announcement date and therefore does not create a dated shutdown event from it.

## Modeling

- entity: `hei_ex_001183`
- type: `cex`
- status: `limited`
- death_reason: `null`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `Germany`
- official_url_status: `live_verified`
- events: none
- evidence: `hei_src_012730`–`hei_src_012732`

## State boundary

The permanent-shutdown intention is clear, but the shutdown has not yet been modeled as completed because the current first-party application still exposes account/login and withdrawal access. `limited` therefore represents the observed transitional state more accurately than `dead`.

No exact launch date is invented from the year-only 2020 statement. No exploit event is created without an exact date. No `shutdown_announced` event is created because the first-party publication date is not established. No death reason is assigned from the retrospective narrative.

## Delta

- +1 entity
- +0 events
- +3 evidence
- +0 lineage edges

No schema, validator, monitoring, localization, or Phase 9 production changes are included.
