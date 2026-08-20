# Ledger Series Phase 9 Stage 5 relationship inventory — reviewed audit

Status: **ACCEPTED AUDIT / NO PUBLICATION AUTHORITY**  
Date: 2026-08-21 JST  
Authority: `config/ledger-series-phase9-stage5-audit-authority.json`  
Coordination: Issue #780

## Evidence

- Collector run: `32376869141`
- Artifact: `9409407512` (`phase9-stage5-relationship-audit`)
- Artifact digest: `sha256:b70c5729aa763993fe954fbc7aa8bdc13ce8bca1e0a4c05a563f869fd8c1020e`
- Eight production Series registries audited.
- Collector output before manual review: 246 accepted candidates, 276 deferred native facts, 0 exact cross-registry ID references.

## Reviewed disposition

| Registry | Accepted | Rejected | Unresolved |
|---|---:|---:|---:|
| Historical Exchange Index | 21 | 0 | 0 |
| Minted & Gone | 17 | 1 | 14 |
| Stable or Gone | 1 | 128 | 0 |
| Crypto Yield Archive | 0 | 118 | 0 |
| Bridge Incident Registry | 44 | 0 | 1 |
| Wallet Lifecycle Registry | 161 | 0 | 0 |
| AI Tools History Archive | 0 | 0 | 0 |
| API Deprecation Archive | 0 | 0 | 16 |
| **Total** | **244** | **247** | **31** |

Cross-registry accepted relationships: **0**.

## Manual review corrections to collector output

The collector is intentionally broad and is not publication authority. Manual review found three MAG rows that cannot be accepted as typed Series edges:

- one self-loop: `mag_nfm_real_000080 successor_of mag_nfm_real_000080`; rejected because lineage relationships cannot target the same record;
- two contradictory rows from `mag_nfm_real_000121` to `mag_nfm_real_000036`, one `predecessor_of` and one `successor_of`; both remain unresolved until the native MAG relationship data is corrected or separately reviewed.

Manual review also promoted one SOG fact that the collector deliberately deferred: `sog_st_sai predecessor_of sog_st_dai`, supported by native relationship `sog_ar_sai_predecessor_dai`. The same native relation appears in both participant dossiers and is emitted once.

## Other review decisions

1. Existing non-anomalous collector candidates from HEI, MAG, BIR and WLR remain accepted because each resolves to a current same-registry Series target and cites an explicit reviewed native reference.
2. SOG `yield_wrapper_of` and `redeemable_into` facts are rejected because the frozen Series v1 vocabulary has no lossless equivalent. They are not weakened to another type.
3. SOG organization relationships are rejected from this inventory because organization records are not Stage 3 Series target records.
4. CYA supporting products are rejected from this inventory because products are not Stage 3 Series target records; native product facts remain preserved.
5. MAG unresolved predecessor/successor values remain unresolved where the native target does not resolve to a current namespaced Series record.
6. BIR `replacement_bridge_id` remains unresolved because a safe `replacement_for` direction is not established beyond the already accepted predecessor/successor facts.
7. API Deprecation replacement text remains unresolved where no namespaced Series target identity exists.
8. AI Tools yields no safe typed candidate; generic related-record data is not promoted.
9. No exact cross-registry target ID was found. No cross-registry edge is authorized.

## Complete reviewed inventory

The complete accepted, rejected and unresolved lists are stored in registry-specific appendices beside this report:

- `HEI_LEDGER_SERIES_PHASE9_STAGE5_ACCEPTED_HEI_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_ACCEPTED_MAG_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_ACCEPTED_SOG_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_ACCEPTED_BIR_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_ACCEPTED_WLR_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_REJECTED_MAG_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_REJECTED_SOG_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_REJECTED_CYA_2026-08-21.md`
- `HEI_LEDGER_SERIES_PHASE9_STAGE5_UNRESOLVED_2026-08-21.md`

## Publication decision

A separate reviewed Stage 5 publication implementation authority is **justified** by the 244 lossless same-registry candidates. This audit does **not** grant that authority.

Any later implementation must publish only the accepted set, deduplicate stable edges, retain native evidence/provenance, validate namespaced source/target closure and vocabulary membership, keep cross-registry edges at zero unless separately reviewed, and pass repository CI plus exact production verification.

Rejected and unresolved mappings remain non-public. Automatic continuation is false.
