# Consumed research batch: verified-unadded 0151-0200 / research batch 01

Status: reviewed and resolved

Reviewed at: 2026-07-02

## Canonical entities

| candidate row | canonical entity | result |
|---|---|---|
| `hei_unadded_0156` BenSwap | `hei_ex_000575` BenSwap | Added as an active smartBCH DEX with August 2021 launch history and current official contracts, API, and application evidence. |
| `hei_unadded_0158` BeraSwap | existing `hei_ex_000377` BEX | Normalized to Berachain's canonical BEX record and strengthened with launch and current first-party evidence. |
| `hei_unadded_0161` BetterSwap | `hei_ex_000576` BetterSwap | Added as an active VeChainThor DEX and aggregator with current pool and application evidence. |

## Reclassified candidates

| candidate row | result |
|---|---|
| `hei_unadded_0155` Beldex | `out_of_scope_or_duplicate`; Beldex is a privacy blockchain and asset project, not an exchange entity. |
| `hei_unadded_0157` Beralis V3 | `pending_thin`; the source row is supported by aggregator data but a stable first-party exchange identity and lifecycle record were not recovered. |

## Batch output

- new entities: 2
- existing entities strengthened: 1
- new events: 3
- new evidence records: 13
- moved to out of scope: 1
- moved to pending thin: 1
- duplicate entities created: 0

## Modeling decisions

- BenSwap uses a month-level August 2021 launch marker because the exact first-party launch day was not recovered.
- BeraSwap is treated as an alias/source label for existing BEX, not as a separate Berachain exchange.
- BEX receives a mainnet-launch event and first-party documentation without changing its canonical entity identity.
- BetterSwap is modeled as a DEX rather than only an interface because its official documentation includes pool creation and liquidity management in addition to aggregation.
- Beldex is excluded from HEI's exchange scope.
- Beralis V3 remains non-canonical until first-party identity and lifecycle evidence are available.

## Safety checks

- exact names, aliases, slugs, and domains were checked before creation
- the pre-existing BEX canonical entity was reused rather than duplicated
- source labels were normalized to canonical project names
- aggregator-only evidence was not promoted as a public record
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
