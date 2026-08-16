# HEI AI-era Explorer/Search Strengthening Specification

Status: implementation specification  
Stage: AI-era Stage D  
Route: `/explore/`

Authority:

- `docs/HEI_V1_EXECUTION_ROADMAP.md`
- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`
- `docs/HEI_EXPLORER_QUERY_CONTRACT.md`
- `config/explorer-query-contract.json`

## 1. Purpose

Stage D strengthens deterministic discovery before any natural-language filter translation is considered. The existing Entity and Event Explorer already covers identity, lifecycle, status, origin, event, impact, confidence, URL and archive dimensions. Stage D adds reviewed provenance and verification dimensions without replacing the existing query contract or creating an Evidence Explorer.

The implementation remains a reviewed-registry research surface. It is not a risk score, recommendation engine, semantic search service, or LLM-generated answer layer.

## 2. Compatibility boundary

The route and all existing v1 query keys remain unchanged. Existing shared URLs must continue to parse and serialize identically.

Stage D is additive only. New keys are ignored by old parsers under the existing unknown-key compatibility rule.

The fixed route remains:

```text
/explore/
```

The existing crawl policy remains:

```text
base route indexable: yes
query variants in sitemap: no
query canonical: /explore/
generated filter landing pages: no
```

## 3. Entity Explorer additions

New entity query keys:

```text
verified_from
verified_to
evidence_source_type
evidence_reliability
evidence_archive_available
```

### 3.1 Last verification range

`verified_from` and `verified_to` use the same date normalization and inclusive range semantics as existing lifecycle dates, but operate only on canonical `entity.last_verified_at`.

A record with no valid `last_verified_at` does not match an active verification-date range.

### 3.2 Evidence provenance

`evidence_source_type` uses reviewed canonical evidence `source_type` values.

`evidence_reliability` uses reviewed canonical evidence `reliability` values:

```text
high
medium
low
```

`evidence_archive_available` uses reviewed canonical `evidence.archived_url`:

```text
true  -> qualifying evidence item has an archive URL
false -> qualifying evidence item has no archive URL
```

When more than one evidence filter is active, all evidence constraints must be satisfied by the same reviewed evidence item. This avoids a result where source type is satisfied by one source and reliability/archive state by an unrelated source.

## 4. Event Explorer additions

New event query keys:

```text
evidence_source_type
evidence_reliability
evidence_archive_available
```

Event evidence filters operate only on reviewed evidence whose `event_id` directly matches the reviewed event. Entity-level evidence without an event link does not satisfy an Event Explorer provenance filter.

All active evidence constraints must match the same directly linked evidence item.

## 5. Source type domain

Stage D exposes the existing reviewed evidence source-type domain without inventing new classifications:

```text
official_statement
official_blog
official_social
archive_capture
news_article
court_document
regulatory_notice
database_reference
community_reference
other
```

## 6. UI requirements

Entity Explorer must expose compact controls for:

- last-verified date range;
- evidence source type;
- evidence reliability;
- evidence archive state.

Event Explorer must expose compact controls for:

- directly linked evidence source type;
- directly linked evidence reliability;
- directly linked evidence archive state.

Existing desktop/mobile density, native details/summary filter groups, keyboard behavior, shareable URL state, and clear-all behavior remain required.

## 7. Safety

Stage D must not:

- expose raw evidence monitoring output;
- expose staging candidates;
- expose private notes;
- infer source quality beyond reviewed `reliability`;
- create a synthetic provenance score;
- generate arbitrary SEO pages from query combinations;
- change canonical entity/event/evidence facts.

## 8. Validation

Completion requires:

- query contract validator passes;
- query round-trip tests cover new keys;
- old canonical URL serialization remains unchanged;
- Entity and Event filters consume reviewed evidence only;
- evidence constraints use same-item matching;
- English and Japanese Explorer routes load the same reviewed evidence set while keeping canonical query keys locale-independent;
- final Explorer audit confirms accessibility, crawl policy and provenance wiring;
- full repository CI passes;
- production/read-only verification confirms the deployed Stage D commit before completion is recorded.

## 9. Handoff

After Stage D is production-verified, AI-era Stage E may extend Compare with deterministic provenance/lifecycle fields. Natural-language query translation remains deferred until Stages B through G are complete and a separate evaluation justifies it.
