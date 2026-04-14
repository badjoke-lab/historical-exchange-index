# HEI dead candidate ledger v2

## Basis
- Current main entities: 150
- Current main commit: `dba164d`
- Last merged batch: `hei_public_ready_batch_10_v3`
- Rule: Do not cut new batches from names already present in current main. Maintain this ledger as the persistent source of truth for candidate selection and batch burn-down.

## Existing in main: upgrade only
1. Bittrex Global — upgrade_existing — hei_ex_000031 — upgrade_only
2. BX Thailand — upgrade_existing — hei_ex_000117 — upgrade_only
3. COSS — re-review_existing — hei_ex_000118 — upgrade_only
4. Vaultoro — re-review_existing — hei_ex_000030 — upgrade_only

## Already merged from this ledger
1. Bitcurex — dead — hei_ex_000141 — A3 — merged
2. Tradehill — dead — hei_ex_000142 — A8 — merged
3. Coin.mx — dead — hei_ex_000143 — A10 — merged
4. Yunbi — dead — hei_ex_000148 — B5 — merged
5. Binance Uganda — shutdown — hei_ex_000145 — B10 — merged
6. Binance Jersey — shutdown — hei_ex_000149 — B11 — merged
7. Binance Singapore — rebrand_or_shutdown — hei_ex_000150 — B9 — merged

## Remaining A-tier backlog
1. AAX — dead — A1 — todo
   - Strong shutdown arc; needs final official terminal pin.
2. CampBX — dead — A2 — todo
   - Historic U.S. exchange; good chance of clean dead-side record.
3. Bleutrade — dead — A4 — todo
   - Shutdown-era evidence likely tractable.
4. BTC38 — dead — A5 — todo
   - Historic China exchange candidate.
5. Coinroom — dead — A6 — todo
   - Needs careful cause handling; do not force scam label.
6. Mercatox — dead — A7 — todo
   - Widely cited closure; needs cleaner final evidence pack.
7. LakeBTC — dead — A9 — todo
   - Historic exchange with likely archive-first path.
8. CryptoBridge — dead — A11 — todo
   - Historic closure candidate; evidence quality must be checked.
9. Bitsane — dead — A12 — todo
   - Needs careful evidence review; keep cause conservative.

## Remaining B-tier backlog
1. Bter — dead — B1 — todo
   - Historic exchange candidate.
2. C-CEX — dead — B2 — todo
   - Historic alt exchange candidate.
3. EmpoEx — dead — B3 — todo
   - Likely tractable but lower priority.
4. Comkort — dead — B4 — todo
   - Historic collapse candidate.
5. Cryptonit — dead — B6 — todo
   - Historic candidate; source quality uncertain.
6. CoinFalcon — dead_or_inactive — B7 — todo
   - Needs status confirmation before batching.
7. Abucoins — dead — B8 — todo
   - Low-volume candidate but plausible.
8. Coinbase Pro — rebrand — B12 — todo
   - Historical surface / lineage candidate, not dead-side collapse.

## Lineage / special handling watchlist
1. GDAX — rebrand — watchlist
   - Should be handled as lineage to Coinbase Exchange, not as a naive new dead-side entity.
2. Huobi Global — rebrand — watchlist
   - Likely predecessor/brand-transition relation to HTX.
3. OKEx — rebrand — watchlist
   - Likely predecessor/brand-transition relation to OKX.
4. Bittrex U.S. — shutdown — watchlist
   - Must stay separate from existing Bittrex Global record.

## Next cut hint
- Remaining A-tier count: 9
- After the last merged batch, only 9 A-tier names remain. The next 10-pack will require either one B-tier promotion or a refreshed ledger expansion.
