# Consumed research cluster: BitGlobal and Bithumb Singapore

Status: reviewed and promoted

Reviewed at: 2026-07-03

## Source rows

- `hei_unadded_0210` BitGlobal
- `hei_unadded_0212` Bithumb Singapore

## Canonical results

- `hei_ex_000591` BitGlobal: added as `inactive`.
- `hei_ex_000592` Bithumb Singapore: added as `dead / unknown`.
- `hei_ex_000199` Bitholic: corrected from `dead` to `rebranded`.

## Identity boundary

```text
Bithumb Korea      existing hei_ex_000021
BitGlobal          former Bithumb Global
Bitholic           terminal predecessor brand hei_ex_000199
Bithumb Singapore  later Singapore brand hei_ex_000592
```

Bithumb Korea's trademark notice identifies the global and Singapore services as separate foreign licensees. Record validation also rejected reuse of `Bitholic` as an alias on the new Singapore entity.

The final implementation keeps Bitholic and Bithumb Singapore as separate canonical records. Their historical relationship is documented through the launch event and notes. `predecessor_id` and `successor_id` remain unset because the frozen lineage review still classifies the Bitholic edge as unresolved.

## Lifecycle decisions

### BitGlobal

- launched: `2019-05-13`
- renamed from Bithumb Global: July 2021
- trademark license ended: `2021-07-30`
- status: `inactive`
- death date: `null`

### Bitholic

- launched: May 2018
- rebrand marker: `2019-08-08`
- status: `rebranded`
- death reason: `rebrand`
- successor field: `null`

### Bithumb Singapore

- launch marker: `2019-08-08`
- trademark license ended: `2021-07-30`
- reported closure: March 2022
- status: `dead`
- death reason: `unknown`
- predecessor field: `null`

No first-party final closure notice was recovered for Bithumb Singapore, so the terminal month and cause remain conservative.

## Batch output

- new entities: 2
- corrected entities: 1
- new events: 6
- new evidence: 9
- duplicate entities: 0

No Cloudflare or deployment changes are included.
