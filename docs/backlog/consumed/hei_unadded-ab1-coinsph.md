# D-750 AB1 correction — Coins.ph duplicate disposition

Reviewed at: 2026-07-09

## Result

- `0424` coinsph / Coins.ph -> existing `hei_ex_000043`
- no new entity created
- attempted `hei_ex_000733` record removed before merge

## Correction reason

The 0401-0450 JSON scan still classified candidate `0424` as `add_now`, but the companion closed-range Markdown authority already records Coins.ph as an existing duplicate consumed under `hei_ex_000043`.

A new `coinsph` bundle was initially drafted from strong current first-party evidence. Permanent overlap validation correctly blocked the draft because the same Coins.ph identity already exists in both canonical data and the reviewed `records/exchanges/coins-ph.json` bundle.

Blocking overlap keys were:

- normalized slug: `coinsph`
- normalized name/alias: `coinsph`
- official domain: `coins.ph`

The duplicate draft is removed. The machine-readable scan is corrected from `add_now` to `out_of_scope_or_duplicate` so future growth work does not attempt to recreate the existing entity.

## Canonical count impact

```text
New entities: 0
New events:   0
New evidence: 0
Reviewed public state remains:
Entities: 616
Events:   1004
Evidence: 2817
Remaining to D-750: 134 entities
```

No Cloudflare configuration changes or public-record changes are included. Preview deployment is not required. The correction must pass candidate scan, backlog dedupe, and unchanged-public-state validation gates before merge.
