# Scan: verified-unadded rows 0101-0150

Status: invalidated — candidate-source drift detected

This scan must not be used for record promotion or candidate consumption.

The candidate IDs and names in the previous document no longer match the current source file:

- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- current source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`

The stale classification was removed to prevent incorrect ID/name mapping. Rebuild this range from the current JSONL and add a machine-readable `hei_unadded_0101-0150-scan.json` manifest before using it again.

Until that rebuild is merged, all rows in this range remain unconsumed candidate-pool entries.
