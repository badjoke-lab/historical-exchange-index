# HEI D-1000 Reviewed Entity Milestone Completion Checkpoint

Date: 2026-08-09  
Status: PASS  
Project: Historical Exchange Index (HEI)

## 1. Conclusion

The D-1000 Reviewed Entity Milestone is complete.

The reviewed public build resolves to:

```text
Entities: 1000
Events:   1025
Evidence: 3781
English dossiers:  1000
Japanese dossiers: 1000
```

The milestone target was:

```text
reviewed public entities >= 1000
```

The active roadmap focus returns to:

```text
L-2 Localization Evaluation Gate — HOLD / EVIDENCE CAPTURE
```

The D-1000 prerequisite for the Language Selection Gate is now satisfied. The Language Selection Gate remains blocked until the required Japanese Pilot evidence is captured and the L-2 decision is reproducible from that evidence. This checkpoint does not authorize a third-language pilot.

## 2. Main identity

The final D-1000 growth PR is:

```text
#733  Add D-1000 BX50 milestone exchange records
```

Final reviewed growth head:

```text
53406ff74ed21e18e4a5b922200e79d1b2bd7d60
```

Merged main commit:

```text
9408a05fdb7a678753b4e31be37063ab03c1022f
```

The final reviewed growth head and merged main commit resolve to the same Git tree:

```text
c65201d493d226b592f174de83cf18dde1cdb01b
```

The validated BX50 branch content therefore matches the merged `main` tree content exactly.

## 3. Reviewed count semantics evidence

The final BX50 Count semantics regression workflow reported:

```text
reviewed public counts:
  entities: 1000
  events:   1025
  evidence: 3781

reviewed bundles:
  total:        856
  new entities: 694
  repairs:      162

machine-readable layer:
  entities: 1000
  events:   1025
  evidence: 3781

bilingual dossier routes:
  English:  1000
  Japanese: 1000

bilingual sitemap dossier routes:
  English:  1000
  Japanese: 1000

status: pass
```

The same validation cycle reported:

```text
reviewed bundle event ID conflicts:    0
reviewed bundle evidence ID conflicts: 0
public validation checks:              25 / 25 pass
```

The Next.js build generated all 1000 English and 1000 Japanese exchange dossier routes successfully.

## 4. Final validation cycle

PR #733 passed all 20 pull-request workflow runs before merge.

Successful workflows:

```text
Active CEX repair audit
Candidate scan gate
Watchlist resolution gate
Country origin strict gate
Canonical-only active CEX queue
Backlog dedupe
Maintainer recovery gate
Canonical-only DEX repair queue
Records validation
Lineage inventory audit
Permanent entity quality audit
DEX seed readiness audit
v1 baseline checkpoint gate
Count semantics regression
Machine/public consistency gate
URL safety gate
Metadata audit diagnostics
L2 localization evaluation gate
Japanese Pilot readiness gate
CI
```

The CI build-and-lint job also passed the relevant steps:

```text
repository operations policy check
Cloudflare configuration print check
country/origin audit export
lint
record validation
projected enum checks
monitoring smoke/completion tests
Next.js production build
machine-readable validation
public-output validation
```

## 5. D-1000 completion gate

The milestone specification requires:

```text
reviewed public entities >= 1000
canonical/public build validation PASS
record overlap/duplicate validation PASS
ID collision validation PASS
machine/public consistency PASS
production verification plan for count-sensitive public output
```

Result:

```text
reviewed public entities >= 1000         PASS
canonical/public build validation       PASS
record overlap/duplicate validation     PASS
ID collision validation                 PASS
machine/public consistency              PASS
reviewed-public boundary                PASS
production verification plan            PASS
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

The D-1000 completion state is:

```text
Entities: 1000
Events:   1025
Evidence: 3781
```

Net reviewed growth from the v1 baseline:

```text
Entities: +450
Events:   +21
Evidence: +1160
```

Growth from D-750 completion:

```text
Entities: +250
Events:   +21
Evidence: +562
```

The milestone was reached without deployment splitting, alias inflation, raw-candidate counting, staging-count substitution, or automatic publication of uncertain candidates.

## 7. Boundary and quality preservation

The D-1000 growth lane preserved:

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
English/Japanese canonical fact sharing
```

The final approach continued to reject duplicate identities rather than force milestone counts. During BX49, ATAIX Eurasia was removed after the permanent overlap validator matched the candidate against the existing reviewed ATAIX identity. The batch was repaired with a non-overlapping reviewed record instead of bypassing the validator.

Ambiguous lifecycle or regulatory states were kept conservative. Examples include `limited` handling where a public service surface remained while trading or licence conditions were constrained, rather than converting those cases into unsupported terminal states.

## 8. Production verification plan

The merged main commit is production-eligible under the Cloudflare deployment policy.

Count-sensitive production verification must begin by checking:

```text
/version.json -> deployed commit 9408a05fdb7a678753b4e31be37063ab03c1022f
/data/manifest.json -> 1000 entities / 1025 events / 3781 evidence
English dossier routes -> 1000 reviewed entities available
Japanese dossier routes -> 1000 reviewed entities available
```

A deployment delay must not be diagnosed as a source defect until `/version.json` confirms which commit is actually deployed.

## 9. Roadmap transition

The fixed post-v1 sequence is now at:

```text
Phase H — Compare v1                   COMPLETE
D-750 Reviewed Entity Milestone        COMPLETE
L-1 Japanese Pilot                     COMPLETE / PUBLIC
L-2 Localization Evaluation Gate       HOLD / EVIDENCE CAPTURE
D-1000 Reviewed Entity Milestone       COMPLETE
Language Selection Gate                BLOCKED ON L-2 EVIDENCE / DECISION
```

The next active work is not another milestone-count chase. It is to complete the L-2 evidence capture from real Search Console / GA4 / indexing / operator-maintenance evidence and reproduce the GO / HOLD / PIVOT decision.

Only after that decision should the Language Selection Gate run.

## 10. Evidence references

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX50_2026-08-09.md
scripts/check-count-semantics-regression.mjs
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
PR #733
Count semantics workflow run #1320
Count semantics Actions run 31265801525
Count semantics artifact 9024161789
```
