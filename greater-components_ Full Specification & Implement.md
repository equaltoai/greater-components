<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# greater-components: Full Specification \& Implementation Blueprint

Building on our earlier discussion, this document lays out a complete, production-ready specification for the **equaltoai/greater-components** repository—the AGPL-licensed, Svelte 5-based component library that will power Greater, Lesser, and any future Fediverse-compatible clients.

Below you will find the repository’s high-level architecture, package responsibilities, real-time transport layer, testing strategy, release automation, and governance model. Implementing the plan will give your team a scalable, accessible, and WebSocket-first design system that can be consumed by multiple apps with minimal friction.

## Executive Summary

Greater-components is organised as a pnpm monorepo with six publishable packages and one demo app.
Key design tenets include:

* **Svelte 5 (“runes”)** for minimal runtime, composability, and TypeScript‐strict ergonomics.[^1][^2]
* **AGPL-3.0-only** licence to protect contributions while allowing wide reuse.
* **WebSocket-first real-time layer** with automatic SSE and polling fallbacks and exponential-back-off reconnection.[^3][^4]
* **Design-token-driven theming** (light, dark, high-contrast) to ensure brand flexibility and WCAG AA colour contrast.[^5][^6]
* **Vitest + Storybook 9 component testing**, Playwright visual/interaction coverage, and axe-powered a11y gates.[^7][^8][^9]
* **Changesets + pnpm workspaces** for semver-accurate versioning and automated GitHub Actions releases.[^10][^11]

The sections that follow provide the detailed blueprint.

## Repository Topology

![Proposed monorepo layout for greater-components](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ebfea90fdd43123faef2f8c97cad379e/3b54b32e-768a-4874-b764-73b52a09e128/2205ab35.png)

Proposed monorepo layout for greater-components

The monorepo is split into `packages/` (publishable libraries) and `apps/` (internal playground + docs). Each package is individually versioned via Changesets, yet shares the same tooling and CI pipeline for coherence.[^12][^13]

***

## 1. Core Principles \& Governance

### 1.1 Licence \& Contributor Model

* Source code is **AGPL-3.0-only** to keep upstream derivatives open.
* A `CODEOWNERS` file assigns maintainers per package.
* All contributors sign a lightweight DCO.


### 1.2 Accessibility by Default

* All primitives ship with keyboard focus rings, ARIA roles, and screen-reader labels.[^14][^15]
* Playwright + axe audits run in CI and block merges if violations are detected.[^16]


### 1.3 Design Token Source-of-Truth

* JSON tokens follow the “Category–Type–Item–State” convention.[^6][^17]
* Tokens are exported as CSS vars for runtime theming and as TS maps for IntelliSense.[^5]

***

## 2. Package Specifications

### 2.1 `@greater/tokens`

* **Contents**: colour palettes, typography scale, spacing, radii, shadows, motion.
* **Deliverables**: `theme.css`, `tokens.d.ts`, light/dark/high-contrast token sets.
* **Build**: Vite library mode outputs ESM + type defs.


### 2.2 `@greater/icons`

* Feather + Fediverse glyph set compiled into tree-shakable Svelte components.
* Optional alias mapping (`boost`, `unboost`, `globe`, etc.) for domain clarity.


### 2.3 `@greater/primitives`

* Headless UI building blocks: Button, TextField, Modal, Menu, Tooltip, Tabs, Avatar, Skeleton.
* Each primitive exposes prop-level token overrides for advanced theming.
* All components embrace **slot-first composition** to minimise API surface.


### 2.4 `@greater/fediverse`

* Domain-specific components that map directly to Mastodon/Lesser objects: `StatusCard`, `ContentRenderer`, `ComposeBox`, `TimelineVirtualized`, `NotificationItem`, etc.
* HTML content is sanitised via DOMPurify with a strict allow-list to prevent XSS.[^18][^19]


### 2.5 `@greater/adapters`

* **Transports**
    * `WebSocketClient` with heartbeat, latency sampling, and **exponential-back-off + jitter** reconnection.[^3][^20]
    * SSE and HTTP-poll fallbacks chosen by `TransportManager` based on runtime capability.
* **Stores**
    * `timelineStore`, `notificationStore`, `presenceStore` built with Svelte runes for fine-grained reactivity.[^21]
* **Mappers**
    * Converts Mastodon REST v1 and Lesser GraphQL payloads into unified view models; handles streaming deletes/edits.[^22][^23][^18]


### 2.6 `@greater/utils`

* Shared helpers: `sanitizeHtml`, `relativeTime`, `focusTrap`, `keyboardShortcuts`, and `linkifyMentions`.

***

## 3. Real-Time Transport Layer

Mastodon’s native streaming endpoints are SSE-based , but many modern instances expose **WebSocket gateways**. Greater-components therefore:[^18]

1. Attempts WS (`wss://{instance}/api/v1/streaming`) with auth token.
2. Fallbacks to SSE or 30-second HTTP polling if WS fails.
3. Wraps reconnect logic with capped exponential back-off (0.5 s → 30 s) and random jitter to avoid thundering-herd spikes.[^3][^24][^25]
4. Persists `lastEventId` to resume missed events after reconnect.[^22]

This guarantees near-instant updates while preserving battery and server health.

***

## 4. Testing \& Quality Gates

### 4.1 Component \& Interaction Tests

* **Storybook 9 Vitest addon** auto-converts every story into a Vitest test running in real Chromium.[^8][^9]
* Playwright executes complex user flows in CI; failures surface in the Storybook UI for fast triage.[^26][^27]


### 4.2 Visual \& A11y Regression

* Playwright captures baseline PNGs for each story; diffs > 0.1% pixel threshold fail builds.[^7]
* `@storybook/addon-a11y` runs axe with WCAG 2.1 AA rules on every story.[^16]


### 4.3 Coverage

* `vitest --coverage` merges branch/statement coverage across primitives and fediverse packages; 90% line coverage gate enforced.[^28]

***

## 5. Release \& Versioning Workflow

1. **Changeset PRs** – every feature/fix adds a markdown changeset describing bump type; bot fails PR if missing.[^29][^30]
2. **Version PR** – `changesets/action@v1` opens an automated PR that bumps versions, updates lockfile, and writes changelogs.[^10][^31]
3. **Publish** – after the version PR merges, CI runs `pnpm ci:publish` to publish any unpublished versions with provenance metadata.[^11][^32]
4. **Snapshot Releases** – a nightly workflow publishes `-next` tags for integration testing using `seek-oss/changesets-snapshot`.[^33]

***

## 6. CI/CD Pipeline (GitHub Actions)

| Job | Purpose | Key Steps |
| :-- | :-- | :-- |
| `lint` | ESLint + Prettier check | `pnpm lint` |
| `test` | Unit + Storybook component tests | Storybook build → Vitest browser mode [^9] |
| `e2e` | Playwright interaction+visual+axe | Matrix of Chromium / Firefox |
| `release` | Changesets version \& publish | Requires `NPM_TOKEN` secret [^11] |
| `docs` | Deploy sandbox to Cloudflare Pages | `pnpm docs:build` |

Caching uses `pnpm/action-setup` with shared store across jobs for sub-1 min cold installs.

***

## 7. Documentation \& Design-System Site

* **Histoire** for live component docs in `apps/playground` (fast Vite HMR, a11y addon).
* Zeroheight or similar can ingest `tokens.json` and Storybook stories to create human-readable guidelines automatically.[^34][^35]
* Docs include **status badges** (Alpha, Stable, Deprecated) and **accessibility scorecards** per component.[^36][^15]

An interactive playground lets teams test new themes, densities, and languages instantly.

***

## 8. Security \& Compliance

* CSP-safe: components never inject inline scripts or `onclick` attributes.
* Strict MIME and CORS policies in playground app.
* Dependabot configured; pnpm audit runs in CI.

***

## 9. Phased Roll-Out Plan

| Phase | Duration | Milestones |
| :-- | :-- | :-- |
| **0 – Scaffold** | Week 1 | Repo init, pnpm workspaces, CI skeleton |
| **1 – Foundation** | Weeks 2-3 | `tokens`, `icons`, first primitives (Button, TextField, Modal) |
| **2 – Read-Only** | Weeks 4-5 | `StatusCard`, `ContentRenderer`, `TimelineVirtualized`; Greater consumes for home timeline behind flag |
| **3 – Interactions** | Weeks 6-7 | ActionBar, WebSocket adapters, NotificationsFeed |
| **4 – Composer \& Profiles** | Weeks 8-9 | `ComposeBox`, media picker, ProfileHeader |
| **5 – Settings \& Docs** | Weeks 10-11 | Settings panels, full zeroheight docs, a11y audits |
| **6 – v1.0 GA** | Week 12 | Freeze API, tag `1.0.0`, publish announcement blog |


***

## 10. Illustrative UI Targets

Below are reference screenshots of Mastodon’s canonical UI patterns that the library will replicate and enhance.

![Mastodon compose box UI showing the post input area with a 500 character limit, user profile, and navigation elements in a dark-themed interface.](https://pplx-res.cloudinary.com/image/upload/v1754834837/pplx_project_search_images/b74b4557f03fe99c9949d8dc8e1a5cb42021f9e1.png)

Mastodon compose box UI showing the post input area with a 500 character limit, user profile, and navigation elements in a dark-themed interface.

The status-card anatomy (avatar, handle, content, action bar) informs the `StatusCard` component props and slot map.

![Mastodon user interface showing compose interactions and timelines in Home, Notifications, Local timeline, and Admin columns.](https://pplx-res.cloudinary.com/image/upload/v1754834837/pplx_project_search_images/bf6722ec2a4d1569b721cb932322059173667a7f.png)

Mastodon user interface showing compose interactions and timelines in Home, Notifications, Local timeline, and Admin columns.

Timeline virtualisation and column layout guide the design of `TimelineVirtualized`, `SideNav`, and `GapLoader` components.

***

## Conclusion

By adhering to the architecture, quality gates, and rollout plan detailed above, **greater-components** will deliver:

* A **future-proof Svelte 5 design system** that can evolve without rewrites.
* **Real-time, WebSocket-native data flows** resilient to network volatility.
* **Robust accessibility** baked into every primitive and domain component.
* **Automated, semver-accurate releases** that minimise maintenance overhead.

The result is an open, AGPL-protected library that accelerates feature work in Greater while laying the groundwork for any Fediverse client you—or the community—may build next.

<div style="text-align: center">⁂</div>

[^1]: https://svelte.dev/docs/svelte/v5-migration-guide

[^2]: https://svelte.dev/blog/runes

[^3]: https://dev.to/hexshift/robust-websocket-reconnection-strategies-in-javascript-with-exponential-backoff-40n1

[^4]: https://www.videosdk.live/developer-hub/websocket/websocket-onerror

[^5]: https://www.contentful.com/blog/design-token-system/

[^6]: https://cloudscape.design/foundation/visual-foundation/design-tokens/

[^7]: https://jamesiv.es/blog/frontend/testing/2024/03/11/visual-testing-storybook-with-playwright

[^8]: https://storybook.js.org/blog/storybook-9/

[^9]: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon

[^10]: https://github.com/changesets/changesets

[^11]: https://pnpm.io/9.x/using-changesets

[^12]: https://pnpm.io/workspaces

[^13]: https://jsdev.space/complete-monorepo-guide/

[^14]: https://dubbot.com/dubblog/2024/essential-principles-of-accessible-design-systems.html

[^15]: https://design.va.gov/accessibility/accessibility-testing-for-design-system-components

[^16]: https://storybook.js.org/docs/writing-tests/interaction-testing

[^17]: https://m3.material.io/foundations/design-tokens/overview

[^18]: https://docs.joinmastodon.org/methods/streaming/

[^19]: https://www.a11yproject.com/posts/a-guide-to-troublesome-ui-components/

[^20]: https://apidog.com/blog/websocket-reconnect/

[^21]: https://mainmatter.com/blog/2025/03/11/global-state-in-svelte-5/

[^22]: https://mastodonpy.readthedocs.io/en/stable/10_streaming.html

[^23]: https://docs.joinmastodon.org/admin/scaling/

[^24]: https://whichdev.com/how-to-implement-an-exponential-random-backoff-algorithm-in-javascript/

[^25]: https://javascript.plainenglish.io/real-time-js-dashboards-that-dont-fall-apart-when-the-network-does-da78eda26bb0

[^26]: https://storybook.js.org/blog/component-testing/

[^27]: https://www.youtube.com/watch?v=ipX9VIj9QEs

[^28]: https://github.com/storybookjs/storybook/issues/32016

[^29]: https://infinum.com/handbook/frontend/changesets

[^30]: https://stackoverflow.com/questions/78689794/permissions-for-automatic-changesets-with-github-action

[^31]: https://github.com/changesets/action

[^32]: https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases

[^33]: https://github.com/seek-oss/changesets-snapshot

[^34]: https://www.smashingmagazine.com/2025/08/automating-design-systems-tips-resources/

[^35]: https://zeroheight.com/blog/which-documentation-tool-for-your-design-system/

[^36]: https://www.supernova.io/blog/accessibility-in-design-systems-a-comprehensive-approach-through-documentation-and-assets

[^37]: https://github.com/spinda/mastodon-documentation/blob/master/Using-the-API/Streaming-API.md

[^38]: https://docs.joinmastodon.org/client/intro/

[^39]: https://mastodonpy.readthedocs.io/en/1.8.0/_modules/mastodon/streaming_endpoints.html

[^40]: https://sveltekit.io/blog/runes

[^41]: https://jrashford.com/2023/08/17/how-to-stream-mastodon-posts-using-python/

[^42]: https://www.rubydoc.info/gems/mastodon-api/Mastodon/Streaming/Client

[^43]: https://www.telerik.com/blogs/design-tokens-fundamental-building-blocks-design-systems

[^44]: https://docs.joinmastodon.org/methods/instance/

[^45]: https://www.reddit.com/r/Mastodon/comments/1jthigr/mastodon_and_monitoring_what_the_current_state_of/

[^46]: https://dev.to/developerbishwas/svelte-5-persistent-state-strictly-runes-supported-3lgm

[^47]: https://spectrum.adobe.com/page/design-tokens/

[^48]: https://www.youtube.com/watch?v=61MUT9cS9AA

[^49]: https://dev.to/lico/react-monorepo-setup-tutorial-with-pnpm-and-vite-react-project-ui-utils-5705

[^50]: https://nx.dev/blog/setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx

[^51]: https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn

[^52]: https://stackoverflow.com/questions/75117561/pnpm-monorepo-how-to-set-up-a-simple-reusable-vue-component-for-reuse

[^53]: https://dev.to/jdgamble555/using-sharable-runes-with-typescript-in-svelte5-5hcp

[^54]: https://www.youtube.com/watch?v=HM03XGVlRXI

[^55]: https://www.reddit.com/r/sveltejs/comments/1fi1lmx/isnt_the_lack_of_proper_typings_of_runes_in/

[^56]: https://www.digitala11y.com/accessible-ui-component-libraries-roundup/

[^57]: https://www.designsystemscollective.com/preparing-a-design-system-for-accessibility-af9e51015d9c

[^58]: https://www.loopwerk.io/articles/2025/svelte-5-runes/

[^59]: https://github.blog/engineering/user-experience/design-system-annotations-part-1-how-accessibility-gets-left-out-of-components/

[^60]: https://github.com/ronilaukkarinen/mastodon-bird-ui

[^61]: https://www.reddit.com/r/rust/comments/14ayb7e/ebou_released_a_mostly_full_featured_cross/

[^62]: https://mastodon.social/@developit/110011613399266926

[^63]: https://github.com/mastodon/mastodon/issues/19571

[^64]: https://martinfowler.com/articles/modularizing-react-apps.html

[^65]: https://www.geeksforgeeks.org/system-design/federated-architecture-system-design/

[^66]: https://www.inexture.com/modern-react-design-patterns-ui-architecture-examples/

[^67]: https://www.spicyweb.dev/action-web-components/

[^68]: https://substack.com/home/post/p-152543447

[^69]: https://www.builder.io/blog/react-component-library

[^70]: https://allthingsopen.org/articles/mastodon-experience-top-open-source-clients

[^71]: https://pmc.ncbi.nlm.nih.gov/articles/PMC11207701/

[^72]: https://dev.to/sovannaro/7-hottest-ui-component-libraries-of-2025-2ce

[^73]: https://blog.bytebytego.com/p/bluesky-the-decentralized-social

[^74]: https://blog.bitsrc.io/top-9-react-component-libraries-for-2025-a11139b3ed2e

[^75]: https://madewithvuejs.com/elk

[^76]: https://atlan.com/federated-architecture/

[^77]: https://www.supernova.io/blog/top-10-pre-built-react-frontend-ui-libraries-for-2025

[^78]: https://alexmuraro.me/posts/2023-07-19-mastodon-web-clients/

[^79]: https://playwright.dev/docs/test-components

[^80]: https://www.reddit.com/r/reactjs/comments/1f49p67/component_testing_in_storybook/

[^81]: https://www.defined.net/blog/modern-frontend-testing/

[^82]: https://www.uxpin.com/studio/blog/7-best-practices-for-design-system-documentation/

[^83]: https://github.com/changesets/changesets/discussions/1015

[^84]: https://dev.to/ignace/automate-npm-releases-on-github-using-changesets-25b8

[^85]: https://github.com/storybookjs/playwright-ct

[^86]: https://www.reddit.com/r/UI_Design/comments/1ii44xo/ai_tools_for_automating_design_system/

[^87]: https://antler.digital/blog/best-practices-for-component-versioning-in-react

[^88]: https://www.youtube.com/watch?v=n3LJP9S7xxs

[^89]: https://zeroheight.com

[^90]: https://blog.andri.co/006-versioning-and-publishing-getting-your-UI-library-into-your-users-hands/

[^91]: https://learn.thedesignsystem.guide/p/automation-in-design-systems

[^92]: https://github.com/storybookjs/storybook/discussions/24835

[^93]: https://www.thecandidstartup.org/2025/01/13/bootstrapping-storybook.html

[^94]: https://sordyl.dev/blog/storybook-testing-overview/

[^95]: https://pnpm.io/next/using-changesets

[^96]: https://www.thecandidstartup.org/2025/01/06/component-test-playwright-vitest.html

[^97]: https://blog.alec.coffee/monorepo-version-management-with-the-changesets-npm-package

[^98]: https://storybook.js.org/docs/writing-tests

[^99]: https://blog.logrocket.com/version-management-changesets/

[^100]: https://stackoverflow.com/questions/22431751/websocket-how-to-automatically-reconnect-after-it-dies

[^101]: https://www.videosdk.live/developer-hub/websocket/js-websocket

[^102]: https://maybe.works/blogs/react-websocket

