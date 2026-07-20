# TEMPORARY: HEI UI remediation and core-development resume memo

> Temporary internal working document. This file is the source of truth for PR #685 while UI remediation is in progress.
>
> Do not treat this as public methodology or product documentation. Keep it until the UI work is merged and D-1000 BX20 has been safely resumed.

## 1. Current operating state

- Repository: `badjoke-lab/historical-exchange-index`
- UI remediation PR: **#685**
- Branch: `agent/all-page-visual-audit-20260720`
- PR state: draft
- Core work paused by this remediation: **D-1000 BX20 and later batches**
- Hard boundary: do not add or modify canonical entity/event/evidence records in PR #685.
- Resume rule: after UI closure, return directly to BX20 from a fresh branch based on post-UI `main`.

## 2. Confirmed production baseline

The first exhaustive production audit found:

- Public HTML routes: **1,775**
- English exchange dossiers: **873**
- Japanese exchange dossiers: **873**
- Non-200 routes: **1** — `/ja/donate/`
- Capture errors: **0**
- Desktop global horizontal overflow: **0**
- Direct-load initial-scroll failures: **0**
- Navigation scroll-retention failures: **1** — `/stats/`, `scrollY=1363`
- Artifact size: about **340 MB**

The original representative audit covered 18 states and confirmed:

- `stats-desktop`: page heading outside the initial viewport
- `stats-mobile`: page heading outside the initial viewport
- navigation to `/stats/`: retained `scrollY=1363`

The strengthened audit now covers **24 states / 48 screenshots**. Run `29728552354` successfully captured and uploaded the entire review package, then intentionally failed with **69 findings**, proving that the new gates reproduce the current H1, mobile-navigation, Stats, Related views, and Incidents defects.

## 3. Confirmed defect set

1. Stats controls and drilldowns preceded the actual page title.
2. Client navigation to Stats retained a 1,363px scroll offset.
3. Mobile global navigation pushed links and locale controls outside the viewport.
4. Incidents rendered about 485 records in one 95,000px+ page.
5. `/ja/donate/` returned 404.
6. Related views appeared before page titles on several routes.
7. The global brand was the H1 while page titles were H2.
8. Desktop header height changed across page families and locales.
9. Compare, Incidents, and Monthly were missing from representative screenshots.
10. Some mobile clipping was recorded but did not fail CI.
11. The screenshot workflow watched obsolete root paths instead of actual `src/**` UI files.
12. The public-navigation audit depended on the legacy global `nav` class.

## 4. Scope boundaries

### In scope

- Site chrome, responsive navigation, and locale access
- Page-specific H1 hierarchy
- Stats structure and drilldowns
- Related views placement
- Bounded, static Incidents pagination
- Japanese Donate route
- Compare, Incidents, and Monthly representative coverage
- Visual-audit gates, reports, and owner-review artifacts
- Sitemap and locale-route safety needed by the confirmed defects

### Out of scope

- New exchanges, events, or evidence
- Status changes to existing records
- Evidence-policy changes
- D-1000 BX20 data work
- Unrelated redesigns or product features

## 5. Status notation

- `[ ]` not started
- `[~]` implemented or actively changing, final CI/visual validation pending
- `[x]` implemented and validated by the relevant automated check
- `[!]` blocked, with the blocker recorded below

## 6. Master remediation checklist

### A. Stats structure and navigation

- [~] Render the Stats page H1 before all Stats Explorer controls.
- [~] Place `StatsExplorerDeepLinks` after the main Stats analysis.
- [~] Place `RelatedSurfaceLinks` after Stats content and drilldowns.
- [~] Replace the permanently expanded drilldown wall with grouped disclosure sections.
- [~] Preserve existing Stats Explorer URLs and query semantics.
- [~] Keep large groups collapsed by default, including mobile.
- [~] Verify direct `/stats/` load begins at `scrollY=0`.
- [~] Verify normal client navigation to `/stats/` begins at `scrollY=0`.
- [ ] Verify Back/Forward restoration remains browser-native.
- [ ] Verify explicit fragment navigation remains intact.
- [~] Verify the Stats H1 is visible below the site header on desktop/mobile.
- [~] Measure the new mobile Stats page height against the ~12,860px baseline.

### B. Mobile navigation and site chrome

- [~] Replace wrapped desktop links with a real compact mobile navigation.
- [~] Keep Home, Dead, Active, Explorer, Compare, Stats, Updates, Incidents, Methodology, About, and Donate reachable.
- [~] Keep English/Japanese switching reachable where both routes exist.
- [~] Mark the current route with `aria-current="page"`.
- [~] Expose menu state through `aria-expanded` and `aria-controls`.
- [~] Support keyboard activation and Escape-to-close.
- [~] Close the menu after selecting a destination.
- [~] Move focus to the first item when opened and return it to the trigger on Escape.
- [~] Keep a native `<details>/<summary>` fallback without JavaScript.
- [~] Verify no header interactive element is outside a 360px viewport.
- [~] Verify no new global horizontal scrolling.
- [~] Stabilize desktop header height across routes and locales.
- [~] Switch to compact navigation before desktop links wrap.
- [x] Preserve the public-navigation discovery contract through the global `nav` class.

### C. Page hierarchy and semantics

- [x] Replace the global brand H1 with a neutral branded home link.
- [~] Give every public route one meaningful page-specific H1.
- [~] Make English and Japanese exchange names the dossier H1.
- [~] Use H2 for major sections and H3 for subsections on modified pages.
- [~] Remove heading-level jumps on Home, Compare, Explorer, Incidents, Monthly, Donate, and Japanese dossier pages.
- [~] Move Related views below the Stats hero/content.
- [~] Move Related views below the Updates hero/content.
- [~] Move Related views below the Incidents hero/content.
- [ ] Audit every remaining `RelatedSurfaceLinks` use.

### D. Incidents rendering

- [~] Replace the unbounded list with **25 records per page**.
- [~] Generate crawlable static routes `/incidents/page/2/` through the final page.
- [~] Provide Previous/Next, page numbers, current-page state, and displayed record range.
- [~] Keep pagination usable without client-side JavaScript.
- [~] Preserve reverse-chronological event ordering.
- [~] Preserve event, entity, impact, status-effect, confidence, and evidence information.
- [~] Give every page its own canonical metadata.
- [~] Keep page 1 canonical only at `/incidents/`.
- [~] Add all page 2+ routes to the sitemap.
- [~] Verify page 2 and the final page return 200.
- [~] Verify the first page stays below the 16,000px audit ceiling.
- [~] Verify desktop and mobile pagination screenshots.

### E. Japanese Donate

- [~] Add a real `/ja/donate/` page.
- [~] Add Japanese title, description, canonical, Open Graph, and Twitter metadata.
- [~] Explain donation purpose and editorial independence in Japanese.
- [~] Reuse the exact English wallet component and payment destinations.
- [~] Link to English Donate and the existing contact/correction form.
- [~] Add English/Japanese hreflang relationships.
- [~] Localize header/footer Donate links by current locale.
- [~] Add `/ja/donate/` to the Japanese route guard and sitemap.
- [~] Verify English-to-Japanese and Japanese-to-English switching.
- [~] Verify `/ja/donate/` and every sitemap URL return 200.
- [ ] Do not invent refund/privacy/terms routes; link additional legal surfaces only if they actually exist in HEI.

### F. Compare and Monthly

- [x] Add Compare desktop/mobile to the representative matrix.
- [x] Add Monthly desktop/mobile to the representative matrix.
- [~] Validate Compare with two selected entities.
- [ ] Validate long exchange names, missing values, status badges, and evidence links.
- [~] Verify the Compare mobile layout does not clip.
- [~] Validate Monthly heading hierarchy and mobile ordering.
- [ ] Validate empty-month handling.
- [ ] Validate long event titles.
- [ ] Validate month navigation/canonical behavior if month navigation is introduced.

### G. Representative screenshot Action

- [x] Expand from 18 to **24 states**.
- [x] Capture untouched initial viewport and full-page screenshots.
- [x] Require exactly one visible H1.
- [x] Fail when the H1 is outside the initial viewport.
- [x] Fail when fixed/sticky UI overlaps the H1.
- [x] Fail when controls or Related views precede the H1.
- [x] Fail when normal navigation retains an invalid scroll offset.
- [x] Fail for clipped header interactive elements.
- [x] Fail when the mobile menu is missing.
- [x] Fail when the required mobile locale switcher is unavailable.
- [x] Add Incidents item-count, page-height, and pagination assertions.
- [x] Upload screenshots and reports even when the gate fails.
- [x] Watch actual `src/**` UI changes rather than obsolete root paths.
- [~] Run the final 24-state workflow until it has zero failures.

### H. Audit report usability

- [x] Add a GitHub Step Summary.
- [x] Record page/state, viewport, failure reason, scrollY, body height, H1 geometry, and overflow details.
- [x] Record matching viewport/full screenshot filenames.
- [x] Keep `manifest.json` and `contact-sheet.json` machine-readable.
- [x] Keep `contact-sheet.html` human-reviewable.
- [x] Keep `owner-review.json` separate from automated PASS/FAIL.
- [x] Distinguish viewport and full-page images.
- [x] Never convert automated rendering success into owner approval.
- [ ] Improve desktop/mobile adjacency in the contact sheet if the final review remains cumbersome.

### I. Sitemap and route safety

- [~] Add Incidents page 2+ and Japanese Donate to the sitemap.
- [~] Verify every sitemap URL has generated HTML.
- [~] Verify canonical targets exist.
- [~] Verify hreflang targets exist.
- [~] Verify locale-switch destinations exist.
- [x] Keep the exhaustive screenshot workflow manual because of cost.
- [x] Upload exhaustive artifacts even on audit failure.
- [ ] Add or strengthen a lightweight dedicated route gate if existing public validation does not cover the new routes sufficiently.

### J. Final regression closure

- [ ] Run representative screenshots on the final UI head.
- [ ] Resolve all representative failures.
- [ ] Review the final contact sheet manually.
- [ ] Run the exhaustive route audit after UI stabilization.
- [ ] Confirm all sitemap routes return 200.
- [ ] Confirm all 873 English dossiers remain structurally valid.
- [ ] Confirm all 873 Japanese dossiers remain structurally valid.
- [ ] Confirm no global horizontal overflow.
- [ ] Confirm no fixed/sticky H1 overlap.
- [ ] Run all normal HEI workflows.
- [ ] Confirm canonical record counts and machine-readable record counts are unchanged.
- [x] Keep PR #685 in draft state pending automated and owner review.

## 7. Required implementation order

1. Strengthen representative gates so defects reproduce as red. **Done.**
2. Fix Stats structure and scroll behavior. **Implemented; final validation pending.**
3. Implement mobile navigation and stabilize site chrome. **Implemented; final validation pending.**
4. Correct page H1 hierarchy. **Implemented across known templates; exhaustive validation pending.**
5. Move Related views below heroes. **Implemented for confirmed affected routes.**
6. Bound and paginate Incidents. **Implemented; build/route validation pending.**
7. Add `/ja/donate/`. **Implemented; build/route validation pending.**
8. Validate Compare and Monthly mobile behavior. **Next after current CI.**
9. Improve reports/contact sheet where required.
10. Confirm lightweight sitemap/locale-route gates.
11. Run representative workflow until green.
12. Run exhaustive route audit.
13. Run all standard HEI workflows.
14. Perform owner visual review.
15. Merge PR #685 only after closure.
16. Resume BX20 from fresh post-UI `main`.

## 8. UI closure conditions

UI remediation is complete only when:

- The confirmed defect checklist contains no unresolved `[ ]`, `[~]`, or `[!]` item.
- Representative screenshots cover 24 states and pass every automated gate.
- The owner reviews the final contact sheet; automated PASS is not approval.
- The exhaustive audit has no capture errors or unexpected non-200 routes.
- `/ja/donate/` returns 200.
- Stats opens at the top with its H1 visible.
- Mobile navigation exposes all destinations and locale controls.
- Incidents renders bounded static pages.
- Every public page has one meaningful H1.
- All normal workflows pass.
- Canonical entity/event/evidence data and counts remain unchanged.

## 9. Core-development resume checkpoint

### Last completed record batch before UI interruption

- Program: **D-1000**
- Last completed batch: **BX19**
- Merged PR: **#683**
- Main SHA immediately after BX19: `20090a6d14be85aa301f9bc8430d67f71dc4c7e4`

### Reviewed counts after BX19

- Entities: **873**
- Events: **1,004**
- Evidence: **3,505**
- English dossiers: **873**
- Japanese dossiers: **873**
- Sitemap routes at the interruption point: **1,770**
- ID conflicts: **0**
- Remaining to D-1000: **127 entities**

UI pagination and the Japanese Donate page intentionally increase non-record route counts. They must not change the entity, event, evidence, or dossier counts above.

### Identifier checkpoint

- Next entity ID at interruption: `hei_ex_000994`
- Next evidence ID at interruption: `hei_src_012202`

These are checkpoints, not unconditional reservations. Regenerate and verify them against post-UI `main` before BX20.

### Exact BX20 continuation

After PR #685 merges:

1. Fetch the new `main` and record the merge SHA.
2. Confirm no competing record-growth PR or branch has consumed IDs.
3. Regenerate entity/event/evidence and dossier counts.
4. Regenerate the next entity and evidence IDs.
5. Confirm machine-readable, monitoring, built output, sitemap, English dossier, and Japanese dossier counts agree.
6. Create a fresh BX20 branch from post-UI `main`.
7. Continue the existing evidence/status policy without lowering standards.
8. Copy this checkpoint into the BX20 PR description.
9. Delete this temporary memo in the BX20 PR only after the handoff is preserved.

### Forbidden resume behavior

- Do not restart BX19.
- Do not skip to BX21.
- Do not assume checkpoint IDs remain free.
- Do not mix BX20 records into PR #685.
- Do not start another large feature before BX20 unless the user changes priority.

## 10. Temporary-file lifecycle

Delete this file only after:

1. PR #685 has merged and final Action/contact-sheet references remain in PR history; and
2. a fresh BX20 branch exists from post-UI `main`, with regenerated counts and IDs recorded in its work log or PR description.

## 11. Working rules

For every meaningful PR #685 change:

1. Read this memo before selecting the next task.
2. Update affected checklist items and the progress log.
3. Record scope or implementation decisions.
4. Do not mark `[x]` from code changes alone.
5. Keep canonical record files out of the diff.
6. Keep the PR draft until all closure conditions pass.

## 12. Decision and progress log

### 2026-07-20 — memo created

- Established this file as PR #685's temporary source of truth.
- Preserved the production-audit baseline and BX20 checkpoint.

### 2026-07-20 — representative audit strengthened

- Expanded the matrix to 24 states and 48 screenshots.
- Added H1, mobile navigation, locale, clipping, scroll, and Incidents gates.
- Fixed workflow path filters to watch `src/**`.
- Run `29728552354` captured all states and reported 69 expected defects while still uploading the review package.

### 2026-07-20 — Stats, chrome, hierarchy, and Related views implemented

- Reordered Stats content and converted drilldowns to disclosures.
- Added responsive desktop/mobile navigation with keyboard behavior and locale access.
- Removed the global brand H1 and promoted page-specific titles.
- Moved Related views below Stats, Updates, and Incidents content.
- Preserved the existing public-navigation source contract through a global `nav` class.

### 2026-07-20 — Incidents and Japanese Donate implemented

- Replaced the 485-item Incidents page with 25-item static pages.
- Added page metadata, canonical URLs, pagination controls, and sitemap routes.
- Added `/ja/donate/`, Japanese metadata, shared wallet destinations, editorial-independence copy, locale switching, and sitemap registration.
- Final CI, screenshot, and exhaustive validation remain pending; none of these implementation items is considered closed until those checks pass.
