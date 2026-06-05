# Pending review: verified-unadded rows 0801-0850

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0801-0850` before canonical record creation.

This window contains active-looking DEX/protocol rows, exchange-like database rows, and cluster candidates such as Ekubo, Elk Finance, Enosys, Equalizer, ErgoDEX, EtherDelta, Etherex, and Ethervista.

No candidate in this scan was promoted directly to canonical records from this pass because most rows need stronger event/evidence review or cluster methodology decisions. EtherDelta is flagged for separate event-backed review because it has known regulatory history.

## Classification summary

```text
add_now: 0
needs_research: 7
pending_thin: 18
active_seed_later: 18
out_of_scope_or_duplicate: 7
```

## needs_research

```text
hei_unadded_0800 Ekubo
hei_unadded_0817 Emirex
hei_unadded_0818 Emirex
hei_unadded_0838 ErgoDEX
hei_unadded_0839 ErgoDEX
hei_unadded_0843 EtherDelta
hei_unadded_0850 Ethervista
```

Notes:

- EtherDelta should be reviewed separately as an event-backed DEX record because of known regulatory history.
- Ekubo, ErgoDEX, and Ethervista are recognizable DEX/protocol candidates but need stronger event/status evidence before canonical inclusion.
- Emirex has both CoinPaprika and CoinGecko rows and should be reviewed as one exchange cluster before any record creation.

## pending_thin

```text
hei_unadded_0803 ElectroSwap V3
hei_unadded_0804 Elektrik
hei_unadded_0805 Elexium
hei_unadded_0806 Elexium Finance
hei_unadded_0807 ElfomoFi
hei_unadded_0808 EliteX Exchange
hei_unadded_0809 Elix.fi
hei_unadded_0814 Elys DEX
hei_unadded_0815 embr
hei_unadded_0816 Embr Finance
hei_unadded_0820 EmpireDEX
hei_unadded_0821 Energiswap
hei_unadded_0822 Energiswap
hei_unadded_0823 Enmanet
hei_unadded_0834 Equilibre
hei_unadded_0835 Équilibre
hei_unadded_0837 Erex
hei_unadded_0840 Escodex
hei_unadded_0849 EtherMium
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

## active_seed_later

```text
hei_unadded_0801 Ekubo V3 (Ethereum)
hei_unadded_0802 El Dorado Exchange
hei_unadded_0810 Elk
hei_unadded_0811 Elk Finance
hei_unadded_0812 Elk Finance (BSC)
hei_unadded_0813 Ellipsis Finance
hei_unadded_0824 Enosys (Flare)
hei_unadded_0825 Enosys AMM V2
hei_unadded_0826 Enosys AMM V3
hei_unadded_0827 Enosys V3 (Flare)
hei_unadded_0828 Equalizer
hei_unadded_0829 Equalizer (Base)
hei_unadded_0830 Equalizer (Sonic)
hei_unadded_0831 Equalizer (Sonic)
hei_unadded_0832 Equalizer Exchange
hei_unadded_0833 Equation V3
hei_unadded_0844 Etherex
hei_unadded_0845 Etherex
hei_unadded_0846 Etherex CL
hei_unadded_0847 Etherex Legacy
```

Notes:

- Ekubo, Elk, Enosys, Equalizer, and Etherex should be handled as clusters if added later.
- Chain/version rows should not be split into separate v0 entities without a deployment-level methodology.

## out_of_scope_or_duplicate

```text
hei_unadded_0819 Emojicoin.fun
hei_unadded_0841 ETCswap V2
hei_unadded_0842 ETCswap V3
hei_unadded_0848 EtherFi Cash Liquid
```

Notes:

- Emojicoin.fun is marked as Launchpad in the reviewed row.
- EtherFi Cash Liquid is marked as Crypto Card Issuer and should not be folded into exchange records without a scope decision.
- ETCswap V2/V3 should not be split into separate v0 records without a cluster/deployment methodology.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: most candidates in this window are active clusters or thin database rows. EtherDelta is strong enough to deserve separate event-backed review, but it should be handled in its own PR rather than buried inside a pending-batch scan.

## Next action

1. Review EtherDelta separately as a possible event-backed DEX record.
2. Review Ekubo, ErgoDEX, and Emirex separately if stronger event/status sources are available.
3. Keep Ekubo, Elk, Enosys, Equalizer, Etherex, and Ethervista as cluster candidates for later DEX/protocol seed work.
4. Continue scanning `hei_unadded_0851-0900` while avoiding product/version splitting.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
