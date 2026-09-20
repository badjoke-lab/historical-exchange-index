# HEI Revolut X entity addition and September 2026 data-disclosure triage

Date: 2026-09-20  
Issue: #985

## Canonical decision

Add **Revolut X** as a standalone active centralized exchange.

- entity: `hei_ex_001192`
- slug: `revolut-x`
- type: `cex`
- status: `active`
- launch_date: `2024-05-07`
- country_or_origin: `United Kingdom`

The identity and exact launch date are established by Revolut's 2024-05-07 first-party launch announcement. Current Revolut X help documentation and a July 2026 Revolut corporate announcement support continuing operation.

## September 2026 customer-data disclosure

The broader Revolut incident is confirmed by current reporting, but this change does **not** attach that incident to Revolut X as a canonical event.

Reason:

- the exposed-data descriptions include Bitcoin transaction history;
- however, reviewed evidence does not yet establish that affected records were sourced from Revolut X, that affected customers were Revolut X users, or that the standalone exchange itself was compromised;
- Revolut says its systems and customer funds were unaffected and describes the event as an external impersonation scam using a legitimate government-agency email domain.

Issue #985 is the verification gate for any later Revolut X `data_breach` event.

## Evidence used for the entity

1. Revolut first-party launch announcement, 2024-05-07.
2. Current Revolut X help documentation.
3. Revolut first-party UAE crypto-services announcement, 2026-07-15.

## Safety boundary

- no `data_breach` event is added to `revolut-x.json` in this change;
- no status limitation is inferred;
- no claim is made that Revolut X itself was breached;
- if direct Revolut X impact is later established, issue #985 should be resolved with a separate reviewed event/evidence update.
