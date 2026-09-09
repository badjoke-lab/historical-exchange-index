# HEI Material Concerns Correction — BX112 BCC Exchange — 2026-09-09

## Scope

This batch repairs the zero-evidence legacy bundle for `hei_ex_000300` (BCC Exchange / BitConnect Coin) under #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical records are changed.

## Findings

- The exchange identity is supported by FBI and DOJ material describing a proprietary BitConnect/BCC exchange used to purchase, trade, or sell BCC.
- Texas issued an Emergency Cease and Desist Order against BitConnect on 2018-01-04.
- North Carolina issued a Temporary Cease and Desist Order against BitConnect and related entities on 2018-01-09; the regulator later recorded that BitConnect closed its exchange and lending operation after receiving the order.
- Contemporaneous reporting on 2018-01-16 records BitConnect's own announcement that it was closing its cryptocurrency exchange and lending operation.
- The FBI later independently described the BCC exchange as completely shut down after state securities regulators acted.

## Canonical corrections

- Preserve `status: dead`.
- Preserve `death_reason: regulation` as the principal precipitating lifecycle factor, while noting that BitConnect's contemporaneous statement also cited bad press and denial-of-service attacks.
- Preserve `death_date: 2018-01-16` because the exchange shutdown was announced that day.
- Remove `launch_date: 2016-11-01`; authoritative material supports BCC's November 2016 release/ICO but does not establish that exact day as the proprietary exchange launch.
- Preserve `country_or_origin: Unknown`; reviewed authorities do not safely establish one operating jurisdiction for the proprietary exchange itself.

## Canonical additions

- `hei_ev_010235` — Texas emergency cease-and-desist order, 2018-01-04.
- `hei_ev_010236` — North Carolina temporary cease-and-desist order, 2018-01-09.
- `hei_ev_010237` — BitConnect lending and exchange platform shutdown, 2018-01-16.
- `hei_src_012788` — Texas State Securities Board regulatory notice.
- `hei_src_012789` — North Carolina Secretary of State Securities Division administrative-action record.
- `hei_src_012790` — Bloomberg contemporaneous shutdown report carrying BitConnect's own closure statement.
- `hei_src_012791` — FBI statement confirming proprietary-exchange identity and terminal shutdown.

## Non-inferences

- No exact proprietary-exchange launch date is inferred from BCC's ICO/release date.
- No single UK company is asserted to be the sole operating entity for the exchange.
- Regulatory findings and later criminal allegations concerning BitConnect's wider investment scheme are not rewritten as separate exchange-specific fraud findings.
- `death_reason: regulation` does not imply regulation was the only circumstance cited in the operator's shutdown statement.
