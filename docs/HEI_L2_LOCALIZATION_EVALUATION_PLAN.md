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

Next roadmap item after L-2 decision:

```text
D-1000 Reviewed Entity Milestone
```

The initial L2 state is expected to be HOLD because the public Japanese Pilot has just launched and search, indexing, usage, and operator-burden evidence are not yet mature.

### 2.1 Parallel canonical growth during HOLD

HOLD keeps the Japanese Pilot public but does not block reviewed canonical data growth.

After D-1000 batch BX18, the projected reviewed state is:

```text
Entities: 869
Events:   1004
Evidence: 3497
```

The localization decision remains HOLD. Translation breadth is not expanded by BX18, and third-language authorization remains false.

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

GO means the Japanese Pilot may continue controlled expansion.

GO does not authorize:

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
continue canonical data growth
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

The current initial evidence snapshot is expected to evaluate as:

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

Until those conditions are satisfied, HOLD is the correct state.
