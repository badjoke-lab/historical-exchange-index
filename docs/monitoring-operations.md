# HEI Monitoring Operations Runbook

Status: operational runbook  
Scope: scheduled/manual operation of the HEI auto monitoring system

---

## 1. Purpose

HEI monitoring is designed to:

1. discover candidate exchange records;
2. detect exchange-related news/events;
3. watch active-side official URLs and evidence URL health;
4. monitor regulatory-source signals;
5. check public site, sitemap, and robots health;
6. report findings through GitHub pull requests.

Monitoring is report-only. It must not directly modify canonical files:

```txt
data/entities.json
data/events.json
data/evidence.json
```

---

## 2. Normal scheduled behavior

The scheduled workflow runs weekly.

Default scheduled run:

```txt
external lists: disabled
news RSS: disabled
official domain checks: disabled
evidence URL checks: disabled
regulatory watch: disabled
site/SEO checks: disabled
```

This keeps the default run cheap and safe. It still runs internal checks such as data quality, watchlist state, monitoring health, and noise control.

---

## 3. Manual workflow inputs

Manual runs can enable external checks one by one.

### `enable_external_lists`

Enables optional remote external-list discovery.

Use when:

```txt
looking for active motherlist candidates
checking external source differences
expanding candidate discovery
```

### `enable_news_rss`

Enables Google News RSS monitoring for shutdowns, hacks, withdrawal suspensions, regional exits, acquisition/migration/rebrand, and general exchange incidents.

Use when:

```txt
looking for recent negative CEX/DEX news
preparing a weekly exchange watch review
checking if new incidents should become HEI records/events
```

### `enable_domain_checks`

Enables official site/domain checks for active-side records.

Use when:

```txt
checking whether active/limited/inactive records still have working official URLs
looking for DNS failure, parked domains, redirects, or suspicious official-site changes
```

### `enable_evidence_url_checks`

Enables evidence source URL and archived URL checks.

Use when:

```txt
checking broken evidence links
finding evidence that needs archive replacement
prioritizing source-quality maintenance
```

### `enable_regulatory_watch`

Enables site-scoped regulatory queries for configured authorities.

Configured authorities:

```txt
SEC
CFTC
FCA
JFSA
Hong Kong SFC
MAS
OFAC / Treasury
```

Use when:

```txt
looking for warnings, enforcement actions, sanctions, license revocations, or registration removals
```

### `enable_site_seo_checks`

Enables public route, sitemap, and robots checks.

Use when:

```txt
checking public site uptime
checking /stats, /dead, /active, /methodology, /about, /donate
checking sitemap exchange-route count against canonical entity count
```

---

## 4. Recommended manual run profiles

### 4.1 Safe internal health run

Use defaults.

```txt
All external checks disabled.
```

Expected output:

```txt
data quality findings
watchlist-state findings
monitoring health summary
noise-control summary
```

### 4.2 Recent news scan

Enable:

```txt
enable_news_rss = true
enable_regulatory_watch = true
```

Recommended limits:

```txt
news_query_limit = 20
regulatory_query_limit = 25
```

Use this when searching for recent closure, hack, withdrawal suspension, regional exit, or regulatory stories.

### 4.3 Evidence maintenance scan

Enable:

```txt
enable_evidence_url_checks = true
```

Recommended limit:

```txt
evidence_url_check_limit = 50
```

Use this before evidence maintenance work.

### 4.4 Active status scan

Enable:

```txt
enable_domain_checks = true
```

Recommended limit:

```txt
domain_check_limit = 50
```

Use this to inspect active/limited/inactive records with official URLs.

### 4.5 Public site / SEO scan

Enable:

```txt
enable_site_seo_checks = true
```

Set site URL if needed:

```txt
site_url = https://hei.badjoke-lab.com
```

Use this after deployments, sitemap changes, route changes, or SEO work.

---

## 5. PR behavior

A monitoring PR is created only when meaningful visible findings or candidates exist.

Noise control suppresses repeated low-severity findings after their first appearance.

Behavior:

```txt
critical: visible every time
high: visible every time
medium: visible every time
low: visible first time, then suppressed if repeated
```

Suppressed findings are not deleted. They remain in JSON/state for audit, but they should not force noisy PRs.

---

## 6. Review rules

Monitoring PRs are not canonical update PRs.

Allowed monitoring outputs:

```txt
data-staging/monitoring/**
data-staging/watchlists/auto/**
data-staging/watchlists/resolution/**
data-staging/monitoring/state/latest-findings.json
```

Not allowed from monitoring:

```txt
data/entities.json
data/events.json
data/evidence.json
```

If canonical files change during monitoring, the workflow must fail.

---

## 7. Candidate handling

When a monitoring PR includes A candidates:

1. review source URLs;
2. check HEI scope;
3. check duplicates by slug/name/alias/domain;
4. decide whether to stage, hold, or resolve;
5. use the draft generator only as a starting point.

Draft generator:

```bash
npm run monitor:promote-candidate -- --candidate-id=auto_YYYYMMDD_001
npm run monitor:promote-candidate -- --candidate-name="ExampleEx"
npm run monitor:promote-candidate -- --dry-run=true
```

Draft output:

```txt
data-staging/manual/auto-draft-<slug>-YYYYMMDD.json
```

Drafts are explicitly not merge-ready. They require manual ID assignment, source review, archive URLs, date checks, and public-quality wording.

---

## 8. External publishing caution

Monitoring output may later support external publishing, such as weekly exchange watch or registry update posts.

Do not publish raw monitoring output directly.

Public-facing material must be:

```txt
reviewed
summarized
clearly labeled as confirmed / monitoring note / unverified
free of unsupported fraud/death/risk claims
```

---

## 9. Current final rule

```txt
Auto-discover.
Auto-report.
Auto-open PR.
Do not auto-canonicalize.
```

The monitoring system reduces manual search and maintenance work, but final editorial control stays outside the automated monitor.
