# HEI Post-D1000 Growth BX90 — ExtStock

Date: 2026-08-29
Candidate: `hei_unadded_0724 ExtStock`
Issue: #914

## Decision

Add ExtStock as a reviewed canonical CEX record.

- entity: `hei_ex_001186`
- status: `inactive`
- death_reason: `unknown`
- launch_date: `null`
- death_date: `null`
- country_or_origin: `United Kingdom`
- official_url_status: `live_unverified`
- events: `[]`
- evidence: `hei_src_012740`–`hei_src_012743`

## Evidence boundary

An operator-controlled Bitcointalk ANN identifies ExtStock and `extstock.com` in March 2018. CoinMarketCap describes the exchange as a UK-based centralized exchange launched in February 2018, but supplies only month-level launch timing. Cryptowisser currently flags the exchange inactive and records multiple May 2020 withdrawal-failure reports. The current domain still exposes exchange-branded API documentation.

HEI does not promote user withdrawal allegations into `scam_rug`, does not infer insolvency, and does not fabricate a shutdown date from the first reports of withdrawal problems. The current API documentation is retained as URL-history evidence only; it does not establish that a functioning exchange is currently operating.

## Duplicate check

No canonical ExtStock entity was found on current `main` before branch creation.

## Result

Canonical addition is bounded to the facts supported above. No schema, validator, or gate changes are included.
