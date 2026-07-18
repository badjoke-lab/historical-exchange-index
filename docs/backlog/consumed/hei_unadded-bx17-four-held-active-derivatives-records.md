# Consumed backlog — D-1000 BX17 four held active derivatives records

Date: 2026-07-18  
Status: consumed by reviewed batch BX17

## Reviewed additions

```text
Ethereal   hei_ex_000982 active
Boros      hei_ex_000983 active
Moonlander hei_ex_000984 active
Reya       hei_ex_000985 active
```

## Candidate sources

```text
data-staging/watchlists/review/20260614-active-later-02.json
data-staging/watchlists/resolution/index.json
```

## Resolution results

```text
candidate:ethereal-dex -> hei_ex_000982 promoted
candidate:boros        -> hei_ex_000983 promoted
candidate:moonlander   -> hei_ex_000984 promoted
candidate:reya-perps   -> hei_ex_000985 promoted
```

The dated override is stored at:

```text
data-staging/watchlists/resolution/overrides/20260718-bx17-four-promotions.json
```

## Evidence review

Each record received current first-party identity or protocol documentation and current independently maintained activity metrics.

```text
Ethereal:   perpetual DEX and appchain; active non-zero volume, TVL, fees, revenue, open interest
Boros:      onchain funding-rate and yield venue; active non-zero volume, TVL, fees, revenue, open interest
Moonlander: Cronos perpetual venue; active non-zero volume, TVL, fees, open interest
Reya:       self-custodial perpetual venue and trading rollup; active non-zero volume, TVL, fees, revenue, open interest
```

## Dedupe findings

No pre-BX17 canonical entity or official-domain match was found for the four promoted records.

Hydration, Rhea, and Fulcrom were rejected as additions because they were already canonical as `hei_ex_000699`, `hei_ex_000224`, and `hei_ex_000704`.

Product surfaces remain consolidated under one canonical entity for each selected exchange. No unsupported predecessor or successor relationship was created.

## Reviewed delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected post-BX17 reviewed state:

```text
Entities: 865
Events:   1004
Evidence: 3489
Remaining to D-1000: 135
```

## Safety boundary

This consumed backlog item does not authorize automated publication, schema change, localization expansion, third-language launch, deployment change, or Cloudflare configuration change.
