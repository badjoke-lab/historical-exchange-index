# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-07

Repository state is authoritative when this checkpoint and current GitHub state disagree.

## 1. Required reading order

Before implementation work, read:

1. `AGENTS.md`;
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`;
3. `config/cloudflare-pages-project.json`;
4. this roadmap;
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md` for public product behavior;
6. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md` for localization;
7. `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md` for Phase G;
8. Explorer contracts when changing Explorer behavior;
9. task-specific data, monitoring, machine-readable, audit, or feed specifications.

Execution order comes from this roadmap. Completion gates come from the relevant specification.

## 2. Operating rules

- Canonical changes require reviewed PRs.
- Monitoring must not directly edit canonical data.
- Public features use reviewed public data only.
- Raw monitoring and unreviewed candidates remain internal.
- No synthetic risk scores or free-form AI truth claims.
- Canonical facts remain single-source across locales.
- Explorer query keys and enum values remain locale-independent.
- Full multilingual rollout is not a v1.0 requirement.
- Data growth, operations, and machine-readable maintenance continue in parallel.
- Phase G prioritizes integration correctness over adding major new public surfaces.
- Production diagnosis starts with deployed commit verification, not route speculation.
- Recovery must derive dynamic state such as current main SHA and open PRs from current repository/GitHub state.
- Update this checkpoint whenever phase, active item, execution order, production state, or canonical counts materially change.

## 3. Current checkpoint

```text
Last merged implementation PR: #556 Add Phase G production verification gate
G-1 Accessibility Audit: COMPLETE
G-2 URL Safety Audit: COMPLETE
G-3 Cross-surface Integration Audit: COMPLETE
G-4 Machine/Public Consistency Audit: COMPLETE
G-5 Production Integration and Verification: COMPLETE
Current phase: Phase G — v1.0 Integration Baseline
Current item: G-6 Maintainer Runbook and Recovery Validation
Next item: G-7 v1.0 Baseline Checkpoint
Next product feature after v1.0: H Compare v1
Localization after Compare: L-1 Japanese Pilot -> L-2 Evaluation Gate
```

## 4. Current reviewed state

```text
Entities:  550
Events:    1004
Evidence: 2621
Maximum entity ID:   hei_ex_000666
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011312
```

Phase G work does not change canonical counts unless a separate reviewed data PR explicitly does so.

## 5. Completed foundation and product phases

```text
Phase C    Registry milestone                  COMPLETE
Phase D    Change layer                        COMPLETE
Phase E    Discovery foundation                COMPLETE
Phase E.5  Explorer v1                         COMPLETE
Phase F-1  Multilingual Foundation             COMPLETE
G-1        Accessibility Audit                 COMPLETE
G-2        URL Safety Audit                    COMPLETE
G-3        Cross-surface Integration Audit     COMPLETE
G-4        Machine/Public Consistency Audit    COMPLETE
G-5        Production Integration/Verification COMPLETE
```

### Explorer v1 contract

```text
base route:              /explore/
base route in sitemap:   exactly once
query variants sitemap:  no
query canonical:         /explore/
static routes:           12
exchange routes:         550
total sitemap URLs:      562
```

### F-1 Multilingual Foundation

Source:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Completed foundation:

```text
locale config
English default/public root
Japanese pilot locale registration
English/Japanese common dictionaries
English/Japanese enum-label dictionaries
entity/event copy overlay schema
English fallback loader
safe overlay merge utilities
locale route helpers
overlay validator and behavior tests
dedicated i18n gate
public regression integration
```

Public Japanese full-site rollout remains intentionally deferred.

## 6. Parallel execution lanes

### Lane A — Data and quality

```text
candidate discovery
reviewed record additions
entity/event/evidence strengthening
status and lifecycle updates
quality repair
archive and evidence improvements
```

### Lane B — Product sequence

```text
Phase G    v1.0 Integration Baseline          ACTIVE
Phase H    Compare v1
Phase L-1  Japanese Pilot
Phase L-2  Localization Evaluation Gate
Phase I    Discovery Log Trial
Language Selection Gate
Phase J    NL Filter Translator               CONDITIONAL
Phase K    API Expansion                      CONDITIONAL
```

### Lane C — Operations

```text
monitoring
quality monitoring
canonical update tracking
reviewed Registry Updates
monthly reviewed snapshots
review queue maintenance
```

### Lane D — Machine use

```text
stable canonical JSON
schema stability
version/manifest integrity
machine-readable public layer
reviewed update feeds
Explorer contract stability
API expansion only after demonstrated need
```

## 7. Phase G — v1.0 Integration Baseline

Source:

```text
docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md
```

Fixed order:

```text
G-1 Accessibility Audit                         COMPLETE
G-2 URL Safety Audit                            COMPLETE
G-3 Cross-surface Integration Audit             COMPLETE
G-4 Machine/Public Consistency Audit            COMPLETE
G-5 Production Integration and Verification     COMPLETE
G-6 Maintainer Runbook and Recovery Validation  ACTIVE
G-7 v1.0 Baseline Checkpoint                    NEXT
```

### G-1 Accessibility Audit

Report:

```text
docs/audits/HEI_G1_ACCESSIBILITY_AUDIT_2026-07-06.md
```

Final result:

```text
13 generated routes
critical findings: 0
high findings:     0
medium findings:   0
low findings:      0
```

### G-2 URL Safety Audit

Report:

```text
docs/audits/HEI_G2_URL_SAFETY_AUDIT_2026-07-06.md
```

Policy:

```text
config/url-display-policy.json
```

Final result:

```text
550 reviewed public entities
550 generated exchange detail pages
7 official_url_status values
critical findings: 0
high findings:     0
medium findings:   0
low findings:      0
```

### G-3 Cross-surface Integration Audit

Report:

```text
docs/audits/HEI_G3_CROSS_SURFACE_INTEGRATION_AUDIT_2026-07-07.md
```

Contract:

```text
config/cross-surface-integration-contract.json
```

Final result:

```text
Public navigation:
  surfaces:           12
  header routes:      10
  footer routes:       8
  contextual edges:    8
  findings:             0

Cross-surface integration:
  core surfaces:          12
  Explorer-link sources:   4
  dossier-link sources:    5
  findings:                0
```

### G-4 Machine/Public Consistency Audit

Report:

```text
docs/audits/HEI_G4_MACHINE_PUBLIC_CONSISTENCY_AUDIT_2026-07-07.md
```

Contract:

```text
config/machine-public-consistency-contract.json
```

Final result:

```text
Entities:          550
Events:            1004
Evidence:          2621
Reviewed updates:  2
Sitemap URLs:      562

count_mismatch:                 0
route_discovery_mismatch:       0
public_safety_boundary_leak:    0
feed_contract:                  0
timestamp_mismatch:             0
sitemap_robots:                 0
```

### G-5 Production Integration and Verification

Report:

```text
docs/audits/HEI_G5_PRODUCTION_VERIFICATION_2026-07-07.md
```

Contract:

```text
config/production-verification-contract.json
```

Final verified production state:

```text
origin: https://hei.badjoke-lab.com
expected commit: daed55da7673dbd16faf8c69bcd2274a546c463f
deployed commit: daed55da7673dbd16faf8c69bcd2274a546c463f
commit propagation: MATCH

machine layer:
  records: 550
  events: 1004
  evidence: 2621
  reviewed update feed items: 2

integration:
  core routes: 12 / 12 PASS
  Explorer queries: 2 / 2 PASS
  representative deep links: 3 / 3 PASS
  public machine files: 11 / 11 PASS
  sitemap URLs: 562 PASS
  robots contract: PASS
  representative dossier: /exchange/mt-gox/ PASS
```

### G-6 Maintainer Runbook and Recovery Validation

Active files:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
config/maintainer-recovery-contract.json
scripts/validate-maintainer-recovery.mjs
.github/workflows/maintainer-recovery-gate.yml
```

Recovery must determine from repository/current GitHub state:

```text
repository and default branch
current origin/main SHA
canonical counts
current phase
current item
next item
active specifications
open product PR state
deployment policy
production verification state
validation commands
recovery sequence
```

G-6 implementation order:

1. keep one human-readable recovery runbook;
2. keep one machine-readable recovery contract;
3. validate all authoritative paths;
4. derive canonical counts from canonical arrays;
5. verify roadmap current/next state visibility;
6. verify package command references;
7. verify deployment policy and Cloudflare project policy agreement;
8. verify latest production PASS reference;
9. keep main SHA and open PRs dynamic rather than permanently hard-coded;
10. run self-test and repository-only recovery validation;
11. record a dated clean-room recovery exercise report;
12. merge only after final-head workflow success.

Completion gate:

```text
repository-only recovery:             PASS required
stale checkpoint findings:            0
missing authoritative paths:          0
required command references:          complete
production-state reference:           complete
contradictory recovery instructions:  0
clean-room recovery exercise:         PASS
```

### G-7 v1.0 Baseline Checkpoint

Next work after G-6:

```text
record baseline main SHA/tag
record canonical counts
record schema versions
record public route contract
record sitemap URL count
record machine-readable file contract
record Explorer query contract version
record localization foundation state
record monitoring/operations separation
record production verification report
record known deferred items
advance roadmap to H Compare v1
```

Allowed post-v1 deferred items:

```text
Compare v1
Japanese public pilot
additional languages
Discovery Log trial
NL Filter Translator
API expansion
```

## 8. Phase H — Compare v1

Initial scope:

- compare 2 to 4 exchanges;
- reviewed entity facts;
- lifecycle dates and deterministic lifespan;
- status and death reason;
- origin;
- URL/archive state;
- confidence;
- event counts and selected major events;
- evidence counts;
- direct dossier links;
- shareable comparison state.

Compare must not:

- introduce synthetic risk scores;
- rank safety or investment quality;
- use unreviewed monitoring candidates;
- create AI-generated factual comparison claims.

## 9. Phase L-1 — Japanese Pilot

Pilot only after F-1, Phase G, and Compare v1.

Initial scope:

```text
/ja/
/ja/about/
/ja/methodology/
common Japanese navigation/footer labels
language switcher
basic enum display labels
locale metadata
hreflang/alternate links
pilot sitemap entries
```

Not included by default:

```text
full Japanese exchange-detail coverage
full Japanese Stats/Quality/Change coverage
Japanese Explorer
bulk record translation
additional public languages
```

## 10. Phase L-2 — Localization Evaluation Gate

Evaluate search, usage, and maintenance burden.

Decision:

```text
GO    -> staged Japanese Expansion
HOLD  -> keep pilot only and continue core work
PIVOT -> retain useful foundation/pilot work and evaluate another language later
```

Japanese Expansion after GO:

```text
JA-1 /ja/dead/ and /ja/active/
JA-2 /ja/exchange/[slug]/
JA-3 /ja/stats/ and /ja/quality/
JA-4 /ja/updates/, /ja/incidents/, /ja/monthly/
JA-5 /ja/explore/
JA-6 multilingual final audit
```

## 11. Phase I — Discovery Log Trial

```text
monitoring / research finding
        ↓
manual review
        ↓
structured research note
        ↓
public Discovery Log trial
```

Automatic publication of raw monitoring findings remains prohibited.

## 12. Language Selection Gate

No third language is preselected.

Selection inputs:

- HEI traffic language/geography;
- Search Console queries;
- pilot behavior;
- exchange-history relevance;
- translation QA capability;
- maintenance cost.

Rule:

```text
one pilot -> measure -> expand / hold / pivot
```

## 13. Conditional later phases

### Phase J — NL Filter Translator

Activate only if Explorer usage demonstrates a need.

```text
natural language -> validated Explorer parameters -> deterministic Explorer results
```

It must not become a free-form factual answer engine.

### Phase K — API Expansion

Activate only after real external consumer need that static files cannot satisfy.

Current public machine layer:

```text
/version.json
/data/manifest.json
/data/entities.json
/data/events.json
/data/evidence.json
reviewed feeds
/llms.txt
/ai.txt
```

## 14. Immediate execution order

```text
1. Complete G-6 Maintainer Runbook and Recovery Validation   CURRENT
2. G-7 v1.0 Baseline Checkpoint                              NEXT
3. H Compare v1
4. L-1 Japanese Pilot
5. L-2 Localization Evaluation Gate
6. Execute GO / HOLD / PIVOT decision
7. I Discovery Log Trial
8. Language Selection Gate when evidence exists
9. J NL Filter Translator only if justified
10. K API Expansion only if justified
```

## 15. Recovery procedure

Primary runbook:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
```

Machine contract:

```text
config/maintainer-recovery-contract.json
```

Summary sequence:

1. confirm repository identity and default branch;
2. fetch current remote state and record current origin/main SHA;
3. inspect current open PRs and branch state;
4. read AGENTS, deployment policy, and Cloudflare project policy;
5. read roadmap current checkpoint and execution order;
6. read active phase specification and task-specific contracts;
7. derive canonical counts from canonical JSON arrays;
8. read latest production verification report before production diagnosis;
9. run recovery validator and relevant project validation commands;
10. resume the first incomplete roadmap item;
11. repair stale checkpoints through an appropriate reviewed PR.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
