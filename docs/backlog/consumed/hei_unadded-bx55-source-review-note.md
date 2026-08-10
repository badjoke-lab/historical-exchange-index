# BX55 source review note — Shelbit

Date: 2026-08-10

## Reviewed sources

### VARA — 2026-07-24

`VARA Notice of Fines – Shelbit General Trading L.L.C`

Primary regulator source. It identifies Shelbit General Trading L.L.C as commercially operating as Shelbit or Shelbit Exchange. VARA states that the entity continued to provide virtual-asset services in and from Dubai without a valid regulatory licence, onboarded users without mandatory KYC checks, and marketed services without authorisation. VARA imposed financial penalties and directed an immediate cease and desist from all unlicensed virtual-asset activity in or from Dubai.

Canonical use:

```text
identity
regulatory_action event
Dubai/UAE origin context
continued-service evidence as of regulator review
```

### Reuters investigation — 2026-07-31

`Illicit Iranian gambling network helped pull off a $4 billion sanctions dodge`

Independent reporting identifies Shelbit as a Dubai-based crypto exchange. Reuters reported that there was no identifiable way for a member of the public to use the exchange at the time and that the public website was unavailable, while transaction activity continued through identified wallets.

Canonical use:

```text
exchange identity corroboration
public-access / status uncertainty
historical operating context
```

The article's approximate observation that activity appeared to begin around May 2024 is not converted into an exact `launch_date`.

### Reuters — 2026-08-07

`US sanctions Dubai crypto exchange for aiding Iran's IRGC, following a Reuters report`

Independent reporting records the U.S. sanctions action against Shelbit, founder Siavash Kayvanpour and associated companies. Reuters also reports that Shelbit's website reappeared after the July investigation and carried a Shelbit statement saying the company had ceased operations in January 2026.

Canonical use:

```text
2026-08-07 regulatory_action event
status-conflict context
company response context
```

The later Shelbit cessation statement is not treated as sufficient evidence for an exact death date because it conflicts with VARA's July continued-service finding.

## Excluded inferences

BX55 does not infer or assert:

- criminal guilt from regulator or sanctions allegations;
- `scam_rug` as a death reason;
- an exact launch date;
- an exact January shutdown date;
- that website reappearance necessarily meant resumed public exchange trading;
- that continuing wallet activity necessarily meant an active public exchange.

## Review conclusion

The evidence is strong enough for a reviewed HEI entity and two material regulatory events, but not for a definitive terminal state. `inactive` with medium entity confidence is the conservative classification.
