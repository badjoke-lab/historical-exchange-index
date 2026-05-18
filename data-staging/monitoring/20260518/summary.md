# HEI Auto Monitoring Report - 20260518

## Run

- run_id: 20260518-064520
- mode: scheduled
- started_at: 2026-05-18T06:45:20.023Z
- finished_at: 2026-05-18T06:45:20.078Z
- meaningful_findings: yes

## Noise control

- total_findings_seen: 560
- visible_findings: 50
- suppressed_repeated_backlog_findings: 510
- new_findings: 49
- repeated_findings: 511

## Counts

- monitors: 7
- findings: 50
- suppressed_findings: 510
- candidates: 0
- critical: 0
- high: 21
- medium: 8
- low: 21

## A candidates

- None.

## B candidates

- None.

## Critical / high alerts

- [high] Invalid event_type on hei_ev_000515 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_type on hei_ev_000519 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_type on hei_ev_000521 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_status_effect on hei_ev_000546 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_type on hei_ev_000574 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid event_status_effect on hei_ev_000575 (evidence-and-record-quality-watch) — fix_event_enum
- [high] Invalid source_type on hei_src_001076 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001078 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001079 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001080 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001082 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001085 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001121 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001122 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001138 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001166 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001178 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001180 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid source_type on hei_src_001200 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid claim_scope on hei_src_001241 (evidence-and-record-quality-watch) — fix_evidence_enum
- [high] Invalid claim_scope on hei_src_001284 (evidence-and-record-quality-watch) — fix_evidence_enum

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
- [low] Possible successor/predecessor link missing: DEEX — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: BayBit.io — review_lineage_fields_when_record_is_touched
- [low] country_or_origin unknown: BCC Exchange (BitConnect Coin) — add_origin_if_sourceable
- [medium] Invalid official_url_status on hei_ex_000301 — fix_entity_enum
- [low] Possible successor/predecessor link missing: BCM Exchange — review_lineage_fields_when_record_is_touched
- [medium] Invalid official_url_status on hei_ex_000302 — fix_entity_enum
- [low] Possible successor/predecessor link missing: 247Exchange — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: 6x — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: ACDX Exchange — review_lineage_fields_when_record_is_touched
- [medium] Invalid official_url_status on hei_ex_000306 — fix_entity_enum
- [low] Possible successor/predecessor link missing: AlfaCashier — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: Aryana Exchange — review_lineage_fields_when_record_is_touched
- [medium] Invalid official_url_status on hei_ex_000309 — fix_entity_enum
- [medium] Invalid official_url_status on hei_ex_000310 — fix_entity_enum
- [low] Possible successor/predecessor link missing: Anyswap — review_lineage_fields_when_record_is_touched
- [medium] Provisional text found: Thodex — replace_provisional_notes_with_reviewed_text
- [low] country_or_origin unknown: Txbit — add_origin_if_sourceable
- [low] Possible successor/predecessor link missing: Txbit — review_lineage_fields_when_record_is_touched
- [medium] Invalid official_url_status on hei_ex_000313 — fix_entity_enum
- [high] Invalid event_type on hei_ev_000515 — fix_event_enum
- [high] Invalid event_type on hei_ev_000519 — fix_event_enum
- [high] Invalid event_type on hei_ev_000521 — fix_event_enum
- [high] Invalid event_status_effect on hei_ev_000546 — fix_event_enum
- [high] Invalid event_type on hei_ev_000574 — fix_event_enum
- [high] Invalid event_status_effect on hei_ev_000575 — fix_event_enum
- [high] Invalid source_type on hei_src_001076 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001078 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001079 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001080 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001082 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001085 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001121 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001122 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001138 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001166 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001178 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001180 — fix_evidence_enum
- [high] Invalid source_type on hei_src_001200 — fix_evidence_enum
- [high] Invalid claim_scope on hei_src_001241 — fix_evidence_enum
- [high] Invalid claim_scope on hei_src_001284 — fix_evidence_enum

## Evidence health

- enabled: false
- evidence_with_urls: 1063
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
