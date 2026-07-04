# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-05  
Target: HEI v1.0 and recurring registry operations

Repository state is authoritative when this checkpoint and GitHub disagree.

## Operating rules

- Canonical changes require reviewed pull requests.
- Automated monitoring must not directly edit canonical data.
- Do not add thin records to satisfy a count target.
- Preserve historical URLs and conservative status decisions.
- Do not bypass frozen lineage reviews.
- Treat maximum IDs as allocation markers, not record counts.
- Confirm the full diff and all required checks before merge.

## Current checkpoint

```text
Last confirmed main SHA: c483db495733722b1a38df7ceeb9b85487d17df3
Last merged PR: #530 Reach Phase C 550-entity milestone
Current phase: Phase C milestone audit
Current item: resolve milestone audit findings and document completion
Next item: close range 0401-0450, then begin Phase D public update surfaces
Cloudflare changes: none
Production deployment: none
```

## Current reviewed state

```text
Entities:  550
Events:    1004
Evidence: 2621
Maximum entity ID:   hei_ex_000666
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011312
```

```text
Phase C entity target: 550
Reviewed entities:     550
Remaining to target:     0
Progress:              100%
```

## Phase C milestone audit

Milestone count consistency:

```text
Projected:   550 / 1004 / 2621
Monitoring:  550 / 1004 / 2621
Machine:     550 / 1004 / 2621
Built:       550 / 1004 / 2621
Detail pages: 550
Sitemap exchange routes: 550
Count semantics status: pass
```

Milestone entity-quality baseline:

```text
critical: 0
high:     2
medium:  17
low:     60
```

The two high findings are resolved in the current audit branch by reclassifying BKEX and ZB.com from `limited` to `inactive`. Neither is marked dead because the reviewed evidence does not establish a sufficiently strong terminal closure marker.

Audit source of truth:

```text
docs/audits/HEI_PHASE_C_MILESTONE_AUDIT_2026-07-05.md
```

## Range 0401-0450

The range remains open after the 550 milestone. Five research rows remain unresolved:

```text
0403 CoinDeal
0410 Coingi
0419 CoinPlace
0422 CoinsBank
0447 Covesting
```

Range closure is operational cleanup and no longer a prerequisite for reaching the Phase C entity milestone.

## Remaining execution order

1. Validate and merge the Phase C milestone audit PR.
2. Resolve the five remaining research rows and close range 0401-0450.
3. Begin Phase D public update surfaces and publication-oriented registry outputs.
4. Continue reviewed quality-repair batches for medium and low audit findings.
5. Build Stats, SEO, Japanese routes, and final integration in the existing phase order.

## Phase C completion gate

```text
reviewed entities >= 550                    pass
no thin count-filler records                pass through reviewed bundle policy
all required CI checks green                milestone PR pass; audit PR pending
public, monitoring, machine, built agree    pass
record duplicate / ID collision checks      pass
country/origin strict gate                  pass
active CEX / DEX readiness gates            pass
entity quality critical findings            0
entity quality high findings                2 -> resolved in audit branch
```

Phase C becomes formally complete when the current audit PR passes all repository gates and merges.

## Later phases

- Phase D: Registry Update, incident timeline, evidence health, monthly snapshot, feeds.
- Phase E: Stats, internal links, SEO, metadata, sitemap.
- Phase F: English root and Japanese `/ja/` routes with translation overlays.
- Phase G: accessibility, URL safety, production integration, runbook, v1.0 baseline.

## Schedule

| Period | Work | Result |
|---|---|---|
| Immediate | merge milestone audit and close current research range | Phase C complete |
| Next | Phase D public update surfaces | visible registry update layer |
| Following | Stats / SEO / Japanese routes | analysis and discovery expansion |
| Final | integration and v1.0 baseline | HEI v1.0 |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Read the Phase C milestone audit document and latest workflow results.
3. Resume the first incomplete item in the execution order above.
4. Update this checkpoint whenever counts, phase, or execution order change.
