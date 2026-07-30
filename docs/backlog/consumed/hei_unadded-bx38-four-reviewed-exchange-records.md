# Consumed backlog — BX38 four reviewed exchange records

Status: consumed  
Date: 2026-07-30  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Finst      hei_ex_001068 active
Safello    hei_ex_001069 active
Coinstash  hei_ex_001070 active
Unocoin    hei_ex_001071 active
```

## Evidence allocation

```text
Finst      hei_src_012361–012362
Safello    hei_src_012363–012364
Coinstash  hei_src_012365–012366
Unocoin    hei_src_012367–012368
```

## Lineage handling

The existing Anycoin Direct record already documents Finst's strategic-asset acquisition and completed customer migration. BX38 keeps that transition event-only and does not modify the frozen canonical lineage baseline.

## Rejected or held during review

- Existing reviewed exchanges were rejected through direct canonical-path reads rather than search-index absence.
- Giottus and Coinmetro were rejected as existing records.
- Trijo was excluded because its MiCA application had been rejected and its operating position remained under appeal.
- Coinstash and Unocoin were retained only after 2026 app-store updates independently confirmed current service operation.

## Result

```text
Entities: 951
Events:   1014
Evidence: 3672
Remaining to D-1000: 49
```

The next unused event ID remains `hei_ev_010091`.
