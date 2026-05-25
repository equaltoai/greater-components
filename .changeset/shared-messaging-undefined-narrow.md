---
'@equaltoai/greater-components-messaging': patch
---

Fix `svelte-check` strict-mode `Object is possibly 'undefined'` errors in `ConversationWorkflowSummary.svelte` and `WorkflowThreadMoment.svelte`. The shared `formatLabel` helper indexed `part[0]` after a `.filter(Boolean)` chain that TypeScript can't narrow under `noUncheckedIndexedAccess`. Switched to `String.prototype.charAt(0)`, which is contracted to return a string (empty if out of range), eliminating the undefined path without changing observable behavior. Pure type-narrowing fix; messaging's 113-test suite remains green. This also cascades-clears the 2 `svelte-check` errors `faces/agent` was inheriting from these files via package-boundary type-checking. Part of Project 41 (#680) workspace svelte-check parity restoration.
