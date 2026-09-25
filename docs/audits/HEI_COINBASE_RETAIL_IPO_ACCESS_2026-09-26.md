# HEI — Coinbase retail IPO access record update — 2026-09-26

## Decision

Update the existing Coinbase Exchange entity `hei_ex_000012`. Do not create a new entity.

Add one reviewed `other` event for Coinbase's 2026-09-21 launch of IPO allocation access for eligible U.S. retail customers:

- event: `hei_ev_010257`
- status effect: `none`
- impact: `high`
- confidence: `high`
- evidence: `hei_src_012838`–`hei_src_012839`

## Product boundary

Coinbase states that eligible U.S. customers can request IPO shares at the offer price inside the Coinbase app, beginning with Oura's IPO.

The canonical event does not describe the request as a guaranteed allocation. Coinbase states that requests may be filled in full, in part, or not at all depending on selling-group supply and customer demand.

Securities access is provided through Coinbase Capital Markets Corporation, a FINRA-registered broker-dealer. Coinbase's own disclosure states that securities services provided by CCM are separate from digital-asset services provided by Coinbase Inc.

## HEI classification boundary

Use `event_type = other`.

This is not the launch of the Coinbase exchange entity itself, so it should not reuse `launched` as an entity-lifecycle start marker.

Keep Coinbase Exchange `active`.

This event records a material expansion of the Coinbase service ecosystem into primary-market securities access. It does not create a separate HEI exchange entity, and it does not change `status` or `death_reason`.

## Sources

- Coinbase, 2026-09-21: https://www.coinbase.com/blog/you-can-now-participate-in-ipos-on-coinbase
- The Block, 2026-09-21: https://www.theblock.co/news/business/2026-09-21-coinbase-opens-ipo-allocations-us-customers-starting-oura-415942

## Count impact

This update adds:

- entities: +0
- events: +1
- evidence: +2
