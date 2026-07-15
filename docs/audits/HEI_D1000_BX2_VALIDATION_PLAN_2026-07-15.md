# HEI D-1000 Batch BX2 Validation Plan

Date: 2026-07-15  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx2-four-active-dex-records`

## 1. Scope

BX2 adds four reviewed active DEX entities:

```text
Maverick Protocol hei_ex_000922
Merchant Moe      hei_ex_000923
Meteora           hei_ex_000924
NILE              hei_ex_000925
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX2 also repairs the stale post-merge BX1 checkpoint and advances the maintainer recovery reference.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 805
Events:   1004
Evidence: 3369
English dossiers:  805
Japanese dossiers: 805
Sitemap routes:     1634
```

Remaining to D-1000: 195 entities.

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
mav.xyz
merchantmoe.com
meteora.ag
nile.build
```

Repository searches before drafting found no current-main name or official-domain matches. Records validation remains authoritative. Any normalized overlap requires deleting the duplicate proposal and folding useful evidence into the existing record.

The initial Minswap proposal was removed after the open-candidate overlap gate correctly detected `candidate:minswap-dex` as unresolved internal work. NILE replaced it without changing the projected count delta.

## 4. Evidence boundary

Each record uses two current first-party sources.

```text
Maverick Protocol:
  official protocol overview
  current V2 interface documentation

Merchant Moe:
  official Mantle DEX overview
  current contract registry

Meteora:
  current product and protocol documentation
  current token-swap guide

NILE:
  official Linea liquidity and DEX overview
  current deployed contract registry
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

BX2 adds reviewed canonical records and matching English/Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
