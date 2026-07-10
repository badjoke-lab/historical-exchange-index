# D-750 Batch BC1 — Goblins AMM, Honeypop DEX, Hotstuff Spot, GoonFi, and Gravis Finance

Reviewed at: 2026-07-10

## Results

- `0872` Goblins AMM -> `hei_ex_000827`, active DEX
- `0939` / `0940` Honeypop DEX -> `hei_ex_000828`, active DEX
- `0948` Hotstuff Spot -> `hei_ex_000829`, active DEX
- `0876` GoonFi -> `hei_ex_000830`, active DEX
- `0884` Gravis Finance -> `hei_ex_000831`, active DEX

## Entity-first consolidation

- Goblins AMM remains one multichain DEX entity across BNB Chain, Base, and smartBCH activity.
- duplicate Honeypop DEX source rows remain one Scroll DEX entity.
- Hotstuff Spot remains one native Hotstuff order-book spot exchange entity.
- GoonFi remains one Solana Prop AMM DEX entity.
- Gravis Finance remains one multichain AMM DEX entity across BNB Chain and Polygon activity.

## Evidence decisions

### Goblins AMM

DefiLlama identifies Goblins AMM as a decentralized exchange originating on smartBCH and reports current TVL plus non-zero 30-day, 7-day, and 24-hour DEX volume across BNB Chain, Base, and smartBCH. The dedicated application URL is preserved but could not be fully fetched in this review pass, so HEI uses `live_unverified`. Confidence is `medium`.

### Honeypop DEX

The original Honeypop application URL currently redirects to the Scroll DEX swap surface. DefiLlama identifies Honeypop DEX as a permissionless Scroll CLMM and reports current TVL, fees, revenue, and non-zero 30-day, 7-day, and 24-hour DEX volume. HEI preserves the Honeypop entity and marks the original URL `redirected`. Confidence is `high`.

### Hotstuff Spot

The current first-party Hotstuff trading application remains reachable. DefiLlama identifies Hotstuff Spot as an order-book DEX and reports non-zero 30-day, 7-day, and 24-hour spot volume. Confidence is `high`.

### GoonFi

DefiLlama identifies GoonFi as a Solana Prop AMM and reports substantial current 30-day, 7-day, and 24-hour DEX volume. The registry also records a March 28, 2026 protocol-logic incident, but BC1 does not create a canonical event without a separately reviewed source package. A stable first-party URL was not recovered. Confidence is `medium`.

### Gravis Finance

DefiLlama identifies Gravis Finance as a multichain AMM DEX and reports current TVL plus non-zero 30-day, 7-day, and 24-hour DEX volume across BNB Chain and Polygon. A stable first-party website URL was not recovered. Confidence is `medium`.

## Current-main overlap findings

Direct current-main checks, repository searches, and permanent overlap validation prevented stale candidate assumptions from creating duplicate drafts:

- ATAIX -> existing `hei_ex_000551`
- Atlantis Monad -> existing `hei_ex_000552`
- Atmos DEX -> existing `hei_ex_000553`
- ATOMARS -> existing `hei_ex_000548`
- HiBT -> existing `hei_ex_000761`
- Hibachi -> existing `hei_ex_000722`
- Helix / Helix Spot -> existing `hei_ex_000697`
- Haven1 hSwap -> existing `hei_ex_000721`
- Hata -> existing `hei_ex_000696`
- HeliSwap -> existing `hei_ex_000710`
- Heaven -> existing `hei_ex_000773`
- Heraswap -> existing `hei_ex_000774`
- Hercules -> existing `hei_ex_000714`
- HiveSwap -> existing `hei_ex_000732`
- HorizonDEX -> existing `hei_ex_000719`
- Horiza -> existing `hei_ex_000776`
- Holdstation Swap -> existing Holdstation entity `hei_ex_000725`

The initial Holdstation Swap draft was blocked by permanent overlap validation because current main already represents the same Holdstation identity. The draft was removed and replaced by Goblins AMM while preserving the five-entity batch size.

Helix Markets was not promoted separately because its branding and helixapp.com identity overlap the existing Helix entity and stronger evidence for a separate entity boundary was not established.

Hydrometer Finance was not promoted in this routine batch because the current protocol registry carries a rug-pull warning and the lifecycle requires separate incident and terminal-state review.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 715
- projected event count: 1004
- projected evidence count: 3114
- remaining to D-750 after projected merge: 35

## Operating mode

BC1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.