# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-03  
Target: HEI v1.0 and recurring registry operations

Repository state is authoritative if this checkpoint and GitHub disagree. Earlier detailed planning remains available in Git history and `docs/archive/HEI_V1_EXECUTION_ROADMAP_PRE_B1_2026-06-22.md`.

## Operating rules

- Automated monitoring must not directly modify `data/entities.json`, `data/events.json`, or `data/evidence.json`.
- Canonical changes require a reviewed normal pull request.
- Repair bundles do not increase entity count.
- Do not add thin records to reach a numerical target.
- Preserve original URLs; prefer archived access for dead-side records.
- Never infer reviewed counts from maximum IDs.
- Before merge, confirm the PR head, full diff, count effect, and all required checks.

## Current checkpoint

```text
Last confirmed main SHA: 33be1010f3a72a0f5a6ee9147cfae30cb3d8d110
Last merged PR: #502 Record Drift rebrand to Velocity and rebase HEI roadmap
Current phase: Phase C — Reviewed registry growth
Completed item: Drift Protocol -> Velocity lifecycle repair
Current item: verified-unadded range 0201-0250 initial scan
Next implementation item: first growth batch for Bitex.la, Bitpanda Pro, and BL3P
Cloudflare changes: none
Production deployment: none
```

### Reviewed public counts after PR #502

```text
Entities:  468
Events:    964
Evidence: 2414
```

### Maximum observed IDs after PR #502

```text
Entity:   hei_ex_000583
Event:    hei_ev_010039
Evidence: hei_src_011103
```

Maximum IDs are allocation markers, not counts.

### Phase C position

```text
Target entities: 550
Current entities: 468
Remaining additions: 82
Progress: 85.1%
```

Phase C remains current. The 550 milestone has not been reached.

## Completed current-event repair: Drift -> Velocity

The July 1, 2026 rebrand is now recorded on the existing Drift entity.

```text
Entity: hei_ex_000221 Drift Protocol
Status: limited -> rebranded
Death reason: null -> rebrand
Terminal/rebrand date: 2026-07-01
Entity count effect: 0
Event effect: +1
Evidence effect: +2
```

Velocity remains a successor candidate rather than a separate canonical entity until an operating platform URL and launched private or public product identity are verified.

## Verified-unadded range 0201-0250

Status: initial scan prepared

```text
Range records:                  50
add_now:                         7
needs_research:                 14
pending_thin:                   26
out_of_scope_or_duplicate:       3
```

Add-now queue:

```text
Bitex.la
Bitinka
Bitocto Exchange
Bitpanda Pro
BitPreço
BitShares DEX
BL3P
```

First implementation batch:

```text
Bitex.la
Bitpanda Pro
BL3P
```

The first batch is prioritized because each record has a clear acquisition, rebrand, or shutdown lifecycle that can be documented with strong sources.

## Remaining execution order

```text
C      Grow reviewed registry from 468 to at least 550
C8     Run the 550-entity milestone audit
D      Public-value update and research surfaces
E      Stats, internal linking, and SEO
F      English/Japanese bilingual publication
G      Final integration audit and HEI v1.0
```

## Phase C — Reviewed registry growth

Status: CURRENT  
Estimated remaining duration: 12-20 working days  
Estimated PRs: 10-16 growth PRs

Execution order:

1. merge the `0201-0250` scan;
2. promote Bitex.la, Bitpanda Pro, and BL3P;
3. promote Bitinka, Bitocto Exchange, BitPreço, and BitShares DEX;
4. resolve BitGlobal/Bithumb Singapore identity boundaries;
5. process the remaining research rows in small evidence-backed batches;
6. open the next unconsumed range only after actionable rows in this range are resolved or explicitly reclassified.

Rules:

- model entities, not deployment rows;
- do not split spot, futures, chain, or version rows without a distinct lifecycle identity;
- do not call a DEX dead only because one frontend disappeared;
- use `inactive` when terminal evidence is weak;
- reuse existing canonical identities instead of creating duplicates;
- leave tracker-only rows non-canonical until stronger evidence appears.

### C8 milestone gate

```text
reviewed entities >= 550
all additions meet public quality
all required CI checks green
public, monitoring, machine, and built counts agree
duplicate, archive, confidence, origin, and evidence-depth audits pass
```

## Phase D — Public-value surfaces

Estimated duration: 5-7 working days / 4-5 PRs

- Registry Update / Changelog from merged reviewed changes;
- Exchange Incident Timeline;
- safe Evidence Health aggregates;
- Monthly Exchange Failure Snapshot;
- RSS and JSON feeds.

## Phase E — Stats, links, and SEO

Estimated duration: 7-10 working days / 5-7 PRs

- stats generator and schemas;
- snapshot, trend, and coverage layers;
- search and related-entity links;
- metadata, JSON-LD, sitemap, and internal-link validation.

## Phase F — English/Japanese publication

Estimated duration: 6-9 working days / 5-6 PRs

English remains at root; Japanese uses `/ja/`. Canonical data stays single-source and translations remain overlays.

## Phase G — Final audit and HEI v1.0

Estimated duration: 4-6 working days / 4-5 PRs

- accessibility and interaction audit;
- URL-safety audit;
- production integration test;
- operations runbook;
- v1.0 release baseline.

## Revised schedule

| Period | Main work | Required result |
|---|---|---|
| Immediate | merge scan 0201-0250 | fixed 50-row queue and first batch |
| Weeks 1-3 | reviewed growth batches | 468 -> at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-5 | public update surfaces | Phase D complete |
| Weeks 5-7 | Stats, links, SEO | Phase E complete |
| Weeks 7-9 | Japanese primary routes | Phase F complete |
| Weeks 9-10 | final audit, runbook, production smoke | HEI v1.0 baseline |

This is sequencing guidance, not a deadline. Evidence quality may extend Phase C. GitHub-side work can continue without Cloudflare access; Cloudflare-only work is confined to final production integration.

## Recovery procedure

1. Read this file from `main`.
2. Confirm current main SHA and open PRs.
3. Regenerate reviewed counts; do not infer them from IDs.
4. Run the relevant validation commands.
5. Resume the first item whose completion gate is not met.
6. Update this checkpoint when phase, counts, or next item changes.
