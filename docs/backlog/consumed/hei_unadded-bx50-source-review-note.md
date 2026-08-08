# BX50 source review boundaries

Date: 2026-08-09  
Status: reviewed support note

## Scope

BX50 uses current first-party operating surfaces and current or formal regulator/operator records for four Southeast Asian centralized crypto trading platforms.

## SINEGY

Current SINEGY first-party content identifies an operating Malaysian Digital Asset Exchange and current mobile/support material describes spot trading and wallet functions. The Securities Commission Malaysia list of registered Digital Asset Exchanges, updated 2026-07-20, lists SINEGY DAX Sdn Bhd as a registered Recognized Market Operator-Digital Asset Exchange.

The root domain returned an access-control response during verification, so HEI uses `official_url_status: live_unverified`. That condition is not converted into an inactive or terminal-state claim.

## KDX

The current KDX site presents MYR order-book trading, wallet transfers, and institutional exchange services. It identifies Kinetic DAX Sdn. Bhd. as formerly Tokenize Technology (M) Sdn. Bhd. The Securities Commission Malaysia current registered-DAX list names Kinetic DAX Sdn Bhd.

BX50 treats KDX / Kinetic DAX / the former Malaysian Tokenize Technology identity as one continuing entity. It does not infer identity with separately operated Tokenize services outside Malaysia.

## Samuel Kripto

The current first-party corporate site identifies PT Samuel Kripto Indonesia and describes an operating crypto exchange platform. It states that the platform launched in 2022 and cites OJK licence `KEP-8/D.07/2025`. OJK's formal business-licence announcement grants PT Samuel Kripto Indonesia a Digital Financial Asset Trader licence effective 2025-03-24. Current Indonesian crypto exchange-member material also lists Samuel Kripto Indonesia under the same operator.

The earlier Vonix app identity is preserved as an alias. A synthetic exact launch date is not created from the reviewed launch year.

## Nanovest

The current Nanovest site identifies PT Tumbuh Bersama Nano as operator of a crypto-asset trading and transaction platform and states that the operator is licensed and supervised by OJK. OJK's published Digital Financial Asset Trading Provider list identifies PT Tumbuh Bersama Nano (Nanovest) under registration `S-8/D.07/2025`.

Nanovest also offers foreign-stock and digital-gold products. BX50 does not treat those products as HEI exchange functions and does not infer a separate exchange entity for them.

## Exclusions

BX50 does not infer:

- exact launch dates from regulatory approval dates;
- trading volume, liquidity, solvency, custody quality, or security quality;
- investment recommendation or safety endorsement from regulator registration;
- separate entities for historical Malaysian Tokenize branding or the Vonix app name;
- identity between KDX and non-Malaysian Tokenize operators;
- exchange scope for Nanovest's non-crypto products.
