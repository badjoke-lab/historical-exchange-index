# HEI post-D-1000 growth BX79 — Bitcoin.com Exchange → FMFW.io

Date: 2026-08-28
Status: REVIEWED IMPLEMENTATION
Issue: #890

## Decision

Add the Bitcoin.com Exchange → FMFW.io transition as a two-entity rebrand lineage rather than a single alias-only active record.

Canonical model:

- predecessor entity: `hei_ex_001176` / `bitcoin-com-exchange`
- predecessor status: `rebranded`
- predecessor death_reason: `rebrand`
- predecessor launch_date: `2019-09-02`
- predecessor death_date: `2021-09-29`
- successor entity: `hei_ex_001177` / `fmfw-io`
- successor status: `active`
- successor launch_date: `2021-09-29`
- events: `hei_ev_010203`–`hei_ev_010205`
- evidence: `hei_src_012703`–`hei_src_012709`

## Current-main reconciliation

BX79 was opened from exact current main `66dd5af9375e36f8115eb1f5649027c644931848` after the superseded IZAKA-YA PR #887 was closed. At branch creation, the latest canonical entity was BX78 iCoinbay `hei_ex_001175`; the latest events/evidence were the merged #889 IZAKA-YA/CryptoPanda follow-up through `hei_ev_010202` and `hei_src_012702`.

Direct canonical-path probes found no existing `bitcoin-com-exchange.json` or `fmfw-io.json`. Repository code search found Bitcoin.com Exchange / FMFW.io only in backlog research material, not in canonical bundles. IDs were therefore allocated from the current-main maxima without reusing stale draft IDs.

## Launch evidence

Bitcoin.com's contemporaneous first-party launch publication states that `exchange.bitcoin.com` was live on 2019-09-02. HEI uses that exact date for the predecessor launch marker.

## Rebrand and lineage evidence

FMFW.io first-party rebranding material establishes the identity transition on 2021-09-29. The FAQ states that existing Bitcoin.com Exchange users retained the same login credentials and 2FA, wallet addresses did not change, open orders were not cancelled, and the API behavior remained the same apart from the root-domain migration.

Because the evidence establishes a named successor identity plus operational/account continuity, HEI does not collapse FMFW.io into a mere alias and does not model the transition as acquisition, merger, insolvency, or independent shutdown. The predecessor and successor are linked bidirectionally.

## Current-state evidence

FMFW.io's current first-party About page and User Agreement remain available in 2026 and describe a functioning cryptocurrency exchange service. The successor is therefore recorded as `active` with `official_url_status: live_verified`.

## Jurisdiction boundary

Reviewed materials use changing company/operator language and do not establish a sufficiently clear durable exchange operating jurisdiction covering the identities in a way that should be encoded as a specific country. Both records therefore use the existing reviewed `Global` value rather than inferring jurisdiction from press-release datelines, branding, or footer language.

## Source-count check

- `hei_ev_010203`: 1 directly linked evidence → `source_count: 1`
- `hei_ev_010204`: 2 directly linked evidence → `source_count: 2`
- `hei_ev_010205`: 2 directly linked evidence → `source_count: 2`

## Delta

- entities: +2
- events: +3
- evidence: +7
- lineage pairs: +1

## Boundaries

No monitoring promotion, schema change, validator weakening, localization change, Cloudflare change, or Ledger Series Phase 9 production mutation is included.
