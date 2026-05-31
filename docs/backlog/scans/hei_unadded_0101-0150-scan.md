# Scan: verified-unadded rows 0101-0150

Status: scan only

## Purpose

Apply the revised HEI record-addition policy to verified-unadded rows `hei_unadded_0101` through `hei_unadded_0150`.

This scan does not create record bundles and does not mark rows as consumed. It expands the research pool for future batch record additions while avoiding thin one-by-one active records.

## Policy used

- Do not add thin active records based only on database references.
- Do not create single-candidate pending PRs for thin rows.
- Treat the verified-unadded list as a candidate pool, not as a strict one-row-at-a-time queue.
- Prefer records with meaningful events: shutdown, incident, exploit, rebrand, acquisition, regulatory action, launch, or clearly documented exchange/protocol start.
- Collapse version/deployment duplicates into one entity unless research proves otherwise.

## Source range checked

- `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- start: `hei_unadded_0101`
- end: `hei_unadded_0150`

## Classification summary

| class | count | meaning |
|---|---:|---|
| add_now | 0 | Ready for immediate record bundle in this scan pass |
| needs_research | 13 | Potential HEI fit, but requires source/event confirmation before adding |
| pending_thin | 24 | DB/reference-only, no clear event or official evidence confirmed in this pass |
| out_of_scope_or_duplicate | 13 | Likely non-exchange category, version/deployment duplicate, or not HEI v0 priority |

## Needs research

These are the most useful candidates to investigate next. They are not consumed yet.

| candidate_id | name | slug/domain | source | reason |
|---|---|---|---|---|
| hei_unadded_0102 / 0103 | Aquarius / Aquarius Stellar | aqua.network / aquarius-stellar | CoinGecko + DefiLlama | Likely duplicate Stellar DEX/protocol candidate; has domain and may be addable if launch/history evidence is confirmed. |
| hei_unadded_0110 | Arbswap | arbswap.io | CoinGecko | DEX candidate with domain; needs official/history/event confirmation. |
| hei_unadded_0112 / 0113 | ArcherSwap / Archerswap | exchange.archerswap.finance | CoinGecko + CoinPaprika | Duplicate rows likely same DEX; needs official/history/event confirmation. |
| hei_unadded_0114 / 0115 | Archly V1 / Archly V2 | archly-v1 / archly-v2 | DefiLlama | Versioned DEX candidate; may need one entity or version note if research supports it. |
| hei_unadded_0116 / 0117 | Arena DEX | arena.trade | CoinGecko + DefiLlama | Duplicate rows; has domain and may be addable if event/source coverage is confirmed. |
| hei_unadded_0120 | arkham | arkham | CCXT | Exchange-like candidate from CCXT; requires identity/scope check because Arkham may be broader than exchange-only. |
| hei_unadded_0124 / 0125 | ArthSwap / ArthSwap V3 | app.arthswap.org | CoinGecko + DefiLlama | Versioned DEX candidate; may be addable as one entity with launch/protocol evidence. |
| hei_unadded_0132 / 0133 / 0134 / 0135 | Aster / Aster DEX / Aster Spot | asterdex.com | CCXT + CoinGecko + CoinPaprika + DefiLlama | Multiple duplicate/related rows; likely one entity if accepted, but needs identity and launch/history confirmation. |
| hei_unadded_0137 / 0138 / 0139 / 0140 / 0141 | Astroport variants | astroport.fi / app.astroport.fi | DefiLlama + CoinGecko + CoinPaprika | Multi-deployment/version candidate with Terra/Neutron history; likely addable only as one entity after handling chain/version notes. |
| hei_unadded_0143 | Astrovault | astrovault.io | CoinGecko | DEX candidate with domain; needs official/history/event confirmation. |
| hei_unadded_0145 | ATAIX | ataix | CoinPaprika | CEX-like candidate; needs domain/history verification. |
| hei_unadded_0149 | ATOMARS | atomars | CoinPaprika | CEX-like candidate; possible historical exchange; needs source review. |
| hei_unadded_0150 | AtomDax | atomdax | CoinPaprika | CEX-like candidate; needs domain/history verification. |

## Pending-thin candidates

These are not good immediate records under the revised policy because they currently have database-style references only, weak or missing domains, and no confirmed meaningful event in this scan pass.

| candidate_id | name | reason |
|---|---|---|
| hei_unadded_0104 | AquaSpace V3 | CoinGecko domain exists, but no event/history confirmed; may be launchpad/pump app adjacent. |
| hei_unadded_0105 | Aquifer | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0106 | AraguaneyBits | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0107 | Arbidex | CoinGecko domain exists, but no event/history confirmed. |
| hei_unadded_0108 / 0109 | Arbitrum Exchange V2 / V3 | Versioned DEX rows only; no domain/event confirmed. |
| hei_unadded_0111 | Arch Swap | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0121 | ArowEx | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0122 | ArtexSwap | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0123 | ArthBit | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0126 | Artis Turba | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0127 / 0128 | Ascent Exchange V1 / V3 | Versioned DefiLlama rows only; no domain/event confirmed. |
| hei_unadded_0129 | Ashswap | DefiLlama DEX row only; no event/history confirmed. |
| hei_unadded_0130 | Asia Exchange | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0131 | Asset Chain Swap | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0136 | Astrolescent | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0142 | AstroSwap | DefiLlama DEX row only; no domain confirmed. |
| hei_unadded_0144 | Asymetrex | CoinPaprika row only; no domain confirmed. |
| hei_unadded_0146 | Atlantis (Monad) | CoinGecko/app domain exists, but no event/history confirmed. |
| hei_unadded_0147 | Atmos DEX | DefiLlama DEX row only; no domain confirmed. |

## Out of scope / duplicate / v0-deprioritized

| candidate_id | name | reason |
|---|---|---|
| hei_unadded_0101 | Aqua | DefiLlama category is Telegram Bot; out of HEI v0 exchange scope. |
| hei_unadded_0118 | Arena Launch | DefiLlama category is Launchpad; out of HEI v0 exchange scope. |
| hei_unadded_0119 | Arena SocialFi | DefiLlama category is SoFi; out of HEI v0 exchange scope. |
| hei_unadded_0134 / 0135 | Aster DEX / Aster Spot | Likely duplicate/related to Aster; do not create separate records before identity research. |
| hei_unadded_0138 / 0139 / 0140 / 0141 | Astroport variants | Likely deployment/version duplicates of Astroport; do not create separate v0 records unless research proves distinct entities. |
| hei_unadded_0148 | Atmos Studio | DefiLlama category is Launchpad; out of HEI v0 exchange scope. |

## Recommended next action

1. Continue research on the combined `needs_research` pool from scans `0052-0100` and `0101-0150`.
2. Prioritize candidates with likely historical events or strong launch/protocol evidence.
3. Prefer one record per entity, not per version/deployment.
4. Create one batch PR only after roughly five candidates have enough evidence.
5. Do not open individual pending PRs for `pending_thin` rows.

## Combined shortlist after this scan

Recommended research order now:

1. Algofi Swap (`0054`) — likely shutdown/sunset candidate.
2. ALEX (`0052` / `0053`) — possible exploit/incident candidate.
3. Astroport (`0137` / `0138` / `0139` / `0140` / `0141`) — major DEX with Terra/version history.
4. ApeSwap (`0093` / `0094` / `0095`) — major DEX/protocol candidate.
5. ApolloX (`0099` / `0100`) — exchange/DEX candidate with possible incident history.
6. Aster (`0132` / `0133` / `0134` / `0135`) — duplicate group requiring identity handling.
7. Arbswap / ArcherSwap / ArthSwap — lower-priority DEX candidates.

These are not yet approved for record creation; they are the next research targets for a batch add.
