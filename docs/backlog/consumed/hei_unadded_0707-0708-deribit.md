# Consumed backlog rows: Deribit

Status: added

## Added record

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000422` | Deribit | `records/exchanges/deribit.json` | `hei_unadded_0707`, `hei_unadded_0708` |

## Source rows

Consumed from `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`:

```text
hei_unadded_0707 Deribit
hei_unadded_0708 Deribit Spot
```

## Decision

Deribit was added as an event-backed active centralized derivatives exchange record, not as a thin active seed.

The record includes public event value:

- Coinbase's 2025 agreement to acquire Deribit
- active exchange identity / official website and exchange database references

## Consolidation

`Deribit` and `Deribit Spot` were consolidated into one canonical entity:

```text
hei_ex_000422 Deribit
```

## Notes

- Deribit remains an active exchange, so this is not a shutdown record.
- The acquisition announcement is recorded as an event and should not be interpreted as Deribit being closed.
- Related product or market rows should not be split into separate entities without a methodology decision.
- Older PR #313 was closed without merge because it used a now-conflicting ID.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should pass with this consumed memo.
