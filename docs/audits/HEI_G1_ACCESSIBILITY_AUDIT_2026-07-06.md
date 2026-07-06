# HEI G-1 Accessibility Audit — 2026-07-06

Status: PASS  
Roadmap item: G-1 Accessibility audit  
Specification: `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md`, Section 4  
Canonical count impact: none

## 1. Scope

The final generated-output audit covered 13 routes:

```text
/
/dead/
/active/
/explore/
/stats/
/quality/
/updates/
/incidents/
/monthly/
/methodology/
/about/
/donate/
representative /exchange/[slug]/
```

The audit also checked source interaction contracts for global focus behavior, reduced motion, Explorer control naming and semantics, responsive Explorer behavior, and textual status labels.

## 2. Commands and gates

```text
npm run machine:build
npm run build
npm run accessibility:test
npm run accessibility:audit
npm run public:validate
```

Dedicated workflow:

```text
.github/workflows/accessibility-gate.yml
```

The accessibility workflow publishes an `accessibility-audit-report` artifact for diagnosis and historical review.

## 3. Generated-output checks

Checked:

- document language;
- one main landmark per core page;
- navigation landmark presence;
- heading presence;
- image alt attributes;
- accessible button names;
- accessible link names;
- accessible names for public form controls;
- table header cells;
- duplicate static IDs.

## 4. Source interaction contract checks

Checked:

- global `:focus-visible` treatment;
- Explorer-specific focus-visible behavior;
- reduced-motion CSS handling;
- Entity Explorer accessible control names;
- Event Explorer accessible control names;
- native filter disclosure semantics;
- checkbox/date/select/button semantics;
- tablet and mobile Explorer breakpoints;
- primary navigation accessible name;
- textual status labels so status meaning does not depend on color alone.

## 5. Initial findings

The first full generated-output run found two high-severity issues:

```text
HIGH  Home registry search input had no accessible name.
HIGH  Explorer CSS module lacked explicit focus-visible treatment for its local interaction controls.
```

No critical findings were found.

## 6. Repairs

Repairs in G-1:

1. added `aria-label="Search all exchange records"` to the Home registry search input;
2. added explicit focus-visible rules for Explorer view tabs;
3. added focus-visible treatment for filter summaries;
4. added focus-visible treatment for Explorer checkboxes;
5. added focus-visible treatment for date inputs and origin selector;
6. added global keyboard focus styles for links, buttons, form controls, summaries, and tabindex elements;
7. added reduced-motion CSS handling;
8. added `aria-label="Primary navigation"` to the global primary navigation.

## 7. Final audit result

Final report:

```text
Generated routes covered: 13
Critical findings:         0
High findings:             0
Medium findings:           0
Low findings:              0
```

Final result:

```text
PASS
```

## 8. Completion gate

```text
critical findings:                    0  PASS
high findings:                        0  PASS
core route coverage:              complete PASS
self-test:                          pass PASS
generated-output audit:            pass PASS
source interaction contract audit: pass PASS
public regression suite:           pass PASS
```

G-1 is complete when the PR containing this report passes its final full GitHub workflow set and merges to `main`.

Next roadmap item after merge:

```text
G-2 URL Safety Audit
```
