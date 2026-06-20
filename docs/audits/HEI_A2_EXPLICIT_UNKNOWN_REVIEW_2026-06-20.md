# HEI A2 explicit `Unknown` origin review — 2026-06-20

## Purpose

This audit distinguishes a structural omission from a reviewed `Unknown` classification.

A structural omission is `null`, missing, or an invalid type. A reviewed `Unknown` means that HEI re-examined the available identity, company, project, archive, domain-history, community, and secondary-source material but could not support a narrower country, legal domicile, operating origin, founding origin, or ecosystem origin.

HEI does not infer origin from:

- hosting or server location
- domain registrar or privacy-proxy address
- language alone
- user geography
- an unattributed forum profile
- an unrelated later service with a similar name

## Baseline after A2 Batch 5

```text
Projected public entities:       412
True missing origin values:        0
Explicit Unknown values:          11
Reviewed explicit Unknown values:  0
Pending explicit Unknown review:  11
```

## U1 decisions

| Entity | ID | Decision | Review result |
| --- | --- | --- | --- |
| Coin-Swap | `hei_ex_000212` | retain `Unknown` | Project, closure, directory, archive, and domain-history material establishes the exchange and its lifecycle but not an attributable operating jurisdiction. Hosting and privacy-proxy data are excluded. |
| AllCrypt | `hei_ex_000215` | retain `Unknown` | Project announcement, hack coverage, archived site material, and exchange directories do not identify a legal entity, headquarters, founding jurisdiction, or ecosystem origin. |
| McxNOW | `hei_ex_000218` | retain `Unknown` | Historical community and registration references suggest Australia or New South Wales, but the material is not sufficiently primary, stable, or attributable to the operating entity for a country assignment. |
| Crypto-Trade | `hei_ex_000246` | retain `Unknown` | Original announcement, shutdown material, archived pages, and historical exchange references do not identify an operating jurisdiction. Later unrelated similarly named services are excluded. |
| CoinedUp | `hei_ex_000250` | retain `Unknown` | Project and developer posts identify the service, but do not identify a legal entity, headquarters, founding jurisdiction, or ecosystem origin. |

## Implementation

Each U1 record uses a guarded `entity_correction` bundle that changes only:

- `last_verified_at`
- `notes`

The `country_or_origin` value remains `Unknown`. No new entity, event, or evidence count is created by U1.

## Expected post-U1 state

GitHub CI must confirm:

```text
Projected public entities:       412
Projected public events:         687
Projected public evidence:      1608
True missing origin values:        0
Explicit Unknown values:          11
Reviewed explicit Unknown values:  5
Pending explicit Unknown review:   6
Invalid origin types:               0
```

## U2 queue

- AidosMarket — `hei_ex_000296`
- 55 Global Markets — `hei_ex_000297`
- BCC Exchange (BitConnect Coin) — `hei_ex_000300`
- Txbit — `hei_ex_000312`
- Bitbaby — `hei_ex_000382`
- BitStorage — `hei_ex_000394`

## Completion gate

A2 explicit-Unknown review is complete when:

1. all eleven records have a documented disposition;
2. any replacement value is supported by attributable evidence;
3. retained `Unknown` values have a written reason;
4. a strict gate rejects missing or null origins;
5. explicit `Unknown` is allowed only for reviewed records listed by the audit or its machine-readable companion.
