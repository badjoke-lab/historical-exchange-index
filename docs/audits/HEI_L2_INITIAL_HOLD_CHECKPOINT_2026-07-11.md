# HEI L-2 Initial HOLD Checkpoint

Date: 2026-07-11  
Status: HOLD  
Project: Historical Exchange Index (HEI)

## 1. Conclusion

The initial L-2 Localization Evaluation Gate decision is:

```text
HOLD
```

This is not a negative verdict on the Japanese Pilot.

The pilot has only just become public, so the required observation window and external evidence are not yet mature enough for GO or PIVOT.

## 2. Why HOLD is required now

Current blockers to GO:

```text
observation window < 28 days
Japanese search impressions not yet recorded in the evidence snapshot
Japanese search clicks not yet recorded in the evidence snapshot
indexing sample pass rate not yet recorded
Japanese pageviews not yet recorded
language-switch event count not yet recorded
search visibility signal remains unknown
usage signal remains unknown
operations signal remains unknown
```

The repository must not fabricate these values or infer them from route existence.

## 3. Positive evidence already established

The following technical and quality evidence exists:

```text
Japanese public route family active
750 Japanese dossier routes generated
Japanese document language validation passed
Japanese canonical URLs validated
en/ja reciprocal alternate-language metadata validated
Japanese sitemap coverage validated
URL safety gate passed
machine/public consistency gate passed
Accessibility gate passed
first reviewed optional copy sample merged
5 Japanese entity summary overlays
0 Japanese event overlays
canonical English fallback preserved
```

This supports the current positive quality signal.

It does not substitute for search and usage evidence.

## 4. Current localization breadth

Current reviewed state:

```text
Reviewed entities: 750
Japanese entity copy overlays: 5
Japanese event copy overlays: 0
```

Approximate entity summary coverage:

```text
5 / 750 = 0.67%
```

Approximate entity summary fallback frequency:

```text
745 / 750 = 99.33%
```

This narrow coverage is intentional for the controlled pilot.

L-1 did not require full-record translation.

## 5. Telemetry added for L-2

Normal GA4 pageview measurement remains available when the configured measurement ID is present.

L-2 adds a dedicated language-switch event:

```text
hei_language_switch
```

Parameters:

```text
from_locale
to_locale
source_path
```

This supports later measurement of deliberate movement between English and Japanese surfaces.

## 6. Decision boundaries

### GO

GO requires mature evidence, not route availability alone.

Required conditions include:

```text
minimum observation window satisfied
required external metrics complete
required signal groups classified
no negative required signals
no unknown required signals
search visibility or usage positive
no critical locale failure
```

### HOLD

HOLD keeps the Japanese Pilot public while evidence collection continues.

Under HOLD:

```text
keep Japanese routes public
preserve English fallback
avoid broad translation expansion
continue canonical data growth
collect real search/indexing/usage/QA evidence
```

### PIVOT

PIVOT is reserved for material problems such as:

```text
critical locale failure
negative quality signal
multiple required signal groups negative
```

Ordinary low-volume launch data is not enough for PIVOT.

## 7. Third-language boundary

L-2 does not authorize a third language.

Current state remains:

```text
third_language_authorized: false
```

Any later third-language selection remains behind:

```text
L-2 decision
D-1000 Reviewed Entity Milestone
Language Selection Gate
```

## 8. Next evidence actions

Collect and record real evidence for:

```text
Japanese search impressions
Japanese search clicks
representative indexing state
Japanese pageviews
language-switch events
Japanese landing-page distribution
Explorer / Stats / Quality usage
exchange dossier transitions
broken locale links
translation synchronization burden
operator QA burden
localization CI failure rate
```

Do not change the decision from HOLD until the evidence contract supports the change.

## 9. Authority

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
config/l2-localization-evaluation-contract.json
data-evaluation/l2-localization-evidence.json
scripts/evaluate-l2-localization-gate.mjs
```
