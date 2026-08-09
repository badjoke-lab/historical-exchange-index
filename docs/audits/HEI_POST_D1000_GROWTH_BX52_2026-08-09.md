# HEI Post-D-1000 Growth — BX52

Date: 2026-08-09  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX52 continues reviewed canonical growth after the D-1000 milestone and BX51.

Added reviewed entities:

```text
Upbit Thailand   active / cex / Thailand
MX Global        active / cex / Malaysia
Upbit Singapore active / cex / Singapore
KuCoin Thailand  dead   / cex / Thailand
```

Added evidence: 9  
Added events: 1

Projected reviewed public state after merge:

```text
Entities: 1008
Events:   1026
Evidence: 3798
```

## Evidence standard

The three active additions each have:

- current first-party exchange-operation evidence;
- current regulator evidence identifying the regional legal operator;
- explicit operator/entity boundaries;
- URL verification dated 2026-08-09;
- no synthetic exact launch date derived from incorporation or licensing dates.

KuCoin Thailand / ERX has:

- formal Thailand SEC evidence for the January 2026 capital-related business suspension;
- first-party evidence that no near-term resumption was scheduled;
- first-party evidence for the 2026-04-22 customer-system closure and manual-only withdrawals thereafter;
- first-party evidence that ERX began the process of returning its Digital Asset Exchange licence;
- an explicit distinction between live offboarding/support access and active exchange operation.

## Identity controls

Upbit Thailand and Upbit Singapore are separately licensed regional legal operators and are not merged into the South Korean Upbit entity.

MX Exchange is treated as the platform of MX Global Sdn Bhd rather than a second entity. The former ARXCHANGE corporate name is retained as an alias.

ERX Co., Ltd. and KuCoin Thailand are one entity: ERX is the licensed/operator legal identity and KuCoin Thailand is the trade name.

## Lifecycle handling

KuCoin Thailand uses `status: dead` with `death_date: 2026-04-22` because normal customer exchange access ended on that date. Its website remains live for announcements and offboarding, so `official_url_status` remains `live_verified`.

`death_reason: unknown` is intentionally conservative. Regulatory capital failure caused the initial suspension, while the later first-party licence-return announcement cites review of business plans and strategic direction. BX52 does not collapse those facts into one unsupported exclusive cause.

## L-2 relationship

This batch does not change the L-2 localization decision. Canonical growth remains allowed during HOLD. External search/usage/indexing evidence and operator QA burden remain separate L-2 requirements.

## Next identifiers

```text
Entity:   hei_ex_001129
Event:    hei_ev_010103
Evidence: hei_src_012495
```

## Completion condition

BX52 is complete only after normal record validation, reviewed-public aggregation, ID and overlap checks, machine/public consistency, localization output checks, recovery validation, and merge to `main` succeed.
