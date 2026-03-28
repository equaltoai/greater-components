# FaceTheory Integration

This guide describes the current hosting boundary for Greater Components in FaceTheory and other server-rendered hosts.

## Official Example

The repo now includes a blessed FaceTheory host example at [`examples/facetheory-svelte`](../examples/facetheory-svelte). It wires:

- `createSvelteFace()` for the SSR route module
- `viteAssetsForEntry()` for preload and stylesheet tags
- `viteHydrationForEntry()` for the hydration payload and bootstrap module
- Greater tokens, primitives, and a reusable face in one server-rendered page

Validate the example locally with:

- `pnpm test:facetheory`
- `pnpm exec tsc --noEmit -p examples/facetheory-svelte/tsconfig.json`

## SSR-safe surfaces

The following surfaces are intended to be import-safe and initial-render-safe in Node-backed SSR:

- `@equaltoai/greater-components/tokens`
- `@equaltoai/greater-components/primitives`
- `@equaltoai/greater-components/headless`
- `@equaltoai/greater-components/adapters` core stores and mappers
- `@equaltoai/greater-components/faces/blog`
- `@equaltoai/greater-components/faces/community`
- `@equaltoai/greater-components/faces/social`

Server safety here means module evaluation and initial render should not require `window`, `document`, `localStorage`, `navigator`, or similar browser globals.

## Hydration-aware surfaces

Some exported surfaces are server-safe to import and render, but still expect client hydration for browser-only behaviors:

- `preferencesStore` and theme controls hydrate client preferences after SSR
- transport- or session-aware adapter stores can be rendered on the server, then enhanced on the client
- `createBrowserPresenceActivitySource()` and `createBrowserPresenceLocationSource()` are client-only enhancers for the SSR-safe presence core
- `createBrowserArticleShareHandlers()`, clipboard flows, and push-notification flows need either browser APIs or host-provided handlers

## Presence Store Host Boundary

`createPresenceStore()` is intended to stay server-safe. Browser activity and route tracking should be attached explicitly instead of being assumed inside the core store:

- seed SSR state with `initialLocation`
- pass a host-owned `locationSource` when the runtime knows the current route
- pass a host-owned `activitySource` when the client wants idle/active tracking
- use `createBrowserPresenceLocationSource()` and `createBrowserPresenceActivitySource()` only in browser entry points

This keeps FaceTheory and other SSR hosts in control of routing semantics while still allowing thin browser wrappers where they are appropriate.

## Intentionally browser-only surfaces

The following integrations remain intentionally browser-only and should be isolated behind host guards or client-only entry points:

- wallet-connect and passkey flows in `shared/auth`
- backup-code print and download helpers in `shared/auth`
- push notification registration flows in `faces/social`

When hosting Greater Components through FaceTheory, prefer explicit host wiring for navigation, location, hydration, and browser-only capabilities instead of depending on implicit `window` fallbacks.

## Route-Aware Face Contracts

Route-aware faces expose host hooks so the host can own URL semantics directly:

- community posts accept `resolveHref(post)` and `onNavigate(postId, { href, post })`
- article sharing accepts `resolveShareUrl(article)`, `onCopyLink(article, url)`, and `onOpenShareLink(article, platform, shareUrl)`
- browser defaults can live in a host-only wrapper such as `createBrowserArticleShareHandlers()`

This lets FaceTheory, SvelteKit, and other hosts decide how route state, canonical URLs, and share flows are derived without patching vendored Greater code.

## Theme Bootstrap For SSR

Use the primitives theme helpers to derive a server snapshot, emit strict-CSP-safe document attributes, and then hydrate the client store from the same snapshot:

```ts
import {
	createThemeBootstrapSnapshot,
	getThemeDocumentAttributes,
	preferencesStore,
} from '@equaltoai/greater-components/primitives';

const snapshot = createThemeBootstrapSnapshot({
	cookie: request.headers.get('cookie') ?? '',
	system: {
		colorScheme: 'dark',
		motion: 'normal',
		highContrast: false,
	},
});

const themeAttributes = getThemeDocumentAttributes(snapshot);

// Server: spread themeAttributes onto <html> or <body>.
// Client: hydrate before mounting the host shell.
preferencesStore.hydrate(snapshot);
```

This flow keeps `data-theme`, density, font size, motion, and custom theme attributes aligned across server render and hydration without inline styles or CSP exceptions.
