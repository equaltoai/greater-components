---
'greater-components': minor
---

Extend workspace `check:svelte` to enumerate all 20 Svelte-containing packages (was 5: `primitives`, `shell`, `host-platform`, `shared/soul`, `shared/chat`). Add 3 missing `tsconfig.check.json` files (`packages/content`, `packages/icons`, `packages/utils`).

Add two CI audit scripts that derive the canonical package list from `packages/*/package.json` filesystem discovery and fail the build when any of the four single-source-of-truth enumeration sites drifts:

- `scripts/audit-svelte-check-parity.mjs` — every Svelte-containing package must have `tsconfig.check.json` AND be enumerated in `check:svelte`.
- `scripts/audit-cli-package-enumeration-parity.mjs` — every top-level package must appear in `transform.ts:CORE_PACKAGES`, `dependency-resolver.ts:CORE_PACKAGE_NAMES`, and `fetch.ts:CORE_PACKAGE_NAMES`.

Both wired into `.github/workflows/lint.yml` and chained into `pnpm validate:check-parity` (which itself chains into `pnpm validate:package`). The audits close the structural gap that allowed issue #674 (CLI install routing) to ship in greater-v0.9.1-rc.0 and issue #679 (CommandPalette type collision) to ship in greater-v0.9.1-rc.1. Documented in CONTRIBUTING.md and AGENTS.md.

Part of Project 41 (#680) — workspace svelte-check parity restoration; PR-E (Wave 4) closeout.
