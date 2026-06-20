# Branch-protection / ruleset operator spec

This milestone does **not** apply branch protection. The operator applies these settings after reviewing the PR and replacing `<operator-team-slug>` in `main.json` with the EqualToAI operator team that is allowed to administer `main`.

## Required-check de-list before deleting retired workflows

Remove these retired workflow/status contexts from any server-side branch protection or ruleset required-status-check lists before/while landing this migration. Leaving one behind makes future PRs hang forever on a phantom “Expected” check.

- `Require a changeset file`
- `Changeset (Optional) / Require a changeset file`
- `changeset-required`
- `Rehearse staging promotion path`
- `Release Promotion Rehearsal / Rehearse staging promotion path`
- `promotion-rehearsal`
- `Enforce release-candidate-only premain`
- `Premain Branch Guard / Enforce release-candidate-only premain`
- `premain-guard`
- `release-please`
- `Release (main) / release-please`
- `Release PR (main) / release-please`
- `Prerelease (premain) / release-please`
- `Prerelease PR (premain) / release-please`

Do **not** remove surviving required contexts:

- `Build and Test`
- `ESLint and Prettier Check`
- `DCO Check`
- `Enforce promotion-only main`

## Apply classic branch protection

```bash
# staging: full verify set + DCO, strict/up-to-date required
jq . .github/branch-protection/staging.json \
  | gh api --method PUT repos/equaltoai/greater-components/branches/staging/protection --input -

# main: operator-owned, PR-only, staging-head guarded by main-guard; no duplicate staging verify rerun
OPERATOR_TEAM_SLUG='<operator-team-slug>'
jq --arg team "${OPERATOR_TEAM_SLUG}" '.restrictions.teams = [$team]' \
  .github/branch-protection/main.json \
  | gh api --method PUT repos/equaltoai/greater-components/branches/main/protection --input -
```

If existing protection uses the required-status-check subresource instead of full replacement, de-list/apply the contexts directly:

```bash
# staging required contexts after this migration
gh api --method PATCH \
  repos/equaltoai/greater-components/branches/staging/protection/required_status_checks \
  -F strict=true \
  -f 'contexts[]=Build and Test' \
  -f 'contexts[]=ESLint and Prettier Check' \
  -f 'contexts[]=DCO Check'

# main required contexts after this migration; intentionally no Build and Test / ESLint and Prettier Check
gh api --method PATCH \
  repos/equaltoai/greater-components/branches/main/protection/required_status_checks \
  -F strict=false \
  -f 'contexts[]=Enforce promotion-only main' \
  -f 'contexts[]=DCO Check'
```

## Notes

- `main-guard.yml` is the machine-enforced `main` source restriction: it fails unless the PR head ref is exactly `staging`.
- `docs.yml` still deploys the documentation site on `push: main`; this is a known surviving non-release automation.
- Do not add `branches: [main]` to `test.yml` or `lint.yml`.
