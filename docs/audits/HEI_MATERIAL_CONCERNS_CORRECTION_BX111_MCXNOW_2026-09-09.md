# HEI material-concerns correction — BX111 McxNOW — 2026-09-09

## Scope

This correction is limited to `hei_ex_000218` (McxNOW), one of the zero-evidence legacy records tracked under #857.

## Findings

- McxNOW was operating during 2013 and publicly suspended trading in November 2013 because of growth/support pressure.
- The exchange later returned; therefore the 2013 suspension is not a terminal event.
- McxNOW announced another maintenance period beginning 2014-11-15. Users were instructed to withdraw before that cutoff because existing exchange wallets/backups would be removed during the wallet-system replacement.
- Historical reporting described a planned successor/rebrand named mtMOX after the 2014 shutdown, but later reporting says the replacement never became a functioning durable exchange.
- The reviewed evidence supports a historical terminal state for McxNOW, but it does not establish an exact permanent-closure date or a specific terminal cause such as insolvency, hack, enforcement, acquisition, or voluntary wind-down.
- The reviewed evidence supports operation in 2013, but not the prior exact `2013-01-01` launch date.

## Canonical corrections

- preserve `status: dead`
- preserve `death_reason: unknown`
- `launch_date: 2013-01-01 -> null`
- `death_date: 2014-11-15 -> null`
- preserve `country_or_origin: Unknown`
- refresh summary/notes and `last_verified_at`

## Canonical additions

- `hei_ev_010234` — McxNOW entered maintenance and removed exchange wallets on 2014-11-15
- `hei_src_012785` — CoinDesk contemporaneous 2013 trading-suspension report
- `hei_src_012786` — CCN report preserving the 2014-11-15 operator maintenance/wallet-removal announcement and mtMOX replacement plan
- `hei_src_012787` — Bitcoin Wiki historical corroboration of the 2014-11-15 maintenance/wallet cutoff

## Non-inferences

This repair does **not** infer:

- that 2014-11-15 was the exact permanent-closure date;
- insolvency, theft, hack, enforcement, or acquisition as the terminal cause;
- that the mtMOX announcement produced a functioning successor exchange;
- an exact McxNOW launch day;
- an Australian or New South Wales operating jurisdiction from community-level references.

## Disposition

The zero-evidence material concern for `hei_ex_000218` is resolved with evidence-backed lifecycle context. The entity remains historically dead, but the artificial exact launch/death dates are removed and the 2014-11-15 cutoff is represented as a service event rather than a fabricated permanent-death date.
