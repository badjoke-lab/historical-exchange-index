# Monitoring workflow dispatch input safety

Status: workflow hardening note  
Scope: `.github/workflows/hei-monitoring.yml`

---

## Purpose

The HEI monitoring workflow supports both scheduled runs and manual `workflow_dispatch` runs.

Manual runs expose optional inputs for external checks:

```txt
enable_external_lists
enable_news_rss
enable_domain_checks
enable_evidence_url_checks
enable_regulatory_watch
enable_site_seo_checks
site_url
news_query_limit
regulatory_query_limit
domain_check_limit
evidence_url_check_limit
```

Scheduled runs do not provide these input values.

---

## Rule

Workflow expressions must read manual inputs through:

```txt
github.event.inputs.<name>
```

and provide safe defaults:

```txt
${{ github.event.inputs.enable_news_rss || 'false' }}
```

This keeps scheduled runs safe and avoids relying on the shorthand `inputs` context where scheduled-event behavior may be less obvious.

---

## Default scheduled behavior

Scheduled runs keep every optional external fetch disabled:

```txt
HEI_MONITORING_ENABLE_REMOTE_LISTS=0
HEI_MONITORING_ENABLE_NEWS_RSS=0
HEI_MONITORING_ENABLE_DOMAIN_CHECKS=0
HEI_MONITORING_ENABLE_EVIDENCE_URL_CHECKS=0
HEI_MONITORING_ENABLE_REGULATORY_WATCH=0
HEI_MONITORING_ENABLE_SITE_SEO_CHECKS=0
```

This means the scheduled monitor remains internal and low-cost by default.

---

## Manual behavior

Manual workflow runs can explicitly enable one or more external checks. Boolean inputs are converted into the `0`/`1` environment flags used by the monitoring scripts.

---

## Final rule

```txt
Scheduled: safe defaults, no optional external fetching.
Manual: explicit external checks only when selected.
```
