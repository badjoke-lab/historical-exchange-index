# Consumed backlog — BX71 GO.Exchange

Date: 2026-08-23  
Status: candidate consumed into reviewed PR branch

## Candidate

GO.Exchange was previously retained in the `0851-0900` historical research queue because its identity, regulatory-base history, and terminal state required stronger source recovery.

## Resolution

Fresh review recovered enough evidence to model the exchange without guessing:

- Omise Holdings established GO.Exchange as a separate subsidiary and developed the exchange from 2018;
- public-launch material is present in June 2019;
- on 2020-01-30 the exchange announced closure, stopped new customers/deposits/trading, and became withdrawal-only;
- the announced withdrawal and terminal deadline was 2020-03-15 23:00 UTC;
- the shutdown was attributed to increasing regulatory complexity/uncertainty and an unfavorable operating cost/benefit assessment;
- current exchange-directory evidence independently supports inactive/terminal status;
- Malta was the intended operating/regulatory base, but the evidence does not establish that an exchange license was granted.

## Canonical decision

```text
entity:       hei_ex_001166
status:       dead
death_reason: voluntary_shutdown
launch_date:  2019-06-25
death_date:   2020-03-15
```

No hack event, enforcement event, predecessor, or successor is inferred.

## Duplicate guard

Immediately before branch creation, current-main repository search found no existing GO.Exchange record. This explicit check follows the BX70 CoinExchange.io duplicate rejection and supplements the permanent overlap/duplicate CI gates.

## References

```text
Issue #844
records/exchanges/go-exchange.json
docs/audits/HEI_POST_D1000_GROWTH_BX71_2026-08-23.md
```
