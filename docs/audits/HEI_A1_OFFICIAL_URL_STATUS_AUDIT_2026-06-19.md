# HEI A1 official URL status normalization audit

Audit date: 2026-06-19  
Branch: `fix/a1-official-url-status-normalization-20260619`  
Canonical input: `data/entities.json`

## Purpose

Normalize the 13 legacy `official_url_status` values to the fixed seven-value enum without deleting historical original URLs or archive references. Service state remains represented by `status` / `death_reason`; this field describes the current handling of the stored original URL.

## Fixed enum

- `live_verified`
- `live_unverified`
- `dead_domain`
- `redirected`
- `repurposed`
- `unsafe`
- `unknown`

## Record decisions

| Entity ID | Record | Previous | Normalized | Decision basis |
| --- | --- | --- | --- | --- |
| hei_ex_000159 | Coinbase Pro | `redirected_or_retired` | `redirected` | The original Pro URL redirects to Coinbase Advanced. |
| hei_ex_000268 | LocalCryptos | `partial` | `live_verified` | The original domain remains reachable under the LocalCryptos identity; exchange trading is terminal, but URL reachability is a separate field. |
| hei_ex_000273 | CoinGather | `offline` | `dead_domain` | The registered domain has no web server configured. |
| hei_ex_000275 | BitMarket.eu | `offline` | `repurposed` | The original exchange domain now serves an unrelated Bitcoin magazine/blog. |
| hei_ex_000277 | Stocks.exchange | `offline` | `unknown` | The domain remains registered, but current first-party behavior could not be verified reliably enough to distinguish redirect, live continuity, or repurposing. |
| hei_ex_000278 | SouthXchange | `partial` | `live_unverified` | Recent external checks report the original site online, but the first-party response could not be independently verified during this audit. |
| hei_ex_000279 | AEX | `partial` | `repurposed` | The original exchange domain now serves an A-Trust/AUSD creditor and asset-disposal page rather than exchange trading. |
| hei_ex_000301 | BCM Exchange | `redirect_or_acquired` | `live_verified` | The original BCM domain remains a first-party acquisition and account-migration notice that directs users to Kraken. |
| hei_ex_000302 | BITBOX | `rebranded` | `dead_domain` | The original BITBOX domain remains registered but has no web server configured. |
| hei_ex_000306 | AlfaCashier | `rebranded` | `redirected` | The historical AlfaCashier identity was moved to the official Alfacash successor at alfa.cash. |
| hei_ex_000309 | Bingbon | `rebranded` | `redirected` | Bingbon was replaced by BingX and the former domain is treated as a successor redirect rather than a service-state label. |
| hei_ex_000310 | Anyswap | `rebranded` | `live_unverified` | The original Anyswap domain is still referenced for the legacy dashboard, but current first-party behavior was not fully verifiable. |
| hei_ex_000313 | CoinFLEX | `dead_or_redirected` | `repurposed` | The original domain now hosts an independent creditor initiative that explicitly states it is not operated by the CoinFLEX company. |

## Observed URLs and targets

- **Coinbase Pro:** https://pro.coinbase.com/ -> https://www.coinbase.com/advanced-trade/spot/BTC-USD
- **LocalCryptos:** https://localcryptos.com/
- **CoinGather:** https://www.coingather.com/
- **BitMarket.eu:** https://bitmarket.eu/
- **Stocks.exchange:** https://stocks.exchange/
- **SouthXchange:** https://www.southxchange.com/
- **AEX:** https://www.aex.com/ -> https://aex.com/
- **BCM Exchange:** https://www.bcmtoday.com/ -> https://www.bcmtoday.com/en
- **BITBOX:** https://www.bitbox.me/
- **AlfaCashier:** https://www.alfacashier.com/ -> https://www.alfa.cash/
- **Bingbon:** https://www.bingbon.com/ -> https://bingx.com/
- **Anyswap:** https://anyswap.exchange/
- **CoinFLEX:** https://coinflex.com/

## Safety notes

- No `official_url_original` value was removed or replaced.
- No `archived_url` value was removed or replaced.
- Ambiguous current behavior is represented as `unknown` or `live_unverified`, not guessed as `dead_domain`.
- `last_verified_at` is updated to 2026-06-19 for the 13 audited records.
- The CI allowlist intentionally excludes the legacy convenience values `partial`, `offline`, `rebranded`, `redirected_or_retired`, `redirect_or_acquired`, and `dead_or_redirected`.

## Completion checks

- invalid `official_url_status`: observed 0
- canonical entity count: unchanged
- historical original URLs: preserved
- archive references: preserved
- strict CI command: `npm run data:check-official-url-statuses`
- reviewed public counts remain 412 entities / 687 events / 1594 evidence
