# Greater Components Release Changelog

This changelog tracks **Greater Components releases** (Git tags `greater-vX.Y.Z`) that distribute:

- the `greater` CLI (`greater-components-cli.tgz`)
- the registry metadata (`registry/index.json`, `registry/latest.json`)

Package/library changelogs live in `packages/*/CHANGELOG.md` (for example `packages/greater-components/CHANGELOG.md`).

## Unreleased

- Fix: `greater --version` now reports the packaged CLI version (no more hardcoded `0.1.0`).
- Tooling: `scripts/prepare-github-release.js` now keeps `packages/cli/package.json` in sync with the release version.

## [0.1.8](https://github.com/equaltoai/greater-components/compare/greater-v0.1.7...greater-v0.1.8) (2026-02-11)


### Features

* **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
* **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))


### Docs

* clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))


### Chores

* **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
* **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
* **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
* **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
* **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
* **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
* **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))

## [0.1.8-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.7-rc.0...greater-v0.1.8-rc.0) (2026-02-11)

### Features

- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))

### Docs

- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))

### Chores

- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** release greater 0.1.7 ([c1970f1](https://github.com/equaltoai/greater-components/commit/c1970f1f7d51d69b1d924be718765c52b2c75d75))
- **main:** release greater 0.1.7 ([8182b0e](https://github.com/equaltoai/greater-components/commit/8182b0e056d49bf6b69fb8a50541cc36e5ea9539))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- **release:** prepare metadata ([59b93e6](https://github.com/equaltoai/greater-components/commit/59b93e66e7af639ce9f8f2be5d1215910b8f7fe7))

## [0.1.7](https://github.com/equaltoai/greater-components/compare/greater-v0.1.6...greater-v0.1.7) (2026-02-10)

### Bug Fixes

- **compose:** include new object fields in optimistic updates ([9f28a34](https://github.com/equaltoai/greater-components/commit/9f28a3440484eec3906b8fd32c22ecc792c32fd2))
- **graphql:** pin Lesser v1.1.1 + expand fragments ([d68fd59](https://github.com/equaltoai/greater-components/commit/d68fd592e3e1e18b0bd08d925a5d6a1d2afbf19b)), closes [#168](https://github.com/equaltoai/greater-components/issues/168)
- **registry:** keep index ref on release tag ([6664cdb](https://github.com/equaltoai/greater-components/commit/6664cdb208ab951fa8c2861a2eca6ed5645ddefe))

### Chores

- **premain:** release greater 0.1.7-rc.0 ([28fe63e](https://github.com/equaltoai/greater-components/commit/28fe63e368431d6e202ad2ff2a59c31408233ba4))
- **premain:** release greater 0.1.7-rc.0 ([532c688](https://github.com/equaltoai/greater-components/commit/532c688b7cc54bfa4fb4bce307ddc89bac596663))
- **release:** prepare metadata ([9f62828](https://github.com/equaltoai/greater-components/commit/9f62828301f7532fc0f7e27cb6dc31e965b3b29d))

## [0.1.7-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.6-rc.0...greater-v0.1.7-rc.0) (2026-02-10)

### Bug Fixes

- **compose:** include new object fields in optimistic updates ([9f28a34](https://github.com/equaltoai/greater-components/commit/9f28a3440484eec3906b8fd32c22ecc792c32fd2))
- **graphql:** pin Lesser v1.1.1 + expand fragments ([d68fd59](https://github.com/equaltoai/greater-components/commit/d68fd592e3e1e18b0bd08d925a5d6a1d2afbf19b)), closes [#168](https://github.com/equaltoai/greater-components/issues/168)
- **registry:** keep index ref on release tag ([6664cdb](https://github.com/equaltoai/greater-components/commit/6664cdb208ab951fa8c2861a2eca6ed5645ddefe))

### Chores

- **main:** release greater 0.1.6 ([b68eaf8](https://github.com/equaltoai/greater-components/commit/b68eaf8b983c2511def417009771455b237774b1))
- **main:** release greater 0.1.6 ([5492fad](https://github.com/equaltoai/greater-components/commit/5492faddf363cdd55ba60e229bc4f0f0a044386f))
- **release:** prepare metadata ([ed08549](https://github.com/equaltoai/greater-components/commit/ed0854991060157932b420fc46e42df24c45bf12))

## [0.1.6](https://github.com/equaltoai/greater-components/compare/greater-v0.1.5...greater-v0.1.6) (2026-02-10)

### CI

- streamline staging checks ([b57ca93](https://github.com/equaltoai/greater-components/commit/b57ca9346fb8a7021db16116bdc957b503d7c5fa))

### Chores

- sync Lesser contracts v1.1.0 ([d41ccc0](https://github.com/equaltoai/greater-components/commit/d41ccc0de4dce9e2b599263e41823d5fa890c39b))
- sync Lesser contracts v1.1.0 ([d76b06b](https://github.com/equaltoai/greater-components/commit/d76b06bd2a4afe55c8d3f86d7b3716c2cf200d31))

## [0.1.5](https://github.com/equaltoai/greater-components/compare/greater-v0.1.4...greater-v0.1.5) (2026-02-10)

### Features

- **admin:** improve moderation workflows ([1b5c2d4](https://github.com/equaltoai/greater-components/commit/1b5c2d4acf790e17cc80f585f9f0125ef23c902e)), closes [#154](https://github.com/equaltoai/greater-components/issues/154)
- **social:** improve post interactions ([c6c12bf](https://github.com/equaltoai/greater-components/commit/c6c12bf83cdf52fbb5029d4db92480d0a7c06c20)), closes [#153](https://github.com/equaltoai/greater-components/issues/153)

### Bug Fixes

- **a11y:** keep status roles out of feed ([724abfb](https://github.com/equaltoai/greater-components/commit/724abfbec3363004deecc2655c73324928506519))
- **ci:** resolve lint/format/test failures ([634e629](https://github.com/equaltoai/greater-components/commit/634e6290b33d687e7100f01d620640a77a55768d))
- **cli,social:** install social timeline + virtual scrolling ([92c544f](https://github.com/equaltoai/greater-components/commit/92c544f463204136410097978fa2f7781f8da15b)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **csp:** remove inline styles from virtualized timelines ([22aa0fc](https://github.com/equaltoai/greater-components/commit/22aa0fc2a8f4d041cf92f92f4ead819337774742))
- make social scaffold pass strict checks ([a72e19b](https://github.com/equaltoai/greater-components/commit/a72e19b5d54e1c932a91dea20e096d06d46e3560)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- reduce social face svelte-check errors ([2833ed4](https://github.com/equaltoai/greater-components/commit/2833ed4ee12b79eb4a3dbcac5ffe97f00d9379d7)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)

### Chores

- merge premain into staging ([5401dc9](https://github.com/equaltoai/greater-components/commit/5401dc947959e547fca08ec7da624556f27abc1f))
- **premain:** release greater 0.1.5-rc.0 ([732a24b](https://github.com/equaltoai/greater-components/commit/732a24b2a7e910cf3e0433cd948e4c97c197a42f))
- **premain:** release greater 0.1.5-rc.0 ([71a58b3](https://github.com/equaltoai/greater-components/commit/71a58b30c6e8c182aa3986910ef4019bac40ab5f))
- **registry:** regenerate index ([0cd0f1b](https://github.com/equaltoai/greater-components/commit/0cd0f1b1c44d346593fdf2cc6850167754a31581))
- **release:** prepare metadata ([e5d92bc](https://github.com/equaltoai/greater-components/commit/e5d92bcfe1a854e6238ac4b3f86bf9a2eff50166))

## [0.1.5-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.4-rc.0...greater-v0.1.5-rc.0) (2026-02-10)

### Features

- **admin:** improve moderation workflows ([1b5c2d4](https://github.com/equaltoai/greater-components/commit/1b5c2d4acf790e17cc80f585f9f0125ef23c902e)), closes [#154](https://github.com/equaltoai/greater-components/issues/154)
- **social:** improve post interactions ([c6c12bf](https://github.com/equaltoai/greater-components/commit/c6c12bf83cdf52fbb5029d4db92480d0a7c06c20)), closes [#153](https://github.com/equaltoai/greater-components/issues/153)

### Bug Fixes

- **a11y:** keep status roles out of feed ([724abfb](https://github.com/equaltoai/greater-components/commit/724abfbec3363004deecc2655c73324928506519))
- **ci:** resolve lint/format/test failures ([634e629](https://github.com/equaltoai/greater-components/commit/634e6290b33d687e7100f01d620640a77a55768d))
- **cli,social:** install social timeline + virtual scrolling ([92c544f](https://github.com/equaltoai/greater-components/commit/92c544f463204136410097978fa2f7781f8da15b)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **csp:** remove inline styles from virtualized timelines ([22aa0fc](https://github.com/equaltoai/greater-components/commit/22aa0fc2a8f4d041cf92f92f4ead819337774742))
- make social scaffold pass strict checks ([a72e19b](https://github.com/equaltoai/greater-components/commit/a72e19b5d54e1c932a91dea20e096d06d46e3560)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- reduce social face svelte-check errors ([2833ed4](https://github.com/equaltoai/greater-components/commit/2833ed4ee12b79eb4a3dbcac5ffe97f00d9379d7)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)

### Chores

- **main:** release greater 0.1.4 ([dcf4a35](https://github.com/equaltoai/greater-components/commit/dcf4a3555d1a5cb54b9ea73e28099225d1725223))
- merge premain into staging ([5401dc9](https://github.com/equaltoai/greater-components/commit/5401dc947959e547fca08ec7da624556f27abc1f))
- **registry:** regenerate index ([0cd0f1b](https://github.com/equaltoai/greater-components/commit/0cd0f1b1c44d346593fdf2cc6850167754a31581))

## [0.1.4](https://github.com/equaltoai/greater-components/compare/greater-v0.1.3...greater-v0.1.4) (2026-02-09)

### Bug Fixes

- **cli:** reliable CSS + consistent release artifacts ([68649a9](https://github.com/equaltoai/greater-components/commit/68649a92d6b8d30ba304b36462bfb72d13d6aa3b))
- **cli:** stabilize local CSS + ref fetching ([4fd1c25](https://github.com/equaltoai/greater-components/commit/4fd1c257d1cd612ff9b5810888990bd84020c859))

### CI

- **coverage:** make workflow dispatchable ([52a06d0](https://github.com/equaltoai/greater-components/commit/52a06d09f57dc9d7df0b9c6a7b8cac2981ba47a1))
- **release:** keep premain prereleases ahead of stable ([af0d06b](https://github.com/equaltoai/greater-components/commit/af0d06b4c1df9353ac64b22371e1cf2040048c86))
- **release:** keep premain prereleases ahead of stable ([dec045f](https://github.com/equaltoai/greater-components/commit/dec045fb6d3d41d3eca10dc8c51094d63ee3dcb4))
- **release:** keep premain release-as prerelease ([44853fe](https://github.com/equaltoai/greater-components/commit/44853fe6e958ffa8a0c6d134d860d547fa54f310))
- **release:** unify build + pack pipeline ([ab70579](https://github.com/equaltoai/greater-components/commit/ab705792be3d497409ea1661be5512cb18ba914d))

### Chores

- add changeset and format new CLI files ([78adf68](https://github.com/equaltoai/greater-components/commit/78adf68841307a84b3df951bb5a6a724a59ff0f7))
- **deps:** update workspace dependencies ([0e44a94](https://github.com/equaltoai/greater-components/commit/0e44a94edcfe74ed9e12cdfa16adbb012e2b710f))
- merge main into premain ([3f2ba88](https://github.com/equaltoai/greater-components/commit/3f2ba88b26ace6b4814e903f3780065944c5f942))
- **premain:** release greater 0.1.2-rc.4 ([351802b](https://github.com/equaltoai/greater-components/commit/351802bb15064caba6f78018d3ae029f7e646d7f))
- **premain:** release greater 0.1.2-rc.4 ([d0ea8c7](https://github.com/equaltoai/greater-components/commit/d0ea8c78088cfae8123bbc35e6165f3d4938b10c))
- promote premain to main ([124fa61](https://github.com/equaltoai/greater-components/commit/124fa61d0360490765090d2a9064dc8496c5ce99))
- promote staging to premain ([4198cf0](https://github.com/equaltoai/greater-components/commit/4198cf0cd6dc661dcad0fbbc64015289aa9d74a9))
- **release:** prepare metadata ([078e714](https://github.com/equaltoai/greater-components/commit/078e71455c269c0bbec6a9b673d5999451fd492c))

## [0.1.4-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2-rc.4...greater-v0.1.4-rc.0) (2026-02-09)

### CI

- **coverage:** make workflow dispatchable ([52a06d0](https://github.com/equaltoai/greater-components/commit/52a06d09f57dc9d7df0b9c6a7b8cac2981ba47a1))
- **release:** keep premain prereleases ahead of stable ([af0d06b](https://github.com/equaltoai/greater-components/commit/af0d06b4c1df9353ac64b22371e1cf2040048c86))
- **release:** keep premain prereleases ahead of stable ([dec045f](https://github.com/equaltoai/greater-components/commit/dec045fb6d3d41d3eca10dc8c51094d63ee3dcb4))
- **release:** keep premain release-as prerelease ([44853fe](https://github.com/equaltoai/greater-components/commit/44853fe6e958ffa8a0c6d134d860d547fa54f310))

### Chores

- merge main into premain ([3f2ba88](https://github.com/equaltoai/greater-components/commit/3f2ba88b26ace6b4814e903f3780065944c5f942))

## [0.1.2-rc.4](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2-rc.3...greater-v0.1.2-rc.4) (2026-02-09)

### Bug Fixes

- **cli:** reliable CSS + consistent release artifacts ([68649a9](https://github.com/equaltoai/greater-components/commit/68649a92d6b8d30ba304b36462bfb72d13d6aa3b))
- **cli:** stabilize local CSS + ref fetching ([4fd1c25](https://github.com/equaltoai/greater-components/commit/4fd1c257d1cd612ff9b5810888990bd84020c859))

### CI

- **release:** unify build + pack pipeline ([ab70579](https://github.com/equaltoai/greater-components/commit/ab705792be3d497409ea1661be5512cb18ba914d))

### Chores

- add changeset and format new CLI files ([78adf68](https://github.com/equaltoai/greater-components/commit/78adf68841307a84b3df951bb5a6a724a59ff0f7))
- **deps:** update workspace dependencies ([0e44a94](https://github.com/equaltoai/greater-components/commit/0e44a94edcfe74ed9e12cdfa16adbb012e2b710f))
- promote staging to premain ([4198cf0](https://github.com/equaltoai/greater-components/commit/4198cf0cd6dc661dcad0fbbc64015289aa9d74a9))

## [0.1.3](https://github.com/equaltoai/greater-components/compare/greater-v0.1.2...greater-v0.1.3) (2026-02-05)

### Bug Fixes

- **cli:** skip local CSS import injection when local CSS copy fails ([5ac951b](https://github.com/equaltoai/greater-components/commit/5ac951bfedbc5e2f9c18616f3b7c0aca9be09bf0))
- **cli:** skip local CSS injection when copy fails ([fc52dbc](https://github.com/equaltoai/greater-components/commit/fc52dbcbf9c23ed8b77f0e0b1166d41a75d17df9))

### Chores

- fix PR 136 CI failures ([1a25642](https://github.com/equaltoai/greater-components/commit/1a2564251aeeccc917babd653a2793c7cf32fa1d))
- **premain:** release greater 0.1.2-rc.3 ([bd7113f](https://github.com/equaltoai/greater-components/commit/bd7113f64f34d859d456c1e0151ee84193bc9792))
- **premain:** release greater 0.1.2-rc.3 ([8b2abda](https://github.com/equaltoai/greater-components/commit/8b2abdaef2e825df1674980238fce40c399bb822))
- **release:** prepare metadata ([f4044fe](https://github.com/equaltoai/greater-components/commit/f4044fe8f98fcc633d5333024ec41708d70295b5))

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
