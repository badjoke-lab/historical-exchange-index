# Range 0901-0950 D-750 Batch L1

Reviewed at: 2026-07-08

## Results

- `0908` HashKey Exchange / `hashkey` -> existing reviewed entity `hei_ex_000093`; no new entity
- `0909` HashKey Global -> `hei_ex_000700`, active CEX

## Entity-boundary result

HashKey Exchange and HashKey Global must not be merged into one HEI entity.

The existing `hei_ex_000093` record already represents the Hong Kong HashKey Exchange and preserves its retail-launch, licensing, events, and evidence. Direct bundle verification found that record after the original candidate scan had left the HashKey pair in boundary research.

HashKey Global is a distinct exchange surface. HashKey Group's first-party business overview presents a licensed global exchange separately from the licensed Hong Kong exchange. The Global platform states that it is licensed by the Bermuda Monetary Authority and offers its own spot, futures, and Launchpool products.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- existing reviewed entity confirmed: 1
- projected entity count: 584
- projected event count: 1004
- projected evidence count: 2721
- remaining to D-750 after projected merge: 166

## Scan correction

The 0901-0950 scan authority must be corrected as follows:

```text
0908 hashkey          needs_research -> out_of_scope_or_duplicate
0909 HashKey Global  needs_research -> add_now / consumed by L1
```

This changes scan counts from:

```text
add_now: 29
needs_research: 6
pending_thin: 3
out_of_scope_or_duplicate: 12
```

to:

```text
add_now: 30
needs_research: 4
pending_thin: 3
out_of_scope_or_duplicate: 13
```

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
