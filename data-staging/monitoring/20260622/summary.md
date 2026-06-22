# HEI Auto Monitoring Report - 20260622

## Run

- run_id: 20260622-091644
- mode: scheduled-external
- started_at: 2026-06-22T09:16:44.726Z
- finished_at: 2026-06-22T09:17:52.100Z
- meaningful_findings: yes

## Noise control

- total_findings_seen: 461
- visible_findings: 52
- suppressed_repeated_backlog_findings: 409
- new_findings: 52
- repeated_findings: 409

## Counts

- monitors: 7
- findings: 52
- suppressed_findings: 409
- candidates: 25
- critical: 0
- high: 2
- medium: 5
- low: 45

## A candidates

- Cardax — review_and_stage_public_quality_record

## B candidates

- Exponent V2 — hold_for_active_baseline_or_batch_add
- World Markets Spot — hold_for_active_baseline_or_batch_add
- Hegic — hold_for_active_baseline_or_batch_add
- MUX Perps — hold_for_active_baseline_or_batch_add
- MetalX Swap — hold_for_active_baseline_or_batch_add
- FlashTrade — hold_for_active_baseline_or_batch_add
- Katana DEX — hold_for_active_baseline_or_batch_add
- Verus Market — hold_for_active_baseline_or_batch_add
- RISEx — hold_for_active_baseline_or_batch_add
- Contango V2 — hold_for_active_baseline_or_batch_add
- Deri V4 — hold_for_active_baseline_or_batch_add
- IntentX — hold_for_active_baseline_or_batch_add
- Storm Trade — hold_for_active_baseline_or_batch_add
- Sudo Perps — hold_for_active_baseline_or_batch_add
- Awaken Swap — hold_for_active_baseline_or_batch_add
- SynFutures V3 — hold_for_active_baseline_or_batch_add
- Waves Exchange — hold_for_active_baseline_or_batch_add
- AnyHedge — hold_for_active_baseline_or_batch_add
- Usual ETH0 — hold_for_active_baseline_or_batch_add
- MetalX Dex — hold_for_active_baseline_or_batch_add
- Bumpin Trade — hold_for_active_baseline_or_batch_add
- Bluefin Pro — hold_for_active_baseline_or_batch_add
- Sure — hold_for_regulatory_scope_review

## Critical / high alerts

- [high] Official site check dns_failure: ArcherSwap (active-status-watch) — investigate_active_to_inactive_candidate
- [high] Sitemap is missing required static routes (site-and-seo-watch) — inspect_sitemap_generation

## Regulatory watch

- enabled: true
- authorities_configured: 7
- query_templates: 5
- queries: 25
- items: 1943
- candidates: 1

- [B] Sure — Securities and Futures Commission — hold_for_regulatory_scope_review

- None.

## Data quality

- [low] official_url_status unknown: Stocks.exchange — review_official_url_status_when_available
- [low] Possible successor/predecessor link missing: Qryptos — review_lineage_fields_when_record_is_touched
- [low] official_url_status unknown: Allcoin — review_official_url_status_when_available
- [low] Possible successor/predecessor link missing: AgoraDesk — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: BarterDEX — review_lineage_fields_when_record_is_touched
- [low] country_or_origin unknown: AidosMarket — add_origin_if_sourceable
- [low] country_or_origin unknown: 55 Global Markets — add_origin_if_sourceable
- [low] Possible successor/predecessor link missing: DEEX — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: BayBit.io — review_lineage_fields_when_record_is_touched
- [low] country_or_origin unknown: BCC Exchange (BitConnect Coin) — add_origin_if_sourceable
- [low] Possible successor/predecessor link missing: 247Exchange — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: 6x — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: ACDX Exchange — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: AlfaCashier — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: Aryana Exchange — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: Anyswap — review_lineage_fields_when_record_is_touched
- [medium] Provisional text found: Thodex — replace_provisional_notes_with_reviewed_text
- [low] country_or_origin unknown: Txbit — add_origin_if_sourceable
- [low] Possible successor/predecessor link missing: Txbit — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: CoinFLEX — review_lineage_fields_when_record_is_touched
- [low] country_or_origin unknown: Bitbaby — add_origin_if_sourceable
- [medium] Provisional text found: Bitbaby — replace_provisional_notes_with_reviewed_text
- [low] country_or_origin unknown: BitStorage — add_origin_if_sourceable
- [medium] Provisional text found: BitStorage — replace_provisional_notes_with_reviewed_text
- [low] Possible successor/predecessor link missing: BitTrade — review_lineage_fields_when_record_is_touched
- [low] official_url_status unknown: CoinLoan — review_official_url_status_when_available
- [low] official_url_status unknown: CommEX — review_official_url_status_when_available
- [low] official_url_status unknown: Crema Finance — review_official_url_status_when_available
- [low] official_url_status unknown: EtherDelta — review_official_url_status_when_available
- [low] official_url_status unknown: Fairdesk — review_official_url_status_when_available
- [low] Possible successor/predecessor link missing: Garantex — review_lineage_fields_when_record_is_touched
- [low] Possible successor/predecessor link missing: LFJ — review_lineage_fields_when_record_is_touched
- [low] official_url_status unknown: ProBit Korea — review_official_url_status_when_available
- [low] official_url_status unknown: Zipmex — review_official_url_status_when_available

## Evidence health

- enabled: true
- evidence_with_urls: 1620
- checked: 25
- findings: 0
- without_archive_total: 0

- None.

## Watchlist state

- watchlist_files: undefined
- watchlist_candidates: undefined
- class_A: 11
- class_B: 155
- class_C: 5
- manual_staging_packages: 9
- resolution_files: undefined

- [low] Projected candidate lacks terminal resolution: Aevo Perps — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Beets DEX V3 — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Bifrost DEX — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Byte Exchange — add_terminal_resolution
- [medium] Unresolved A candidate: Cardax — stage_downgrade_or_resolve_candidate
- [low] Projected candidate lacks terminal resolution: Curve DEX — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: dYdX V3 — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: dYdX V4 — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Gains Network — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Joe DEX — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Jupiter Perpetual Exchange — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Orca DEX — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Osmosis DEX — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Quickswap Dex — add_terminal_resolution
- [low] Projected candidate lacks terminal resolution: Thorchain DEX — add_terminal_resolution

## Site / SEO

- enabled: true
- site_url: https://hei.badjoke-lab.com
- routes_checked: 8
- route_findings: 0
- sitemap_checked: true
- sitemap_status: ok
- sitemap_exchange_routes_expected: 412
- sitemap_exchange_routes_actual: 412
- robots_checked: true
- robots_status: ok

- [high] Sitemap is missing required static routes — inspect_sitemap_generation

## Suggested operator actions

1. Review critical/high alerts before accepting new staging work.
2. Review A candidates and decide whether to promote them to manual staging packages.
3. Keep B candidates in watchlist or downgrade/resolve them after review.
4. Review regulatory-source candidates separately and avoid status/death_reason changes without source confirmation.
5. Review watchlist-state findings and update staging or resolution files as needed.
6. Review site/SEO findings and inspect deploy, sitemap, robots, or route generation.
