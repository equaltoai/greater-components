### greater-components: Phased Implementation Checklist

Use this checklist to drive execution of the repository plan. Items are grouped by rollout phase and further by package/component. Each task is actionable and verifiable. Check off items as you complete them.

Note on conventions
- All UI is Svelte 5 (runes), TypeScript-strict.
- Accessibility (WCAG 2.1 AA) is required for all public components.
- Tests: Vitest unit + Storybook 9 CT + Playwright visual/interaction + axe checks.
- Versioning: Changesets, semantic versioning, automated releases.

---

### Phase 0 – Scaffold (Week 1) ✅ COMPLETE

- [x] Repository scaffolding
  - [x] Initialize pnpm workspace with `packages/` and `apps/`
  - [x] Add root configs: `package.json`, `pnpm-workspace.yaml`, `.editorconfig`, `.nvmrc`, `.prettierrc`, `.eslintrc.*`, `tsconfig.base.json`
  - [x] Add AGPL-3.0-only `LICENSE`
  - [x] Add `CODEOWNERS` with per-package ownership
  - [x] Add DCO configuration and `CONTRIBUTING.md`

- [x] CI/CD skeleton (GitHub Actions)
  - [x] Workflow: `lint` (ESLint + Prettier check)
  - [x] Workflow: `test` (build Storybook, run Vitest CT)
  - [x] Workflow: `e2e` (Playwright Chromium/Firefox matrix, visual + axe)
  - [x] Workflow: `release` (Changesets version & publish)
  - [x] Workflow: `docs` (playground/docs build)
  - [x] pnpm caching with shared store across jobs

- [x] Release/versioning plumbing
  - [x] Install and configure Changesets
  - [x] Add PR check that fails if changeset is missing
  - [x] Configure snapshot `-next` nightly workflow

- [x] Security & compliance baselines
  - [x] Enable Dependabot
  - [x] pnpm audit step in CI
  - [x] Add baseline CSP guidance to docs (no inline scripts)

---

### Phase 1 – Foundation (Weeks 2–3) ✅ COMPLETE

- [x] Package: `@greater/tokens`
  - [x] Define tokens (colors, typography, spacing, radii, shadows, motion) JSON using Category–Type–Item–State
  - [x] Build outputs: `theme.css` (CSS variables) and `tokens.d.ts` (TS maps)
  - [x] Provide light, dark, high-contrast token sets
  - [x] Add unit tests validating token presence and CSS variable emission
  - [x] Add Storybook page demonstrating themes and live switching
  - [x] Add changeset entry

- [x] Package: `@greater/icons`
  - [x] Ingest Feather + Fediverse glyphs
  - [x] Generate tree-shakable Svelte components per icon
  - [x] Provide alias map (`boost`, `unboost`, `globe`, ...)
  - [x] Add icon catalog Storybook with search
  - [x] Add types and exports
  - [x] Add changeset entry

- [x] Package: `@greater/primitives`
  - [x] Component: `Button`
    - [x] Props and slots defined; variants (solid/outline/ghost), sizes, disabled, loading
    - [x] Token-driven styles; CSS vars hook into `@greater/tokens`
    - [x] A11y: role, focus ring, keyboard activation, ARIA loading
    - [x] Stories with controls; Vitest unit tests
    - [x] Playwright interactions and visual baseline
    - [x] Changeset entry
  - [x] Component: `TextField`
    - [x] Props (value, placeholder, type, invalid, prefix/suffix slots)
    - [x] Label + helper + error patterns (accessible)
    - [x] Keyboard and form semantics; ARIA describedby/errormessage
    - [x] Stories, Vitest, Playwright, visual baseline
    - [x] Changeset entry
  - [x] Component: `Modal`
    - [x] Focus trap, scroll lock, escape to close, backdrop
    - [x] ARIA: `dialog`, `aria-modal`, labelled by
    - [x] Portal and stacking strategy
    - [x] Stories, Vitest, Playwright (open/close, focus cycling)
    - [x] Changeset entry

- [x] App: `apps/playground`
  - [x] Vite + Histoire/Storybook 9 configured
  - [x] Theme switcher (light/dark/high-contrast)
  - [x] Tokens and primitives showcased

---

### Phase 2 – Read-Only (Weeks 4–5) ✅ COMPLETE

- [x] Package: `@greater/utils`
  - [x] `sanitizeHtml` using DOMPurify allow-list
  - [x] `relativeTime` with locale support
  - [x] `linkifyMentions` for @handles, #tags, URLs
  - [x] `keyboardShortcuts` helper
  - [x] Unit tests for all helpers
  - [x] Changeset entry

- [x] Package: `@greater/fediverse` (read-only components)
  - [x] Component: `ContentRenderer`
    - [x] Render sanitized HTML content
    - [x] Linkify mentions/hashtags; target and rel hygiene
    - [x] Spoiler/Content Warning support (collapsed state)
    - [x] Stories, Vitest snapshot, Playwright visual
    - [x] Changeset entry
  - [x] Component: `StatusCard`
    - [x] Anatomy: avatar, display name/handle, timestamp, content, media, action bar (read-only)
    - [x] Slots for custom header/footer
    - [x] Compact/comfortable density variants
    - [x] A11y labels for content regions
    - [x] Stories, Vitest, Playwright visual
    - [x] Changeset entry
  - [x] Component: `TimelineVirtualized`
    - [x] Windowed list with variable heights; preserve scroll on prepend
    - [x] Gap loader and end-of-feed indicators
    - [x] Accessibility: landmark, item semantics
    - [x] Stories (10k items), Vitest utility tests, Playwright perf sanity
    - [x] Changeset entry

- [x] Integration path
  - [x] Prepare example `HomeTimeline` in playground behind feature flag
  - [x] Document read-only usage with mock data

---

### Phase 3 – Interactions (Weeks 6–7) ✅ COMPLETE

- [x] Package: `@greater/adapters`
  - [x] Transport: `WebSocketClient`
    - [x] Connect with auth token; heartbeat and latency sampling
    - [x] Reconnect with capped exponential back-off (0.5s → 30s) + jitter
    - [x] Persist/resume `lastEventId`
    - [x] Vitest unit tests (timer control); Playwright fake server tests
  - [x] Transport: `SseClient` and HTTP polling fallback
    - [x] Feature detection and graceful downgrade
    - [x] Tests covering fallback switching
  - [x] `TransportManager`
    - [x] Chooses WS/SSE/polling at runtime; emits unified events
    - [x] Comprehensive tests for mode switching and error states
  - [x] Stores (Svelte runes)
    - [x] `timelineStore`: add/replace/delete; streaming edits
    - [x] `notificationStore`: streaming notifications, unread counts
    - [x] `presenceStore`: user/session connection state
    - [x] Tests for reactivity and memory safety
  - [x] Mappers
    - [x] Mastodon REST v1 payloads → unified models
    - [x] Lesser GraphQL payloads → unified models
    - [x] Streaming delete/edit handling
    - [x] Fixtures + unit tests
  - [x] Changeset entry

- [x] Package: `@greater/fediverse` (interactive components)
  - [x] Component: `ActionBar`
    - [x] Buttons: reply, boost, favorite, share; disabled in read-only mode
    - [x] Slots for extensions
    - [x] A11y labels/tooltips
    - [x] Stories, Vitest, Playwright
    - [x] Changeset entry
  - [x] Component: `NotificationsFeed`
    - [x] Grouped by type; virtualized list
    - [x] Click to navigate; a11y semantics
    - [x] Stories, tests, visuals
    - [x] Changeset entry

- [x] Package: `@greater/primitives` (additional)
  - [x] `Menu` (roving tabindex, typeahead)
  - [x] `Tooltip` (ARIA, hover/focus/long-press)
  - [x] `Tabs` (keyboard navigation, panel semantics)
  - [x] `Avatar` (fallback initials, status badge)
  - [x] `Skeleton` (animated shimmer, reduced motion)
  - [x] Tests, stories, visuals, changesets for each

---

### Phase 4 – Composer & Profiles (Weeks 8–9) ✅ COMPLETE

- [x] Package: `@greater/fediverse`
  - [x] Component: `ComposeBox`
    - [x] Text area with character count; soft and hard limits
    - [x] CW toggle; media picker slots; poll slot
    - [x] Draft persistence; keyboard shortcuts (submit/cancel)
    - [x] A11y: label associations, live region for count
    - [x] Stories (variants), unit tests, Playwright interactions
    - [x] Changeset entry
  - [x] Component: `ProfileHeader`
    - [x] Banner, avatar, display name, bio (sanitized), meta
    - [x] Follow button slot; counts
    - [x] Stories, tests, visuals
    - [x] Changeset entry

- [x] Adapters integration
  - [x] Wire `TransportManager` + stores to `TimelineVirtualized` and `NotificationsFeed`
  - [x] Example flows in playground (mock server and real endpoint toggle)

---

### Phase 5 – Settings & Docs (Weeks 10–11)

- [ ] Settings & theming
  - [ ] Theme switcher UI + density controls
  - [ ] Persisted user preferences
  - [ ] High-contrast verification for all components (axe)

- [ ] Documentation site
  - [ ] Write component usage guidelines per component
  - [ ] Status badges (Alpha/Stable/Deprecated) per component
  - [ ] Accessibility scorecards embedded
  - [ ] Token docs auto-ingesting `tokens.json`

- [ ] A11y audits
  - [ ] Run automated axe across all stories in CI; fix violations
  - [ ] Manual keyboard testing checklist for complex components

- [ ] Release readiness
  - [ ] Verify coverage ≥ 90% lines across packages
  - [ ] Verify visual diffs threshold ≤ 0.1% per story
  - [ ] Changesets hygiene: entries for all public changes

---

### Phase 6 – v1.0 GA (Week 12)

- [ ] API freeze & stabilization
  - [ ] Lock public component props/slots/events
  - [ ] Document any deprecations with migration notes

- [ ] Version & publish
  - [ ] Approve Changesets version PR → merge
  - [ ] CI `ci:publish` publishes ESM + types with provenance
  - [ ] Tag `v1.0.0` and generate changelogs

- [ ] Comms & governance
  - [ ] Publish announcement post
  - [ ] Update `README` with install and quickstart
  - [ ] Confirm `CODEOWNERS` and DCO in place

---

### Component-specific Definition of Done (apply to every component)

- [ ] API
  - [ ] Props, events, and slots documented in stories
  - [ ] Types exported and discoverable via IntelliSense
- [ ] Styling & theming
  - [ ] Token-driven; supports light/dark/high-contrast
  - [ ] Respects reduced-motion and prefers-contrast
- [ ] Accessibility
  - [ ] Semantics and ARIA complete, keyboard reachable, focus visible
  - [ ] axe clean at WCAG 2.1 AA in Storybook
- [ ] Testing
  - [ ] Vitest unit tests (logic, render, edge cases)
  - [ ] Storybook 9 component tests
  - [ ] Playwright interactions + visual baseline checked into repo
- [ ] Docs & release
  - [ ] Storybook docs with usage and examples
  - [ ] Changeset entry with appropriate bump type

---

### Cross-package Quality Gates (enforced in CI)

- [ ] Linting passes (ESLint + Prettier)
- [ ] TypeScript strict build passes for all packages
- [ ] Unit + component tests green; coverage ≥ 90% lines
- [ ] Playwright visual and interaction tests green; diff ≤ 0.1%
- [ ] A11y (axe) passes across stories
- [ ] Changesets present for all public changes



