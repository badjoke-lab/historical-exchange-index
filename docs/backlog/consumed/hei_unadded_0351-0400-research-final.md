# Range 0351-0400 final research cluster

Reviewed at: 2026-07-05

## Results

- `0351` Chaince -> `pending_thin`; no canonical record
- `0365` ChileBit -> `pending_thin`; no canonical record
- `0366` Chiliz -> `out_of_scope_or_duplicate`; blockchain and fan-token ecosystem rather than a distinct exchange entity in this review
- `0372` CITEX -> `hei_ex_000640`, inactive CEX
- `0375` Cleo -> parent Cleopatra `hei_ex_000641`, inactive DEX
- `0383` CODEX -> `pending_thin`; no canonical record
- `0384` CODEX Exchange -> `pending_thin`; identity collision unresolved and no canonical record
- `0395` Coinbe -> `pending_thin`; no canonical record
- `0397` Coinbit -> `pending_thin`; inactive source signal and unstable domain response were insufficient for a public-quality lifecycle record
- `0399` CoinCasso -> `hei_ex_000642`, inactive CEX
- `0400` CoinCex -> `pending_thin`; no canonical record

## Decision notes

CITEX is classified inactive because its historical exchange identity is supported by registry material while the former domain is now parked for sale; no terminal shutdown notice was recovered. Cleopatra consolidates the Cleo, Cleopatra CL, and Cleopatra Legacy identities under one parent record and is classified inactive because remaining liquidity exists but reviewed recent activity signals are weak. CoinCasso is classified inactive because a first-party development repository establishes the historical service identity while the former exchange domain is now repurposed for unrelated content. The remaining thin CEX candidates are not promoted without stronger operator, domain, and lifecycle evidence.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 6
- moved to pending_thin: 7
- moved to out_of_scope_or_duplicate: 1
- unresolved needs-research remaining: 0
- range status: closed

No Cloudflare or production deployment changes are included.
