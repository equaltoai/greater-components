# Greater Components Release Changelog

This changelog tracks **Greater Components releases** (Git tags `greater-vX.Y.Z`) that distribute:

- the `greater` CLI (`greater-components-cli.tgz`)
- the registry metadata (`registry/index.json`, `registry/latest.json`)

Package/library changelogs live in `packages/*/CHANGELOG.md` (for example `packages/greater-components/CHANGELOG.md`).

## Unreleased

- Fix: `greater --version` now reports the packaged CLI version (no more hardcoded `0.1.0`).
- Tooling: `scripts/prepare-github-release.js` now keeps `packages/cli/package.json` in sync with the release version.

## [0.1.2-rc.3](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2-rc.2...greater-v0.1.2-rc.3) (2026-02-05)

### Bug Fixes

- **cli:** skip local CSS import injection when local CSS copy fails ([5ac951b](https://github.com/equaltoai/greater-components/commit/5ac951bfedbc5e2f9c18616f3b7c0aca9be09bf0))
- **cli:** skip local CSS injection when copy fails ([fc52dbc](https://github.com/equaltoai/greater-components/commit/fc52dbcbf9c23ed8b77f0e0b1166d41a75d17df9))

### Chores

- fix PR 136 CI failures ([1a25642](https://github.com/equaltoai/greater-components/commit/1a2564251aeeccc917babd653a2793c7cf32fa1d))
- **main:** release greater 0.1.2 ([14081f1](https://github.com/equaltoai/greater-components/commit/14081f1dbd06a8bdb1e214e746c130c90e9fcf50))
- **main:** release greater 0.1.2 ([6c38f5b](https://github.com/equaltoai/greater-components/commit/6c38f5b88a7a5cd75c0a3f6eaa8ef05f95216a8d))
- promote premain to main ([b7918d1](https://github.com/equaltoai/greater-components/commit/b7918d11f9e24b42995a728e1b574cf1b3a8b2f9))
- **release:** prepare metadata ([cbb6681](https://github.com/equaltoai/greater-components/commit/cbb6681304b951def556cfb8ed206266b2907d98))

## [0.1.2](https://github.com/equaltoai/greater-components/compare/greater-v0.1.1...greater-v0.1.2) (2026-02-04)

### CI

- dispatch main/premain guard checks ([9d315de](https://github.com/equaltoai/greater-components/commit/9d315debb4b03114bf1006bebb303e5fcda335b8))
- dispatch main/premain guard checks ([c3a2607](https://github.com/equaltoai/greater-components/commit/c3a260740b07fd76d4f951f8d658da2ff0985618))
- make Codecov upload optional ([e4b96c2](https://github.com/equaltoai/greater-components/commit/e4b96c21b946a65cd4f11edc71a6eb00280ca6c2))
- make Codecov upload optional ([bed813d](https://github.com/equaltoai/greater-components/commit/bed813d133ef4a723fbe1f90bab3ca62ba2baade))
- **release:** release-please should include chore commits ([7d450f8](https://github.com/equaltoai/greater-components/commit/7d450f850c189a7da50099dbad7e558da265e9c4))
- **release:** treat chore commits as user-facing ([5a3b5e0](https://github.com/equaltoai/greater-components/commit/5a3b5e0b9654be1960c0551a46b09f738afff1f1))

### Chores

- align versions and automate releases ([d0d449b](https://github.com/equaltoai/greater-components/commit/d0d449bb72358549815e8e42851267ace75a4a6a))
- align versions and automate releases ([6c9496f](https://github.com/equaltoai/greater-components/commit/6c9496f3d7efa4902f604b9aacf5cf3b112c539f))
- **ci:** adopt AppTheory release flow ([3c6c2df](https://github.com/equaltoai/greater-components/commit/3c6c2df91dd625c8ef4ae2f101bc89a9ed439b58))
- **ci:** adopt AppTheory release flow + pin Node 24 ([496b85b](https://github.com/equaltoai/greater-components/commit/496b85b693bec32cc65f589c97443efa161b5aca))
- **ci:** ensure release-please PRs run CI checks ([67f766b](https://github.com/equaltoai/greater-components/commit/67f766b8e55cdedfb1ceff4cfacd2b220e50c821))
- **ci:** run checks for release-please PRs ([b2dc38d](https://github.com/equaltoai/greater-components/commit/b2dc38d23ac1b97e5e2bfa0718f68ba25534e683))
- **deps:** Bump the dependencies group across 1 directory with 26 updates ([9092ec8](https://github.com/equaltoai/greater-components/commit/9092ec8c2a805d73a94d81d0e4eadeed59000a90))
- **deps:** update to latest stable ([8accdbf](https://github.com/equaltoai/greater-components/commit/8accdbfde97c9473cb0454dcc42bc217db9ea484))
- **deps:** update to latest stable ([863e1e2](https://github.com/equaltoai/greater-components/commit/863e1e277e5f0be1db7a9cf24850e33dc8e3ff42))
- **premain:** prepare release metadata for 0.1.2-rc ([52a60a3](https://github.com/equaltoai/greater-components/commit/52a60a3e7a3b12018552e653a98eb783ef6482a3))
- **premain:** release greater 0.1.2-rc ([5069dbe](https://github.com/equaltoai/greater-components/commit/5069dbed9a35f25f5c31fca7f852683d4687de9a))
- **premain:** release greater 0.1.2-rc ([e3a7494](https://github.com/equaltoai/greater-components/commit/e3a7494435f8a4eb535d074178b473cb8913e40d))
- **premain:** release greater 0.1.2-rc.1 ([1c3f7e4](https://github.com/equaltoai/greater-components/commit/1c3f7e4fb6c22f38939b459805ae4bced01cc6b9))
- **premain:** release greater 0.1.2-rc.1 ([defac6c](https://github.com/equaltoai/greater-components/commit/defac6cd2b2770b578c7cf2a0bb25f340cb8ac49))
- **premain:** release greater 0.1.2-rc.2 ([34d7305](https://github.com/equaltoai/greater-components/commit/34d7305ab8f6b30fc7baab37053c505cbf883961))
- **premain:** release greater 0.1.2-rc.2 ([56fbee1](https://github.com/equaltoai/greater-components/commit/56fbee16b0ab4c6966eb0ce3d516bb3f6ab8ec12))
- promote premain to main ([b7918d1](https://github.com/equaltoai/greater-components/commit/b7918d11f9e24b42995a728e1b574cf1b3a8b2f9))
- promote staging to premain ([dbf01fd](https://github.com/equaltoai/greater-components/commit/dbf01fd63599e173ad50b7120418c55d7b0fd8ca))
- promote staging to premain ([4e885a8](https://github.com/equaltoai/greater-components/commit/4e885a8c8929c532e47173fbbad7b35d9f26f665))
- promote staging to premain ([40c561d](https://github.com/equaltoai/greater-components/commit/40c561de0e195e1257bdb0a53694f7ae78ae779a))
- promote staging to premain (RC) ([e910da0](https://github.com/equaltoai/greater-components/commit/e910da0b5a9d72995574a7d9ddbcb694fa2cb8b8))
- **release:** prepare metadata ([c3b72dc](https://github.com/equaltoai/greater-components/commit/c3b72dc2c0a7a1f654dc77c1f48c641b19a49345))
- **release:** prepare metadata ([28d2d29](https://github.com/equaltoai/greater-components/commit/28d2d29e15f7ced4dffc9eab1e625a196b3c71f3))
- **release:** prepare metadata for 0.1.2-rc ([b9fea95](https://github.com/equaltoai/greater-components/commit/b9fea95c4b5741307e919b6410f7222fda3f1be0))

## [0.1.2-rc.2](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2-rc.1...greater-v0.1.2-rc.2) (2026-02-04)

### CI

- dispatch main/premain guard checks ([9d315de](https://github.com/equaltoai/greater-components/commit/9d315debb4b03114bf1006bebb303e5fcda335b8))
- dispatch main/premain guard checks ([c3a2607](https://github.com/equaltoai/greater-components/commit/c3a260740b07fd76d4f951f8d658da2ff0985618))

### Chores

- promote staging to premain ([4e885a8](https://github.com/equaltoai/greater-components/commit/4e885a8c8929c532e47173fbbad7b35d9f26f665))

## [0.1.2-rc.1](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2-rc...greater-v0.1.2-rc.1) (2026-02-04)

### Chores

- **ci:** adopt AppTheory release flow ([3c6c2df](https://github.com/equaltoai/greater-components/commit/3c6c2df91dd625c8ef4ae2f101bc89a9ed439b58))
- **ci:** adopt AppTheory release flow + pin Node 24 ([496b85b](https://github.com/equaltoai/greater-components/commit/496b85b693bec32cc65f589c97443efa161b5aca))
- **ci:** ensure release-please PRs run CI checks ([67f766b](https://github.com/equaltoai/greater-components/commit/67f766b8e55cdedfb1ceff4cfacd2b220e50c821))
- **ci:** run checks for release-please PRs ([b2dc38d](https://github.com/equaltoai/greater-components/commit/b2dc38d23ac1b97e5e2bfa0718f68ba25534e683))
- **premain:** prepare release metadata for 0.1.2-rc ([52a60a3](https://github.com/equaltoai/greater-components/commit/52a60a3e7a3b12018552e653a98eb783ef6482a3))
- promote staging to premain ([40c561d](https://github.com/equaltoai/greater-components/commit/40c561de0e195e1257bdb0a53694f7ae78ae779a))
- **release:** prepare metadata for 0.1.2-rc ([b9fea95](https://github.com/equaltoai/greater-components/commit/b9fea95c4b5741307e919b6410f7222fda3f1be0))

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
