# HEI BITPOINT / VCTRADE lifecycle update — 2026-09-04

## Scope

Lane A reviewed status/lifecycle follow-up for canonical BITPOINT entity `hei_ex_001133`.

This change does not add a new exchange entity and does not change schema, workflows, validators, monitoring, localization, routes, or Cloudflare configuration.

## Trigger and research boundary

A 2026-09-04 market-news post surfaced simultaneous asset delistings at BITPOINT and SBI VC Trade. That post is treated as a discovery signal only, not canonical evidence.

Fresh first-party review found a more material HEI lifecycle change already underway:

1. BITPoint Japan Co., Ltd. was absorbed into SBI VC Trade Co., Ltd. on 2026-04-01 while BITPOINT and VCTRADE initially continued as separate customer-facing services.
2. On 2026-06-30 BITPOINT and SBI VC Trade announced service integration, with BITPOINT accounts/assets planned to migrate to VCTRADE around the end of December 2026.
3. New BITPOINT account opening ended on 2026-07-31.
4. SBI VC Trade's current migration site states that BITPOINT trading and other service functions end after migration and customers continue through VCTRADE.
5. On 2026-09-04 BITPOINT announced that BNB, DEP, JMY/JASMY, OSHI, PEPE and TRUMP will be delisted on 2026-10-28.

The six-asset delisting is not modeled as a separate exchange lifecycle event. It is retained only as first-party corroboration of the staged service contraction during the already announced integration window.

## Canonical decision

Update BITPOINT from:

```text
status: active
```

to:

```text
status: limited
```

Preserve:

```text
death_reason: null
death_date: null
official_url_status: live_verified
```

Rationale: BITPOINT still has a live service during migration, but new account opening has ended and the surviving operator has explicitly announced that BITPOINT service use will terminate after migration to VCTRADE. This matches HEI's conservative transitional-state precedent: an announced permanent end with remaining user access is `limited`, not prematurely `dead`.

Add lifecycle event:

```text
hei_ev_010231
shutdown_announced
2026-06-30
event_status_effect: limited
```

The event date is the first-party service-integration announcement date. HEI does not invent an exact shutdown-effective date from the end-of-December migration target.

## Evidence additions

```text
hei_src_012777 — BITPOINT first-party service-integration announcement
hei_src_012778 — SBI VC Trade current BITPOINT-to-VCTRADE migration guidance
hei_src_012779 — BITPOINT 2026-09-04 six-asset delisting notice
```

Existing homepage status evidence `hei_src_012503` is refreshed to 2026-09-04 and no longer claims that new account opening remains available.

## Separate SBI VC Trade boundary

Repository search found no standalone canonical SBI VC Trade / VCTRADE exchange entity at this checkpoint. This lifecycle update therefore does not fabricate a `successor_id` relationship. A future reviewed SBI VC Trade entity can establish the relation after separate identity/evidence review.

The simultaneous SBI VC Trade delisting of APT, ETC and OAS is not itself a lifecycle-state event for the exchange and is not added to BITPOINT's canonical event timeline.

## Source URLs

- https://www.bitpoint.co.jp/news/info/info-2026040101/
- https://www.sbivc.co.jp/newsview/umhk6419ku
- https://www.bitpoint.co.jp/news/info/info-2026062901/
- https://www.sbivc.co.jp/bpj_vct
- https://www.bitpoint.co.jp/news/info/info-2026090401/

## Roadmap and specification alignment

Roadmap item:

```text
Lane A — status / lifecycle updates and ongoing reviewed lifecycle follow-up
```

Relevant authorities:

- `docs/HEI_V1_EXECUTION_ROADMAP.md`
- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`
- `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`
- `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`

The AI-era registry requirement explicitly calls for following lifecycle developments beyond initial headlines and preserving reviewed evidence/provenance. The data-growth specification requires status semantics and evidence traceability to remain intact.

## Canonical count impact

```text
entities: +0
events:   +1
evidence: +3
```

## Deployment impact

`records/*` is a public-output build-watch path. After reviewed merge to `main`, normal production deployment should publish the updated BITPOINT dossier and derived machine-readable/count surfaces.

Cloudflare preview is not required for this data-only lifecycle update under the deployment policy. No deployment configuration is changed.

## Validation and production verification plan

Before merge:

- run normal repository CI / record validation on the PR head;
- verify duplicate/ID collision checks remain green;
- verify public/machine count derivation accepts +0 entities / +1 event / +3 evidence.

After merge/deployment:

1. verify production `/version.json` reports the expected merged `main` commit;
2. verify BITPOINT public dossier shows `limited` and the 2026-06-30 transition event;
3. verify the BITPOINT record-level machine-readable bundle includes the new event/evidence;
4. verify manifest and public event/evidence counts match reviewed build output;
5. verify the original BITPOINT URL remains live/safe and no premature dead/merged terminal classification is exposed.
