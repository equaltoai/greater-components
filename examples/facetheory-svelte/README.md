# FaceTheory Svelte Example

This example shows the recommended FaceTheory host path for Greater Components inside this repo.

The workspace pins FaceTheory `v0.3.1` for this example so the published package includes the runtime-session fixes from FaceTheory issues `#6` and `#7`.

## What It Covers

- `createSvelteFace()` for the Svelte SSR face module
- `viteAssetsForEntry()` and `viteHydrationForEntry()` against a real Vite build manifest
- a representative Greater stack using public `@equaltoai/*` package surfaces
- the primitives theme bootstrap flow on both the server document and client hydration path
- a matching CI smoke test that builds the client assets and renders the example through `createFaceApp()`

## Files

- `src/app.ts` creates the FaceTheory app
- `src/home.face.ts` defines the SSR route, theme document attrs, and Vite asset wiring
- `src/community-post-ssr.ts` server-renders the reusable Greater community post through public package imports
- `src/client/home.ts` hydrates the public `Post.Root` surface after bootstrapping `preferencesStore`
- `src/client/home.css` provides the built stylesheet and asset graph consumed through the Vite manifest
- `vite.config.ts` emits the manifest consumed by the FaceTheory route

## Verify

Build the client assets:

```bash
pnpm build:facetheory-example
```

Then run the repo-level smoke command:

```bash
pnpm test:facetheory
```

Or validate the example module directly:

```bash
pnpm exec tsc --noEmit -p examples/facetheory-svelte/tsconfig.json
```
