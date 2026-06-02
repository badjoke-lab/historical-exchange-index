# Consumed backlog row: Bittrex

Status: added

## Purpose

Consume `hei_unadded_0337` as a thicker, event-backed Bittrex record.

Bittrex is handled separately from the batch of thin active CEX seed records because it has major shutdown, regulatory, and bankruptcy history.

## Added record

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000397` | Bittrex | `records/exchanges/bittrex.json` | `hei_unadded_0337` |

## Consumed source row

- `hei_unadded_0337` Bittrex

Source row:

- source: CoinPaprika exchanges
- source_id: `bittrex`
- source_url: `https://api.coinpaprika.com/v1/exchanges`

## Duplicate / entity handling

Bittrex is not merged with Bittrex Global.

Public-site check before creation showed `Bittrex Global` as a separate dead-side match. Bittrex Global is treated as a related international entity, while this record is for the U.S. Bittrex / Bittrex Inc. exchange entity.

Decision:

- Create `records/exchanges/bittrex.json`.
- Do not add `Bittrex Global` as an alias.
- Do not merge with the existing Bittrex Global record.
- Use notes to clarify the relationship.

## Events captured

| event_id | type | date | purpose |
|---|---|---|---|
| `hei_ev_000705` | `shutdown_announced` | `2023-03-31` | Bittrex announced the end of U.S. operations. |
| `hei_ev_000706` | `regulatory_action` | `2023-04-17` | SEC charged Bittrex over unregistered exchange/broker/clearing agency allegations. |
| `hei_ev_000707` | `legal_proceeding` | `2023-05-08` | Bittrex filed for Chapter 11 bankruptcy after the U.S. wind-down. |

## Evidence used

- Investopedia coverage of Bittrex ending U.S. operations.
- Bittrex original domain / web archive.
- SEC press release 2023-78.
- Investopedia coverage of Bittrex bankruptcy.
- CoinPaprika source row from verified-unadded candidate list.

## Pre-add checks

Repository search before creation found no existing direct Bittrex record:

- `Bittrex`: no direct record hit
- `bittrex`: no direct record hit
- `records/exchanges/bittrex.json`: not found

Public-site check:

- Search for `bittrex` matched `Bittrex Global` only.
- This was treated as related but not a duplicate.

## Next action

Continue with remaining candidates:

- BitGlobal
- Bithumb Singapore
- Bitinka
- BitMEX / BitMEX derivatives rows if not already present
- BitMart Futures if scoped separately
- Bitrue / Bitrue Futures
