# Greater Components Release Changelog

This changelog tracks **Greater Components releases** (Git tags `greater-vX.Y.Z`) that distribute:

- the `greater` CLI (`greater-components-cli.tgz`)
- the registry metadata (`registry/index.json`, `registry/latest.json`)

Package/library changelogs live in `packages/*/CHANGELOG.md` (for example `packages/greater-components/CHANGELOG.md`).

## Unreleased

- Fix: `greater --version` now reports the packaged CLI version (no more hardcoded `0.1.0`).
- Tooling: `scripts/prepare-github-release.js` now keeps `packages/cli/package.json` in sync with the release version.

## [0.1.2-rc.1](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2-rc...greater-v0.1.2-rc.1) (2026-02-04)


### Chores

* **ci:** adopt AppTheory release flow ([3c6c2df](https://github.com/equaltoai/greater-components/commit/3c6c2df91dd625c8ef4ae2f101bc89a9ed439b58))
* **ci:** adopt AppTheory release flow + pin Node 24 ([496b85b](https://github.com/equaltoai/greater-components/commit/496b85b693bec32cc65f589c97443efa161b5aca))
* **ci:** ensure release-please PRs run CI checks ([67f766b](https://github.com/equaltoai/greater-components/commit/67f766b8e55cdedfb1ceff4cfacd2b220e50c821))
* **ci:** run checks for release-please PRs ([b2dc38d](https://github.com/equaltoai/greater-components/commit/b2dc38d23ac1b97e5e2bfa0718f68ba25534e683))
* **premain:** prepare release metadata for 0.1.2-rc ([52a60a3](https://github.com/equaltoai/greater-components/commit/52a60a3e7a3b12018552e653a98eb783ef6482a3))
* promote staging to premain ([40c561d](https://github.com/equaltoai/greater-components/commit/40c561de0e195e1257bdb0a53694f7ae78ae779a))
* **release:** prepare metadata for 0.1.2-rc ([b9fea95](https://github.com/equaltoai/greater-components/commit/b9fea95c4b5741307e919b6410f7222fda3f1be0))

## [0.1.2-rc](https://github.com/equaltoai/greater-components/compare/greater-v0.1.1...greater-v0.1.2-rc) (2026-02-04)

### CI

- **release:** release-please should include chore commits ([7d450f8](https://github.com/equaltoai/greater-components/commit/7d450f850c189a7da50099dbad7e558da265e9c4))
- **release:** treat chore commits as user-facing ([5a3b5e0](https://github.com/equaltoai/greater-components/commit/5a3b5e0b9654be1960c0551a46b09f738afff1f1))

### Chores

- align versions and automate releases ([d0d449b](https://github.com/equaltoai/greater-components/commit/d0d449bb72358549815e8e42851267ace75a4a6a))
- align versions and automate releases ([6c9496f](https://github.com/equaltoai/greater-components/commit/6c9496f3d7efa4902f604b9aacf5cf3b112c539f))
- **deps:** Bump the dependencies group across 1 directory with 26 updates ([9092ec8](https://github.com/equaltoai/greater-components/commit/9092ec8c2a805d73a94d81d0e4eadeed59000a90))
- **deps:** update to latest stable ([8accdbf](https://github.com/equaltoai/greater-components/commit/8accdbfde97c9473cb0454dcc42bc217db9ea484))
- **deps:** update to latest stable ([863e1e2](https://github.com/equaltoai/greater-components/commit/863e1e277e5f0be1db7a9cf24850e33dc8e3ff42))
- promote staging to premain (RC) ([e910da0](https://github.com/equaltoai/greater-components/commit/e910da0b5a9d72995574a7d9ddbcb694fa2cb8b8))

## [0.1.1] - 2026-01-09

- Release tag: `greater-v0.1.1`
- Registry metadata updated for `greater-v0.1.1`

## [0.1.0] - 2026-01-07

- Release tag: `greater-v0.1.0`
- Initial GitHub Release distribution (CLI + registry metadata)
