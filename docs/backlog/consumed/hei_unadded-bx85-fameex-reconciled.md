# BX85 — FameEX candidate reconciliation

Date: 2026-08-29

Reviewed stale backlog rows:
- `hei_unadded_0728 FameEX`
- `hei_unadded_0729 FameEX`
- `hei_unadded_0730 FameEX Derivatives`

Result: consumed as existing canonical entity, not new records.

Canonical target:
- `records/exchanges/fameex.json`
- entity `hei_ex_000750`

Fresh first-party evidence confirms the operator as FAMEEX INTERNATIONAL PTY LTD, registered in Australia since 2020, and confirms current exchange operations through 2026-08-26. BX85 repairs the existing record instead of creating duplicate spot/derivatives entities.

Correction note: the original BX85 marker mistakenly listed `hei_unadded_0880`–`0882`; the verified D-750 scan shows the actual FameEX rows are `hei_unadded_0728`–`0730`.
