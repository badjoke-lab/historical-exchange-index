# HEI post-D-1000 growth — BX66

Date: 2026-08-23  
Lane: A — canonical record growth  
Issue: #820

## Scope

BX66 resolves the IDCM → Klickl brand lineage as two canonical exchange identities rather than flattening the historical and current brands into one record.

## Reviewed records

- IDCM — `hei_ex_001161` — `cex` — `rebranded`
- Klickl — `hei_ex_001162` — `cex` — `active`

Canonical lineage:

`IDCM (hei_ex_001161) -> Klickl (hei_ex_001162)`

## Lifecycle decisions

IDCM is not classified as a shutdown or insolvency. Reviewed first-party/company material states that the platform began in 2017 and that the brand, domain and exchange product family moved to Klickl in May 2022. The terminal IDCM state is therefore `rebranded` with `death_reason: rebrand`.

Klickl is stored as the active successor. Current first-party material continues to expose Quick Buy, professional trading, OTC and exchange services. ADGM's 2022 announcement independently confirms the group was formerly known as IDCM and records the in-principle approval then granted to Klickl.

The ADGM item is modeled narrowly as an in-principle approval event and is not generalized into a claim that every Klickl product or jurisdiction was fully licensed by that action.

## Evidence discipline

BX66 uses:

- an IDCM first-party blog for the 2017 operating history;
- a Klickl-sourced ACCESSWIRE company update for the May 2022 rebrand;
- ADGM for the regulatory event and explicit former-IDCM lineage;
- the current Klickl website for 2026 active exchange functionality;
- Klickl Group's official LinkedIn article for the brand/domain transition.

## Delta

- entities: +2
- events: +3
- evidence: +5

Allocated IDs:

- entities: `hei_ex_001161`–`hei_ex_001162`
- events: `hei_ev_010134`–`hei_ev_010136`
- evidence: `hei_src_012604`–`hei_src_012608`

## Boundaries

- L-2 remains HOLD.
- No Language Selection expansion.
- No monitoring configuration change.
- No Cloudflare/deployment configuration change.
- No Ledger Series Phase 9 mutation.
- FYB-SG/FYB-SE research in #819 remains separate and is not promoted without stronger terminal evidence.

## Validation

The complete record-only GitHub workflow matrix must pass on the final PR head before merge. Any URL-status, duplicate, lineage, ID-collision, enum, count-semantics, machine/public consistency or public-output failure must be repaired rather than bypassed.
