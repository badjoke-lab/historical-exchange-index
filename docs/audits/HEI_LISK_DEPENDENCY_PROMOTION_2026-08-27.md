# HEI Lisk dependency representation promotion — 2026-08-27

Status: REVIEWED IMPLEMENTATION
Issue: #888

## Scope

Resolve the two remaining representation gaps discovered during the Lisk Chain shutdown dependency sweep without misclassifying Lisk Chain shutdown as an exchange-entity death.

## Canonical additions

### Bitmama

- entity: `hei_ex_001173`
- slug: `bitmama`
- type: `cex`
- status: `active`
- launch marker: `2017-01-01` as a year-level marker only
- country/origin: `Nigeria`
- event: `hei_ev_010156` (`launched`)
- evidence: `hei_src_012656` through `hei_src_012658`

Reviewed first-party Bitmama material states that the platform began in 2017 as a P2P digital-currency exchange and currently provides cryptocurrency buy, sell and trade services. The current first-party site lists Lisk among supported cryptocurrencies. Lisk documentation independently lists Bitmama as an LSK venue using the Lisk network.

### OKJ / OKCoin Japan

- entity: `hei_ex_001174`
- slug: `okj`
- canonical name: `OKJ`
- aliases include `OKCoin Japan`, `OKCoinJapan`, `OKX Japan`
- type: `cex`
- status: `active`
- launch date: null
- country/origin: `Japan`
- event: `hei_ev_010157` (`regulation`, 2020-03-30)
- evidence: `hei_src_012659` through `hei_src_012662`

Japan FSA records identify OKCoin Japan K.K. as Kanto Finance Bureau registration No.00020 dated 2020-03-30 and include LSK among handled crypto-assets. Current first-party OKJ/OKCoin Japan surfaces expose active exchange, buy/sell, staking, lending and account functionality. A July 2026 OKJ maintenance notice explicitly names the LSK network, establishing a current LSK-network support surface. HEI therefore represents OKJ as a distinct Japanese regulated exchange identity rather than absorbing it into global OKX.

The FSA registration date is preserved as a regulatory lifecycle marker, not asserted as the exchange launch date.

## Lisk shutdown boundary

Neither addition is a shutdown record. Both entities remain `active` at this checkpoint.

The 2026-10-31 Lisk Chain shutdown remains a dependency/network-support watch. Future exchange-level events require a reviewed venue-specific migration, deprecation, suspension, or service-termination source. A Lisk deployment/network change alone must not mark either exchange dead.

## Canonical paths

- `records/exchanges/bitmama.json`
- `records/exchanges/okj.json`

## Commits

- Bitmama: `03a08a0a422a9b0b94fd9b5640dabf069878eedf`
- OKJ: `ee2d06d338764f98b4b6961f600071357d7038d8`

## Remaining Lisk work

Representation-gap research is closed for Bitmama and OKJ. Remaining work is lifecycle monitoring only:

1. watch direct Lisk-network venues for migration/deprecation notices;
2. re-check Velodrome and Oku Lisk deployment disposition;
3. perform pre-shutdown verification before 2026-10-31;
4. perform effective-state verification on/after 2026-10-31;
5. keep Lisk DAO proposal execution and LSK token-network migration separate from HEI exchange lifecycle.

## Validation note

The GitHub combined-status endpoint and pull-request workflow-run lookup returned no status contexts for the direct-main commit at the time of this checkpoint. This audit does not claim CI green. Normal repository validation must be observed on the next workflow run or equivalent main validation before treating CI state as verified.
