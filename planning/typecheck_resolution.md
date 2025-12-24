# Typecheck Resolution

## Issue

`pnpm typecheck` was failing with "Unreachable code detected" errors in the CLI package.

## Diagnosis

The errors were caused by `return` statements immediately following `process.exit(1)` or `process.exit(0)` calls. Since `process.exit` terminates the process, the subsequent `return` statements were technically unreachable, which TypeScript correctly flagged (error TS7027).

## Fixes

Removed unreachable `return` statements in the following files:

- `packages/cli/src/commands/add.ts`
- `packages/cli/src/commands/init.ts`
- `packages/cli/src/commands/update.ts`

## Test Fixes

After fixing the unreachable code, `packages/cli` tests failed because they relied on mocked `process.exit` NOT exiting.

- Updated `packages/cli/tests/init.test.ts`, `update.unit.test.ts`, and `add.test.ts` to mock `process.exit` by throwing an error instead of doing nothing.
- Updated test expectations to catch these errors using `await expect(...).rejects.toThrow()`.
- Fixed a specific test case in `add.test.ts` ("prompts for items if none provided") which was exiting with code 0 (success/early exit) but was assumed to fail or continue.

## Verification

Ran `pnpm typecheck` (exit code 0).
Ran `pnpm test:coverage` (exit code 0).
Verified coverage reports exist for `adapters`, `cli`, and `icons`.
