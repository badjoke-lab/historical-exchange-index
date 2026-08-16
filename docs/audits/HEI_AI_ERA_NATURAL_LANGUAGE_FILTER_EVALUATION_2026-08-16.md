# HEI AI-era Natural-language Filter Evaluation — 2026-08-16

Status: Stage H decision record  
Decision: **DEFER / DO NOT IMPLEMENT NOW**

Authority:

- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`
- `docs/HEI_EXPLORER_QUERY_CONTRACT.md`
- AI-era Stage D deterministic Explorer strengthening

## 1. Question

Should HEI now add natural-language-to-structured-filter translation?

The only acceptable model under the AI-era specification would translate user text into the existing deterministic Explorer query contract. Free-form AI answers, AI-generated canonical facts and opaque ranking are outside scope.

## 2. Current deterministic capability

The reviewed Explorer already supports structured Entity and Event retrieval across identity, type, status, lifecycle dates, death reason, origin, URL state, archive state, confidence, event type, event impact and parent context. AI-era Stage D adds verification-date and reviewed evidence provenance dimensions while preserving stable shareable URLs.

The machine-readable record layer also exposes one reviewed entity with its reviewed events, evidence provenance, relationships and verification metadata through static deterministic JSON.

This means the principal retrieval problem can be solved without an LLM dependency.

## 3. Evidence for immediate activation

Repository review found no open HEI issue documenting concrete user demand that cannot be satisfied by the structured Explorer and static machine-readable outputs. No supported analytics evidence currently establishes that users are failing to complete research tasks because they cannot formulate the deterministic filters.

The existing roadmap already classifies natural-language filter translation as conditional rather than mandatory.

Absence of evidence is not proof that the feature has no value. It is a reason not to introduce a new probabilistic dependency before a demonstrated need exists.

## 4. Risk and maintenance analysis

Immediate implementation would add costs not justified by current evidence:

- prompt/model behavior becomes another compatibility surface;
- translation errors could silently broaden or narrow research results;
- external model/provider availability would become a dependency for a task already achievable deterministically;
- testing would need to prove that every accepted natural-language interpretation compiles only to permitted structured keys and never invents records;
- localization behavior would become more complex while the separate L-2 localization gate remains under evidence capture.

These costs conflict with HEI's preference for static deterministic public data where sufficient.

## 5. Decision

**DEFER.**

Do not implement a public natural-language filter translator in the current AI-era completion pass.

This is a completed evaluation, not a permanent ban. Re-open only when at least one evidence-backed trigger exists, for example:

1. repeated user requests for research questions that map cleanly to existing structured filters but are difficult to formulate manually;
2. Explorer analytics or usability evidence showing material query-construction failure;
3. an external consumer requirement where deterministic NL-to-query compilation materially improves access without changing canonical facts;
4. a provider-independent or safely optional implementation path with a strict deterministic output validator.

## 6. Mandatory boundaries if re-opened

Any future translator must:

- compile only to the reviewed Explorer query contract;
- expose the resulting structured query to the user;
- permit deterministic re-execution without the model;
- never invent entity/event/evidence records;
- never write canonical data;
- fail closed on unsupported concepts;
- preserve canonical query keys across locales;
- remain optional so the core registry works without an AI provider.

## 7. Stage H result

Stage H is satisfied by an evidence-backed product decision: evaluate the feature and **defer implementation** until demand justifies the additional probabilistic layer.

The deterministic registry, Explorer, Compare, Stats and machine-readable surfaces remain the primary HEI product path.
