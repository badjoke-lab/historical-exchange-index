# Range 0251-0300 final identity reviews

Reviewed at: 2026-07-05

## Rows

- `0261` BMX Classic product row
- `0269` bopAMM
- `0287` BTSE Futures
- `0300` Bybit EU

## Results

- `0261` -> parent BMX Trade added as `hei_ex_000610`; no standalone product-row entity.
- `0269` -> parent Bebop added as `hei_ex_000609`; no standalone bopAMM entity.
- `0287` -> existing parent BTSE `hei_ex_000052`; no standalone futures-product entity.
- `0300` -> existing parent Bybit `hei_ex_000011`; regional European platform already represented in the parent record and event history.

## Bebop decision

The reviewed project directory identifies Bebop as a decentralized trading platform with its own website, trading application, GitHub organization, and deployed contracts. The bopAMM row is therefore consumed as a product or protocol surface under the parent Bebop entity rather than promoted independently.

## BMX Trade decision

The reviewed project directory identifies BMX Trade as the current parent trading platform, formerly MorpheX, with spot, margin, and derivatives markets and several product surfaces. The candidate row is therefore resolved under new parent entity `hei_ex_000610` rather than promoted as a separate exchange.

## BTSE decision

BTSE already exists as `hei_ex_000052`, with active exchange status, official-domain evidence, launch evidence, and regulatory history. The futures row is a product-level surface under that parent and does not justify another canonical entity.

## Bybit decision

Bybit already exists as `hei_ex_000011`. Its parent record already includes the European authorization and platform rollout in the event and evidence history. The Bybit EU row is therefore consumed under the existing parent instead of creating a regional duplicate.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 4
- existing parent matches: 2
- unresolved research rows: 0
- range status: closed

No Cloudflare or deployment changes are included.
