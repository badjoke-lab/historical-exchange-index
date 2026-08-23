# HEI Post-D-1000 Growth Audit — BX69 HCoin

Date: 2026-08-23  
Status: REVIEWED / PR PENDING  
Project: Historical Exchange Index (HEI)

## Scope

BX69 resolves the previously deferred HCoin exchange as a conservative inactive historical CEX record.

## Identity and overlap

- No existing reviewed `HCoin` canonical record was found on current main before allocation.
- HCoin is modeled independently from similarly named venues.
- Historical endpoints include `hcoin.com`, `hcoin86.com`, and `hcoin86.io`; the record uses `hcoin86.com` as the historical official-domain anchor because contemporaneous 2019 trading announcements link that endpoint.

## Status decision

HCoin is classified `inactive`, not `dead`.

The evidence supports active exchange functionality in 2019 and an independently observed website-unreachable marker on 2021-11-11. No reviewed operator shutdown notice or exact terminal date has been recovered, so BX69 leaves `death_date` and `death_reason` null.

## Launch boundary

Historical exchange directories consistently place the platform in 2018 but disagree on the exact August day. BX69 therefore leaves `launch_date` null rather than inventing a normalized exact day.

## Seychelles boundary

Historical exchange directories place HCoin in Seychelles. A joint Seychelles Financial Services Authority / Registrar of Companies notice dated 2024-10-25 states that the businesses listed in its Annex 1 were not registered or incorporated in Seychelles; HCOIN is included with legal name unknown.

Accordingly, `country_or_origin: Seychelles` is retained only as historical directory placement. The record explicitly does not claim Seychelles incorporation, VASP registration, licensing, or regulatory approval.

## Lifecycle

- `hei_ev_010140` — 2021-11-11 observed website availability loss, modeled as `event_type: other`, effect `inactive`.

The event is not an operator-announced shutdown event and does not establish an exact death date.

## Evidence

- `hei_src_012617` — CoinCarp historical exchange profile.
- `hei_src_012618` — contemporaneous Winchain Official announcement documenting HCoin deposit/trading/withdrawal operation in December 2019.
- `hei_src_012619` — Cryptowisser 2021-11-11 website-unreachable / inactive marker.
- `hei_src_012620` — Seychelles FSA / Registrar of Companies 2024 caution notice.

## Delta

```text
Entities: +1
Events:   +1
Evidence: +4
```

## Boundaries

BX69 does not change monitoring, Cloudflare, localization breadth, schema, Language Selection, L-2 HOLD, or Ledger Series Phase 9 implementation.
