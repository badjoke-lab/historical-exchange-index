# HEI G-5 Production Verification — 2026-07-07

Status: PASS  
Roadmap item: G-5 Production Integration and Verification  
Production origin: `https://hei.badjoke-lab.com`  
Canonical count impact: none

## 1. Commit propagation check

Expected production commit:

```text
daed55da7673dbd16faf8c69bcd2274a546c463f
```

Deployed production commit:

```text
daed55da7673dbd16faf8c69bcd2274a546c463f
```

Result:

```text
MATCH
```

The production `/version.json` check passed on the first attempt. Route-level diagnosis was performed only after deployed commit equality was confirmed.

## 2. Machine-readable production verification

Existing checker:

```text
scripts/check-machine-readable-production.mjs
```

Result:

```text
records:           550
events:            1004
evidence:          2621
update feed items: 2
result:             PASS
```

The production machine-readable layer verified:

- version schema and project identity;
- registry family/type;
- canonical origin;
- verification marker;
- main branch deployment;
- expected commit equality;
- record counts and active/dead breakdown agreement;
- manifest/version agreement;
- exact public safety flags;
- exact public file map;
- canonical-only public datasets;
- generated timestamp agreement;
- record_count and records.length agreement;
- canonical page URL presence;
- reviewed JSON/RSS feed contract;
- route discovery in manifest, llms.txt, and ai.txt;
- AI discovery safety statement.

## 3. Production integration verifier

New verifier:

```text
scripts/verify-production-integration.mjs
```

Contract:

```text
config/production-verification-contract.json
```

Dedicated workflow:

```text
.github/workflows/production-verification-gate.yml
```

Final workflow artifact:

```text
production-verification-report
```

Final checked timestamp recorded by the verification artifact:

```text
2026-07-07T02:25:05.406Z
```

## 4. Core HTML route verification

All 12 core routes returned successful HTML responses with titles and canonical links:

```text
/
/dead/
/active/
/explore/
/stats/
/quality/
/updates/
/incidents/
/monthly/
/methodology/
/about/
/donate/
```

Result:

```text
12 / 12 PASS
```

## 5. Explorer query verification

Representative query routes verified:

```text
/explore/?view=entities&status=dead
/explore/?view=events&event_type=hack
```

Both returned the Explorer surface and canonicalized to:

```text
https://hei.badjoke-lab.com/explore/
```

Result:

```text
2 / 2 PASS
```

## 6. Representative deep-link verification

Verified representative cross-surface query shapes:

```text
/explore/?view=entities&status=dead&status=merged&archive_available=true
/explore/?view=events&event_type=hack
/explore/?view=events&date_from=2026-06-01&date_to=2026-06-30
```

These cover:

- Entity compound query with repeated status values plus archive availability;
- incident/event-type handoff;
- monthly date-range handoff.

All three returned the Explorer surface and canonicalized to the Explorer base route.

Result:

```text
3 / 3 PASS
```

## 7. Public machine file verification

Verified 11 public files:

```text
/version.json
/data/manifest.json
/data/entities.json
/data/events.json
/data/evidence.json
/feeds/updates.json
/feeds/updates.xml
/llms.txt
/ai.txt
/sitemap.xml
/robots.txt
```

All returned successful responses with expected content-type families and non-empty bodies.

Result:

```text
11 / 11 PASS
```

## 8. Crawl contract verification

Production sitemap:

```text
URL count:            562
Duplicate URLs:       0
Explorer base count:  1
Query variants:       0
```

Production robots contract:

```text
User-agent: *         present
Allow: /              present
Canonical Sitemap:    present
```

Result:

```text
PASS
```

## 9. Representative exchange dossier

The production public entity dataset was used to select a representative record.

Verified dossier:

```text
Entity ID: hei_ex_000001
Slug:      mt-gox
Route:     /exchange/mt-gox/
Canonical: https://hei.badjoke-lab.com/exchange/mt-gox/
```

The page returned successful HTML and contained the reviewed canonical entity name.

Result:

```text
PASS
```

## 10. Initial parser correction

The first integration-verifier run correctly confirmed:

- deployed commit equality;
- machine-readable production layer success.

The integration verifier then reported:

```text
robots.txt missing User-agent: *
```

Investigation showed this was a verifier parser issue: robots directives are case-insensitive, while the first check used a case-sensitive string comparison. The verifier was corrected to parse `User-agent`, `Allow`, and `Sitemap` directives case-insensitively.

This was a verifier correction, not a production crawl-policy change.

After correction, the production integration gate passed in full.

## 11. Final result

```text
Expected commit:          daed55da7673dbd16faf8c69bcd2274a546c463f
Deployed commit:          daed55da7673dbd16faf8c69bcd2274a546c463f
Commit propagation:       MATCH
Machine layer:            PASS
Core routes:              12 / 12 PASS
Explorer queries:          2 / 2 PASS
Representative deep links: 3 / 3 PASS
Machine files:            11 / 11 PASS
Sitemap URLs:             562 PASS
Robots contract:          PASS
Representative dossier:   PASS
Overall result:           PASS
```

## 12. Known limitations

This verification proves the deployed integration contract at the checked timestamp. It does not replace:

- browser-based visual regression testing across every device/browser;
- external search-engine indexing confirmation;
- Cloudflare Dashboard configuration review;
- continuous uptime monitoring;
- exhaustive query-state testing for every Explorer parameter combination.

Those are separate operational concerns and are not blockers for G-5 completion.

## 13. Completion gate

```text
expected/deployed commit equality: PASS
machine-readable production check: PASS
core route verification:           PASS
Explorer query verification:       PASS
deep-link verification:            PASS
machine file verification:         PASS
sitemap/robots verification:        PASS
representative dossier:             PASS
production report recorded:         PASS
```

G-5 is complete when the PR containing this report passes its final PR-head workflow set and merges to `main`.

Next roadmap item after merge:

```text
G-6 Maintainer Runbook and Recovery Validation
```

## 14. Post-G5 production baseline refresh

After PR #556 merged, the production deployment advanced normally to the G-5 merge commit:

```text
846533b6981b0e4ee0117a25987d10eee13411f3
```

During the G-6 final regression cycle, `config/production-verification-contract.json` was advanced to this deployed baseline and the dedicated production verification gate was rerun.

Refresh result:

```text
Expected commit:          846533b6981b0e4ee0117a25987d10eee13411f3
Deployed commit:          846533b6981b0e4ee0117a25987d10eee13411f3
Commit propagation:       MATCH
Machine layer:            PASS
Core routes:              12 / 12 PASS
Explorer queries:          2 / 2 PASS
Representative deep links: 3 / 3 PASS
Machine files:            11 / 11 PASS
Sitemap URLs:             562 PASS
Robots contract:          PASS
Representative dossier:   PASS
Overall result:           PASS
```

This refresh preserves the original G-5 verification record while moving the live production verification baseline to the actual deployed G-5 merge commit.
