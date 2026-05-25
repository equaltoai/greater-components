---
'@equaltoai/greater-components-admin': patch
---

Fix `svelte-check` strict-mode errors in `Cost/Alerts.svelte`, `SeveredRelationships/List.svelte`, and `TrustGraph/Visualization.svelte`. The `Record<string, unknown>` value type used for adapter results triggers TypeScript's `noPropertyAccessFromIndexSignature` rule — properties must be accessed with bracket notation. Eight references updated (`alert.id` → `alert['id']`, etc.). `TrustGraph/Visualization.svelte` separately required an explicit guard for the `root` variable to satisfy `noUncheckedIndexedAccess`; the algorithm already returns early when `baseNodes` is empty, but TypeScript doesn't track that narrowing across the find/fallback chain. Pure type-narrowing fix; runtime semantics unchanged; admin's 156-test suite remains green. Part of Project 41 (#680) workspace svelte-check parity restoration.
