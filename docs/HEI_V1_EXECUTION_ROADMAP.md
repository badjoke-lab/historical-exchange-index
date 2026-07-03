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
Last confirmed main SHA: f7d358fe6b90e08d28f4e4f40bacd791e0ea98f7
Last merged PR: #501 Close verified-unadded research range 0151-0200
Current phase: Phase C — Reviewed registry growth
Completed item: verified-unadded range 0151-0200 closed
Current item: Drift Protocol -> Velocity lifecycle repair
Cloudflare changes: none
Production deployment: none
```

### Reviewed public counts after PR #501

```text
Entities:  468
Events:    963
Evidence: 2412
```

### Maximum observed IDs after PR #501

```text
Entity:   hei_ex_000583
Event:    hei_ev_010038
Evidence: hei_src_011101
```

Maximum IDs are allocation markers, not counts.

### Count composition

```text
Canonical: 306 entities / 513 events / 1172 evidence
Reviewed bundles: 323 total
New-entity bundles: 162
Repair bundles: 161
```

### Phase C position

```text
Target entities: 550
Current entities: 468
Remaining additions: 82
Progress: 85.1%
```

Phase C remains current. The 550 milestone has not been reached.

## Inserted current-event repair: Drift -> Velocity

The July 1, 2026 rebrand is inserted before the next growth range because it changes an existing high-impact DEX lifecycle record.

```text
Entity: hei_ex_000221 Drift Protocol
Status: limited -> rebranded
Death reason: null -> rebrand
Terminal/rebrand date: 2026-07-01
Entity count effect: 0
Event effect: +1
Evidence effect: +2
Projected counts: 468 / 964 / 2414
```

Do not create a second Drift entity. Do not create Velocity as a separate successor until a verified operating platform URL and launched private or public product identity are available. When that gate is met, create Velocity no stronger than `limited` and link `Drift.successor_id` to `Velocity.predecessor_id`.

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
Estimated PRs: 10-16 growth PRs, excluding the Drift repair

After the Drift repair:

1. open the next unconsumed verified-unadded range;
2. review 30-50 candidates as a pool;
3. classify each as `add_now`, `needs_research`, `pending_thin`, or `out_of_scope_or_duplicate`;
4. promote only public-quality records;
5. keep normal PRs near 5-10 new entities;
6. run overlap, record, count, URL, origin, and evidence checks.

Priority:

1. dead, acquired, merged, and rebranded records with strong terminal evidence;
2. active CEX and DEX records with meaningful lifecycle history;
3. perp DEX and hybrid entities with clear identity boundaries;
4. thin tracker-only candidates last or not at all.

Rules:

- model entities, not deployment rows;
- do not split spot, futures, chain, or version rows without a distinct lifecycle identity;
- do not call a DEX dead only because one frontend disappeared;
- use `inactive` when terminal evidence is weak;
- reuse existing canonical identities instead of creating duplicates.

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
| Immediate / Day 0-1 | Drift -> Velocity repair | existing Drift record reclassified; no premature successor duplicate |
| Weeks 1-3 | reviewed growth batches | 468 -> at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-5 | public update surfaces | Phase D complete |
| Weeks 5-7 | Stats, links, SEO | Phase E complete |
| Weeks 7-9 | Japanese primary routes | Phase F complete |
| Weeks 9-10 | final audit, runbook, production smoke | HEI v1.0 baseline |

This is sequencing guidance, not a deadline. Evidence quality may extend Phase C. GitHub-side work can continue without Cloudflare access; Cloudflare-only work is confined to final production integration.

### Remaining estimate

```text
Implementation PRs: approximately 26-39
Working days: approximately 35-56
Calendar estimate: approximately 8-13 weeks
```

## Recovery procedure

1. Read this file from `main`.
2. Confirm current main SHA and open PRs.
3. Regenerate reviewed counts; do not infer them from IDs.
4. Run the relevant validation commands.
5. Resume the first item whose completion gate is not met.
6. Update this checkpoint when phase, counts, or next item changes.
