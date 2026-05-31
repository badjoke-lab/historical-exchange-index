# Scan: verified-unadded rows 0151-0200

Status: scan only

## Purpose

Apply the revised HEI record-addition policy to verified-unadded rows `hei_unadded_0151` through `hei_unadded_0200`.

This scan does not create record bundles and does not mark rows as consumed. It expands the research pool for future batch record additions while avoiding thin one-by-one active records.

## Policy used

- Do not add thin active records based only on database references.
- Do not create single-candidate pending PRs for thin rows.
- Treat the verified-unadded list as a candidate pool, not as a strict one-row-at-a-time queue.
- Prefer records with meaningful events: shutdown, incident, exploit, rebrand, acquisition, regulatory action, launch, or clearly documented exchange/protocol start.
- Collapse version/deployment duplicates into one entity unless research proves otherwise.

## Source range checked

- `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- start: `hei_unadded_0151`
- end: `hei_unadded_0200`

## Classification summary

| class | count | meaning |
|---|---:|---|
| add_now | 0 | Ready for immediate record bundle in this scan pass |
| needs_research | 17 | Potential HEI fit, but requires source/event confirmation before adding |
| pending_thin | 26 | DB/reference-only, no clear event or official evidence confirmed in this pass |
| out_of_scope_or_duplicate | 7 | Likely non-exchange category, version/deployment duplicate, or not HEI v0 priority |

## Needs research

These are the most useful candidates to investigate next. They are not consumed yet.

| candidate_id | name | slug/domain | source | reason |
|---|---|---|---|---|
| hei_unadded_0153 / 0154 | AuroraSwap | swap.auroraswap.net | CoinGecko + DefiLlama | Duplicate DEX rows with domain; needs official/history/event confirmation. |
| hei_unadded_0155 / 0156 | AutoShark / AutoShark Finance | autoshark.finance | DefiLlama + CoinGecko | Duplicate/related DEX rows; possible historical BSC DeFi candidate, needs source review. |
| hei_unadded_0158 | AUX Exchange | aux-exchange | DefiLlama | Aptos DEX candidate; needs official/history/event confirmation. |
| hei_unadded_0159 | Axial | axial | DefiLlama | Avalanche DEX/stable-swap candidate; needs official/history/event confirmation. |
| hei_unadded_0160 / 0161 | Azbit | azbit.com | CoinPaprika + CoinGecko | CEX candidate with domain; needs event/history confirmation before adding. |
| hei_unadded_0162 | B2BX | b2bx | CoinPaprika | CEX/liquidity venue candidate; needs domain/history verification. |
| hei_unadded_0166 / 0167 | BabyDogeSwap | babydogeswap.com | CoinPaprika + CoinGecko | Duplicate DEX rows with domain; needs official/history/event confirmation. |
| hei_unadded_0168 / 0169 | BabySwap | exchange.babyswap.finance | CoinPaprika + CoinGecko | Duplicate DEX rows with domain; needs official/history/event confirmation. |
| hei_unadded_0170 | Backpack | backpack | CCXT | Active exchange candidate; likely addable only if active CEX seed policy is used with strong launch evidence. |
| hei_unadded_0171 / 0172 | BakerySwap | bakeryswap.org | CoinPaprika + CoinGecko | Duplicate DEX rows; needs official/history/event confirmation. |
| hei_unadded_0173 / 0174 | Balanced / Balanced Exchange | balanced.network | CoinGecko + DefiLlama | Duplicate DEX/protocol rows; needs official/history/event confirmation. |
| hei_unadded_0175 / 0176 / 0177 / 0178 / 0179 / 0180 / 0181 | Balancer variants | balancer-* | CoinPaprika + DefiLlama | Major DEX/protocol with version/deployment rows; likely addable as one entity after duplicate handling and historical evidence. |
| hei_unadded_0182 / 0183 / 0184 / 0185 / 0186 | Bancor variants | bancor.network / try.bancor.network | CoinGecko + CoinPaprika + DefiLlama | Major DEX/protocol with history and incidents; likely addable as one entity after duplicate handling. |
| hei_unadded_0188 | Bankera | bankera | CoinPaprika | Exchange/broker-like candidate; needs scope and history verification. |
| hei_unadded_0190 / 0191 | Baryon Network | baryon.network | CoinGecko + DefiLlama | Duplicate DEX rows with domain; needs official/history/event confirmation. |
| hei_unadded_0193 | Baseline (Base) | app.baseline.markets | CoinGecko | DEX candidate with app domain; needs official/history/event confirmation. |
| hei_unadded_0194 / 0195 / 0196 / 0197 | BaseSwap V2 / V3 | baseswap.fi | CoinPaprika + DefiLlama + CoinGecko | Versioned DEX rows; likely one entity if added, but needs event/history confirmation. |

## Pending-thin candidates

These are not good immediate records under the revised policy because they currently have database-style references only, weak or missing domains, and no confirmed meaningful event in this scan pass.

| candidate_id | name | reason |
|---|---|---|
| hei_unadded_0151 | Auragi Finance | DefiLlama DEX row only; no domain/event confirmed. |
| hei_unadded_0152 | AuraSwap | DefiLlama DEX row only; no domain/event confirmed. |
| hei_unadded_0157 | Autradex Systems | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0164 | B4U Wallet | CoinPaprika row only and wallet-like name; no domain/event confirmed. |
| hei_unadded_0165 | BabyDoge Algebra | DefiLlama DEX row only; likely related to BabyDogeSwap, no event confirmed. |
| hei_unadded_0187 | BankCEX | CoinPaprika row only; no domain/event confirmed. |
| hei_unadded_0189 | BarterSwap Superposition | DefiLlama DEX row only; no domain/event confirmed. |
| hei_unadded_0198 | BaseX | DefiLlama DEX row only; no domain/event confirmed. |
| hei_unadded_0199 | Basin Exchange | DefiLlama DEX row only; no domain/event confirmed. |
| hei_unadded_0200 | Batonex | CoinPaprika row only; no domain/event confirmed. |

## Out of scope / duplicate / v0-deprioritized

| candidate_id | name | reason |
|---|---|---|
| hei_unadded_0163 | b402 | DefiLlama category is Payments; out of HEI v0 exchange scope. |
| hei_unadded_0175 / 0176 / 0177 / 0178 / 0179 / 0180 / 0181 | Balancer deployment/version rows | Do not create separate v0 records; handle as one Balancer entity if added. |
| hei_unadded_0183 / 0184 / 0185 / 0186 | Bancor version/name rows | Do not create separate v0 records; handle as one Bancor entity if added. |
| hei_unadded_0192 | Based Predict | DefiLlama category is Interface; out of HEI v0 exchange scope. |
| hei_unadded_0194 / 0195 / 0196 / 0197 | BaseSwap version rows | Do not create separate v0 records before identity handling. |

## Recommended next action

1. Add this scan to preserve batch classification.
2. Start first real batch with major candidates that can support event-backed records.
3. Prioritize Balancer and Bancor because they are major DEX/protocol entities with stronger historical coverage potential.
4. Combine with earlier candidates such as Algofi Swap, ALEX, Astroport, ApeSwap, and ApolloX.
5. Keep one entity per protocol in v0; do not split by version/deployment.

## Combined shortlist after this scan

Recommended research order now:

1. Balancer (`0175`-`0181`) — major DEX/protocol, likely addable as one entity.
2. Bancor (`0182`-`0186`) — major DEX/protocol, likely addable as one entity.
3. Algofi Swap (`0054`) — likely shutdown/sunset candidate.
4. ALEX (`0052` / `0053`) — possible exploit/incident candidate.
5. Astroport (`0137`-`0141`) — major DEX with Terra/version history.
6. ApeSwap (`0093`-`0095`) — major DEX/protocol candidate.
7. ApolloX (`0099` / `0100`) — exchange/DEX candidate with possible incident history.
8. Backpack (`0170`) — active CEX seed candidate if active seed policy is used.

These are not yet approved for record creation; they are the next research targets for a batch add.
