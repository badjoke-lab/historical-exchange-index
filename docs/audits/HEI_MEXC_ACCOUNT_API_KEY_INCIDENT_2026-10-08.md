# HEI — MEXC account API-key security incident — 2026-10-08

## Decision

Update existing MEXC entity `hei_ex_000015`. Do not create a new entity.

Keep:

- `status: active`
- `death_reason: null`

Add one reviewed lifecycle/security event:

- `hei_ev_010259` — `hack`
- incident marker: 2026-09-27
- impact: `high`
- status effect: `none`
- confidence: `high`

Add evidence:

- `hei_src_012843` — The Crypto Times, including MEXC CEO confirmation and compensation
- `hei_src_012844` — ChainCatcher, independent reproduction of the CEO statement
- `hei_src_012845` — TokenPost, affected-user amount and sequence reporting

## Evidence boundary

MEXC CEO Vugar Usi publicly confirmed that a compromised user account had been frozen and restored, but an API key that remained on the account allowed the attacker to transfer funds before full containment. He also said MEXC fully compensated the affected user.

The affected user reported approximately 322,110 USDT and 9,133,999 ONE, roughly USD 340,000, leaving the account after the recovery sequence. Independent reports differ by timezone on whether the withdrawal sequence is dated September 26 or September 27. HEI uses 2026-09-27 as the incident marker and preserves the timing caveat in the event notes.

The affected user also alleged that forged or AI-generated identity material was used to defeat account-recovery/KYC controls. MEXC's public confirmation did not independently establish that specific identity-verification method. HEI therefore does not present the deepfake/KYC-bypass claim as a confirmed platform finding.

This is an account-level compromise. HEI does not describe it as a platform-wide hot-wallet compromise or smart-contract exploit.

## Public-surface propagation

The reviewed event is authored in the MEXC bundle so the shared reviewed-data loaders propagate it to the applicable HEI surfaces:

- MEXC dossier timeline
- Incident Timeline
- Event Explorer
- Stats event-type analysis
- September monthly historical snapshot where the current previous-month build selects the event
- record-level machine-readable MEXC output
- aggregate machine-readable event output

A reviewed Registry Update entry is also added to `data/registry-updates.json`, which propagates to:

- `/updates/`
- `/ja/updates/` (current Japanese pilot fallback behavior)
- reviewed update JSON Feed
- reviewed update RSS feed

## Cross-ledger scope review

No canonical mutation is made to the other Ledger Series registries for this incident:

- SOG: no stablecoin lifecycle or peg/issuer event
- CYA: no yield/lending product lifecycle event
- BIR: no bridge incident
- WLR: no cryptocurrency-wallet product lifecycle event
- CCLR: no crypto-card lifecycle event
- MAG: no NFT marketplace lifecycle event

The presence of USDT among the withdrawn assets does not make this a SOG event; the event is an exchange-account security incident.

## Count impact

Before this reviewed change:

```text
Entities: 1075
Events:   1140
Evidence: 4111
```

After this reviewed change:

```text
Entities: 1075
Events:   1141
Evidence: 4114
```

The IDs remain non-colliding with the merged Bitget restoration (`hei_ev_010258`, `hei_src_012841`–`hei_src_012842`) and Coinbase IPO-access update (`hei_ev_010260`, `hei_src_012846`–`hei_src_012847`).

## Traceability

- lane: ordinary reviewed Lane A lifecycle/event maintenance
- authority: `docs/HEI_AI_ERA_REGISTRY_SPEC.md` lifecycle follow-up and reviewed-only publication boundary
- public surface authority: `docs/HEI_PRODUCT_SURFACES_SPEC.md` Registry / Analysis / Research / Change layers
- canonical count impact: +0 entities / +1 event / +3 evidence
- deployment impact: reviewed public data changes; no workflow/config/build change
- preview required: no
- production verification plan: after merge and next intended production deployment, verify the deployed commit first and then the MEXC detail page, Incident Timeline, Event Explorer, Stats, monthly snapshot, Registry Updates, feeds, and record-level machine-readable MEXC output
