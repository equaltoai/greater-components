# FaceTheory Integration

This guide describes the current hosting boundary for Greater Components in FaceTheory and other server-rendered hosts.

## SSR-safe surfaces

The following surfaces are intended to be import-safe and initial-render-safe in Node-backed SSR:

- `@equaltoai/greater-components/primitives`
- `@equaltoai/greater-components/headless`
- `@equaltoai/greater-components/faces/blog`
- `@equaltoai/greater-components/faces/community`
- `@equaltoai/greater-components/faces/social`

Server safety here means module evaluation and initial render should not require `window`, `document`, `localStorage`, `navigator`, or similar browser globals.

## Hydration-aware surfaces

Some exported surfaces are server-safe to import and render, but still expect client hydration for browser-only behaviors:

- `preferencesStore` and theme controls hydrate client preferences after SSR
- transport- or session-aware adapter stores can be rendered on the server, then enhanced on the client
- sharing, clipboard, and push-notification flows need either browser APIs or host-provided handlers

## Intentionally browser-only surfaces

The following integrations remain intentionally browser-only and should be isolated behind host guards or client-only entry points:

- wallet-connect and passkey flows in `shared/auth`
- backup-code print and download helpers in `shared/auth`
- push notification registration flows in `faces/social`

When hosting Greater Components through FaceTheory, prefer explicit host wiring for navigation, location, hydration, and browser-only capabilities instead of depending on implicit `window` fallbacks.
