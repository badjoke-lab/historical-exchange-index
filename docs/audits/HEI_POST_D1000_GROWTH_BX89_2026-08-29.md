# HEI post-D1000 growth audit — BX89 Exrates inactive reconstruction

Date: 2026-08-29
Base main: `2b251a0cb7219557d8b68123511b972b269f56ae`

## Candidate

- backlog row: `hei_unadded_0721 Exrates`
- prior disposition: `needs_research`
- fresh canonical/code search found no existing Exrates exchange entity

## Reviewed evidence

1. FINMA published an official warning-list entry for `Exrates / Exrates Exchange` on 2021-04-28. It links `https://exrates.me/`, gives a Göschenen, Switzerland address, and states that the entity was not entered in the commercial register.
2. Cryptowisser currently flags Exrates inactive and records in a 2022-12-02 update that the website returned a 404 and the project's last tweet was at the start of 2022.
3. Trustpilot contains user reports from March-June 2022 that exrates.me was down or unavailable. These are low-reliability corroboration only.
4. Community allegations concerning stuck withdrawals and fraud are not sufficient to assign `scam_rug` or another terminal cause.
5. Available historical descriptions give inconsistent geographic/operator claims. The FINMA address is not treated as proof of exchange origin or incorporation.

## Modeling

- entity: `hei_ex_001185`
- type: `cex`
- status: `inactive`
- death_reason: `unknown`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `Global`
- official_url_status: `dead_domain`
- event: `hei_ev_010213` (`regulatory_action`, 2021-04-28)
- evidence: `hei_src_012737`–`hei_src_012739`

## Boundary

The FINMA warning is a dated regulatory event but does not prove that regulation caused the later inactive state. A website outage/404 observation is not promoted into a shutdown date. User allegations are not promoted into a scam finding. No exact launch date is invented.

## Delta

- +1 entity
- +1 event
- +3 evidence
- +0 lineage edges

No schema, validator, monitoring, localization, or Phase 9 production changes are included.
