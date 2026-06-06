# Consumed backlog row: EtherDelta

Status: added

## Added record

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000421` | EtherDelta | `records/exchanges/etherdelta.json` | `hei_unadded_0843` |

## Source row

Consumed from `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`:

```text
hei_unadded_0843 EtherDelta
```

## Decision

EtherDelta was added as an event-backed historical DEX record, not as a thin database seed.

The record includes public event value:

- early Ethereum token-exchange operation context
- SEC 2018 action involving EtherDelta's founder
- SEC administrative order as primary legal-document evidence

## Notes

- EtherDelta is treated as one historical DEX entity.
- The SEC action does not by itself provide a precise platform shutdown date.
- Status is set to `inactive` with `inactive_or_superseded` because the original venue is not treated as a current active exchange in HEI's registry context.
- If stronger shutdown/inactivity sources are found later, they should be added as a separate event.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should pass with this consumed memo.
