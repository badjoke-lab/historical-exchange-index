# HEI post-D1000 growth audit — BX86 Fisco Cryptocurrency Exchange → Zaif

Date: 2026-08-29
Base main: `a425c6255e976521890ace26700fcbaaded9edc1`

## Decision

Add the missing historical Fisco Cryptocurrency Exchange entity and terminate it through a reviewed merger relationship into the already-canonical Zaif entity (`hei_ex_000063`).

## Duplicate / identity review

Fresh canonical and PR searches found Zaif but no standalone Fisco Cryptocurrency Exchange entity. The existing Zaif record already documents the 2018 business transfer from Tech Bureau to Fisco Cryptocurrency Exchange Inc., but it does not represent the separate exchange that FCCE was operating before the February 2020 integration. FISCO first-party material explicitly states that FCCE operated two exchanges — Fisco Cryptocurrency Exchange and Zaif Exchange — before combining them.

This therefore fills a historical entity/lineage gap rather than creating a duplicate Zaif record.

## First-party evidence

1. FISCO's English launch release states that Fisco Cryptocurrency Exchange commenced bitcoin exchange operations on August 29, 2016 and identifies `fcce.jp` as the exchange URL.
2. FISCO's 2016 news archive independently lists the operating-start announcement.
3. FISCO's February 12, 2020 integration notice states that Fisco Cryptocurrency Exchange and Zaif Exchange were integrated into one exchange at noon that day, and that former Fisco Cryptocurrency Exchange users should use Zaif thereafter.
4. FISCO corporate history independently records the February 2020 integration and separately records the September 2020 operating-company rename to Zaif Inc.

## Modeling

- entity: `hei_ex_001182`
- type: `cex`
- status: `merged`
- death_reason: `merger`
- launch_date: `2016-08-29`
- death_date: `2020-02-12`
- country_or_origin: `Japan`
- historical domain: `fcce.jp`
- official_url_status: `unknown`
- successor: Zaif (`hei_ex_000063`)
- events:
  - `hei_ev_010211` — launched, 2016-08-29
  - `hei_ev_010212` — merged, 2020-02-12
- evidence: `hei_src_012726`–`hei_src_012729`

## Lineage boundary

Zaif existed before the integration and continued after it. HEI therefore records Fisco Cryptocurrency Exchange's terminal `successor_id` as Zaif without forcing Fisco Cryptocurrency Exchange to become Zaif's sole `predecessor_id`. The relationship is an absorption/continuity edge from the terminal historical service into an already-existing continuing service.

The September 2020 company-name change from Fisco Cryptocurrency Exchange Inc. to Zaif Inc. is corporate history after the exchange integration. It is not used as the exchange's terminal date.

## Safety boundaries

- No exact launch date is inferred: the 2016-08-29 operating start is stated by FISCO.
- No exact terminal date is inferred: the 2020-02-12 integration completion is stated by FISCO.
- Zaif is not marked dead or merged; it remains the continuing active exchange.
- The historical `fcce.jp` domain is not assumed live, dead, redirected, or repurposed without a separate verified domain check; `official_url_status` remains `unknown`.
- No token price, routine listing, or promotional activity is modeled as a lifecycle event.
- No schema, validator, monitoring, localization, or Phase 9 production changes are included.

## Canonical delta

- +1 entity
- +2 events
- +4 evidence
- +1 terminal successor relationship

If main advances before merge, replay and re-ID this batch from then-current main.