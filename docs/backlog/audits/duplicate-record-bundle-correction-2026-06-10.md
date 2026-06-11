# Duplicate Record Bundle Correction — 2026-06-10

A repository-wide canonical-to-bundle identity comparison identified duplicate entity bundles.
Confirmed duplicates were removed and useful event/evidence material was migrated to the pre-existing canonical entity IDs.

| Removed bundle | Removed ID | Canonical ID | Events migrated | Evidence migrated |
|---|---|---|---:|---:|
| `quadrigacx.json` | `hei_ex_000427` | `hei_ex_000004` | 3 | 7 |
| `btc-e.json` | `hei_ex_000424` | `hei_ex_000005` | 2 | 6 |
| `coinbase.json` | `hei_ex_000419` | `hei_ex_000012` | 2 | 6 |
| `bitfinex.json` | `hei_ex_000426` | `hei_ex_000017` | 3 | 7 |
| `bitmex.json` | `hei_ex_000425` | `hei_ex_000062` | 3 | 6 |
| `backpack.json` | `hei_ex_000364` | `hei_ex_000068` | 0 | 1 |
| `nobitex.json` | `hei_ex_000423` | `hei_ex_000073` | 2 | 6 |
| `cobinhood.json` | `hei_ex_000319` | `hei_ex_000114` | 1 | 2 |
| `altsbit.json` | `hei_ex_000336` | `hei_ex_000115` | 3 | 3 |
| `wex.json` | `hei_ex_000342` | `hei_ex_000116` | 3 | 3 |
| `localbitcoins.json` | `hei_ex_000341` | `hei_ex_000124` | 2 | 4 |
| `coinsetter.json` | `hei_ex_000329` | `hei_ex_000125` | 1 | 4 |
| `bitfront.json` | `hei_ex_000316` | `hei_ex_000128` | 2 | 4 |
| `youbit.json` | `hei_ex_000335` | `hei_ex_000130` | 3 | 5 |
| `clevercoin.json` | `hei_ex_000330` | `hei_ex_000134` | 2 | 4 |
| `the-rock-trading.json` | `hei_ex_000318` | `hei_ex_000139` | 2 | 4 |
| `bitsane.json` | `hei_ex_000337` | `hei_ex_000154` | 3 | 5 |
| `bter.json` | `hei_ex_000334` | `hei_ex_000155` | 3 | 5 |
| `acx.json` | `hei_ex_000331` | `hei_ex_000164` | 3 | 5 |
| `vebitcoin.json` | `hei_ex_000320` | `hei_ex_000204` | 2 | 3 |
| `bitmarket.json` | `hei_ex_000321` | `hei_ex_000207` | 1 | 2 |
| `balancer.json` | `hei_ex_000357` | `hei_ex_000228` | 1 | 3 |
| `fcoin.json` | `hei_ex_000322` | `hei_ex_000249` | 1 | 1 |
| `bitfloor.json` | `hei_ex_000333` | `hei_ex_000256` | 1 | 3 |
| `litebit.json` | `hei_ex_000317` | `hei_ex_000283` | 0 | 1 |
| `bit-trade-australia.json` | `hei_ex_000332` | `hei_ex_000285` | 1 | 4 |
| `localmonero.json` | `hei_ex_000340` | `hei_ex_000294` | 2 | 5 |

## Explicitly retained distinct entities

- Bittrex Global and Bittrex remain separate entities under the existing methodology decision.
- BitTrade Australia and the separate BitTrade record remain distinct pending any later evidence-backed relationship decision.

## Validation changes

- Canonical-to-bundle identity comparison now runs before other record validation.
- The Records validation workflow now uses `set -o pipefail`, so failures cannot be hidden by output piping.
