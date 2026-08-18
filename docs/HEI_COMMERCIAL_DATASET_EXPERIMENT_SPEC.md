# HEI Commercial Dataset Experiment Specification

Status: bounded pre-publication experiment  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-08-19

## 1. Purpose

Test whether HEI's existing reviewed registry can be packaged as a paid machine-consumable dataset without creating a new site, weakening the reviewed-public boundary, or interrupting the current HEI roadmap.

This experiment is intentionally narrower than a new API or SaaS product. It reuses reviewed HEI data and produces an offline export package for marketplace qualification and buyer testing.

## 2. Product hypothesis

Working product name:

`Crypto Exchange Lifecycle & Incident Dataset`

The value proposition is not exclusive access to facts that are already public. The paid package would provide:

- a normalized cross-exchange schema;
- entity, lifecycle-event, and evidence tables joined by stable IDs;
- CSV and JSON forms suitable for ingestion;
- deterministic version and hash metadata;
- dated snapshots and revision tracking when the experiment advances beyond sample stage;
- a documented field dictionary and reviewed-data boundary.

The free HEI website and public machine-readable layer remain available. The commercial experiment must not remove or degrade existing public output.

## 3. Source-of-truth boundary

Commercial exports must be derived only from the same reviewed canonical state used by HEI public machine-readable output:

- base canonical arrays;
- reviewed `records/exchanges` bundles;
- reviewed entity corrections;
- reviewed aggregation and identity-resolution semantics.

Do not export:

- staging candidates;
- monitoring output;
- private research notes;
- unreviewed classifications;
- unpublished candidate records.

The existing reviewed `entity -> event -> evidence` model remains authoritative.

## 4. Initial package

The first package contains three joined tables plus a manifest:

### exchanges.csv

Core fields:

`id, slug, canonical_name, aliases, type, status, death_reason, launch_date, death_date, country_or_origin, official_domain_original, official_url_status, archived_url, confidence, last_verified_at, predecessor_id, successor_id`

### events.csv

Core fields:

`id, exchange_id, exchange_slug, event_type, event_date, title, description, confidence, impact_level, event_status_effect, source_count, sort_order`

### evidence.csv

Core fields:

`id, exchange_id, exchange_slug, event_id, source_type, title, url, publisher, published_at, archived_url, accessed_at, reliability, claim_scope`

### manifest.json

Must include:

- package schema version;
- generation timestamp;
- export mode (`sample` or `full`);
- reviewed record counts;
- SHA-256 hashes for emitted files;
- source repository and source commit when supplied by the operator;
- pre-publication status.

## 5. Sample-first safety gate

The exporter defaults to `sample` mode and emits only a bounded subset of reviewed exchanges.

A complete export requires an explicit `--full` argument. This prevents accidental creation or publication of a full commercial package during ordinary repository work.

Generated output is local-only and must not be committed to this public repository.

## 6. Commercial publication gate

No paid marketplace listing is authorized by this specification alone.

Before publication, all of the following must be completed:

1. marketplace/provider eligibility confirmed;
2. seller identity, tax, payout, and banking steps completed by the account owner where required;
3. commercial license terms finalized;
4. sample package reviewed for schema stability and usefulness;
5. rights review confirms the package redistributes HEI-authored normalized facts/metadata and source references without republishing restricted third-party source content;
6. pricing and update cadence are explicitly approved;
7. one marketplace is selected for the first live test;
8. the first listing has a measurable stop/go criterion.

## 7. First marketplace experiment

AWS Data Exchange / AWS Marketplace is the current first channel to evaluate because it supports paid data products and existing marketplace distribution.

This is a channel hypothesis, not a claim that the dataset will sell.

The first live test must measure actual buyer behavior. Do not expand into SOG, BIR, WLR, CYA, or a cross-ledger bundle merely because the first listing receives no sales.

## 8. Kill criteria

The experiment must be stopped or redesigned rather than expanded if any of the following occurs:

- seller/provider qualification cannot be completed on acceptable terms;
- license or rights review makes the package impractical;
- the sample does not provide a meaningful ingestion advantage over HEI's existing free JSON;
- marketplace publication would require ongoing paid infrastructure before demand is demonstrated;
- the first marketplace test shows no meaningful qualified interest and no evidence that packaging, rather than demand, is the blocker.

No new public HEI feature is justified solely to support this commercial experiment.

## 9. Operational impact

Canonical count impact: none.  
Public route impact: none.  
Cloudflare impact: none.  
Preview required: no.  
Production verification: not applicable until a future public-output change is separately proposed.

The exporter is an offline operator tool and must not be connected to the Next.js build, Cloudflare deployment, monitoring, or canonical review pipeline.

## 10. Current implementation step

The first implementation step is a deterministic local exporter that:

- reads reviewed HEI state using existing aggregation/correction logic;
- emits sample/full CSV tables and a JSON manifest;
- records hashes;
- refuses to emit a full bundle unless `--full` is passed;
- writes only to an ignored local output directory.

Completion of the exporter is preparation only. It does not constitute marketplace publication or proof of demand.
