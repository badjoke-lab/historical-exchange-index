# HEI post-D-1000 growth BX78 — iCoinbay

Date: 2026-08-25
Status: REVIEWED IMPLEMENTATION
Issue: #885

## Decision

Add iCoinbay as a historical centralized exchange with conservative current status `inactive`.

Canonical model:

- entity: `hei_ex_001175`
- slug: `icoinbay`
- status: `inactive`
- death_reason: null
- launch_date: null
- death_date: null
- country_or_origin: `Unknown`
- URL status: `unsafe`
- event: `hei_ev_010159`
- evidence: `hei_src_012665`–`hei_src_012669`

## Current-main reconciliation

The original BX78 branch was opened before reviewed Bitmama (`hei_ex_001173`) and OKJ (`hei_ex_001174`) records and the later IZAKA-YA ID-collision repair landed on main. BX78 was therefore replayed from current main and renumbered to the next free canonical IDs. No validator or collision rule was weakened.

## Historical operation

CryptoCompare's October 2018 Exchange Review evaluated iCoinBay trading data and selected it for CCCAGG inclusion effective 2018-11-02. The historical iCoinbay Medium publication and a November 2018 company-supplied PRNewswire release independently preserve the exchange identity and its tokenized community/trading model.

These sources establish real exchange operation by 2018, but they do not provide a sufficiently reliable exact launch date. No exact launch marker is invented.

## Current-state boundary

The original `icoinbay.com` domain still resolves and exposes stale historical exchange copy, but the current page also contains extensive unrelated casino and SEO links. That page is not accepted as proof that a legitimate exchange is currently operating.

HEI therefore records a dated 2026-08-25 observation event with status effect `inactive`. This is an observation marker only: it is not treated as the date on which trading actually ceased.

No reviewed source establishes a clean terminal operator announcement, bankruptcy, insolvency, hack, scam/rug, regulatory shutdown, or voluntary closure. `death_reason` and `death_date` remain null.

## Origin review

A PRNewswire release supplied by iCoinbay uses a Shanghai dateline. A press-release dateline alone does not establish the exchange's incorporation, licensing, contracting entity, or durable operating origin. No stronger reviewed jurisdictional artifact was recovered in this pass.

`country_or_origin` is therefore intentionally `Unknown`, and `hei_ex_001175` is added to `config/reviewed-unknown-origins.json` rather than weakening the strict country/origin gate.

## URL safety

The original domain is classified `unsafe` because its present content is polluted with unrelated gambling/SEO links while retaining stale exchange UI text. HEI does not direct users to treat the current site as an authentic operating exchange.

## Delta

- entities: +1
- events: +1
- evidence: +5
- reviewed Unknown-origin set: +1

## Boundaries

No monitoring, Cloudflare, localization breadth, schema, L-2 decision, or Ledger Series Phase 9 production mutation is included.
