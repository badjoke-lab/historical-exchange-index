# BX52 source review boundaries

Date: 2026-08-09  
Status: reviewed support note

## Scope

BX52 resumes post-D-1000 canonical growth with four regulated regional centralized-exchange records. The batch uses current first-party operating or wind-down material together with current or formal financial-regulator records.

## Upbit Thailand

Thailand SEC's current Digital Asset Exchange list identifies UPBIT / Upbit Exchange (Thailand) Company Limited and links `th.upbit.com`. Current Upbit first-party API documentation exposes Thailand regional quotation and authenticated Exchange API endpoints.

BX52 treats the Thai licensed legal operator as separate from the South Korean Upbit entity. It does not infer an exact platform launch date from the Thai company's registration or licensing history.

## MX Global

Current MX Global first-party material identifies MX Exchange as a digital asset exchange platform provided by MX Global Sdn Bhd, formerly ARXCHANGE Sdn. Bhd., and exposes live MYR trading and account functions. Securities Commission Malaysia's registered-DAX list updated 2026-07-20 identifies MX Global Sdn Bhd as a Registered Recognized Market Operator-Digital Asset Exchange.

The MX Exchange product name is preserved inside one MX Global entity rather than counted separately. The company's stated 2018 founding year is not converted into a synthetic exact exchange launch date.

## Upbit Singapore

Current Upbit first-party API documentation exposes dedicated Singapore quotation and Exchange API endpoints. The Monetary Authority of Singapore Financial Institutions Directory identifies Upbit Singapore Pte. Ltd. as a Major Payment Institution providing Digital Payment Token Service and was last updated 2026-04-22.

BX52 treats the Singapore licensed legal operator as separate from the South Korean Upbit entity and does not infer an exact launch date from licensing or incorporation dates.

## KuCoin Thailand / ERX

Thailand SEC identified ERX Co., Ltd. as the digital asset exchange operating under the KuCoin Thailand trade name and documented the 2026-01-03 business suspension after ERX failed to maintain the required ongoing capital fund.

First-party notices later stated that there was no scheduled plan to resume services in the near future and that the customer system would close on 2026-04-22 at 13:00 UTC+7. From that point customers could not log in, view balances or history in the system, or perform self-service withdrawals; offboarding withdrawals moved to manual customer-service handling.

On 2026-04-25 KuCoin Thailand stated that ERX was in the process of returning its Digital Asset Exchange licence following review of its business plans and strategic direction. The public support/announcement site remains reachable during wind-down.

BX52 therefore uses `2026-04-22` as the operational death marker and retains `official_url_status: live_verified`. It does not equate a live wind-down website or manual withdrawal channel with an active exchange. `death_reason: unknown` is used because the reviewed record supports both a regulatory capital failure and a later strategic licence-return decision, without proving one exclusive terminal cause.

## Exclusions

BX52 does not infer:

- exact launch dates from incorporation, registration, or licence dates;
- investment recommendation or safety endorsement from regulatory status;
- volume, liquidity, solvency, custody quality, or security quality;
- corporate dissolution of ERX;
- completion date of ERX's licence-return process beyond what the first-party notice states;
- identity between regional Upbit legal operators and the South Korean Upbit entity;
- a separate MX Exchange entity apart from MX Global Sdn Bhd.
