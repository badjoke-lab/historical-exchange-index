# HEI Auto Monitoring Report - 20260511

## Run

- run_id: 20260511-062901
- mode: scheduled
- started_at: 2026-05-11T06:29:01.710Z
- finished_at: 2026-05-11T06:29:01.760Z
- meaningful_findings: yes

## Noise control

- total_findings_seen: 532
- visible_findings: 22
- suppressed_repeated_backlog_findings: 510
- new_findings: 21
- repeated_findings: 511

## Counts

- monitors: 7
- findings: 22
- suppressed_findings: 510
- candidates: 0
- critical: 0
- high: 12
- medium: 1
- low: 9

## A candidates

- None.

## B candidates

- None.

## Critical / high alerts

- [high] Invalid event_type on hei_ev_000515 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_type on hei_ev_000519 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_type on hei_ev_000521 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid source_type on hei_src_001076 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001078 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001079 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001080 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001082 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001085 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001121 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001122 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001138 (evidence-and-record-quality-watch) — fix_evidence_enum

## Regulatory watch

- enabled: false
- authorities_configured: 7
- query_templates: 5
- queries: 0
- items: 0
- candidates: 0

- None.

- [low] News and regulatory RSS fetching is disabled — enable_external_rss_checks_when_ready_for_scheduled_external_checks

## Data quality

- [low] Possible successor/predecessor link missing: Qryptos — review_lineage_fields_when_record_is_touched
- [low] official_url_status unknown: Allcoin — review_official_url_status_when_available
- [low] country_or_origin unknown: AgoraDesk — add_origin_if_sourceable
- [low] Possible successor/predecessor link missing: AgoraDesk — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: BarterDEX — review_lineage_fields_when_record_is_touched
- [low] country_or_origin unknown: AidosMarket — add_origin_if_sourceable
- [low] country_or_origin unknown: 55 Global Markets — add_origin_if_sourceable
- [high] Invalid event_type on hei_ev_000515 — fix_event_enum
- [high] Invalid event_type on hei_ev_000519 — fix_event_enum
- [high] Invalid event_type on hei_ev_000521 — fix_event_enum
- [high] Invalid source_type on hei_src_001076 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001078 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001079 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001080 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001082 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001085 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001121 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001122 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001138 — fix_evidence_enum

## Evidence health

- enabled: false
- evidence_with_urls: 942
- checked: 0
- findings: 0
- without_archive_total: 0

- None.

## Watchlist state

- watchlist_files: 9
- watchlist_candidates: 204
- class_A: 10
- class_B: 179
- class_C: 4
- manual_staging_packages: 9
- resolution_files: 2

- [medium] A candidate still pending: Tapp — stage_downgrade_or_resolve_candidate

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

1. Review critical/high alerts before accepting new staging work.
2. Review regulatory-source candidates separately and avoid status/death_reason changes without source confirmation.
3. Review watchlist-state findings and update staging or resolution files as needed.
