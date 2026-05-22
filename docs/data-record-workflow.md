# HEI record-bundle workflow

This workflow separates the editing source of truth from the generated site data.

## Goal

HEI can keep the existing public data files:

- `data/entities.json`
- `data/events.json`
- `data/evidence.json`

But new exchange records should be authored as one bundle per exchange:

- `records/exchanges/<slug>.json`

The bundle format is easier to review, easier to create through GitHub, and avoids editing three large JSON arrays by hand for every new exchange.

## Bundle shape

Each bundle must contain exactly one exchange entity, its events, and its evidence.

```json
{
  "entity": {},
  "events": [],
  "evidence": []
}
```

The filename must match `entity.slug`:

```text
records/exchanges/txbit.json
```

## Required checks

Run:

```bash
npm run records:validate
```

The validator checks:

- bundle JSON is valid
- `entity`, `events`, and `evidence` are present
- required fields exist
- filename matches `entity.slug`
- ids use HEI prefixes
- event `exchange_id` matches the bundle entity
- evidence `exchange_id` matches the bundle entity
- evidence `event_id` points to an event in the same bundle or is `null`
- event `source_count` equals the number of matching evidence rows
- ids are unique across record bundles

## Build generated data

Run:

```bash
npm run records:build
```

This merges all bundle files into the existing generated files:

- `data/entities.json`
- `data/events.json`
- `data/evidence.json`

The build script refuses to overwrite existing ids already present in the generated data files.

## Current migration stance

This PR does not migrate all existing records.

Current rule:

- Existing `data/*.json` remains the public generated data.
- New additions may be authored as record bundles.
- After validation, `records:build` can generate updated `data/*.json`.
- Existing legacy records can be migrated gradually later.

## Why this exists

The old append workflow requires editing three large JSON files for each exchange. That is workable at small scale, but it becomes risky when HEI grows to hundreds or thousands of records.

The bundle workflow makes each new record reviewable as a single file while preserving the current public data format.
