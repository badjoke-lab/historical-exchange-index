# HEI BX28 Consumed Candidate Note

Date: 2026-07-25

## Promoted

```text
Arkham Exchange -> hei_ex_001026 limited
YoBit            -> hei_ex_001027 active
Hodl Hodl        -> hei_ex_001028 active
Paxful           -> hei_ex_001029 dead
```

## Backlog source

The reviewed backlog-dedupe pass identified these named rows as not found in reviewed repository data before drafting:

```text
hei_cand_0004 Arkham Exchange
hei_cand_0073 YoBit
hei_cand_0082 Hodl Hodl
hei_cand_0083 Paxful
```

Direct repository searches and canonical-path checks found no reviewed record for the four final BX28 entities before creation.

## Review basis

### Arkham Exchange

- Current first-party documentation describes spot and perpetual-futures exchange infrastructure.
- A first-party April 2026 announcement exposes decentralized Solana trading under the same Arkham product identity.
- Current independent centralized-exchange tracking recognizes the venue but reports no tracked pairs or volume.
- The record therefore remains `limited`, and the centralized and decentralized surfaces are consolidated as one hybrid entity.

### YoBit

- Current first-party market pages expose thousands of crypto trading pairs with non-zero quoted activity.
- Current independent exchange data lists recently updated spot markets and non-zero volume.
- Confidence remains medium because ownership and jurisdiction are opaque and independent quality warnings remain material.

### Hodl Hodl

- Current first-party pages describe a non-custodial peer-to-peer Bitcoin marketplace using multisignature escrow.
- Current offer, contract, and API surfaces remain available.
- The record uses the bounded `dex` type because users trade directly without exchange custody.

### Paxful

- Current first-party materials state that the wind-down decision was announced on 2025-10-01.
- Trading, deposits, sending, and receiving ended effective 2025-11-01.
- The remaining service is withdrawal-only, so the exchange is classified `dead` with `voluntary_shutdown`.
- Two reviewed lifecycle events preserve the announcement and effective shutdown separately.

## Duplicate controls

Adjacent backlog noise was not promoted:

- The standalone `Coinbase` seed remains represented by `Coinbase Exchange`.
- `One Trading` remains represented by the existing `Bitpanda Pro` identity discovered during BX27 validation.
- Regional, mobile, API, centralized, decentralized, withdrawal, and other product surfaces were not split into extra entities.

## Safety note

The consumed note records review disposition only. It does not authorize automatic publication of future candidates, weaken duplicate controls, infer active status from a live website alone, or change lifecycle semantics.
