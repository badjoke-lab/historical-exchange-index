# Watchlist resolution records

This directory stores reviewed monitoring-candidate outcomes. These files are operational metadata and do not replace canonical entity, event, or evidence data.

## Current state

`index.json` is the authoritative current-resolution file. Every entry has a stable `candidate:*` key and one state:

- `promoted`
- `already_canonical`
- `duplicate`
- `out_of_scope`
- `held`
- `needs_research`

The first four states are terminal. `held` and `needs_research` remain visible as tracked work, but monitoring does not report them as newly discovered on every run.

## Historical files

Dated JSON files remain as audit records. A historical candidate decision must also be represented in `index.json`. Quality-repair batch files are not candidate resolutions.

## Stable identity

New monitoring output uses normalized names and aliases to create keys such as:

```text
candidate:txbit
candidate:hashkey-exchange
candidate:dx-exchange
```

Older date-local IDs remain only in historical files.

## Review procedure

1. Review the candidate and sources.
2. Add or update one entry in `index.json`.
3. Keep the dated resolution record that supports the decision.
4. Run:

```text
npm run watchlists:test
npm run watchlists:check
```

5. For `promoted` and `already_canonical`, confirm a projected HEI entity match.
