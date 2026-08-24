# Publication gate classification

Time-sensitive publication uses a minimal blocking set. Full-corpus audits and derived-history maintenance must not block publication of otherwise valid canonical records.

## Publication-blocking

- Canonical/schema validation for the changed record/event/evidence.
- Build success for affected human and machine-readable surfaces.
- URL/safety checks that directly protect users from unsafe or invalid publication.
- Production deploy and live human + machine-readable smoke verification.

## Non-blocking maintenance

- Material concerns retroactive full-corpus audit.
- Metadata/full-corpus audits.
- Historical statistics/history reconstruction that does not invalidate the changed canonical record.
- Roadmap/count/checkpoint synchronization.
- Phase/readiness audits unrelated to the changed record.

Non-blocking maintenance may produce artifacts, issues, and correction PRs. Failure must not prevent a time-sensitive record from being published.

## Rule

Canonical publication never waits for a stale audit checkpoint. Audit/checkpoint state follows canonical state, not the reverse.
