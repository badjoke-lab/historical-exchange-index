# HEI D-750 Reviewed Entity Milestone Completion Checkpoint

Date: 2026-07-10  
Status: PASS  
Project: Historical Exchange Index (HEI)

## 1. Conclusion

The D-750 Reviewed Entity Milestone is complete.

The reviewed public build resolves to:

```text
Entities: 750
Events:   1004
Evidence: 3219
```

The milestone target was:

```text
reviewed public entities >= 750
```

The next roadmap item is:

```text
L-1 Japanese Pilot
```

This checkpoint does not authorize a third-language pilot. The later L-2 Localization Evaluation Gate and D-1000 Reviewed Entity Milestone remain separate roadmap gates.

## 2. Main identity

The final D-750 growth PR is:

```text
#639  Add D-750 reviewed exchange batch BJ1
```

Final reviewed growth head:

```text
26eef699e1dc9f7eb3ae4c8ba9322a218a74cc4f
```

Merged main commit:

```text
90456332375276623b90a9c0437e8d25625852df
```

The merge commit is one commit ahead of the validated BJ1 head and has no file-level differences from that validated head. The count-semantics evidence therefore applies to the merged main tree content.

## 3. Reviewed count semantics evidence

The final Count semantics regression artifact reported:

```text
canonical counts:
  entities: 306
  events:   513
  evidence: 1172

reviewed bundles:
  total:        606
  new entities: 444
  repairs:      162

projected reviewed public counts:
  entities: 750
  events:   1004
  evidence: 3219

monitoring counts:
  entities: 750
  events:   1004
  evidence: 3219

machine counts:
  entities: 750
  events:   1004
  evidence: 3219

built output counts:
  entities:              750
  events:                1004
  evidence:              3219
  exchange detail pages: 750
  sitemap entity routes: 750
  sitemap total routes:  763

status: pass
```

The companion bundle-ID collision artifact reported:

```text
reviewed bundle count: 606

event conflicts:    0
evidence conflicts: 0
total conflicts:    0

status: pass
```

## 4. Final validation cycle

PR #639 passed all 16 pull-request workflow runs before merge.

Successful workflows included:

```text
Records validation
Metadata audit diagnostics
Lineage inventory audit
Machine/public consistency gate
Candidate scan gate
Watchlist resolution gate
Canonical-only DEX repair queue
Country origin strict gate
Active CEX repair audit
Count semantics regression
Canonical-only active CEX queue
DEX seed readiness audit
URL safety gate
CI
Permanent entity quality audit
Backlog dedupe
```

The CI build-and-lint job also passed the following relevant steps:

```text
repository operations policy check
Cloudflare configuration print check
country/origin audit export
lint
record validation
legacy enum checks
projected enum check
monitoring smoke test
monitoring completion self-test
Next.js build
machine-readable validation
public-output validation
```

## 5. D-750 completion gate

The milestone completion specification requires:

```text
reviewed public entities >= 750
canonical/public build validation PASS
record overlap/duplicate validation PASS
ID collision validation PASS
machine/public consistency PASS
no monitoring/staging leak into public state
```

Result:

```text
reviewed public entities >= 750         PASS
canonical/public build validation       PASS
record overlap/duplicate validation     PASS
ID collision validation                 PASS
machine/public consistency              PASS
reviewed-public boundary                PASS
```

Overall result:

```text
PASS
```

## 6. Growth result from v1 baseline

The v1 baseline reviewed public state was:

```text
Entities: 550
Events:   1004
Evidence: 2621
```

The D-750 completion state is:

```text
Entities: 750
Events:   1004
Evidence: 3219
```

Net reviewed growth from the v1 baseline:

```text
Entities: +200
Events:   +0
Evidence: +598
```

The milestone was reached without using deployment splitting, raw candidate counts, staging counts, alias inflation, or automatic publication of uncertain candidates.

## 7. Boundary and quality preservation

The D-750 growth lane preserved the following operating constraints:

```text
entity-first identity resolution
current-main overlap checks before drafting
reviewed PRs and manual merge responsibility
status semantics
URL safety semantics
evidence traceability
entity/event/evidence reference integrity
monitoring and staging separation
machine/public consistency
```

During the final growth batches, stale candidate assumptions repeatedly encountered existing reviewed identities. Those candidates were excluded or replaced rather than duplicated. Ambiguous lifecycle candidates were kept out of routine growth when current or terminal state could not be established safely.

## 8. Roadmap transition

The fixed post-v1 sequence is now at:

```text
Phase H — Compare v1             COMPLETE
D-750 Reviewed Entity Milestone  COMPLETE
L-1 Japanese Pilot               NEXT
```

L-1 prerequisites are now satisfied:

```text
F-1 localization foundation  COMPLETE
Phase G v1 baseline          COMPLETE
Phase H Compare v1           COMPLETE
D-750 milestone              COMPLETE
```

The next implementation work should follow the existing localization strategy and foundation specifications. The Japanese Pilot remains a controlled pilot with English fallback and does not require full-registry translation.

## 9. Evidence references

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
scripts/check-count-semantics-regression.mjs
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
PR #639
Count semantics workflow run #837
Count semantics artifact: count-semantics-audit
```
