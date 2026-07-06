# HEI v1 Integration Baseline Specification

Status: active Phase G source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06

## 1. Authority and purpose

This document controls Phase G — v1.0 Integration Baseline.

Execution order comes from `docs/HEI_V1_EXECUTION_ROADMAP.md`.

Product behavior remains governed by `docs/HEI_PRODUCT_SURFACES_SPEC.md` and task-specific contracts. Localization architecture remains governed by `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md`.

Phase G exists to stop feature accumulation temporarily and validate HEI as one coherent public registry/research product before Compare v1 and localization pilots.

Phase G order is fixed:

```text
G-1 Accessibility audit
G-2 URL safety audit
G-3 Cross-surface integration audit
G-4 Machine-readable and public-output consistency audit
G-5 Production integration and verification
G-6 Maintainer runbook and recovery validation
G-7 v1.0 baseline checkpoint
```

## 2. General Phase G rules

- Canonical counts do not change unless a separate reviewed data PR explicitly changes them.
- Phase G must not introduce a major new public product surface.
- Audit findings must be classified and either repaired or explicitly deferred with rationale.
- Critical findings block phase completion.
- High findings normally block the relevant G item unless the specification explicitly allows documented deferral.
- Medium and low findings may become follow-up queues if they do not undermine the completion gate.
- Generated public HTML and machine-readable outputs are authoritative audit inputs for public behavior.
- Source-level contracts may supplement generated-output checks where static export cannot express an interaction state.
- Raw monitoring output and unreviewed candidate data remain outside every public audit surface.
- Temporary diagnostic workflows/scripts must be removed before the relevant PR merges.

## 3. Severity model

### Critical

A finding that can:

- expose unreviewed/private data publicly;
- direct users to an unsafe historical URL in a misleading way;
- make a core public route inaccessible or unusable;
- create a major factual mismatch between human-readable and machine-readable public data;
- break canonical deployment-state verification;
- make repository recovery materially impossible.

### High

A finding that:

- blocks keyboard access to a core function;
- removes accessible names from core interactive controls;
- creates an orphan core surface;
- produces significant route/canonical/hreflang or public-output inconsistency;
- hides URL safety status from a major user path;
- causes mobile interaction failure on a core workflow.

### Medium

A meaningful usability, semantics, discoverability, or maintainability defect that does not block the core task.

### Low

A minor quality or consistency issue with limited practical impact.

## 4. G-1 Accessibility audit

### 4.1 Scope

Audit all core public surfaces:

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
/exchange/[slug]/ representative detail output
```

### 4.2 Generated-output checks

The audit must check at least:

- one page-level main landmark on core pages;
- one navigation landmark for global site navigation;
- headings exist and do not omit the page topic entirely;
- image elements have alt attributes where images exist;
- form controls used in public output have accessible naming through labels, `aria-label`, or valid associated semantics;
- buttons expose visible or accessible text;
- links do not use empty accessible text;
- tables include header cells;
- document language is present;
- no duplicate static element IDs on the same generated page;
- Explorer view navigation has an accessible name;
- core generated pages retain usable internal links.

### 4.3 Source/interaction contract checks

Because static export does not exercise every client state, source checks must verify:

- visible `:focus-visible` treatment exists for global links/buttons and major filter controls;
- Explorer checkboxes and date/select/search controls have accessible names;
- native `details/summary` or equivalent keyboard-operable filter disclosure is used;
- result-load buttons use button semantics;
- mobile/table alternatives exist where dense tables become impractical;
- responsive breakpoints cover Explorer and dense registry views;
- no status meaning depends on color alone without text labels.

### 4.4 G-1 completion gate

```text
critical findings: 0
high findings:     0
core route coverage: complete
self-test: pass
generated-output audit: pass
source interaction contract audit: pass
public regression suite: pass
```

G-1 must produce a reproducible script and CI/package integration, not only a one-time manual note.

## 5. G-2 URL safety audit

### 5.1 Scope

Audit the relationship among:

```text
official_url_original
official_domain_original
official_url_status
archived_url
public detail links
list-table links
Explorer result links
Methodology/About safety explanations
```

### 5.2 Required URL-status domains

```text
live_verified
live_unverified
redirected
repurposed
dead_domain
unsafe
unknown
```

### 5.3 Safety rules

- `unsafe` must never be presented as an ordinary trusted live link.
- `repurposed` and `redirected` require clear status meaning.
- archive links must remain clearly distinct from original-domain links.
- historical original URLs may remain as facts without being active clickable links when safety requires it.
- no public surface may infer safety from HTTP availability alone.
- URL status labels must remain textual, not color-only.

### 5.4 G-2 completion gate

```text
critical URL-safety findings: 0
high URL-safety findings: 0
all URL-status enum values covered
representative public surfaces audited
archive/original distinction verified
```

## 6. G-3 Cross-surface integration audit

### 6.1 Core surface graph

Audit meaningful movement among:

```text
Registry Home
Dead Registry
Active Registry
Explorer
Stats
Quality
Updates
Incidents
Monthly
Methodology
About
Donate
Exchange Detail
```

### 6.2 Required properties

- every core surface is reachable from the intended navigation/context graph;
- no unintended orphan core surface;
- Stats direct/range/compound Explorer links obey the fixed query contract;
- Change-layer Explorer links obey the fixed query contract;
- exchange dossiers are reachable from list/Explorer/Change contexts where applicable;
- contextual links do not expose unreviewed data states;
- navigation density remains within configured limits.

### 6.3 G-3 completion gate

```text
unintended orphan core surfaces: 0
required contextual edges: pass
Explorer query-link contract: pass
broken core cross-links: 0
```

## 7. G-4 Machine-readable and public-output consistency audit

### 7.1 Surfaces

```text
HTML
sitemap.xml
robots.txt
version.json
data/manifest.json
data/entities.json
data/events.json
data/evidence.json
feeds/updates.json
feeds/updates.xml
llms.txt
ai.txt
```

### 7.2 Required consistency

- reviewed record counts agree across relevant outputs;
- routes in version/manifest match actual public route contracts;
- Explorer route discovery remains present;
- generated timestamps follow existing semantics;
- public datasets remain canonical/reviewed only;
- public files contain no monitoring/staging/private markers;
- sitemap exact-set and canonical contracts pass;
- update feeds contain reviewed Registry Updates only;
- AI discovery files describe the same public count/route state.

### 7.3 G-4 completion gate

```text
critical consistency findings: 0
count mismatch findings: 0
route-discovery mismatch findings: 0
public safety-boundary leaks: 0
feed contract findings: 0
```

## 8. G-5 Production integration and verification

### 8.1 Production authority

Before diagnosing a production defect, compare the deployed `/version.json` commit with the expected merge commit.

### 8.2 Required checks

- deployment commit propagation;
- home and core routes;
- Explorer Entity and Event views;
- representative Stats -> Explorer deep link;
- representative Change -> Explorer deep link;
- sitemap and robots;
- version and manifest;
- public datasets;
- update JSON/RSS feeds;
- representative exchange detail;
- headers/redirects where relevant.

### 8.3 G-5 completion gate

A dated production verification record must identify:

```text
expected commit
deployed commit
checked routes
checked machine files
result
remaining known limitations
```

## 9. G-6 Maintainer runbook and recovery validation

### 9.1 Required recovery information

Repository documents must allow a new maintainer or agent to determine:

- repository and default branch;
- current main SHA;
- reviewed counts;
- current phase;
- current work item;
- next work item;
- active specifications;
- open product PRs;
- deployment policy;
- production verification state;
- validation commands;
- recovery sequence after an interrupted thread/session.

### 9.2 Validation method

Run a repository-only recovery exercise: derive the current state without relying on remembered chat history.

### 9.3 G-6 completion gate

```text
repository-only recovery: pass
stale checkpoint findings: 0
required command references: complete
production-state reference: complete
```

## 10. G-7 v1.0 baseline checkpoint

### 10.1 Baseline contents

Record:

- baseline main SHA/tag;
- canonical counts;
- schema versions;
- public route contract;
- sitemap URL count;
- machine-readable file contract;
- Explorer query contract version;
- localization foundation state;
- monitoring/operations separation;
- production verification record;
- known deferred items.

### 10.2 Deferred items allowed at v1.0

The following may remain post-v1 work:

```text
Compare v1
Japanese public pilot
additional languages
Discovery Log trial
NL Filter Translator
API expansion
```

### 10.3 G-7 completion gate

```text
G-1 complete
G-2 complete
G-3 complete
G-4 complete
G-5 complete
G-6 complete
baseline record complete
v1.0 checkpoint/tag recorded
roadmap advanced to H Compare v1
```

## 11. Audit artifact conventions

Persistent audit reports should live under:

```text
docs/audits/
```

Recommended report structure:

```text
scope
input commit
commands run
coverage
findings by severity
repairs made
remaining deferred findings
completion-gate result
```

Reusable validators belong under `scripts/` and should have package scripts. Self-tests are required when the audit parser or classifier contains non-trivial logic.

## 12. Change control

Review this specification and the roadmap together before:

- reordering G-1 through G-7;
- weakening a zero-critical completion gate;
- accepting a high finding without explicit rationale;
- changing the core public-surface set;
- changing production-verification authority semantics;
- moving Compare or localization pilots back ahead of v1.0 integration;
- declaring v1.0 without completed production verification and recovery validation.

Implementation PRs must cite the relevant section of this specification.
