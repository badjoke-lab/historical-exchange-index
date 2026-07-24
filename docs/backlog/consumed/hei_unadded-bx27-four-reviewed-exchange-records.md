# HEI BX27 Consumed Candidate Note

Date: 2026-07-24

## Promoted

```text
Ndax    -> hei_ex_001022
NovaDAX -> hei_ex_001023
LATOKEN -> hei_ex_001024
Paymium -> hei_ex_001025
```

## Backlog source

The current reviewed backlog-dedupe pass identified these named rows as not found in reviewed repository data before drafting:

```text
hei_cand_0060 NDAX
hei_cand_0061 NovaDAX
hei_cand_0055 LATOKEN
hei_cand_0064 Paymium
```

The same pass directly recognized `Coinbase Exchange` as canonical and did not treat the separate `Coinbase` seed label as authority for a duplicate entity.

## Review basis

### Ndax

- Current first-party pages identify an operating Canadian crypto platform for individual and institutional users.
- Simple and advanced trading, CAD funding, staking, portfolio, and OTC surfaces remain available.
- Independent current market data reports non-zero spot trading volume.
- The current `Ndax` brand and `NDAX` capitalization remain one entity.

### NovaDAX

- Current first-party platform exposes active account, order-book, mobile, and trading entry points in Brazil.
- The platform reports more than 300 trading pairs.
- Independent current market data lists recently updated BRL and USDT spot pairs and non-zero volume.

### LATOKEN

- Current first-party platform exposes active exchange, wallet, asset-discovery, and trading entry points.
- Independent current market data lists hundreds of spot pairs, recently updated major markets, and non-zero volume.
- Confidence remains medium because the reviewed pass does not independently establish a current operating legal entity beyond the jurisdiction carried by the exchange registry.

### Paymium

- Current first-party platform exposes euro funding, buying, selling, Bitcoin limit orders, recurring purchases, OTC, and business services.
- The platform reports current French MiCA CASP authorisation.
- Independent current market data lists a recently updated BTC/EUR spot market and non-zero volume.

## Duplicate controls

Direct canonical-path, name, alias, slug, and domain checks found no reviewed record for the four final BX27 entities before creation.

The first BX27 draft included One Trading, but Records validation detected that its `Bitpanda Pro` identity already belonged to the reviewed `Bitpanda Pro` entity (`hei_ex_000585`). One Trading was removed rather than bypassing the overlap gate, and LATOKEN was reviewed as the replacement fourth entity.

Adjacent existing records and seed labels were not duplicated. In particular, the backlog's standalone `Coinbase` label was not promoted separately from the existing `Coinbase Exchange` entity.

## Safety note

The consumed note records review disposition only. It does not authorize automatic publication of future candidates, weaken duplicate controls, split regional or product surfaces to inflate counts, or change status semantics.
