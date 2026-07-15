# HEI D-1000 Batch BX1 Validation Plan

Date: 2026-07-15  
Project: Historical Exchange Index (HEI)  
Branch: `d1000-batch-bx1-four-exchange-records`

## 1. Scope

BX1 adds four reviewed active DEX entities:

```text
Kodiak          hei_ex_000918
Kriya           hei_ex_000919
Kinetix Finance hei_ex_000920
Lynex           hei_ex_000921
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 801
Events:   1004
Evidence: 3361
English dossiers:  801
Japanese dossiers: 801
Sitemap routes:     1626
```

Remaining to D-1000: 199 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
normalized slug
canonical name
aliases
official domain
repository-wide text overlap
Records validation output
```

Expected domains:

```text
kodiak.finance
kriya.finance
kinetix.finance
lynex.fi
```

Any authoritative overlap failure requires deleting the duplicate proposal and folding useful evidence into the existing record.

## 4. Evidence boundary

Each record uses at least two current first-party sources.

```text
Kodiak:
  official DEX documentation
  current Berachain mainnet contract registry

Kriya:
  official protocol overview
  official Kriya Swap product documentation

Kinetix Finance:
  official current product suite
  official market and limit swap guide

Lynex:
  current first-party site and live application links
  official protocol documentation
```

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

## 5. Required validation

All pull-request workflows must pass on the final head, including:

```text
Records validation
Count semantics regression
Maintainer recovery gate
Machine/public consistency gate
URL safety gate
Japanese Pilot readiness gate
L2 localization evaluation gate
CI
```

Merge only after all 20 workflows complete successfully.

## 6. Localization boundary

L-2 remains `HOLD`.

BX1 adds reviewed canonical records and matching English/Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
