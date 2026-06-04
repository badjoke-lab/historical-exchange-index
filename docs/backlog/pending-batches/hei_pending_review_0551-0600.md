# Pending review: verified-unadded rows 0551-0600

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0551-0600` before canonical record creation.

This window contains one already-consumed CoinEx row, many database-only CEX rows, DEX/protocol rows, and several active-looking exchange candidates. No additional candidate in this scan was promoted directly to canonical records because the reviewed context did not yet provide enough public-ready event/evidence value.

## Operating rule

Do not add database-only or `listed_reference`-only candidates to canonical records.

Canonical additions should have clear identity, meaningful event value, preferably two or more evidence items, safe URL/status handling, and no unresolved duplicate or scope concern.

## Classification summary

```text
already_consumed: 1
add_now: 0
needs_research: 9
pending_thin: 26
active_seed_later: 8
out_of_scope_or_duplicate: 6
```

## Already consumed

```text
hei_unadded_0551 CoinEx
```

`hei_unadded_0551` was consumed with `hei_unadded_0550` in the CoinEx canonical record.

## needs_research

These may be HEI-relevant, but need stronger source, event, duplicate, or scope review before canonical inclusion.

```text
hei_unadded_0553 CoinExchange
hei_unadded_0554 CoinField
hei_unadded_0558 Coinhouse
hei_unadded_0565 CoinPlace
hei_unadded_0572 CoinTiger
hei_unadded_0578 CoinZest
hei_unadded_0589 Convergence Finance
hei_unadded_0594 Covesting
hei_unadded_0600 Crema Finance
```

Notes:

- CoinExchange, CoinField, Coinhouse, CoinPlace, CoinTiger, and CoinZest look exchange-like but need shutdown/current-status/event evidence before canonical inclusion.
- Convergence Finance and Crema Finance may have protocol/security-event relevance, but need stronger source review and scope confirmation.
- Crema Finance should be checked separately because it may support an event-backed security incident record.

## pending_thin

These were too thin for canonical record creation in this scan, usually database-only or listed-reference-only.

```text
hei_unadded_0552 CoinEx Market
hei_unadded_0555 Coingarage
hei_unadded_0556 Coingi
hei_unadded_0557 Coinhain
hei_unadded_0559 Coinhub
hei_unadded_0560 Coinlogy
hei_unadded_0561 CoinMargin
hei_unadded_0562 Coinmate
hei_unadded_0563 CoinMex
hei_unadded_0564 CoinOne Swap
hei_unadded_0566 Coinquista
hei_unadded_0567 Coinrate
hei_unadded_0568 CoinsBank
hei_unadded_0569 Coinsbit
hei_unadded_0571 CoinSwap Space
hei_unadded_0574 Cointradecx
hei_unadded_0576 Coinut
hei_unadded_0577 Coiny
hei_unadded_0581 ColorPool
hei_unadded_0582 Comet Swap
hei_unadded_0583 Cometh
hei_unadded_0584 ComethSwap
hei_unadded_0585 Complus Network
hei_unadded_0586 Concordex
hei_unadded_0587 Cone
hei_unadded_0588 Consensus Liquidity DEX
hei_unadded_0592 Counos Exchange
hei_unadded_0595 COXI
hei_unadded_0596 CPDAX
hei_unadded_0597 Cratex
hei_unadded_0598 CredoEx
hei_unadded_0599 CreekEx
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

These look more suitable for a dedicated active CEX / DEX seed phase than for the current historical-event-first batch.

```text
hei_unadded_0570 coinsph
hei_unadded_0573 CoinTR
hei_unadded_0575 CoinUp.io
hei_unadded_0579 Coinzoom
hei_unadded_0591 COREx
```

Notes:

- Active-looking venues should be handled in a later active CEX/DEX seed phase unless a meaningful event is confirmed.

## out_of_scope_or_duplicate

These appear to be product variants, category-mismatched rows, or not clearly exchange records for HEI v0.

```text
hei_unadded_0580 Collector Crypt
hei_unadded_0590 Copump
hei_unadded_0593 Courtyard
```

Notes:

- Physical TCG / launchpad / non-exchange rows require scope confirmation before any HEI treatment.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes several promising research candidates, but none should be promoted from the reviewed row alone. Adding now would either create thin records or pull active/product/protocol rows into canonical records too early.

## Next action

1. Review `Crema Finance` separately for a possible event-backed security incident record.
2. Continue with `hei_unadded_0601-0650`, while treating Curve rows as a cluster rather than separate deployment records.
3. Keep active-looking venues for a dedicated active seed phase.
4. Do not add product/category rows without a scope decision.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
