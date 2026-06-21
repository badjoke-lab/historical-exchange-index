# HEI A5 entity quality audit — 2026-06-22

## Result

The permanent projected-public entity audit is active and passes its strict completion gate.

```text
Projected public entities: 412
Critical findings:            0
High findings:                2
Medium findings:              1
Low findings:                30
Total findings:              33
```

A5 fails CI only when critical structural findings exist. High, medium, and low findings remain visible in the uploaded JSON and Markdown artifacts as review queues.

## Permanent checks

The audit covers:

- entity type, status, death reason, confidence, and official URL status enums;
- missing country or origin;
- original URL and domain validity and consistency;
- missing archives and original domains;
- active-side URL-state conflicts;
- provisional text markers;
- missing, self-referential, or invalid lineage targets;
- unreviewed non-reciprocal predecessor and successor links;
- suspicious lineage language without structured links.

The audit runs on pull requests, pushes to main, and manual dispatch. It performs a self-test, emits JSON and Markdown artifacts, and acts as a permanent structural gate.

## Remaining quality queue

### High

- BKEX: limited status with `dead_domain` original URL status.
- ZB.com: limited status with `dead_domain` original URL status.

These are not treated as critical because the entity state and domain state may legitimately diverge, but they require later status review.

### Medium

- Crema Finance: original official domain is missing.

### Low

- Thirty entities contain lineage-related narrative language without a structured predecessor or successor field.

Many of these are expected document-only or unresolved cases from A3. The findings remain useful as a future review queue and do not justify forced lineage links.

## Normalized projected records

A5 also removes invalid legacy enum values from the projected public state for CommEX, EtherDelta, Fairdesk, and LINE BITMAX without changing entity, event, or evidence counts.

## Count impact

```text
Entities:  412
Events:    687
Evidence: 1608
```

## Next phase

Phase B begins with a full run of all six monitoring groups after structural cleanup.
