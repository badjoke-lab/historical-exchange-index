# HEI BitMEX Closure Announcement Update — 2026-07-23

Status: reviewed lifecycle update  
Project: Historical Exchange Index (HEI)  
Entity: `hei_ex_000062` / BitMEX

## 1. Trigger

On 23 July 2026, BitMEX announced a phased closure of the exchange.

The first-party announcement states:

- new account registrations stopped immediately;
- normal exchange operation continues during the initial wind-down period;
- from 26 August 2026 at 04:00 UTC, users may only reduce positions;
- exchange services end on 23 September 2026 at 04:00 UTC;
- users are encouraged to close positions and withdraw funds;
- withdrawal access remains available after exchange services end.

Independent Reuters reporting corroborates the closure date, the strategic-review decision, the asset-safety statement, and the instruction to close positions and withdraw funds.

## 2. Canonical decision

HEI changes the current BitMEX entity status from:

```text
active -> limited
```

HEI does **not** classify BitMEX as dead on the announcement date.

Reason:

- exchange services are still operating for existing users;
- the platform is already restricted because new registrations have stopped;
- a scheduled wind-down and fixed closure time now exist;
- the future effective closure has not yet occurred.

The entity retains:

```text
death_reason: null
death_date:   null
```

These fields must be reviewed after the effective closure is verified.

## 3. Event addition

Added:

```text
hei_ev_010081
shutdown_announced
2026-07-23
```

The event records the announcement and current wind-down only. It does not pre-create a future `shutdown_effective` event.

## 4. Evidence additions

Added:

```text
hei_src_012242 — BitMEX first-party closure announcement
hei_src_012243 — Reuters independent report
```

The event has two sources and `source_count: 2`.

## 5. Reviewed-count effect

```text
Entities: 893 -> 893
Events:   1004 -> 1005
Evidence: 3545 -> 3547
```

Dossier and route counts do not change:

```text
English dossiers:  893
Japanese dossiers: 893
Sitemap routes:     1834
Remaining to D-1000: 107
```

## 6. Follow-up gate

On or after 23 September 2026 at 04:00 UTC, HEI must verify the effective state before changing BitMEX to `dead` and before assigning:

```text
death_reason: voluntary_shutdown
death_date:   2026-09-23
```

A future date in an announcement is not treated as an already-completed event.

## 7. Safety boundaries

This update does not change:

- schema;
- L-2 decision state;
- localization breadth;
- third-language authorization;
- Cloudflare configuration;
- deployment behavior;
- reviewed-count semantics;
- URL safety rules.
