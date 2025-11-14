# Non-SSR (CSR-Only) Support Plan

## Goal
Make client-side-only deployments a first-class option for the playground demos, tests, and component packages while preserving the existing SSR workflow.

## Phases

### Phase 1 – Playground Runtime Configuration
- Add a CSR toggle (environment variable or `+layout` flag) so `apps/playground` can run without SSR.
- Ensure `vite.config` and `playwright.demo.config.ts` understand the CSR mode (e.g., `pnpm --filter @equaltoai/playground dev -- --csr`).
- Document the command and provide a package.json script alias for local usage.

### Phase 2 – Route & Data Audit
- Inventory every `load`/`+page.server` file in `apps/playground/src/routes/**`.
- Replace server-only usage with browser-safe logic (guards, `onMount`, or shared modules).
- Verify stores (`timelineStore`, `storage`, etc.) hydrate correctly with no SSR pass.

### Phase 3 – Package Review
- Confirm shared packages do not rely on SSR-only globals; add fallbacks where needed.
- Update `packages/testing` tooling so Playwright can start a CSR server.

### Phase 4 – Testing Enhancements
- Add a dedicated Playwright run (or project) that exercises the CSR mode.
- Consider a Vitest smoke test that imports demo routes in a simulated browser-only context.

### Phase 5 – Documentation & Deployment
- Update README, deployment docs, and Phase 5 log to describe CSR mode usage.
- Provide guidance on hosting CSR builds and highlight any remaining SSR-only features.

### Phase 6 – Rollout & Validation
- Publish a CSR preview build to validate end-to-end.
- Keep SSR workflows intact but add CI coverage for the CSR flag to catch regressions.
