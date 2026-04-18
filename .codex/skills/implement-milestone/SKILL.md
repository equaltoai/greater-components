---
name: implement-milestone
description: Use to execute a single milestone (or GitHub Project phase) of work — feature branch off staging, commits per enumerated task, PR with CI gates + required review, merge to staging. Runs one milestone at a time. Release-flow promotion (staging → premain → main) and release-artifact publishing are handled separately by release-components.
---

# Implement a milestone

This skill moves greater work through code, CI gates, review, and merge to `staging`. greater uses a three-branch flow; `staging` is the entry point. Once merged, `release-components` owns promotion to `premain` (RC) and `main` (stable), plus release-artifact publishing.

## Hard preconditions

Do not start without all of the following:

- **A specific milestone named**, from `plan-roadmap` or a GitHub Project phase
- **Clean working tree on `staging`** at a known-green commit
- **MCP tools healthy.** Call `memory_recent` first.
- **`pnpm install` succeeds** (lockfile-strict)
- **`pnpm lint` passes**
- **`pnpm typecheck` passes**
- **`pnpm test` passes** (Vitest, 75% coverage threshold)
- **`pnpm build` succeeds**
- **Registry regeneration script produces no diff** (for current tree)
- **Contract-sync check passes** (for current tree)
- **Enumerated tasks are in-mission** — not scope growth
- **Specialist walks complete** for component-API / theming / contract-sync / accessibility / release / framework-feedback / advisor-brief work
- **Changesets drafted** for each source-changing task
- **Advisor-dispatched milestones** have Aron's authorization from `review-advisor-brief`

If any precondition fails, stop.

## Branch and PR setup

One feature branch per milestone. One PR per milestone. Commits per task.

- **Branch name**: observed patterns — `chore/<topic>`, `chore/sync-lesser-<v>`, `chore/sync-lesser-host-<v>`, `chore/deps-<...>`, `chore/release-<...>`, `chore/agents`, `chore/backmerge-<source>-into-<target>`, `feat/<topic>`, `fix/<topic>`.
- **Branched from**: `staging` at a known-green commit.
- **PR target**: `staging`.
- **PR title**: clear, Conventional Commits style encouraged.
- **Open PR as draft.**

PR description template:

```markdown
## Milestone
<short-name> — <goal from roadmap / project README>

## Classification
<component-addition / api-evolution / adapter-change / accessibility / theming / cli-registry / release-automation / docs / dependency-maintenance / bug-fix>

## Surfaces affected
<enumerated>

## Specialist walks referenced
- Component API / theming: <...>
- Contract sync: <...>
- Accessibility: <...>
- Release flow: <...>
- Framework: <idiomatic / reported upstream>

## Semver impact
<major / minor / patch — changesets attached>

## Consumer impact
- sim: <...>
- host web: <...>
- lesser UIs: <...>
- external Mastodon-compat: <baseline preserved / explicit drop>

## Tasks
- [ ] <issue 1 title>
- [ ] <issue 2 title>

## Changesets
- `.changeset/<slug1>.md` — <impact + description>
- `.changeset/<slug2>.md` — <impact + description>

## Validation
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` (Vitest, 75% threshold)
- `pnpm build`
- `pnpm playwright:install && pnpm test:e2e` (a11y + e2e)
- Registry regeneration (no diff expected after merge)
- Contract-sync check

## Release-flow plan (handoff after merge to staging)
- [ ] Merged to staging
- [ ] Staging soak complete
- [ ] Promoted to premain (release-components)
- [ ] RC tag cut
- [ ] Premain soak complete
- [ ] Promoted to main (release-components)
- [ ] Stable tag cut + CLI tarball + registry + GitHub Release
- [ ] Backmerge main → premain → staging

## Cross-repo coordination
<required / none>

## Advisor-brief authorization (if applicable)
<summary from review-advisor-brief>
```

## The per-task loop

For each task:

1. **Read the issue.** Confirm acceptance, planned commit subject, required changeset impact.
2. **`memory_recent`** — refresh context.
3. **For bug fixes: add regression test first.** Vitest unit/integration; Playwright a11y where applicable.
4. **Make the change.** Only files in enumerated paths.
5. **Run validation:**
   - `pnpm install` (if lockfile changes expected)
   - `pnpm lint` (ESLint)
   - `pnpm typecheck` (TypeScript strict)
   - `pnpm test` (unit / integration)
   - `pnpm build` (Vite)
   - `pnpm playwright:install && pnpm test:e2e` (a11y / e2e) if the change affects UI components
   - Registry regeneration script (auto — CI also runs)
   - Contract-sync check (auto — CI also runs)
6. **For component additions / API evolution**: verify prop types, slots, events are exported and typed; playground demo added; docs page added / updated.
7. **For adapter changes**: verify pinned snapshot is updated in same commit; `sync-contracts` walk output referenced.
8. **For accessibility work**: add / confirm Playwright a11y tests; verify contrast ratios, keyboard nav, screen-reader semantics, focus management.
9. **For theming token changes**: verify no rename of existing tokens; additions land in `packages/tokens/` and propagate through playground demos.
10. **For CLI / registry work**: verify registry regen produces expected new state; don't hand-edit.
11. **Add changeset file** (`.changeset/<slug>.md`) declaring semver impact + user-facing description. Breaking changes require `major`.
12. **Commit.** Clear subject. Explain *why* in the body for component-API, theming, adapter / contract-sync, accessibility, or registry changes. Never `--no-verify`. Never `--amend` a pushed commit.
13. **Push.** Never force-push.
14. **Check task off** in PR description; update GitHub Project item status.
15. **`memory_append`** only when worth remembering — component-API evolution subtlety, contract-sync edge case, accessibility finding, registry behavior, framework awkwardness, advisor pattern. Five meaningful entries beat fifty log-shaped ones.

## The mission rule enforced at commit time

- **Every commit must be in-mission.** Scope growth → `scope-need`.
- **Every source-changing commit has a changeset.**
- **Breaking changes declared `major` in changeset** — silent breaks are the anti-pattern.
- **Adapter changes without contract-sync snapshot updates are refused.**
- **Accessibility regressions are refused.**
- **Hand-editing `registry/*.json` is refused.**
- **Token renames** require major-version changeset + `evolve-component-surface` walk.
- **Bug-fix commits follow test-first pattern.**
- **Dependency bumps isolated** for bisect.
- **CI workflow changes isolated.**
- **No hardcoded secrets, `.env` files, wallet keys.**
- **No full signed-transaction logging, wallet-key / seed-phrase logging.**
- **No framework patches** to FaceTheory or Svelte in greater's tree.
- **No npm publication** — shadcn-style CLI distribution is the model.
- **No AGPL-incompatible dependencies or proprietary blobs.**
- **No changes to `AGENTS.md`, `CONTRIBUTING.md`, `CODEOWNERS`, branch protection** without explicit governance process.

## If CI goes red mid-milestone

- **Do not** add a "fix CI" commit touching unrelated code.
- **Do** stop, investigate, surface.
- **Do not** weaken a test, a11y check, or CI gate.
- If failure caused by your most recent commit, revert with a new revert commit and re-plan.

## Finishing the milestone (PR side)

When all tasks committed and pushed:

1. Re-verify `pnpm lint / typecheck / test / build / test:e2e` on the tip.
2. Re-verify changeset files present and correctly impact-tagged.
3. Re-verify registry regen produces no diff.
4. Promote PR out of draft.
5. Request required review (CODEOWNERS).
6. **Leave merging to a reviewer** who confirms CI is green.

The PR merges to `staging`. Hand off to `release-components` for promotion to `premain` and `main`.

## Hand off to release-components

Once merged to `staging`:

- `release-components` owns `staging → premain` promotion timing
- release-please premain PR generates RC tag
- RC soak, including internal consumer (sim, host) testing
- `release-components` owns `premain → main` promotion
- release-please stable PR generates stable tag + CLI tarball + registry + GitHub Release
- Post-release monitoring + backmerge

`implement-milestone` does not run release commands. Its output is a merged PR to `staging` + handoff.

## What this skill will not do

- Will not implement more than one milestone per run.
- Will not accept scope growth as a task.
- Will not merge PRs — required review (with CI gates green).
- Will not skip review or gates.
- Will not run release commands — that's `release-components`.
- Will not skip specialist walks for component-API / contract-sync / accessibility / release / framework-feedback / advisor work.
- Will not hand-edit `registry/*.json`.
- Will not ship adapter changes without synced contract snapshots.
- Will not ship breaking changes without major-version changeset.
- Will not ship accessibility regressions.
- Will not ship token renames without major-version discipline.
- Will not force-push, amend pushed commits, rewrite history.
- Will not bump the Node / Svelte major version in ordinary milestone (separate coordinated event).
- Will not add AGPL-incompatible dependencies.
- Will not patch FaceTheory / Svelte / Vite locally.
- Will not act on advisor briefs without `review-advisor-brief` authorization.
