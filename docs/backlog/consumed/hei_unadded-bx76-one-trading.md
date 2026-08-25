# BX76 consumed candidate — One Trading

Status: consumed by reviewed implementation  
Date: 2026-08-25

## Resolution

The prior D-1000 duplicate warning around One Trading was valid for thin routine growth: One Trading could not be added as an unrelated exchange because canonical Bitpanda Pro already documented the same rebrand continuity. BX76 resolves that ambiguity through explicit lineage rather than bypassing the overlap gate.

Reviewed result:

```text
Bitpanda Pro hei_ex_000585 rebranded -> One Trading hei_ex_001171 active
```

The predecessor record already carried the exact 2023-06-28 spin-out/rebrand event. Fresh current first-party One Trading material now supports the successor as a separately reviewable continuing venue operated by One Trading Exchange B.V. in the Netherlands.

## Durable IDs

```text
Entity:   hei_ex_001171
Event:    hei_ev_010154
Evidence: hei_src_012647..hei_src_012650
```

Candidate labels and historical backlog rows are discovery inputs only; the durable authority is the merged canonical record and reviewed lineage disposition.

## Boundary

Do not recreate One Trading as an unrelated duplicate of Bitpanda Pro. Future One Trading lifecycle updates belong to `hei_ex_001171`; historical Bitpanda Global Exchange / Bitpanda Pro events remain on `hei_ex_000585`.
