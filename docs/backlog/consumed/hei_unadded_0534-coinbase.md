# Consumed backlog row: Coinbase

Status: added

## Added record

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000419` | Coinbase | `records/exchanges/coinbase.json` | `hei_unadded_0534` |

## Source row

Consumed from `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`:

```text
hei_unadded_0534 Coinbase
```

## Decision

Coinbase was added as an event-backed active centralized exchange record, not as a thin active seed.

The record includes public event value:

- 2023 SEC civil action involving Coinbase
- 2025 SEC filing to dismiss that civil action
- active exchange identity / official website and database reference

## Not consumed

The following nearby rows were not consumed:

```text
hei_unadded_0535 Coinbase International Exchange
hei_unadded_0536 coinbaseadvanced
hei_unadded_0537 coinbaseexchange
hei_unadded_0538 coinbaseinternational
```

Reason: these may represent separate products, venues, or API IDs. They should not be automatically folded into Coinbase without a specific methodology decision.

## Notes

- Coinbase remains an active exchange, so this is not a shutdown record.
- The 2023 and 2025 regulatory-history events are recorded with high confidence.
- Related Coinbase product/API rows should be reviewed separately before any future consolidation.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should pass with this consumed memo.
