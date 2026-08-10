# BX56 consumed candidate set — four reviewed DEX records

Date: 2026-08-10  
Status: consumed

## Added reviewed entities

```text
MUX Protocol  -> hei_ex_001138
Storm Trade   -> hei_ex_001139
Metal X       -> hei_ex_001140
Hegic         -> hei_ex_001141
```

## Candidate origin

These names were surfaced by HEI's automated candidate monitoring / external exchange and protocol discovery layer. Monitoring output was used only to identify names for review; it is not canonical evidence.

Each candidate was independently re-reviewed against current first-party and independent public sources before record creation.

## Pre-add overlap checks

For all four entities, current-main repository search and direct canonical-path checks found no existing reviewed record bundle under the selected canonical identity.

Important product-level overlap decisions:

- MUX Protocol, MUX perpetual trading protocols, and the MUX Perpetual Aggregator are represented as one protocol-level exchange entity.
- Storm Trade web and Telegram trading interfaces are represented as one entity.
- Metal X / MetalX DEX / related trading surfaces are represented as one protocol-level exchange entity rather than separate records for product labels such as MetalX Swap and MetalX Dex.
- Hegic's current options products and one-click strategy surfaces remain one Hegic entity.

## Evidence threshold

Each added entity has:

```text
one current first-party source
one current independent database / protocol-metrics source
```

Current activity is supported by non-zero trading or protocol metrics where applicable.

## Excluded candidates

The existing pending rows for Aequinox, AjuBit, Aktionariat, and Aldrin remain pending. BX56 does not weaken their prior evidence or scope decisions merely to increase batch size.

AnyHedge was also reviewed during BX56 research and not added: current first-party material describes a Bitcoin Cash derivatives contract protocol that can power exchanges, rather than a single exchange venue that should be modeled as an HEI exchange entity.

## Result

BX56 consumes only the four candidates that satisfy current HEI reviewed-public thresholds. Monitoring output itself remains non-canonical and no automated status assignment is promoted directly into reviewed data.
