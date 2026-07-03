# Consumed research cluster: BitGlobal and Bithumb Singapore

Status: reviewed and promoted

Reviewed at: 2026-07-03

## Source rows

- `hei_unadded_0210` BitGlobal
- `hei_unadded_0212` Bithumb Singapore

## Canonical results

| candidate | canonical entity | result |
|---|---|---|
| BitGlobal | `hei_ex_000591` BitGlobal | Added as `inactive`; Bithumb Global and BitGlobal are one continuing exchange identity. |
| Bithumb Singapore | `hei_ex_000199` Bithumb Singapore | Corrected the existing Bitholic entity into its full continuing lifecycle; final status `dead / unknown`. |

## Identity boundary

The research resolves three separate exchange identities:

```text
Bithumb Korea      -> existing canonical entity hei_ex_000021
BitGlobal          -> former Bithumb Global, independent global exchange
Bithumb Singapore  -> existing hei_ex_000199, formerly Bitholic
```

Bithumb Korea's trademark-termination notice identifies the global and Singapore services as separate foreign licensees. The shared Bithumb brand therefore does not justify merging either service into the Korean exchange.

The initial research draft attempted to create a new Bithumb Singapore entity. Record-overlap validation correctly detected the existing canonical Bitholic entity. The final implementation preserves `hei_ex_000199` and applies a correction rather than creating a duplicate.

## Lifecycle decisions

### BitGlobal

- launch marker: `2019-05-13`
- Bithumb Global -> BitGlobal rebrand: July 2021
- Bithumb trademark license termination: `2021-07-30`
- final status: `inactive`
- death date: `null`

No reliable first-party final shutdown date was recovered. The record is not marked dead.

### Bithumb Singapore

- existing identity: `hei_ex_000199` Bitholic
- launched as Bitholic: May 2018
- renamed Bithumb Singapore: `2019-08-08`
- Bithumb trademark license termination: `2021-07-30`
- reported service termination: March 2022
- final status: `dead`
- death reason: `unknown`

The old record incorrectly treated the 2019 rebrand as the terminal death of Bitholic. The corrected record treats Bitholic and Bithumb Singapore as one continuous identity and moves the terminal marker to March 2022. The terminal month is supported by independent exchange-tracking sources, but no first-party final shutdown notice was recovered, so the cause is not inferred.

## Batch output

- new entities: 1
- corrected existing entities: 1
- new events: 7
- new evidence records: 10
- duplicate entities created: 0

## Safety checks

- Bithumb Korea was not duplicated
- existing Bitholic identity was reused
- BitGlobal and Bithumb Singapore were not merged solely because they licensed the same brand
- uncertain final dates and causes were not invented
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
