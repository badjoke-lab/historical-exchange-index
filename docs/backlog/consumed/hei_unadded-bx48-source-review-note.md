# BX48 source review boundaries

Date: 2026-08-09  
Status: reviewed support note

## Scope

BX48 uses current first-party operating or wind-down surfaces together with Dubai Virtual Assets Regulatory Authority and Abu Dhabi Global Market Financial Services Regulatory Authority public-register records.

## LCT

LCT Global FZE operates the LCT virtual-asset trading platform. Current first-party trading rules describe 24/7 order-book trading across virtual-asset/fiat and virtual-asset/virtual-asset pairs. VARA lists LCT Global FZE as active under reference `VL/25/12/001` with Exchange Services permission for retail, qualified, and institutional investors.

The licence issue date is not converted into an exact platform launch date.

## MANTRA Finance

The current MANTRA Finance surface presents a Spot DEX for tokenized real-world assets together with launchpad and RWA investment products. VARA lists Mantra Finance FZE as active under reference `VL/25/02/001` with Exchange Services, Broker-Dealer Services, Management and Investment Services, and a DeFi Limited Licence condition.

The record uses `hybrid` because the reviewed product combines a regulated operator/legal entity with a first-party Spot DEX / decentralized-venue presentation. It does not treat the broader MANTRA Chain as a second regulated exchange identity.

## BurjX

The current first-party site presents an operating centralized crypto exchange with AED funding and withdrawals, spot trading, OTC execution, and institutional services. The ADGM FSRA register lists BurjX MENA Ltd. as active under FSP `240022` with matched-principal virtual-asset dealing and custody activities.

The FSP date is not converted into an exact platform launch date, and the regulatory record is not converted into a performance, safety, or liquidity endorsement.

## Matrix Exchange

Matrix Limited's first-party wind-down notice states that it decided to wind down and would permanently suspend its virtual-asset Multilateral Trading Facility on 2026-01-31 at 23:59:59 UTC. Deposits had already been stopped and clients were instructed to withdraw assets by that date.

HEI therefore uses:

```text
status:       dead
death_reason: voluntary_shutdown
death_date:   2026-01-31
```

The ADGM FSRA public register later marks Matrix Limited withdrawn and preserves its former virtual-asset MTF and custody permissions. The public register exposes later regulatory-withdrawal dates; those dates are retained as regulatory-status evidence and do not replace the first-party service shutdown date.

## Exclusions

BX48 does not infer:

- exact platform launch dates from licence or FSP dates;
- trading volume, liquidity, solvency, custody quality, or security quality;
- regulatory approval outside the cited UAE jurisdictions;
- predecessor, successor, merger, acquisition, rebrand, or shared-entity relationships;
- an insolvency, hack, or regulatory-enforcement cause for Matrix's shutdown;
- continuing Matrix trading service from the fact that the root domain remains reachable.
