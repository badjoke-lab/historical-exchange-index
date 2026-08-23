# HEI Post-D-1000 Growth Audit — BX71 GO.Exchange

Date: 2026-08-23  
Status: VALIDATION PENDING  
Project: Historical Exchange Index (HEI)

## Scope

BX71 resolves the previously deferred GO.Exchange historical candidate after a fresh current-main duplicate check.

Current-main search found no existing GO.Exchange canonical entity or reviewed exchange bundle. This check was repeated after BX70/CoinExchange.io was rejected by the permanent overlap gate for duplicating an existing legacy canonical entity.

## Record

```text
GO.Exchange
entity:       hei_ex_001166
type:         cex
status:       dead
death_reason: voluntary_shutdown
launch_date:  2019-06-25
death_date:   2020-03-15
origin:       Malta
```

The Malta value records the intended operating/regulatory base. It does not assert that GO.Exchange obtained a Maltese exchange license.

## Lifecycle

```text
hei_ev_010141  launched             2019-06-25  active
hei_ev_010142  shutdown_announced   2020-01-30  limited
hei_ev_010143  shutdown_effective   2020-03-15  dead
```

The January 30 event reflects the immediate end of new customers, deposits, and exchange trading while withdrawals remained available during a bounded run-off. The March 15 date is the operator-announced terminal deadline.

## Evidence

BX71 adds eight evidence records:

```text
hei_src_012621  GO.Exchange launch/community post
hei_src_012622  CoinCodex launch coverage
hei_src_012623  Omise Holdings strategy update
hei_src_012624  Decrypt shutdown coverage
hei_src_012625  Bitcoinist closure-post reproduction
hei_src_012626  Coin Explorers closure-notice reproduction
hei_src_012627  Blockspot inactive exchange profile
hei_src_012628  Cayman Compass Malta operating-base context
```

No secondary reproduction is labeled as an archive capture or first-party statement. No hack or regulatory-enforcement event is created.

## Classification decision

`voluntary_shutdown` is preferred over `regulation` because the reviewed material describes a business decision to stop pursuing the regulatory path after complexity and uncertainty changed the cost/benefit analysis. The reviewed evidence does not show an enforcement order forcing the exchange to close.

## Delta

```text
Entities: +1
Events:   +3
Evidence: +8
```

## Boundaries

BX71 does not change:

```text
L-2 HOLD
localization scope
monitoring configuration
Cloudflare configuration
canonical schema
Ledger Series Phase 9 horizontal work
```

## Authority

```text
Issue #844
records/exchanges/go-exchange.json
docs/backlog/consumed/hei_unadded-bx71-go-exchange.md
```
