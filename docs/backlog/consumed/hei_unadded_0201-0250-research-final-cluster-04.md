# Research cluster 04 — final range closure

Reviewed at: 2026-07-04

## Rows

- `0211` Bithesap
- `0245` BLEX
- `0246` Blitz AMM
- `0248` Blockbid
- `0250` Blockchain.io

## Results

| candidate | result |
|---|---|
| Bithesap | Reclassified to `pending_thin`; no canonical record. |
| BLEX | Reclassified to `pending_thin`; no canonical record. |
| Blitz AMM | Added as `hei_ex_000596` Blitz Exchange, `inactive`. |
| Blockbid | Added as `hei_ex_000597`, `inactive`. |
| Blockchain.io | Added as `hei_ex_000598`, `inactive`. |

## Bithesap decision

Only thin exchange-directory references were recovered. The review did not establish a reliable original operator, official domain, primary launch source, or terminal lifecycle. The candidate remains non-canonical.

## BLEX decision

Search results were ambiguous and mixed unrelated products, low-quality promotional material, and unsupported allegations. No clear first-party exchange identity or defensible lifecycle was recovered. The candidate remains non-canonical and is not labeled fraudulent.

## Blitz Exchange decision

The backlog name `Blitz AMM` was corrected because first-party materials describe an order-book DEX for spot and perpetuals rather than an AMM. Blitz launched on Blast through Vertex Edge in March 2024. Current trackers show no active trading pairs, volume, or open interest, so the record is classified `inactive` without a death date.

## Blockbid decision

Blockbid opened a functional public beta on April 16, 2018 after AUSTRAC registration. Its former exchange domain is now offline, but no first-party closure notice or reliable exact terminal date was recovered. The record is therefore `inactive`, not `dead`.

## Blockchain.io decision

Blockchain.io was created by the Paymium team as a France-based altcoin exchange and publicly launched around January 2019. Current sources indicate that its services and brand were integrated into Paymium and the original domain redirects to the parent platform. Because the integration date is not reliably established, the record remains `inactive` rather than being forced into `merged` or `rebranded`.

## Batch output

- new entities: 3
- new events: 4
- new evidence: 12
- moved to pending_thin: 2
- duplicate entities: 0

## Range closure

```text
promoted add_now:          7
promoted research:         8
pending_thin:             30
excluded:                  5
total rows:               50
range status:             closed
```

No Cloudflare or deployment changes are included.
