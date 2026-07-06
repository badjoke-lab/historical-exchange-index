# HEI Reviewed Update Feeds Specification

Status: fixed feed contract  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06

## 1. Purpose

HEI exposes reviewed Registry Update entries as stable machine-readable feeds.

The feeds exist for:

- feed readers;
- simple scripts;
- AI agents and research tools;
- future ledger-series monitoring and status tools.

They are not raw monitoring feeds and must not become a publication path for unreviewed candidates.

## 2. Authoritative source

The only source for the D-5 update feeds is:

```text
data/registry-updates.json
```

Feed generation must not read:

- raw monitoring output;
- unresolved watchlists;
- candidate staging files;
- private research notes;
- operator-only repair queues;
- unmerged candidate records.

A monitoring result becomes feed-eligible only after it is separately reviewed and represented in the reviewed Registry Update source.

## 3. Public endpoints

```text
/feeds/updates.json
/feeds/updates.xml
```

`/feeds/updates.json` uses JSON Feed 1.1.

`/feeds/updates.xml` uses RSS 2.0.

Both feeds must represent the same ordered update set.

## 4. Ordering contract

Items are sorted deterministically:

```text
1. date descending
2. id ascending when dates are equal
```

Rebuild time must not reorder items whose reviewed source fields are unchanged.

## 5. Stable identity contract

For a Registry Update with:

```text
id = phase-c-audit-complete
```

feed identity is:

```text
urn:hei:registry-update:phase-c-audit-complete
```

This value is used as:

- JSON Feed `item.id`;
- RSS `<guid isPermaLink="false">`.

Once published, a Registry Update ID must not be changed only for editorial preference. An ID change creates a different feed item identity.

## 6. Item URL contract

Feed item URLs point to the reviewed human-readable Registry Update anchor:

```text
https://hei.badjoke-lab.com/updates/#<update_id>
```

The `/updates/` page must preserve matching element IDs for published updates.

## 7. Date semantics

The Registry Update source currently stores a reviewed date in `YYYY-MM-DD` form.

JSON Feed maps it to:

```text
YYYY-MM-DDT00:00:00.000Z
```

RSS maps the same UTC instant to RFC-compatible UTC date text.

This conversion does not claim a more precise publication time than the reviewed source contains.

## 8. JSON Feed contract

Top-level required fields:

```text
version
name/title
home_page_url
feed_url
description
language
items
```

HEI uses JSON Feed 1.1:

```text
https://jsonfeed.org/version/1.1
```

Each item contains:

```text
id
url
title
content_text
summary
date_published
tags
_hei
```

The `_hei` extension contains reviewed structured context:

```text
update_id
update_type
counts
added_entities        integer count
updated_entities      integer count
evidence_added
reviewed_public_only  true
```

The extension must not contain private notes or internal monitoring state.

## 9. RSS contract

The RSS 2.0 channel includes:

```text
title
link
description
language
lastBuildDate
Atom self link
```

Each item includes:

```text
title
link
guid
pubDate
category
description
```

`lastBuildDate` is derived from the newest reviewed update date, not the wall-clock rebuild time. This avoids meaningless feed changes caused only by rebuilding unchanged data.

## 10. Content mapping

Feed content may include reviewed public information already represented in the Registry Update source:

- update title;
- update summary;
- reviewed before/after counts;
- added entity names;
- updated entity names;
- reviewed notes;
- evidence-added count;
- update type.

Feeds must not enrich source entries with unreviewed monitoring claims.

## 11. Discovery contract

Both feed endpoints must be discoverable through:

- `/updates/` alternate metadata;
- visible feed links on `/updates/`;
- `/version.json` public file map;
- `/data/manifest.json` public file map;
- `/llms.txt`;
- `/ai.txt`.

Feed files are public outputs, not sitemap page routes. They are not added to the HTML page sitemap.

## 12. Validation contract

Build and CI validation must verify:

- both feed files exist;
- JSON Feed version is correct;
- JSON and RSS item counts equal the reviewed source count;
- item ordering matches the source ordering contract;
- JSON IDs and RSS GUIDs match the stable identity contract;
- item URLs match `/updates/#<update_id>`;
- dates map from the reviewed source date;
- JSON `_hei.reviewed_public_only` is true;
- manifest and discovery files list both endpoints;
- exported static output contains both feed files;
- the production checker can fetch both endpoints with expected content types.

## 13. Compatibility and change control

The following are compatibility-sensitive and require a reviewed specification change before implementation:

- feed endpoint URLs;
- stable ID prefix;
- ordering rules;
- source-of-truth file;
- JSON Feed major version;
- RSS GUID semantics;
- date mapping semantics;
- reviewed-only safety boundary.

Adding optional fields is allowed only when existing consumers can ignore them safely and all current validation remains green.
