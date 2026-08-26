# HEI Lisk Chain dependency sweep — 2026-08-26

Status: active research checkpoint  
Issue: #888  
Scope: exchange/DEX dependencies that may be affected by the announced Lisk Chain shutdown on 2026-10-31.

## Source-of-record facts

Lisk announced that Lisk Chain will shut down on 2026-10-31. Until then the chain and underlying infrastructure remain operational and supported. Lisk and Celo opened a migration path for projects building on Lisk Chain.

Primary source:
- https://lisk.com/blog/posts/introducing-the-new-lisk/

Lisk's exchange-support documentation currently distinguishes exchanges by the network used for LSK deposits/withdrawals.

Primary source:
- https://docs.lisk.com/lisk-chain/lisk-tools/exchanges/

## Direct Lisk-network exchange/DEX exposure from Lisk documentation

The current Lisk documentation lists the following venues as using the **Lisk** network for LSK support:

### Centralized exchanges

- Bitmama
- Crypto.com
- Indodax
- OKX
- OkCoin / OKX Japan / OKJ
- Quidax
- Upbit
- XT.com

### Decentralized exchanges

- Velodrome

The same source lists several other venues as using **Ethereum** for LSK rather than Lisk Chain. Those are not direct Lisk-Chain deposit/withdrawal dependencies solely from this source.

HTX is listed with Ethereum and a note that Lisk support was coming soon; that note is not treated as proof of a current Lisk-network dependency without a newer source.

## HEI repository mapping checkpoint

### Canonical HEI records confirmed

- Crypto.com Exchange — `records/exchanges/crypto-com-exchange.json`
- Indodax — `records/exchanges/indodax.json`
- OKX — `records/exchanges/okx.json`
- Quidax — `records/exchanges/quidax.json`
- Upbit — `records/exchanges/upbit.json`
- XT.com — `records/exchanges/xt-com.json`
- Uniswap — `records/exchanges/uniswap.json`
- Aerodrome — `records/exchanges/aerodrome.json`

Uniswap and Aerodrome are relevant to the broader LSK liquidity/network-transition context but are not direct Lisk-network dependencies in the Lisk exchange table: Uniswap is listed on Ethereum and Aerodrome on Base.

### Not confirmed as a distinct canonical record in current repository search

- Bitmama
- Velodrome
- Oku Trade

### Identity-boundary review required

- OkCoin / OKX Japan / OKJ

Current search finds OKX canonical and references to OkCoin/OKJ in audit/entity material, but this checkpoint does not yet assert whether HEI should represent OKJ as a separate entity, regional entity, alias/lineage, or product-level continuation. Resolve identity boundary before any Lisk-related record action.

## Current first-party venue verification

### Crypto.com — direct Lisk-network support still active in latest first-party limits table

Crypto.com's EEA Fees & Limits documentation, published 2026-05-19 and still available in the current help center, lists:

```text
LSK | Lisk L2 | Deposit Status: Y
```

The same current Crypto.com Exchange markets surface still lists an active LSK/USD market.

Sources:
- https://help.crypto.com/en/articles/10981986-fees-limits-eea
- https://crypto.com/exchange-pro/en-US/markets/crypto

Interpretation:
- active exchange entity;
- current first-party documentation still exposes LSK over Lisk L2;
- no HEI entity-status change justified;
- keep under migration/deprecation watch.

### Indodax — LSK was explicitly listed on Mainnet and remains an open migration-watch item

Indodax's first-party LSK listing announcement dated 2025-09-02 states:

```text
Lisk (LSK)
Network: Mainnet
Open Deposit: September 3, 2025
Open Trading: September 4, 2025
```

It also warns that LSK uses an address different from typical Ethereum addresses, which is consistent with direct non-Ethereum network handling.

Source:
- https://blog.indodax.com/en_US/listing-3sept25

Interpretation:
- establishes a first-party historical baseline for direct Lisk-mainnet handling;
- no 2026 shutdown/migration notice was located in the current sweep;
- no HEI entity-status change justified;
- retain as an open network-migration watch item.

### Quidax — current API documentation exposes Lisk network with deposits and withdrawals enabled

Quidax's current wallet API documentation includes a network entry:

```text
id: lisk
name: LISK
deposits_enabled: true
withdraws_enabled: true
```

A Quidax support article updated 2026-06-15 also continues to list LSK with a minimum withdrawal amount of 1.

Sources:
- https://docs.quidax.io/docs/wallets-updated
- https://support.quidax.io/hc/en-us/articles/27688981284508-Minimum-Withdrawal-Amount

Interpretation:
- strong current first-party baseline that Lisk-network handling is still exposed;
- no HEI entity-status change justified;
- keep open for migration/deprecation notice before 2026-10-31.

### Upbit — current withdrawal-limit documentation still maps LSK to the Lisk network

Upbit's support article published/updated in August 2026 lists:

```text
LSK | Lisk | 100,000
```

Upbit Data Lab also continues to surface LSK as a traded asset.

Sources:
- https://support.upbit.com/hc/ko/articles/60305341985049
- https://datalab.upbit.com/assets/LSK/summary

Interpretation:
- current first-party evidence still maps LSK withdrawals to the Lisk network;
- therefore Upbit is a live dependency to monitor before shutdown;
- no HEI entity-status change justified.

### OKX — Lisk shutdown is visible in the OKX information surface, but no operational migration notice is yet confirmed

OKX Orbit surfaced a 2026-08-25 item discussing the Lisk chain shutdown/DAO proposal. This confirms that the shutdown is present in OKX's information environment, but Orbit is informational content and is not treated as an operational deposit/withdrawal announcement.

Source:
- https://www.okx.com/en-us/orbit/insight/lisk-3-1-85602735531968

Interpretation:
- do not promote this to an OKX network-support event;
- continue searching for an official OKX deposit/withdrawal migration or deprecation notice;
- no HEI entity-status change justified.

### Still unresolved in this sweep

- XT.com
- Bitmama
- Velodrome
- OKJ
- Oku Trade

Absence of a search result is not evidence of no change. These remain open research items.

## HEI lifecycle interpretation

The shutdown signal must not be converted into whole-entity death for a venue merely because one supported network disappears.

For each direct Lisk-network venue, review in this order:

1. Does the venue still support Lisk-network deposits/withdrawals now?
2. Has it announced a migration of LSK support to Ethereum/Base or another network?
3. Has it announced a deadline for Lisk-network deposits/withdrawals?
4. Is the change only an asset-network support change, with the exchange entity otherwise active?
5. Does the Lisk shutdown cause any actual HEI entity-level lifecycle change?

Default interpretation for an otherwise active CEX is **no entity status change**. A network-support withdrawal is a dependency/support change, not exchange death.

For Velodrome, determine whether the Lisk deployment migrates, terminates, or remains represented only as one deployment under an otherwise active multi-chain entity. Do not mark Velodrome itself dead solely from Lisk Chain shutdown.

For Uniswap/Oku infrastructure on Lisk, keep protocol/entity identity separate from Lisk deployment state. The current Uniswap HEI record explicitly states that deployment-level and chain-level modeling is pending.

## Immediate work queue

### Priority A — direct Lisk-network venues already canonical

- Crypto.com — current Lisk L2 support baseline captured.
- Indodax — first-party Mainnet listing baseline captured.
- Quidax — current deposits/withdrawals-enabled Lisk network baseline captured.
- Upbit — current LSK=Lisk withdrawal-network baseline captured.
- OKX — informational awareness found; operational migration notice still unresolved.
- XT.com — unresolved.

### Priority B — representation gaps / identity work

- Bitmama — determine HEI scope and whether it warrants a canonical exchange record independent of the Lisk event.
- Velodrome — determine current HEI representation/backlog status and Lisk-deployment disposition.
- OKJ — resolve entity/lineage boundary relative to OKX/OkCoin.
- Oku Trade — determine whether it is an exchange entity for HEI or infrastructure/frontend associated with Uniswap routing/deployments.

### Priority C — broader token/liquidity context, not direct Lisk-chain dependency from the exchange table

- Uniswap — Ethereum-side LSK liquidity/context; canonical HEI entity already exists.
- Aerodrome — Base-side LSK liquidity/context; canonical HEI entity already exists.

## Canonical action rule

No canonical record is changed merely because Lisk Chain announced shutdown.

Canonical `event + evidence` work is justified only when a reviewed source establishes an HEI-relevant lifecycle event for the exchange/DEX entity. Deployment/network-only changes remain research/watchlist material until HEI supports lossless deployment modeling or the change materially affects the entity itself.

## Next checkpoints

- finish XT.com / Bitmama / Velodrome / OKJ / Oku Trade first-party review;
- continue migration/deprecation notice checks for all captured live dependencies;
- pre-shutdown migration/support review before 2026-10-31;
- effective-state verification on/after 2026-10-31;
- DAO proposal execution remains tracked separately from Chain shutdown;
- LSK token network migration remains separate from exchange lifecycle.
