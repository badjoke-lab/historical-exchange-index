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
- Confirm the full diff and required checks before merge.

## Current checkpoint

```text
Last confirmed main SHA: 68ebe476e87d6ccb764bd51d52b94caf9638e039
Last merged PR: #531 Complete Phase C milestone audit
Current phase: Phase D — public update surfaces
Current item: finalize range 0401-0450 closure
Next item: HEI Registry Update surface
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

## Phase C completion

```text
entity target:                     550 / 550
count semantics:                   pass
records validation:                pass
country origin strict gate:        pass
active CEX / DEX readiness:        pass
watchlist resolution gate:         pass
entity quality critical findings:  0
entity quality high findings:      0
Phase C status:                    complete
```

Audit source of truth:

```text
docs/audits/HEI_PHASE_C_MILESTONE_AUDIT_2026-07-05.md
```

Remaining quality queues are handled through reviewed repair batches and do not reopen count-driven growth as the primary milestone.

## Range 0401-0450

```text
range records:                 50
promoted add_now:               7
promoted research:             17
existing duplicates consumed:   2
unresolved add_now:              0
unresolved needs_research:       0
pending_thin:                   16
out_of_scope_or_duplicate:       8
range status:                   closed
```

## Phase D execution order

1. HEI Registry Update surface.
2. Exchange Incident Timeline surface.
3. Evidence Health and Data Quality public summary.
4. Monthly historical exchange snapshot.
5. RSS and JSON feed outputs for reviewed public updates.
6. Continue quality repair batches in parallel.

Public publication rules:

- only merged canonical changes are presented as official registry updates;
- raw monitoring findings remain internal;
- monitoring signals are not final status classifications;
- public timeline items require reviewed canonical events or separately reviewed confirmed items.

## Later phases

- Phase E: Stats, internal links, SEO, metadata, sitemap.
- Phase F: English root and Japanese `/ja/` routes with translation overlays.
- Phase G: accessibility, URL safety, production integration, runbook, v1.0 baseline.

## Immediate schedule

| Order | Work | Result |
|---|---|---|
| 1 | merge range-close checkpoint | current research range fully closed |
| 2 | implement Registry Update | first Phase D public update surface |
| 3 | implement Incident Timeline | canonical event history surface |
| 4 | implement quality and monthly summaries | transparent maintenance outputs |
| 5 | add feeds | machine-readable public update stream |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Read the Phase C audit and latest range-close memo.
3. Resume the first incomplete Phase D item above.
4. Update this checkpoint whenever counts, phase, or execution order change.
