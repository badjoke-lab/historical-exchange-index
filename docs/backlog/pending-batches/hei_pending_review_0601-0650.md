# Pending review: verified-unadded rows 0601-0650

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0601-0650` before canonical record creation.

This window contains mostly database-only CEX rows, active-looking DEX/protocol rows, and a large Curve / Curve Finance cluster. Crema Finance was handled separately as an event-backed record and is not part of this memo.

No candidate in this scan was promoted directly to canonical records from this pass because the reviewed context did not yet provide enough public-ready event/evidence value or required cluster methodology decisions.

## Operating rule

Do not add database-only or `listed_reference`-only candidates to canonical records.

Canonical additions should have clear identity, meaningful event value, preferably two or more evidence items, safe URL/status handling, and no unresolved duplicate or scope concern.

## Classification summary

```text
add_now: 0
needs_research: 6
pending_thin: 20
active_seed_later: 7
out_of_scope_or_duplicate: 18
```

## needs_research

These may be HEI-relevant, but need stronger source, event, duplicate, or scope review before canonical inclusion.

```text
hei_unadded_0609 CrossTower
hei_unadded_0613 Cryptal
hei_unadded_0621 Cryptohub
hei_unadded_0633 Cube
hei_unadded_0636 Currency.com
hei_unadded_0639 Curve (Ethereum)
```

Notes:

- CrossTower, Cryptal, Cryptohub, Cube, and Currency.com are exchange-like but need stronger event/status evidence before canonical inclusion.
- Curve should be reviewed as a single protocol cluster, not as separate deployment rows.
- Curve may support an event-backed record later, but the source set needs to be strengthened before adding it.

## pending_thin

These were too thin for canonical record creation in this scan, usually database-only or listed-reference-only.

```text
hei_unadded_0601 CrescentSwap
hei_unadded_0602 CriptoHub
hei_unadded_0603 Criptoswaps
hei_unadded_0604 Crodex
hei_unadded_0605 Crodex
hei_unadded_0606 Cronaswap
hei_unadded_0607 Cropper CLMM
hei_unadded_0608 CROSS
hei_unadded_0610 CroSwap
hei_unadded_0611 CRXzone
hei_unadded_0612 Crypcore
hei_unadded_0614 Cryptex24
hei_unadded_0615 CryptloCEX
hei_unadded_0616 Crypto Hub
hei_unadded_0617 Crypto-Services
hei_unadded_0618 Cryptoa
hei_unadded_0619 Cryptobulls
hei_unadded_0622 CRYPTOINDEX
hei_unadded_0623 Cryptomate
hei_unadded_0624 Cryptomus
hei_unadded_0625 Crypton Exchange
hei_unadded_0626 Cryptonex
hei_unadded_0627 CryptoNick
hei_unadded_0628 Cryptoplanex
hei_unadded_0629 CryptoSwap
hei_unadded_0630 CryptoxxPro Exchange
hei_unadded_0631 Crypxie
hei_unadded_0632 CSWAP DEX
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

These look more suitable for a dedicated active CEX / DEX seed phase than for the current historical-event-first batch.

```text
hei_unadded_0620 cryptocom
hei_unadded_0634 Cube
hei_unadded_0635 CUBISwap
hei_unadded_0640 Curve DEX
hei_unadded_0641 Curve Finance
```

Notes:

- `cryptocom` should be handled in a dedicated active CEX seed phase or a specific event-backed review.
- Cube rows need cluster review before any record creation.
- Curve DEX and Curve Finance should be folded into a single Curve / Curve Finance cluster if added later.

## out_of_scope_or_duplicate

These appear to be chain/deployment/version variants, lending/product rows, or scope-mismatched rows.

```text
hei_unadded_0637 CurrentX V2
hei_unadded_0638 CurrentX V3
hei_unadded_0642 Curve Finance (Arbitrum)
hei_unadded_0643 Curve Finance (Avalanche)
hei_unadded_0644 Curve Finance (Base)
hei_unadded_0645 Curve Finance (Moonbeam)
hei_unadded_0646 Curve Finance (Optimism)
hei_unadded_0647 Curve Finance (Polygon)
hei_unadded_0648 Curve LlamaLend
hei_unadded_0649 Curve StableSwap (HyperEVM)
hei_unadded_0650 Curve TwoCrypto (Ethereum)
```

Notes:

- Curve chain/deployment rows should not become separate v0 entities.
- Curve LlamaLend is lending-category material and should not be folded into the exchange record without a scope decision.
- Curve StableSwap / TwoCrypto rows should be treated as pool/product variants under a Curve cluster if relevant.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: this scan includes several recognizable names, especially Curve, but adding them now would either create thin records or force unresolved cluster/deployment methodology decisions.

## Next action

1. Review Curve / Curve Finance separately as a possible event-backed DEX protocol record.
2. Look for official or high-quality reporting around Curve's major historical events before adding it.
3. Continue scanning `hei_unadded_0651-0700` while avoiding deployment-level record splitting.
4. Keep active platforms such as Crypto.com for a dedicated active CEX seed or event-backed review.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
