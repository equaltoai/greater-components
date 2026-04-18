---
name: create-github-project
description: Use after plan-roadmap is approved, if the roadmap warrants a tracked GitHub Project at the equaltoai org level. Translates a roadmap document into a Projects v2 kanban board with issues across the affected repos. Follows equaltoai's established project pattern.
---

# Create a GitHub Project

equaltoai tracks initiative-level work in **GitHub Projects v2** at the org level, cross-repo by default. greater's roadmaps often span multiple repos: greater for component / adapter / release work; lesser / host for contract-source changes that require sync; sim / host web for consumer-migration efforts on breaking changes.

This skill turns an approved roadmap into a project board.

## Check what tools you have

- **`gh` CLI**: `gh project create`, `gh project field-list`, `gh project item-add`, `gh issue create`, `gh issue edit --add-project`.
- If not available, produce a well-shaped markdown draft.

Surface which mode you're in at the start.

## When this skill runs

Invoke when:

- Roadmap is large enough for tracked kanban (new face suite, major-version component API evolution, coordinated contract-sync initiative)
- Roadmap is an initiative rather than a single bug fix
- Aron has asked for a project created

Skip when:

- Roadmap is small enough for issues on the greater repo alone without formal tracking
- Kanban discipline adds no value

## The equaltoai project shape (reference)

Per Project 20 pattern:

- **Title**: `<Initiative> — <qualifier>`
- **Short description**: one-sentence scope
- **README**: **Goal / Repos involved / Non-goals / Success means / Working method**. Includes: "Treat this as a kanban."
- **Status**: Todo / In Progress / Done
- **Fields**: Title, Assignees, Status, Labels, Linked pull requests, Milestone, Repository, Reviewers, Parent issue, Sub-issues progress
- **Items**: GitHub Issues in one or more in-scope repos
- **Milestones**: separate from Status
- **Parent / sub-issue hierarchy**

## The create walk

### Step 1: Draft README

```markdown
## <Initiative title>

<Brief paragraph on what this initiative delivers.>

### Goal

<Specific outcome. What "done" looks like.>

### Repos involved

- **greater-components**: <component / adapter / release work>
- **lesser**: <if lesser-contract source changes needed>
- **lesser-host**: <if host-contract source changes needed>
- **simulacrum**: <if sim-side migration needed for breaking changes>
- **lesser-host** (web): <if host-web-side updates needed for consumption>

### Non-goals

- <explicit out-of-scope items>

### Success means

- <observable conditions>
- <changeset + semver declared correctly>
- <consumer CI (sim, host) builds against new version>
- <accessibility tests pass>
- <registry regen in sync>

### Working method

Treat this as a kanban. Move issues through explicit status as evidence is gathered and blockers become concrete.
```

### Step 2: Create the project

```bash
gh project create --owner equaltoai --title "<initiative title>"
```

Capture `<N>`.

### Step 3: Populate README

```bash
gh project edit <N> --owner equaltoai \
  --readme "$(cat readme-draft.md)" \
  --description "<short-description>"
```

### Step 4: Confirm fields

```bash
gh project field-list <N> --owner equaltoai --format json
```

### Step 5: Create issues and link

For each enumerated change:

```bash
gh issue create \
  --repo equaltoai/<repo> \
  --title "<title>" \
  --body "$(cat issue-body.md)" \
  --label "<labels>" \
  --milestone "<milestone>"
```

Issue body template:

```markdown
**Source**: Roadmap <roadmap name>, Phase <phase>
**Enumerated item**: #<N>

## Paths
<...>

## Surface
<primitives / headless / tokens / icons / adapters / cli / faces / shared / utils / testing / docs / apps / registry / scripts / workflows / deps>

## Classification
<component-addition / api-evolution / adapter-change / accessibility / theming / cli-registry / release-automation / docs / bug-fix>

## Specialist walks referenced
- Component API / theming: <...>
- Contract sync: <...>
- Accessibility: <...>
- Release flow: <...>
- Framework: <idiomatic / reported upstream>

## Semver impact
<major / minor / patch>

## Acceptance criterion
<one sentence>

## Validation commands
<pnpm lint / typecheck / test / build / test:e2e, registry regen, changeset validate>

## Release flow checkpoints
- [ ] Merged to staging
- [ ] Staging soak complete
- [ ] Promoted to premain
- [ ] RC tag cut
- [ ] Premain soak complete (internal consumer testing)
- [ ] Promoted to main
- [ ] Stable tag cut + CLI tarball + registry regen
- [ ] Backmerge main → premain → staging
- [ ] Post-release monitoring

## Planned commit subject
<type(scope): subject>

## Changeset
<.changeset/<slug>.md content — impact + description>

## Parent issue
<link if sub-issue>
```

Link into project:

```bash
gh project item-add <N> --owner equaltoai --url <issue-url>
```

### Step 6: Set fields

Status: `Todo`; Milestone: roadmap phase; Labels: scope; Parent issue: for sub-tasks.

### Step 7: Parent / sub-issue hierarchy

Example for a new face suite:

- Parent: `equaltoai/greater-components#XXX — "Add 'agent' face suite for Lesser agent UX"`
- Sub-issues:
  - `equaltoai/greater-components#YYY — agent-persona-card component`
  - `equaltoai/greater-components#ZZZ — agent-workflow-ui component`
  - `equaltoai/greater-components#AAA — agent-face adapter additions`
  - `equaltoai/greater-components#BBB — agent-face playground demos`
  - `equaltoai/greater-components#CCC — agent-face docs pages`
  - `equaltoai/lesser-host#DDD — soul-conversation schema additions (if needed)`
  - `equaltoai/simulacrum#EEE — consume agent face (consumer migration)`

## Labels

Apply consistently:

- `greater-component-api` — component API stability / evolution
- `greater-theming` — tokens / CSS custom properties
- `greater-adapter` — adapter code changes
- `greater-contract-sync` — pinned-snapshot sync
- `greater-accessibility` — a11y work
- `greater-cli` — CLI improvements
- `greater-registry` — registry format / generation
- `greater-release-automation` — release-please, changesets, tag / artifact publishing
- `greater-face-social` / `greater-face-artist` / `greater-face-blog` / `greater-face-community` / `greater-face-agent` — face suite scopes
- `greater-primitive` / `greater-headless` — package scopes
- `greater-playground` / `greater-docs-site` — app scopes
- `greater-deps` — dependency bumps
- `greater-agpl` — license discipline
- `greater-framework-feedback` — FaceTheory / upstream signal
- `breaking` — requires major-version changeset + consumer coordination
- `advisor-brief` — originated from advisor dispatch
- Specialist gates: `needs-component-api-walk`, `needs-contract-sync-walk`, `needs-a11y-walk`, `needs-release-walk`

## Priority and sequencing

Status drives kanban. Milestone groups into roadmap phases. Priority via label + project order.

## The markdown-draft fallback

If `gh` CLI unavailable:

```markdown
# GitHub Project draft: <initiative title>

## Project README
<README draft>

## Default fields
Status: Todo / In Progress / Done
Milestones: <phase names>
Labels: <list>

## Issues

### In equaltoai/greater-components
1. **<issue title>** — [`<labels>`]
   ...

### In equaltoai/lesser (if cross-repo)
1. ...

### In equaltoai/simulacrum (if consumer migration needed)
1. ...
```

## Persist

Append project URL + scope. Five meaningful entries beat fifty log-shaped ones.

## Handoff

- Project + issues exist → `implement-milestone` with first item.
- User wants to revise → `plan-roadmap`.
- Cross-repo coordination surfaces → sibling stewards looped in.
- Too small for a project → skip; roadmap drives `implement-milestone` directly.
