# HEI Post-D-1000 Growth — BX76

Date: 2026-08-25  
Status: REVIEWED IMPLEMENTATION  
Project: Historical Exchange Index (HEI)

## Scope

BX76 resolves the already-documented Bitpanda Pro -> One Trading rebrand boundary by adding the continuing One Trading identity and converting the previously null successor reference into an explicit reviewed lineage edge.

## Canonical changes

- add `hei_ex_001171` One Trading;
- `type: cex`;
- `status: active`;
- `launch_date: 2023-06-28` as the exact successor-identity transition marker;
- `country_or_origin: Netherlands`;
- `predecessor_id: hei_ex_000585`;
- add event `hei_ev_010154` for the 2023-06-28 One Trading identity launch through the Bitpanda Pro spin-out/rebrand;
- add evidence `hei_src_012647` through `hei_src_012650`;
- update Bitpanda Pro `successor_id` to `hei_ex_001171` and refresh its verification date;
- extend `config/lineage-later-dispositions.json` with the reciprocal reviewed lineage dispositions.

## Evidence review

Existing first-party Bitpanda and One Trading material already establishes the exact 2023-06-28 spin-out/rebrand and customer-account continuity. Fresh 2026 first-party One Trading material establishes a continuing exchange identity: current terms effective from 2026-06-15 identify One Trading Exchange B.V., its Amsterdam registered address, AFM supervision, MiFID investment-firm/OTF authorization and MiCA authorization to operate a crypto-asset trading platform and provide custody. Current site navigation exposes Trade, Exchange, account-opening and login entry points.

## Classification boundary

The 2023 transition is modeled as a rebrand/successor transition rather than an acquisition, shutdown or unrelated duplicate. The One Trading entity is active; older One Trading Markets S.r.l. service termination material is not treated as closure of the continuing One Trading Exchange B.V. venue because current 2026 first-party terms and trading entry points establish ongoing exchange operations.

The frozen A3 lineage disposition file is unchanged. Post-A3 lineage authority remains `config/lineage-later-dispositions.json`.

## Delta

```text
Entities: +1
Events:   +1
Evidence: +4
Existing entities updated: 1
Lineage dispositions added: 2
```

## Safety boundaries

BX76 does not change Cloudflare configuration, monitoring mutation policy, localization breadth, L-2 HOLD, schema, or Ledger Series Phase 9 production state.
