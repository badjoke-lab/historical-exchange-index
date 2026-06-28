# Consumed batch: verified-unadded 0052-0100 / batch 01

Status: promoted and resolved

Reviewed at: 2026-06-28

## New canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0066` | `hei_ex_000527` Aphelion | Added with four historical events and five evidence records. |
| `hei_unadded_0087` | `hei_ex_000528` AshSwap | Added with two events and four evidence records. |
| `hei_unadded_0090`–`0093` | `hei_ex_000529` Aster | Added once at protocol level; Aster Spot and Aster DEX rows were collapsed as duplicates. |
| `hei_unadded_0099` | `hei_ex_000530` Astrovault | Added with conservative launch-date handling, two events, and four evidence records. |

## Existing canonical resolution

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0095`–`0097` | `hei_ex_000361` Astroport | Existing entity found during direct bundle verification. No new entity was created. Launch, migration, expansion, and evidence coverage were strengthened. |

## Duplicate handling

- Aster source variants remain one v0 entity.
- Astroport Terra Classic, Terra 2.0, and Terra deployment rows remain one v0 entity.
- No deployment-level entities were created.

## Batch output

- new entities: 4
- strengthened existing entities: 1
- new events: 10
- new evidence records: 22
- duplicate entities created: 0

## Safety checks

- candidate IDs were checked against the machine-bound scan manifest
- record paths were checked directly before creation
- projected-public overlap validation is required before merge
- canonical data is generated from reviewed bundles through the existing build pipeline
