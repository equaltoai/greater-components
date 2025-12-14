• You are an AI coding agent working in this repo: `/home/aron/ai-workspace/codebases/penny-advanced-interfaces/greater-components`.

  Goal: iteratively raise test coverage for `packages/faces/artist` by adding 1–3 **scenario-harness** cases (with interactions/actions) targeting the worst-covered files after each coverage run.

  Constraints:
  - Do NOT use network or install deps.
  - Keep changes tightly scoped to `packages/faces/artist/tests/**` (and test harness wrappers/mocks as needed).
  - Prefer reusing existing mocks in `packages/faces/artist/tests/mocks/*` and existing context wrappers in `packages/faces/artist/tests/components/smoke/*Wrapper.svelte`.
  - Only change production `src/**` if absolutely required for testability; if you do, keep it minimal and explain why.
  - Keep formatting consistent with the repo (Prettier: tabs, single quotes).

  Cycle (repeat at least once, up to 3 times if fast and safe):

  1) Run package coverage
  ```bash
  pnpm --filter @equaltoai/greater-components-artist test:coverage

  2. Locate worst files

  - Open packages/faces/artist/coverage/index.html to see the overall picture.
  - Then compute a ranked list of worst files by uncovered lines using lcov.info:

  awk 'BEGIN{FS=":"} /^SF:/{f=$2;lh=0;lf=0} /^LH:/{lh=$2} /^LF:/{lf=$2} /^end_of_record/{if(lf>0){un=lf-lh;pct=100*lh/lf; printf("%5d uncovered  %6.2f%%  %5d/%-5d  %s\n", un, pct, lh, lf, f)} }' packages/faces/
  artist/coverage/lcov.info \
   | sort -nr | head -n 25

  - Prioritize src/components/** first, especially any 0%-covered files and high-uncovered-line files in: Community, CreativeTools, Monetization, Exhibition, Transparency.

  3. Add 1–3 harness scenarios (with actions) for the worst files

  - If an Artist scenario harness already exists, add scenarios there. If it does NOT exist yet, create it modeled after Social:
      - Reference: packages/faces/social/tests/components/coverage-harness.ts, packages/faces/social/tests/components/coverage.test.ts, packages/faces/social/tests/components/Wrapper.svelte.
      - Create analogous files under packages/faces/artist/tests/components/coverage/.
  - For each of the 1–3 selected worst files:
      - Add 1–3 scenarios that provide valid props (avoid placeholder shapes that short-circuit rendering).
      - Add an action() that clicks/types/changes/keydowns to execute conditional branches (tabs, modals, selects, toggles, error paths).
      - Use existing Artist context wrappers where applicable (e.g. ArtistProfileContextWrapper.svelte, CreativeToolsWIPContextWrapper.svelte, CommunityCollaborationContextWrapper.svelte, etc.), or add a small
        one-off harness component if needed (like Social’s EditorTest.svelte pattern).
      - Assert at least one observable outcome per scenario (a role/text appears, handler spy called, state change visible) and assert no console.error during render.

  4. Re-run coverage and report progress

  pnpm --filter @equaltoai/greater-components-artist test:coverage

  - Summarize:
      - faces/artist overall Lines/Functions/Statements/Branches (from packages/faces/artist/coverage/index.html).
      - The 1–3 targeted files’ coverage deltas if possible (at least confirm they’re no longer at/near 0%).
      - List the files you modified and what scenarios/actions you added.

  Stop conditions:

  - Stop after one full loop if time is limited; otherwise repeat until branches ≥60% and lines/statements ≥75% (or you hit diminishing returns).

  Output requirements:

  - Provide a short summary of what you changed, the new coverage numbers, and the next 1–3 files you would target if continuing.