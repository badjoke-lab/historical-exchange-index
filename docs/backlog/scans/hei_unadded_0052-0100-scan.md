# Scan: verified-unadded rows 0052-0100

Status: scan only

## Purpose

Apply the revised HEI record-addition policy to verified-unadded rows `hei_unadded_0052` through `hei_unadded_0100`.

This scan does not create record bundles and does not mark rows as consumed. It classifies the range so that the next PR can add only public-quality records with meaningful events or stronger evidence.

## Policy used

- Do not add thin active records based only on database references.
- Do not create single-candidate pending PRs for thin rows.
- Treat the verified-unadded list as a candidate pool, not as a strict one-row-at-a-time queue.
- Prefer records with meaningful events: shutdown, incident, exploit, rebrand, acquisition, regulatory action, launch, or clearly documented exchange/protocol start.
- Batch add around 5 records per PR once `add_now` candidates are selected.

## Source range checked

- `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- start: `hei_unadded_0052`
- end: `hei_unadded_0100`

## Classification summary

| class | count | meaning |
|---|---:|---|
| add_now | 0 | Ready for immediate record bundle in this scan pass |
| needs_research | 12 | Potential HEI fit, but requires source/event confirmation before adding |
| pending_thin | 24 | DB/reference-only, no clear event or official evidence confirmed in this pass |
| out_of_scope_or_duplicate | 13 | Likely non-exchange category, duplicate rows, or not HEI v0 priority |

## Needs research

These are the most useful candidates to investigate next. They are not consumed yet.

| candidate_id | name | slug/domain | source | reason |
|---|---|---|---|---|
| hei_unadded_0052 / 0053 | ALEX | alexgo / alexlab.co; alex | CoinGecko + DefiLlama | Duplicate rows likely refer to the same Stacks DEX/protocol; has domain and may have enough launch/protocol evidence after research. |
| hei_unadded_0054 | Algofi Swap | algofi-swap | DefiLlama | Algorand DEX/protocol candidate; likely has shutdown/wind-down history worth checking. |
| hei_unadded_0056 / 0055 | Alien Base V3 / V2 | app.alienbase.xyz | CoinGecko + DefiLlama | Duplicate/versioned DEX candidate; official app domain exists for V3, but version split should be handled carefully. |
| hei_unadded_0060 | ALP.COM | alp.com / btc-alpha | CoinGecko | Possible continuation/rebrand of BTC-Alpha; requires identity check before any record. |
| hei_unadded_0068 | Altcoin Trader | altcoin-trader | CoinPaprika | `inactive_or_dead` signal; requires official/domain/news confirmation. |
| hei_unadded_0072 | AltMarkets | altmarkets | CoinPaprika | Possible old/small exchange; needs domain/history verification. |
| hei_unadded_0073 | AltQuick.com | altquickcom | CoinPaprika | Old exchange-like candidate; needs domain/history verification. |
| hei_unadded_0086 | Anycoin Direct | anycoin-direct | CoinPaprika | Active exchange/broker-like candidate; only add if HEI scope decision accepts broker/exchange services and evidence is strong. |
| hei_unadded_0087 | AOFEX | aofex | CoinPaprika | Possible CEX with historical issues; needs source review. |
| hei_unadded_0093 / 0094 / 0095 | ApeSwap / ApeSwap BSC / ApeSwap AMM | apeswap.finance | CoinPaprika + CoinGecko + DefiLlama | Duplicate rows for same DEX/protocol; likely addable only as one entity after scope and event/history check. |
| hei_unadded_0096 | apex | apex | CCXT | Exchange-like candidate from CCXT; requires identity disambiguation before use. |
| hei_unadded_0099 / 0100 | ApolloX / ApolloX DEX | apollox / apollox-dex | CoinPaprika | Duplicate or related exchange/DEX rows; may have incident/history sources, needs research. |

## Pending-thin candidates

These are not good immediate records under the revised policy because they currently have database-style references only, weak or missing domains, and no confirmed meaningful event in this scan pass.

| candidate_id | name | reason |
|---|---|---|
| hei_unadded_0057 | AlienFi | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0058 | Alita Finance | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0063 | AlphaEX | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0064 | AlphaQ | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0065 | AlphaSec Spot | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0066 | Alphix | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0069 | Alterdice | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0070 | Alteumx | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0071 | Althea DEX | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0074 | Amanpuri | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0075 | Amaterasu Finance | CoinGecko/app domain exists, but no event/history confirmed. |
| hei_unadded_0076 | Ambient | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0078 | Amoveo | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0079 | Amped Finance | DefiLlama row only; no event/history confirmed in this pass. |
| hei_unadded_0080 | Ampleswap | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0081 | Amsterdex | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0082 | Angstrom | DefiLlama DEX row only; no event/history confirmed. |
| hei_unadded_0084 | AnonEx | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0085 | Antfarm (Ethereum) | CoinGecko/app domain exists, but no event/history confirmed. |
| hei_unadded_0091 / 0092 | ApertureSwap | CoinPaprika + CoinGecko duplicate rows; no event/history confirmed. |
| hei_unadded_0097 | Apex DeFi | DefiLlama DEX row only; needs disambiguation with `apex`. |
| hei_unadded_0098 | Aphelion | CoinPaprika row only; potentially historical but no source confirmation in this pass. |

## Out of scope / duplicate / v0-deprioritized

| candidate_id | name | reason |
|---|---|---|
| hei_unadded_0059 | Allbridge Classic | DefiLlama category is Bridge; not an exchange/DEX v0 record without stronger exchange-specific reason. |
| hei_unadded_0061 | alpaca | CCXT row likely brokerage/trading API, not clearly crypto exchange registry target. |
| hei_unadded_0062 | Alpha Arcade | DefiLlama category is Prediction Market; out of HEI v0 exchange scope. |
| hei_unadded_0067 | Alt Fun | DefiLlama category is Launchpad; out of HEI v0 exchange scope. |
| hei_unadded_0077 | Amigo | DefiLlama category is SoFi; out of HEI v0 exchange scope. |
| hei_unadded_0083 | Anome | DefiLlama category is NFT Marketplace; out of HEI v0 exchange scope. |
| hei_unadded_0088 | Ape Church | DefiLlama category is Luck Games; out of HEI v0 exchange scope. |
| hei_unadded_0089 | Ape Jupiter | DefiLlama category is Launchpad; out of HEI v0 exchange scope. |
| hei_unadded_0090 | Ape.Store | DefiLlama category is Launchpad; out of HEI v0 exchange scope. |
| hei_unadded_0094 / 0095 | ApeSwap BSC / ApeSwap AMM | Likely duplicate of ApeSwap row; do not create separate records in v0. |
| hei_unadded_0100 | ApolloX DEX | Likely duplicate/related to ApolloX; handle as one entity unless research proves separate entity. |

## Recommended next action

1. Research the `needs_research` group only.
2. Select roughly five candidates with meaningful event/source coverage.
3. Create one batch PR with record bundles and a single consumed batch memo.
4. Do not open individual pending PRs for `pending_thin` rows.
5. If several thin rows remain unresolved, later create one pending-batch note for the full scan range.

## First likely batch candidates

Recommended research order:

1. ALEX (`hei_unadded_0052` / `0053`)
2. Algofi Swap (`hei_unadded_0054`)
3. ApeSwap (`hei_unadded_0093` / `0094` / `0095`)
4. ApolloX (`hei_unadded_0099` / `0100`)
5. Altcoin Trader or AOFEX (`hei_unadded_0068` / `0087`)

These are not yet approved for record creation; they are the next research targets for a batch add.
