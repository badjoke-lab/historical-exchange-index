# HEI G-2 URL Safety Audit — 2026-07-06

Status: PASS  
Roadmap item: G-2 URL Safety Audit  
Specification: `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md`, Section 5  
Canonical count impact: none

## 1. Scope

The final audit covered:

```text
550 reviewed public entity records
550 generated /exchange/[slug]/ detail pages
7 official_url_status values
Methodology URL-safety explanation
About archive-safety explanation
Dead browse source contract
Active browse source contract
Entity Explorer source contract
```

URL status domain covered exactly:

```text
live_verified
live_unverified
dead_domain
redirected
repurposed
unsafe
unknown
```

## 2. Machine-readable policy

Source:

```text
config/url-display-policy.json
```

Policy:

```text
clickable original URL:
  live_verified
  live_unverified

plain-text original URL:
  dead_domain
  redirected
  repurposed
  unsafe
  unknown

archive-first:
  dead_domain
  redirected
  repurposed
  unsafe
```

The purpose is to preserve historical original URLs as facts without treating historical-domain availability as a safety endorsement.

## 3. Commands and gates

```text
npm run machine:build
npm run build
npm run url-safety:test
npm run url-safety:audit
npm run public:validate
```

Dedicated workflow:

```text
.github/workflows/url-safety-gate.yml
```

The workflow publishes a `url-safety-audit-report` artifact.

## 4. Checks

### Canonical/public record checks

- every public `official_url_status` is in the fixed enum domain;
- original URL parses as HTTP(S) where present;
- archive URL parses as HTTP(S) where present;
- original URL host is consistent with `official_domain_original`;
- every reviewed entity detail output exists.

### Generated URL block checks

For every generated exchange detail URL block:

- live verified/unverified original URLs may be clickable;
- dead-domain original URLs are not clickable in the URL block;
- redirected original URLs are not clickable in the URL block;
- repurposed original URLs are not clickable in the URL block;
- unsafe original URLs are not clickable in the URL block;
- unknown-status original URLs are not clickable in the URL block;
- historical original URL remains visible as text when policy requires plain text;
- archive URL remains a distinct archive link when present;
- archive-first guidance appears when dead-side status and URL policy require it;
- URL status is visible as text.

### Public explanation checks

- Methodology covers all seven URL status values;
- Methodology explains that old exchange domains are not necessarily safe or authoritative today;
- Methodology explains that original URLs may not always be clickable;
- About retains the archive-aware safety explanation.

### Browse/source contract checks

- Dead list does not directly link `official_url_original`;
- Active list does not directly link `official_url_original`;
- Entity Explorer does not directly link `official_url_original`;
- archive links remain available on browse surfaces;
- Active and Entity Explorer preserve textual URL-status labels.

## 5. Initial audit result and parser correction

The first full audit reported:

```text
critical: 12
high:     128
medium:   0
low:      0
```

All 140 initial findings had the same type:

```text
non_clickable_original_url_linked
```

Investigation showed that the first parser searched every `href` on the full exchange detail page. Evidence rows and other historical source sections may legitimately link to a URL equal to the entity's historical original URL. That is not the same as making the **Original URL field in the URL handling block** clickable.

The audit was corrected to scope clickability checks to the generated `URL handling` section only. The self-test fixture was also updated to verify that an unsafe Original URL link inside that section is still detected as critical.

This was an audit-parser correction, not a weakening of the URL safety policy.

## 6. Final audit result

Final report:

```text
Public entity detail pages: 550
URL status values:           7
Critical findings:           0
High findings:               0
Medium findings:             0
Low findings:                0
```

Final result:

```text
PASS
```

## 7. Completion gate

```text
critical URL-safety findings:      0  PASS
high URL-safety findings:          0  PASS
all URL-status enum values covered    PASS
representative public surfaces audited PASS
archive/original distinction verified  PASS
self-test:                         pass PASS
full public regression suite:      pass pending final PR-head workflow confirmation
```

G-2 is complete when the PR containing this report passes its final full GitHub workflow set and merges to `main`.

Next roadmap item after merge:

```text
G-3 Cross-surface Integration Audit
```
