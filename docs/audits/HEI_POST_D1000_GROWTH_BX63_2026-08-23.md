# HEI Post-D-1000 Growth — BX63

Date: 2026-08-23  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX63 promotes the long-pending GBX Digital Asset Exchange candidate into one independently reviewed historical HEI record.

Added reviewed entity candidate:

```text
Global Blockchain Exchange (GBX)  acquired / cex / Gibraltar
```

Added lifecycle events:

```text
2018-07-01  launched
2021-01-29  acquired
2021-01-29  shutdown_effective
```

Added evidence: 6

## Why this candidate now

The old `hei_unadded_0992` backlog row remained research-only even though GBX has unusually strong historical source coverage. Current review recovered first-party launch/acquisition/closure material plus a Government of Gibraltar licensing release. This makes GBX materially stronger than thin active-only backlog rows and fits HEI's event-backed historical priority.

## Evidence standard

Reviewed sources establish:

- GSX Group states that the GBX-DAX Digital Asset Exchange launched in July 2018.
- The Government of Gibraltar identified Gibraltar Blockchain Exchange as the Digital Asset Exchange subsidiary of Gibraltar Stock Exchange and recorded its DLT licence in November 2018.
- GBX / GSX Group announced the planned sale to Mine Digital on 2021-01-13.
- GBX / GSX Group confirmed completion of that sale on 2021-01-29.
- First-party closure FAQs state that exchange trading stopped on 2021-01-20 and that GBX-DAX, withdrawals, and customer accounts closed on 2021-01-29.
- Remaining customer balances entered the Mine Digital transition process rather than remaining on a continuing GBX platform.

## Status handling

BX63 uses:

```text
status: acquired
death_reason: acquisition
death_date: 2021-01-29
confidence: high
```

The acquisition and platform closure occurred together. Mine Digital explicitly did not continue operations under the GBX banner or use GBX platform technology. HEI therefore treats 2021-01-29 as the terminal date of the independent GBX exchange identity.

The record does not classify the end state as insolvency, bankruptcy, hack, fraud, scam/rug, regulation, or voluntary shutdown.

## Launch-date handling

The reviewed first-party material establishes a July 2018 launch but not an exact launch day. HEI therefore normalizes the month-level date to:

```text
2018-07-01
```

This is explicitly documented as a month-level approximation and is not presented as a sourced exact day.

## Identity and jurisdiction handling

- `Global Blockchain Exchange` is the canonical name.
- `GBX`, `Gibraltar Blockchain Exchange`, `GBX-DAX`, and `GBX Digital Asset Exchange` are aliases.
- The exchange identity originated in Gibraltar and was part of the GSX Group.
- A later operating-company move to Estonia does not rewrite the historical origin field.
- Mine Digital is named as acquirer in events/notes but no successor relationship is created without a separately reviewed Mine Digital canonical entity.

## URL safety handling

The original `gbx.global` domain still resolves. It preserves historical sale/closure pages, but the current homepage also mixes in unrelated post-closure editorial/affiliate material. BX63 therefore uses:

```text
official_url_status: repurposed
```

The domain is retained for historical identity and archive discovery, not treated as a current exchange service endpoint.

## Identifier allocation

```text
Entity:   hei_ex_001159
Events:   hei_ev_010128 through hei_ev_010130
Evidence: hei_src_012593 through hei_src_012598
```

Repository and open-PR searches found the identifiers and `gbx` slug unused before branch creation.

## Count impact

Deterministic delta from this batch:

```text
entities: +1
events:   +3
evidence: +6
```

Exact reviewed totals must be derived by the repository's reviewed-bundle aggregation/count-semantics path rather than by copying stale checkpoint totals, because lifecycle work has continued since the last post-D-1000 count memo.

## L-2 relationship

This batch does not change the localization decision. L-2 remains `HOLD / evidence capture`; no third language is authorized.

## Coordination boundary

BX63 changes one canonical exchange bundle plus its audit/backlog documentation. It does not alter:

- Language Selection;
- localization breadth;
- Ledger Series Phase 9 implementation;
- monitoring configuration;
- Cloudflare configuration.

Open horizontal PR #809 remains a separate verifier/workflow/docs lane and is not used as authority for this canonical addition.

## Completion condition

BX63 is complete only after record validation, duplicate/overlap checks, ID-collision checks, country/origin checks, URL-safety checks, machine/public consistency, localization checks, count semantics, merge to `main`, and normal post-merge production verification succeed.
