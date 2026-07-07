# HEI Data Growth Milestones Specification

Status: active data-growth source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-07

## 1. Authority and purpose

This document controls HEI entity-growth milestones, milestone gates around localization, reviewed-count semantics, and the relationship between the data-growth lane and the product/localization lane.

Execution order comes from:

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
```

Localization rollout rules come from:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

This specification fixes the post-v1 order as:

```text
G-7 v1.0 Baseline Checkpoint
        ↓
H Compare v1
        ↓
D-750 Reviewed Entity Milestone
        ↓
L-1 Japanese Pilot
        ↓
L-2 Localization Evaluation Gate
        ↓
D-1000 Reviewed Entity Milestone
        ↓
Language Selection Gate
        ↓
zero or one evidence-selected third-language pilot
```

Data growth continues in parallel while product work is active. The sequence above determines release gates and priority focus; it does not require data ingestion to stop during Compare or localization work.

## 2. Current baseline

At the v1 baseline candidate checkpoint:

```text
Reviewed entities:  550
Reviewed events:    1004
Reviewed evidence: 2621
```

The next entity milestones are:

```text
D-750:  750 reviewed entities
D-1000: 1000 reviewed entities
```

Delta from the 550 baseline candidate:

```text
550 -> 750:  +200 entities
750 -> 1000: +250 entities
550 -> 1000: +450 entities
```

## 3. Reviewed-count semantics

Do not derive current reviewed public counts from base-array lengths alone.

HEI reviewed public state is assembled using the same aggregation semantics as the public build:

```text
base canonical arrays
+
reviewed records/exchanges bundles
+
reviewed entity corrections
+
identity resolution
+
event/evidence merge semantics
```

Authoritative implementation modules include:

```text
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

Milestone completion must use reviewed public build semantics, not:

- raw candidate count;
- monitoring finding count;
- staging record count;
- base JSON array length alone;
- unmerged PR count.

A milestone is reached only when the reviewed public build resolves to at least the milestone entity count on `main`.

## 4. Priority principle

For HEI, canonical corpus growth has higher foundational value than broad translation coverage because one reviewed entity improves all present and future surfaces:

```text
Registry
Explorer
Stats
Compare
Change-layer links
machine-readable exports
AI/tool consumption
English presentation
Japanese presentation
future locale presentation
```

Localization is still strategically useful, but it must not become the dominant workload before HEI reaches the next data milestone.

Fixed rule:

```text
750 before Japanese public pilot
1000 before third-language selection
```

## 5. D-750 Reviewed Entity Milestone

### 5.1 Purpose

Move HEI from the 550-entity v1 baseline into a materially deeper historical corpus before opening the Japanese public pilot.

### 5.2 Completion gate

```text
reviewed public entities >= 750
canonical/public build validation PASS
record overlap/duplicate validation PASS
ID collision validation PASS
machine/public consistency PASS
no monitoring/staging leak into public state
```

### 5.3 Work allowed during D-750

- reviewed new entity bundles;
- reviewed event/evidence strengthening;
- entity corrections;
- status/lifecycle updates;
- archive/evidence improvement;
- candidate discovery and dedupe;
- quality repair;
- Compare maintenance fixes after H completion.

### 5.4 Work not allowed to bypass the milestone

Do not substitute any of the following for the 750 reviewed-entity gate:

- publishing 750 raw candidates;
- creating 750 staging records;
- counting duplicate aliases as entities;
- splitting deployments solely to inflate counts;
- relaxing evidence requirements;
- publishing uncertain candidates automatically.

## 6. Japanese Pilot gate at 750

The Japanese public pilot may begin only after:

```text
F-1 localization foundation COMPLETE
Phase G v1.0 baseline COMPLETE
H Compare v1 COMPLETE
D-750 reviewed entity milestone COMPLETE
```

Data growth continues during Japanese Pilot implementation and operation.

The 750 milestone is a release gate, not a freeze point.

## 7. L-2 evaluation and transition to D-1000

After L-1 Japanese Pilot launches:

```text
pilot live
    ↓
collect search / usage / maintenance evidence
    ↓
L-2 GO / HOLD / PIVOT decision
    ↓
continue core roadmap and D-1000 growth
```

The data-growth lane may continue from 750 toward 1000 while pilot evidence is being collected. The roadmap decision point remains:

```text
L-1 Japanese Pilot
        ↓
L-2 Localization Evaluation Gate
        ↓
D-1000 milestone completion focus
```

L-2 does not authorize a third language.

## 8. D-1000 Reviewed Entity Milestone

### 8.1 Purpose

Reach the first four-digit reviewed entity corpus before deciding whether HEI should support a third public language.

### 8.2 Completion gate

```text
reviewed public entities >= 1000
canonical/public build validation PASS
record overlap/duplicate validation PASS
ID collision validation PASS
machine/public consistency PASS
production verification plan for count-sensitive public output
```

### 8.3 Relationship to Japanese expansion

D-1000 and Japanese maintenance are separate lanes.

After L-2:

- `GO`: staged Japanese expansion may proceed without stopping D-1000 growth;
- `HOLD`: keep the pilot and prioritize D-1000 growth;
- `PIVOT`: retain useful Japanese foundation/pilot work, continue D-1000 growth, and defer any language change until the Language Selection Gate.

No outcome should stop canonical growth unless a verified quality or operational incident requires a temporary hold.

## 9. Quality constraints

Entity count is important, but milestone chasing must not weaken record quality.

Every reviewed addition must preserve:

- entity identity resolution;
- duplicate/overlap checks;
- status semantics;
- URL safety semantics;
- evidence traceability;
- entity/event/evidence reference integrity;
- reviewed-public boundary;
- manual merge responsibility.

There is no hard event/evidence ratio target in this specification. Existing validators and record bundle requirements remain the quality floor.

## 10. Parallel lane model

### Lane A — Data growth

```text
candidate discovery
normalize/dedupe
reviewed draft preparation
record validation
manual merge
quality strengthening
750 milestone
1000 milestone
```

### Lane B — Product/localization

```text
G-7 baseline
Compare v1
Japanese Pilot
Localization Evaluation Gate
Japanese staged expansion only after GO
Language Selection Gate after 1000
```

### Lane C — Operations

```text
monitoring
watchlists
review queues
Registry Updates
monthly reviewed snapshots
production verification
```

The lanes run concurrently, but release gates are fixed by the roadmap.

## 11. Third-language prohibition before 1000

No third public language may be launched before:

```text
D-1000 COMPLETE
Japanese Pilot evidence exists
L-2 decision recorded
Language Selection Gate executed
```

No third language is preselected.

Possible candidates may include Spanish, Portuguese, Korean, Vietnamese, Indonesian, Chinese variants, or others, but selection must use HEI-specific evidence and operator QA capacity.

Only one additional language pilot may be introduced at a time unless operating capacity changes materially.

## 12. Milestone reporting

When D-750 or D-1000 completes, record:

```text
main SHA
reviewed entity count
reviewed event count
reviewed evidence count
aggregation semantics used
validation commands
known quality limitations
next roadmap item
```

Milestone completion PRs must cite this specification and the active roadmap item.

## 13. Change control

Review this specification and the roadmap together before changing:

- 750 as the Japanese Pilot gate;
- 1000 as the Language Selection Gate prerequisite;
- reviewed-count semantics;
- milestone order;
- whether data growth may continue in parallel;
- quality constraints;
- third-language prohibition before 1000.

Do not change these priorities through chat memory alone. Update repository authorities first.
