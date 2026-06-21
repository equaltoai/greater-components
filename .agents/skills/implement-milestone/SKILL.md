---
name: implement-milestone
description: Use to execute a single greater milestone: branch from origin/main unless directed otherwise, implement bounded commits, push a feature branch, and open a PR to staging. Main promotion and release are operator-owned follow-ons.
---

# Implement a milestone

This skill moves greater work through feature → `staging` integration. `staging` is the CI gate. `main` promotion is separate, operator-owned, and accepts PRs only from `staging`.

## Preconditions

- A specific milestone or issue is named.
- TheoryMCP tools are healthy; call `memory_recent` before editing.
- The repo is clean and refs are fresh.
- Work is in mission and does not broaden scope.
- Specialist walks are complete where relevant: component API/theming, contract sync, accessibility, release, framework feedback, advisor brief review.
- No component public API, adapter contract, registry, or theming change proceeds without the owning discipline.

## Branch and PR setup

- Branch from `origin/main` unless the operator explicitly directs another base.
- Open one PR to `staging` per milestone.
- Use clear Conventional Commit-style commit subjects with DCO signoff.
- If an exact non-routed branch name is required and routed GitHub tools cannot create/open it, use local git/`gh` fallback only after stating the routed-tool gap.
- The PR body must include `Refs #<issue>` (not a closing keyword) when tracking work should remain open through staging merge.

## Per-task loop

1. Read the issue and acceptance criteria.
2. Refresh scoped memory.
3. Make only the enumerated changes.
4. For bugs, add or preserve regression coverage.
5. For adapter changes, sync pinned snapshots in the same change.
6. For CLI/registry changes, regenerate rather than hand-edit registry JSON.
7. Run relevant local validation.
8. Commit with `git commit -s`.
9. Push without force.
10. Update PR/issue evidence.

## Validation

For ordinary source work, run the relevant subset locally and rely on staging CI for the full verify set:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm validate:package`
- `pnpm validate:registry --strict`
- `pnpm audit:lockfile-integrity`
- `pnpm audit:tarball-integrity`
- `node scripts/check-dco.js --base origin/main --head HEAD` (or the PR base SHA)

Feature→staging PRs must show the existing verify set green: `Build and Test` and `ESLint and Prettier Check`, plus DCO/branch rules.

## Mission rules

- No silent component API breaks.
- No adapter changes without synced pinned contracts.
- No WCAG 2.1 AA regressions.
- No hand-edited registry checksums.
- No token renames/semantic shifts without major-version coordination.
- No release-please, changesets, `premain`, or automatic publish-on-merge flow.
- No merging or publishing by the steward.

## Handoff

After PR readiness, report branch, commits, PR URL, validation evidence, registry/contract/a11y impact, risks, and follow-ups. A reviewer/factory grant merges to `staging`; the operator promotes `staging → main` and cuts releases manually.
