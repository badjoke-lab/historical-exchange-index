# HEI Post-D-1000 Growth — BX75 DeversiFi

Date: 2026-08-25  
Status: REVIEWED / PR PENDING  
Project: Historical Exchange Index (HEI)

## Scope

Resolve the deferred historical DeversiFi exchange identity without forcing current rhino.fi into HEI as a pure exchange entity.

## Identity and overlap

Repository checks found no current canonical `records/exchanges/deversifi.json`. DeversiFi is distinct from unrelated current venues and from the current broader rhino.fi product scope.

## Classification

- entity: `hei_ex_001170`
- type: `dex`
- status: `rebranded`
- death reason: `rebrand`
- launch: `2020-06-03`
- rebrand/death marker: `2022-07-13`
- origin: `Global`

The historical protocol is treated as a decentralized exchange identity rather than as a jurisdiction-defined centralized operator.

## Lifecycle evidence

First-party rhino.fi material published on 2021-06-03 states that DeversiFi was unveiled exactly one year earlier on 2020-06-03 and records $300m traded in its first year. The 2022-07-13 first-party rebrand notice states that DeversiFi became rhino.fi. A 2024 first-party retrospective explicitly describes DeversiFi as an orderbook DEX launched in June 2020 and says the project later pivoted to rhino.fi while deprioritizing the DEX.

## Successor boundary

No `successor_id` is created in BX75. Current rhino.fi has evolved into a broader multi-chain/stablecoin and infrastructure product, and its current retail offering is separately in wind-down. A forced exchange-to-exchange successor edge would overstate continuity of HEI scope. The historical rebrand itself is retained in the lifecycle notes and evidence.

## Delta

- entities: +1
- events: +2
- evidence: +3

## Safety boundaries

BX75 does not change Cloudflare, monitoring, localization scope, L-2 HOLD, canonical schema, or Ledger Series Phase 9 state.
