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
| Bithumb Singapore | `hei_ex_000592` Bithumb Singapore | Added as the `dead / unknown` successor to the existing Bitholic entity. |
| Bitholic lineage repair | `hei_ex_000199` Bitholic | Corrected from `dead` to `rebranded` and linked to successor `hei_ex_000592`. |

## Identity boundary

The research resolves four record identities across three operating lineages:

```text
Bithumb Korea      -> existing canonical entity hei_ex_000021
BitGlobal          -> former Bithumb Global, independent global exchange
Bitholic           -> predecessor brand, existing hei_ex_000199
Bithumb Singapore  -> successor brand, new hei_ex_000592
```

Bithumb Korea's trademark-termination notice identifies the global and Singapore services as separate foreign licensees. The shared Bithumb brand therefore does not justify merging either service into the Korean exchange.

Record-overlap validation correctly detected that the first draft reused `Bitholic` as an alias on the new Singapore entity. The final implementation follows HEI's predecessor/successor model: Bitholic remains its own terminal `rebranded` entity and Bithumb Singapore is the linked successor.

## Lifecycle decisions

### BitGlobal

- launch marker: `2019-05-13`
- Bithumb Global -> BitGlobal rebrand: July 2021
- Bithumb trademark license termination: `2021-07-30`
- final status: `inactive`
- death date: `null`

No reliable first-party final shutdown date was recovered. The record is not marked dead.

### Bitholic

- launch marker: May 2018
- rebrand marker: `2019-08-08`
- final status: `rebranded`
- death reason: `rebrand`
- successor: `hei_ex_000592`

The 2019 marker ends the Bitholic brand, not the successor exchange operation.

### Bithumb Singapore

- launch/successor marker: `2019-08-08`
- predecessor: `hei_ex_000199`
- Bithumb trademark license termination: `2021-07-30`
- reported service termination: March 2022
- final status: `dead`
- death reason: `unknown`

The terminal month is supported by independent exchange-tracking sources, but no first-party final shutdown notice was recovered. The cause is therefore not inferred.

## Batch output

- new entities: 2
- corrected existing entities: 1
- new events: 7
- new evidence records: 10
- duplicate entities created: 0

## Safety checks

- Bithumb Korea was not duplicated
- existing Bitholic identity was retained and linked as predecessor
- Bithumb Singapore does not reuse Bitholic as an alias
- BitGlobal and Bithumb Singapore were not merged solely because they licensed the same brand
- uncertain final dates and causes were not invented
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
