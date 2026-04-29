# HEI Auto Monitoring Report - 20260429

## Run

- run_id: 20260429-115954
- mode: scheduled
- started_at: 2026-04-29T11:59:54.231Z
- finished_at: 2026-04-29T12:00:11.726Z
- meaningful_findings: yes

## Noise control

- total_findings_seen: 510
- visible_findings: 9
- suppressed_repeated_backlog_findings: 501
- new_findings: 9
- repeated_findings: 501

## Counts

- monitors: 7
- findings: 9
- suppressed_findings: 501
- candidates: 3
- critical: 0
- high: 0
- medium: 6
- low: 3

## A candidates

- Zedxion — review_and_stage_public_quality_record
- Txbit — review_and_stage_public_quality_record
- Serum — review_and_stage_public_quality_record

## B candidates

- None.

## Critical / high alerts

- None.

## Regulatory watch

- enabled: true
- authorities_configured: 7
- query_templates: 5
- queries: 25
- items: 1941
- candidates: 0

- None.

- None.

## Data quality

- [low] official_url_status unknown: CHBTC — review_official_url_status_when_available
- [low] official_url_status unknown: DragonEX — review_official_url_status_when_available

## Evidence health

- enabled: false
- evidence_with_urls: 766
- checked: 0
- findings: 0
- without_archive_total: 0

- [low] Evidence URL checks are disabled — enable_evidence_url_checks_when_ready_for_scheduled_external_checks

## Watchlist state

- watchlist_files: 5
- watchlist_candidates: 24
- class_A: 9
- class_B: 4
- class_C: 4
- manual_staging_packages: 9
- resolution_files: 1

- [medium] A candidate still pending: Zedxion — stage_downgrade_or_resolve_candidate
- [medium] A candidate still pending: Txbit — stage_downgrade_or_resolve_candidate
- [medium] A candidate still pending: Serum — stage_downgrade_or_resolve_candidate

## Site / SEO

- enabled: false
- site_url: https://hei.badjoke-lab.com
- routes_checked: 0
- route_findings: 0
- sitemap_checked: false
- sitemap_status: undefined
- sitemap_exchange_routes_expected: 0
- sitemap_exchange_routes_actual: 0
- robots_checked: false
- robots_status: not_checked

- None.

## Suggested operator actions

1. Review A candidates and decide whether to promote them to manual staging packages.
2. Review watchlist-state findings and update staging or resolution files as needed.
