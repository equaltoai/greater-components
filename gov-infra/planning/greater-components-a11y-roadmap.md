# greater-components Accessibility Gate Recovery Roadmap

## Observed blocker

On 2026-07-29, `pnpm test:a11y` timed out while waiting for
`body[data-playground-hydrated="true"]` in demo Tabs and Timeline cases. The
rubric keeps `QUA-2` strict and reports the failure; it does not skip the
suite, change its timeout, or reduce accessibility scope.

## Remediation

1. Reproduce the failed Playwright hydration cases in the staging CI image.
2. Repair the playground/demo hydration contract in a separately scoped
   accessibility change.
3. Re-run the full accessibility matrix and this verifier. Close this roadmap
   only when `QUA-2` passes without exclusions.
