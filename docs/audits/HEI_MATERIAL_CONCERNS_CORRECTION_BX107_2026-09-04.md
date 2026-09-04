# HEI material-concerns correction — BX107 BitTrade Australia — 2026-09-04

## Scope

This batch repairs only the zero-evidence legacy bundle for `hei_ex_000285` BitTrade Australia under #857.

No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical changes are included.

## Evidence recovered

- Federal Court findings in `Australian Securities and Investments Commission v Bit Trade Pty Ltd [2024] FCA 953` state that Bit Trade was incorporated on 2013-04-10 and conducted a digital currency exchange from that time.
- Kraken's first-party 2020-01-14 announcement confirms acquisition of Bit Trade.
- ASIC's 2024 regulatory notice identifies Bit Trade Pty Ltd as the operator of Kraken's exchange in Australia, confirming that the legal entity continued after the acquisition.

## Canonical disposition

- Preserve `launch_date: 2013-04-10`; the court record directly supports exchange operation from that date.
- Preserve `status: acquired` and `death_reason: acquisition`.
- Preserve `death_date: 2020-01-14` as the end of the independent Bit Trade exchange/service identity, not dissolution of Bit Trade Pty Ltd.
- Preserve `successor_id: hei_ex_000009` for Kraken.

## Canonical additions

- `hei_ev_010229` — launch / exchange operation from 2013-04-10.
- `hei_ev_010230` — Kraken acquisition on 2020-01-14.
- `hei_src_012774` — Federal Court judgment.
- `hei_src_012775` — Kraken first-party acquisition announcement.
- `hei_src_012776` — ASIC post-acquisition operator notice.

## Material-concerns guardrails

The recovered record distinguishes acquisition of the independent exchange identity from continued existence of the legal entity. No inference is made that acquisition implies insolvency, fraud, hack, customer loss, enforcement shutdown, or business failure. ASIC's later enforcement action concerns a Kraken margin product and is not used as the reason for the 2020 acquisition classification.
