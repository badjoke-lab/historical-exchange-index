# Scan: verified-unadded rows 0251-0300

Status: reviewed initial scan / actionable rows open

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0251-0300-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-04`

## Classification summary

| class | count |
|---|---:|
| add_now | 8 |
| needs_research | 16 |
| pending_thin | 16 |
| out_of_scope_or_duplicate | 10 |

## Add-now queue

- `0252` Blocktrade
- `0270` Braziliex
- `0275` BTC-Alpha
- `0278` BTCBOX
- `0281` btcmarkets / BTC Markets
- `0288` Buda
- `0295` BuyUcoin
- `0297` BXH

These candidates have distinct exchange identities and strong evidence paths. They still require normal source review, lifecycle modeling, overlap checks, and CI before canonical promotion.

## Needs-research queue

- `0251` Blocktane — current operating identity and regional/legal scope need verification.
- `0255` Blue Planet — DEX identity, launch, and present activity need first-party evidence.
- `0260` BMEX — ambiguous name and exchange lineage require disambiguation.
- `0261` BMX Classic AMM — determine whether this is a separate protocol entity or a product/version row.
- `0269` bopAMM — verify protocol identity, launch, and current state.
- `0271` Brexily — operator and lifecycle evidence remain incomplete.
- `0272` BrownFi — multi-chain DEX identity needs first-party lifecycle evidence.
- `0279` BTCEX — distinguish the exchange entity from similarly named services.
- `0282` BTCMEX — historical derivatives-exchange lifecycle and terminal state need reconstruction.
- `0283` BTCsquare — historical exchange identity and terminal state need stronger sources.
- `0284` BtcTrade.im — original operator, domain, and end state need verification.
- `0287` BTSE Futures — resolve product-row versus canonical BTSE entity treatment.
- `0289` Buenbit — exchange versus broker/fintech scope needs explicit treatment.
- `0294` BurrBear — DEX launch and current activity need first-party verification.
- `0296` BW — historical exchange identity and terminal/rebrand state require research.
- `0300` Bybit EU — determine whether the regulated regional platform warrants a separate entity or belongs under Bybit.

## Pending thin

`0254`, `0256`, `0259`, `0262`-`0265`, `0268`, `0273`-`0274`, `0276`-`0277`, `0280`, `0285`-`0286`, `0290`.

These rows currently rely mainly on tracker presence, ambiguous names, or insufficient lifecycle evidence and remain non-canonical.

## Out of scope or product/version rows

- `0253` Bloom Trading Bot — trading bot, not an exchange entity.
- `0257` Blum — launchpad/service rather than an exchange entity for this range.
- `0258` Blur Bids — NFT marketplace activity.
- `0266` BONKbot — Telegram trading bot.
- `0267` boop.fun — launchpad.
- `0291` Bullpen Prediction Markets — prediction-market interface.
- `0292` BullX — Telegram trading bot.
- `0293` Bunni V2 — version row; requires canonical protocol-level handling rather than direct promotion.
- `0298` Bybit Spot — product/market row under Bybit.
- `0299` Bybit Derivative Exchange — product/market row under Bybit.

## First execution order

1. Historical and incident-rich batch: Braziliex, BTC-Alpha, and BXH.
2. Active regulated CEX batch: Blocktrade, BTCBOX, BTC Markets, Buda, and BuyUcoin.
3. Resolve BTSE Futures and Bybit EU identity boundaries.
4. Process the remaining research rows in small evidence-backed batches.
5. Keep pending-thin rows non-canonical unless stronger evidence appears.

## Current range position

```text
range records:                 50
unresolved add_now:             8
unresolved needs_research:     16
pending_thin:                  16
out_of_scope_or_duplicate:     10
range status:                  open
```

## Next step

Draft the first reviewed batch for Braziliex, BTC-Alpha, and BXH.
