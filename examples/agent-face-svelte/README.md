# Agent Face Svelte Example

This example shows the intended public-package adoption path for `faces/agent`.

It renders the canonical agent-first screens from `@equaltoai/greater-components/faces/agent` and keeps the host code limited to:

- theme/style imports
- route-level screen selection
- product data wiring
- host-owned navigation and branding

## Run locally

```bash
pnpm exec vite dev --config examples/agent-face-svelte/vite.config.ts
```

## Build

```bash
pnpm exec vite build --config examples/agent-face-svelte/vite.config.ts
```

## Typecheck

```bash
pnpm exec tsc --noEmit -p examples/agent-face-svelte/tsconfig.json
```

The playground route at `/agent` embeds the same `AgentFaceDemo.svelte` component used here so the local demo and example consumption path stay aligned.
