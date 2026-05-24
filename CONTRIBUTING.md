# Contributing to Greater Components

Thank you for your interest in contributing to Greater Components! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct, which promotes a welcoming and inclusive environment for all contributors.

## Developer Certificate of Origin (DCO)

This project uses the Developer Certificate of Origin (DCO) to ensure that all contributions are properly licensed. The DCO is a lightweight mechanism for contributors to certify that they have the right to submit their contributions under the project's license.

### What is the DCO?

The DCO is a statement that you, as a contributor, have the legal right to make the contribution and agree to license it under the project's open source license (AGPL-3.0-only).

### How to Sign Your Commits

All commits must be signed off using the `-s` or `--signoff` flag:

```bash
git commit -s -m "feat: add new component"
```

This adds a `Signed-off-by` line to your commit message:

```
feat: add new component

Signed-off-by: Your Name <your.email@example.com>
```

### DCO Text

By making a contribution to this project, I certify that:

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

## Getting Started

### Prerequisites

- Node.js v24 or higher (check `.nvmrc`)
- pnpm v9 or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/greater-components.git
   cd greater-components
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Install Playwright browsers (only needed for Playwright-based tests like `pnpm test:e2e` / `pnpm test:a11y`):
   ```bash
   pnpm playwright:install
   ```
5. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm lint` to check for linting issues
- Run `pnpm format` to format code
- TypeScript strict mode is enabled - ensure no type errors

### Testing

- Write tests for all new features
- Run `pnpm test` to run all tests
- Run `pnpm test:unit` for unit tests
- Run `pnpm test:e2e` for end-to-end tests
- If Playwright tests fail due to missing browsers, run `pnpm playwright:install`
- Maintain the repo coverage thresholds (see `pnpm test:coverage:report`)

### Commit Messages

We follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

Examples:

```bash
git commit -s -m "feat: add Button component with variants"
git commit -s -m "fix: correct focus trap in Modal component"
git commit -s -m "docs: update README with installation instructions"
```

### Pull Request Process

1. Open the PR — `.github/PULL_REQUEST_TEMPLATE.md` populates the
   description automatically. The template includes the
   **component-milestone parity checklist**, the
   **stewardship-guarantees checklist**, validation commands, and a
   release-flow handoff plan. Fill out every applicable section.
2. Ensure all CI gates pass (lint, format, typecheck, test, build,
   Playwright a11y matrix, registry / package validations, DCO,
   promotion rehearsal). Coverage threshold is 75%.
3. Update documentation alongside any user-facing change:
   `docs/component-inventory.md`, `docs/api-reference.md`, and a
   playground demo under `apps/playground/src/routes/`.
4. **Optionally** add a changeset when you want this PR's changes to
   appear in the next published release notes (see the
   [Changesets](#changesets) section below for when one is required
   vs. optional):
   ```bash
   pnpm changeset
   ```
   — Pick **minor** for additive component / API work; **patch** for
   bug fixes; **major** is reserved for breaking changes (which require
   `evolve-component-surface` stewardship approval and explicit
   consumer coordination).
5. Regenerate the CLI registry whenever package source changes:
   ```bash
   pnpm generate-registry
   pnpm validate:registry
   ```
   Commit the regenerated `registry/index.json` alongside the source
   change. **Never hand-edit `registry/index.json` or `registry/latest.json`** —
   they're managed by automation and the strict checksum validator
   rejects drift.
6. Link any related issues and wait for code review.

#### Component-milestone parity (Project 39 G4.1 / #661)

Every PR that ships a new component or extends a public surface MUST
include all of the following in the same PR train. The PR template
checklist enforces this; the Greater steward will not approve a PR
missing any item without an explicit `N/A` justification.

- Source (component + CSS + types)
- Tests (unit + a11y + strict-CSP + unique-id-across-instances)
- Documentation (`component-inventory.md`, `api-reference.md`)
- Playground demo (`apps/playground/src/routes/<feature>/`)
- CLI registry entry (`packages/cli/src/registry/index.ts`)
- Generated registry refresh (`registry/index.json` via
  `pnpm generate-registry`)
- Greater-components root-barrel wiring
- Docs workflow update (`.github/workflows/docs.yml`) for new
  workspace packages

### Changesets

This project uses [Changesets](https://github.com/changesets/changesets)
for version management, but **changesets are optional** — the
`Changeset (Optional)` workflow does not require one for docs-only,
test-only, CI-config, or release-coordination PRs (see
`.github/workflows/changeset-required.yml` for the exact policy that
runs in CI, and `AGENTS.md` for the steward's posture).

**Add a changeset when:**

- You change a published package's runtime / build / export surface
  (anything under `packages/*` that affects consumers' installed
  output).
- You bump a dependency that consumers will receive.
- You make any change you want to appear in the release notes.

**Skip the changeset when:**

- The PR only edits `docs/`, `apps/playground/`, `apps/docs/`, tests,
  CI workflows, repo tooling, ADRs, or stewardship docs (CONTRIBUTING,
  AGENTS, CODEOWNERS).
- The PR is a release-coordination commit that the
  `release-components` skill will follow (RC promotion, stable
  promotion, backmerges).
- The PR is purely a registry regeneration with no source change.

When you do add one:

1. Run `pnpm changeset`.
2. Select the packages affected.
3. Choose the version bump type (`major` / `minor` / `patch`). Use
   `minor` for additive component or API work; `major` only for
   breaking changes (which need `evolve-component-surface` stewardship
   approval).
4. Write a summary of your changes — release-please rolls these into
   the consolidated changelog on the next version bump.
5. Commit the generated `.changeset/<slug>.md` file with the rest of
   your changes.

If you're unsure whether your change needs a changeset, ask in the PR
description — the Greater steward will tell you on review.

## Package Development

### Creating a New Package

1. Create a new directory under `packages/`
2. Add a `package.json` with proper configuration
3. Extend `tsconfig.base.json` for TypeScript config
4. Add exports to the package.json
5. Update the root `README.md` if needed

### Component Guidelines

For UI components:

1. Use Svelte 5 runes (`$state`, `$derived`, etc.)
2. Ensure full TypeScript typing
3. Include proper ARIA attributes
4. Write Storybook stories
5. Add comprehensive tests
6. Document props, slots, and events
7. Follow the design token system

## Accessibility

All components must meet WCAG 2.1 AA standards:

- Proper semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast requirements
- Reduced motion support

## Security

- Never commit sensitive data
- Run `pnpm audit` regularly
- Report security vulnerabilities privately to security@equalto.ai
- Follow OWASP guidelines for web security

## Release Process

**greater-components does NOT publish to npm.** It is distributed via the
shadcn-style **Greater CLI**: consumers `npm install -g` a GitHub
Release tarball, then run `greater init` / `greater add <component>` /
`greater update --ref <tag>` to copy component **source** (not bundles)
into their own project. Per-file SHA256 checksums in
`registry/index.json` verify integrity on install.

Releases follow the **three-branch flow**:

1. **`staging`** — entry point. Feature PRs merge here. Branch
   protection requires the full CI gate set to pass before merge.
2. **`premain`** — RC track. The `release-components` skill promotes
   `staging → premain` when an RC is ready. `release-please` opens a
   release PR there using `release-please-config.premain.json`. Merging
   it cuts an **RC tag** (`greater-vX.Y.Z-rc.N`) and publishes the RC
   GitHub Release with the CLI tarball asset attached. Consumers
   (lesser-host, sim) validate by pinning via
   `greater update --ref greater-vX.Y.Z-rc.N`.
3. **`main`** — stable. After RC validation, `release-components`
   promotes `premain → main`. A second `release-please` PR cuts the
   **stable tag** (`greater-vX.Y.Z`) and publishes the stable GitHub
   Release. Once stable ships, automation **backmerges** main →
   premain → staging to keep the branches in sync.

**Discipline:**

- **Published tags are immutable.** A bad release is fixed by a new
  patch (`greater-vX.Y.Z+1`), never by re-pointing the tag.
- **GitHub Release assets are never deleted.** Older releases are
  consumer rollback targets via `greater update --ref <prior-tag>`.
- **Merge type matters.** Branches that already carry `origin/main` /
  `origin/premain` ancestry MUST be merged with **"Create a merge
  commit"** (preserve-topology) — squashing loses ancestry and breaks
  the next promotion rehearsal. Pure staging-based branches can
  squash-merge safely. The `Rehearse staging promotion path` CI job
  detects the right mode automatically; local engineers can verify with
  `node scripts/rehearse-release-promotion.js --candidate HEAD` and
  `--simulate-squash`.
- **No skipped gates.** Compressed soak periods require explicit
  operator authorization documented in a release-coordination issue.

See also: the `release-components` skill (`.claude/skills/release-components/SKILL.md`)
for the full RC / stable promotion playbook.

## Questions?

- Open a [Discussion](https://github.com/equaltoai/greater-components/discussions) for general questions
- File an [Issue](https://github.com/equaltoai/greater-components/issues) for bugs or feature requests
- Join our community chat for real-time help

## License

By contributing to Greater Components, you agree that your contributions will be licensed under the AGPL-3.0-only license.
