# Machine-readable Public Registry Layer

Status: fixed specification  
Scope: Badjoke Lab ledger-series sites, including HEI, MAG, SOG, CYA, BIR, AI-related ledgers, and future registry projects  
Initial implementation target: HEI after this specification is accepted  
Canonical rule: public machine-readable files expose only reviewed public registry information, never internal staging, monitoring raw output, private review notes, or unverified candidate data.

---

## 1. Purpose

The Machine-readable Public Registry Layer is a shared public metadata layer for the ledger-series sites.

It exists so that each registry can be checked and understood by humans, AI agents, search systems, simple scripts, and future internal monitoring tools without scraping the visual UI.

The layer must make the following information machine-checkable:

- which project the site represents
- which registry family it belongs to
- which public origin is canonical
- which build is currently deployed
- which public data model is exposed
- how many reviewed public records exist
- which routes are expected to exist
- which files external tools should read first
- whether the public site appears to be stale or incomplete

This is not an SEO trick and not a guarantee that AI systems or search engines will read these files. It is a public convention that makes the registry easier to inspect, verify, monitor, and reuse.

---

## 2. Non-goals

This layer does not do the following:

- guarantee search ranking
- guarantee AI ingestion
- replace the human-facing website
- replace methodology pages
- replace source review
- publish internal monitoring output
- publish unreviewed candidates
- automatically update canonical registry data
- certify that the registry is complete

It is a public index and verification layer, not the registry authority itself.

---

## 3. Required public files

Every ledger-series site should expose these four files at the site root or under `/data/`.

```txt
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

### 3.1 `/version.json`

Purpose: identify the currently deployed public build and its reviewed public data summary.

Primary users:

- deployment checks
- status checkers
- simple scripts
- operator review
- future ledger-series status pages

### 3.2 `/data/manifest.json`

Purpose: describe the registry, its public data model, routes, readable endpoints, record counts, and safety boundaries.

Primary users:

- AI agents
- external reviewers
- cross-site tools
- future portal/status pages
- documentation readers

### 3.3 `/llms.txt`

Purpose: provide a short Markdown-like guide for AI systems and agents.

Primary users:

- LLM browsing tools
- AI search agents
- external readers looking for the important routes

Important limitation: this file is only a convention. It does not force any AI system to read or obey it.

### 3.4 `/ai.txt`

Purpose: provide an even simpler plain-text index for AI-readable discovery.

Primary users:

- simple text fetchers
- low-context tools
- fallback readers that do not need the fuller `/llms.txt`

---

## 4. Optional public files

These can be added after the required four-file layer is stable.

```txt
/data/entities.json
/data/events.json
/data/evidence.json
/data/stats.json
/data/source-quality.json
/changelog.json
/registry-map.json
```

Optional files must still obey the same public-data boundary. They must not expose staging candidates, raw monitoring output, private notes, or unreviewed material.

---

## 5. Public-data safety boundary

The layer must expose only reviewed public registry information.

### 5.1 Publicly allowed

The following are safe to expose:

```txt
project id
site name
canonical origin
registry family
registry type
schema version
public build commit
public build branch
build timestamp
public data generation timestamp
reviewed public record counts
public route list
public file list
public methodology route
public correction route
public GitHub route
public stats route
public source-quality route
```

### 5.2 Not allowed

The following must not be exposed through this public layer:

```txt
unreviewed candidates
candidate staging files
internal monitoring raw output
private research notes
operator-only review notes
unsafe-domain raw logs
internal scoring details
duplicate matching internals
Google Form raw responses
unreviewed GitHub issue scrape output
unmerged candidate records
private source notes
credentials, tokens, or API keys
```

### 5.3 Required manifest safety flag

Every `/data/manifest.json` must include this block.

```json
{
  "data_safety": {
    "canonical_only": true,
    "includes_unreviewed_candidates": false,
    "includes_internal_monitoring": false,
    "includes_private_notes": false
  }
}
```

If any of these values would be false/true in the wrong direction, the file must not be published.

---

## 6. Common naming rules

### 6.1 Project id

Use a stable lowercase hyphenated id.

Examples:

```txt
historical-exchange-index
minted-and-gone
stablecoin-observatory
crypto-yield-archive
bridge-incident-registry
ai-tools-history-archive
```

### 6.2 Registry family

Use this value for all ledger-series sites.

```txt
badjoke-lab-ledger-series
```

### 6.3 Registry type

Use a specific lowercase snake-case value.

Examples:

```txt
historical_crypto_exchange_registry
historical_nft_market_registry
stablecoin_issuer_registry
historical_crypto_yield_registry
bridge_incident_registry
ai_tools_history_registry
```

### 6.4 Schema version

The public layer itself uses semantic versioning.

Initial value:

```txt
1.0.0
```

### 6.5 Build verification marker

Each site must have a project-specific marker.

Format:

```txt
<project_short_id>_machine_readable_layer_v1
```

Examples:

```txt
hei_machine_readable_layer_v1
cya_machine_readable_layer_v1
sog_machine_readable_layer_v1
mag_machine_readable_layer_v1
bir_machine_readable_layer_v1
```

---

## 7. `/version.json` required schema

`/version.json` must be concise and stable. It is the first file used for deployment/status checks.

### 7.1 Required fields

```json
{
  "schema_version": "1.0.0",
  "project_id": "historical-exchange-index",
  "site_name": "Historical Exchange Index",
  "registry_family": "badjoke-lab-ledger-series",
  "registry_type": "historical_crypto_exchange_registry",
  "canonical_origin": "https://hei.badjoke-lab.com",
  "release_channel": "production",
  "build": {
    "commit": "auto-generated",
    "branch": "main",
    "generated_at": "auto-generated",
    "verification_marker": "hei_machine_readable_layer_v1"
  },
  "data": {
    "data_schema_version": "hei_entity_event_evidence_v1",
    "generated_at": "auto-generated",
    "records_last_reviewed_at": null,
    "record_counts": {
      "primary_records": 0,
      "events": 0,
      "evidence": 0
    },
    "record_count_breakdown": {}
  },
  "routes": {
    "home": "/",
    "methodology": "/methodology/",
    "corrections": "/corrections/",
    "stats": "/stats/"
  }
}
```

### 7.2 Field rules

`build.commit` should be generated from the deployment environment when possible. It must not be manually copied between releases.

`build.generated_at` means the site build timestamp.

`data.generated_at` means the timestamp when the public data summary was generated.

`data.records_last_reviewed_at` means the latest reviewed public data date if the project tracks it. It may be `null` when unknown.

`record_counts.primary_records` must mean the main record type for that registry, regardless of whether the project calls them exchanges, platforms, collections, stablecoins, bridges, or tools.

`record_count_breakdown` may be project-specific.

---

## 8. `/data/manifest.json` required schema

`/data/manifest.json` is the public data and route catalogue.

### 8.1 Required fields

```json
{
  "schema_version": "1.0.0",
  "project_id": "historical-exchange-index",
  "title": "Historical Exchange Index",
  "description": "Evidence-backed historical registry of crypto exchanges, active and gone.",
  "canonical_origin": "https://hei.badjoke-lab.com",
  "registry_family": "badjoke-lab-ledger-series",
  "registry_type": "historical_crypto_exchange_registry",
  "data_model": {
    "primary_record": "exchange_entity",
    "supporting_records": [
      "exchange_event",
      "exchange_evidence"
    ]
  },
  "public_files": {
    "version": "/version.json",
    "manifest": "/data/manifest.json",
    "llms": "/llms.txt",
    "ai": "/ai.txt"
  },
  "main_routes": [
    "/",
    "/dead/",
    "/active/",
    "/exchange/{slug}/",
    "/stats/",
    "/methodology/",
    "/about/"
  ],
  "record_counts": {
    "primary_records": 0,
    "events": 0,
    "evidence": 0
  },
  "record_count_breakdown": {},
  "data_safety": {
    "canonical_only": true,
    "includes_unreviewed_candidates": false,
    "includes_internal_monitoring": false,
    "includes_private_notes": false
  }
}
```

### 8.2 Optional fields

```json
{
  "correction_links": {
    "form": "https://example.com/form",
    "github": "https://github.com/example/repo/issues"
  },
  "repository": {
    "type": "github",
    "url": "https://github.com/badjoke-lab/historical-exchange-index"
  },
  "license": null,
  "language": "en",
  "locales": ["en", "ja"],
  "generated_at": "auto-generated"
}
```

---

## 9. `/llms.txt` required content structure

`/llms.txt` should be short. It should guide readers to the important routes and public files without trying to replace the site.

Template:

```txt
# Historical Exchange Index

Evidence-backed historical registry of crypto exchanges, active and gone.

Canonical site: https://hei.badjoke-lab.com/

Machine-readable files:
- /version.json
- /data/manifest.json
- /ai.txt

Main routes:
- /
- /dead/
- /active/
- /exchange/{slug}/
- /stats/
- /methodology/
- /about/

Use notes:
- This is a historical registry, not a live ranking.
- Record data may be incomplete or revised.
- Use methodology and evidence links when interpreting records.
- Do not treat unverified external claims as HEI classifications.
```

---

## 10. `/ai.txt` required content structure

`/ai.txt` is a simpler plain-text entry point.

Template:

```txt
Historical Exchange Index

Purpose: Evidence-backed historical registry of crypto exchanges, active and gone.
Canonical origin: https://hei.badjoke-lab.com
Version endpoint: /version.json
Manifest endpoint: /data/manifest.json
LLM guide: /llms.txt

Important routes:
/
/dead/
/active/
/exchange/{slug}/
/stats/
/methodology/
/about/

Safety note: Public files expose reviewed public registry information only. They do not include unreviewed candidates, private notes, or internal monitoring output.
```

---

## 11. Cross-registry count model

Every site has a different domain model. To make cross-series monitoring possible, counts must include both a common layer and a project-specific breakdown.

### 11.1 Common layer

```json
{
  "record_counts": {
    "primary_records": 0,
    "events": 0,
    "evidence": 0
  }
}
```

### 11.2 Project-specific breakdown

Examples:

HEI:

```json
{
  "record_count_breakdown": {
    "exchanges": 386,
    "active_side": 207,
    "dead_side": 179,
    "cex": 300,
    "dex": 80,
    "hybrid": 6
  }
}
```

CYA:

```json
{
  "record_count_breakdown": {
    "platforms": 24,
    "yield_outcomes": 90,
    "terms_risk_records": 20
  }
}
```

SOG:

```json
{
  "record_count_breakdown": {
    "stablecoins": 40,
    "issuers": 25,
    "depeg_events": 35,
    "reserve_reports": 60,
    "regulatory_actions": 20
  }
}
```

---

## 12. Registry profiles

Each registry should define its profile before implementation.

### 12.1 HEI

```json
{
  "project_id": "historical-exchange-index",
  "site_name": "Historical Exchange Index",
  "registry_type": "historical_crypto_exchange_registry",
  "primary_record": "exchange_entity",
  "supporting_records": ["exchange_event", "exchange_evidence"],
  "main_routes": ["/", "/dead/", "/active/", "/exchange/{slug}/", "/stats/", "/methodology/", "/about/"]
}
```

### 12.2 MAG

```json
{
  "project_id": "minted-and-gone",
  "site_name": "Minted & Gone",
  "registry_type": "historical_nft_market_registry",
  "primary_record": "nft_project_or_collection",
  "supporting_records": ["market_event", "evidence"],
  "main_routes": ["/", "/gone/", "/active/", "/collection/{slug}/", "/stats/", "/methodology/", "/about/"]
}
```

### 12.3 SOG

```json
{
  "project_id": "stablecoin-observatory",
  "site_name": "Stablecoin Observatory",
  "registry_type": "stablecoin_issuer_registry",
  "primary_record": "stablecoin",
  "supporting_records": ["issuer", "event", "evidence", "reserve_report"],
  "main_routes": ["/", "/stablecoin/{slug}/", "/issuer/{slug}/", "/depegs/", "/reserves/", "/stats/", "/methodology/", "/about/"]
}
```

### 12.4 CYA

```json
{
  "project_id": "crypto-yield-archive",
  "site_name": "Crypto Yield Archive",
  "registry_type": "historical_crypto_yield_registry",
  "primary_record": "yield_platform",
  "supporting_records": ["platform_event", "evidence", "terms_risk", "outcome"],
  "main_routes": ["/", "/platform/{slug}/", "/outcomes/", "/failures/", "/terms-risk/", "/timeline/", "/stats/", "/source-quality/", "/methodology/", "/corrections/"]
}
```

### 12.5 BIR

```json
{
  "project_id": "bridge-incident-registry",
  "site_name": "Bridge Incident Registry",
  "registry_type": "bridge_incident_registry",
  "primary_record": "bridge_or_incident",
  "supporting_records": ["incident_event", "evidence", "affected_chain", "asset_impact"],
  "main_routes": ["/", "/incident/{slug}/", "/bridges/", "/chains/", "/stats/", "/methodology/", "/about/"]
}
```

---

## 13. Cache and header rules

These files should be cacheable but not stale for too long.

Recommended `_headers` rules:

```txt
/version.json
  Cache-Control: public, max-age=300, must-revalidate

/data/manifest.json
  Cache-Control: public, max-age=3600, must-revalidate

/llms.txt
  Cache-Control: public, max-age=3600, must-revalidate

/ai.txt
  Cache-Control: public, max-age=3600, must-revalidate
```

`/version.json` should have the shortest cache period because it is used to detect stale deployment state.

---

## 14. HTML discovery links

After implementation, each site may expose discovery links in the document head.

```html
<link rel="alternate" type="application/json" href="/version.json">
<link rel="alternate" type="application/json" href="/data/manifest.json">
<link rel="alternate" type="text/plain" href="/llms.txt">
<link rel="alternate" type="text/plain" href="/ai.txt">
```

Footer display should remain small and secondary.

Example:

```txt
Machine-readable: version · manifest · llms.txt
```

This is a utility link group, not a marketing block.

---

## 15. Build generation rules

The files may be static in the repository at first, but production-quality implementation should generate dynamic values at build time.

### 15.1 Should be generated

```txt
build.commit
build.branch
build.generated_at
data.generated_at
record_counts
record_count_breakdown
```

### 15.2 May be static

```txt
schema_version
project_id
site_name
registry_family
registry_type
canonical_origin
release_channel
main_routes
public_files
data_model
```

### 15.3 Must not be hand-copied per release

```txt
build.commit
build.generated_at
record_counts
```

If these are hand-maintained, the endpoint becomes unreliable.

---

## 16. Validation checklist

A site passes the minimum public-layer check when all of the following are true.

```txt
/version.json returns 200
/data/manifest.json returns 200
/llms.txt returns 200
/ai.txt returns 200
schema_version is present
project_id is present
registry_family is badjoke-lab-ledger-series
canonical_origin matches the live origin
build.verification_marker is present
record_counts.primary_records is present
record_counts does not contain impossible negative values
main_routes is non-empty
data_safety.canonical_only is true
data_safety.includes_unreviewed_candidates is false
data_safety.includes_internal_monitoring is false
data_safety.includes_private_notes is false
```

A stronger checker may also verify that each main route returns 200 and that the deployed commit matches the expected branch head.

---

## 17. Implementation phases

### Phase 1: Common specification

Add this document and accept it as the shared rule for the ledger series.

No endpoint implementation is included in this phase.

### Phase 2: HEI implementation

Add the required files to HEI.

```txt
/version.json
/data/manifest.json
/llms.txt
/ai.txt
_headers
```

Build-generated fields should be implemented where practical.

### Phase 3: CYA alignment

CYA already has an early version of this layer. Align field names, safety flags, and count structure with this specification.

### Phase 4: MAG implementation

Add the required files using the MAG registry profile.

### Phase 5: SOG implementation

Add the required files using the SOG registry profile.

### Phase 6: BIR and AI-ledger implementation

Add the required files to the remaining ledger-series sites.

### Phase 7: Cross-site checker

Add a script that checks all known ledger-series sites.

Minimum checks:

```txt
fetch /version.json
fetch /data/manifest.json
fetch /llms.txt
fetch /ai.txt
validate schema_version
validate registry_family
validate record_counts
validate data_safety
validate expected routes
```

### Phase 8: Public ledger-series status page

Add a public status page or portal section after the checker is stable.

The page should show only reviewed public metadata, not raw internal monitoring output.

---

## 18. Decision

This layer is required for ledger-series projects once they move beyond a single standalone site.

It makes each registry easier to:

```txt
read
verify
monitor
compare
summarize
handoff
audited externally
explain during sale or transfer
```

The first implementation target after this specification is HEI.
