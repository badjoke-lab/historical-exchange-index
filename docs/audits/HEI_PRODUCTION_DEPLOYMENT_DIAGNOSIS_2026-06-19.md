# HEI production deployment diagnosis — 2026-06-19

Live production verification completed successfully.

- HTML totals: 412 entities, 189 dead-side, 223 active-side
- Events: 687
- Evidence: 1594
- Public machine-readable files: HTTP 200
- Sitemap and robots: HTTP 200
- Legacy routes: HTTP 301 to the home page
- Deployed commit: cb3d80e4b5751537b7589d140821262a740bb491
- Schema version: 1.0.0
- Canonical-only data: true

The existing PR #393 build reached Cloudflare successfully. The earlier missing-file state was caused by deployment delay, not by a demonstrated repository build failure. The alternate build changes in this branch are not needed.
