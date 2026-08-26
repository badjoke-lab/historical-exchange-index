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

### XT.com — exchange is active, but current public guide does not expose LSK-specific network state

XT.com's current first-party deposit and withdrawal guides, published 2026-01-05 and 2026-01-07, confirm that XT.com remains an active exchange and requires users to select a supported network for each asset. These guides do not expose an LSK-specific network row, so they are insufficient to prove whether XT still has direct Lisk-network LSK deposits/withdrawals after the Lisk shutdown announcement.

Sources:
- https://www.xt.com/en/blog/post/step-by-step-guide-how-to-deposit-on-xt-com
- https://www.xt.com/en/blog/post/step-by-step-guide-how-to-withdraw-on-xt-com

Interpretation:
- XT.com entity remains active;
- no LSK-specific migration/deprecation notice located in this pass;
- current public guides do not establish current LSK network support one way or the other;
- keep XT.com unresolved at the network-support level, with no canonical HEI status change.

## DEX / frontend dependency verification

### Oku Trade — direct Lisk Uniswap-v3 infrastructure is documented

Oku Trade's current deployed-contract documentation contains a dedicated **Lisk** section with Uniswap-v3-style core/periphery contracts, including a v3 Core Factory, Universal Router, Proxy Admin, Tick Lens, position manager/migrator, quoter/router, Permit2 and related contracts.

Source:
- https://docs.oku.trade/home/extra-information/deployed-contracts

Oku's official-links documentation identifies `oku.trade/app/` as the trading surface and `oku.trade/info/` as analytics.

Source:
- https://docs.oku.trade/home/extra-information/official-links

Interpretation:
- Oku has a real Lisk deployment/infrastructure dependency, not merely a generic mention;
- this still does not automatically make Oku a separate HEI canonical exchange entity if HEI treats the underlying exchange identity at the Uniswap/protocol level;
- because HEI currently defers deployment-level modeling, the Lisk closure should remain a deployment/frontend research signal unless Oku itself announces an entity-level product shutdown or migration that warrants a separate HEI event;
- current source establishes a strong pre-shutdown Lisk deployment baseline.

### Velodrome — direct Lisk exposure plus independently established Celo presence

Lisk's own exchange-support documentation lists **Velodrome** as the decentralized exchange supporting LSK on the Lisk network.

Separately, Celo ecosystem reporting states that **Velodrome launched on Celo in 2025**, before the 2026 Lisk shutdown announcement.

Sources:
- https://docs.lisk.com/lisk-chain/lisk-tools/exchanges/
- https://forum.celo.org/t/celebrating-celo-s-five-years-vision-2030-a-trillion-dollar-onchain-economy-built-on-celo-a-battle-for-crypto-s-soul/11041

Interpretation:
- Velodrome already has a Celo presence independent of the 2026 Lisk migration process;
- therefore a future Lisk->Celo disposition must not be described as proof that Velodrome as an entity is moving wholesale from Lisk to Celo;
- the unresolved question is specifically the fate of the **Lisk deployment/support surface**;
- no evidence in this pass establishes that the Lisk deployment has already migrated, terminated, or been scheduled for termination;
- no whole-entity dead/inactive change is justified.

### Still unresolved after this pass

- Bitmama
- OKJ / OkCoin Japan identity and current LSK network handling

These remain open because current public search did not yield sufficient first-party material to resolve them safely. Absence of a result is not treated as evidence of no change.

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
- XT.com — active exchange baseline confirmed; LSK-specific network state still unresolved.

### Priority B — representation gaps / identity work

- Bitmama — unresolved; determine HEI scope and current LSK handling.
- Velodrome — direct Lisk exposure confirmed; Celo presence predates this shutdown; Lisk deployment disposition still unresolved.
- OKJ — unresolved; resolve entity/lineage boundary relative to OKX/OkCoin and current LSK handling.
- Oku Trade — Lisk deployed-contract baseline confirmed; likely deployment/frontend-level rather than a whole new HEI entity unless separate scope is justified.

### Priority C — broader token/liquidity context, not direct Lisk-chain dependency from the exchange table

- Uniswap — Ethereum-side LSK liquidity/context; canonical HEI entity already exists.
- Aerodrome — Base-side LSK liquidity/context; canonical HEI entity already exists.

## Canonical action rule

No canonical record is changed merely because Lisk Chain announced shutdown.

Canonical `event + evidence` work is justified only when a reviewed source establishes an HEI-relevant lifecycle event for the exchange/DEX entity. Deployment/network-only changes remain research/watchlist material until HEI supports lossless deployment modeling or the change materially affects the entity itself.

## Next checkpoints

- finish Bitmama and OKJ/OkCoin Japan first-party review;
- continue migration/deprecation notice checks for all captured live dependencies;
- specifically re-check Velodrome and Oku Lisk deployment disposition as the closure date approaches;
- pre-shutdown migration/support review before 2026-10-31;
- effective-state verification on/after 2026-10-31;
- DAO proposal execution remains tracked separately from Chain shutdown;
- LSK token network migration remains separate from exchange lifecycle.
