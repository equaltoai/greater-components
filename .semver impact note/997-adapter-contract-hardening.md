# Patch — harden Lesser adapter and Registry contract handling

Unknown quote-permission values now fail closed as `NONE`; hand-written timeline operations use the pinned Lesser `timelineUpdates` subscription and valid enum values; the OpenAPI auth baseline records a repository-relative source path; and Registry regeneration now includes every declaration map referenced by an installed `.d.ts` file.

This is a bug fix against the existing Lesser v1.6.0 pinned snapshot; no pinned contract bytes or public component API changed. Mastodon-compatible rendering and the theming contract are unchanged.
