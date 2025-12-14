• You are an AI coding agent working in this repo: `/home/aron/ai-workspace/codebases/penny-advanced-interfaces/greater-components`.

  Target: improve test coverage for `packages/faces/social` (if “faces/soclai” was a typo). Focus on raising the weakest component files by adding 1–3 **scenario-harness** cases (with interactions/actions) per
  iteration.

  Constraints:
  - Do NOT use network or install deps.
  - Keep changes tightly scoped to `packages/faces/social/tests/**` (helpers/fixtures/harness Svelte files allowed).
  - Only change production `packages/faces/social/src/**` if absolutely required for testability; keep it minimal and explain why.
  - Prefer existing fixtures/helpers under `packages/faces/social/tests/helpers/**` and existing mock data (`packages/faces/social/src/mockData.ts`).
  - Keep formatting consistent with repo (Prettier: tabs, single quotes).

  Existing harness you should extend (preferred):
  - `packages/faces/social/tests/components/coverage-harness.ts`
  - `packages/faces/social/tests/components/coverage.test.ts`
  - `packages/faces/social/tests/components/Wrapper.svelte`
  - Pattern for “mini harness components” for complex context/state:
    - `packages/faces/social/tests/components/Filters/EditorTest.svelte`
    - `packages/faces/social/tests/components/Lists/EditorTest.svelte`

  Cycle (repeat 1–3 times):

  1) Run package coverage
  ```bash
  pnpm --filter @equaltoai/greater-components-social test:coverage

  2. Locate the worst files

  - Open packages/faces/social/coverage/index.html to see the summary table and drill into lowest files.
  - Also compute a ranked list of worst files by uncovered lines using lcov.info:

  awk 'BEGIN{FS=":"} /^SF:/{f=$2;lh=0;lf=0} /^LH:/{lh=$2} /^LF:/{lf=$2} /^end_of_record/{if(lf>0){un=lf-lh;pct=100*lh/lf; printf("%5d uncovered  %6.2f%%  %5d/%-5d  %s\n", un, pct, lh, lf, f)} }' packages/faces/
  social/coverage/lcov.info \
   | sort -nr | head -n 25

  - Prioritize src/components/** files with the highest uncovered lines and/or low branch coverage. If coverage config only includes components, do not waste time on excluded folders.

  3. Add 1–3 scenarios (with actions) targeting those worst files

  - Prefer adding scenarios to componentsToCover in packages/faces/social/tests/components/coverage-harness.ts.
  - Each scenario should be a “mini-story”:
      - valid props that actually render meaningful UI (avoid empty placeholders that skip branches),
      - a Wrapper (e.g. Root component) if context is required,
      - an optional action() that clicks/types/changes/keydowns to hit conditional branches (menus, modals, loading/error/empty states, role-based branches).
  - If a component needs complex context/state wiring, add a small Svelte harness component under packages/faces/social/tests/components/<Area>/<Name>Test.svelte (copy the EditorTest.svelte pattern) and test
    it either:
      - via the central harness (ideal), or
      - via a dedicated *.test.ts that focuses on interactions/branch paths.
  - Assertions:
      - At least one observable outcome per scenario (text/role appears, menu opens, button label changes, handler spy called).
      - Avoid snapshot-only tests.
      - Keep tests deterministic (mock timers if needed; avoid real timeouts).

  4. Re-run coverage and summarize progress

  pnpm --filter @equaltoai/greater-components-social test:coverage

  Report:

  - New overall Lines/Functions/Statements/Branches (from packages/faces/social/coverage/index.html).
  - Which 1–3 worst files you targeted and what scenarios/actions you added.
  - If continuing, list the next 1–3 files you’d target based on the latest lcov.info ranking.

  Stop conditions:

  - Stop after one full loop if time is limited; otherwise repeat until the worst uncovered-line files are materially improved and branch coverage meaningfully rises.

  Output requirements:

  - Provide a short summary of modifications, coverage numbers, and next targets.