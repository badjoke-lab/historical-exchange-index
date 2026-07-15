# HEI D-1000 Batch BX3 Validation Plan

Date: 2026-07-15  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx3-four-active-dex-records`

## 1. Scope

BX3 adds four reviewed active DEX or DEX-aggregator entities:

```text
OpenOcean hei_ex_000926
Pharaoh   hei_ex_000927
Ramses    hei_ex_000928
Odos      hei_ex_000929
```

No events, schema changes, localization expansion, third-language authorization, or Cloudflare changes are included.

BX3 also repairs the stale post-merge BX2 checkpoint and advances the maintainer recovery reference.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 809
Events:   1004
Evidence: 3377
English dossiers:  809
Japanese dossiers: 809
Sitemap routes:     1642
```

Remaining to D-1000: 191 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
normalized slug
canonical name
aliases
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected domains:

```text
openocean.finance
pharaoh.exchange
ramses.xyz
odos.xyz
```

Repository searches before drafting found no current-main name or official-domain matches. Any normalized overlap requires deleting the duplicate proposal and folding useful evidence into the existing record.

## 4. Evidence boundary

Each final record uses two current first-party sources.

```text
OpenOcean:
  official aggregator/API documentation
  current official trading and developer website

Pharaoh:
  official Avalanche DEX documentation
  current deployed contract registry

Ramses:
  official exchange and liquidity documentation
  current multichain contract registry

Odos:
  official liquidity-routing documentation
  current linked application and v3 API status
```

Pearl Exchange was excluded because its former official domain currently resolves to unrelated gambling and SEO-spam content. Stale documentation was not used to override unsafe current-domain evidence.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

## 5. Required validation

All pull-request workflows must pass on the final head, including:

```text
Records validation
Candidate scan gate
Watchlist resolution gate
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

BX3 adds reviewed canonical records and matching English/Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
