# Consumed backlog rows: CoinEx

Status: added

## Added record

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000418` | CoinEx | `records/exchanges/coinex.json` | `hei_unadded_0550`, `hei_unadded_0551` |

## Source rows

Consumed from `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`:

```text
hei_unadded_0550 CoinEx
hei_unadded_0551 CoinEx
```

## Decision

CoinEx was not added as a thin active seed. It was added as an event-backed active centralized exchange record because the review found public historical event value:

- 2023 New York Attorney General settlement / New York operating ban
- 2023 hot-wallet security breach
- active exchange identity / official domain and exchange database references

## Consolidation

The CoinPaprika and CoinGecko candidate rows were consolidated into one canonical entity:

```text
hei_ex_000418 CoinEx
```

## Notes

- CoinEx remains an active exchange, so this is not a shutdown record.
- The regulatory event has stronger evidence than the hot-wallet breach event.
- The hot-wallet breach event is included with `medium` confidence and should be improved later with stronger primary or archived official-source evidence.
- CoinEx-related product or market rows after this range should not be automatically split into separate entities without a specific methodology decision.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should pass with this consumed memo.
