# Consumed backlog row: Crema Finance

Status: added

## Added record

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000420` | Crema Finance | `records/exchanges/crema-finance.json` | `hei_unadded_0600` |

## Source row

Consumed from `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`:

```text
hei_unadded_0600 Crema Finance
```

## Decision

Crema Finance was added as an event-backed DEX / protocol record, not as a thin active seed.

The record includes public event value:

- July 2022 smart-contract / flash-loan-related exploit reporting
- reported attacker return / bounty arrangement
- DOJ official source for the unnamed Solana DEX incident, with Axios and CoinDesk used to connect the public reporting to Crema Finance

## Notes

- The DOJ source does not name Crema Finance directly.
- The record therefore uses `medium` confidence for the exploit event.
- Improve later if archived official Crema Finance incident posts or other primary-source materials are found.
- This record does not mark Crema Finance as dead.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should pass with this consumed memo.
