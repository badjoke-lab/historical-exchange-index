# HEI Auto Monitoring Report - 20260502

## Run

- run_id: 20260502-053035
- mode: scheduled
- started_at: 2026-05-02T05:30:35.096Z
- finished_at: 2026-05-02T05:30:35.145Z
- meaningful_findings: yes

## Noise control

- total_findings_seen: 508
- visible_findings: 7
- suppressed_repeated_backlog_findings: 501
- new_findings: 7
- repeated_findings: 501

## Counts

- monitors: 7
- findings: 7
- suppressed_findings: 501
- candidates: 0
- critical: 0
- high: 2
- medium: 0
- low: 5

## A candidates

- None.

## B candidates

- None.

## Critical / high alerts

- [high] Invalid event_type on hei_ev_000490 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid source_type on hei_src_001032 (evidence-and-record-quality-watch) — fix_evidence_enum

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

- [high] Invalid event_type on hei_ev_000490 — fix_event_enum
- [high] Invalid source_type on hei_src_001032 — fix_evidence_enum

## Evidence health

- enabled: false
- evidence_with_urls: 817
- checked: 0
- findings: 0
- without_archive_total: 0

- [low] Evidence URL checks are disabled — enable_evidence_url_checks_when_ready_for_scheduled_external_checks

## Watchlist state

- watchlist_files: 7
- watchlist_candidates: 128
- class_A: 9
- class_B: 104
- class_C: 4
- manual_staging_packages: 9
- resolution_files: 2

- None.

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

- [low] Site and SEO checks are disabled — enable_site_seo_checks_when_ready_for_scheduled_external_checks

## Suggested operator actions

1. Review critical/high alerts before accepting new staging work.
2. Review regulatory-source candidates separately and avoid status/death_reason changes without source confirmation.
