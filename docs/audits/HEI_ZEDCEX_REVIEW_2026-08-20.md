# HEI Zedcex Lane A review — 2026-08-20

## Scope
Reviewed addition of Zedcex as a canonical exchange entity.

## Primary evidence
- UK Companies House company overview and filing history for ZEDCEX EXCHANGE LTD (company 14311274).
- U.S. Treasury press release dated 2026-01-30.
- OFAC recent-actions entry dated 2026-01-30.
- Current ZedDex ecosystem page linking the ZedCex CEX surface.

## Findings
- Zedcex Exchange Ltd was incorporated on 2022-08-22.
- OFAC designated Zedcex on 2026-01-30 under E.O. 13902 and E.O. 13224, as amended.
- Companies House dissolved the UK company through compulsory strike-off on 2026-05-12 under a section 1002A process tied to misleading, false, or deceptive incorporation information.
- Public Zedcex-facing exchange surfaces remained discoverable after dissolution.

## Decision
Add Zedcex as `limited`, not `dead`. Corporate dissolution is proven, but operational cessation is not. Keep `death_date` and `death_reason` null until direct evidence establishes terminal shutdown.

## Safety
Normal reviewed Lane A canonical PR flow only. No monitoring candidate is allowed to publish directly.
