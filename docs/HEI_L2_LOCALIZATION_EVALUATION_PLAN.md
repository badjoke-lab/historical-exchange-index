# HEI L-2 Localization Evaluation Plan

Status: active evaluation plan  
Project: Historical Exchange Index (HEI)  
Entry gate: L-1 Japanese Pilot public activation and L1-5 controlled copy sample complete

## 1. Objective

L-2 evaluates whether the Japanese Pilot should continue expanding, remain deliberately limited, or change direction.

The decision values are:

```text
GO
HOLD
PIVOT
```

L-2 evaluates the Japanese Pilot only.

L-2 does not authorize a third language.

## 2. Current item

```text
L2-1 — Evaluation contract, telemetry, and evidence capture
```

Next roadmap item after an evidence-backed L-2 decision:

```text
Language Selection Gate
```

D-1000 is complete. The remaining blocker before Language Selection is the L-2 evidence and decision requirement, not entity-count growth.

### 2.1 Canonical growth status during HOLD

HOLD keeps the Japanese Pilot public and does not block reviewed canonical data or quality growth.

The D-1000 milestone completion baseline is:

```text
Entities: 1000
Events:   1025
Evidence: 3781
```

Completion authority:

```text
docs/audits/HEI_D1000_MILESTONE_COMPLETION_2026-08-09.md
```

Reviewed canonical growth continues after D-1000. With post-D-1000 BX62, the current reviewed state is:

```text
Entities: 1034
Events:   1037
Evidence: 3867
```

Current post-D-1000 growth authority:

```text
docs/audits/HEI_POST_D1000_GROWTH_BX62_2026-08-13.md
```

The localization decision remains HOLD until real evaluation evidence is complete. D-1000 completion and later canonical growth do not expand translation breadth and do not authorize a third language.

## 3. Evidence categories

L-2 requires four signal groups:

```text
search_visibility
usage
quality
operations
```

Each group is classified as:

```text
positive
neutral
negative
unknown
```

Unknown is not treated as failure. It prevents premature GO.

## 4. Required external metrics

The following external metrics are required before a GO decision:

```text
japanese_search_impressions
japanese_search_clicks
indexed_route_sample_pass_rate
japanese_pageviews
language_switch_events
```

Expected sources:

```text
Google Search Console
Google Analytics 4
manual representative indexing sample
```

Values must not be fabricated or inferred from route existence alone.

## 5. Repository-derived metrics

The evaluator also derives stable repository metrics:

```text
reviewed entity count
Japanese entity overlay count
Japanese event overlay count
entity copy coverage percent
entity summary fallback percent
```

These metrics describe localization breadth. They do not by themselves prove demand.

## 6. Observation window

Minimum observation window:

```text
28 days
```

A shorter window results in HOLD unless a material quality or operational problem requires PIVOT.

The purpose is to avoid declaring success or failure from launch-day noise.

Satisfying the calendar window alone is not enough for GO. Required external and operational evidence must also be populated.

## 7. Decision contract

### 7.1 GO

GO requires:

```text
minimum observation window satisfied
required external metrics complete
no required signal group negative
no required signal group unknown
search visibility or usage positive
no critical locale failure
```

Quality and operations may be neutral if they are not negative.

GO means the Japanese Pilot may continue controlled expansion and the Language Selection Gate becomes eligible to run.

GO does not itself authorize:

```text
a third language
a full-registry translation pass
automatic machine translation into canonical data
translation of evidence titles or publishers
```

### 7.2 HOLD

HOLD is the default when:

```text
observation window is too short
required external metrics are missing
required signal groups remain unknown
neither search visibility nor usage is positive yet
```

HOLD means:

```text
keep the Japanese Pilot public
continue collecting evidence
preserve fallback behavior
avoid broad translation expansion
continue canonical data and quality growth
keep Language Selection blocked
```

### 7.3 PIVOT

PIVOT is used for material problems such as:

```text
critical locale failure
negative quality signal
two or more required signal groups negative
```

PIVOT may mean reducing scope, changing copy strategy, repairing navigation or metadata, or pausing further overlay expansion.

Ordinary low-volume early data is not enough for PIVOT.

A PIVOT decision still does not automatically authorize Language Selection; the roadmap transition must be recorded explicitly.

## 8. Telemetry contract

HEI already receives normal pageview measurement through GA4 when a measurement ID is configured.

L-2 adds an explicit language-switch event:

```text
hei_language_switch
```

Parameters:

```text
from_locale
to_locale
source_path
```

The event is not emitted when the selected locale is already current.

This event supports evaluation of deliberate locale switching without changing routing behavior.

## 9. Evidence snapshot

Current evidence lives at:

```text
data-evaluation/l2-localization-evidence.json
```

The evidence snapshot contains:

```text
observation window
external metrics
operational metrics
signal classifications
evidence notes
```

The snapshot must be updated from real evidence before a later GO or PIVOT decision.

D-1000 completion does not substitute for missing search, usage, indexing, or operator-burden evidence.

## 10. Evaluation tooling

Authoritative contract:

```text
config/l2-localization-evaluation-contract.json
```

Evaluator:

```text
scripts/evaluate-l2-localization-gate.mjs
```

Commands:

```text
npm run localization:evaluate:test
npm run localization:telemetry:test
npm run localization:evaluate
```

Until the evidence snapshot is populated sufficiently, the expected reproducible decision remains:

```text
HOLD
```

## 11. Safety boundaries

L-2 must preserve:

```text
canonical facts single-source
English fallback
Japanese path identity
canonical slug identity
URL safety rules
reviewed-only public state
machine/public consistency
```

The evaluation layer must not modify canonical entity, event, or evidence data.

## 12. Completion gate

L-2 may be considered decision-ready only when:

```text
observation window >= 28 days
required external metrics are populated
required signal groups are classified from evidence
broken locale link state is reviewed
operator QA burden is recorded
translation synchronization burden is reviewed
localization CI failure rate is reviewed
GO / HOLD / PIVOT evaluation is reproducible
third_language_authorized remains false
```

Until those conditions are satisfied, HOLD is the correct state and the Language Selection Gate remains blocked.
