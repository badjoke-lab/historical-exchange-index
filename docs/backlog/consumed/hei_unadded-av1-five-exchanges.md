# D-750 Batch AV1 — ElectroSwap, Elexium, Elix.fi, Embr Finance, and Équilibre

Reviewed at: 2026-07-10

## Results

- `0652` ElectroSwap V3 -> `hei_ex_000792`, active DEX represented as ElectroSwap
- `0654` Elexium -> `hei_ex_000793`, active DEX
- `0655` Elexium Finance -> consolidated under `hei_ex_000793`
- `0658` Elix.fi -> `hei_ex_000794`, active DEX
- `0664` embr -> `hei_ex_000795`, inactive DEX represented as Embr Finance
- `0665` Embr Finance -> consolidated under `hei_ex_000795`
- `0683` Equilibre -> `hei_ex_000796`, inactive DEX represented as Équilibre
- `0684` Équilibre -> consolidated under `hei_ex_000796`

## Entity-first consolidation

- ElectroSwap version-labelled discovery is modeled as one ElectroSwap entity.
- Elexium and Elexium Finance source representations remain one Alephium DEX entity.
- Elix.fi remains one Somnia CLOB/AMM hybrid decentralized exchange entity.
- embr and Embr Finance source representations remain one Avalanche DEX entity.
- Equilibre and Équilibre Finance source representations remain one Kava DEX entity.

## Evidence decisions

### ElectroSwap

Current first-party ElectroSwap website identifies the protocol as decentralized trading infrastructure for Electroneum Smart Chain, documents swap and liquidity features, and links the live application and documentation. Confidence is `high`.

### Elexium

The dedicated first-party Elexium Finance domain is reachable. CoinGecko and DefiLlama candidate sources independently identify Elexium/Elexium Finance as an Alephium exchange and DEX. Confidence is `medium` because detailed public first-party documentation was not recovered in this review pass.

### Elix.fi

Current first-party documentation identifies Elix as a CLOB/AMM hybrid decentralized exchange on Somnia and documents self-custodial trading, smart offers, swaps, trading, earning, hooks, audits, and deployment resources. The live application endpoint is reachable. Confidence is `high`.

### Embr Finance

The current root domain still contains historical Embr AMM and swap copy but is heavily mixed with unrelated gambling/casino SEO links. The former app subdomain redirects into the same repurposed site. HEI therefore classifies Embr Finance as `inactive`, not `dead`, and marks the original URL as `repurposed`. Confidence is `medium`.

### Équilibre

The current original domain no longer provides a usable exchange surface and displays unrelated casino/gambling-link content. CoinGecko and DefiLlama candidate sources independently preserve the historical Équilibre/Equilibre Finance exchange identity. HEI classifies the entity as `inactive`, not `dead`, because a first-party shutdown notice or equivalent terminal-state evidence was not recovered. Confidence is `medium`.

## Current-main overlap findings

Direct current-main and cross-repository searches prevented stale candidate assumptions from creating duplicate drafts:

- Emirex -> existing `hei_ex_000749`
- Elektrik -> existing `hei_ex_000742`
- Elys DEX -> existing `hei_ex_000741`
- Enosys -> existing `hei_ex_000683`
- Equalizer Exchange -> existing `hei_ex_000684`
- Etherex -> existing `hei_ex_000748`
- Ethervista -> existing `hei_ex_000744`
- EulerSwap -> existing `hei_ex_000740`
- Elk Finance -> existing `hei_ex_000743`
- Energiswap -> existing `hei_ex_000751`

Equation V3 and several thinner candidates remain for separate review. AV1 was assembled only from candidates confirmed absent from current main and conservatively classified according to current evidence quality.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 680
- projected event count: 1004
- projected evidence count: 3009
- remaining to D-750 after projected merge: 70

## Operating mode

AV1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.