# BX46 source review boundaries

Date: 2026-08-05  
Status: reviewed support note

## Scope

BX46 uses first-party operating or parent-company material together with current regulatory public-register entries.

## YAX

The Hong Kong SFC licensed-platform list establishes operator identity, trading name, CE reference, and licensing date. Tiger Brokers' announcement establishes the parent relationship, official domain, and described custody and trading service scope.

The YAX site returned an access-control response during review. This is not treated as evidence that the domain is dead or the platform is inactive. The URL is therefore `live_unverified`.

## Bixin.com

The current Bixin user agreement establishes NewBX Limited as operator and describes virtual asset trading, OTC, request-for-quote, and custody services. The Hong Kong SFC licensed-platform list establishes the Bixin.com trading name, CE reference, and licensing date.

The Bixin.com main site returned an access-control response during review. This is not treated as a terminal-state signal. The URL is therefore `live_unverified`.

## Ofza

The current first-party site exposes account registration, fiat deposits, and cryptocurrency buying and selling. The VARA public register establishes the licensed operator, reference, activities, licence issue date, and active status.

## MB.IO

The current first-party site exposes fiat and cryptocurrency funding and trading and identifies an Australian operating entity for spot products. The VARA register separately identifies MBIO FZE and its Dubai exchange and broker-dealer licence.

The canonical country field follows the reviewed Dubai-licensed platform operator MBIO FZE. The Australian entity remains preserved as an alias and jurisdiction-specific scope note; it is not converted into a second canonical exchange record or a lineage assertion.

## Exclusions

BX46 does not infer:

- exact platform launch dates;
- trading volume, liquidity, solvency, or security quality;
- regulatory approval outside the cited jurisdiction;
- predecessor, successor, merger, acquisition, or rebrand relationships;
- lifecycle events from licensing dates alone.
