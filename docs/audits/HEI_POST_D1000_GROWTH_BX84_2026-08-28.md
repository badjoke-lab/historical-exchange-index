# HEI post-D1000 growth audit — BX84 ezBtc

Date: 2026-08-28
Base main: `9605f62ddee77097185a8a1df41095e69aa86a36`

## Decision

Promote ezBtc from the needs-research backlog as a historical Canadian centralized exchange with an authoritative fraud finding and post-operation regulatory lifecycle.

## Duplicate / identity review

Fresh canonical search found no existing ezBtc record. BCSC material identifies the platform as ezBtc, operated by 1081627 B.C. Ltd. in British Columbia. Historical sources expose both `ez-btc.ca` and `ezbtc.ca` spellings; HEI preserves those as identity aliases rather than asserting an unverified redirect relationship.

## Authoritative evidence

1. British Columbia Securities Commission formal Findings, effective 2024-08-07: the panel found that ezBtc and David Smillie perpetrated securities fraud. The findings state that the platform accepted its first customer deposits in December 2016 and went offline permanently in or around September 2019.
2. BCSC 2024-08-12 news release summarizing the final fraud findings and customer-asset diversion.
3. BCSC hearing chronology identifying the 2024-11-27 sanctions decision and later appeal history.
4. BCSC 2024-12-02 news release summarizing the sanctions imposed after the fraud findings.

A 2023 BCSC release also stated that ezBtc was no longer operating, but the 2024 final findings supersede the earlier allegation posture for fraud classification.

## Modeling

- entity: `hei_ex_001181`
- type: `cex`
- status: `dead`
- death_reason: `scam_rug`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `Canada`
- official_url_status: `unknown`
- events:
  - `hei_ev_010209` — `regulatory_action`, 2024-08-07, final fraud findings
  - `hei_ev_010210` — `regulatory_action`, 2024-11-27, sanctions decision
- evidence: `hei_src_012720`–`hei_src_012723`

## Date boundary

The regulator supports December 2016 for first customer deposits and an approximate September 2019 permanent-offline period. Neither provides an exact day, so HEI does not normalize either to the first or last day of a month. `launch_date` and `death_date` remain null while the month-level facts remain in notes/evidence.

The 2024 regulatory dates are exact, but they occurred years after the exchange ceased operation. They are recorded as post-operation `regulatory_action` events and are not substituted for the exchange death date.

## Death-reason boundary

`scam_rug` is used because the final BCSC findings establish deliberate false custody representations and diversion of customer crypto assets. This is not based on community allegations or a mere disappearance inference. The classification follows the existing HEI enum and fraud/insider-diversion precedent; it does not claim a technical hack or insolvency.

## Safety boundaries

- No exact launch or shutdown day is invented from month-level findings.
- Company dissolution on 2022-10-31 is not used as the exchange death date.
- The 2023 allegations release is not treated as a final fraud finding.
- Customer loss/diversion statements are limited to what the BCSC findings support.
- Historical domain spelling differences are preserved without fabricating redirect continuity.
- No schema, validator, monitoring, localization, or Phase 9 production mutation is included.

## Canonical delta

- +1 entity
- +2 events
- +4 evidence
- +0 lineage edges

If main advances before merge, replay and re-ID this batch from then-current main.
