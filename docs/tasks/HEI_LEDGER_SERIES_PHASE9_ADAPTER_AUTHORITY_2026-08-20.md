# HEI Ledger Series Phase 9 Adapter Authority

Status: active after merge  
Date: 2026-08-20  
Coordination: Issue #780

## Why this authority exists

Issue #780 coordinates the cross-registry Ledger Series Phase 9 work but explicitly does not authorize HEI runtime or canonical changes. This document and `config/ledger-series-phase9-adapter-authority.json` are the HEI-local reviewed authority required before the final Stage 3 adapter is implemented.

## Native source of truth

The adapter must reuse the existing reviewed HEI machine-readable surfaces:

- `/version.json`
- `/data/manifest.json`
- `/data/exchanges/index.json`
- `/data/exchanges/{slug}.json`

The native record-level bundle already contains the reviewed exchange entity, events, evidence, explicit predecessor/successor IDs, confidence, last verification, counts, human URL and machine URL. The adapter must not create a second canonical model.

## Authorized Series output

Only the following new public machine-readable routes are authorized:

- `/data/series/registry.json`
- `/data/series/index.json`
- `/data/series/records/{slug}.json`

The descriptor must point to existing public research surfaces:

- search/explorer: `/explore/`
- compare: `/compare/`
- stats: `/stats/`

No new HTML route is authorized.

## Stage 3 mapping rules

- one Series envelope per current reviewed native exchange bundle;
- record count is derived dynamically from the native record-level index;
- stable global key: `historical-exchange-index:exchange_entity:<native-id>`;
- preserve the complete native bundle losslessly under the Series envelope;
- expose native events and evidence without reinterpretation;
- preserve native explicit predecessor/successor fields as native facts inside the lossless payload;
- do not promote them into typed Series relationships during Stage 3;
- `relationships` in the common envelope remains empty until the separately reviewed Phase 9 relationship stage;
- preserve unknowns as unknowns;
- preserve build/revision/provenance metadata from the native public layer;
- never infer lifecycle facts, safety, ranking, quality or investment meaning.

## Hard boundaries

This authority does not authorize:

- canonical entity/event/evidence changes;
- reviewed record-bundle changes;
- data-staging/candidate publication;
- monitoring publication;
- schema/taxonomy changes;
- Explorer query/behavior changes;
- Compare behavior changes;
- Stats behavior changes;
- UI/CSS changes;
- DNS or Cloudflare project configuration changes;
- AI-generated canonical facts;
- typed relationship inference;
- changes to the localization roadmap.

## Concurrent work protection

Open PR #777 and #779 are independent vertical work. The Phase 9 adapter task must not modify, retarget, rebase, merge, or depend on them. Because the adapter count is derived from the native record-level index at build time, either vertical PR may merge later without requiring a hard-coded Series count change.

## Validation and deployment gate

Implementation must follow the repository gate:

1. branch from reviewed main after this authority merges;
2. implement only the bounded adapter/output/validation scope;
3. run existing relevant HEI CI and machine-readable/record-level/public-output validations;
4. require exact final-head CI success before merge;
5. merge normally;
6. wait until production `/version.json` reports the exact merged main commit;
7. compare the production Series descriptor, index and every record envelope against the exact-main build;
8. verify representative `/explore/`, `/compare/`, `/stats/` and exchange dossier routes;
9. record acceptance in Issue #780.

Preview deployment is not required for the authority-only PR. For the adapter implementation, automatic Cloudflare previews remain disabled under the deployment policy; production verification occurs only after merge and exact-main convergence.

## Completion

This authority is exhausted when the HEI Stage 3 adapter is accepted in production and Issue #780 records HEI as accepted. It does not authorize automatic continuation into Phase 9 Stage 4 or relationship work.
