# HEI post-D-1000 growth BX77 — Webot

Status: REVIEWED IMPLEMENTATION
Date: 2026-08-25
Issue: #881

## Scope

Resolve the previously held Webot / Pionex.US identity boundary without duplicating the still-active global Pionex exchange.

## Reviewed conclusion

Webot is promoted as a distinct active regional exchange identity because the reviewed record shows an explicit brand transition from Pionex.US to Webot, continuing regional accounts and balances under the new name while global Pionex continues separately.

Canonical model:

- entity: `hei_ex_001172`
- slug: `webot`
- type: `cex`
- status: `active`
- launch/identity marker: `2025-12-02`
- country/origin: `United States`
- predecessor/successor: null
- confidence: high

## Identity boundary

The Apple App Store release history dates the Webot 2.0 rebrand of Pionex.US to 2025-12-02. First-party Pionex.US migration guidance states that Webot is the official brand upgrade and preserves existing login credentials, funds, positions, trading history and referral codes.

HEI does **not** set `predecessor_id` to canonical global Pionex (`hei_ex_000092`). The global Pionex exchange remains active and was not terminally rebranded to Webot. Pionex.US is treated as the regional service surface from which the Webot identity emerged.

## Current operator boundary

The current US Webot User Agreement identifies Pionex Inc., a Delaware company, as the operator of Webot services. Current Webot EU operating rules identify Pionew Ireland Limited trading as Webot under MiCA. These are preserved as regional operating entities under one Webot exchange identity, not split into multiple exchange records.

## Lifecycle

- `hei_ev_010155` — `launched`, 2025-12-02: Webot identity launched through the Pionex.US brand transition.

The event has two directly linked reviewed sources and `source_count: 2`.

## Evidence

- `hei_src_012651` — Pionex.US / Webot first-party migration guide
- `hei_src_012652` — Apple App Store release history establishing the 2025-12-02 Webot 2.0 marker
- `hei_src_012653` — current Webot first-party exchange site
- `hei_src_012654` — current US Webot User Agreement
- `hei_src_012655` — current Webot EU operating rules

## Delta

- entities: +1
- events: +1
- evidence: +5

## Exclusions

No terminal event is added to global Pionex. No predecessor/successor edge is invented. No regional US/EU Webot split is introduced. No monitoring, Cloudflare, localization-expansion, schema or Ledger Series Phase 9 change is included. L-2 remains HOLD.
