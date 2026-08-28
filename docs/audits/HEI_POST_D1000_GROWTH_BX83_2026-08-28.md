# HEI post-D1000 growth audit — BX83 Geco.one

Date: 2026-08-28
Base main: `4ca488be19c0593e5565e4c660517f68e5a52ce3`

## Decision

Promote Geco.one from the pending-thin backlog as a historical centralized exchange with a first-party-confirmed regulatory shutdown lifecycle.

## Duplicate / identity review

Fresh repository search found no existing canonical Geco.one exchange record. The candidate is treated as the former retail crypto-margin exchange, not as a new entity for the current white-label software business using the same domain.

## Reviewed evidence

1. Geco.one first-party cryptocurrency page: identifies Geco.one as a crypto margin exchange launched in August 2020; identifies Analemma Technologies, s.r.o. as the operator registered in Slovakia; states the trading platform is closing because of implementation of new MiCA regulations; gives 2025-06-23 for deposit blocking and 2025-07-14 for the withdrawal deadline and server disconnection/login termination.
2. Geco.one current root site: markets a white-label crypto and futures trading-platform service to business customers. This supports `official_url_status: repurposed`; it does not establish continued operation of the historical retail exchange.
3. BitDegree exchange page: currently marks Geco.one inactive/untracked. This is secondary status corroboration only.

## Modeling

- entity: `hei_ex_001180`
- status: `dead`
- death_reason: `regulation`
- death_date: `2025-07-14`
- launch_date: `null`
- launch month retained only in notes/evidence: August 2020
- country_or_origin: `Slovakia`
- official_url_status: `repurposed`
- event: `hei_ev_010208` (`shutdown_effective`, 2025-07-14)
- evidence: `hei_src_012717`–`hei_src_012719`

The closure notice does not expose a publication date in the reviewed page, so HEI does not invent a separate `shutdown_announced` event date. The dated terminal action is recorded as `shutdown_effective`.

## Safety boundaries

- No exact launch day is inferred from an August 2020 statement.
- The surviving Geco.one white-label business is not used to classify the former retail exchange as active.
- MiCA/regulation is used as death_reason only because the first-party closure notice explicitly attributes the shutdown to that regulatory implementation.
- No insolvency, hack, scam, or customer-loss inference is made.
- No schema, validator, monitoring, or Phase 9 production mutation is included.

## Canonical delta

- +1 entity
- +1 event
- +3 evidence
- +0 lineage edges

If main advances before merge, replay and re-ID this batch from then-current main.
