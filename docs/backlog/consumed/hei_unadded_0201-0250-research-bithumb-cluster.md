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
| Bithumb Singapore | `hei_ex_000592` Bithumb Singapore | Added as `dead / unknown`; Bitholic and Bithumb Singapore are one continuing exchange identity. |

## Identity boundary

The research resolves three separate exchange identities:

```text
Bithumb Korea      -> existing canonical entity hei_ex_000021
BitGlobal          -> former Bithumb Global, independent global exchange
Bithumb Singapore  -> former Bitholic, independent Singapore exchange
```

Bithumb Korea's trademark-termination notice identifies the global and Singapore services as separate foreign licensees. The shared Bithumb brand therefore does not justify merging either service into the Korean exchange.

## Lifecycle decisions

### BitGlobal

- launch marker: `2019-05-13`
- Bithumb Global -> BitGlobal rebrand: July 2021
- Bithumb trademark license termination: `2021-07-30`
- final status: `inactive`
- death date: `null`

No reliable first-party final shutdown date was recovered. The record is not marked dead.

### Bithumb Singapore

- launched as Bitholic: May 2018
- renamed Bithumb Singapore: `2019-08-08`
- Bithumb trademark license termination: `2021-07-30`
- reported service termination: March 2022
- final status: `dead`
- death reason: `unknown`

The terminal month is supported by independent exchange-tracking sources, but no first-party final shutdown notice was recovered. The cause is therefore not inferred.

## Batch output

- new entities: 2
- new events: 7
- new evidence records: 10
- duplicate entities created: 0

## Safety checks

- Bithumb Korea was not duplicated
- BitGlobal and Bithumb Singapore were not merged solely because they licensed the same brand
- uncertain final dates and causes were not invented
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
