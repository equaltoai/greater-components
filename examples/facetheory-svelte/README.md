# FaceTheory Svelte Example

This example shows the recommended FaceTheory host path for Greater Components inside this repo.

## What It Covers

- `createSvelteFace()` for the Svelte SSR face module
- `viteAssetsForEntry()` and `viteHydrationForEntry()` for Vite-aware preload and hydration tags
- a representative Greater stack using tokens, primitives, and the community face
- a matching CI smoke test that renders the example through `createFaceApp()`

## Files

- `src/app.ts` creates the FaceTheory app
- `src/home.face.ts` defines the SSR route and Vite asset wiring
- `src/community-post-ssr.ts` renders the reusable Greater community post through Svelte SSR
- `src/client/home.ts` shows a minimal hydration entry

## Verify

Run the repo-level smoke command:

```bash
pnpm test:facetheory
```

Or validate the example module directly:

```bash
pnpm exec tsc --noEmit -p examples/facetheory-svelte/tsconfig.json
```
