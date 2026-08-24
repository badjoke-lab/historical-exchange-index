# HEI Post-D-1000 Growth Audit — BX72 Graviex

Reviewed at: 2026-08-23
Issue: #849

## Decision

Promote Graviex as a reviewed historical CEX record after recovering stronger terminal evidence for the previously deferred candidate.

## Identity

The operator-authored BitcoinTalk ANN identifies GRAVIEX as a cryptocurrency exchange run by the GRAVIO Team and says the exchange was first released in 2017 for GIO trading before later expansion. No current-main canonical Graviex record was found before allocation.

## Lifecycle

- launch: 2017 year-level normalization only;
- shutdown announcement: 2024-09-20 official `@graviex_net` X post;
- shutdown effective: 2024-10-20;
- final status: `dead`;
- death reason: `voluntary_shutdown`.

The official shutdown post itself is not text-renderable in the current fetch environment, so HEI does not rely on it alone. Contemporary SpaceXpanse reporting and a BitcoinTalk discussion independently link that exact official post and repeat the October 20 shutdown deadline. Live Coin Watch now reports that Graviex ceased operations on 2024-10-20 and has no active markets.

## Classification boundaries

Post-closure complaints about stuck assets are not sufficient to classify the venue as a scam, hack, insolvency, or enforcement-driven closure. No such terminal cause is promoted.

Country/origin remains `Unknown`. Historical sources conflict between Russia and Malta and the reviewed evidence does not justify a stronger canonical origin claim. This intentional Unknown is therefore added to `config/reviewed-unknown-origins.json` rather than weakening the strict country/origin gate.

## ID reallocation after current-main sync

Current main added `hei_ev_010144` and `hei_src_012629` to IZAKA-YA after the original BX72 branch was cut. BX72 was rebased onto current main and its identifiers were reallocated without changing the underlying Graviex lifecycle claims:

- events: `hei_ev_010145`–`hei_ev_010147`;
- evidence: `hei_src_012630`–`hei_src_012634`.

## Canonical delta

- entities: +1 (`hei_ex_001167`)
- events: +3 (`hei_ev_010145`–`hei_ev_010147`)
- evidence: +5 (`hei_src_012630`–`hei_src_012634`)

## Program boundaries

L-2 remains HOLD. No monitoring, Cloudflare, localization expansion, schema, or Ledger Series Phase 9 mutation is included.
