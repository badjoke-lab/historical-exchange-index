# HEI Publishing Safety Policy

Status: initial implementation policy  
Scope: Publishing drafts generated from HEI internal monitoring outputs

## Core rule

HEI monitoring output is internal by default.

External publishing must use edited drafts only. Raw monitoring output must not be copied directly into public pages, social posts, or update articles.

## Allowed first-stage external materials

The first-stage publishing draft generator may prepare drafts for:

- reviewed HEI registry updates
- monitoring-signal summaries that require manual review
- evidence / coverage aggregate summaries
- X post drafts for manual posting
- homepage headliner drafts for later manual review

## Not allowed in public drafts

The following must remain internal unless separately reviewed and rewritten:

- raw active-status checks
- DNS failure lists
- HTTP error lists
- evidence URL 404 lists
- GitHub Actions failure logs
- internal scores
- duplicate matching internals
- possible-dead or at-risk raw classifications
- monitoring system error details

## Required labels for unconfirmed material

Unconfirmed material must use labels such as:

- monitoring signal only
- not canonical yet
- under review
- requires further source review

Japanese equivalents may be used when writing Japanese copy:

- 監視シグナル
- HEI正式分類ではありません
- 確認中
- 追加確認が必要です

## Strong language restrictions

Auto-generated publishing drafts should avoid:

- dangerous
- scam
- fraud
- dead soon
- will collapse
- bankrupt confirmed
- unsafe exchange
- 詐欺
- 危険
- 死にそう
- 破綻確定
- 出金できないらしい
- 飛んだ

Canonical HEI enum values may still appear when already reviewed in canonical records, but they should not be used as sensational headlines.

## Publication workflow

The safe workflow is:

```txt
monitoring output
↓
publishing draft generation
↓
manual / AI review
↓
copy edit and source check
↓
optional promotion to content/updates
↓
manual X post
```

The generator must not:

- write to `content/updates/**`
- update app pages
- post to X
- change canonical JSON data

## First implementation goal

The first goal is not to publish content.

The first goal is to determine whether monitoring output consistently produces usable external material.

The key outputs are:

- `publication-decision.json`
- `publication-items.json`
- `internal-review.md`
- `homepage-headliner.md`
- `updates-article-draft.md`
- `x-post-drafts.md`
- `source-map.json`
