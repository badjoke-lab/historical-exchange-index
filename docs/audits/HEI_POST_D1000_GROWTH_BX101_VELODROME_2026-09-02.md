# HEI post-D1000 growth BX101 — Velodrome Finance — 2026-09-02

## Scope

Lane A canonical growth review for Velodrome Finance, prompted by the representation gap identified in issue #888.

This promotion is based on Velodrome's independent exchange identity and current first-party operating evidence. It is not a projection of Lisk Chain's announced shutdown into a whole-entity Velodrome lifecycle event.

## Identity and current state

Current first-party Velodrome documentation describes Velodrome as an automated-market-maker protocol designed to enable token swaps and liquidity provision, and states that Velodrome first launched on 2022-06-02.

The current first-party application remains live and explicitly presents Velodrome as a decentralized exchange where users can execute token swaps and deposit liquidity.

Canonical decision:

- create new exchange entity `hei_ex_001191`;
- canonical name `Velodrome Finance`;
- aliases `Velodrome`, `VELO`;
- type `dex`;
- status `active`;
- launch date `2022-06-02`;
- origin `Optimism ecosystem`;
- confidence `high`;
- no death date or death reason.

## Lifecycle event

Create `hei_ev_010216` for the first-party exact launch date, 2022-06-02.

No Lisk migration/shutdown event is added. Current HEI modeling remains entity-level; issue #888 separately tracks the Lisk deployment/support disposition ahead of the 2026-10-31 Lisk Chain shutdown.

## Evidence

- `hei_src_012758` — Velodrome first-party documentation, `https://velodrome.finance/docs`, supporting exchange identity and exact launch date.
- `hei_src_012759` — current Velodrome first-party exchange application, `https://velodrome.finance/`, supporting active DEX status.

## Duplicate and modeling boundary

Current repository search before allocation found no canonical Velodrome entity and no use of `hei_ex_001191`, `hei_ev_010216`, `hei_src_012758`, or `hei_src_012759`.

Aerodrome remains a separate canonical entity. Velodrome is not collapsed into Aerodrome merely because the protocols are related in Superchain liquidity infrastructure.

The Lisk Chain dependency is not used to mark Velodrome `limited`, `inactive`, or `dead` because Velodrome has independent operating surfaces and multi-network presence. Deployment-level changes remain outside current entity-level lifecycle semantics unless they materially change the whole exchange entity.
