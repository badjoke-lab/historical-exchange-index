# HEI — Binance Iran sanctions probe record update — 2026-09-26

## Decision

Update the existing Binance entity `hei_ex_000003`. Do not create a new entity.

Add one `regulatory_action` event for the investigation reported on 2026-09-22:

- event: `hei_ev_010256`
- status effect: `active`
- impact: `high`
- confidence: `medium`
- evidence: `hei_src_012836`–`hei_src_012837`

## Evidence boundary

Bloomberg reported, citing people familiar with the matter, that federal prosecutors in Manhattan and the U.S. Department of Justice criminal division were examining whether Binance violated U.S. sanctions on Iran and whether prohibited trading was knowingly allowed on the platform.

Reuters separately reported that a source confirmed the probe and that the Justice Department declined to comment.

The canonical record therefore states that the investigation was reported. It does not state that Binance violated sanctions, was charged, or was found liable.

## Status boundary

Keep Binance `active`.

Do not set `limited`, `inactive`, or `dead` from an investigation alone. Do not set a `death_reason`.

## Sources

- Bloomberg News / Bloomberg Law, 2026-09-22: https://news.bloomberglaw.com/litigation/doj-probing-binance-over-potential-iran-sanctions-violations
- Reuters, 2026-09-22: https://www.reuters.com/legal/government/binance-under-us-scrutiny-over-possible-iran-sanctions-violations-bloomberg-news-2026-09-22/

## Related background not promoted into the event claim

A separate September 2026 SDNY civil-forfeiture action alleged that Iranian oil proceeds moved through Binance accounts. That filing is relevant background but is not used as direct proof that Binance itself committed a sanctions violation or that the reported investigation produced a charge or finding.
