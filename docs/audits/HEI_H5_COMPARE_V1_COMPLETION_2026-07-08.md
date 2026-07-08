# HEI Phase H Compare v1 Completion Checkpoint

Date: 2026-07-08  
Status: PASS  
Project: Historical Exchange Index (HEI)

## 1. Conclusion

Phase H — Compare v1 is complete.

The reviewed public Compare surface was specified, implemented, integrated with the rest of HEI, audited, deployed, and verified against the H-5 production commit.

Phase H completion does not satisfy the separate D-750 reviewed-entity milestone. The next active roadmap item is therefore:

```text
D-750 Reviewed Entity Milestone
```

The Japanese Pilot remains gated by:

```text
Phase H COMPLETE
+
D-750 COMPLETE
```

## 2. Implementation sequence

Phase H was delivered through the following reviewed PR sequence.

```text
#559  H-1 Compare specification and selection-state contract
#560  H-2 Compare route, reviewed selector, URL state, identity/lifecycle matrix
#561  H-3 status/origin, URL/archive safety, coverage counts, major events
#562  H-4 share flow, dossier/Explorer discovery, public navigation integration
#563  H-5 crawl, machine discovery, final regression audits, baseline/gate repair
#564  post-H-5 live production verification tooling and gate
```

## 3. Compare v1 public contract

The implemented public route is:

```text
/compare/
```

The fixed shareable state model is:

```text
/compare/?exchange=<reviewed-slug>&exchange=<reviewed-slug>
```

Implemented selection rules:

- 2 to 4 reviewed public entities;
- repeated `exchange` parameter;
- selection order preserved;
- duplicate slugs deduplicated with first occurrence retained;
- invalid and unknown reviewed slugs ignored;
- fifth and later reviewed selections truncated;
- zero or one resolved entity remains selector state without comparison claims;
- unreviewed candidates are excluded.

## 4. Implemented comparison content

Compare v1 exposes reviewed or deterministic values only.

Implemented comparison sections:

```text
Identity
- canonical name
- type
- dossier link

Lifecycle
- launch date
- terminal date from reviewed death_date
- deterministic lifespan days

Status and origin
- status
- death reason
- country / origin
- confidence

URL and archive
- original domain as informational text
- official URL status
- archive availability
- reviewed archive action

Record coverage
- reviewed event count
- reviewed evidence count

Selected major events
- up to 5 reviewed events per entity
- deterministic selection and chronological display
```

No synthetic risk score, investment ranking, safety ranking, unreviewed candidate comparison, live market metric, or AI-generated factual claim was introduced.

## 5. Integration completed

Compare is integrated into HEI public discovery through:

- global header navigation;
- global footer navigation;
- Research-layer route classification;
- Explore to Compare contextual link;
- Compare to Explore contextual link;
- dossier to Compare handoff;
- dossier to Explorer handoff;
- Entity Explorer result to Compare handoff;
- normalized copy-share-link action;
- sitemap base-route inclusion;
- version route map;
- manifest `main_routes`;
- `llms.txt`;
- `ai.txt`.

## 6. Final repository validation

PR #563 final head passed all 24 workflow runs.

Key gates included:

```text
CI                                 PASS
Compare v1 gate                    PASS
v1 baseline checkpoint gate       PASS
Accessibility gate                 PASS
URL safety gate                    PASS
Cross-surface integration gate    PASS
Machine/public consistency gate   PASS
Maintainer recovery gate           PASS
Production verification baseline  PASS
Records validation                 PASS
Count semantics regression         PASS
I18n foundation gate              PASS
```

The monolithic public validation failure encountered during H-5 was traced to a pre-Compare hard-coded sitemap count in `scripts/validate-public-output-consistency.mjs`. The validator was updated to include Compare as the thirteenth static route and to validate Compare page, canonical, discovery, JSON-LD, machine route discovery, and sitemap presence.

A temporary diagnostics workflow was used to isolate the failure. After the repair, every public validation step passed individually. The temporary diagnostics workflow was then removed before merge.

The permanent Compare gate remains:

```text
.github/workflows/compare-v1-gate.yml
```

## 7. v1 baseline preservation repair

H-5 exposed a post-v1 contract problem: the v1 baseline validator treated deliberate post-v1 route expansion as baseline corruption.

The immutable v1 baseline contract was not rewritten.

Instead, validation semantics were corrected so the v1 checkpoint acts as a historical floor and required subset:

- reviewed counts may grow but must not fall below baseline;
- reviewed update feed count may grow but must not fall below baseline;
- baseline routes must remain present;
- deliberate reviewed post-v1 routes may be added;
- sitemap count may grow but must not fall below baseline;
- baseline sitemap routes must remain present;
- duplicate URLs and query variants remain prohibited.

The v1 baseline checkpoint gate passed after this repair.

## 8. G-5 historical production evidence separation

H-5 also exposed that the old G-5 workflow attempted to rerun live production checks against the immutable 2026-07-07 baseline SHA during post-v1 development.

The concerns were separated:

- historical G-5 evidence is validated offline and remains immutable;
- live current-phase production verification uses the actual current phase target commit;
- the historical v1 baseline contract is not rewritten to follow post-v1 main.

The G-5 baseline evidence validator is:

```text
scripts/validate-g5-production-baseline.mjs
```

## 9. H-5 production verification

Expected H-5 production commit:

```text
9fb3e1a3bda0c51ce59af364402a98a86736bcb1
```

Observed deployed commit:

```text
9fb3e1a3bda0c51ce59af364402a98a86736bcb1
```

Commit propagation result:

```text
MATCH
```

Verification timestamp:

```text
2026-07-08T04:30:53.126Z
```

Production route verification:

```text
Compare base route                 PASS
Representative 2-entity query     PASS
Representative 4-entity query     PASS
Representative dossier handoff    PASS
Explorer Compare discovery        PASS
```

Production discovery verification:

```text
version.json                       PASS
manifest.json                      PASS
llms.txt                           PASS
ai.txt                             PASS
sitemap.xml                        PASS
```

Representative deployed comparison sample:

```text
Mt. Gox       mt-gox
FTX           ftx
Binance       binance
QuadrigaCX    quadrigacx
```

The production verification workflow and script are:

```text
.github/workflows/compare-production-verification.yml
scripts/verify-compare-production.mjs
```

## 10. Canonical count impact

Phase H did not change reviewed canonical counts.

```text
Entities:  550
Events:    1004
Evidence:  2621
```

D-750 therefore still requires a net increase of 200 reviewed public entities from the v1 baseline under reviewed public build semantics.

## 11. Phase transition

Completed:

```text
Phase H — Compare v1
```

Now active:

```text
D-750 Reviewed Entity Milestone
```

Next release gate:

```text
D-750 COMPLETE
+
Phase H COMPLETE
        ↓
L-1 Japanese Pilot may launch
```

Overall result:

```text
PASS
```
