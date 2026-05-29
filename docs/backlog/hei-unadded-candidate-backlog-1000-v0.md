# HEI unadded candidate backlog 1000 v0

Status: working backlog, not public records.

This backlog is the canonical starting queue for record-growth work after the duplicate-cleanup incident. It exists to prevent ad-hoc single-candidate additions without first checking whether the exchange is already present.

## Rules before promoting any row

A row may not become a `records/exchanges/*.json` PR until all checks below are completed.

1. Search the public HEI site.
2. Check `data/entities.json` by name, slug, aliases, original domain, and original URL.
3. Check `records/exchanges/<slug>.json` directly.
4. Search the repository for name/domain/aliases.
5. Verify source evidence.
6. Confirm entity/event/evidence IDs are unused.
7. Run `npm run records:validate`.

## Row schema

```csv
candidate_backlog_id,candidate_name,slug_candidate,source_bucket,decision,priority,notes
```

## Source buckets

Rows are split into named seeds and source-acquisition slots.

- `seed_name_list`: known exchange/protocol names that still require full dedupe before use.
- `coingecko_cex`: source slot for CoinGecko exchange-list acquisition.
- `coingecko_dex`: source slot for CoinGecko decentralized-exchange acquisition.
- `coinmarketcap_spot`: source slot for CoinMarketCap spot-exchange acquisition.
- `cryptowisser_exchange_list`: source slot for Cryptowisser exchange-list acquisition.
- `cryptowisser_graveyard`: source slot for Cryptowisser graveyard acquisition.
- `ccxt_supported_exchanges`: source slot for CCXT supported-exchange acquisition.
- `defillama_dexs`: source slot for DeFiLlama DEX/protocol acquisition.
- `github_issues_submissions`: source slot for user-submitted candidate acquisition.
- `regulatory_watchlists`: source slot for regulatory/sanctions candidate acquisition.
- `news_shutdown_queries`: source slot for shutdown/withdrawal-halted news acquisition.

## Named seed rows

These are not cleared for direct addition. They are only the initial dedupe queue.

```csv
candidate_backlog_id,candidate_name,slug_candidate,source_bucket,decision,priority,notes
hei_cand_0001,Aftermath Finance,aftermath-finance,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0002,Alpaca,alpaca,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0003,Apex Pro,apex-pro,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0004,Arkham Exchange,arkham-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0005,AscendEX,ascendex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0006,Backpack Exchange,backpack-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0007,Bequant,bequant,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0008,BigONE,bigone,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0009,Binance,binance,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0010,Binance US,binance-us,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0011,BingX,bingx,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0012,Bit2C,bit2c,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0013,Bitbank,bitbank,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0014,Bitbns,bitbns,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0015,Bitfinex,bitfinex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0016,bitFlyer,bitflyer,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0017,Bitget,bitget,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0018,Bithumb,bithumb,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0019,BitMart,bitmart,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0020,BitMEX,bitmex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0021,BitoPro,bitopro,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0022,Bitrue,bitrue,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0023,Bitso,bitso,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0024,Bitstamp,bitstamp,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0025,BitTrade,bittrade,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0026,Bitvavo,bitvavo,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0027,Blockchain.com Exchange,blockchain-com-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0028,BloFin,blofin,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0029,BTCBOX,btcbox,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0030,BTC Markets,btc-markets,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0031,BtcTurk,btcturk,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0032,Bullish,bullish,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0033,Bybit,bybit,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0034,CEX.IO,cex-io,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0035,Coinbase,coinbase,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0036,Coinbase Exchange,coinbase-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0037,Coincheck,coincheck,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0038,CoinEx,coinex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0039,Coinmate,coinmate,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0040,Coinmetro,coinmetro,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0041,Coinone,coinone,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0042,CoinSpot,coinspot,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0043,Crypto.com Exchange,crypto-com-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0044,Deribit,deribit,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0045,DigiFinex,digifinex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0046,EXMO,exmo,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0047,Gate.io,gate-io,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0048,Gemini,gemini,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0049,HitBTC,hitbtc,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0050,HTX,htx,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0051,Independent Reserve,independent-reserve,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0052,Indodax,indodax,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0053,Kraken,kraken,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0054,KuCoin,kucoin,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0055,LATOKEN,latoken,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0056,LBank,lbank,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0057,Luno,luno,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0058,Mercado Bitcoin,mercado-bitcoin,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0059,MEXC,mexc,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0060,NDAX,ndax,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0061,NovaDAX,novadax,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0062,OKX,okx,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0063,One Trading,one-trading,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0064,Paymium,paymium,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0065,Phemex,phemex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0066,Poloniex,poloniex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0067,Upbit,upbit,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0068,Waves.Exchange,waves-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0069,WEEX,weex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0070,WhiteBIT,whitebit,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0071,WOO X,woo-x,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0072,XT.com,xt-com,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0073,YoBit,yobit,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0074,Zaif,zaif,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0075,ZebPay,zebpay,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0076,Uniswap,uniswap,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0077,PancakeSwap,pancakeswap,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0078,SushiSwap,sushiswap,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0079,Curve Finance,curve-finance,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0080,Balancer,balancer,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0081,Bisq,bisq,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0082,Hodl Hodl,hodl-hodl,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0083,Paxful,paxful,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0084,AgoraDesk,agoradesk,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0085,LocalCryptos,localcryptos,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0086,AAX,aax,seed_name_list,known_existing_do_not_add,P0,Already seen on public HEI site; do not add as new record.
hei_cand_0087,Atom Asset Exchange,atom-asset-exchange,seed_name_list,known_existing_do_not_add,P0,Alias/context for AAX; do not add as new record without conflict review.
hei_cand_0088,Einstein Exchange,einstein-exchange,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0089,Coinroom,coinroom,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0090,Liqui,liqui,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0091,CoinNest,coinnest,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0092,BX.in.th,bx-in-th,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0093,Justcoin,justcoin,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0094,C-CEX,c-cex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0095,Gatecoin,gatecoin,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0096,MintPal,mintpal,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0097,Vircurex,vircurex,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0098,Bitcoinica,bitcoinica,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0099,Bitcoin-24,bitcoin-24,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
hei_cand_0100,CampBX,campbx,seed_name_list,candidate_needs_dedupe,P2,Must pass full duplicate and evidence checks before PR.
```

## Source-acquisition rows 0101-1000

Rows `hei_cand_0101` through `hei_cand_1000` are reserved as source-acquisition slots. They are not names yet. They must be filled by fetching and normalizing external source lists.

Pattern:

```csv
candidate_backlog_id,candidate_name,slug_candidate,source_bucket,decision,priority,notes
hei_cand_0101,TBD_FROM_COINGECKO_CEX_0001,tbd-coingecko-cex-0001,coingecko_cex,source_slot_needs_fetch,P3,Fetch source item then dedupe before promotion.
hei_cand_0102,TBD_FROM_COINGECKO_DEX_0002,tbd-coingecko-dex-0002,coingecko_dex,source_slot_needs_fetch,P3,Fetch source item then dedupe before promotion.
...
hei_cand_1000,TBD_FROM_NEWS_SHUTDOWN_QUERIES_0900,tbd-news-shutdown-queries-0900,news_shutdown_queries,source_slot_needs_fetch,P3,Fetch source item then dedupe before promotion.
```

The source bucket rotates through the 10 source buckets listed above. This gives exactly 900 source-acquisition slots plus 100 named seed rows = 1000 backlog rows.

## Counts

```text
named seed rows: 100
source-acquisition slots: 900
total backlog rows: 1000
```

## Operational note

This backlog intentionally marks AAX as existing because the public site already shows it. It must not be added as a new record.
