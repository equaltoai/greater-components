# Issue Sweep Plan (2026-02-12)

Scope: https://github.com/equaltoai/greater-components/issues (open issues as of 2026-02-12)

This plan targets the currently open issues:
- #180 Admin face install missing `Agents` module
- #187 faces/social: Global BackupCodes CSS constrains host `body`
- #188 headless: strict CSP breaks primitives due to runtime `element.style.*` / `document.body.style.*`
- #189 CSP: textarea autosize uses `textarea.style.height`
- #190 utils: clipboard/export helpers write inline styles
- #191 primitives: preferences/theme utilities write inline styles / inject `<style>`
- #192 tooling: add strict CSP guardrails + `greater doctor --csp`
- #193 docs: document strict CSP mode + supported patterns
- #194 faces/artist: runtime style writes + `<style>` injection
- #195 primitives: exported Svelte transitions rely on inline styles

## Guiding contract (“strict CSP”)

For this sweep we treat **strict CSP** as:
- `style-src` does not include `'unsafe-inline'`
- `style-src-attr 'none'` (or equivalent restriction that blocks all `style=""` attribute application)
- no runtime `<style>` injection without a nonce

Practical implications:
- Avoid runtime `element.style.*`, `style.cssText`, `style.setProperty`, `document.body.style.*`
- Avoid `document.createElement('style')` / `appendChild(<style>)`
- Avoid face/theme CSS that mutates global layout primitives (`body`, `html`, global `h1`, etc.)
- Prefer **class toggles**, **external CSS**, and **WAAPI** (`element.animate`) when dynamic values are unavoidable

## Milestones

### Milestone 1 — Tooling guardrails baseline (Issue #192)

Deliverables
- Extend `pnpm validate:csp` to also flag:
  - runtime style writes in shipped JS/TS (`.style.*`, `style.cssText`, `style.setProperty`, `setAttribute('style', …)`)
  - runtime `<style>` element injection
  - unscoped global selectors in shipped face/theme CSS (`body {}`, `html {}`, top-level `h1 {}`, etc.)

Acceptance criteria
- `pnpm validate:csp` fails with actionable file/line output when introducing any new violation pattern.
- Existing repo passes `pnpm validate:csp` after the remediations in later milestones land.

---

### Milestone 2 — Fix `admin` vendored install missing `Agents` (Issue #180)

Deliverables
- Update the CLI shared-module registry to include `shared/admin/Agents/*` files in the `admin` module file list.
- Add a regression check (test or script) that ensures the vendored file list is closed under `shared/admin/index.ts` exports.

Acceptance criteria
- `greater add admin --ref greater-v0.1.8` (and latest) produces a vendored `shared/admin/Agents/` folder and no missing-module TS errors.

---

### Milestone 3 — Remove global `body`/`h1` rules from social face theme (Issue #187)

Deliverables
- Remove or scope the global `body { … }` and `h1 { … }` rules in `packages/faces/social/src/theme.css`.
- Ensure BackupCodes styling remains correct via component-scoped selectors (e.g. `.backup-codes …`) and/or print-safe patterns.

Acceptance criteria
- Importing `faces/social` CSS does not change `getComputedStyle(document.body).maxWidth` / `padding` / `fontFamily`.
- No new global element selectors in social face theme CSS (enforced by Milestone 1 guardrails).

---

### Milestone 4 — CSP-safe textarea autosize (Issue #189)

Deliverables
- Introduce a shared autosize primitive/helper that does not write `textarea.style.*` (CSS-driven sizing).
- Migrate:
  - `packages/shared/compose` (`Editor.svelte`, `EditorWithAutocomplete.svelte`)
  - `packages/shared/chat` (`ChatInput.svelte`)
  - `packages/faces/social` (`ComposeBox.svelte`)

Acceptance criteria
- No runtime writes to `textarea.style.height` / `textarea.style.overflowY` for autosizing.
- Behavior parity: textarea grows/shrinks with content and respects max-height/scroll behavior.
- Works under `style-src-attr 'none'`.

---

### Milestone 5 — CSP-safe utils: clipboard + export (Issue #190)

Deliverables
- Replace inline style writes in:
  - `packages/utils/src/clipboard.ts` (fallback path)
  - `packages/utils/src/export-markdown.ts` (download helper)
- Introduce/standardize a shipped CSS utility (e.g. `.gr-offscreen-input`) and use class toggles / `hidden` attribute.

Acceptance criteria
- No `.style.*` writes in these utils.
- Copy/download helpers continue to work in supported browsers.

---

### Milestone 6 — CSP-safe primitives: preferences/theme + modal + theme transitions (Issue #191)

Deliverables
- Preferences/theme application avoids `document.documentElement.style.setProperty`.
- `smoothThemeTransition` avoids runtime `<style>` injection and avoids mutating `target.style.transition`.
- `Modal` scroll lock avoids `document.body.style.*` (prefer `body` class toggles + shipped CSS).

Acceptance criteria
- No runtime inline-style writes or `<style>` injection in these primitives.
- Works under strict CSP (`style-src-attr 'none'`, no `unsafe-inline`).

---

### Milestone 7 — CSP-safe headless primitives (Issue #188)

Deliverables
- Provide a shared CSP-safe dynamic styling helper for unavoidable dynamic values (positioning):
  - prefer WAAPI to apply final `transform` (or `left/top` where necessary) without `style=` writes
- Migrate headless runtime paths away from `element.style.*` / `document.body.style.*`:
  - popover positioning
  - tooltip positioning
  - live-region “visually hidden” styles (prefer class + shipped CSS utility)
  - modal scroll locking
  - skeleton sizing (no `style.setProperty`)

Acceptance criteria
- Headless popover/tooltip/modal/live region/skeleton run under strict CSP without CSP console errors.
- No `.style.*`, `style.cssText`, `style.setProperty`, or `document.body.style.*` in shipped runtime paths.

---

### Milestone 8 — CSP-safe artist face utilities (Issue #194)

Deliverables
- Replace runtime style writes in reduced-motion helper with class-based or WAAPI approaches.
- Replace high-contrast runtime `<style>` injection with class toggles + shipped CSS.
- Replace virtualization positioning (`node.style.top = …`) with CSP-safe positioning (prefer transform via WAAPI).

Acceptance criteria
- No runtime `element.style.*` writes and no injected `<style>` tags in shipped artist face code paths.
- Artist face works under strict CSP without console violations.

---

### Milestone 9 — CSP-safe transitions alternatives (Issue #195)

Deliverables
- Provide CSP-safe animation utilities that do not rely on Svelte `css:` transitions (which write inline styles):
  - WAAPI enter/exit helpers, and/or
  - class-based keyframe helpers backed by shipped CSS
- Document which APIs are CSP-safe vs not recommended under strict CSP.

Acceptance criteria
- In a deployment with `style-src-attr 'none'`, using the recommended transition utilities triggers **no** CSP violations.
- Docs explicitly call out CSP-safe transition APIs.

---

### Milestone 10 — Docs + CLI `greater doctor --csp` (Issues #192, #193)

Deliverables
- Update/add a single doc page describing:
  - strict CSP contract (including `style-src-attr`)
  - supported patterns and recommended utilities (WAAPI helper, autosize, scroll lock, theme transitions)
  - known limitations
- Implement `greater doctor --csp` to scan a vendored install and report:
  - runtime inline-style writes
  - runtime `<style>` injection
  - face/theme global element selectors

Acceptance criteria
- `greater doctor --csp` produces actionable output and exit codes for CI usage.
- Documentation links to the tracking issues for any remaining work.

