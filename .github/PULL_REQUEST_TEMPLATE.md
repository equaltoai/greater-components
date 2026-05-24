<!--
Thanks for contributing to greater-components!

Before opening this PR, please make sure every applicable box below is
checked. The parity checklist is enforced by the Greater steward — PRs
that ship a new component or surface MUST land docs, tests, playground
example, and registry update in the same PR train (see Project 39
G4.1 / #661).
-->

## Summary

<!-- 1–3 sentences: what does this PR do and why? -->

## Classification

<!-- Pick one: component-addition / api-evolution / adapter-change /
     accessibility / theming / cli-registry / release-automation /
     docs / dependency-maintenance / bug-fix / release-coordination -->

## Component-milestone parity checklist

> Required for every PR that adds a new component, prop, public type, or
> export subpath. If your change does NOT touch a component surface,
> mark each row N/A and add a one-line reason in **Notes**.

- [ ] **Source** — Svelte component(s) + CSS + types added under
      `packages/<package>/src/`.
- [ ] **Types** — public type contracts exported via `types.ts` /
      package `./types` subpath.
- [ ] **Tests** — unit + a11y tests in `packages/<package>/tests/`
      covering: landmarks / accessible names, keyboard contract,
      status / state semantics, strict-CSP (no inline `style`),
      unique-id-across-instances.
- [ ] **Docs** — `docs/component-inventory.md` and
      `docs/api-reference.md` updated with the new component(s) and
      prop unions.
- [ ] **Playground** — demo route under
      `apps/playground/src/routes/<feature>/+page.svelte` exercising
      every state / variant.
- [ ] **CLI registry** — `packages/cli/src/registry/index.ts` entry
      added or updated.
- [ ] **Generated registry** — `pnpm generate-registry` run and
      `registry/index.json` committed. **No hand-edits.**
- [ ] **Greater-components barrel** — root barrel
      (`packages/greater-components/package.json` + `scripts/build.js`)
      updated to expose the new package / subpath.
- [ ] **Docs workflow** — `.github/workflows/docs.yml` updated to
      build the new package before the playground / docs apps (if a new
      workspace package is introduced).

## Stewardship guarantees

- [ ] **Strict-CSP safe** — no inline event handlers, no `style` attrs
      set at runtime, no module-level browser globals.
- [ ] **SSR-safe** — components render correctly in SvelteKit SSR.
- [ ] **WCAG 2.1 AA** — every interactive element is keyboard reachable
      with visible focus, status is never color-only, ARIA roles match
      their contract (e.g. `role="meter"` has accessible name + valid
      range, `role="log"` only used when announcements are intended).
- [ ] **Theming preserved** — existing `--gr-*` tokens unchanged; only
      additive `--gr-*` / `--gr-<pkg>-*` tokens introduced.
- [ ] **No npm publication** — greater-components is shadcn-style CLI
      distribution only; this PR does not introduce npm publish steps.
- [ ] **No AGPL-incompatible dependencies** — any new dependency is
      license-vetted.

## Changeset

> Changesets are **optional** — see
> [CONTRIBUTING.md § Changesets](../CONTRIBUTING.md#changesets) for the
> exact policy enforced by the `Changeset (Optional)` workflow.

- [ ] `.changeset/<slug>.md` added with **minor** impact for additive
      component / API work, or **patch** for bug fixes, or **major**
      for breaking changes (which require stewardship approval), OR
      this PR is docs-only / test-only / CI / release-coordination and
      explicitly does not need a changeset (note the reason below).

## Semver impact

<!-- major / minor / patch / none — must match the changeset front-matter -->

## Consumer impact

- **sim:** <preserved / breaking / explicit drop>
- **lesser-host web:** <preserved / breaking / explicit drop>
- **lesser UIs:** <preserved / breaking / explicit drop>
- **external Mastodon-compat:** <preserved / breaking / explicit drop>

## Validation

- [ ] `pnpm install` (frozen lockfile)
- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm test:a11y` (where applicable)
- [ ] `pnpm validate:registry`, `validate:cli`, `validate:exports`,
      `validate:dist`, `validate:deps`, `validate:tokens`, `validate:ids`,
      `validate:csp`, `validate:versions`, `check:openapi-auth`
- [ ] `node scripts/check-dco.js --base origin/staging --head HEAD`
- [ ] `node scripts/rehearse-release-promotion.js --candidate HEAD`
      (preserve-topology + `--simulate-squash` both PASS, or merge type
      noted in PR description)

## Cross-repo coordination

<!-- Required / none. If required, name the counterpart steward
     (lesser, host, sim) and what they need to do. -->

## Release-flow plan (handoff after merge to staging)

- [ ] Merged to staging
- [ ] Staging soak complete
- [ ] Promoted to premain via `release-components` (RC tag cut)
- [ ] RC soak (incl. internal consumer validation: sim, host)
- [ ] Promoted to main via `release-components` (stable tag + CLI
      tarball + registry + GitHub Release)
- [ ] Backmerge main → premain → staging

## Notes

<!-- Optional context: open questions, design alternatives considered,
     N/A justifications for any parity-checklist boxes. -->
