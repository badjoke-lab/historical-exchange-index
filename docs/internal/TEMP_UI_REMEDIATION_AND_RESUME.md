# TEMPORARY: HEI UI remediation and core-development resume memo

> Temporary internal working document. This file is the source of truth for PR #685 while the UI remediation is in progress.
>
> Do not treat this as public methodology or product documentation. Keep it in the repository until the UI work is merged and the core record-growth work has been safely resumed.

## 1. Current operating state

- Repository: `badjoke-lab/historical-exchange-index`
- UI remediation PR: **#685**
- UI remediation branch: `agent/all-page-visual-audit-20260720`
- PR state: draft
- Work blocked by this remediation: **D-1000 BX20 and later record-growth batches**
- Rule: do not mix canonical entity/event/evidence changes into PR #685.

The UI remediation is a temporary interruption of the record-growth sequence. After this document's closure conditions are met, development must return directly to BX20 rather than starting a new unrelated initiative.

## 2. Why this work exists

The production-wide visual audit and the permanent representative-page screenshot audit confirmed several structural UI defects. The most serious confirmed defects are:

1. `/stats/` renders a large filter/deep-link panel before the actual page hero.
2. Client navigation to `/stats/` retains `scrollY=1363` and lands with the title clipped.
3. The mobile global navigation pushes several links and the locale switcher outside the viewport.
4. `/incidents/` renders about 485 entries in one unbounded page with a document height around 95,333px.
5. `/ja/donate/` is present in the route/sitemap surface but returns 404.
6. Related-view navigation appears before the page title on several routes.
7. The global site name is the H1 on nearly every page while the actual page title is an H2.
8. Desktop header height changes between page families and locales.
9. The original representative screenshot matrix omitted Compare, Incidents, and Monthly.
10. Some detected mobile clipping was recorded but did not fail the Action.

## 3. Audit baseline that must remain reproducible

### Exhaustive production audit

- Public HTML routes discovered: **1,775**
- English exchange dossier routes: **873**
- Japanese exchange dossier routes: **873**
- Non-200 routes: **1** (`/ja/donate/`)
- Capture errors: **0**
- Desktop global horizontal overflow failures: **0**
- Direct-load initial-scroll failures: **0**
- Navigation scroll-retention failures: **1** (`/stats/`, `scrollY=1363`)
- Artifact size: about **340 MB**

### Representative-page audit

Original matrix:

- 9 representative templates
- desktop/mobile
- 18 states
- untouched initial viewport plus full-page capture

Confirmed failures:

- `stats-desktop`: primary page heading not visible in the initial viewport
- `stats-mobile`: primary page heading not visible in the initial viewport
- navigation to `/stats/`: retained `scrollY=1363`

## 4. Scope boundaries

### In scope

- Global site chrome and navigation
- Page-title hierarchy
- Stats page structure and filters
- Related-view placement
- Incidents list bounding/pagination
- Japanese Donate route
- Compare, Incidents, and Monthly representative coverage
- Visual-audit failure gates and review artifacts
- Sitemap/route checks needed to prevent another published 404

### Out of scope

- New canonical exchanges
- New canonical events
- New evidence records
- Status changes to existing records
- Evidence-policy changes
- D-1000 BX20 data work
- Unrelated design redesigns
- New product features unrelated to the confirmed defects

## 5. Master remediation checklist

Status values:

- `[ ]` not started
- `[~]` in progress
- `[x]` completed and locally/CI validated
- `[!]` blocked, with the blocker recorded in the decision log

### A. Stats structure and navigation

- [ ] Move the Stats page hero/title before all Stats Explorer controls.
- [ ] Move `RelatedSurfaceLinks` below the page-specific content hierarchy.
- [ ] Replace the permanently expanded Stats Explorer wall with grouped disclosure sections.
- [ ] Keep all existing Stats deep links and URL semantics usable.
- [ ] Default the large filter groups to collapsed on mobile.
- [ ] Ensure direct load of `/stats/` begins at `scrollY=0`.
- [ ] Ensure normal client navigation to `/stats/` begins at `scrollY=0`.
- [ ] Preserve expected browser restoration for Back/Forward navigation.
- [ ] Preserve explicit anchor navigation when a URL contains a fragment.
- [ ] Confirm the Stats H1 is fully visible below the site header on desktop and mobile.
- [ ] Reduce the mobile Stats page height substantially from the current ~12,860px baseline.

### B. Mobile navigation and site chrome

- [ ] Add a real mobile navigation mechanism rather than relying on wrapped desktop links.
- [ ] Keep Home, Dead, Active, Explorer, Compare, Stats, Updates, Incidents, Methodology, About, and Donate reachable.
- [ ] Keep English/Japanese locale switching reachable.
- [ ] Mark the current route with `aria-current="page"`.
- [ ] Expose menu state with `aria-expanded`.
- [ ] Support keyboard activation and Escape-to-close.
- [ ] Close the menu after a destination is selected.
- [ ] Prevent focus from becoming lost behind an open menu.
- [ ] Provide a no-JavaScript-accessible fallback where practical.
- [ ] Ensure no header/nav interactive element is outside a 360px viewport.
- [ ] Ensure the page itself never gains global horizontal scrolling.
- [ ] Stabilize desktop header height across page families.
- [ ] Stabilize header height between English and Japanese pages.
- [ ] Switch to the compact/mobile shell before desktop navigation begins wrapping.

### C. Page hierarchy and semantics

- [ ] Change the site brand in `SiteChrome` from an H1 to a neutral branded link/container.
- [ ] Give every public page one page-specific H1.
- [ ] Make exchange names the H1 on dossier pages.
- [ ] Use H2 for major page sections and H3 for their subsections.
- [ ] Remove avoidable heading-level jumps.
- [ ] Place Related views after the page hero on Stats.
- [ ] Place Related views after the page hero on Updates.
- [ ] Place Related views after the page hero on Incidents.
- [ ] Audit all other `RelatedSurfaceLinks` uses and apply the same rule.

### D. Incidents rendering

- [ ] Replace the single unbounded Incidents list with bounded rendering.
- [ ] Use a stable page size, initially 20 or 25 records.
- [ ] Provide crawlable URL-based pagination.
- [ ] Provide Previous/Next and useful page-position information.
- [ ] Keep all incidents reachable without requiring client-side JavaScript.
- [ ] Preserve chronological ordering.
- [ ] Preserve existing incident metadata and evidence links.
- [ ] Generate valid canonical metadata for paginated pages.
- [ ] Prevent duplicate aliases for page 1.
- [ ] Confirm page 2 and the final page return 200.
- [ ] Confirm the initial Incidents document height is bounded.
- [ ] Confirm mobile Incidents remains usable.

### E. Japanese Donate route

- [ ] Add a real `/ja/donate/` route rather than leaving a sitemap-visible 404.
- [ ] Provide Japanese metadata.
- [ ] Provide the Japanese explanation of donation purpose and editorial independence.
- [ ] Keep the payment destination consistent with the English page.
- [ ] Link to the applicable contact, refund, privacy, terms, and disclosure surfaces.
- [ ] Add correct canonical and hreflang relationships.
- [ ] Confirm English-to-Japanese and Japanese-to-English switching works.
- [ ] Confirm every sitemap URL returns 200 after the change.

### F. Compare and Monthly mobile behavior

- [ ] Add Compare desktop/mobile to the representative visual matrix.
- [ ] Add Monthly desktop/mobile to the representative visual matrix.
- [ ] Validate Compare controls before and after two entities are selected.
- [ ] Validate long exchange names, missing values, status badges, and evidence links.
- [ ] Use a deliberate mobile comparison layout rather than accidental clipping.
- [ ] Validate Monthly year/month navigation.
- [ ] Validate empty-month handling if applicable.
- [ ] Validate long event titles and mobile chronological order.
- [ ] Validate Previous/Next month navigation and canonical metadata.

### G. Representative screenshot Action

- [ ] Expand the matrix from 18 to **24 states** by adding Compare, Incidents, and Monthly for desktop/mobile.
- [ ] Continue to capture untouched initial viewport screenshots.
- [ ] Continue to capture full-page screenshots.
- [ ] Fail when the primary H1 is absent.
- [ ] Fail when more than one H1 exists.
- [ ] Fail when the H1 is outside the initial viewport.
- [ ] Fail when the H1 is hidden by a fixed/sticky element.
- [ ] Fail when page controls or Related views incorrectly precede the H1.
- [ ] Fail when normal navigation retains a nonzero scroll position beyond tolerance.
- [ ] Add `headerClippedElements` failure output.
- [ ] Add `inaccessibleNavigationItems` failure output.
- [ ] Add `missingMobileMenu` failure output where applicable.
- [ ] Add `localeSwitcherUnavailable` failure output.
- [ ] Add an Incidents-specific bounded-list/pagination assertion.
- [ ] Confirm a failing audit still uploads all screenshots and reports.

### H. Audit report usability

- [ ] Add a concise GitHub Step Summary.
- [ ] Include page/state name, viewport, failure reason, scrollY, body height, H1 geometry, and overflowed element names.
- [ ] Include the matching screenshot filename for each failure.
- [ ] Keep `manifest.json` machine-readable.
- [ ] Keep `contact-sheet.html` human-reviewable.
- [ ] Keep `contact-sheet.json` machine-readable.
- [ ] Keep `owner-review.json` separate from automated PASS/FAIL.
- [ ] Place desktop/mobile states next to each other in the contact sheet.
- [ ] Clearly distinguish initial-viewport and full-page images.
- [ ] Never record automated capture success as owner approval.

### I. Sitemap and route safety

- [ ] Add or strengthen a lightweight normal-CI check for sitemap routes.
- [ ] Fail when a sitemap URL lacks a generated HTML route.
- [ ] Fail when a canonical URL points to a missing route.
- [ ] Fail when an hreflang target points to a missing route.
- [ ] Fail when an internal locale switch points to a missing route.
- [ ] Keep the exhaustive screenshot workflow manual because of its cost.
- [ ] Keep exhaustive artifacts available even when an audit fails.

### J. Final regression closure

- [ ] Run the 24-state representative screenshot workflow on the final UI head.
- [ ] Resolve all automated representative failures.
- [ ] Review the final representative contact sheet manually.
- [ ] Run the exhaustive 1,775+ route audit after the UI stabilizes.
- [ ] Confirm all sitemap routes return 200.
- [ ] Confirm all 873 English dossier pages remain structurally valid.
- [ ] Confirm all 873 Japanese dossier pages remain structurally valid.
- [ ] Confirm no new global horizontal overflow.
- [ ] Confirm no new fixed/sticky H1 overlap.
- [ ] Run every existing HEI validation workflow.
- [ ] Confirm record counts and machine-readable outputs remain unchanged by the UI-only work.
- [ ] Keep PR #685 draft until automated checks and owner visual review are complete.

## 6. Required implementation order

Do not randomly pick tasks from the checklist. Use this order unless the decision log explains a dependency-driven exception.

1. Strengthen the representative test matrix and failure gates so the current defects are reproducibly red.
2. Fix Stats structure and navigation scroll behavior.
3. Implement the mobile navigation and stabilize site chrome.
4. Correct the global/page H1 hierarchy.
5. Move Related views below each page hero.
6. Bound and paginate Incidents.
7. Add `/ja/donate/`.
8. Validate and repair Compare and Monthly mobile behavior.
9. Improve Action summaries and contact-sheet review output.
10. Add the lightweight sitemap/locale route gate.
11. Run the representative workflow until green.
12. Run the exhaustive route audit.
13. Run all standard HEI workflows.
14. Perform owner visual review.
15. Merge PR #685 only after all closure conditions pass.
16. Resume BX20 from a fresh branch based on the new `main`.

## 7. UI remediation closure conditions

The UI remediation is complete only when all of the following are true:

- The master checklist has no `[ ]`, `[~]`, or `[!]` item that affects the confirmed defect set.
- Representative screenshots cover 24 states and pass all automated gates.
- The owner has reviewed the final contact sheet; automated PASS is not owner approval.
- The exhaustive route audit completes without capture errors or unexpected non-200 routes.
- `/ja/donate/` returns 200.
- Navigation to `/stats/` starts at the top and shows the H1.
- Mobile navigation exposes every top-level destination and the locale switcher.
- Incidents no longer renders hundreds of entries in one unbounded page.
- Every page has one meaningful page-specific H1.
- All normal HEI workflows pass.
- Canonical record data and record counts have not changed in PR #685.

## 8. Core-development resume checkpoint

This section prevents the UI interruption from losing the record-growth sequence.

### Last completed record batch before the UI interruption

- Program: **D-1000**
- Last completed batch: **BX19**
- Merged PR: **#683**
- Main SHA immediately after BX19: `20090a6d14be85aa301f9bc8430d67f71dc4c7e4`

### Reviewed public counts after BX19

- Entities: **873**
- Events: **1,004**
- Evidence: **3,505**
- English dossiers: **873**
- Japanese dossiers: **873**
- Sitemap routes: **1,770**
- ID conflicts: **0**
- Remaining to D-1000: **127 entities**

### Next reserved identifiers at the interruption point

- Next entity ID: `hei_ex_000994`
- Next evidence ID: `hei_src_012202`

These identifiers are a checkpoint, not an unconditional reservation. Before BX20 begins, regenerate and verify the next IDs against the post-merge `main` branch so concurrent work cannot create a collision.

### Exact development continuation

After PR #685 is merged:

1. Fetch the new `main` and verify the merge SHA.
2. Confirm there are no open record-growth PRs or conflicting branches.
3. Regenerate entity/event/evidence counts from the repository.
4. Regenerate the next available entity and evidence IDs.
5. Confirm the machine-readable, monitoring, built-output, sitemap, English dossier, and Japanese dossier counts agree.
6. Start **D-1000 BX20** on a fresh branch.
7. Continue the existing reviewed-batch policy; do not lower evidence or status standards to compensate for the UI delay.
8. Update the D-1000 progress record with the post-BX20 counts.

### Forbidden resume behavior

- Do not restart at BX19.
- Do not skip directly to BX21.
- Do not assume the checkpoint IDs are still free without validation.
- Do not mix BX20 into PR #685.
- Do not begin another large feature before BX20 unless the user explicitly changes priority.

## 9. Temporary-file lifecycle

This file must remain in the branch and merged repository while it is needed as the active UI-remediation and resume handoff.

Delete this file only after both conditions are met:

1. PR #685 has merged and its final workflow/contact-sheet references are preserved in the PR history; and
2. A fresh BX20 branch has been created from the post-UI `main`, with regenerated counts and next IDs recorded in that branch's work log or PR description.

The preferred deletion point is the first BX20 PR, after the resume checkpoint has been copied into the BX20 PR description. This makes the file genuinely temporary without losing the handoff.

## 10. Working rules for every subsequent UI commit

For every meaningful implementation commit on PR #685:

1. Read this file before selecting the next task.
2. Update the affected checklist items in the same commit or the immediately following bookkeeping commit.
3. Add a dated decision-log entry for any scope change, changed implementation choice, or blocker.
4. Record the validation performed; do not mark `[x]` based on code changes alone.
5. Keep canonical record files out of the diff.
6. Keep the PR draft until the closure conditions are satisfied.

## 11. Decision and progress log

### 2026-07-20 — memo created

- Established this file as the temporary source of truth for PR #685.
- Preserved the confirmed production-audit baseline.
- Converted the remediation plan into executable checklist items.
- Recorded the exact D-1000 BX20 resume checkpoint.
- No UI implementation item is marked complete yet; existing audit automation alone does not close any product defect.
