# HEI A2 explicit `Unknown` origin review — 2026-06-20

## Purpose

This audit distinguishes a structural omission from a reviewed `Unknown` classification.

A structural omission is `null`, missing, or an invalid type. A reviewed `Unknown` means that HEI re-examined available identity, company, project, archive, domain-history, community, legal, regulatory, and secondary-source material but could not support a narrower country, legal domicile, operating origin, founding origin, or ecosystem origin.

HEI does not infer origin from:

- hosting or server location
- domain registrar or privacy-proxy address
- language alone
- user geography
- an unattributed forum profile
- a similarly named company without an attributable operating link
- an unrelated later service with a similar name

## Baseline after A2 Batch 5

```text
Projected public entities:       412
True missing origin values:        0
Explicit Unknown values:          11
Reviewed explicit Unknown values:  0
Pending explicit Unknown review:  11
```

## U1 decisions — PR #405

| Entity | ID | Decision | Review result |
| --- | --- | --- | --- |
| Coin-Swap | `hei_ex_000212` | retain `Unknown` | Project, closure, directory, archive, and domain-history material establishes the exchange and its lifecycle but not an attributable operating jurisdiction. Hosting and privacy-proxy data are excluded. |
| AllCrypt | `hei_ex_000215` | retain `Unknown` | Project announcement, hack coverage, archived site material, and exchange directories do not identify a legal entity, headquarters, founding jurisdiction, or ecosystem origin. |
| McxNOW | `hei_ex_000218` | retain `Unknown` | Historical community and registration references suggest Australia or New South Wales, but the material is not sufficiently primary, stable, or attributable to the operating entity for a country assignment. |
| Crypto-Trade | `hei_ex_000246` | retain `Unknown` | Original announcement, shutdown material, archived pages, and historical exchange references do not identify an operating jurisdiction. Later unrelated similarly named services are excluded. |
| CoinedUp | `hei_ex_000250` | retain `Unknown` | Project and developer posts identify the service, but do not identify a legal entity, headquarters, founding jurisdiction, or ecosystem origin. |

U1 used guarded corrections to update only `last_verified_at` and `notes`. Counts were unchanged.

## U2 decisions

| Entity | ID | Decision | Review result |
| --- | --- | --- | --- |
| AidosMarket | `hei_ex_000296` | retain `Unknown` | Secondary profiles conflict, and no attributable legal entity, headquarters, founding jurisdiction, or official ecosystem domicile was verified. |
| 55 Global Markets | `hei_ex_000297` | retain `Unknown` | Secondary material mentions an Estonian exchange license, but no attributable registry record or operating entity was verified strongly enough to assign Estonia. |
| BCC Exchange (BitConnect Coin) | `hei_ex_000300` | retain `Unknown` | Several similarly named UK companies existed and BitConnect leadership was associated with India, but authoritative material does not safely establish which jurisdiction operated the proprietary BCC exchange. |
| Txbit | `hei_ex_000312` | retain `Unknown` | Public profiles variously describe Dutch identity, Curaçao registration, Seychelles jurisdiction, or an unspecified Txbit Holdings Limited. Official shutdown and market sources do not establish an attributable operating entity and jurisdiction. |
| Bitbaby | `hei_ex_000382` | retain `Unknown` | The Batch 3 review of official exchange, company, legal, policy, and contact surfaces did not identify a legal entity, headquarters, founding jurisdiction, or ecosystem origin. |
| BitStorage | `hei_ex_000394` | retain `Unknown` | The Batch 3 review of official exchange and team surfaces did not identify a legal or operating origin. |

## U2 implementation

- AidosMarket, 55 Global Markets, BCC Exchange, and Txbit use guarded corrections that update only `last_verified_at` and `notes`.
- Bitbaby and BitStorage already contain the reviewed-Unknown rationale from A2 Batch 3, so U2 does not create duplicate corrections for them.
- No new entity, event, or evidence count is created.

## Expected completed-review state

GitHub CI must confirm:

```text
Projected public entities:       412
Projected public events:         687
Projected public evidence:      1608
True missing origin values:        0
Explicit Unknown values:          11
Reviewed explicit Unknown values: 11
Pending explicit Unknown review:   0
Invalid origin types:               0
```

## Reviewed explicit-Unknown allowlist

```text
hei_ex_000212  Coin-Swap
hei_ex_000215  AllCrypt
hei_ex_000218  McxNOW
hei_ex_000246  Crypto-Trade
hei_ex_000250  CoinedUp
hei_ex_000296  AidosMarket
hei_ex_000297  55 Global Markets
hei_ex_000300  BCC Exchange (BitConnect Coin)
hei_ex_000312  Txbit
hei_ex_000382  Bitbaby
hei_ex_000394  BitStorage
```

## Completion gate

The research and documentation portion of A2 is complete when U2 merges. The remaining A2 implementation item is the strict gate:

1. reject missing or null `country_or_origin`;
2. reject invalid origin types;
3. allow explicit `Unknown` only for IDs in the reviewed allowlist;
4. fail when the allowlist and projected public `Unknown` set diverge;
5. advance the roadmap to A3 after the gate passes.
