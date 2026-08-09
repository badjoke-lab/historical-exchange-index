# BX54 source review boundaries

Date: 2026-08-09  
Status: reviewed support note

## Scope

BX54 reviews four Japanese centralized crypto trading services using current first-party service or operator material plus the current Japan Virtual and Crypto assets Exchange Association (JVCEA) member directory where appropriate.

JVCEA membership and Japanese registration are corroborating identity/status evidence. They are not treated as investment recommendation, safety endorsement, solvency proof, liquidity proof, or proof that every registered business fits HEI exchange scope.

## BITPOINT

The current BITPOINT first-party site exposes account opening, spot trading, exchange tools, asset transfers, staking, and current 2026 notices. First-party notices from BITPOINT and SBI VC Trade confirm that BITPoint Japan Co., Ltd. was absorbed into SBI VC Trade Co., Ltd. on 2026-04-01.

The same notices explicitly state that BITPOINT and VCTRADE continued as distinct service brands after the legal-company merger, with later service integration to be announced separately. BX54 therefore records the corporate merger as an event while keeping the BITPOINT entity `active`.

BX54 does not convert the former operating company's 2016 incorporation date into an exact BITPOINT service launch date.

## S.BLOX

The current S.BLOX first-party site identifies S.BLOX Inc., displays Japanese crypto-asset exchange registration, and presents the current trading service. Current 2026 support notices describe crypto buying/selling availability around scheduled maintenance.

JVCEA's current member directory lists S.BLOX Inc. as a crypto-asset exchange business member with Kanto Finance Bureau registration No. 00016.

BX54 does not infer a launch date from registration, corporate history, or ownership history.

## HashKey Japan

The current first-party site identifies HashKey Japan as the former Tokyo Hash and states that crypto-asset exchange service has been provided since September 2021. The company-name change notice states that Tokyo Hash Co., Ltd. became HashKey Japan Co., Ltd. effective 2026-06-01 and explicitly says that legal identity, contracts, and provided services were unchanged.

BX54 therefore keeps one continuing entity, preserves Tokyo Hash as an alias, and records a `rebranded` event with an active status effect. It does not create separate predecessor/successor entities.

The month-only September 2021 service-start statement is not converted into a synthetic exact launch date.

## BACKSEAT

The current BACKSEAT first-party site exposes account opening, order-book exchange, OTC trading, and current 2026 notices. First-party 2026 notices state that external crypto deposits and withdrawals are suspended from 2026-02-25 with no announced restart date, while crypto trading remains available. Staking is also stopped, and a later operating notice states that dealer-market buy/sell is unavailable while exchange trading continues.

BX54 therefore uses `limited`, not `active`, because material customer functions are unavailable, and not `dead`, because exchange trading remains available.

The suspension event uses the available `withdrawal_suspended` enum while explicitly preserving the simultaneous deposit suspension in the event title, description, and notes.

## Explicit exclusion reviewed during BX54

CoinTrade was reviewed but not added. Its current first-party FAQ states that it presently offers only dealer-market sales and does not provide exchange-style trading. BX54 does not treat Japanese crypto-asset registration alone as sufficient to override HEI's exchange-scope boundary.

## General exclusions

BX54 does not infer:

- safety, solvency, liquidity, custody quality, or investment merit from registration or association membership;
- exact launch dates from incorporation, registration, or month-only service history;
- service death from a legal-operator merger when the customer-facing exchange service continues;
- separate entities for a pure legal-name rebrand with unchanged contracts and services;
- `dead` status from partial service suspensions when exchange trading remains available.
