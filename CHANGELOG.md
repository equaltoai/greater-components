# Greater Components Release Changelog

This changelog tracks **Greater Components releases** (Git tags `greater-vX.Y.Z`) that distribute:

- the `greater` CLI (`greater-components-cli.tgz`)
- the registry metadata (`registry/index.json`, `registry/latest.json`)

Package/library changelogs live in `packages/*/CHANGELOG.md` (for example `packages/greater-components/CHANGELOG.md`).

## Unreleased

- Fix: `greater --version` now reports the packaged CLI version (no more hardcoded `0.1.0`).
- Tooling: `scripts/prepare-github-release.js` now keeps `packages/cli/package.json` in sync with the release version.

## [0.8.8-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.8.7-rc.0...greater-v0.8.8-rc.0) (2026-05-02)

### Bug Fixes

- harden codex security findings ([1b5a347](https://github.com/equaltoai/greater-components/commit/1b5a34793f4b80bbddd56ac1d50fdcb6b4fccad0))
- harden Codex Security findings and sync contracts ([a343047](https://github.com/equaltoai/greater-components/commit/a343047e94e0c589ff8ce33d50cde373801c2f1f))
- stabilize ci after contract sync ([2b65053](https://github.com/equaltoai/greater-components/commit/2b65053df2c6d058aa23808a9881847e5459ae68))

### Tests

- avoid substring URL match in cli fetch test ([a04a9c0](https://github.com/equaltoai/greater-components/commit/a04a9c0a48bcbffc57573e80a0a4ef74ccbaa954))

### Chores

- **main:** release greater 0.8.7 ([3ccb873](https://github.com/equaltoai/greater-components/commit/3ccb8738fa4c98ac2eea11515552b1a9d853496b))
- **main:** release greater 0.8.7 ([aa9595d](https://github.com/equaltoai/greater-components/commit/aa9595d77f0fb96a4f24a32742af4c309164edce))
- **release:** prepare metadata ([fba65ae](https://github.com/equaltoai/greater-components/commit/fba65aea9cc27169e493a3c47af9ecb01077049f))
- sync lesser contracts v1.2.54 ([e4119e1](https://github.com/equaltoai/greater-components/commit/e4119e1f2d2f675b76626951c55266e9229b7712))
- sync lesser-host contracts v0.2.6 ([ad5dbe5](https://github.com/equaltoai/greater-components/commit/ad5dbe523fb9ca1e6cd1434bd291a984b161dd69))

## [0.8.7](https://github.com/equaltoai/greater-components/compare/greater-v0.8.6...greater-v0.8.7) (2026-04-18)

### Docs

- initialize .codex directory with stack documentation and automated skill workflows ([4c78cbc](https://github.com/equaltoai/greater-components/commit/4c78cbc680ad94c8b684b0aa376712eb66640848))

### CI

- **deps:** update GitHub Actions dependency pins ([af66152](https://github.com/equaltoai/greater-components/commit/af66152202739410f33fe4f6310f32ab55ca3f74))

### Chores

- **deps:** consolidate dependabot alerts 79-86 and open updates ([f1dfc95](https://github.com/equaltoai/greater-components/commit/f1dfc95ae824d9ef0247ec64e434e76ba34f1f0a))
- **deps:** consolidate dependabot security updates ([0ba5269](https://github.com/equaltoai/greater-components/commit/0ba52695397673eeabcd7f1fb9cbe14d6f433931))
- **premain:** release greater 0.8.7-rc.0 ([2ca17e3](https://github.com/equaltoai/greater-components/commit/2ca17e3758340c48b04d112ac416787fae48f964))
- **premain:** release greater 0.8.7-rc.0 ([fae2edc](https://github.com/equaltoai/greater-components/commit/fae2edc8771db57d5f173c08451a15e8516eccb3))
- **release:** prepare metadata ([1b99484](https://github.com/equaltoai/greater-components/commit/1b994849ccb4cca3ea55919b3941af5ba21171f0))

## [0.8.7-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.7.0-rc.0...greater-v0.8.7-rc.0) (2026-04-18)

### Features

- integrate lesser-host v0.2.2 contracts ([e43ac69](https://github.com/equaltoai/greater-components/commit/e43ac69c5b8d283df205066d1bdc32637fe25c41))
- integrate lesser-host v0.2.2 contracts ([fc1ec34](https://github.com/equaltoai/greater-components/commit/fc1ec34ba3bec95bc17ce46c1496197e15352ab2))

### Bug Fixes

- **adapters:** align verifyCredentials with Lesser viewer schema ([ff2c7df](https://github.com/equaltoai/greater-components/commit/ff2c7dfe1dae8731ffdf53f62a5ab7f0292ba4c5))
- **adapters:** cache conversations as folder-keyed arrays ([feba5e5](https://github.com/equaltoai/greater-components/commit/feba5e5fb4169fe1b563337070ed37b1c4f1740d))
- **adapters:** normalize local dm participant ids ([e1258c3](https://github.com/equaltoai/greater-components/commit/e1258c3aae44cfc2ed7a98c3bd59176b30dc14e0))
- **deps:** address dependabot alerts 77 and 78 ([15824ba](https://github.com/equaltoai/greater-components/commit/15824ba795fc117ba366eb7184f72febebfb37d6))
- **messaging:** refetch when handlers arrive after mount ([ecbddf6](https://github.com/equaltoai/greater-components/commit/ecbddf6245c7443c702f785eb5684dd1c233645b))
- **messaging:** store background preload failures ([e7441b5](https://github.com/equaltoai/greater-components/commit/e7441b543bf3afa397f2474c6d8bf194f7903ad5))
- **messaging:** surface conversation picker search errors ([d3cad13](https://github.com/equaltoai/greater-components/commit/d3cad13659859ee760c9c2a43bacc46ce8c5fbae))
- preserve adapter fetch receiver context ([ef3bdc4](https://github.com/equaltoai/greater-components/commit/ef3bdc445b41320f3205e92befb51372d0594f6f))
- preserve adapter fetch receiver context ([5b13c31](https://github.com/equaltoai/greater-components/commit/5b13c318ab152e038ca9e3574f488c822dcb88cf))
- refresh registry checksums for lesser-host update ([413de7a](https://github.com/equaltoai/greater-components/commit/413de7ad8a090d4b8b7fbf293e63553d1604953f))

### Docs

- initialize .codex directory with stack documentation and automated skill workflows ([4c78cbc](https://github.com/equaltoai/greater-components/commit/4c78cbc680ad94c8b684b0aa376712eb66640848))

### CI

- **deps:** update GitHub Actions dependency pins ([af66152](https://github.com/equaltoai/greater-components/commit/af66152202739410f33fe4f6310f32ab55ca3f74))

### Chores

- **deps:** consolidate dependabot alerts 79-86 and open updates ([f1dfc95](https://github.com/equaltoai/greater-components/commit/f1dfc95ae824d9ef0247ec64e434e76ba34f1f0a))
- **deps:** consolidate dependabot security updates ([0ba5269](https://github.com/equaltoai/greater-components/commit/0ba52695397673eeabcd7f1fb9cbe14d6f433931))
- format lesser-host contract snapshots ([de5c8d0](https://github.com/equaltoai/greater-components/commit/de5c8d011ef2ee3a601c67346a821aefd41a9032))
- format lesser-host contract snapshots ([c4251ca](https://github.com/equaltoai/greater-components/commit/c4251ca97da7a73f5bd9c69967a856ed5a637cfd))
- **main:** release greater 0.7.0 ([3c302f3](https://github.com/equaltoai/greater-components/commit/3c302f3a28354783229bd185d94095439f359156))
- **main:** release greater 0.7.0 ([29d0857](https://github.com/equaltoai/greater-components/commit/29d0857d430a4e7a0b34cf272d51fbc600681438))
- **main:** release greater 0.8.0 ([6d25e04](https://github.com/equaltoai/greater-components/commit/6d25e04b1129e16bd0c333ba4253b11a5dc897d1))
- **main:** release greater 0.8.0 ([b0f39fc](https://github.com/equaltoai/greater-components/commit/b0f39fc9531cccb5ac958c8acbad86f4bc5f4254))
- **main:** release greater 0.8.1 ([ef7e8e6](https://github.com/equaltoai/greater-components/commit/ef7e8e6b4c84ae14b6205015561392e9fd75e7ff))
- **main:** release greater 0.8.1 ([06e41ef](https://github.com/equaltoai/greater-components/commit/06e41ef52ee2b752ec8901a50eea06e8b593d77b))
- **main:** release greater 0.8.2 ([96c854d](https://github.com/equaltoai/greater-components/commit/96c854d1a13859c45926f5f435c72fdd122328ed))
- **main:** release greater 0.8.2 ([e8b7792](https://github.com/equaltoai/greater-components/commit/e8b7792d98bae9a2fee2c741909e04417258aec0))
- **main:** release greater 0.8.3 ([b28d66e](https://github.com/equaltoai/greater-components/commit/b28d66ea37a9e326c2499b38122d750f6ff59055))
- **main:** release greater 0.8.3 ([9b1a930](https://github.com/equaltoai/greater-components/commit/9b1a9302ea5bc4caef28a33ff66a750365c1e0f9))
- **main:** release greater 0.8.4 ([e9f8f93](https://github.com/equaltoai/greater-components/commit/e9f8f9341863e244d8afabf75c3cfc3dbdec0dff))
- **main:** release greater 0.8.4 ([40308f7](https://github.com/equaltoai/greater-components/commit/40308f77b15a542997c59b7e88c7098b748b0fd8))
- **main:** release greater 0.8.5 ([68ba22e](https://github.com/equaltoai/greater-components/commit/68ba22e1844d005b0dee9a57a3870f11ce7575f5))
- **main:** release greater 0.8.5 ([849abb6](https://github.com/equaltoai/greater-components/commit/849abb66042cb7225e2847cce2dd3a1eec8ab6cb))
- **main:** release greater 0.8.6 ([cfc128e](https://github.com/equaltoai/greater-components/commit/cfc128e7af169a70104ed77043746c2e25e181d6))
- **main:** release greater 0.8.6 ([dea082c](https://github.com/equaltoai/greater-components/commit/dea082c8e25d9e9f3626043b2211cd6720d98a0f))
- refresh registry checksums ([9f0430c](https://github.com/equaltoai/greater-components/commit/9f0430cc1e077a1a5111de3e1448a59c93a29768))
- refresh registry for adapter fixes ([261e1d6](https://github.com/equaltoai/greater-components/commit/261e1d6da1e79767801e601467c5dd2aabbcfd14))
- **release:** prepare metadata ([364bc7e](https://github.com/equaltoai/greater-components/commit/364bc7e691294701ba66a400f16e992b1d6ba586))
- **release:** prepare metadata ([090f148](https://github.com/equaltoai/greater-components/commit/090f148d299905d657bf92b42705139041afab34))
- **release:** prepare metadata ([1ed92cf](https://github.com/equaltoai/greater-components/commit/1ed92cf49522a848ec1d9a8b85f9488165664dc4))
- **release:** prepare metadata ([3114db7](https://github.com/equaltoai/greater-components/commit/3114db768f6368d722ff8eb3d008b68128f8da49))
- **release:** prepare metadata ([4a56f63](https://github.com/equaltoai/greater-components/commit/4a56f6309eab468afea1068b2ad19ae3b4a9ac9c))
- **release:** prepare metadata ([a9392d7](https://github.com/equaltoai/greater-components/commit/a9392d7e96b1e9e702d09c2922118be80cf5fbcc))
- **release:** prepare metadata ([7c9188a](https://github.com/equaltoai/greater-components/commit/7c9188a50696cd5790712d0e82f243d2e87d630c))
- **release:** prepare metadata ([20f0654](https://github.com/equaltoai/greater-components/commit/20f0654a668e578d625d8858816af54945009789))
- sync lesser and lesser-host contracts ([744c552](https://github.com/equaltoai/greater-components/commit/744c552ea18503fa6fe88b1436dfeb2b15c01377))
- sync lesser and lesser-host contracts ([482bfb3](https://github.com/equaltoai/greater-components/commit/482bfb3c29cd615398d9050820af4c8ae76d8c37))
- sync lesser and lesser-host contracts ([16a52bc](https://github.com/equaltoai/greater-components/commit/16a52bccf8f18703a38d6faa4dcaaf2cd60a9094))

## [0.8.6](https://github.com/equaltoai/greater-components/compare/greater-v0.8.5...greater-v0.8.6) (2026-04-05)

### Chores

- format lesser-host contract snapshots ([de5c8d0](https://github.com/equaltoai/greater-components/commit/de5c8d011ef2ee3a601c67346a821aefd41a9032))
- sync lesser and lesser-host contracts ([744c552](https://github.com/equaltoai/greater-components/commit/744c552ea18503fa6fe88b1436dfeb2b15c01377))

## [0.8.5](https://github.com/equaltoai/greater-components/compare/greater-v0.8.4...greater-v0.8.5) (2026-04-04)

### Bug Fixes

- **adapters:** cache conversations as folder-keyed arrays ([feba5e5](https://github.com/equaltoai/greater-components/commit/feba5e5fb4169fe1b563337070ed37b1c4f1740d))
- **adapters:** normalize local dm participant ids ([e1258c3](https://github.com/equaltoai/greater-components/commit/e1258c3aae44cfc2ed7a98c3bd59176b30dc14e0))

### Chores

- refresh registry for adapter fixes ([261e1d6](https://github.com/equaltoai/greater-components/commit/261e1d6da1e79767801e601467c5dd2aabbcfd14))

## [0.8.4](https://github.com/equaltoai/greater-components/compare/greater-v0.8.3...greater-v0.8.4) (2026-04-03)

### Bug Fixes

- **adapters:** align verifyCredentials with Lesser viewer schema ([ff2c7df](https://github.com/equaltoai/greater-components/commit/ff2c7dfe1dae8731ffdf53f62a5ab7f0292ba4c5))
- **deps:** address dependabot alerts 77 and 78 ([15824ba](https://github.com/equaltoai/greater-components/commit/15824ba795fc117ba366eb7184f72febebfb37d6))
- **messaging:** refetch when handlers arrive after mount ([ecbddf6](https://github.com/equaltoai/greater-components/commit/ecbddf6245c7443c702f785eb5684dd1c233645b))
- **messaging:** store background preload failures ([e7441b5](https://github.com/equaltoai/greater-components/commit/e7441b543bf3afa397f2474c6d8bf194f7903ad5))
- **messaging:** surface conversation picker search errors ([d3cad13](https://github.com/equaltoai/greater-components/commit/d3cad13659859ee760c9c2a43bacc46ce8c5fbae))

### Chores

- refresh registry checksums ([9f0430c](https://github.com/equaltoai/greater-components/commit/9f0430cc1e077a1a5111de3e1448a59c93a29768))

## [0.8.3](https://github.com/equaltoai/greater-components/compare/greater-v0.8.2...greater-v0.8.3) (2026-04-03)

### Chores

- sync lesser and lesser-host contracts ([482bfb3](https://github.com/equaltoai/greater-components/commit/482bfb3c29cd615398d9050820af4c8ae76d8c37))

## [0.8.2](https://github.com/equaltoai/greater-components/compare/greater-v0.8.1...greater-v0.8.2) (2026-04-02)

### Chores

- format lesser-host contract snapshots ([c4251ca](https://github.com/equaltoai/greater-components/commit/c4251ca97da7a73f5bd9c69967a856ed5a637cfd))
- sync lesser and lesser-host contracts ([16a52bc](https://github.com/equaltoai/greater-components/commit/16a52bccf8f18703a38d6faa4dcaaf2cd60a9094))

## [0.8.1](https://github.com/equaltoai/greater-components/compare/greater-v0.8.0...greater-v0.8.1) (2026-04-02)

### Bug Fixes

- preserve adapter fetch receiver context ([ef3bdc4](https://github.com/equaltoai/greater-components/commit/ef3bdc445b41320f3205e92befb51372d0594f6f))
- preserve adapter fetch receiver context ([5b13c31](https://github.com/equaltoai/greater-components/commit/5b13c318ab152e038ca9e3574f488c822dcb88cf))

## [0.8.0](https://github.com/equaltoai/greater-components/compare/greater-v0.7.0...greater-v0.8.0) (2026-03-29)

### Features

- integrate lesser-host v0.2.2 contracts ([e43ac69](https://github.com/equaltoai/greater-components/commit/e43ac69c5b8d283df205066d1bdc32637fe25c41))
- integrate lesser-host v0.2.2 contracts ([fc1ec34](https://github.com/equaltoai/greater-components/commit/fc1ec34ba3bec95bc17ce46c1496197e15352ab2))

### Bug Fixes

- refresh registry checksums for lesser-host update ([413de7a](https://github.com/equaltoai/greater-components/commit/413de7ad8a090d4b8b7fbf293e63553d1604953f))

## [0.7.0](https://github.com/equaltoai/greater-components/compare/greater-v0.6.1...greater-v0.7.0) (2026-03-29)

### Bug Fixes

- flatten lib alias install targets ([4e94ea2](https://github.com/equaltoai/greater-components/commit/4e94ea2b96139c5fffd18fb02350792dadcab870))
- harden vendored face export transforms ([6557b2c](https://github.com/equaltoai/greater-components/commit/6557b2c5f09e27796199d7f522859c5783ca54b8))
- harden vendored face export transforms ([2d21a8d](https://github.com/equaltoai/greater-components/commit/2d21a8d5a8ae324004f73e79b0cdaa85fe10eb82))
- restore vendored add paths for social and agent flows ([83d3fc2](https://github.com/equaltoai/greater-components/commit/83d3fc213e8cdcfb505809cbf29240e28cb119b4))
- vendor full face package files ([0628d5c](https://github.com/equaltoai/greater-components/commit/0628d5c368704563e5eaaf6bfc05f60e9ae5214f))

### Tests

- align add command mocks with resolver keys ([9f113ac](https://github.com/equaltoai/greater-components/commit/9f113ac823f3ee852095eb95a4f7c0c63bfa0ed1))

### Chores

- **premain:** release greater 0.6.2-rc.0 ([136347e](https://github.com/equaltoai/greater-components/commit/136347ef0035a1d2fea2b4dc7c143cf6b4b28e89))
- **premain:** release greater 0.6.2-rc.0 ([30de810](https://github.com/equaltoai/greater-components/commit/30de81015589a655ce2c31b94235aa9a5b1e5ec0))
- **premain:** release greater 0.7.0-rc.0 ([37b119c](https://github.com/equaltoai/greater-components/commit/37b119c26adace6f7935828d75a1438f3477ecb0))
- **premain:** release greater 0.7.0-rc.0 ([cd4e858](https://github.com/equaltoai/greater-components/commit/cd4e858745dedff05d24a260ea2b22c3c28e6269))
- **release:** prepare metadata ([3c544ef](https://github.com/equaltoai/greater-components/commit/3c544efada421686274b915fcff50fa498abb705))
- **release:** prepare metadata ([0f790d7](https://github.com/equaltoai/greater-components/commit/0f790d7437873ec8580d93445f831b61494ba3e1))

## [0.7.0-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.6.2-rc.0...greater-v0.7.0-rc.0) (2026-03-29)

### Features

- **adapters:** add lesser-host soul client utilities ([9e80a9b](https://github.com/equaltoai/greater-components/commit/9e80a9bee5150d0fc166ef5d514f567338910b19))
- **adapters:** sync lesser contract updates ([71fd0c1](https://github.com/equaltoai/greater-components/commit/71fd0c1e64f8925537ae51f2682a09f6ceec3a99))
- **adapters:** sync lesser contract updates ([76fa189](https://github.com/equaltoai/greater-components/commit/76fa1895a3b557f192486e12321dda05254da735))
- **adapters:** sync lesser graphql v1.1.28 ([9c15385](https://github.com/equaltoai/greater-components/commit/9c153850d123a7f892b5f997c97158ff04225bb1))
- **adapters:** sync lesser graphql v1.1.28 ([723e5f8](https://github.com/equaltoai/greater-components/commit/723e5f87ec7336c5b1e5945719c948d45f537316))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([a043b15](https://github.com/equaltoai/greater-components/commit/a043b15f594bfcef1f46b807d8676f746b84f078))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([812335b](https://github.com/equaltoai/greater-components/commit/812335b117e5e3cfa59a380fb8e92bcf37f65995))
- **adapters:** sync lesser v1.1.27 soul inventory ([c3f4be0](https://github.com/equaltoai/greater-components/commit/c3f4be09f905483e8732866a11e7f1061cdb6556))
- **adapters:** sync lesser v1.1.27 soul inventory ([c02324b](https://github.com/equaltoai/greater-components/commit/c02324b1c540551a3965cdc7390dc8ec48991f9c))
- **adapters:** sync lesser v1.1.29 ([b5ef6a2](https://github.com/equaltoai/greater-components/commit/b5ef6a2fcda43a74ec0ccbd7b665b4add8a0a3d0))
- **adapters:** sync lesser v1.1.29 ([eb512c7](https://github.com/equaltoai/greater-components/commit/eb512c7fc9dc970368a8b0c2848deecaf90f2f46))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([915021e](https://github.com/equaltoai/greater-components/commit/915021e5bf5f5aaedc45c93244d17b5b43f3af3a))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([6d9bd15](https://github.com/equaltoai/greater-components/commit/6d9bd153c28de85e72a782606fa0794e79a696e5))
- **adapters:** sync lesser-host v0.1.7 ([ebc93eb](https://github.com/equaltoai/greater-components/commit/ebc93eb598161e24c57f8e87dd11e5e517326cc6))
- **adapters:** sync lesser-host v0.1.7 and bump dependencies ([5e3b614](https://github.com/equaltoai/greater-components/commit/5e3b61462f98d02eed06862744458a56ccc6931c))
- add agent face demo adoption path ([93aec51](https://github.com/equaltoai/greater-components/commit/93aec514138bdf142d9b0b6c655996b1205f9b45))
- add async workflow messaging surfaces ([d9ce302](https://github.com/equaltoai/greater-components/commit/d9ce3027c2d4c80b1d933b4c85a08c8d8fb3b9f4))
- add FaceTheory example and smoke coverage ([8bd2318](https://github.com/equaltoai/greater-components/commit/8bd2318c3703e4ea363c9ab493a8eb484618b64b))
- add host-provided face navigation contracts ([a772933](https://github.com/equaltoai/greater-components/commit/a772933004f2cff4276b1b1102d18f0687fc57c2))
- Add initial system configuration and logging setup under the new .theory directory. ([7320f65](https://github.com/equaltoai/greater-components/commit/7320f65c6d4e011df71d599b624d22cca5d9c151))
- add reusable shared agent workflow surfaces ([81e05b7](https://github.com/equaltoai/greater-components/commit/81e05b71095f177d5036de7c19e85c4729a9b408))
- add shared agent workflow packages ([e3ca5a6](https://github.com/equaltoai/greater-components/commit/e3ca5a6a73d9c3b7c3627351149ad1157ac2000b))
- add SSR theme bootstrap helpers ([c1894be](https://github.com/equaltoai/greater-components/commit/c1894be95f05da97ecee62bbbfa1d6902942fa6d))
- add workflow lifecycle notifications ([a1832e2](https://github.com/equaltoai/greater-components/commit/a1832e2f19ef41645e56e9512d5f51b0dfbd666b))
- add workflow moments to shared chat ([35d3564](https://github.com/equaltoai/greater-components/commit/35d35648e85e5bfbaa9de1b116284cae50b9d279))
- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))
- **cli:** add doctor --csp and strict CSP docs ([1cfdd12](https://github.com/equaltoai/greater-components/commit/1cfdd12300e4862b414cd563d3116775ef4d3b84))
- compose agent profile and continuity surfaces ([3d978c8](https://github.com/equaltoai/greater-components/commit/3d978c83bf6314622cd6dfcd08cc648f8fd7e7f2))
- compose agent signing and declaration surfaces ([0e6675a](https://github.com/equaltoai/greater-components/commit/0e6675acb82b071bc296521b62d783fb7e9156e2))
- compose agent workflow inbox surfaces ([f90f246](https://github.com/equaltoai/greater-components/commit/f90f24663f36439fcbeff3cae05d90e24c09a4d5))
- freeze agent workflow package boundaries ([#387](https://github.com/equaltoai/greater-components/issues/387)) ([b308466](https://github.com/equaltoai/greater-components/commit/b308466083cf418e31631dddf2a13e431a24fd4e))
- freeze reusable agent workflow contracts ([#388](https://github.com/equaltoai/greater-components/issues/388)) ([6f4f980](https://github.com/equaltoai/greater-components/commit/6f4f980f30fed90af50b39bef172ad1b1e97d682))
- harden FaceTheory host boundaries and add smoke coverage ([7f506ad](https://github.com/equaltoai/greater-components/commit/7f506ad2479f0f699c82da3809c561fe8505b70d))
- map agent stitch anchors to reusable surfaces ([#389](https://github.com/equaltoai/greater-components/issues/389)) ([2fe69a5](https://github.com/equaltoai/greater-components/commit/2fe69a5428db34ba1a2efa76471545e625f82006))
- **messaging:** allow background refresh ([fba11d5](https://github.com/equaltoai/greater-components/commit/fba11d5208add59c540dbca992afed1fc1989c06))
- **messaging:** delete-for-me (M4) ([f5c1501](https://github.com/equaltoai/greater-components/commit/f5c15016935c9e2cf9b667384f0242b79ee5cefb))
- **messaging:** inbox/requests dm handlers ([d579ac8](https://github.com/equaltoai/greater-components/commit/d579ac86822e043299f96e5bec81cbb2c7dc7be1))
- **messaging:** realtime updates (M5) ([d28af50](https://github.com/equaltoai/greater-components/commit/d28af5054e43b82ab7309e91505037b294f80f6b))
- **notifications:** render communication notifications ([4b645f8](https://github.com/equaltoai/greater-components/commit/4b645f8217c21bd4a1ecdb5583917867331e4491))
- **notifications:** support communication payloads ([1b1f5a1](https://github.com/equaltoai/greater-components/commit/1b1f5a1575e3a8c0c437587658d70a706764f7c3))
- **prefs:** expose dm delivery setting ([b7d7fee](https://github.com/equaltoai/greater-components/commit/b7d7feecd4953b441cb17414d0c863e6fd7026a8))
- refresh lesser v1.2.0 and lesser-host v0.2.0 contracts ([63ce0b9](https://github.com/equaltoai/greater-components/commit/63ce0b9d8c92a4beaab998ca037881a07517b112))
- refresh lesser v1.2.0 contracts ([baa2c68](https://github.com/equaltoai/greater-components/commit/baa2c68a0840f30fbe8403d23b96de64bcdf42ba))
- scaffold canonical agent face exports ([89a9c63](https://github.com/equaltoai/greater-components/commit/89a9c6350fc0eb06e42511ccc0562639b2343180))
- **social:** add Unicode fallback to CustomEmojiPicker ([43ff72f](https://github.com/equaltoai/greater-components/commit/43ff72f9d7bd3f8b8e70e40df4712d30ceb22f62))
- **soul:** add channels and preferences UI components ([1bd005b](https://github.com/equaltoai/greater-components/commit/1bd005b88ed663acd7c46437d30c0602aecc5cb3))

### Bug Fixes

- **adapters:** default empty conversations results ([32500ad](https://github.com/equaltoai/greater-components/commit/32500ad2e1e1055ad8418bf02daf8a88e2d1386e)), closes [#210](https://github.com/equaltoai/greater-components/issues/210)
- **adapters:** guard conversation participant id ([0c9db51](https://github.com/equaltoai/greater-components/commit/0c9db51e2387396487d9bfbf04cc0e292fe63e7e))
- **adapters:** handle empty GraphQL query results ([58c7bfe](https://github.com/equaltoai/greater-components/commit/58c7bfece1a56eb97bab549f6c206000525d60bf))
- **adapters:** pin Lesser v1.1.11 + suppress empty conversations error ([f4b21c0](https://github.com/equaltoai/greater-components/commit/f4b21c0049b10af8b5a605e4b7648b9a59579989))
- **adapters:** satisfy lint and registry validation ([d5cd018](https://github.com/equaltoai/greater-components/commit/d5cd018efe73814042d0ef617695dc9ce78ef2fa))
- **adapters:** trim baseUrl without regex ([f3cbe99](https://github.com/equaltoai/greater-components/commit/f3cbe9900a7f3fac06f569fdd167236c01f09683))
- address chat and agent installer regressions ([4a59b4d](https://github.com/equaltoai/greater-components/commit/4a59b4ddfe3662c3a6e89283d445300021471ac3))
- **admin:** use valid Button variant ([638824f](https://github.com/equaltoai/greater-components/commit/638824ff110a150621058572f7ad09e2d94523f3))
- align shared chat with primitive props ([f2bbd4e](https://github.com/equaltoai/greater-components/commit/f2bbd4eb98f9ece3f08250cc6d27a554c96ee430))
- **ci:** pass lint workflow ([d6a1c96](https://github.com/equaltoai/greater-components/commit/d6a1c96df1dfb813a5d9a2b6803ed7e5a7505c4b))
- **ci:** skip a11y comments on fork PRs ([8d44561](https://github.com/equaltoai/greater-components/commit/8d445617cf6308c70e0202c0d2c80a116722a950))
- **ci:** skip coverage comments on fork PRs ([e3f7fee](https://github.com/equaltoai/greater-components/commit/e3f7fee538a6794baa36067ed732b4aa437b82cc))
- **cli:** include admin Agents files in vendored installs ([68c8541](https://github.com/equaltoai/greater-components/commit/68c8541aec282ef3a17add072ee46fc55ba114e3))
- **cli:** update full core package file sets ([0757d28](https://github.com/equaltoai/greater-components/commit/0757d28759e7dd99af091c6b59d8460fc2a49bd9))
- **cli:** update full core package file sets ([16df66b](https://github.com/equaltoai/greater-components/commit/16df66b8d9cebcf2113b997a748551b63f97ccea))
- commit generated primitives declarations ([320f89c](https://github.com/equaltoai/greater-components/commit/320f89c1bdafea370be8f66950b16e27ace92015))
- complete workflow registry and grouping coverage ([4595d34](https://github.com/equaltoai/greater-components/commit/4595d342ad91492be88552d41dec53c5d95a48a3))
- **csp:** make primitives transitions WAAPI-based ([703b1bd](https://github.com/equaltoai/greater-components/commit/703b1bda9aafd3d5b9939c8c6af160725fae502a))
- **csp:** remove inline style writes from utils ([79bb770](https://github.com/equaltoai/greater-components/commit/79bb770ec53125f283e9f2310d4012d174a764df))
- **csp:** remove runtime inline-style writes from primitives ([b4e8a3d](https://github.com/equaltoai/greater-components/commit/b4e8a3dcf541bc3e0862692c864cd254a6aa831f))
- **csp:** remove runtime style injection from artist face ([c62a4d9](https://github.com/equaltoai/greater-components/commit/c62a4d979e74d3d9292bc1b8c89d71f8c4b92dfe))
- **csp:** remove runtime style writes from headless ([9858a2b](https://github.com/equaltoai/greater-components/commit/9858a2bc563480b9f2eb54be7a7d1fd2776c9971))
- **csp:** replace textarea autosize with CSS-driven helper ([c845b6a](https://github.com/equaltoai/greater-components/commit/c845b6a205af850efd3a9e9fca8746742ae56110))
- **csp:** strict CSP issue sweep ([#180](https://github.com/equaltoai/greater-components/issues/180), [#187](https://github.com/equaltoai/greater-components/issues/187)–[#195](https://github.com/equaltoai/greater-components/issues/195)) ([241aeab](https://github.com/equaltoai/greater-components/commit/241aeabfc01754668dad1a2fca5aa54492bcf9e5))
- **deps:** align undici override with lockfile ([5c2ae6b](https://github.com/equaltoai/greater-components/commit/5c2ae6b2fadd3f7bbe806c3630746176e7e1f976))
- **deps:** patch flatted vulnerability ([9b20492](https://github.com/equaltoai/greater-components/commit/9b20492b3620bd5c93f6f2c56b731b0bc9168bfe))
- **docs:** remove stale svelte config suppression ([35ede19](https://github.com/equaltoai/greater-components/commit/35ede19557a92eb8be1b89b8e5b0e35e4bde750c))
- exclude umbrella package from registry deps ([63cea06](https://github.com/equaltoai/greater-components/commit/63cea063558d3df416c4881c76b8ccc1023ef46d))
- exclude umbrella package from registry deps ([63c6b6a](https://github.com/equaltoai/greater-components/commit/63c6b6acc87e314478898db9f760dc40161c0ae6))
- flatten lib alias install targets ([4e94ea2](https://github.com/equaltoai/greater-components/commit/4e94ea2b96139c5fffd18fb02350792dadcab870))
- harden facetheory example contract coverage ([08f5558](https://github.com/equaltoai/greater-components/commit/08f55583b318fdec82fe9af89ca0fb9e22050b57))
- harden SSR-safe face render paths ([eecad59](https://github.com/equaltoai/greater-components/commit/eecad593fe54166775217745005025fdaeb108d0))
- harden vendored face export transforms ([6557b2c](https://github.com/equaltoai/greater-components/commit/6557b2c5f09e27796199d7f522859c5783ca54b8))
- harden vendored face export transforms ([2d21a8d](https://github.com/equaltoai/greater-components/commit/2d21a8d5a8ae324004f73e79b0cdaa85fe10eb82))
- **notifications:** add utils dependency ([3400e55](https://github.com/equaltoai/greater-components/commit/3400e553cde5bae810037bdcca9600f68c58af83))
- **playground:** bind search context ([ac0aa64](https://github.com/equaltoai/greater-components/commit/ac0aa64c912d8bb0f92c87ee3253282a3e755ea9))
- **playground:** prevent icon gallery crash ([5086560](https://github.com/equaltoai/greater-components/commit/5086560fd147546b7079fd5d0d394978a66a7ffa))
- preserve agent face and workflow contracts ([493e996](https://github.com/equaltoai/greater-components/commit/493e996a4926ee9547cdcd44acddba6be509d4f0))
- preserve binary assets during greater update ([78ed152](https://github.com/equaltoai/greater-components/commit/78ed152055f599877f4ffdeb2f831045b859bb2e))
- preserve binary assets during update ([9f8c075](https://github.com/equaltoai/greater-components/commit/9f8c07560d2b4ee8316a0938bf76087dfa85f8ff))
- preserve high-contrast preference overrides ([0b135e9](https://github.com/equaltoai/greater-components/commit/0b135e9e40609be25a3d77d62c41a5bbacd46f05))
- refresh registry checksums ([fea5ea9](https://github.com/equaltoai/greater-components/commit/fea5ea9b78ad63005421e03a1a2a13d6fea728bd))
- refresh registry checksums for agent workflow ([363e374](https://github.com/equaltoai/greater-components/commit/363e374f702187322c22a3de3fe9b7ce2af9efed))
- refresh workspace lockfile for agent packages ([967943f](https://github.com/equaltoai/greater-components/commit/967943fb2f588a5566cf267a2618e7d8cd8af193))
- **registry:** align staging release metadata ([8bfc673](https://github.com/equaltoai/greater-components/commit/8bfc6735580edb8b90efbe89d8e9f2d22e6bc41f))
- **registry:** refresh checksums after warning cleanup ([76250a5](https://github.com/equaltoai/greater-components/commit/76250a5e8fcd8af84afe63a9c7b69fe0f68192b5))
- **registry:** regenerate index ([43978b6](https://github.com/equaltoai/greater-components/commit/43978b6d293e385c040a96274f19302dbcb1c93d))
- **registry:** regenerate index ([17142da](https://github.com/equaltoai/greater-components/commit/17142da9d2b3f847cb9b856afd7d2fcb46ba246d))
- resolve agent face registry collisions ([d8fdbd6](https://github.com/equaltoai/greater-components/commit/d8fdbd67f76548d4f5b0770086ff15979658b730))
- restore vendored add paths for social and agent flows ([83d3fc2](https://github.com/equaltoai/greater-components/commit/83d3fc213e8cdcfb505809cbf29240e28cb119b4))
- satisfy CI registry and formatting checks ([9ac1526](https://github.com/equaltoai/greater-components/commit/9ac152617db037b5fba9a191d1d9159c3e783849))
- **security:** harden HTML rendering and path handling ([d6f3bc9](https://github.com/equaltoai/greater-components/commit/d6f3bc94f52e9ffa778ce2a349110abc198723fa))
- **security:** harden HTML rendering and path handling ([f871ece](https://github.com/equaltoai/greater-components/commit/f871ece4e14464ee60d0ff1aa0315fa8c7ae826e))
- **social:** remove global BackupCodes theme styles ([8c9405a](https://github.com/equaltoai/greater-components/commit/8c9405adbf6bbf45941df99255b6d3c5264e4964))
- **soul:** satisfy strict svelte-check ([0603c37](https://github.com/equaltoai/greater-components/commit/0603c377420e7b28e5467b286876af2c4fc63be0))
- stabilize agent face ci build ([1ab307e](https://github.com/equaltoai/greater-components/commit/1ab307e4324c79fe3be7d47a41ea847744d63256))
- **staging:** patch flatted vulnerability ([c0d6109](https://github.com/equaltoai/greater-components/commit/c0d6109afd70b3b76ae36457b8e5c3c587a99b9f))
- tighten agent workflow contracts and notification grouping ([45e773c](https://github.com/equaltoai/greater-components/commit/45e773c6285741a716fb13a2e270e9fbfe68a5e3))
- unblock agent face ci validation ([232eb7d](https://github.com/equaltoai/greater-components/commit/232eb7d443ed11eb15e96b27b46fcb0fd634b272))
- use workflow titles in grouped notifications ([d9a5043](https://github.com/equaltoai/greater-components/commit/d9a50433a23f78b3f8c3db5dbbc65c9b8f49d801))
- vendor full face package files ([0628d5c](https://github.com/equaltoai/greater-components/commit/0628d5c368704563e5eaaf6bfc05f60e9ae5214f))

### Refactors

- split browser presence tracking from store core ([e3fb9c3](https://github.com/equaltoai/greater-components/commit/e3fb9c34d6a3099e08fd1a7ef2701591399bafb0))

### Docs

- add issue sweep plan for open issues ([7e9c169](https://github.com/equaltoai/greater-components/commit/7e9c169b7d4199341cbf20c07955acd0c0d77d71))
- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))
- document agent face adoption patterns ([d5a3887](https://github.com/equaltoai/greater-components/commit/d5a388771963deadb480092928cd59610654d6f4))
- publish Simulacrum agent migration checklist ([8b40d4e](https://github.com/equaltoai/greater-components/commit/8b40d4e8d8602f5716d27554639e6aa8617ec216))

### CI

- **deps:** bump artifact actions ([6bcd038](https://github.com/equaltoai/greater-components/commit/6bcd03801a04a4af9e613094907a7a90dfcbadeb))
- **deps:** bump pnpm/action-setup from 4 to 5 ([6051090](https://github.com/equaltoai/greater-components/commit/6051090056a24ea42c5a941beb07cdbe0c5b406b))
- **prerelease:** ignore stable manifest changes ([f087528](https://github.com/equaltoai/greater-components/commit/f087528bb68ef9aba9cf184739e861470cd26d57))

### Tests

- add agent face smoke coverage ([03de544](https://github.com/equaltoai/greater-components/commit/03de544f4f4011e5ce1d6b40bfcec1623841a588))
- align add command mocks with resolver keys ([9f113ac](https://github.com/equaltoai/greater-components/commit/9f113ac823f3ee852095eb95a4f7c0c63bfa0ed1))
- fix wrappers and headless mocks ([14b624b](https://github.com/equaltoai/greater-components/commit/14b624b841691941bde23100a5edc1e8311a6dca))

### Chores

- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([7b8c0d6](https://github.com/equaltoai/greater-components/commit/7b8c0d633e9e76e79a0943e6c6c721eb5c435b2c))
- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([d4fd4e3](https://github.com/equaltoai/greater-components/commit/d4fd4e39d6518025996bc0e72142ece720c73e1a))
- backmerge main into premain ([4925504](https://github.com/equaltoai/greater-components/commit/492550499fa69c84e8e0c421cb0ac53b971a8920))
- backmerge main into premain ([8e71eb1](https://github.com/equaltoai/greater-components/commit/8e71eb1b3a1fd4c12d7f8a76ff4286d5519b83bb))
- backmerge main into premain ([e611522](https://github.com/equaltoai/greater-components/commit/e611522b33c4ffa43be5c81d3d19aaa773579515))
- backmerge main into premain ([9a56db0](https://github.com/equaltoai/greater-components/commit/9a56db0365c6d4b53dc6e0746db9018a49a956d0))
- backmerge main into premain ([ae103e6](https://github.com/equaltoai/greater-components/commit/ae103e689a6246cdb5a54f229e16bc739430114a))
- backmerge main into premain ([04e265f](https://github.com/equaltoai/greater-components/commit/04e265f44442dfea7841b9b3607b3e64be9c7594))
- backmerge main into premain ([fdf8266](https://github.com/equaltoai/greater-components/commit/fdf8266bc275606183afc684dd7d1fc2d6bb1378))
- backmerge main into premain ([31cc7aa](https://github.com/equaltoai/greater-components/commit/31cc7aab4c70967a93743e47c6b2b12b55b65136))
- backmerge main into staging ([bcb6e55](https://github.com/equaltoai/greater-components/commit/bcb6e554ec6953131a859c3fb767a517ed874275))
- backmerge main into staging ([eacd418](https://github.com/equaltoai/greater-components/commit/eacd41859475c6fac063b40e4b7fcef4fbcbc2ac))
- backmerge premain into staging ([57ea8c1](https://github.com/equaltoai/greater-components/commit/57ea8c1093630d3d3c4104257cc29a8feead8fca))
- backmerge premain into staging ([01e2942](https://github.com/equaltoai/greater-components/commit/01e2942c35c362e7d38923f359f3d7feb65612ca))
- backmerge premain into staging ([9cfb655](https://github.com/equaltoai/greater-components/commit/9cfb655745de8345691bd2302881410adbe1cb56))
- backmerge premain into staging ([abd6805](https://github.com/equaltoai/greater-components/commit/abd6805136bdfbbc01208f859e6cd982f58d9d3e))
- backmerge premain into staging ([b7fe9fb](https://github.com/equaltoai/greater-components/commit/b7fe9fb091b54202b764ffba693478f24e7adad4))
- backmerge premain into staging ([b52676d](https://github.com/equaltoai/greater-components/commit/b52676d60fefa9a6f1b027684dac079929285a2d))
- backmerge premain into staging ([ee5d81c](https://github.com/equaltoai/greater-components/commit/ee5d81ce4a17202df4a1b773eb8bb6ca272c633d))
- backmerge premain into staging ([ff92e4c](https://github.com/equaltoai/greater-components/commit/ff92e4cbf8426191120b36b21583493ba340200b))
- backmerge premain into staging ([7f259f7](https://github.com/equaltoai/greater-components/commit/7f259f7aa6852ee3ebb54a4a7629c879a611c258))
- bump facetheory to v0.3.1 ([cbf9e6e](https://github.com/equaltoai/greater-components/commit/cbf9e6ece0d961f6d151135a8b14005678bfa9dc))
- bump svelte to 5.53.0 ([9d6a300](https://github.com/equaltoai/greater-components/commit/9d6a300f6032dd345b581240348eb947667664bf))
- bump svelte to 5.53.0 ([acc3ce0](https://github.com/equaltoai/greater-components/commit/acc3ce071df62d17a6d5ba615369e192bdff53e0))
- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **contracts:** bump lesser to v1.1.24 ([81a9829](https://github.com/equaltoai/greater-components/commit/81a98290895b06e9ace85e12454ab4aa1550d57d))
- **contracts:** bump lesser to v1.1.24 ([9c1f3ab](https://github.com/equaltoai/greater-components/commit/9c1f3ab54c263760d32e47fbbbc41ca0a323d8cd))
- **csp:** extend validate:csp for runtime strict CSP ([a8139a5](https://github.com/equaltoai/greater-components/commit/a8139a571164ba9b7e590f79c343585d8afc27de))
- **deps-dev:** bump svelte from 5.54.0 to 5.54.1 in the svelte group ([3e3f57d](https://github.com/equaltoai/greater-components/commit/3e3f57d293192fdfbf50e1614859575f16b2e583))
- **deps-dev:** bump vite from 8.0.1 to 8.0.2 in the dependencies group across 1 directory ([f834fb8](https://github.com/equaltoai/greater-components/commit/f834fb8641cf5360007fc426d486bd4560690a9e))
- **deps-dev:** bump vite in the dependencies group across 1 directory ([6b56481](https://github.com/equaltoai/greater-components/commit/6b56481768ec4b2bf8ee16ccc146a1f0219e2bf2))
- **deps:** bump devalue to 5.6.4 ([da6279a](https://github.com/equaltoai/greater-components/commit/da6279a3850392a79bdb9a9687813b0b45801e79))
- **deps:** bump graphql-codegen ([d2490c5](https://github.com/equaltoai/greater-components/commit/d2490c5890f00641783c1c8637e6cb64237e7da0))
- **deps:** bump the dependencies group with 5 updates ([9482ccd](https://github.com/equaltoai/greater-components/commit/9482ccdddc681dc2a94e1247068a79fb753ee7db))
- **deps:** bump the dependencies group with 7 updates ([3bec0f0](https://github.com/equaltoai/greater-components/commit/3bec0f0441c95ec26b193a7e12b5c3dccf3a8611))
- **deps:** patch audited vulnerabilities ([c9902e6](https://github.com/equaltoai/greater-components/commit/c9902e6d560a76f27e5a6d67da765b8b264b06f1))
- **deps:** patch undici and flatted ([b8b6043](https://github.com/equaltoai/greater-components/commit/b8b6043f068f268d0d987bb477e25d91d3772ab1))
- **deps:** patch undici and flatted ([da8a266](https://github.com/equaltoai/greater-components/commit/da8a266130baa45cea4ac243f27552623a47091b))
- **deps:** update workspace dependencies ([5e15fbc](https://github.com/equaltoai/greater-components/commit/5e15fbc3223cf96ef26d305506f705132fc1488d))
- **deps:** update workspace dependencies ([2391851](https://github.com/equaltoai/greater-components/commit/23918518bb23851a7e06761817c2f19b57fccff0))
- finalize shared agent workflow surfaces ([6b63208](https://github.com/equaltoai/greater-components/commit/6b6320810ab6cf08bae011a56cc2aac793bb18bb))
- fix CI validation ([f8c2958](https://github.com/equaltoai/greater-components/commit/f8c2958546c380839f30f3a1c4faed244a05dd0e))
- format + regenerate registry ([ad0abd4](https://github.com/equaltoai/greater-components/commit/ad0abd42f5ee47f4ca35290f41de2940eee17acb))
- format adapter tests ([28d6a71](https://github.com/equaltoai/greater-components/commit/28d6a71874a4ca808fb017397c705606aa18ee1f))
- format and regenerate registry ([148f214](https://github.com/equaltoai/greater-components/commit/148f214da81663a646ebc2615791de1988318dce))
- format lesser-host contract snapshots ([27876f4](https://github.com/equaltoai/greater-components/commit/27876f4094c524adb35d584f99a8626c668d479f))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- ignore repo-local codex workspace ([585398a](https://github.com/equaltoai/greater-components/commit/585398a0bc976b57658498877d1934b12ae85195))
- **lesser:** pin contracts to 9f072443 ([2ef3e4b](https://github.com/equaltoai/greater-components/commit/2ef3e4bfa65d1f9d5839552ebdaf79eba5e25b0e))
- **lesser:** pin contracts to v1.1.10 ([c0d8fc2](https://github.com/equaltoai/greater-components/commit/c0d8fc20e1e0756832772e478c93520c38b3a228))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** promote premain adapter sync ([af34ff6](https://github.com/equaltoai/greater-components/commit/af34ff6474c6ca70e1b1b9dc48d3f5185377a5b6))
- **main:** promote premain adapter sync ([af369e8](https://github.com/equaltoai/greater-components/commit/af369e88a1ee5f24c7b852da93262bd24aa25891))
- **main:** release greater 0.1.10 ([667640a](https://github.com/equaltoai/greater-components/commit/667640a877db74622bede34003a86d9e600bb0dd))
- **main:** release greater 0.1.10 ([6ac2237](https://github.com/equaltoai/greater-components/commit/6ac22374d04c698932972320b3c79ab67ca76402))
- **main:** release greater 0.1.11 ([9c0ffec](https://github.com/equaltoai/greater-components/commit/9c0ffec99ff5906d9836909d1e303f2fe3df240e))
- **main:** release greater 0.1.11 ([7bac630](https://github.com/equaltoai/greater-components/commit/7bac6304929b7ce1e26cccaaa33057e77308f0f3))
- **main:** release greater 0.1.12 ([4c0a357](https://github.com/equaltoai/greater-components/commit/4c0a35779d1e5fe72cbe4bb3277d04a0cff9b72a))
- **main:** release greater 0.1.12 ([1b07132](https://github.com/equaltoai/greater-components/commit/1b071322ea489d2e37d00b4187060ad64fa98c02))
- **main:** release greater 0.1.13 ([0587386](https://github.com/equaltoai/greater-components/commit/0587386f177206f3c2c639909a2d1444b92856c9))
- **main:** release greater 0.1.13 ([c1ce3a6](https://github.com/equaltoai/greater-components/commit/c1ce3a6e4c30d584ad39d99c317783eae7fe6d59))
- **main:** release greater 0.1.14 ([df67b91](https://github.com/equaltoai/greater-components/commit/df67b911564eb3fcb13bf912302623d6d64cf90d))
- **main:** release greater 0.1.14 ([505dffe](https://github.com/equaltoai/greater-components/commit/505dffe6186e189cada19d7ad90502e00ecde878))
- **main:** release greater 0.1.15 ([fee7e6c](https://github.com/equaltoai/greater-components/commit/fee7e6cd9fcb907072fd304dcc0f6c88a640faf6))
- **main:** release greater 0.1.15 ([eea6ed8](https://github.com/equaltoai/greater-components/commit/eea6ed8915bb01ee5c15130cabb1755a981211b5))
- **main:** release greater 0.1.16 ([a79f2e0](https://github.com/equaltoai/greater-components/commit/a79f2e077f36c16f53eae22f9dee4111f1d59dc1))
- **main:** release greater 0.1.16 ([e43b3d4](https://github.com/equaltoai/greater-components/commit/e43b3d42b5f885799190a7ede01c5c45e2bd6628))
- **main:** release greater 0.1.17 ([7d18a8b](https://github.com/equaltoai/greater-components/commit/7d18a8b734bc583edf8e03ce0907f2d55538c07c))
- **main:** release greater 0.1.17 ([ff15bde](https://github.com/equaltoai/greater-components/commit/ff15bdeb7ecd509ab4e2922898e53186df685270))
- **main:** release greater 0.1.18 ([4e28b93](https://github.com/equaltoai/greater-components/commit/4e28b93bc7320d3d39bd845c259d26047d96eeec))
- **main:** release greater 0.1.18 ([f7c79da](https://github.com/equaltoai/greater-components/commit/f7c79da4b043b772c860ea0d41566b2b90d349b0))
- **main:** release greater 0.1.7 ([c1970f1](https://github.com/equaltoai/greater-components/commit/c1970f1f7d51d69b1d924be718765c52b2c75d75))
- **main:** release greater 0.1.7 ([8182b0e](https://github.com/equaltoai/greater-components/commit/8182b0e056d49bf6b69fb8a50541cc36e5ea9539))
- **main:** release greater 0.1.8 ([1789f15](https://github.com/equaltoai/greater-components/commit/1789f15695b105e80aec7fadc2513893fdfcdcd6))
- **main:** release greater 0.1.8 ([e24b167](https://github.com/equaltoai/greater-components/commit/e24b167cf469079936cd1808a197184a78288029))
- **main:** release greater 0.1.9 ([c697281](https://github.com/equaltoai/greater-components/commit/c6972811cb190941800ca06992d8eba1ba76466c))
- **main:** release greater 0.1.9 ([b295a9f](https://github.com/equaltoai/greater-components/commit/b295a9f802c7b88debf3d8de84cffedcbb16ec43))
- **main:** release greater 0.2.0 ([8a548a0](https://github.com/equaltoai/greater-components/commit/8a548a0bb659cbccb38d1ace1d946cf027ecda02))
- **main:** release greater 0.2.0 ([b12c808](https://github.com/equaltoai/greater-components/commit/b12c808a15c14eeaf772fea0459433750b3f60b7))
- **main:** release greater 0.3.0 ([5fd2740](https://github.com/equaltoai/greater-components/commit/5fd27404174e90b28de231540e84be400940edbe))
- **main:** release greater 0.3.0 ([7531f13](https://github.com/equaltoai/greater-components/commit/7531f1368f65afc827cbef7a258c63c73837d827))
- **main:** release greater 0.4.0 ([9034252](https://github.com/equaltoai/greater-components/commit/90342525e3857bf6f9ee0a706431b3b0c044cbe1))
- **main:** release greater 0.4.0 ([dbf06f1](https://github.com/equaltoai/greater-components/commit/dbf06f16383806b20dada2a9b1bb35b6827d6bad))
- **main:** release greater 0.4.1 ([a8c7da6](https://github.com/equaltoai/greater-components/commit/a8c7da649cd324bb83ee7260550c472be4b37a99))
- **main:** release greater 0.4.1 ([526225d](https://github.com/equaltoai/greater-components/commit/526225d60f3d838f4b9fd381f6063fa9c38d0768))
- **main:** release greater 0.4.2 ([2a41018](https://github.com/equaltoai/greater-components/commit/2a41018a1fc0cf130510f1b8a5dfcdcd562e23f0))
- **main:** release greater 0.4.2 ([dbf2696](https://github.com/equaltoai/greater-components/commit/dbf26965d62b31ff8a6d213aee54d3499732491b))
- **main:** release greater 0.4.3 ([679a643](https://github.com/equaltoai/greater-components/commit/679a643bccf77265da4f68514ba9448d659783dc))
- **main:** release greater 0.4.3 ([38413b7](https://github.com/equaltoai/greater-components/commit/38413b7544c60b6d9bc23c00fa028ea9be3f1dfd))
- **main:** release greater 0.4.4 ([86ced6d](https://github.com/equaltoai/greater-components/commit/86ced6d92fedd1ca4b157ee9a586319b0c39c1cb))
- **main:** release greater 0.4.4 ([60f038f](https://github.com/equaltoai/greater-components/commit/60f038f25faef38213c6958cd7ca0826c82736ba))
- **main:** release greater 0.5.0 ([74a23c4](https://github.com/equaltoai/greater-components/commit/74a23c4783ede4c2a784b26a6edd18f33e710318))
- **main:** release greater 0.5.0 ([0e2f6d4](https://github.com/equaltoai/greater-components/commit/0e2f6d4c8a268afddc9f67b6ae3ff1d29133b2dd))
- **main:** release greater 0.5.1 ([da9bcac](https://github.com/equaltoai/greater-components/commit/da9bcac9822716871cbd42f8150692874b8891f6))
- **main:** release greater 0.5.1 ([cfd8517](https://github.com/equaltoai/greater-components/commit/cfd851789d17847ae3d2a0eb04d71684b21fafe0))
- **main:** release greater 0.5.2 ([c8c2c51](https://github.com/equaltoai/greater-components/commit/c8c2c512d568659d9592a904abce812f552aa5ba))
- **main:** release greater 0.5.2 ([79ee5ab](https://github.com/equaltoai/greater-components/commit/79ee5abbaa0fcd69b4641a3b2927993f4919b8c5))
- **main:** release greater 0.5.3 ([e7f76c5](https://github.com/equaltoai/greater-components/commit/e7f76c5a7e61e8577ab140b9164edcbbf56b99a9))
- **main:** release greater 0.5.3 ([8708a78](https://github.com/equaltoai/greater-components/commit/8708a78631f6dfc425ea5a0f02b1da1c62f99ddc))
- **main:** release greater 0.5.4 ([dd71101](https://github.com/equaltoai/greater-components/commit/dd711019639341f1f90550e9f5fcd264923e1bf2))
- **main:** release greater 0.5.4 ([1138d79](https://github.com/equaltoai/greater-components/commit/1138d792ea52d59182f58e1083a746dab16b7e66))
- **main:** release greater 0.5.5 ([e141b5c](https://github.com/equaltoai/greater-components/commit/e141b5cc83256bfa5139036181564f02578d3a6d))
- **main:** release greater 0.5.5 ([a25b45a](https://github.com/equaltoai/greater-components/commit/a25b45af7af127ff8be6db6914c3106c361a3c5d))
- **main:** release greater 0.5.6 ([6d76465](https://github.com/equaltoai/greater-components/commit/6d7646585c1c53a0a5457012430462c4365e42c2))
- **main:** release greater 0.5.6 ([756ac61](https://github.com/equaltoai/greater-components/commit/756ac617916be6b684bbcb651282fc98c666312c))
- **main:** release greater 0.5.7 ([57734f6](https://github.com/equaltoai/greater-components/commit/57734f676f8c7612a56eb322799346ca0c22ba96))
- **main:** release greater 0.5.7 ([8cc42ab](https://github.com/equaltoai/greater-components/commit/8cc42abd54323e5667b0d7a8d6731d3ce48e7dcd))
- **main:** release greater 0.5.8 ([95edac2](https://github.com/equaltoai/greater-components/commit/95edac284e3e5df5dc7f89ae278386ffdfa12b55))
- **main:** release greater 0.5.8 ([8263395](https://github.com/equaltoai/greater-components/commit/82633957c991936cbb33d8d2b89dad0380499bff))
- **main:** release greater 0.6.0 ([e402979](https://github.com/equaltoai/greater-components/commit/e402979259132d49076faed18bc062538c870efd))
- **main:** release greater 0.6.0 ([74fc2d6](https://github.com/equaltoai/greater-components/commit/74fc2d675bcc673dab6564e06e7218b4ec276f5b))
- **main:** release greater 0.6.1 ([a18809f](https://github.com/equaltoai/greater-components/commit/a18809f86b319798f507a50620f3a2e5109804c6))
- **main:** release greater 0.6.1 ([54b4c42](https://github.com/equaltoai/greater-components/commit/54b4c4250ab1584e60c7ac2acf6b23b7dbbfa1d2))
- patch dependabot transitive alerts ([b87c223](https://github.com/equaltoai/greater-components/commit/b87c223dc839b862ddd1e46463f12c4285763c58))
- pin Lesser v1.1.10 + fix open issues ([a60c1e2](https://github.com/equaltoai/greater-components/commit/a60c1e204a512f7107ff36e2311d48756bb43afd))
- pin lesser v1.1.23 and lesser-host v0.1.0 contracts ([c47e701](https://github.com/equaltoai/greater-components/commit/c47e70193c0ada34aa08f2ece49b2068379b0fcc))
- **playground:** drop [@pai](https://github.com/pai) snippet ([484bfb4](https://github.com/equaltoai/greater-components/commit/484bfb4725485ec21d1336e9a2c5b6042ade83c2))
- **premain:** promote staging adapter sync ([282a959](https://github.com/equaltoai/greater-components/commit/282a95915b0cae995a46eab0926295f34dd5ed23))
- **premain:** promote staging adapter sync ([548e7a2](https://github.com/equaltoai/greater-components/commit/548e7a266f36b3202846bdf14fd80f6cb6d45823))
- **premain:** release greater 0.1.10-rc.0 ([315a795](https://github.com/equaltoai/greater-components/commit/315a7953d6b3877c768c38d65b6b20782666e0be))
- **premain:** release greater 0.1.10-rc.0 ([c01b453](https://github.com/equaltoai/greater-components/commit/c01b45380a1d832c0978fe505bb1200f491fe22c))
- **premain:** release greater 0.1.11-rc.0 ([c3dd48e](https://github.com/equaltoai/greater-components/commit/c3dd48e96f586e7cae787d6fc5d568382cd20b65))
- **premain:** release greater 0.1.11-rc.0 ([0d94f53](https://github.com/equaltoai/greater-components/commit/0d94f53bf84447a4ddc4239493c3d22b739e8bc9))
- **premain:** release greater 0.1.12-rc.0 ([bd75d6d](https://github.com/equaltoai/greater-components/commit/bd75d6d8174b0ce9ad6fe4c19adc17494bee8847))
- **premain:** release greater 0.1.12-rc.0 ([ec71322](https://github.com/equaltoai/greater-components/commit/ec71322c0efeb4194730f4b9d31f81d51b9936ca))
- **premain:** release greater 0.1.13-rc.0 ([0d1572a](https://github.com/equaltoai/greater-components/commit/0d1572a8226ee53f3c9e86284076c0b601c7fc02))
- **premain:** release greater 0.1.13-rc.0 ([69d79a3](https://github.com/equaltoai/greater-components/commit/69d79a32f47d260345192e73e62f163e41a224fa))
- **premain:** release greater 0.1.14-rc.0 ([d00b84d](https://github.com/equaltoai/greater-components/commit/d00b84d2d27c66dbc2fa2e43e6b8a181b4867696))
- **premain:** release greater 0.1.14-rc.0 ([20cd845](https://github.com/equaltoai/greater-components/commit/20cd8450daecb015bd8f7213305d5f97112614d6))
- **premain:** release greater 0.1.15-rc.0 ([13b45a1](https://github.com/equaltoai/greater-components/commit/13b45a1313a749bb77ff4afb8113fc8820ae7f09))
- **premain:** release greater 0.1.15-rc.0 ([e1c4e6a](https://github.com/equaltoai/greater-components/commit/e1c4e6a08eb12068c0f17d1b252d1ece86ed329c))
- **premain:** release greater 0.1.15-rc.1 ([a4e3c62](https://github.com/equaltoai/greater-components/commit/a4e3c629d1315f69d410db8a7377dca4ab0ffdd4))
- **premain:** release greater 0.1.15-rc.1 ([538dee2](https://github.com/equaltoai/greater-components/commit/538dee2a808f14c5e357250fd5b35db4fade5700))
- **premain:** release greater 0.1.16-rc.0 ([0fbf993](https://github.com/equaltoai/greater-components/commit/0fbf993256f120a7b632c80bece9eb918de52785))
- **premain:** release greater 0.1.16-rc.0 ([54eed32](https://github.com/equaltoai/greater-components/commit/54eed323791ee1ac483db64903a66aa841868748))
- **premain:** release greater 0.1.16-rc.0 ([0731fc4](https://github.com/equaltoai/greater-components/commit/0731fc4dae688130c4b6e4998e4f84311d75e12f))
- **premain:** release greater 0.1.16-rc.0 ([0856c42](https://github.com/equaltoai/greater-components/commit/0856c42967ce71adaf93e7e0f064573f4ba17d38))
- **premain:** release greater 0.1.17-rc.0 ([7dca1e8](https://github.com/equaltoai/greater-components/commit/7dca1e810ef99fae7b05c604590105246e3cba3c))
- **premain:** release greater 0.1.17-rc.0 ([b0a9c47](https://github.com/equaltoai/greater-components/commit/b0a9c47df11ed1191971130ffdfe6f733b8733d1))
- **premain:** release greater 0.1.18-rc.0 ([8072468](https://github.com/equaltoai/greater-components/commit/8072468a20b582b5ede83147cbd75ee75fa9426e))
- **premain:** release greater 0.1.18-rc.0 ([eca909a](https://github.com/equaltoai/greater-components/commit/eca909afefad47a48c9f17576059366966bf5a43))
- **premain:** release greater 0.1.19-rc.0 ([36f456b](https://github.com/equaltoai/greater-components/commit/36f456b77d7bb7a3bcbd628292f5a95e463fa939))
- **premain:** release greater 0.1.19-rc.0 ([b1a0e7f](https://github.com/equaltoai/greater-components/commit/b1a0e7fb64e7fc4c31b885193dffba7ea87251d0))
- **premain:** release greater 0.1.7-rc.0 ([28fe63e](https://github.com/equaltoai/greater-components/commit/28fe63e368431d6e202ad2ff2a59c31408233ba4))
- **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
- **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
- **premain:** release greater 0.1.9-rc.0 ([c35b372](https://github.com/equaltoai/greater-components/commit/c35b372afa15e9ffc58c6e74a2cf9c04e8337ae6))
- **premain:** release greater 0.1.9-rc.0 ([07321c3](https://github.com/equaltoai/greater-components/commit/07321c3f4c3dd6d959fc11008107a8bdb4977ba9))
- **premain:** release greater 0.2.1-rc.0 ([fe728a3](https://github.com/equaltoai/greater-components/commit/fe728a315608dc30b3ab6a31bd086cc104cfc64b))
- **premain:** release greater 0.2.1-rc.0 ([348dcb7](https://github.com/equaltoai/greater-components/commit/348dcb774eb882275bb899f2586a24fba07c652e))
- **premain:** release greater 0.3.1-rc.0 ([a97cd2d](https://github.com/equaltoai/greater-components/commit/a97cd2d678ff1b65b720cd39b40979749e5261e2))
- **premain:** release greater 0.3.1-rc.0 ([7454aa1](https://github.com/equaltoai/greater-components/commit/7454aa107dfb1716b70b23599683dff1ae48574d))
- **premain:** release greater 0.4.1-rc.0 ([c0f50c0](https://github.com/equaltoai/greater-components/commit/c0f50c0c54a053085497f127299116c0344e75ea))
- **premain:** release greater 0.4.1-rc.0 ([63f8285](https://github.com/equaltoai/greater-components/commit/63f828590b8632e68d63dea774182b90970fcc32))
- **premain:** release greater 0.4.2-rc.0 ([627ba90](https://github.com/equaltoai/greater-components/commit/627ba90f1665cfd7bdd1cc52afed06dacc21123a))
- **premain:** release greater 0.4.2-rc.0 ([4601c8c](https://github.com/equaltoai/greater-components/commit/4601c8c434422fe330a6fa4aca651f84e1dbf2a6))
- **premain:** release greater 0.4.3-rc.0 ([80933c4](https://github.com/equaltoai/greater-components/commit/80933c47dee2178a0dbe462da6ce43511d22427c))
- **premain:** release greater 0.4.3-rc.0 ([2f911ab](https://github.com/equaltoai/greater-components/commit/2f911abc0e8516a2f2bfa3baeb4fa75265db1ab5))
- **premain:** release greater 0.4.4-rc.0 ([6e86938](https://github.com/equaltoai/greater-components/commit/6e86938e02d6cc52a7a642b8cffb664d8c01a398))
- **premain:** release greater 0.4.4-rc.0 ([55f8b66](https://github.com/equaltoai/greater-components/commit/55f8b664c3de11dae97889f59dfc7de8323a1c4c))
- **premain:** release greater 0.4.5-rc.0 ([58a5467](https://github.com/equaltoai/greater-components/commit/58a5467a37d0c2cb66709a510e8fd06423b003d9))
- **premain:** release greater 0.4.5-rc.0 ([ca99b3e](https://github.com/equaltoai/greater-components/commit/ca99b3e39f18a64135c885cbd5e2cf421ddc87be))
- **premain:** release greater 0.5.1-rc.0 ([7e9c698](https://github.com/equaltoai/greater-components/commit/7e9c6981d68f5c9d9e9950279865c80fdcb45dd6))
- **premain:** release greater 0.5.1-rc.0 ([e46916f](https://github.com/equaltoai/greater-components/commit/e46916f0e9ff7a2f92ecca11c79a8bab107ba054))
- **premain:** release greater 0.5.1-rc.1 ([802a8ef](https://github.com/equaltoai/greater-components/commit/802a8ef6a47923fb4c33b70cfbf574f2e2402dfc))
- **premain:** release greater 0.5.1-rc.1 ([a5a93d5](https://github.com/equaltoai/greater-components/commit/a5a93d5e98c42b9ccbeb6e167e1b262d58ec9c20))
- **premain:** release greater 0.5.2-rc.0 ([806f094](https://github.com/equaltoai/greater-components/commit/806f09420ca43822a32abbfb62a2a22e84815915))
- **premain:** release greater 0.5.2-rc.0 ([95554e6](https://github.com/equaltoai/greater-components/commit/95554e62d3a217041af32905a83e76aa7dab2d7d))
- **premain:** release greater 0.5.3-rc.0 ([a11219f](https://github.com/equaltoai/greater-components/commit/a11219f5772ccb8104439ae2a1ed9cd431ff403b))
- **premain:** release greater 0.5.3-rc.0 ([1ec7084](https://github.com/equaltoai/greater-components/commit/1ec7084ceae8eec7d060732232b7098277eb0e47))
- **premain:** release greater 0.5.4-rc.0 ([7501dd9](https://github.com/equaltoai/greater-components/commit/7501dd94af9c176daf9464bb35702e0c6fd511a6))
- **premain:** release greater 0.5.4-rc.0 ([f2fcc2a](https://github.com/equaltoai/greater-components/commit/f2fcc2a835ee13352382d1401e1030fbfe951c75))
- **premain:** release greater 0.5.5-rc.0 ([58c8944](https://github.com/equaltoai/greater-components/commit/58c89447bd2524aeccacdb413e9f408ab0d3f565))
- **premain:** release greater 0.5.5-rc.0 ([6a9df23](https://github.com/equaltoai/greater-components/commit/6a9df23e7ab0f780f9e372bdab561c61be6b9225))
- **premain:** release greater 0.5.6-rc.0 ([550fb61](https://github.com/equaltoai/greater-components/commit/550fb6179b3d25e4f47488e0b1987cd9386e8007))
- **premain:** release greater 0.5.6-rc.0 ([b0c5b86](https://github.com/equaltoai/greater-components/commit/b0c5b8625700b0f9b99aa62c415c51e6e2d4e701))
- **premain:** release greater 0.5.7-rc.0 ([70efc21](https://github.com/equaltoai/greater-components/commit/70efc21f94af546cd25dcf827da32cf028eaa3b6))
- **premain:** release greater 0.5.7-rc.0 ([8b37df2](https://github.com/equaltoai/greater-components/commit/8b37df2886595508d82f5204573b6d041fc6ceef))
- **premain:** release greater 0.5.8-rc.0 ([aa24900](https://github.com/equaltoai/greater-components/commit/aa24900ebc88cf1194d150d88614d605d2aa239b))
- **premain:** release greater 0.5.8-rc.0 ([20b8b3f](https://github.com/equaltoai/greater-components/commit/20b8b3f5c8afe530f7bcf8ae7d18742811886dda))
- **premain:** release greater 0.5.8-rc.1 ([a566b3c](https://github.com/equaltoai/greater-components/commit/a566b3c52c6ba090cb460b629f4140485db24193))
- **premain:** release greater 0.5.8-rc.1 ([9d4f84f](https://github.com/equaltoai/greater-components/commit/9d4f84fc5f71b33de6321b2ae26a93b2b1d4a9e0))
- **premain:** release greater 0.5.9-rc.0 ([89100a0](https://github.com/equaltoai/greater-components/commit/89100a0f3335113f9a6a52c73c690d0003a785d1))
- **premain:** release greater 0.5.9-rc.0 ([e6b6c5a](https://github.com/equaltoai/greater-components/commit/e6b6c5a2f325da9d36ada2035cb8de3d78443ab5))
- **premain:** release greater 0.6.0-rc.0 ([fb57c3d](https://github.com/equaltoai/greater-components/commit/fb57c3d0b0e067a5d733318ff7be8849b23781e4))
- **premain:** release greater 0.6.0-rc.0 ([01ccff2](https://github.com/equaltoai/greater-components/commit/01ccff20cc005d9904b9412fd09c9a00b1c48f2b))
- **premain:** release greater 0.6.1-rc.0 ([63863c9](https://github.com/equaltoai/greater-components/commit/63863c95af59353ae569c968ee45a23de98066de))
- **premain:** release greater 0.6.1-rc.0 ([a973710](https://github.com/equaltoai/greater-components/commit/a973710ead5dafce9b0af8d3225e28923681c056))
- **premain:** release greater 0.6.2-rc.0 ([136347e](https://github.com/equaltoai/greater-components/commit/136347ef0035a1d2fea2b4dc7c143cf6b4b28e89))
- **premain:** release greater 0.6.2-rc.0 ([30de810](https://github.com/equaltoai/greater-components/commit/30de81015589a655ce2c31b94235aa9a5b1e5ec0))
- promote premain into main ([2ae6bbc](https://github.com/equaltoai/greater-components/commit/2ae6bbcf6a0a9a7e256c90bf188c13912ae7dc84))
- promote premain to main ([6831a05](https://github.com/equaltoai/greater-components/commit/6831a0546c000f25926deee7fab310cf3935d1aa))
- promote staging into premain ([19eddb3](https://github.com/equaltoai/greater-components/commit/19eddb33fd025be463efd0e4a620db5daa9a5e4c))
- promote staging to premain ([0a5170e](https://github.com/equaltoai/greater-components/commit/0a5170e4c23e572e37390cec1943dde624e4a630))
- promote staging to premain ([abc0eb6](https://github.com/equaltoai/greater-components/commit/abc0eb64b79466de07d90495fad75c2ca628091e))
- reconcile main promotion state ([1cf83aa](https://github.com/equaltoai/greater-components/commit/1cf83aa5553d395d0e82dfe775d935f15b0b9cf3))
- reconcile premain promotion state ([3b531f6](https://github.com/equaltoai/greater-components/commit/3b531f6c863bf6743d48167f07ec4d9c28178f7c))
- reconcile premain promotion state ([3a27a38](https://github.com/equaltoai/greater-components/commit/3a27a38f0892caf851a7ec78609cbfa3a2a559dc))
- reconcile premain promotion state ([493b13e](https://github.com/equaltoai/greater-components/commit/493b13e1ca02ecba541785979f2fd79da55f4e3c))
- reconcile staging promotion branches ([a04f0ca](https://github.com/equaltoai/greater-components/commit/a04f0ca3bd6f4376472ca795a985be3e5e54ce82))
- refresh registry checksums for chat fixes ([7d6cbaa](https://github.com/equaltoai/greater-components/commit/7d6cbaa0037d793102b5d91f0766bfc6e5fafefb))
- regenerate registry ([fe70f15](https://github.com/equaltoai/greater-components/commit/fe70f152ca7dc75f7a41fa04ae9e9ed713b40389))
- regenerate registry ([58abe16](https://github.com/equaltoai/greater-components/commit/58abe161740f37a93ec8d35b4df1d9a5d3fce339))
- regenerate registry ([1760bcc](https://github.com/equaltoai/greater-components/commit/1760bcc3ee8f1009462128dc01b25c1a929ad2cf))
- regenerate src type artifacts ([7bf3011](https://github.com/equaltoai/greater-components/commit/7bf3011db543b411156c0fb7d10d7d89b3bf2968))
- **registry:** regenerate index ([18cff39](https://github.com/equaltoai/greater-components/commit/18cff39803bbbd30f7cd72bdc24bdf0bafc56cd8))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- **release:** prepare metadata ([0f790d7](https://github.com/equaltoai/greater-components/commit/0f790d7437873ec8580d93445f831b61494ba3e1))
- **release:** prepare metadata ([036243b](https://github.com/equaltoai/greater-components/commit/036243b67f98e21b47f49e0c0243cc51bd49ee1a))
- **release:** prepare metadata ([ae98493](https://github.com/equaltoai/greater-components/commit/ae984939df823eabbca5d9b2ad45935ffb387e73))
- **release:** prepare metadata ([5edebd1](https://github.com/equaltoai/greater-components/commit/5edebd1c410c3de428e5463d4abe7f0e0a080cd8))
- **release:** prepare metadata ([4298fb8](https://github.com/equaltoai/greater-components/commit/4298fb81155437eb4e55962d471e891a22a93179))
- **release:** prepare metadata ([97b429b](https://github.com/equaltoai/greater-components/commit/97b429bee6c1edc15b531e56719ed31c7bf087b8))
- **release:** prepare metadata ([cefd0bd](https://github.com/equaltoai/greater-components/commit/cefd0bdec17d4e1c1f41d12b5d573fd79f8ce8c3))
- **release:** prepare metadata ([ef1afa1](https://github.com/equaltoai/greater-components/commit/ef1afa1740bd0a0304c4ff12fa299f83bc3810ab))
- **release:** prepare metadata ([01bf8e9](https://github.com/equaltoai/greater-components/commit/01bf8e99f4fe36934ac29435b5c80aa65f4d5f43))
- **release:** prepare metadata ([89909f8](https://github.com/equaltoai/greater-components/commit/89909f8b3efa6f21fcdc2ab08f0b22a3de15bc1b))
- **release:** prepare metadata ([580e324](https://github.com/equaltoai/greater-components/commit/580e324d67c142d5bc4b36fc340069813576b9f4))
- **release:** prepare metadata ([ed25889](https://github.com/equaltoai/greater-components/commit/ed25889356215dea97fa43f66f61ad0b2fc0a541))
- **release:** prepare metadata ([480be09](https://github.com/equaltoai/greater-components/commit/480be09472323ae4bab9c3a5eb6a4146ad76385c))
- **release:** prepare metadata ([604a99f](https://github.com/equaltoai/greater-components/commit/604a99f4752bc11eb0820fd3ef9365e75e3b4893))
- **release:** prepare metadata ([6ae00c6](https://github.com/equaltoai/greater-components/commit/6ae00c654001d29a9307dd8a1ef81011959f41cc))
- **release:** prepare metadata ([8dc7f57](https://github.com/equaltoai/greater-components/commit/8dc7f57593b03a2167d87bbb705df55be0f49a0e))
- **release:** prepare metadata ([c159e24](https://github.com/equaltoai/greater-components/commit/c159e241d99286afeabacb52d0db51aa76a030d6))
- **release:** prepare metadata ([b8a1e18](https://github.com/equaltoai/greater-components/commit/b8a1e18a7e9e73a9af1cad5a379ccbf7300ef3be))
- **release:** prepare metadata ([05161d7](https://github.com/equaltoai/greater-components/commit/05161d76434af43342029e9fa80afa0d70d5319d))
- **release:** prepare metadata ([232e330](https://github.com/equaltoai/greater-components/commit/232e330b1787cb28f77976dd828deda211ab7d49))
- **release:** prepare metadata ([4bbdea4](https://github.com/equaltoai/greater-components/commit/4bbdea454487798cf34d354986bc1d7826184550))
- **release:** prepare metadata ([90a9b77](https://github.com/equaltoai/greater-components/commit/90a9b778b248cff2f4b0584ea8af62b64d062f42))
- **release:** prepare metadata ([ff847be](https://github.com/equaltoai/greater-components/commit/ff847be410a8aaa3e23916f35219c4073ce91fab))
- **release:** prepare metadata ([49985b4](https://github.com/equaltoai/greater-components/commit/49985b433a25ca5ae6640e8b5b291349fb66750c))
- **release:** prepare metadata ([6fb0736](https://github.com/equaltoai/greater-components/commit/6fb07369824bbe32a0cea45650aff47ba82a5cdc))
- **release:** prepare metadata ([56b348d](https://github.com/equaltoai/greater-components/commit/56b348d470f384d5c26a50d26c110b6bbaf5dd39))
- **release:** prepare metadata ([025467e](https://github.com/equaltoai/greater-components/commit/025467e65ca562b4985d4b27c54bc852d9851a55))
- **release:** prepare metadata ([8a923d9](https://github.com/equaltoai/greater-components/commit/8a923d9ebe5fef01b0c23708e1f8ba75b5edd9c4))
- **release:** prepare metadata ([83ce78c](https://github.com/equaltoai/greater-components/commit/83ce78ce37bd6590fba10cd5ae087fbdad1945a2))
- **release:** prepare metadata ([78117f0](https://github.com/equaltoai/greater-components/commit/78117f0af1560bd57ebcfb30ce880b1fd2088c80))
- **release:** prepare metadata ([e648c68](https://github.com/equaltoai/greater-components/commit/e648c68ba2f321b0b025da6c50823aef4634146b))
- **release:** prepare metadata ([d9b9510](https://github.com/equaltoai/greater-components/commit/d9b95107cde7657c8236d289bf5b8325cf12dc86))
- **release:** prepare metadata ([da8cc98](https://github.com/equaltoai/greater-components/commit/da8cc9824f1b898597726ba6cfeee80cd9af0326))
- **release:** prepare metadata ([2337162](https://github.com/equaltoai/greater-components/commit/2337162f5ba76bc7e59d1dba4e59ab8953ae2362))
- **release:** prepare metadata ([16ce94e](https://github.com/equaltoai/greater-components/commit/16ce94e9fab6871453bd5113ea87e6078b40b09f))
- **release:** prepare metadata ([4f1f6b8](https://github.com/equaltoai/greater-components/commit/4f1f6b8f88c48e6de1022df9bcef04909af08085))
- **release:** prepare metadata ([404f4ad](https://github.com/equaltoai/greater-components/commit/404f4ad5e72ca074fd3281e0c5d015deeb7089db))
- **release:** prepare metadata ([b3c8310](https://github.com/equaltoai/greater-components/commit/b3c83108430486d20a9370eb35105670a028abbd))
- **release:** prepare metadata ([17ea35d](https://github.com/equaltoai/greater-components/commit/17ea35d6ca301d8550befaf8a48974a1d41d9fea))
- **release:** prepare metadata ([f1ea82c](https://github.com/equaltoai/greater-components/commit/f1ea82cd088a57e00c02fde6f6a9147dc284ee86))
- **release:** prepare metadata ([4379cac](https://github.com/equaltoai/greater-components/commit/4379cac56ea23951531202ebdc49e8419a2c7f99))
- **release:** prepare metadata ([5c223e2](https://github.com/equaltoai/greater-components/commit/5c223e25b2ef230563fa3bf7a34b4820d9a6f8e8))
- **release:** prepare metadata ([1f929ab](https://github.com/equaltoai/greater-components/commit/1f929ab539b2c5096c00e26fa697fe0b2c4afcfd))
- **release:** prepare metadata ([84a143b](https://github.com/equaltoai/greater-components/commit/84a143b1dd990fe0019c6fafb65f03d123476ba0))
- **release:** prepare metadata ([207cc63](https://github.com/equaltoai/greater-components/commit/207cc63f280f8d523897fc512c0158d6b5ff7114))
- **release:** prepare metadata ([e2d7489](https://github.com/equaltoai/greater-components/commit/e2d7489b31a19d8766948156c3d33bf7c3a58043))
- **release:** prepare metadata ([9f83bd0](https://github.com/equaltoai/greater-components/commit/9f83bd089ce1f65f8645dcc67d152d9bdd127d48))
- **release:** prepare metadata ([38ce978](https://github.com/equaltoai/greater-components/commit/38ce978189f739a06bc65858e3c363b94901335a))
- **release:** prepare metadata ([dc957c0](https://github.com/equaltoai/greater-components/commit/dc957c0e79dd5d66c7ab2dba77a1b72d3b252701))
- **release:** prepare metadata ([d665069](https://github.com/equaltoai/greater-components/commit/d665069c5bfe443897250023407ffa6c6b12920e))
- **release:** prepare metadata ([85e6bf4](https://github.com/equaltoai/greater-components/commit/85e6bf431ec844ba66967b06f3049cdaab033f26))
- **release:** prepare metadata ([788a1c9](https://github.com/equaltoai/greater-components/commit/788a1c91af968f7c0e40d119d5e2b3e84518ba4c))
- **release:** prepare metadata ([f97aa37](https://github.com/equaltoai/greater-components/commit/f97aa37a5094f75a567871c61a08899b06dd36e1))
- **release:** prepare metadata ([34579db](https://github.com/equaltoai/greater-components/commit/34579db0e31cef88737e5cb0e232786b3d3798b6))
- **release:** prepare metadata ([d8ae17e](https://github.com/equaltoai/greater-components/commit/d8ae17ed46bf0fbfc68896a8b58fc70b167d21f1))
- **release:** prepare metadata ([8754c5b](https://github.com/equaltoai/greater-components/commit/8754c5b0306082c21245de6a3766017d2df6db0c))
- **release:** prepare metadata ([d073017](https://github.com/equaltoai/greater-components/commit/d0730175366cbcc918144519ac5dfb5063c0110b))
- **release:** prepare metadata ([7276ef3](https://github.com/equaltoai/greater-components/commit/7276ef39f4d998fa75d016132638b3fa8ca10e67))
- **release:** prepare metadata ([0b46575](https://github.com/equaltoai/greater-components/commit/0b465754b1063d99b0d1078e775a10bbda883646))
- **release:** prepare metadata ([0c69583](https://github.com/equaltoai/greater-components/commit/0c695831df309a10d522dbad42f58452bc515875))
- **release:** prepare metadata ([d3c0378](https://github.com/equaltoai/greater-components/commit/d3c0378b33f3945e5a12acee43791847775b1c48))
- **release:** prepare metadata ([8f3a64d](https://github.com/equaltoai/greater-components/commit/8f3a64d1226a84c6321947791006567fab84c49a))
- **release:** prepare metadata ([9e92fc9](https://github.com/equaltoai/greater-components/commit/9e92fc97e93b13c8521e517d40a64245b35e7882))
- **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))
- **release:** prepare metadata ([59b93e6](https://github.com/equaltoai/greater-components/commit/59b93e66e7af639ce9f8f2be5d1215910b8f7fe7))
- **release:** prepare metadata ([9f62828](https://github.com/equaltoai/greater-components/commit/9f62828301f7532fc0f7e27cb6dc31e965b3b29d))
- run prettier ([f927a03](https://github.com/equaltoai/greater-components/commit/f927a03bd013bedd1702f3e142c1e60938f59ae8))
- stabilize registry metadata for promotions ([42b4f54](https://github.com/equaltoai/greater-components/commit/42b4f54e9d9818e8f6f35481a6a9a8934842e184))
- **staging:** backmerge main into staging ([49300c5](https://github.com/equaltoai/greater-components/commit/49300c5cf8d8b4b480f57dfff5549a72ddb16cac))
- **staging:** backmerge main into staging (repair promotion flow) ([5aec240](https://github.com/equaltoai/greater-components/commit/5aec24097c6404c95cd6d10cc4bf93d828d4e8a4))
- **staging:** backmerge premain into staging ([d906466](https://github.com/equaltoai/greater-components/commit/d906466b6eb819818a12cab7527f3224dd7fa479))
- **staging:** backmerge premain into staging ([5f4b78e](https://github.com/equaltoai/greater-components/commit/5f4b78e593fe5da09fad4d0a170c2a029f004dfb))
- **staging:** sync lesser contracts v1.1.53 ([98ed8c2](https://github.com/equaltoai/greater-components/commit/98ed8c263e5ba37d994e341492f88c9c105310b3))
- **staging:** sync lesser contracts v1.1.54 ([82fd622](https://github.com/equaltoai/greater-components/commit/82fd6228e9e27d11362ad9c5c3258de2a5d3a23e))
- **staging:** sync lesser v1.1.59 and lesser-host v1.1.6 ([9703101](https://github.com/equaltoai/greater-components/commit/970310107f0c799a977b1af791a0a3549d86ec31))
- **staging:** sync lesser v1.1.65 and lesser-host v0.1.21 ([cb64237](https://github.com/equaltoai/greater-components/commit/cb642376ab51462ff74479176ccb109461c26b58))
- sync lesser contracts and refresh dependencies ([ba941c0](https://github.com/equaltoai/greater-components/commit/ba941c01830eea459a3351755aeedfc5f97d199f))
- sync Lesser contracts and refresh dependencies ([8fe9cee](https://github.com/equaltoai/greater-components/commit/8fe9cee039f23cbfd946654a60b1134bd38a25c7))
- sync lesser contracts v1.1.53 ([2c8fdda](https://github.com/equaltoai/greater-components/commit/2c8fddabf63ccabc73117c308d75c5e4d7b99dc7))
- sync lesser contracts v1.1.54 ([65e54e0](https://github.com/equaltoai/greater-components/commit/65e54e05341e7c414329f439be09fe1284090e5d))
- sync lesser contracts v1.1.57 ([1357771](https://github.com/equaltoai/greater-components/commit/13577714d66f90ccc6733c9424396b6562e5d498))
- sync lesser contracts v1.1.59 ([30d9404](https://github.com/equaltoai/greater-components/commit/30d940403f8f2ffe52a2218a3c25a9f1870d337f))
- sync lesser contracts v1.1.64 ([628b09b](https://github.com/equaltoai/greater-components/commit/628b09bd488f16bc25eee238b30675f17eb0bacb))
- sync lesser contracts v1.1.65 ([b82bb26](https://github.com/equaltoai/greater-components/commit/b82bb26f9857d24c390deb95c2fe88b35f17e094))
- sync lesser v1.1.52 and refresh dependencies ([0fc9d8b](https://github.com/equaltoai/greater-components/commit/0fc9d8b087e59b4f6c097900822623e1cb02e65f))
- sync lesser v1.1.52 and refresh dependencies ([11ee095](https://github.com/equaltoai/greater-components/commit/11ee095af48f583cc7dda49e4e7adb26b98d7e35))
- sync lesser-host contracts v0.1.21 ([e9ccd00](https://github.com/equaltoai/greater-components/commit/e9ccd00fa20d78a7433a58c66e0c17529903f2d2))
- sync lesser-host contracts v1.1.6 ([c8fb023](https://github.com/equaltoai/greater-components/commit/c8fb023b901caae8e8aa426cf84da631a064aadd))
- sync main into staging release branch ([9c228b5](https://github.com/equaltoai/greater-components/commit/9c228b50bde702cb33eb8267f338a2c4fc3eb88e))
- sync main into staging release branch ([a629283](https://github.com/equaltoai/greater-components/commit/a62928369485eb907c1fe73affa1e6ac883437b4))
- sync main into staging release branch ([a8fd5b5](https://github.com/equaltoai/greater-components/commit/a8fd5b5754680de49e0b7ac8a3a61f1b7d31d3c5))
- sync main into staging release branch ([4349fb0](https://github.com/equaltoai/greater-components/commit/4349fb0da99ac49622e7eb9d5980312897187793))
- update registry checksums ([df448b6](https://github.com/equaltoai/greater-components/commit/df448b64e38e5e3b99a9c42f938086ff573723cd))

## [0.6.2-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.6.1-rc.0...greater-v0.6.2-rc.0) (2026-03-29)

### Bug Fixes

- flatten lib alias install targets ([4e94ea2](https://github.com/equaltoai/greater-components/commit/4e94ea2b96139c5fffd18fb02350792dadcab870))
- restore vendored add paths for social and agent flows ([83d3fc2](https://github.com/equaltoai/greater-components/commit/83d3fc213e8cdcfb505809cbf29240e28cb119b4))
- vendor full face package files ([0628d5c](https://github.com/equaltoai/greater-components/commit/0628d5c368704563e5eaaf6bfc05f60e9ae5214f))

### Tests

- align add command mocks with resolver keys ([9f113ac](https://github.com/equaltoai/greater-components/commit/9f113ac823f3ee852095eb95a4f7c0c63bfa0ed1))

### Chores

- **main:** release greater 0.6.1 ([a18809f](https://github.com/equaltoai/greater-components/commit/a18809f86b319798f507a50620f3a2e5109804c6))
- **main:** release greater 0.6.1 ([54b4c42](https://github.com/equaltoai/greater-components/commit/54b4c4250ab1584e60c7ac2acf6b23b7dbbfa1d2))
- **release:** prepare metadata ([036243b](https://github.com/equaltoai/greater-components/commit/036243b67f98e21b47f49e0c0243cc51bd49ee1a))

## [0.6.1](https://github.com/equaltoai/greater-components/compare/greater-v0.6.0...greater-v0.6.1) (2026-03-29)

### Bug Fixes

- address chat and agent installer regressions ([4a59b4d](https://github.com/equaltoai/greater-components/commit/4a59b4ddfe3662c3a6e89283d445300021471ac3))
- align shared chat with primitive props ([f2bbd4e](https://github.com/equaltoai/greater-components/commit/f2bbd4eb98f9ece3f08250cc6d27a554c96ee430))
- preserve binary assets during greater update ([78ed152](https://github.com/equaltoai/greater-components/commit/78ed152055f599877f4ffdeb2f831045b859bb2e))
- preserve binary assets during update ([9f8c075](https://github.com/equaltoai/greater-components/commit/9f8c07560d2b4ee8316a0938bf76087dfa85f8ff))
- resolve agent face registry collisions ([d8fdbd6](https://github.com/equaltoai/greater-components/commit/d8fdbd67f76548d4f5b0770086ff15979658b730))

### Chores

- **premain:** release greater 0.6.1-rc.0 ([63863c9](https://github.com/equaltoai/greater-components/commit/63863c95af59353ae569c968ee45a23de98066de))
- **premain:** release greater 0.6.1-rc.0 ([a973710](https://github.com/equaltoai/greater-components/commit/a973710ead5dafce9b0af8d3225e28923681c056))
- refresh registry checksums for chat fixes ([7d6cbaa](https://github.com/equaltoai/greater-components/commit/7d6cbaa0037d793102b5d91f0766bfc6e5fafefb))
- **release:** prepare metadata ([ae98493](https://github.com/equaltoai/greater-components/commit/ae984939df823eabbca5d9b2ad45935ffb387e73))

## [0.6.1-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.6.0-rc.0...greater-v0.6.1-rc.0) (2026-03-29)

### Bug Fixes

- address chat and agent installer regressions ([4a59b4d](https://github.com/equaltoai/greater-components/commit/4a59b4ddfe3662c3a6e89283d445300021471ac3))
- align shared chat with primitive props ([f2bbd4e](https://github.com/equaltoai/greater-components/commit/f2bbd4eb98f9ece3f08250cc6d27a554c96ee430))
- preserve binary assets during greater update ([78ed152](https://github.com/equaltoai/greater-components/commit/78ed152055f599877f4ffdeb2f831045b859bb2e))
- preserve binary assets during update ([9f8c075](https://github.com/equaltoai/greater-components/commit/9f8c07560d2b4ee8316a0938bf76087dfa85f8ff))
- resolve agent face registry collisions ([d8fdbd6](https://github.com/equaltoai/greater-components/commit/d8fdbd67f76548d4f5b0770086ff15979658b730))

### Chores

- **main:** release greater 0.6.0 ([e402979](https://github.com/equaltoai/greater-components/commit/e402979259132d49076faed18bc062538c870efd))
- **main:** release greater 0.6.0 ([74fc2d6](https://github.com/equaltoai/greater-components/commit/74fc2d675bcc673dab6564e06e7218b4ec276f5b))
- refresh registry checksums for chat fixes ([7d6cbaa](https://github.com/equaltoai/greater-components/commit/7d6cbaa0037d793102b5d91f0766bfc6e5fafefb))
- **release:** prepare metadata ([5edebd1](https://github.com/equaltoai/greater-components/commit/5edebd1c410c3de428e5463d4abe7f0e0a080cd8))

## [0.6.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.8...greater-v0.6.0) (2026-03-28)

### Features

- add agent face demo adoption path ([93aec51](https://github.com/equaltoai/greater-components/commit/93aec514138bdf142d9b0b6c655996b1205f9b45))
- add async workflow messaging surfaces ([d9ce302](https://github.com/equaltoai/greater-components/commit/d9ce3027c2d4c80b1d933b4c85a08c8d8fb3b9f4))
- add FaceTheory example and smoke coverage ([8bd2318](https://github.com/equaltoai/greater-components/commit/8bd2318c3703e4ea363c9ab493a8eb484618b64b))
- add host-provided face navigation contracts ([a772933](https://github.com/equaltoai/greater-components/commit/a772933004f2cff4276b1b1102d18f0687fc57c2))
- add reusable shared agent workflow surfaces ([81e05b7](https://github.com/equaltoai/greater-components/commit/81e05b71095f177d5036de7c19e85c4729a9b408))
- add shared agent workflow packages ([e3ca5a6](https://github.com/equaltoai/greater-components/commit/e3ca5a6a73d9c3b7c3627351149ad1157ac2000b))
- add SSR theme bootstrap helpers ([c1894be](https://github.com/equaltoai/greater-components/commit/c1894be95f05da97ecee62bbbfa1d6902942fa6d))
- add workflow lifecycle notifications ([a1832e2](https://github.com/equaltoai/greater-components/commit/a1832e2f19ef41645e56e9512d5f51b0dfbd666b))
- add workflow moments to shared chat ([35d3564](https://github.com/equaltoai/greater-components/commit/35d35648e85e5bfbaa9de1b116284cae50b9d279))
- compose agent profile and continuity surfaces ([3d978c8](https://github.com/equaltoai/greater-components/commit/3d978c83bf6314622cd6dfcd08cc648f8fd7e7f2))
- compose agent signing and declaration surfaces ([0e6675a](https://github.com/equaltoai/greater-components/commit/0e6675acb82b071bc296521b62d783fb7e9156e2))
- compose agent workflow inbox surfaces ([f90f246](https://github.com/equaltoai/greater-components/commit/f90f24663f36439fcbeff3cae05d90e24c09a4d5))
- freeze agent workflow package boundaries ([#387](https://github.com/equaltoai/greater-components/issues/387)) ([b308466](https://github.com/equaltoai/greater-components/commit/b308466083cf418e31631dddf2a13e431a24fd4e))
- freeze reusable agent workflow contracts ([#388](https://github.com/equaltoai/greater-components/issues/388)) ([6f4f980](https://github.com/equaltoai/greater-components/commit/6f4f980f30fed90af50b39bef172ad1b1e97d682))
- harden FaceTheory host boundaries and add smoke coverage ([7f506ad](https://github.com/equaltoai/greater-components/commit/7f506ad2479f0f699c82da3809c561fe8505b70d))
- map agent stitch anchors to reusable surfaces ([#389](https://github.com/equaltoai/greater-components/issues/389)) ([2fe69a5](https://github.com/equaltoai/greater-components/commit/2fe69a5428db34ba1a2efa76471545e625f82006))
- refresh lesser v1.2.0 and lesser-host v0.2.0 contracts ([63ce0b9](https://github.com/equaltoai/greater-components/commit/63ce0b9d8c92a4beaab998ca037881a07517b112))
- refresh lesser v1.2.0 contracts ([baa2c68](https://github.com/equaltoai/greater-components/commit/baa2c68a0840f30fbe8403d23b96de64bcdf42ba))
- scaffold canonical agent face exports ([89a9c63](https://github.com/equaltoai/greater-components/commit/89a9c6350fc0eb06e42511ccc0562639b2343180))

### Bug Fixes

- commit generated primitives declarations ([320f89c](https://github.com/equaltoai/greater-components/commit/320f89c1bdafea370be8f66950b16e27ace92015))
- complete workflow registry and grouping coverage ([4595d34](https://github.com/equaltoai/greater-components/commit/4595d342ad91492be88552d41dec53c5d95a48a3))
- exclude umbrella package from registry deps ([63cea06](https://github.com/equaltoai/greater-components/commit/63cea063558d3df416c4881c76b8ccc1023ef46d))
- exclude umbrella package from registry deps ([63c6b6a](https://github.com/equaltoai/greater-components/commit/63c6b6acc87e314478898db9f760dc40161c0ae6))
- harden facetheory example contract coverage ([08f5558](https://github.com/equaltoai/greater-components/commit/08f55583b318fdec82fe9af89ca0fb9e22050b57))
- harden SSR-safe face render paths ([eecad59](https://github.com/equaltoai/greater-components/commit/eecad593fe54166775217745005025fdaeb108d0))
- preserve agent face and workflow contracts ([493e996](https://github.com/equaltoai/greater-components/commit/493e996a4926ee9547cdcd44acddba6be509d4f0))
- preserve high-contrast preference overrides ([0b135e9](https://github.com/equaltoai/greater-components/commit/0b135e9e40609be25a3d77d62c41a5bbacd46f05))
- refresh registry checksums ([fea5ea9](https://github.com/equaltoai/greater-components/commit/fea5ea9b78ad63005421e03a1a2a13d6fea728bd))
- refresh registry checksums for agent workflow ([363e374](https://github.com/equaltoai/greater-components/commit/363e374f702187322c22a3de3fe9b7ce2af9efed))
- refresh workspace lockfile for agent packages ([967943f](https://github.com/equaltoai/greater-components/commit/967943fb2f588a5566cf267a2618e7d8cd8af193))
- satisfy CI registry and formatting checks ([9ac1526](https://github.com/equaltoai/greater-components/commit/9ac152617db037b5fba9a191d1d9159c3e783849))
- stabilize agent face ci build ([1ab307e](https://github.com/equaltoai/greater-components/commit/1ab307e4324c79fe3be7d47a41ea847744d63256))
- tighten agent workflow contracts and notification grouping ([45e773c](https://github.com/equaltoai/greater-components/commit/45e773c6285741a716fb13a2e270e9fbfe68a5e3))
- unblock agent face ci validation ([232eb7d](https://github.com/equaltoai/greater-components/commit/232eb7d443ed11eb15e96b27b46fcb0fd634b272))
- use workflow titles in grouped notifications ([d9a5043](https://github.com/equaltoai/greater-components/commit/d9a50433a23f78b3f8c3db5dbbc65c9b8f49d801))

### Refactors

- split browser presence tracking from store core ([e3fb9c3](https://github.com/equaltoai/greater-components/commit/e3fb9c34d6a3099e08fd1a7ef2701591399bafb0))

### Docs

- document agent face adoption patterns ([d5a3887](https://github.com/equaltoai/greater-components/commit/d5a388771963deadb480092928cd59610654d6f4))
- publish Simulacrum agent migration checklist ([8b40d4e](https://github.com/equaltoai/greater-components/commit/8b40d4e8d8602f5716d27554639e6aa8617ec216))

### Tests

- add agent face smoke coverage ([03de544](https://github.com/equaltoai/greater-components/commit/03de544f4f4011e5ce1d6b40bfcec1623841a588))

### Chores

- bump facetheory to v0.3.1 ([cbf9e6e](https://github.com/equaltoai/greater-components/commit/cbf9e6ece0d961f6d151135a8b14005678bfa9dc))
- finalize shared agent workflow surfaces ([6b63208](https://github.com/equaltoai/greater-components/commit/6b6320810ab6cf08bae011a56cc2aac793bb18bb))
- ignore repo-local codex workspace ([585398a](https://github.com/equaltoai/greater-components/commit/585398a0bc976b57658498877d1934b12ae85195))
- patch dependabot transitive alerts ([b87c223](https://github.com/equaltoai/greater-components/commit/b87c223dc839b862ddd1e46463f12c4285763c58))
- **premain:** release greater 0.5.9-rc.0 ([89100a0](https://github.com/equaltoai/greater-components/commit/89100a0f3335113f9a6a52c73c690d0003a785d1))
- **premain:** release greater 0.5.9-rc.0 ([e6b6c5a](https://github.com/equaltoai/greater-components/commit/e6b6c5a2f325da9d36ada2035cb8de3d78443ab5))
- **premain:** release greater 0.6.0-rc.0 ([fb57c3d](https://github.com/equaltoai/greater-components/commit/fb57c3d0b0e067a5d733318ff7be8849b23781e4))
- **premain:** release greater 0.6.0-rc.0 ([01ccff2](https://github.com/equaltoai/greater-components/commit/01ccff20cc005d9904b9412fd09c9a00b1c48f2b))
- reconcile main promotion state ([1cf83aa](https://github.com/equaltoai/greater-components/commit/1cf83aa5553d395d0e82dfe775d935f15b0b9cf3))
- reconcile premain promotion state ([3b531f6](https://github.com/equaltoai/greater-components/commit/3b531f6c863bf6743d48167f07ec4d9c28178f7c))
- reconcile premain promotion state ([3a27a38](https://github.com/equaltoai/greater-components/commit/3a27a38f0892caf851a7ec78609cbfa3a2a559dc))
- reconcile premain promotion state ([493b13e](https://github.com/equaltoai/greater-components/commit/493b13e1ca02ecba541785979f2fd79da55f4e3c))
- reconcile staging promotion branches ([a04f0ca](https://github.com/equaltoai/greater-components/commit/a04f0ca3bd6f4376472ca795a985be3e5e54ce82))
- **release:** prepare metadata ([4298fb8](https://github.com/equaltoai/greater-components/commit/4298fb81155437eb4e55962d471e891a22a93179))
- **release:** prepare metadata ([97b429b](https://github.com/equaltoai/greater-components/commit/97b429bee6c1edc15b531e56719ed31c7bf087b8))
- stabilize registry metadata for promotions ([42b4f54](https://github.com/equaltoai/greater-components/commit/42b4f54e9d9818e8f6f35481a6a9a8934842e184))

## [0.6.0-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.9-rc.0...greater-v0.6.0-rc.0) (2026-03-28)

### Features

- **adapters:** add lesser-host soul client utilities ([9e80a9b](https://github.com/equaltoai/greater-components/commit/9e80a9bee5150d0fc166ef5d514f567338910b19))
- **adapters:** sync lesser contract updates ([71fd0c1](https://github.com/equaltoai/greater-components/commit/71fd0c1e64f8925537ae51f2682a09f6ceec3a99))
- **adapters:** sync lesser contract updates ([76fa189](https://github.com/equaltoai/greater-components/commit/76fa1895a3b557f192486e12321dda05254da735))
- **adapters:** sync lesser graphql v1.1.28 ([9c15385](https://github.com/equaltoai/greater-components/commit/9c153850d123a7f892b5f997c97158ff04225bb1))
- **adapters:** sync lesser graphql v1.1.28 ([723e5f8](https://github.com/equaltoai/greater-components/commit/723e5f87ec7336c5b1e5945719c948d45f537316))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([a043b15](https://github.com/equaltoai/greater-components/commit/a043b15f594bfcef1f46b807d8676f746b84f078))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([812335b](https://github.com/equaltoai/greater-components/commit/812335b117e5e3cfa59a380fb8e92bcf37f65995))
- **adapters:** sync lesser v1.1.27 soul inventory ([c3f4be0](https://github.com/equaltoai/greater-components/commit/c3f4be09f905483e8732866a11e7f1061cdb6556))
- **adapters:** sync lesser v1.1.27 soul inventory ([c02324b](https://github.com/equaltoai/greater-components/commit/c02324b1c540551a3965cdc7390dc8ec48991f9c))
- **adapters:** sync lesser v1.1.29 ([b5ef6a2](https://github.com/equaltoai/greater-components/commit/b5ef6a2fcda43a74ec0ccbd7b665b4add8a0a3d0))
- **adapters:** sync lesser v1.1.29 ([eb512c7](https://github.com/equaltoai/greater-components/commit/eb512c7fc9dc970368a8b0c2848deecaf90f2f46))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([915021e](https://github.com/equaltoai/greater-components/commit/915021e5bf5f5aaedc45c93244d17b5b43f3af3a))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([6d9bd15](https://github.com/equaltoai/greater-components/commit/6d9bd153c28de85e72a782606fa0794e79a696e5))
- **adapters:** sync lesser-host v0.1.7 ([ebc93eb](https://github.com/equaltoai/greater-components/commit/ebc93eb598161e24c57f8e87dd11e5e517326cc6))
- **adapters:** sync lesser-host v0.1.7 and bump dependencies ([5e3b614](https://github.com/equaltoai/greater-components/commit/5e3b61462f98d02eed06862744458a56ccc6931c))
- add agent face demo adoption path ([93aec51](https://github.com/equaltoai/greater-components/commit/93aec514138bdf142d9b0b6c655996b1205f9b45))
- add async workflow messaging surfaces ([d9ce302](https://github.com/equaltoai/greater-components/commit/d9ce3027c2d4c80b1d933b4c85a08c8d8fb3b9f4))
- add FaceTheory example and smoke coverage ([8bd2318](https://github.com/equaltoai/greater-components/commit/8bd2318c3703e4ea363c9ab493a8eb484618b64b))
- add host-provided face navigation contracts ([a772933](https://github.com/equaltoai/greater-components/commit/a772933004f2cff4276b1b1102d18f0687fc57c2))
- Add initial system configuration and logging setup under the new .theory directory. ([7320f65](https://github.com/equaltoai/greater-components/commit/7320f65c6d4e011df71d599b624d22cca5d9c151))
- add reusable shared agent workflow surfaces ([81e05b7](https://github.com/equaltoai/greater-components/commit/81e05b71095f177d5036de7c19e85c4729a9b408))
- add shared agent workflow packages ([e3ca5a6](https://github.com/equaltoai/greater-components/commit/e3ca5a6a73d9c3b7c3627351149ad1157ac2000b))
- add SSR theme bootstrap helpers ([c1894be](https://github.com/equaltoai/greater-components/commit/c1894be95f05da97ecee62bbbfa1d6902942fa6d))
- add workflow lifecycle notifications ([a1832e2](https://github.com/equaltoai/greater-components/commit/a1832e2f19ef41645e56e9512d5f51b0dfbd666b))
- add workflow moments to shared chat ([35d3564](https://github.com/equaltoai/greater-components/commit/35d35648e85e5bfbaa9de1b116284cae50b9d279))
- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))
- **cli:** add doctor --csp and strict CSP docs ([1cfdd12](https://github.com/equaltoai/greater-components/commit/1cfdd12300e4862b414cd563d3116775ef4d3b84))
- compose agent profile and continuity surfaces ([3d978c8](https://github.com/equaltoai/greater-components/commit/3d978c83bf6314622cd6dfcd08cc648f8fd7e7f2))
- compose agent signing and declaration surfaces ([0e6675a](https://github.com/equaltoai/greater-components/commit/0e6675acb82b071bc296521b62d783fb7e9156e2))
- compose agent workflow inbox surfaces ([f90f246](https://github.com/equaltoai/greater-components/commit/f90f24663f36439fcbeff3cae05d90e24c09a4d5))
- freeze agent workflow package boundaries ([#387](https://github.com/equaltoai/greater-components/issues/387)) ([b308466](https://github.com/equaltoai/greater-components/commit/b308466083cf418e31631dddf2a13e431a24fd4e))
- freeze reusable agent workflow contracts ([#388](https://github.com/equaltoai/greater-components/issues/388)) ([6f4f980](https://github.com/equaltoai/greater-components/commit/6f4f980f30fed90af50b39bef172ad1b1e97d682))
- harden FaceTheory host boundaries and add smoke coverage ([7f506ad](https://github.com/equaltoai/greater-components/commit/7f506ad2479f0f699c82da3809c561fe8505b70d))
- map agent stitch anchors to reusable surfaces ([#389](https://github.com/equaltoai/greater-components/issues/389)) ([2fe69a5](https://github.com/equaltoai/greater-components/commit/2fe69a5428db34ba1a2efa76471545e625f82006))
- **messaging:** allow background refresh ([fba11d5](https://github.com/equaltoai/greater-components/commit/fba11d5208add59c540dbca992afed1fc1989c06))
- **messaging:** delete-for-me (M4) ([f5c1501](https://github.com/equaltoai/greater-components/commit/f5c15016935c9e2cf9b667384f0242b79ee5cefb))
- **messaging:** inbox/requests dm handlers ([d579ac8](https://github.com/equaltoai/greater-components/commit/d579ac86822e043299f96e5bec81cbb2c7dc7be1))
- **messaging:** realtime updates (M5) ([d28af50](https://github.com/equaltoai/greater-components/commit/d28af5054e43b82ab7309e91505037b294f80f6b))
- **notifications:** render communication notifications ([4b645f8](https://github.com/equaltoai/greater-components/commit/4b645f8217c21bd4a1ecdb5583917867331e4491))
- **notifications:** support communication payloads ([1b1f5a1](https://github.com/equaltoai/greater-components/commit/1b1f5a1575e3a8c0c437587658d70a706764f7c3))
- **prefs:** expose dm delivery setting ([b7d7fee](https://github.com/equaltoai/greater-components/commit/b7d7feecd4953b441cb17414d0c863e6fd7026a8))
- refresh lesser v1.2.0 and lesser-host v0.2.0 contracts ([63ce0b9](https://github.com/equaltoai/greater-components/commit/63ce0b9d8c92a4beaab998ca037881a07517b112))
- refresh lesser v1.2.0 contracts ([baa2c68](https://github.com/equaltoai/greater-components/commit/baa2c68a0840f30fbe8403d23b96de64bcdf42ba))
- scaffold canonical agent face exports ([89a9c63](https://github.com/equaltoai/greater-components/commit/89a9c6350fc0eb06e42511ccc0562639b2343180))
- **social:** add Unicode fallback to CustomEmojiPicker ([43ff72f](https://github.com/equaltoai/greater-components/commit/43ff72f9d7bd3f8b8e70e40df4712d30ceb22f62))
- **soul:** add channels and preferences UI components ([1bd005b](https://github.com/equaltoai/greater-components/commit/1bd005b88ed663acd7c46437d30c0602aecc5cb3))

### Bug Fixes

- **a11y:** keep status roles out of feed ([724abfb](https://github.com/equaltoai/greater-components/commit/724abfbec3363004deecc2655c73324928506519))
- **adapters:** default empty conversations results ([32500ad](https://github.com/equaltoai/greater-components/commit/32500ad2e1e1055ad8418bf02daf8a88e2d1386e)), closes [#210](https://github.com/equaltoai/greater-components/issues/210)
- **adapters:** guard conversation participant id ([0c9db51](https://github.com/equaltoai/greater-components/commit/0c9db51e2387396487d9bfbf04cc0e292fe63e7e))
- **adapters:** handle empty GraphQL query results ([58c7bfe](https://github.com/equaltoai/greater-components/commit/58c7bfece1a56eb97bab549f6c206000525d60bf))
- **adapters:** pin Lesser v1.1.11 + suppress empty conversations error ([f4b21c0](https://github.com/equaltoai/greater-components/commit/f4b21c0049b10af8b5a605e4b7648b9a59579989))
- **adapters:** satisfy lint and registry validation ([d5cd018](https://github.com/equaltoai/greater-components/commit/d5cd018efe73814042d0ef617695dc9ce78ef2fa))
- **adapters:** trim baseUrl without regex ([f3cbe99](https://github.com/equaltoai/greater-components/commit/f3cbe9900a7f3fac06f569fdd167236c01f09683))
- **admin:** use valid Button variant ([638824f](https://github.com/equaltoai/greater-components/commit/638824ff110a150621058572f7ad09e2d94523f3))
- **ci:** pass lint workflow ([d6a1c96](https://github.com/equaltoai/greater-components/commit/d6a1c96df1dfb813a5d9a2b6803ed7e5a7505c4b))
- **ci:** skip a11y comments on fork PRs ([8d44561](https://github.com/equaltoai/greater-components/commit/8d445617cf6308c70e0202c0d2c80a116722a950))
- **ci:** skip coverage comments on fork PRs ([e3f7fee](https://github.com/equaltoai/greater-components/commit/e3f7fee538a6794baa36067ed732b4aa437b82cc))
- **cli:** include admin Agents files in vendored installs ([68c8541](https://github.com/equaltoai/greater-components/commit/68c8541aec282ef3a17add072ee46fc55ba114e3))
- **cli:** update full core package file sets ([0757d28](https://github.com/equaltoai/greater-components/commit/0757d28759e7dd99af091c6b59d8460fc2a49bd9))
- **cli:** update full core package file sets ([16df66b](https://github.com/equaltoai/greater-components/commit/16df66b8d9cebcf2113b997a748551b63f97ccea))
- commit generated primitives declarations ([320f89c](https://github.com/equaltoai/greater-components/commit/320f89c1bdafea370be8f66950b16e27ace92015))
- complete workflow registry and grouping coverage ([4595d34](https://github.com/equaltoai/greater-components/commit/4595d342ad91492be88552d41dec53c5d95a48a3))
- **compose:** include new object fields in optimistic updates ([9f28a34](https://github.com/equaltoai/greater-components/commit/9f28a3440484eec3906b8fd32c22ecc792c32fd2))
- **csp:** make primitives transitions WAAPI-based ([703b1bd](https://github.com/equaltoai/greater-components/commit/703b1bda9aafd3d5b9939c8c6af160725fae502a))
- **csp:** remove inline style writes from utils ([79bb770](https://github.com/equaltoai/greater-components/commit/79bb770ec53125f283e9f2310d4012d174a764df))
- **csp:** remove inline styles from virtualized timelines ([22aa0fc](https://github.com/equaltoai/greater-components/commit/22aa0fc2a8f4d041cf92f92f4ead819337774742))
- **csp:** remove runtime inline-style writes from primitives ([b4e8a3d](https://github.com/equaltoai/greater-components/commit/b4e8a3dcf541bc3e0862692c864cd254a6aa831f))
- **csp:** remove runtime style injection from artist face ([c62a4d9](https://github.com/equaltoai/greater-components/commit/c62a4d979e74d3d9292bc1b8c89d71f8c4b92dfe))
- **csp:** remove runtime style writes from headless ([9858a2b](https://github.com/equaltoai/greater-components/commit/9858a2bc563480b9f2eb54be7a7d1fd2776c9971))
- **csp:** replace textarea autosize with CSS-driven helper ([c845b6a](https://github.com/equaltoai/greater-components/commit/c845b6a205af850efd3a9e9fca8746742ae56110))
- **csp:** strict CSP issue sweep ([#180](https://github.com/equaltoai/greater-components/issues/180), [#187](https://github.com/equaltoai/greater-components/issues/187)–[#195](https://github.com/equaltoai/greater-components/issues/195)) ([241aeab](https://github.com/equaltoai/greater-components/commit/241aeabfc01754668dad1a2fca5aa54492bcf9e5))
- **deps:** align undici override with lockfile ([5c2ae6b](https://github.com/equaltoai/greater-components/commit/5c2ae6b2fadd3f7bbe806c3630746176e7e1f976))
- **deps:** patch flatted vulnerability ([9b20492](https://github.com/equaltoai/greater-components/commit/9b20492b3620bd5c93f6f2c56b731b0bc9168bfe))
- **docs:** remove stale svelte config suppression ([35ede19](https://github.com/equaltoai/greater-components/commit/35ede19557a92eb8be1b89b8e5b0e35e4bde750c))
- exclude umbrella package from registry deps ([63cea06](https://github.com/equaltoai/greater-components/commit/63cea063558d3df416c4881c76b8ccc1023ef46d))
- exclude umbrella package from registry deps ([63c6b6a](https://github.com/equaltoai/greater-components/commit/63c6b6acc87e314478898db9f760dc40161c0ae6))
- **graphql:** pin Lesser v1.1.1 + expand fragments ([d68fd59](https://github.com/equaltoai/greater-components/commit/d68fd592e3e1e18b0bd08d925a5d6a1d2afbf19b)), closes [#168](https://github.com/equaltoai/greater-components/issues/168)
- harden facetheory example contract coverage ([08f5558](https://github.com/equaltoai/greater-components/commit/08f55583b318fdec82fe9af89ca0fb9e22050b57))
- harden SSR-safe face render paths ([eecad59](https://github.com/equaltoai/greater-components/commit/eecad593fe54166775217745005025fdaeb108d0))
- **notifications:** add utils dependency ([3400e55](https://github.com/equaltoai/greater-components/commit/3400e553cde5bae810037bdcca9600f68c58af83))
- **playground:** bind search context ([ac0aa64](https://github.com/equaltoai/greater-components/commit/ac0aa64c912d8bb0f92c87ee3253282a3e755ea9))
- **playground:** prevent icon gallery crash ([5086560](https://github.com/equaltoai/greater-components/commit/5086560fd147546b7079fd5d0d394978a66a7ffa))
- preserve agent face and workflow contracts ([493e996](https://github.com/equaltoai/greater-components/commit/493e996a4926ee9547cdcd44acddba6be509d4f0))
- preserve high-contrast preference overrides ([0b135e9](https://github.com/equaltoai/greater-components/commit/0b135e9e40609be25a3d77d62c41a5bbacd46f05))
- refresh registry checksums ([fea5ea9](https://github.com/equaltoai/greater-components/commit/fea5ea9b78ad63005421e03a1a2a13d6fea728bd))
- refresh registry checksums for agent workflow ([363e374](https://github.com/equaltoai/greater-components/commit/363e374f702187322c22a3de3fe9b7ce2af9efed))
- refresh workspace lockfile for agent packages ([967943f](https://github.com/equaltoai/greater-components/commit/967943fb2f588a5566cf267a2618e7d8cd8af193))
- **registry:** align staging release metadata ([8bfc673](https://github.com/equaltoai/greater-components/commit/8bfc6735580edb8b90efbe89d8e9f2d22e6bc41f))
- **registry:** keep index ref on release tag ([6664cdb](https://github.com/equaltoai/greater-components/commit/6664cdb208ab951fa8c2861a2eca6ed5645ddefe))
- **registry:** refresh checksums after warning cleanup ([76250a5](https://github.com/equaltoai/greater-components/commit/76250a5e8fcd8af84afe63a9c7b69fe0f68192b5))
- **registry:** regenerate index ([43978b6](https://github.com/equaltoai/greater-components/commit/43978b6d293e385c040a96274f19302dbcb1c93d))
- **registry:** regenerate index ([17142da](https://github.com/equaltoai/greater-components/commit/17142da9d2b3f847cb9b856afd7d2fcb46ba246d))
- satisfy CI registry and formatting checks ([9ac1526](https://github.com/equaltoai/greater-components/commit/9ac152617db037b5fba9a191d1d9159c3e783849))
- **security:** harden HTML rendering and path handling ([d6f3bc9](https://github.com/equaltoai/greater-components/commit/d6f3bc94f52e9ffa778ce2a349110abc198723fa))
- **security:** harden HTML rendering and path handling ([f871ece](https://github.com/equaltoai/greater-components/commit/f871ece4e14464ee60d0ff1aa0315fa8c7ae826e))
- **social:** remove global BackupCodes theme styles ([8c9405a](https://github.com/equaltoai/greater-components/commit/8c9405adbf6bbf45941df99255b6d3c5264e4964))
- **soul:** satisfy strict svelte-check ([0603c37](https://github.com/equaltoai/greater-components/commit/0603c377420e7b28e5467b286876af2c4fc63be0))
- stabilize agent face ci build ([1ab307e](https://github.com/equaltoai/greater-components/commit/1ab307e4324c79fe3be7d47a41ea847744d63256))
- **staging:** patch flatted vulnerability ([c0d6109](https://github.com/equaltoai/greater-components/commit/c0d6109afd70b3b76ae36457b8e5c3c587a99b9f))
- tighten agent workflow contracts and notification grouping ([45e773c](https://github.com/equaltoai/greater-components/commit/45e773c6285741a716fb13a2e270e9fbfe68a5e3))
- unblock agent face ci validation ([232eb7d](https://github.com/equaltoai/greater-components/commit/232eb7d443ed11eb15e96b27b46fcb0fd634b272))
- use workflow titles in grouped notifications ([d9a5043](https://github.com/equaltoai/greater-components/commit/d9a50433a23f78b3f8c3db5dbbc65c9b8f49d801))

### Refactors

- split browser presence tracking from store core ([e3fb9c3](https://github.com/equaltoai/greater-components/commit/e3fb9c34d6a3099e08fd1a7ef2701591399bafb0))

### Docs

- add issue sweep plan for open issues ([7e9c169](https://github.com/equaltoai/greater-components/commit/7e9c169b7d4199341cbf20c07955acd0c0d77d71))
- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))
- document agent face adoption patterns ([d5a3887](https://github.com/equaltoai/greater-components/commit/d5a388771963deadb480092928cd59610654d6f4))
- publish Simulacrum agent migration checklist ([8b40d4e](https://github.com/equaltoai/greater-components/commit/8b40d4e8d8602f5716d27554639e6aa8617ec216))

### CI

- **deps:** bump artifact actions ([6bcd038](https://github.com/equaltoai/greater-components/commit/6bcd03801a04a4af9e613094907a7a90dfcbadeb))
- **deps:** bump pnpm/action-setup from 4 to 5 ([6051090](https://github.com/equaltoai/greater-components/commit/6051090056a24ea42c5a941beb07cdbe0c5b406b))
- **prerelease:** ignore stable manifest changes ([f087528](https://github.com/equaltoai/greater-components/commit/f087528bb68ef9aba9cf184739e861470cd26d57))
- streamline staging checks ([b57ca93](https://github.com/equaltoai/greater-components/commit/b57ca9346fb8a7021db16116bdc957b503d7c5fa))

### Tests

- add agent face smoke coverage ([03de544](https://github.com/equaltoai/greater-components/commit/03de544f4f4011e5ce1d6b40bfcec1623841a588))
- fix wrappers and headless mocks ([14b624b](https://github.com/equaltoai/greater-components/commit/14b624b841691941bde23100a5edc1e8311a6dca))

### Chores

- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([7b8c0d6](https://github.com/equaltoai/greater-components/commit/7b8c0d633e9e76e79a0943e6c6c721eb5c435b2c))
- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([d4fd4e3](https://github.com/equaltoai/greater-components/commit/d4fd4e39d6518025996bc0e72142ece720c73e1a))
- backmerge main into premain ([4925504](https://github.com/equaltoai/greater-components/commit/492550499fa69c84e8e0c421cb0ac53b971a8920))
- backmerge main into premain ([8e71eb1](https://github.com/equaltoai/greater-components/commit/8e71eb1b3a1fd4c12d7f8a76ff4286d5519b83bb))
- backmerge main into premain ([e611522](https://github.com/equaltoai/greater-components/commit/e611522b33c4ffa43be5c81d3d19aaa773579515))
- backmerge main into premain ([9a56db0](https://github.com/equaltoai/greater-components/commit/9a56db0365c6d4b53dc6e0746db9018a49a956d0))
- backmerge main into premain ([ae103e6](https://github.com/equaltoai/greater-components/commit/ae103e689a6246cdb5a54f229e16bc739430114a))
- backmerge main into premain ([04e265f](https://github.com/equaltoai/greater-components/commit/04e265f44442dfea7841b9b3607b3e64be9c7594))
- backmerge main into premain ([fdf8266](https://github.com/equaltoai/greater-components/commit/fdf8266bc275606183afc684dd7d1fc2d6bb1378))
- backmerge main into premain ([31cc7aa](https://github.com/equaltoai/greater-components/commit/31cc7aab4c70967a93743e47c6b2b12b55b65136))
- backmerge main into staging ([bcb6e55](https://github.com/equaltoai/greater-components/commit/bcb6e554ec6953131a859c3fb767a517ed874275))
- backmerge main into staging ([eacd418](https://github.com/equaltoai/greater-components/commit/eacd41859475c6fac063b40e4b7fcef4fbcbc2ac))
- backmerge premain into staging ([57ea8c1](https://github.com/equaltoai/greater-components/commit/57ea8c1093630d3d3c4104257cc29a8feead8fca))
- backmerge premain into staging ([01e2942](https://github.com/equaltoai/greater-components/commit/01e2942c35c362e7d38923f359f3d7feb65612ca))
- backmerge premain into staging ([9cfb655](https://github.com/equaltoai/greater-components/commit/9cfb655745de8345691bd2302881410adbe1cb56))
- backmerge premain into staging ([abd6805](https://github.com/equaltoai/greater-components/commit/abd6805136bdfbbc01208f859e6cd982f58d9d3e))
- backmerge premain into staging ([b7fe9fb](https://github.com/equaltoai/greater-components/commit/b7fe9fb091b54202b764ffba693478f24e7adad4))
- backmerge premain into staging ([b52676d](https://github.com/equaltoai/greater-components/commit/b52676d60fefa9a6f1b027684dac079929285a2d))
- backmerge premain into staging ([ee5d81c](https://github.com/equaltoai/greater-components/commit/ee5d81ce4a17202df4a1b773eb8bb6ca272c633d))
- backmerge premain into staging ([ff92e4c](https://github.com/equaltoai/greater-components/commit/ff92e4cbf8426191120b36b21583493ba340200b))
- backmerge premain into staging ([7f259f7](https://github.com/equaltoai/greater-components/commit/7f259f7aa6852ee3ebb54a4a7629c879a611c258))
- bump facetheory to v0.3.1 ([cbf9e6e](https://github.com/equaltoai/greater-components/commit/cbf9e6ece0d961f6d151135a8b14005678bfa9dc))
- bump svelte to 5.53.0 ([9d6a300](https://github.com/equaltoai/greater-components/commit/9d6a300f6032dd345b581240348eb947667664bf))
- bump svelte to 5.53.0 ([acc3ce0](https://github.com/equaltoai/greater-components/commit/acc3ce071df62d17a6d5ba615369e192bdff53e0))
- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **contracts:** bump lesser to v1.1.24 ([81a9829](https://github.com/equaltoai/greater-components/commit/81a98290895b06e9ace85e12454ab4aa1550d57d))
- **contracts:** bump lesser to v1.1.24 ([9c1f3ab](https://github.com/equaltoai/greater-components/commit/9c1f3ab54c263760d32e47fbbbc41ca0a323d8cd))
- **csp:** extend validate:csp for runtime strict CSP ([a8139a5](https://github.com/equaltoai/greater-components/commit/a8139a571164ba9b7e590f79c343585d8afc27de))
- **deps-dev:** bump svelte from 5.54.0 to 5.54.1 in the svelte group ([3e3f57d](https://github.com/equaltoai/greater-components/commit/3e3f57d293192fdfbf50e1614859575f16b2e583))
- **deps-dev:** bump vite from 8.0.1 to 8.0.2 in the dependencies group across 1 directory ([f834fb8](https://github.com/equaltoai/greater-components/commit/f834fb8641cf5360007fc426d486bd4560690a9e))
- **deps-dev:** bump vite in the dependencies group across 1 directory ([6b56481](https://github.com/equaltoai/greater-components/commit/6b56481768ec4b2bf8ee16ccc146a1f0219e2bf2))
- **deps:** bump devalue to 5.6.4 ([da6279a](https://github.com/equaltoai/greater-components/commit/da6279a3850392a79bdb9a9687813b0b45801e79))
- **deps:** bump graphql-codegen ([d2490c5](https://github.com/equaltoai/greater-components/commit/d2490c5890f00641783c1c8637e6cb64237e7da0))
- **deps:** bump the dependencies group with 5 updates ([9482ccd](https://github.com/equaltoai/greater-components/commit/9482ccdddc681dc2a94e1247068a79fb753ee7db))
- **deps:** bump the dependencies group with 7 updates ([3bec0f0](https://github.com/equaltoai/greater-components/commit/3bec0f0441c95ec26b193a7e12b5c3dccf3a8611))
- **deps:** patch audited vulnerabilities ([c9902e6](https://github.com/equaltoai/greater-components/commit/c9902e6d560a76f27e5a6d67da765b8b264b06f1))
- **deps:** patch undici and flatted ([b8b6043](https://github.com/equaltoai/greater-components/commit/b8b6043f068f268d0d987bb477e25d91d3772ab1))
- **deps:** patch undici and flatted ([da8a266](https://github.com/equaltoai/greater-components/commit/da8a266130baa45cea4ac243f27552623a47091b))
- **deps:** update workspace dependencies ([5e15fbc](https://github.com/equaltoai/greater-components/commit/5e15fbc3223cf96ef26d305506f705132fc1488d))
- **deps:** update workspace dependencies ([2391851](https://github.com/equaltoai/greater-components/commit/23918518bb23851a7e06761817c2f19b57fccff0))
- finalize shared agent workflow surfaces ([6b63208](https://github.com/equaltoai/greater-components/commit/6b6320810ab6cf08bae011a56cc2aac793bb18bb))
- fix CI validation ([f8c2958](https://github.com/equaltoai/greater-components/commit/f8c2958546c380839f30f3a1c4faed244a05dd0e))
- format + regenerate registry ([ad0abd4](https://github.com/equaltoai/greater-components/commit/ad0abd42f5ee47f4ca35290f41de2940eee17acb))
- format adapter tests ([28d6a71](https://github.com/equaltoai/greater-components/commit/28d6a71874a4ca808fb017397c705606aa18ee1f))
- format and regenerate registry ([148f214](https://github.com/equaltoai/greater-components/commit/148f214da81663a646ebc2615791de1988318dce))
- format lesser-host contract snapshots ([27876f4](https://github.com/equaltoai/greater-components/commit/27876f4094c524adb35d584f99a8626c668d479f))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- ignore repo-local codex workspace ([585398a](https://github.com/equaltoai/greater-components/commit/585398a0bc976b57658498877d1934b12ae85195))
- **lesser:** pin contracts to 9f072443 ([2ef3e4b](https://github.com/equaltoai/greater-components/commit/2ef3e4bfa65d1f9d5839552ebdaf79eba5e25b0e))
- **lesser:** pin contracts to v1.1.10 ([c0d8fc2](https://github.com/equaltoai/greater-components/commit/c0d8fc20e1e0756832772e478c93520c38b3a228))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** promote premain adapter sync ([af34ff6](https://github.com/equaltoai/greater-components/commit/af34ff6474c6ca70e1b1b9dc48d3f5185377a5b6))
- **main:** promote premain adapter sync ([af369e8](https://github.com/equaltoai/greater-components/commit/af369e88a1ee5f24c7b852da93262bd24aa25891))
- **main:** release greater 0.1.10 ([667640a](https://github.com/equaltoai/greater-components/commit/667640a877db74622bede34003a86d9e600bb0dd))
- **main:** release greater 0.1.10 ([6ac2237](https://github.com/equaltoai/greater-components/commit/6ac22374d04c698932972320b3c79ab67ca76402))
- **main:** release greater 0.1.11 ([9c0ffec](https://github.com/equaltoai/greater-components/commit/9c0ffec99ff5906d9836909d1e303f2fe3df240e))
- **main:** release greater 0.1.11 ([7bac630](https://github.com/equaltoai/greater-components/commit/7bac6304929b7ce1e26cccaaa33057e77308f0f3))
- **main:** release greater 0.1.12 ([4c0a357](https://github.com/equaltoai/greater-components/commit/4c0a35779d1e5fe72cbe4bb3277d04a0cff9b72a))
- **main:** release greater 0.1.12 ([1b07132](https://github.com/equaltoai/greater-components/commit/1b071322ea489d2e37d00b4187060ad64fa98c02))
- **main:** release greater 0.1.13 ([0587386](https://github.com/equaltoai/greater-components/commit/0587386f177206f3c2c639909a2d1444b92856c9))
- **main:** release greater 0.1.13 ([c1ce3a6](https://github.com/equaltoai/greater-components/commit/c1ce3a6e4c30d584ad39d99c317783eae7fe6d59))
- **main:** release greater 0.1.14 ([df67b91](https://github.com/equaltoai/greater-components/commit/df67b911564eb3fcb13bf912302623d6d64cf90d))
- **main:** release greater 0.1.14 ([505dffe](https://github.com/equaltoai/greater-components/commit/505dffe6186e189cada19d7ad90502e00ecde878))
- **main:** release greater 0.1.15 ([fee7e6c](https://github.com/equaltoai/greater-components/commit/fee7e6cd9fcb907072fd304dcc0f6c88a640faf6))
- **main:** release greater 0.1.15 ([eea6ed8](https://github.com/equaltoai/greater-components/commit/eea6ed8915bb01ee5c15130cabb1755a981211b5))
- **main:** release greater 0.1.16 ([a79f2e0](https://github.com/equaltoai/greater-components/commit/a79f2e077f36c16f53eae22f9dee4111f1d59dc1))
- **main:** release greater 0.1.16 ([e43b3d4](https://github.com/equaltoai/greater-components/commit/e43b3d42b5f885799190a7ede01c5c45e2bd6628))
- **main:** release greater 0.1.17 ([7d18a8b](https://github.com/equaltoai/greater-components/commit/7d18a8b734bc583edf8e03ce0907f2d55538c07c))
- **main:** release greater 0.1.17 ([ff15bde](https://github.com/equaltoai/greater-components/commit/ff15bdeb7ecd509ab4e2922898e53186df685270))
- **main:** release greater 0.1.18 ([4e28b93](https://github.com/equaltoai/greater-components/commit/4e28b93bc7320d3d39bd845c259d26047d96eeec))
- **main:** release greater 0.1.18 ([f7c79da](https://github.com/equaltoai/greater-components/commit/f7c79da4b043b772c860ea0d41566b2b90d349b0))
- **main:** release greater 0.1.5 ([5301936](https://github.com/equaltoai/greater-components/commit/5301936bd01626ccbf982c59a632caa9a8825dfe))
- **main:** release greater 0.1.5 ([7827364](https://github.com/equaltoai/greater-components/commit/7827364fe0da2b0b5d1be8daf3e49b4762ead2b6))
- **main:** release greater 0.1.6 ([b68eaf8](https://github.com/equaltoai/greater-components/commit/b68eaf8b983c2511def417009771455b237774b1))
- **main:** release greater 0.1.6 ([5492fad](https://github.com/equaltoai/greater-components/commit/5492faddf363cdd55ba60e229bc4f0f0a044386f))
- **main:** release greater 0.1.7 ([c1970f1](https://github.com/equaltoai/greater-components/commit/c1970f1f7d51d69b1d924be718765c52b2c75d75))
- **main:** release greater 0.1.7 ([8182b0e](https://github.com/equaltoai/greater-components/commit/8182b0e056d49bf6b69fb8a50541cc36e5ea9539))
- **main:** release greater 0.1.8 ([1789f15](https://github.com/equaltoai/greater-components/commit/1789f15695b105e80aec7fadc2513893fdfcdcd6))
- **main:** release greater 0.1.8 ([e24b167](https://github.com/equaltoai/greater-components/commit/e24b167cf469079936cd1808a197184a78288029))
- **main:** release greater 0.1.9 ([c697281](https://github.com/equaltoai/greater-components/commit/c6972811cb190941800ca06992d8eba1ba76466c))
- **main:** release greater 0.1.9 ([b295a9f](https://github.com/equaltoai/greater-components/commit/b295a9f802c7b88debf3d8de84cffedcbb16ec43))
- **main:** release greater 0.2.0 ([8a548a0](https://github.com/equaltoai/greater-components/commit/8a548a0bb659cbccb38d1ace1d946cf027ecda02))
- **main:** release greater 0.2.0 ([b12c808](https://github.com/equaltoai/greater-components/commit/b12c808a15c14eeaf772fea0459433750b3f60b7))
- **main:** release greater 0.3.0 ([5fd2740](https://github.com/equaltoai/greater-components/commit/5fd27404174e90b28de231540e84be400940edbe))
- **main:** release greater 0.3.0 ([7531f13](https://github.com/equaltoai/greater-components/commit/7531f1368f65afc827cbef7a258c63c73837d827))
- **main:** release greater 0.4.0 ([9034252](https://github.com/equaltoai/greater-components/commit/90342525e3857bf6f9ee0a706431b3b0c044cbe1))
- **main:** release greater 0.4.0 ([dbf06f1](https://github.com/equaltoai/greater-components/commit/dbf06f16383806b20dada2a9b1bb35b6827d6bad))
- **main:** release greater 0.4.1 ([a8c7da6](https://github.com/equaltoai/greater-components/commit/a8c7da649cd324bb83ee7260550c472be4b37a99))
- **main:** release greater 0.4.1 ([526225d](https://github.com/equaltoai/greater-components/commit/526225d60f3d838f4b9fd381f6063fa9c38d0768))
- **main:** release greater 0.4.2 ([2a41018](https://github.com/equaltoai/greater-components/commit/2a41018a1fc0cf130510f1b8a5dfcdcd562e23f0))
- **main:** release greater 0.4.2 ([dbf2696](https://github.com/equaltoai/greater-components/commit/dbf26965d62b31ff8a6d213aee54d3499732491b))
- **main:** release greater 0.4.3 ([679a643](https://github.com/equaltoai/greater-components/commit/679a643bccf77265da4f68514ba9448d659783dc))
- **main:** release greater 0.4.3 ([38413b7](https://github.com/equaltoai/greater-components/commit/38413b7544c60b6d9bc23c00fa028ea9be3f1dfd))
- **main:** release greater 0.4.4 ([86ced6d](https://github.com/equaltoai/greater-components/commit/86ced6d92fedd1ca4b157ee9a586319b0c39c1cb))
- **main:** release greater 0.4.4 ([60f038f](https://github.com/equaltoai/greater-components/commit/60f038f25faef38213c6958cd7ca0826c82736ba))
- **main:** release greater 0.5.0 ([74a23c4](https://github.com/equaltoai/greater-components/commit/74a23c4783ede4c2a784b26a6edd18f33e710318))
- **main:** release greater 0.5.0 ([0e2f6d4](https://github.com/equaltoai/greater-components/commit/0e2f6d4c8a268afddc9f67b6ae3ff1d29133b2dd))
- **main:** release greater 0.5.1 ([da9bcac](https://github.com/equaltoai/greater-components/commit/da9bcac9822716871cbd42f8150692874b8891f6))
- **main:** release greater 0.5.1 ([cfd8517](https://github.com/equaltoai/greater-components/commit/cfd851789d17847ae3d2a0eb04d71684b21fafe0))
- **main:** release greater 0.5.2 ([c8c2c51](https://github.com/equaltoai/greater-components/commit/c8c2c512d568659d9592a904abce812f552aa5ba))
- **main:** release greater 0.5.2 ([79ee5ab](https://github.com/equaltoai/greater-components/commit/79ee5abbaa0fcd69b4641a3b2927993f4919b8c5))
- **main:** release greater 0.5.3 ([e7f76c5](https://github.com/equaltoai/greater-components/commit/e7f76c5a7e61e8577ab140b9164edcbbf56b99a9))
- **main:** release greater 0.5.3 ([8708a78](https://github.com/equaltoai/greater-components/commit/8708a78631f6dfc425ea5a0f02b1da1c62f99ddc))
- **main:** release greater 0.5.4 ([dd71101](https://github.com/equaltoai/greater-components/commit/dd711019639341f1f90550e9f5fcd264923e1bf2))
- **main:** release greater 0.5.4 ([1138d79](https://github.com/equaltoai/greater-components/commit/1138d792ea52d59182f58e1083a746dab16b7e66))
- **main:** release greater 0.5.5 ([e141b5c](https://github.com/equaltoai/greater-components/commit/e141b5cc83256bfa5139036181564f02578d3a6d))
- **main:** release greater 0.5.5 ([a25b45a](https://github.com/equaltoai/greater-components/commit/a25b45af7af127ff8be6db6914c3106c361a3c5d))
- **main:** release greater 0.5.6 ([6d76465](https://github.com/equaltoai/greater-components/commit/6d7646585c1c53a0a5457012430462c4365e42c2))
- **main:** release greater 0.5.6 ([756ac61](https://github.com/equaltoai/greater-components/commit/756ac617916be6b684bbcb651282fc98c666312c))
- **main:** release greater 0.5.7 ([57734f6](https://github.com/equaltoai/greater-components/commit/57734f676f8c7612a56eb322799346ca0c22ba96))
- **main:** release greater 0.5.7 ([8cc42ab](https://github.com/equaltoai/greater-components/commit/8cc42abd54323e5667b0d7a8d6731d3ce48e7dcd))
- **main:** release greater 0.5.8 ([95edac2](https://github.com/equaltoai/greater-components/commit/95edac284e3e5df5dc7f89ae278386ffdfa12b55))
- **main:** release greater 0.5.8 ([8263395](https://github.com/equaltoai/greater-components/commit/82633957c991936cbb33d8d2b89dad0380499bff))
- merge premain into staging ([5401dc9](https://github.com/equaltoai/greater-components/commit/5401dc947959e547fca08ec7da624556f27abc1f))
- patch dependabot transitive alerts ([b87c223](https://github.com/equaltoai/greater-components/commit/b87c223dc839b862ddd1e46463f12c4285763c58))
- pin Lesser v1.1.10 + fix open issues ([a60c1e2](https://github.com/equaltoai/greater-components/commit/a60c1e204a512f7107ff36e2311d48756bb43afd))
- pin lesser v1.1.23 and lesser-host v0.1.0 contracts ([c47e701](https://github.com/equaltoai/greater-components/commit/c47e70193c0ada34aa08f2ece49b2068379b0fcc))
- **playground:** drop [@pai](https://github.com/pai) snippet ([484bfb4](https://github.com/equaltoai/greater-components/commit/484bfb4725485ec21d1336e9a2c5b6042ade83c2))
- **premain:** promote staging adapter sync ([282a959](https://github.com/equaltoai/greater-components/commit/282a95915b0cae995a46eab0926295f34dd5ed23))
- **premain:** promote staging adapter sync ([548e7a2](https://github.com/equaltoai/greater-components/commit/548e7a266f36b3202846bdf14fd80f6cb6d45823))
- **premain:** release greater 0.1.10-rc.0 ([315a795](https://github.com/equaltoai/greater-components/commit/315a7953d6b3877c768c38d65b6b20782666e0be))
- **premain:** release greater 0.1.10-rc.0 ([c01b453](https://github.com/equaltoai/greater-components/commit/c01b45380a1d832c0978fe505bb1200f491fe22c))
- **premain:** release greater 0.1.11-rc.0 ([c3dd48e](https://github.com/equaltoai/greater-components/commit/c3dd48e96f586e7cae787d6fc5d568382cd20b65))
- **premain:** release greater 0.1.11-rc.0 ([0d94f53](https://github.com/equaltoai/greater-components/commit/0d94f53bf84447a4ddc4239493c3d22b739e8bc9))
- **premain:** release greater 0.1.12-rc.0 ([bd75d6d](https://github.com/equaltoai/greater-components/commit/bd75d6d8174b0ce9ad6fe4c19adc17494bee8847))
- **premain:** release greater 0.1.12-rc.0 ([ec71322](https://github.com/equaltoai/greater-components/commit/ec71322c0efeb4194730f4b9d31f81d51b9936ca))
- **premain:** release greater 0.1.13-rc.0 ([0d1572a](https://github.com/equaltoai/greater-components/commit/0d1572a8226ee53f3c9e86284076c0b601c7fc02))
- **premain:** release greater 0.1.13-rc.0 ([69d79a3](https://github.com/equaltoai/greater-components/commit/69d79a32f47d260345192e73e62f163e41a224fa))
- **premain:** release greater 0.1.14-rc.0 ([d00b84d](https://github.com/equaltoai/greater-components/commit/d00b84d2d27c66dbc2fa2e43e6b8a181b4867696))
- **premain:** release greater 0.1.14-rc.0 ([20cd845](https://github.com/equaltoai/greater-components/commit/20cd8450daecb015bd8f7213305d5f97112614d6))
- **premain:** release greater 0.1.15-rc.0 ([13b45a1](https://github.com/equaltoai/greater-components/commit/13b45a1313a749bb77ff4afb8113fc8820ae7f09))
- **premain:** release greater 0.1.15-rc.0 ([e1c4e6a](https://github.com/equaltoai/greater-components/commit/e1c4e6a08eb12068c0f17d1b252d1ece86ed329c))
- **premain:** release greater 0.1.15-rc.1 ([a4e3c62](https://github.com/equaltoai/greater-components/commit/a4e3c629d1315f69d410db8a7377dca4ab0ffdd4))
- **premain:** release greater 0.1.15-rc.1 ([538dee2](https://github.com/equaltoai/greater-components/commit/538dee2a808f14c5e357250fd5b35db4fade5700))
- **premain:** release greater 0.1.16-rc.0 ([0fbf993](https://github.com/equaltoai/greater-components/commit/0fbf993256f120a7b632c80bece9eb918de52785))
- **premain:** release greater 0.1.16-rc.0 ([54eed32](https://github.com/equaltoai/greater-components/commit/54eed323791ee1ac483db64903a66aa841868748))
- **premain:** release greater 0.1.16-rc.0 ([0731fc4](https://github.com/equaltoai/greater-components/commit/0731fc4dae688130c4b6e4998e4f84311d75e12f))
- **premain:** release greater 0.1.16-rc.0 ([0856c42](https://github.com/equaltoai/greater-components/commit/0856c42967ce71adaf93e7e0f064573f4ba17d38))
- **premain:** release greater 0.1.17-rc.0 ([7dca1e8](https://github.com/equaltoai/greater-components/commit/7dca1e810ef99fae7b05c604590105246e3cba3c))
- **premain:** release greater 0.1.17-rc.0 ([b0a9c47](https://github.com/equaltoai/greater-components/commit/b0a9c47df11ed1191971130ffdfe6f733b8733d1))
- **premain:** release greater 0.1.18-rc.0 ([8072468](https://github.com/equaltoai/greater-components/commit/8072468a20b582b5ede83147cbd75ee75fa9426e))
- **premain:** release greater 0.1.18-rc.0 ([eca909a](https://github.com/equaltoai/greater-components/commit/eca909afefad47a48c9f17576059366966bf5a43))
- **premain:** release greater 0.1.19-rc.0 ([36f456b](https://github.com/equaltoai/greater-components/commit/36f456b77d7bb7a3bcbd628292f5a95e463fa939))
- **premain:** release greater 0.1.19-rc.0 ([b1a0e7f](https://github.com/equaltoai/greater-components/commit/b1a0e7fb64e7fc4c31b885193dffba7ea87251d0))
- **premain:** release greater 0.1.5-rc.0 ([732a24b](https://github.com/equaltoai/greater-components/commit/732a24b2a7e910cf3e0433cd948e4c97c197a42f))
- **premain:** release greater 0.1.5-rc.0 ([71a58b3](https://github.com/equaltoai/greater-components/commit/71a58b30c6e8c182aa3986910ef4019bac40ab5f))
- **premain:** release greater 0.1.6-rc.0 ([c0f824f](https://github.com/equaltoai/greater-components/commit/c0f824fe302b2f0d121a84b73ada5046dd15d2f0))
- **premain:** release greater 0.1.6-rc.0 ([172fe6f](https://github.com/equaltoai/greater-components/commit/172fe6f951466afa402b1a486160951a24c4fa25))
- **premain:** release greater 0.1.7-rc.0 ([28fe63e](https://github.com/equaltoai/greater-components/commit/28fe63e368431d6e202ad2ff2a59c31408233ba4))
- **premain:** release greater 0.1.7-rc.0 ([532c688](https://github.com/equaltoai/greater-components/commit/532c688b7cc54bfa4fb4bce307ddc89bac596663))
- **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
- **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
- **premain:** release greater 0.1.9-rc.0 ([c35b372](https://github.com/equaltoai/greater-components/commit/c35b372afa15e9ffc58c6e74a2cf9c04e8337ae6))
- **premain:** release greater 0.1.9-rc.0 ([07321c3](https://github.com/equaltoai/greater-components/commit/07321c3f4c3dd6d959fc11008107a8bdb4977ba9))
- **premain:** release greater 0.2.1-rc.0 ([fe728a3](https://github.com/equaltoai/greater-components/commit/fe728a315608dc30b3ab6a31bd086cc104cfc64b))
- **premain:** release greater 0.2.1-rc.0 ([348dcb7](https://github.com/equaltoai/greater-components/commit/348dcb774eb882275bb899f2586a24fba07c652e))
- **premain:** release greater 0.3.1-rc.0 ([a97cd2d](https://github.com/equaltoai/greater-components/commit/a97cd2d678ff1b65b720cd39b40979749e5261e2))
- **premain:** release greater 0.3.1-rc.0 ([7454aa1](https://github.com/equaltoai/greater-components/commit/7454aa107dfb1716b70b23599683dff1ae48574d))
- **premain:** release greater 0.4.1-rc.0 ([c0f50c0](https://github.com/equaltoai/greater-components/commit/c0f50c0c54a053085497f127299116c0344e75ea))
- **premain:** release greater 0.4.1-rc.0 ([63f8285](https://github.com/equaltoai/greater-components/commit/63f828590b8632e68d63dea774182b90970fcc32))
- **premain:** release greater 0.4.2-rc.0 ([627ba90](https://github.com/equaltoai/greater-components/commit/627ba90f1665cfd7bdd1cc52afed06dacc21123a))
- **premain:** release greater 0.4.2-rc.0 ([4601c8c](https://github.com/equaltoai/greater-components/commit/4601c8c434422fe330a6fa4aca651f84e1dbf2a6))
- **premain:** release greater 0.4.3-rc.0 ([80933c4](https://github.com/equaltoai/greater-components/commit/80933c47dee2178a0dbe462da6ce43511d22427c))
- **premain:** release greater 0.4.3-rc.0 ([2f911ab](https://github.com/equaltoai/greater-components/commit/2f911abc0e8516a2f2bfa3baeb4fa75265db1ab5))
- **premain:** release greater 0.4.4-rc.0 ([6e86938](https://github.com/equaltoai/greater-components/commit/6e86938e02d6cc52a7a642b8cffb664d8c01a398))
- **premain:** release greater 0.4.4-rc.0 ([55f8b66](https://github.com/equaltoai/greater-components/commit/55f8b664c3de11dae97889f59dfc7de8323a1c4c))
- **premain:** release greater 0.4.5-rc.0 ([58a5467](https://github.com/equaltoai/greater-components/commit/58a5467a37d0c2cb66709a510e8fd06423b003d9))
- **premain:** release greater 0.4.5-rc.0 ([ca99b3e](https://github.com/equaltoai/greater-components/commit/ca99b3e39f18a64135c885cbd5e2cf421ddc87be))
- **premain:** release greater 0.5.1-rc.0 ([7e9c698](https://github.com/equaltoai/greater-components/commit/7e9c6981d68f5c9d9e9950279865c80fdcb45dd6))
- **premain:** release greater 0.5.1-rc.0 ([e46916f](https://github.com/equaltoai/greater-components/commit/e46916f0e9ff7a2f92ecca11c79a8bab107ba054))
- **premain:** release greater 0.5.1-rc.1 ([802a8ef](https://github.com/equaltoai/greater-components/commit/802a8ef6a47923fb4c33b70cfbf574f2e2402dfc))
- **premain:** release greater 0.5.1-rc.1 ([a5a93d5](https://github.com/equaltoai/greater-components/commit/a5a93d5e98c42b9ccbeb6e167e1b262d58ec9c20))
- **premain:** release greater 0.5.2-rc.0 ([806f094](https://github.com/equaltoai/greater-components/commit/806f09420ca43822a32abbfb62a2a22e84815915))
- **premain:** release greater 0.5.2-rc.0 ([95554e6](https://github.com/equaltoai/greater-components/commit/95554e62d3a217041af32905a83e76aa7dab2d7d))
- **premain:** release greater 0.5.3-rc.0 ([a11219f](https://github.com/equaltoai/greater-components/commit/a11219f5772ccb8104439ae2a1ed9cd431ff403b))
- **premain:** release greater 0.5.3-rc.0 ([1ec7084](https://github.com/equaltoai/greater-components/commit/1ec7084ceae8eec7d060732232b7098277eb0e47))
- **premain:** release greater 0.5.4-rc.0 ([7501dd9](https://github.com/equaltoai/greater-components/commit/7501dd94af9c176daf9464bb35702e0c6fd511a6))
- **premain:** release greater 0.5.4-rc.0 ([f2fcc2a](https://github.com/equaltoai/greater-components/commit/f2fcc2a835ee13352382d1401e1030fbfe951c75))
- **premain:** release greater 0.5.5-rc.0 ([58c8944](https://github.com/equaltoai/greater-components/commit/58c89447bd2524aeccacdb413e9f408ab0d3f565))
- **premain:** release greater 0.5.5-rc.0 ([6a9df23](https://github.com/equaltoai/greater-components/commit/6a9df23e7ab0f780f9e372bdab561c61be6b9225))
- **premain:** release greater 0.5.6-rc.0 ([550fb61](https://github.com/equaltoai/greater-components/commit/550fb6179b3d25e4f47488e0b1987cd9386e8007))
- **premain:** release greater 0.5.6-rc.0 ([b0c5b86](https://github.com/equaltoai/greater-components/commit/b0c5b8625700b0f9b99aa62c415c51e6e2d4e701))
- **premain:** release greater 0.5.7-rc.0 ([70efc21](https://github.com/equaltoai/greater-components/commit/70efc21f94af546cd25dcf827da32cf028eaa3b6))
- **premain:** release greater 0.5.7-rc.0 ([8b37df2](https://github.com/equaltoai/greater-components/commit/8b37df2886595508d82f5204573b6d041fc6ceef))
- **premain:** release greater 0.5.8-rc.0 ([aa24900](https://github.com/equaltoai/greater-components/commit/aa24900ebc88cf1194d150d88614d605d2aa239b))
- **premain:** release greater 0.5.8-rc.0 ([20b8b3f](https://github.com/equaltoai/greater-components/commit/20b8b3f5c8afe530f7bcf8ae7d18742811886dda))
- **premain:** release greater 0.5.8-rc.1 ([a566b3c](https://github.com/equaltoai/greater-components/commit/a566b3c52c6ba090cb460b629f4140485db24193))
- **premain:** release greater 0.5.8-rc.1 ([9d4f84f](https://github.com/equaltoai/greater-components/commit/9d4f84fc5f71b33de6321b2ae26a93b2b1d4a9e0))
- **premain:** release greater 0.5.9-rc.0 ([89100a0](https://github.com/equaltoai/greater-components/commit/89100a0f3335113f9a6a52c73c690d0003a785d1))
- **premain:** release greater 0.5.9-rc.0 ([e6b6c5a](https://github.com/equaltoai/greater-components/commit/e6b6c5a2f325da9d36ada2035cb8de3d78443ab5))
- promote premain into main ([2ae6bbc](https://github.com/equaltoai/greater-components/commit/2ae6bbcf6a0a9a7e256c90bf188c13912ae7dc84))
- promote premain to main ([6831a05](https://github.com/equaltoai/greater-components/commit/6831a0546c000f25926deee7fab310cf3935d1aa))
- promote staging into premain ([19eddb3](https://github.com/equaltoai/greater-components/commit/19eddb33fd025be463efd0e4a620db5daa9a5e4c))
- promote staging to premain ([0a5170e](https://github.com/equaltoai/greater-components/commit/0a5170e4c23e572e37390cec1943dde624e4a630))
- promote staging to premain ([abc0eb6](https://github.com/equaltoai/greater-components/commit/abc0eb64b79466de07d90495fad75c2ca628091e))
- reconcile main promotion state ([1cf83aa](https://github.com/equaltoai/greater-components/commit/1cf83aa5553d395d0e82dfe775d935f15b0b9cf3))
- reconcile premain promotion state ([3b531f6](https://github.com/equaltoai/greater-components/commit/3b531f6c863bf6743d48167f07ec4d9c28178f7c))
- reconcile premain promotion state ([3a27a38](https://github.com/equaltoai/greater-components/commit/3a27a38f0892caf851a7ec78609cbfa3a2a559dc))
- reconcile premain promotion state ([493b13e](https://github.com/equaltoai/greater-components/commit/493b13e1ca02ecba541785979f2fd79da55f4e3c))
- reconcile staging promotion branches ([a04f0ca](https://github.com/equaltoai/greater-components/commit/a04f0ca3bd6f4376472ca795a985be3e5e54ce82))
- regenerate registry ([fe70f15](https://github.com/equaltoai/greater-components/commit/fe70f152ca7dc75f7a41fa04ae9e9ed713b40389))
- regenerate registry ([58abe16](https://github.com/equaltoai/greater-components/commit/58abe161740f37a93ec8d35b4df1d9a5d3fce339))
- regenerate registry ([1760bcc](https://github.com/equaltoai/greater-components/commit/1760bcc3ee8f1009462128dc01b25c1a929ad2cf))
- regenerate src type artifacts ([7bf3011](https://github.com/equaltoai/greater-components/commit/7bf3011db543b411156c0fb7d10d7d89b3bf2968))
- **registry:** regenerate index ([18cff39](https://github.com/equaltoai/greater-components/commit/18cff39803bbbd30f7cd72bdc24bdf0bafc56cd8))
- **registry:** regenerate index ([0cd0f1b](https://github.com/equaltoai/greater-components/commit/0cd0f1b1c44d346593fdf2cc6850167754a31581))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- **release:** prepare metadata ([97b429b](https://github.com/equaltoai/greater-components/commit/97b429bee6c1edc15b531e56719ed31c7bf087b8))
- **release:** prepare metadata ([cefd0bd](https://github.com/equaltoai/greater-components/commit/cefd0bdec17d4e1c1f41d12b5d573fd79f8ce8c3))
- **release:** prepare metadata ([ef1afa1](https://github.com/equaltoai/greater-components/commit/ef1afa1740bd0a0304c4ff12fa299f83bc3810ab))
- **release:** prepare metadata ([01bf8e9](https://github.com/equaltoai/greater-components/commit/01bf8e99f4fe36934ac29435b5c80aa65f4d5f43))
- **release:** prepare metadata ([89909f8](https://github.com/equaltoai/greater-components/commit/89909f8b3efa6f21fcdc2ab08f0b22a3de15bc1b))
- **release:** prepare metadata ([580e324](https://github.com/equaltoai/greater-components/commit/580e324d67c142d5bc4b36fc340069813576b9f4))
- **release:** prepare metadata ([ed25889](https://github.com/equaltoai/greater-components/commit/ed25889356215dea97fa43f66f61ad0b2fc0a541))
- **release:** prepare metadata ([480be09](https://github.com/equaltoai/greater-components/commit/480be09472323ae4bab9c3a5eb6a4146ad76385c))
- **release:** prepare metadata ([604a99f](https://github.com/equaltoai/greater-components/commit/604a99f4752bc11eb0820fd3ef9365e75e3b4893))
- **release:** prepare metadata ([6ae00c6](https://github.com/equaltoai/greater-components/commit/6ae00c654001d29a9307dd8a1ef81011959f41cc))
- **release:** prepare metadata ([8dc7f57](https://github.com/equaltoai/greater-components/commit/8dc7f57593b03a2167d87bbb705df55be0f49a0e))
- **release:** prepare metadata ([c159e24](https://github.com/equaltoai/greater-components/commit/c159e241d99286afeabacb52d0db51aa76a030d6))
- **release:** prepare metadata ([b8a1e18](https://github.com/equaltoai/greater-components/commit/b8a1e18a7e9e73a9af1cad5a379ccbf7300ef3be))
- **release:** prepare metadata ([05161d7](https://github.com/equaltoai/greater-components/commit/05161d76434af43342029e9fa80afa0d70d5319d))
- **release:** prepare metadata ([232e330](https://github.com/equaltoai/greater-components/commit/232e330b1787cb28f77976dd828deda211ab7d49))
- **release:** prepare metadata ([4bbdea4](https://github.com/equaltoai/greater-components/commit/4bbdea454487798cf34d354986bc1d7826184550))
- **release:** prepare metadata ([90a9b77](https://github.com/equaltoai/greater-components/commit/90a9b778b248cff2f4b0584ea8af62b64d062f42))
- **release:** prepare metadata ([ff847be](https://github.com/equaltoai/greater-components/commit/ff847be410a8aaa3e23916f35219c4073ce91fab))
- **release:** prepare metadata ([49985b4](https://github.com/equaltoai/greater-components/commit/49985b433a25ca5ae6640e8b5b291349fb66750c))
- **release:** prepare metadata ([6fb0736](https://github.com/equaltoai/greater-components/commit/6fb07369824bbe32a0cea45650aff47ba82a5cdc))
- **release:** prepare metadata ([56b348d](https://github.com/equaltoai/greater-components/commit/56b348d470f384d5c26a50d26c110b6bbaf5dd39))
- **release:** prepare metadata ([025467e](https://github.com/equaltoai/greater-components/commit/025467e65ca562b4985d4b27c54bc852d9851a55))
- **release:** prepare metadata ([8a923d9](https://github.com/equaltoai/greater-components/commit/8a923d9ebe5fef01b0c23708e1f8ba75b5edd9c4))
- **release:** prepare metadata ([83ce78c](https://github.com/equaltoai/greater-components/commit/83ce78ce37bd6590fba10cd5ae087fbdad1945a2))
- **release:** prepare metadata ([78117f0](https://github.com/equaltoai/greater-components/commit/78117f0af1560bd57ebcfb30ce880b1fd2088c80))
- **release:** prepare metadata ([e648c68](https://github.com/equaltoai/greater-components/commit/e648c68ba2f321b0b025da6c50823aef4634146b))
- **release:** prepare metadata ([d9b9510](https://github.com/equaltoai/greater-components/commit/d9b95107cde7657c8236d289bf5b8325cf12dc86))
- **release:** prepare metadata ([da8cc98](https://github.com/equaltoai/greater-components/commit/da8cc9824f1b898597726ba6cfeee80cd9af0326))
- **release:** prepare metadata ([2337162](https://github.com/equaltoai/greater-components/commit/2337162f5ba76bc7e59d1dba4e59ab8953ae2362))
- **release:** prepare metadata ([16ce94e](https://github.com/equaltoai/greater-components/commit/16ce94e9fab6871453bd5113ea87e6078b40b09f))
- **release:** prepare metadata ([4f1f6b8](https://github.com/equaltoai/greater-components/commit/4f1f6b8f88c48e6de1022df9bcef04909af08085))
- **release:** prepare metadata ([404f4ad](https://github.com/equaltoai/greater-components/commit/404f4ad5e72ca074fd3281e0c5d015deeb7089db))
- **release:** prepare metadata ([b3c8310](https://github.com/equaltoai/greater-components/commit/b3c83108430486d20a9370eb35105670a028abbd))
- **release:** prepare metadata ([17ea35d](https://github.com/equaltoai/greater-components/commit/17ea35d6ca301d8550befaf8a48974a1d41d9fea))
- **release:** prepare metadata ([f1ea82c](https://github.com/equaltoai/greater-components/commit/f1ea82cd088a57e00c02fde6f6a9147dc284ee86))
- **release:** prepare metadata ([4379cac](https://github.com/equaltoai/greater-components/commit/4379cac56ea23951531202ebdc49e8419a2c7f99))
- **release:** prepare metadata ([5c223e2](https://github.com/equaltoai/greater-components/commit/5c223e25b2ef230563fa3bf7a34b4820d9a6f8e8))
- **release:** prepare metadata ([1f929ab](https://github.com/equaltoai/greater-components/commit/1f929ab539b2c5096c00e26fa697fe0b2c4afcfd))
- **release:** prepare metadata ([84a143b](https://github.com/equaltoai/greater-components/commit/84a143b1dd990fe0019c6fafb65f03d123476ba0))
- **release:** prepare metadata ([207cc63](https://github.com/equaltoai/greater-components/commit/207cc63f280f8d523897fc512c0158d6b5ff7114))
- **release:** prepare metadata ([e2d7489](https://github.com/equaltoai/greater-components/commit/e2d7489b31a19d8766948156c3d33bf7c3a58043))
- **release:** prepare metadata ([9f83bd0](https://github.com/equaltoai/greater-components/commit/9f83bd089ce1f65f8645dcc67d152d9bdd127d48))
- **release:** prepare metadata ([38ce978](https://github.com/equaltoai/greater-components/commit/38ce978189f739a06bc65858e3c363b94901335a))
- **release:** prepare metadata ([dc957c0](https://github.com/equaltoai/greater-components/commit/dc957c0e79dd5d66c7ab2dba77a1b72d3b252701))
- **release:** prepare metadata ([d665069](https://github.com/equaltoai/greater-components/commit/d665069c5bfe443897250023407ffa6c6b12920e))
- **release:** prepare metadata ([85e6bf4](https://github.com/equaltoai/greater-components/commit/85e6bf431ec844ba66967b06f3049cdaab033f26))
- **release:** prepare metadata ([788a1c9](https://github.com/equaltoai/greater-components/commit/788a1c91af968f7c0e40d119d5e2b3e84518ba4c))
- **release:** prepare metadata ([f97aa37](https://github.com/equaltoai/greater-components/commit/f97aa37a5094f75a567871c61a08899b06dd36e1))
- **release:** prepare metadata ([34579db](https://github.com/equaltoai/greater-components/commit/34579db0e31cef88737e5cb0e232786b3d3798b6))
- **release:** prepare metadata ([d8ae17e](https://github.com/equaltoai/greater-components/commit/d8ae17ed46bf0fbfc68896a8b58fc70b167d21f1))
- **release:** prepare metadata ([8754c5b](https://github.com/equaltoai/greater-components/commit/8754c5b0306082c21245de6a3766017d2df6db0c))
- **release:** prepare metadata ([d073017](https://github.com/equaltoai/greater-components/commit/d0730175366cbcc918144519ac5dfb5063c0110b))
- **release:** prepare metadata ([7276ef3](https://github.com/equaltoai/greater-components/commit/7276ef39f4d998fa75d016132638b3fa8ca10e67))
- **release:** prepare metadata ([0b46575](https://github.com/equaltoai/greater-components/commit/0b465754b1063d99b0d1078e775a10bbda883646))
- **release:** prepare metadata ([0c69583](https://github.com/equaltoai/greater-components/commit/0c695831df309a10d522dbad42f58452bc515875))
- **release:** prepare metadata ([d3c0378](https://github.com/equaltoai/greater-components/commit/d3c0378b33f3945e5a12acee43791847775b1c48))
- **release:** prepare metadata ([8f3a64d](https://github.com/equaltoai/greater-components/commit/8f3a64d1226a84c6321947791006567fab84c49a))
- **release:** prepare metadata ([9e92fc9](https://github.com/equaltoai/greater-components/commit/9e92fc97e93b13c8521e517d40a64245b35e7882))
- **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))
- **release:** prepare metadata ([59b93e6](https://github.com/equaltoai/greater-components/commit/59b93e66e7af639ce9f8f2be5d1215910b8f7fe7))
- **release:** prepare metadata ([9f62828](https://github.com/equaltoai/greater-components/commit/9f62828301f7532fc0f7e27cb6dc31e965b3b29d))
- **release:** prepare metadata ([ed08549](https://github.com/equaltoai/greater-components/commit/ed0854991060157932b420fc46e42df24c45bf12))
- **release:** prepare metadata ([d9f731d](https://github.com/equaltoai/greater-components/commit/d9f731daf4f0a52080b55351d0bd8077280b6d74))
- **release:** prepare metadata ([4378aa3](https://github.com/equaltoai/greater-components/commit/4378aa3930cbf68320169f36105e01788356e8e5))
- **release:** prepare metadata ([e5d92bc](https://github.com/equaltoai/greater-components/commit/e5d92bcfe1a854e6238ac4b3f86bf9a2eff50166))
- run prettier ([f927a03](https://github.com/equaltoai/greater-components/commit/f927a03bd013bedd1702f3e142c1e60938f59ae8))
- stabilize registry metadata for promotions ([42b4f54](https://github.com/equaltoai/greater-components/commit/42b4f54e9d9818e8f6f35481a6a9a8934842e184))
- **staging:** backmerge main into staging ([49300c5](https://github.com/equaltoai/greater-components/commit/49300c5cf8d8b4b480f57dfff5549a72ddb16cac))
- **staging:** backmerge main into staging (repair promotion flow) ([5aec240](https://github.com/equaltoai/greater-components/commit/5aec24097c6404c95cd6d10cc4bf93d828d4e8a4))
- **staging:** backmerge premain into staging ([d906466](https://github.com/equaltoai/greater-components/commit/d906466b6eb819818a12cab7527f3224dd7fa479))
- **staging:** backmerge premain into staging ([5f4b78e](https://github.com/equaltoai/greater-components/commit/5f4b78e593fe5da09fad4d0a170c2a029f004dfb))
- **staging:** sync lesser contracts v1.1.53 ([98ed8c2](https://github.com/equaltoai/greater-components/commit/98ed8c263e5ba37d994e341492f88c9c105310b3))
- **staging:** sync lesser contracts v1.1.54 ([82fd622](https://github.com/equaltoai/greater-components/commit/82fd6228e9e27d11362ad9c5c3258de2a5d3a23e))
- **staging:** sync lesser v1.1.59 and lesser-host v1.1.6 ([9703101](https://github.com/equaltoai/greater-components/commit/970310107f0c799a977b1af791a0a3549d86ec31))
- **staging:** sync lesser v1.1.65 and lesser-host v0.1.21 ([cb64237](https://github.com/equaltoai/greater-components/commit/cb642376ab51462ff74479176ccb109461c26b58))
- sync lesser contracts and refresh dependencies ([ba941c0](https://github.com/equaltoai/greater-components/commit/ba941c01830eea459a3351755aeedfc5f97d199f))
- sync Lesser contracts and refresh dependencies ([8fe9cee](https://github.com/equaltoai/greater-components/commit/8fe9cee039f23cbfd946654a60b1134bd38a25c7))
- sync Lesser contracts v1.1.0 ([d41ccc0](https://github.com/equaltoai/greater-components/commit/d41ccc0de4dce9e2b599263e41823d5fa890c39b))
- sync Lesser contracts v1.1.0 ([d76b06b](https://github.com/equaltoai/greater-components/commit/d76b06bd2a4afe55c8d3f86d7b3716c2cf200d31))
- sync lesser contracts v1.1.53 ([2c8fdda](https://github.com/equaltoai/greater-components/commit/2c8fddabf63ccabc73117c308d75c5e4d7b99dc7))
- sync lesser contracts v1.1.54 ([65e54e0](https://github.com/equaltoai/greater-components/commit/65e54e05341e7c414329f439be09fe1284090e5d))
- sync lesser contracts v1.1.57 ([1357771](https://github.com/equaltoai/greater-components/commit/13577714d66f90ccc6733c9424396b6562e5d498))
- sync lesser contracts v1.1.59 ([30d9404](https://github.com/equaltoai/greater-components/commit/30d940403f8f2ffe52a2218a3c25a9f1870d337f))
- sync lesser contracts v1.1.64 ([628b09b](https://github.com/equaltoai/greater-components/commit/628b09bd488f16bc25eee238b30675f17eb0bacb))
- sync lesser contracts v1.1.65 ([b82bb26](https://github.com/equaltoai/greater-components/commit/b82bb26f9857d24c390deb95c2fe88b35f17e094))
- sync lesser v1.1.52 and refresh dependencies ([0fc9d8b](https://github.com/equaltoai/greater-components/commit/0fc9d8b087e59b4f6c097900822623e1cb02e65f))
- sync lesser v1.1.52 and refresh dependencies ([11ee095](https://github.com/equaltoai/greater-components/commit/11ee095af48f583cc7dda49e4e7adb26b98d7e35))
- sync lesser-host contracts v0.1.21 ([e9ccd00](https://github.com/equaltoai/greater-components/commit/e9ccd00fa20d78a7433a58c66e0c17529903f2d2))
- sync lesser-host contracts v1.1.6 ([c8fb023](https://github.com/equaltoai/greater-components/commit/c8fb023b901caae8e8aa426cf84da631a064aadd))
- sync main into staging release branch ([9c228b5](https://github.com/equaltoai/greater-components/commit/9c228b50bde702cb33eb8267f338a2c4fc3eb88e))
- sync main into staging release branch ([a629283](https://github.com/equaltoai/greater-components/commit/a62928369485eb907c1fe73affa1e6ac883437b4))
- sync main into staging release branch ([a8fd5b5](https://github.com/equaltoai/greater-components/commit/a8fd5b5754680de49e0b7ac8a3a61f1b7d31d3c5))
- sync main into staging release branch ([4349fb0](https://github.com/equaltoai/greater-components/commit/4349fb0da99ac49622e7eb9d5980312897187793))
- update registry checksums ([df448b6](https://github.com/equaltoai/greater-components/commit/df448b64e38e5e3b99a9c42f938086ff573723cd))

## [0.5.9-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.8-rc.1...greater-v0.5.9-rc.0) (2026-03-28)

### Features

- add agent face demo adoption path ([93aec51](https://github.com/equaltoai/greater-components/commit/93aec514138bdf142d9b0b6c655996b1205f9b45))
- add async workflow messaging surfaces ([d9ce302](https://github.com/equaltoai/greater-components/commit/d9ce3027c2d4c80b1d933b4c85a08c8d8fb3b9f4))
- add FaceTheory example and smoke coverage ([8bd2318](https://github.com/equaltoai/greater-components/commit/8bd2318c3703e4ea363c9ab493a8eb484618b64b))
- add host-provided face navigation contracts ([a772933](https://github.com/equaltoai/greater-components/commit/a772933004f2cff4276b1b1102d18f0687fc57c2))
- add reusable shared agent workflow surfaces ([81e05b7](https://github.com/equaltoai/greater-components/commit/81e05b71095f177d5036de7c19e85c4729a9b408))
- add shared agent workflow packages ([e3ca5a6](https://github.com/equaltoai/greater-components/commit/e3ca5a6a73d9c3b7c3627351149ad1157ac2000b))
- add SSR theme bootstrap helpers ([c1894be](https://github.com/equaltoai/greater-components/commit/c1894be95f05da97ecee62bbbfa1d6902942fa6d))
- add workflow lifecycle notifications ([a1832e2](https://github.com/equaltoai/greater-components/commit/a1832e2f19ef41645e56e9512d5f51b0dfbd666b))
- add workflow moments to shared chat ([35d3564](https://github.com/equaltoai/greater-components/commit/35d35648e85e5bfbaa9de1b116284cae50b9d279))
- compose agent profile and continuity surfaces ([3d978c8](https://github.com/equaltoai/greater-components/commit/3d978c83bf6314622cd6dfcd08cc648f8fd7e7f2))
- compose agent signing and declaration surfaces ([0e6675a](https://github.com/equaltoai/greater-components/commit/0e6675acb82b071bc296521b62d783fb7e9156e2))
- compose agent workflow inbox surfaces ([f90f246](https://github.com/equaltoai/greater-components/commit/f90f24663f36439fcbeff3cae05d90e24c09a4d5))
- freeze agent workflow package boundaries ([#387](https://github.com/equaltoai/greater-components/issues/387)) ([b308466](https://github.com/equaltoai/greater-components/commit/b308466083cf418e31631dddf2a13e431a24fd4e))
- freeze reusable agent workflow contracts ([#388](https://github.com/equaltoai/greater-components/issues/388)) ([6f4f980](https://github.com/equaltoai/greater-components/commit/6f4f980f30fed90af50b39bef172ad1b1e97d682))
- harden FaceTheory host boundaries and add smoke coverage ([7f506ad](https://github.com/equaltoai/greater-components/commit/7f506ad2479f0f699c82da3809c561fe8505b70d))
- map agent stitch anchors to reusable surfaces ([#389](https://github.com/equaltoai/greater-components/issues/389)) ([2fe69a5](https://github.com/equaltoai/greater-components/commit/2fe69a5428db34ba1a2efa76471545e625f82006))
- refresh lesser v1.2.0 and lesser-host v0.2.0 contracts ([63ce0b9](https://github.com/equaltoai/greater-components/commit/63ce0b9d8c92a4beaab998ca037881a07517b112))
- refresh lesser v1.2.0 contracts ([baa2c68](https://github.com/equaltoai/greater-components/commit/baa2c68a0840f30fbe8403d23b96de64bcdf42ba))
- scaffold canonical agent face exports ([89a9c63](https://github.com/equaltoai/greater-components/commit/89a9c6350fc0eb06e42511ccc0562639b2343180))

### Bug Fixes

- commit generated primitives declarations ([320f89c](https://github.com/equaltoai/greater-components/commit/320f89c1bdafea370be8f66950b16e27ace92015))
- complete workflow registry and grouping coverage ([4595d34](https://github.com/equaltoai/greater-components/commit/4595d342ad91492be88552d41dec53c5d95a48a3))
- harden facetheory example contract coverage ([08f5558](https://github.com/equaltoai/greater-components/commit/08f55583b318fdec82fe9af89ca0fb9e22050b57))
- harden SSR-safe face render paths ([eecad59](https://github.com/equaltoai/greater-components/commit/eecad593fe54166775217745005025fdaeb108d0))
- preserve agent face and workflow contracts ([493e996](https://github.com/equaltoai/greater-components/commit/493e996a4926ee9547cdcd44acddba6be509d4f0))
- preserve high-contrast preference overrides ([0b135e9](https://github.com/equaltoai/greater-components/commit/0b135e9e40609be25a3d77d62c41a5bbacd46f05))
- refresh registry checksums ([fea5ea9](https://github.com/equaltoai/greater-components/commit/fea5ea9b78ad63005421e03a1a2a13d6fea728bd))
- refresh registry checksums for agent workflow ([363e374](https://github.com/equaltoai/greater-components/commit/363e374f702187322c22a3de3fe9b7ce2af9efed))
- refresh workspace lockfile for agent packages ([967943f](https://github.com/equaltoai/greater-components/commit/967943fb2f588a5566cf267a2618e7d8cd8af193))
- satisfy CI registry and formatting checks ([9ac1526](https://github.com/equaltoai/greater-components/commit/9ac152617db037b5fba9a191d1d9159c3e783849))
- stabilize agent face ci build ([1ab307e](https://github.com/equaltoai/greater-components/commit/1ab307e4324c79fe3be7d47a41ea847744d63256))
- tighten agent workflow contracts and notification grouping ([45e773c](https://github.com/equaltoai/greater-components/commit/45e773c6285741a716fb13a2e270e9fbfe68a5e3))
- unblock agent face ci validation ([232eb7d](https://github.com/equaltoai/greater-components/commit/232eb7d443ed11eb15e96b27b46fcb0fd634b272))
- use workflow titles in grouped notifications ([d9a5043](https://github.com/equaltoai/greater-components/commit/d9a50433a23f78b3f8c3db5dbbc65c9b8f49d801))

### Refactors

- split browser presence tracking from store core ([e3fb9c3](https://github.com/equaltoai/greater-components/commit/e3fb9c34d6a3099e08fd1a7ef2701591399bafb0))

### Docs

- document agent face adoption patterns ([d5a3887](https://github.com/equaltoai/greater-components/commit/d5a388771963deadb480092928cd59610654d6f4))
- publish Simulacrum agent migration checklist ([8b40d4e](https://github.com/equaltoai/greater-components/commit/8b40d4e8d8602f5716d27554639e6aa8617ec216))

### Tests

- add agent face smoke coverage ([03de544](https://github.com/equaltoai/greater-components/commit/03de544f4f4011e5ce1d6b40bfcec1623841a588))

### Chores

- bump facetheory to v0.3.1 ([cbf9e6e](https://github.com/equaltoai/greater-components/commit/cbf9e6ece0d961f6d151135a8b14005678bfa9dc))
- finalize shared agent workflow surfaces ([6b63208](https://github.com/equaltoai/greater-components/commit/6b6320810ab6cf08bae011a56cc2aac793bb18bb))
- ignore repo-local codex workspace ([585398a](https://github.com/equaltoai/greater-components/commit/585398a0bc976b57658498877d1934b12ae85195))
- **main:** release greater 0.5.8 ([95edac2](https://github.com/equaltoai/greater-components/commit/95edac284e3e5df5dc7f89ae278386ffdfa12b55))
- **main:** release greater 0.5.8 ([8263395](https://github.com/equaltoai/greater-components/commit/82633957c991936cbb33d8d2b89dad0380499bff))
- patch dependabot transitive alerts ([b87c223](https://github.com/equaltoai/greater-components/commit/b87c223dc839b862ddd1e46463f12c4285763c58))
- reconcile main promotion state ([1cf83aa](https://github.com/equaltoai/greater-components/commit/1cf83aa5553d395d0e82dfe775d935f15b0b9cf3))
- reconcile premain promotion state ([493b13e](https://github.com/equaltoai/greater-components/commit/493b13e1ca02ecba541785979f2fd79da55f4e3c))
- reconcile staging promotion branches ([a04f0ca](https://github.com/equaltoai/greater-components/commit/a04f0ca3bd6f4376472ca795a985be3e5e54ce82))
- **release:** prepare metadata ([cefd0bd](https://github.com/equaltoai/greater-components/commit/cefd0bdec17d4e1c1f41d12b5d573fd79f8ce8c3))
- stabilize registry metadata for promotions ([42b4f54](https://github.com/equaltoai/greater-components/commit/42b4f54e9d9818e8f6f35481a6a9a8934842e184))

## [0.5.8](https://github.com/equaltoai/greater-components/compare/greater-v0.5.7...greater-v0.5.8) (2026-03-23)

### CI

- **deps:** bump pnpm/action-setup from 4 to 5 ([6051090](https://github.com/equaltoai/greater-components/commit/6051090056a24ea42c5a941beb07cdbe0c5b406b))

### Chores

- **deps-dev:** bump svelte from 5.54.0 to 5.54.1 in the svelte group ([3e3f57d](https://github.com/equaltoai/greater-components/commit/3e3f57d293192fdfbf50e1614859575f16b2e583))
- **deps-dev:** bump vite from 8.0.1 to 8.0.2 in the dependencies group across 1 directory ([f834fb8](https://github.com/equaltoai/greater-components/commit/f834fb8641cf5360007fc426d486bd4560690a9e))
- **deps-dev:** bump vite in the dependencies group across 1 directory ([6b56481](https://github.com/equaltoai/greater-components/commit/6b56481768ec4b2bf8ee16ccc146a1f0219e2bf2))
- **deps:** bump the dependencies group with 7 updates ([3bec0f0](https://github.com/equaltoai/greater-components/commit/3bec0f0441c95ec26b193a7e12b5c3dccf3a8611))
- **premain:** release greater 0.5.8-rc.0 ([aa24900](https://github.com/equaltoai/greater-components/commit/aa24900ebc88cf1194d150d88614d605d2aa239b))
- **premain:** release greater 0.5.8-rc.0 ([20b8b3f](https://github.com/equaltoai/greater-components/commit/20b8b3f5c8afe530f7bcf8ae7d18742811886dda))
- **premain:** release greater 0.5.8-rc.1 ([a566b3c](https://github.com/equaltoai/greater-components/commit/a566b3c52c6ba090cb460b629f4140485db24193))
- **premain:** release greater 0.5.8-rc.1 ([9d4f84f](https://github.com/equaltoai/greater-components/commit/9d4f84fc5f71b33de6321b2ae26a93b2b1d4a9e0))
- **release:** prepare metadata ([ef1afa1](https://github.com/equaltoai/greater-components/commit/ef1afa1740bd0a0304c4ff12fa299f83bc3810ab))
- **release:** prepare metadata ([01bf8e9](https://github.com/equaltoai/greater-components/commit/01bf8e99f4fe36934ac29435b5c80aa65f4d5f43))
- **staging:** sync lesser v1.1.65 and lesser-host v0.1.21 ([cb64237](https://github.com/equaltoai/greater-components/commit/cb642376ab51462ff74479176ccb109461c26b58))
- sync lesser contracts v1.1.65 ([b82bb26](https://github.com/equaltoai/greater-components/commit/b82bb26f9857d24c390deb95c2fe88b35f17e094))
- sync lesser-host contracts v0.1.21 ([e9ccd00](https://github.com/equaltoai/greater-components/commit/e9ccd00fa20d78a7433a58c66e0c17529903f2d2))
- sync main into staging release branch ([9c228b5](https://github.com/equaltoai/greater-components/commit/9c228b50bde702cb33eb8267f338a2c4fc3eb88e))

## [0.5.8-rc.1](https://github.com/equaltoai/greater-components/compare/greater-v0.5.8-rc.0...greater-v0.5.8-rc.1) (2026-03-23)

### Chores

- **deps-dev:** bump vite from 8.0.1 to 8.0.2 in the dependencies group across 1 directory ([f834fb8](https://github.com/equaltoai/greater-components/commit/f834fb8641cf5360007fc426d486bd4560690a9e))

## [0.5.8-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.7-rc.0...greater-v0.5.8-rc.0) (2026-03-23)

### CI

- **deps:** bump pnpm/action-setup from 4 to 5 ([6051090](https://github.com/equaltoai/greater-components/commit/6051090056a24ea42c5a941beb07cdbe0c5b406b))

### Chores

- **deps-dev:** bump svelte from 5.54.0 to 5.54.1 in the svelte group ([3e3f57d](https://github.com/equaltoai/greater-components/commit/3e3f57d293192fdfbf50e1614859575f16b2e583))
- **deps:** bump the dependencies group with 7 updates ([3bec0f0](https://github.com/equaltoai/greater-components/commit/3bec0f0441c95ec26b193a7e12b5c3dccf3a8611))
- **main:** release greater 0.5.7 ([57734f6](https://github.com/equaltoai/greater-components/commit/57734f676f8c7612a56eb322799346ca0c22ba96))
- **main:** release greater 0.5.7 ([8cc42ab](https://github.com/equaltoai/greater-components/commit/8cc42abd54323e5667b0d7a8d6731d3ce48e7dcd))
- **release:** prepare metadata ([89909f8](https://github.com/equaltoai/greater-components/commit/89909f8b3efa6f21fcdc2ab08f0b22a3de15bc1b))
- **staging:** sync lesser v1.1.65 and lesser-host v0.1.21 ([cb64237](https://github.com/equaltoai/greater-components/commit/cb642376ab51462ff74479176ccb109461c26b58))
- sync lesser contracts v1.1.65 ([b82bb26](https://github.com/equaltoai/greater-components/commit/b82bb26f9857d24c390deb95c2fe88b35f17e094))
- sync lesser-host contracts v0.1.21 ([e9ccd00](https://github.com/equaltoai/greater-components/commit/e9ccd00fa20d78a7433a58c66e0c17529903f2d2))
- sync main into staging release branch ([9c228b5](https://github.com/equaltoai/greater-components/commit/9c228b50bde702cb33eb8267f338a2c4fc3eb88e))

## [0.5.7](https://github.com/equaltoai/greater-components/compare/greater-v0.5.6...greater-v0.5.7) (2026-03-23)

### Chores

- **premain:** release greater 0.5.7-rc.0 ([70efc21](https://github.com/equaltoai/greater-components/commit/70efc21f94af546cd25dcf827da32cf028eaa3b6))
- **premain:** release greater 0.5.7-rc.0 ([8b37df2](https://github.com/equaltoai/greater-components/commit/8b37df2886595508d82f5204573b6d041fc6ceef))
- **release:** prepare metadata ([580e324](https://github.com/equaltoai/greater-components/commit/580e324d67c142d5bc4b36fc340069813576b9f4))
- sync lesser contracts v1.1.64 ([628b09b](https://github.com/equaltoai/greater-components/commit/628b09bd488f16bc25eee238b30675f17eb0bacb))
- sync main into staging release branch ([a629283](https://github.com/equaltoai/greater-components/commit/a62928369485eb907c1fe73affa1e6ac883437b4))

## [0.5.7-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.6-rc.0...greater-v0.5.7-rc.0) (2026-03-23)

### Chores

- **main:** release greater 0.5.6 ([6d76465](https://github.com/equaltoai/greater-components/commit/6d7646585c1c53a0a5457012430462c4365e42c2))
- **main:** release greater 0.5.6 ([756ac61](https://github.com/equaltoai/greater-components/commit/756ac617916be6b684bbcb651282fc98c666312c))
- **release:** prepare metadata ([ed25889](https://github.com/equaltoai/greater-components/commit/ed25889356215dea97fa43f66f61ad0b2fc0a541))
- sync lesser contracts v1.1.64 ([628b09b](https://github.com/equaltoai/greater-components/commit/628b09bd488f16bc25eee238b30675f17eb0bacb))
- sync main into staging release branch ([a629283](https://github.com/equaltoai/greater-components/commit/a62928369485eb907c1fe73affa1e6ac883437b4))

## [0.5.6](https://github.com/equaltoai/greater-components/compare/greater-v0.5.5...greater-v0.5.6) (2026-03-22)

### Chores

- format lesser-host contract snapshots ([27876f4](https://github.com/equaltoai/greater-components/commit/27876f4094c524adb35d584f99a8626c668d479f))
- **premain:** release greater 0.5.6-rc.0 ([550fb61](https://github.com/equaltoai/greater-components/commit/550fb6179b3d25e4f47488e0b1987cd9386e8007))
- **premain:** release greater 0.5.6-rc.0 ([b0c5b86](https://github.com/equaltoai/greater-components/commit/b0c5b8625700b0f9b99aa62c415c51e6e2d4e701))
- **release:** prepare metadata ([480be09](https://github.com/equaltoai/greater-components/commit/480be09472323ae4bab9c3a5eb6a4146ad76385c))
- **staging:** sync lesser v1.1.59 and lesser-host v1.1.6 ([9703101](https://github.com/equaltoai/greater-components/commit/970310107f0c799a977b1af791a0a3549d86ec31))
- sync lesser contracts v1.1.59 ([30d9404](https://github.com/equaltoai/greater-components/commit/30d940403f8f2ffe52a2218a3c25a9f1870d337f))
- sync lesser-host contracts v1.1.6 ([c8fb023](https://github.com/equaltoai/greater-components/commit/c8fb023b901caae8e8aa426cf84da631a064aadd))
- sync main into staging release branch ([a8fd5b5](https://github.com/equaltoai/greater-components/commit/a8fd5b5754680de49e0b7ac8a3a61f1b7d31d3c5))

## [0.5.6-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.5-rc.0...greater-v0.5.6-rc.0) (2026-03-22)

### Chores

- format lesser-host contract snapshots ([27876f4](https://github.com/equaltoai/greater-components/commit/27876f4094c524adb35d584f99a8626c668d479f))
- **main:** release greater 0.5.5 ([e141b5c](https://github.com/equaltoai/greater-components/commit/e141b5cc83256bfa5139036181564f02578d3a6d))
- **main:** release greater 0.5.5 ([a25b45a](https://github.com/equaltoai/greater-components/commit/a25b45af7af127ff8be6db6914c3106c361a3c5d))
- **release:** prepare metadata ([604a99f](https://github.com/equaltoai/greater-components/commit/604a99f4752bc11eb0820fd3ef9365e75e3b4893))
- **staging:** sync lesser v1.1.59 and lesser-host v1.1.6 ([9703101](https://github.com/equaltoai/greater-components/commit/970310107f0c799a977b1af791a0a3549d86ec31))
- sync lesser contracts v1.1.59 ([30d9404](https://github.com/equaltoai/greater-components/commit/30d940403f8f2ffe52a2218a3c25a9f1870d337f))
- sync lesser-host contracts v1.1.6 ([c8fb023](https://github.com/equaltoai/greater-components/commit/c8fb023b901caae8e8aa426cf84da631a064aadd))
- sync main into staging release branch ([a8fd5b5](https://github.com/equaltoai/greater-components/commit/a8fd5b5754680de49e0b7ac8a3a61f1b7d31d3c5))

## [0.5.5](https://github.com/equaltoai/greater-components/compare/greater-v0.5.4...greater-v0.5.5) (2026-03-22)

### Chores

- **premain:** release greater 0.5.5-rc.0 ([58c8944](https://github.com/equaltoai/greater-components/commit/58c89447bd2524aeccacdb413e9f408ab0d3f565))
- **premain:** release greater 0.5.5-rc.0 ([6a9df23](https://github.com/equaltoai/greater-components/commit/6a9df23e7ab0f780f9e372bdab561c61be6b9225))
- **release:** prepare metadata ([6ae00c6](https://github.com/equaltoai/greater-components/commit/6ae00c654001d29a9307dd8a1ef81011959f41cc))
- sync lesser contracts v1.1.57 ([1357771](https://github.com/equaltoai/greater-components/commit/13577714d66f90ccc6733c9424396b6562e5d498))
- sync main into staging release branch ([4349fb0](https://github.com/equaltoai/greater-components/commit/4349fb0da99ac49622e7eb9d5980312897187793))

## [0.5.5-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.4-rc.0...greater-v0.5.5-rc.0) (2026-03-22)

### Chores

- **main:** release greater 0.5.4 ([dd71101](https://github.com/equaltoai/greater-components/commit/dd711019639341f1f90550e9f5fcd264923e1bf2))
- **main:** release greater 0.5.4 ([1138d79](https://github.com/equaltoai/greater-components/commit/1138d792ea52d59182f58e1083a746dab16b7e66))
- **release:** prepare metadata ([8dc7f57](https://github.com/equaltoai/greater-components/commit/8dc7f57593b03a2167d87bbb705df55be0f49a0e))
- sync lesser contracts v1.1.57 ([1357771](https://github.com/equaltoai/greater-components/commit/13577714d66f90ccc6733c9424396b6562e5d498))
- sync main into staging release branch ([4349fb0](https://github.com/equaltoai/greater-components/commit/4349fb0da99ac49622e7eb9d5980312897187793))

## [0.5.4](https://github.com/equaltoai/greater-components/compare/greater-v0.5.3...greater-v0.5.4) (2026-03-20)

### Chores

- **premain:** release greater 0.5.4-rc.0 ([7501dd9](https://github.com/equaltoai/greater-components/commit/7501dd94af9c176daf9464bb35702e0c6fd511a6))
- **premain:** release greater 0.5.4-rc.0 ([f2fcc2a](https://github.com/equaltoai/greater-components/commit/f2fcc2a835ee13352382d1401e1030fbfe951c75))
- **release:** prepare metadata ([c159e24](https://github.com/equaltoai/greater-components/commit/c159e241d99286afeabacb52d0db51aa76a030d6))
- **staging:** sync lesser contracts v1.1.54 ([82fd622](https://github.com/equaltoai/greater-components/commit/82fd6228e9e27d11362ad9c5c3258de2a5d3a23e))
- sync lesser contracts v1.1.54 ([65e54e0](https://github.com/equaltoai/greater-components/commit/65e54e05341e7c414329f439be09fe1284090e5d))

## [0.5.4-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.3-rc.0...greater-v0.5.4-rc.0) (2026-03-20)

### Chores

- **main:** release greater 0.5.3 ([e7f76c5](https://github.com/equaltoai/greater-components/commit/e7f76c5a7e61e8577ab140b9164edcbbf56b99a9))
- **main:** release greater 0.5.3 ([8708a78](https://github.com/equaltoai/greater-components/commit/8708a78631f6dfc425ea5a0f02b1da1c62f99ddc))
- **release:** prepare metadata ([b8a1e18](https://github.com/equaltoai/greater-components/commit/b8a1e18a7e9e73a9af1cad5a379ccbf7300ef3be))
- **staging:** sync lesser contracts v1.1.54 ([82fd622](https://github.com/equaltoai/greater-components/commit/82fd6228e9e27d11362ad9c5c3258de2a5d3a23e))
- sync lesser contracts v1.1.54 ([65e54e0](https://github.com/equaltoai/greater-components/commit/65e54e05341e7c414329f439be09fe1284090e5d))

## [0.5.3](https://github.com/equaltoai/greater-components/compare/greater-v0.5.2...greater-v0.5.3) (2026-03-20)

### Features

- **adapters:** add lesser-host soul client utilities ([9e80a9b](https://github.com/equaltoai/greater-components/commit/9e80a9bee5150d0fc166ef5d514f567338910b19))
- **adapters:** sync lesser contract updates ([71fd0c1](https://github.com/equaltoai/greater-components/commit/71fd0c1e64f8925537ae51f2682a09f6ceec3a99))
- **adapters:** sync lesser contract updates ([76fa189](https://github.com/equaltoai/greater-components/commit/76fa1895a3b557f192486e12321dda05254da735))
- **adapters:** sync lesser graphql v1.1.28 ([9c15385](https://github.com/equaltoai/greater-components/commit/9c153850d123a7f892b5f997c97158ff04225bb1))
- **adapters:** sync lesser graphql v1.1.28 ([723e5f8](https://github.com/equaltoai/greater-components/commit/723e5f87ec7336c5b1e5945719c948d45f537316))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([a043b15](https://github.com/equaltoai/greater-components/commit/a043b15f594bfcef1f46b807d8676f746b84f078))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([812335b](https://github.com/equaltoai/greater-components/commit/812335b117e5e3cfa59a380fb8e92bcf37f65995))
- **adapters:** sync lesser v1.1.27 soul inventory ([c3f4be0](https://github.com/equaltoai/greater-components/commit/c3f4be09f905483e8732866a11e7f1061cdb6556))
- **adapters:** sync lesser v1.1.27 soul inventory ([c02324b](https://github.com/equaltoai/greater-components/commit/c02324b1c540551a3965cdc7390dc8ec48991f9c))
- **adapters:** sync lesser v1.1.29 ([b5ef6a2](https://github.com/equaltoai/greater-components/commit/b5ef6a2fcda43a74ec0ccbd7b665b4add8a0a3d0))
- **adapters:** sync lesser v1.1.29 ([eb512c7](https://github.com/equaltoai/greater-components/commit/eb512c7fc9dc970368a8b0c2848deecaf90f2f46))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([915021e](https://github.com/equaltoai/greater-components/commit/915021e5bf5f5aaedc45c93244d17b5b43f3af3a))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([6d9bd15](https://github.com/equaltoai/greater-components/commit/6d9bd153c28de85e72a782606fa0794e79a696e5))
- **adapters:** sync lesser-host v0.1.7 ([ebc93eb](https://github.com/equaltoai/greater-components/commit/ebc93eb598161e24c57f8e87dd11e5e517326cc6))
- **adapters:** sync lesser-host v0.1.7 and bump dependencies ([5e3b614](https://github.com/equaltoai/greater-components/commit/5e3b61462f98d02eed06862744458a56ccc6931c))
- Add DefinitionItem and DefinitionList components, wallet icon, and truncateMiddle utility to the registry. ([e1d1597](https://github.com/equaltoai/greater-components/commit/e1d159717a8f14f727f5e6df780754e0da5bf370))
- Add initial system configuration and logging setup under the new .theory directory. ([7320f65](https://github.com/equaltoai/greater-components/commit/7320f65c6d4e011df71d599b624d22cca5d9c151))
- Add Wallet icon, introduce DefinitionList components, and include truncateMiddle utility. ([85f5c54](https://github.com/equaltoai/greater-components/commit/85f5c54c51093cd0f08c7fe40f2778503be215f7))
- **admin:** improve moderation workflows ([1b5c2d4](https://github.com/equaltoai/greater-components/commit/1b5c2d4acf790e17cc80f585f9f0125ef23c902e)), closes [#154](https://github.com/equaltoai/greater-components/issues/154)
- Adopt Svelte 5 `$derived` for reactive computations and update notification color representation in tests. ([8bdaf5b](https://github.com/equaltoai/greater-components/commit/8bdaf5b215836686e280c2fb1e64a6cc630262f6))
- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))
- **cli:** add doctor --csp and strict CSP docs ([1cfdd12](https://github.com/equaltoai/greater-components/commit/1cfdd12300e4862b414cd563d3116775ef4d3b84))
- **csp:** Add CSP compliance baseline, audit tooling, and refactor core primitives ([7b7ccb3](https://github.com/equaltoai/greater-components/commit/7b7ccb39f8636481ae65babce69550014e2fe6be))
- **csp:** Refactor theme and layout primitives to eliminate inline styles ([3a38517](https://github.com/equaltoai/greater-components/commit/3a385179b670c4103ca55b6552655acc35e0d717))
- Generate Lesser API REST client from OpenAPI spec and update Gr… ([5658b8f](https://github.com/equaltoai/greater-components/commit/5658b8f7dae93b0de5b2039ab4089b3b7b442184))
- Generate Lesser API REST client from OpenAPI spec and update GraphQL types. ([4802336](https://github.com/equaltoai/greater-components/commit/4802336a5d085d6eed0213cef64be14077f66f37))
- Introduce strict CSP compatibility with new documentation, theme initialization, and build scripts. ([0d9543f](https://github.com/equaltoai/greater-components/commit/0d9543f7eaa21870b3b397c99ecd6a554b9b7972))
- **messaging:** allow background refresh ([fba11d5](https://github.com/equaltoai/greater-components/commit/fba11d5208add59c540dbca992afed1fc1989c06))
- **messaging:** delete-for-me (M4) ([f5c1501](https://github.com/equaltoai/greater-components/commit/f5c15016935c9e2cf9b667384f0242b79ee5cefb))
- **messaging:** inbox/requests dm handlers ([d579ac8](https://github.com/equaltoai/greater-components/commit/d579ac86822e043299f96e5bec81cbb2c7dc7be1))
- **messaging:** realtime updates (M5) ([d28af50](https://github.com/equaltoai/greater-components/commit/d28af5054e43b82ab7309e91505037b294f80f6b))
- **notifications:** render communication notifications ([4b645f8](https://github.com/equaltoai/greater-components/commit/4b645f8217c21bd4a1ecdb5583917867331e4491))
- **notifications:** support communication payloads ([1b1f5a1](https://github.com/equaltoai/greater-components/commit/1b1f5a1575e3a8c0c437587658d70a706764f7c3))
- Pin component references to commit SHAs for consistent fetching, diffing, and updating. ([6a3eb44](https://github.com/equaltoai/greater-components/commit/6a3eb440ddd5163019ec5bac8065bd568fd0704b))
- **prefs:** expose dm delivery setting ([b7d7fee](https://github.com/equaltoai/greater-components/commit/b7d7feecd4953b441cb17414d0c863e6fd7026a8))
- **social:** add Unicode fallback to CustomEmojiPicker ([43ff72f](https://github.com/equaltoai/greater-components/commit/43ff72f9d7bd3f8b8e70e40df4712d30ceb22f62))
- **social:** improve post interactions ([c6c12bf](https://github.com/equaltoai/greater-components/commit/c6c12bf83cdf52fbb5029d4db92480d0a7c06c20)), closes [#153](https://github.com/equaltoai/greater-components/issues/153)
- **soul:** add channels and preferences UI components ([1bd005b](https://github.com/equaltoai/greater-components/commit/1bd005b88ed663acd7c46437d30c0602aecc5cb3))

### Bug Fixes

- **a11y:** keep status roles out of feed ([724abfb](https://github.com/equaltoai/greater-components/commit/724abfbec3363004deecc2655c73324928506519))
- **adapters:** default empty conversations results ([32500ad](https://github.com/equaltoai/greater-components/commit/32500ad2e1e1055ad8418bf02daf8a88e2d1386e)), closes [#210](https://github.com/equaltoai/greater-components/issues/210)
- **adapters:** guard conversation participant id ([0c9db51](https://github.com/equaltoai/greater-components/commit/0c9db51e2387396487d9bfbf04cc0e292fe63e7e))
- **adapters:** handle empty GraphQL query results ([58c7bfe](https://github.com/equaltoai/greater-components/commit/58c7bfece1a56eb97bab549f6c206000525d60bf))
- **adapters:** pin Lesser v1.1.11 + suppress empty conversations error ([f4b21c0](https://github.com/equaltoai/greater-components/commit/f4b21c0049b10af8b5a605e4b7648b9a59579989))
- **adapters:** satisfy lint and registry validation ([d5cd018](https://github.com/equaltoai/greater-components/commit/d5cd018efe73814042d0ef617695dc9ce78ef2fa))
- **adapters:** trim baseUrl without regex ([f3cbe99](https://github.com/equaltoai/greater-components/commit/f3cbe9900a7f3fac06f569fdd167236c01f09683))
- **admin:** use valid Button variant ([638824f](https://github.com/equaltoai/greater-components/commit/638824ff110a150621058572f7ad09e2d94523f3))
- **ci:** accept semver and format registry index ([ed61735](https://github.com/equaltoai/greater-components/commit/ed617350a74be11c979eda014b51be509b78ac14))
- **ci:** configure git identity for release tags ([90784db](https://github.com/equaltoai/greater-components/commit/90784db0f72cbc0ad4eae1207f0155629d571847))
- **ci:** git identity for tag release ([d8372fa](https://github.com/equaltoai/greater-components/commit/d8372fa974dff37baa4f345ff893c27d94f41db0))
- **ci:** pass lint workflow ([d6a1c96](https://github.com/equaltoai/greater-components/commit/d6a1c96df1dfb813a5d9a2b6803ed7e5a7505c4b))
- **ci:** release guard semver regex ([0ddfefc](https://github.com/equaltoai/greater-components/commit/0ddfefc8f62753b0a8b00f594c4cd85b97a61990))
- **ci:** resolve lint/format/test failures ([634e629](https://github.com/equaltoai/greater-components/commit/634e6290b33d687e7100f01d620640a77a55768d))
- **ci:** skip a11y comments on fork PRs ([8d44561](https://github.com/equaltoai/greater-components/commit/8d445617cf6308c70e0202c0d2c80a116722a950))
- **ci:** skip coverage comments on fork PRs ([e3f7fee](https://github.com/equaltoai/greater-components/commit/e3f7fee538a6794baa36067ed732b4aa437b82cc))
- **cli,social:** install social timeline + virtual scrolling ([92c544f](https://github.com/equaltoai/greater-components/commit/92c544f463204136410097978fa2f7781f8da15b)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **cli:** include admin Agents files in vendored installs ([68c8541](https://github.com/equaltoai/greater-components/commit/68c8541aec282ef3a17add072ee46fc55ba114e3))
- **cli:** reliable CSS + consistent release artifacts ([68649a9](https://github.com/equaltoai/greater-components/commit/68649a92d6b8d30ba304b36462bfb72d13d6aa3b))
- **cli:** skip local CSS import injection when local CSS copy fails ([5ac951b](https://github.com/equaltoai/greater-components/commit/5ac951bfedbc5e2f9c18616f3b7c0aca9be09bf0))
- **cli:** skip local CSS injection when copy fails ([fc52dbc](https://github.com/equaltoai/greater-components/commit/fc52dbcbf9c23ed8b77f0e0b1166d41a75d17df9))
- **cli:** stabilize local CSS + ref fetching ([4fd1c25](https://github.com/equaltoai/greater-components/commit/4fd1c257d1cd612ff9b5810888990bd84020c859))
- **cli:** update full core package file sets ([0757d28](https://github.com/equaltoai/greater-components/commit/0757d28759e7dd99af091c6b59d8460fc2a49bd9))
- **cli:** update full core package file sets ([16df66b](https://github.com/equaltoai/greater-components/commit/16df66b8d9cebcf2113b997a748551b63f97ccea))
- **compose:** include new object fields in optimistic updates ([9f28a34](https://github.com/equaltoai/greater-components/commit/9f28a3440484eec3906b8fd32c22ecc792c32fd2))
- **csp:** make primitives transitions WAAPI-based ([703b1bd](https://github.com/equaltoai/greater-components/commit/703b1bda9aafd3d5b9939c8c6af160725fae502a))
- **csp:** remove inline style writes from utils ([79bb770](https://github.com/equaltoai/greater-components/commit/79bb770ec53125f283e9f2310d4012d174a764df))
- **csp:** remove inline styles from virtualized timelines ([22aa0fc](https://github.com/equaltoai/greater-components/commit/22aa0fc2a8f4d041cf92f92f4ead819337774742))
- **csp:** remove runtime inline-style writes from primitives ([b4e8a3d](https://github.com/equaltoai/greater-components/commit/b4e8a3dcf541bc3e0862692c864cd254a6aa831f))
- **csp:** remove runtime style injection from artist face ([c62a4d9](https://github.com/equaltoai/greater-components/commit/c62a4d979e74d3d9292bc1b8c89d71f8c4b92dfe))
- **csp:** remove runtime style writes from headless ([9858a2b](https://github.com/equaltoai/greater-components/commit/9858a2bc563480b9f2eb54be7a7d1fd2776c9971))
- **csp:** replace textarea autosize with CSS-driven helper ([c845b6a](https://github.com/equaltoai/greater-components/commit/c845b6a205af850efd3a9e9fca8746742ae56110))
- **csp:** strict CSP issue sweep ([#180](https://github.com/equaltoai/greater-components/issues/180), [#187](https://github.com/equaltoai/greater-components/issues/187)–[#195](https://github.com/equaltoai/greater-components/issues/195)) ([241aeab](https://github.com/equaltoai/greater-components/commit/241aeabfc01754668dad1a2fca5aa54492bcf9e5))
- **deps:** align undici override with lockfile ([5c2ae6b](https://github.com/equaltoai/greater-components/commit/5c2ae6b2fadd3f7bbe806c3630746176e7e1f976))
- **deps:** patch flatted vulnerability ([9b20492](https://github.com/equaltoai/greater-components/commit/9b20492b3620bd5c93f6f2c56b731b0bc9168bfe))
- **docs:** make theme init typecheck-safe ([3700db6](https://github.com/equaltoai/greater-components/commit/3700db6ec258449a7f4a4d042275d78d96da0672))
- **docs:** remove stale svelte config suppression ([35ede19](https://github.com/equaltoai/greater-components/commit/35ede19557a92eb8be1b89b8e5b0e35e4bde750c))
- **graphql:** pin Lesser v1.1.1 + expand fragments ([d68fd59](https://github.com/equaltoai/greater-components/commit/d68fd592e3e1e18b0bd08d925a5d6a1d2afbf19b)), closes [#168](https://github.com/equaltoai/greater-components/issues/168)
- make social scaffold pass strict checks ([a72e19b](https://github.com/equaltoai/greater-components/commit/a72e19b5d54e1c932a91dea20e096d06d46e3560)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **notifications:** add utils dependency ([3400e55](https://github.com/equaltoai/greater-components/commit/3400e553cde5bae810037bdcca9600f68c58af83))
- **playground:** bind search context ([ac0aa64](https://github.com/equaltoai/greater-components/commit/ac0aa64c912d8bb0f92c87ee3253282a3e755ea9))
- **playground:** prevent icon gallery crash ([5086560](https://github.com/equaltoai/greater-components/commit/5086560fd147546b7079fd5d0d394978a66a7ffa))
- reduce social face svelte-check errors ([2833ed4](https://github.com/equaltoai/greater-components/commit/2833ed4ee12b79eb4a3dbcac5ffe97f00d9379d7)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **registry:** align staging release metadata ([8bfc673](https://github.com/equaltoai/greater-components/commit/8bfc6735580edb8b90efbe89d8e9f2d22e6bc41f))
- **registry:** keep index ref on release tag ([6664cdb](https://github.com/equaltoai/greater-components/commit/6664cdb208ab951fa8c2861a2eca6ed5645ddefe))
- **registry:** refresh checksums after warning cleanup ([76250a5](https://github.com/equaltoai/greater-components/commit/76250a5e8fcd8af84afe63a9c7b69fe0f68192b5))
- **registry:** regenerate index ([43978b6](https://github.com/equaltoai/greater-components/commit/43978b6d293e385c040a96274f19302dbcb1c93d))
- **registry:** regenerate index ([17142da](https://github.com/equaltoai/greater-components/commit/17142da9d2b3f847cb9b856afd7d2fcb46ba246d))
- **registry:** regenerate index checksums ([f83435b](https://github.com/equaltoai/greater-components/commit/f83435b1c451771160d4aaeb2b74955c434537d5))
- **registry:** regenerate index checksums ([6e5b47b](https://github.com/equaltoai/greater-components/commit/6e5b47b29013f761bb4332a671590f2261d905e0))
- **security:** handle malformed closing script tags ([5fc4091](https://github.com/equaltoai/greater-components/commit/5fc409190dc2ac4e297c07d518e2d7c4b2a9d59d))
- **security:** harden CSP script tag regex ([3149603](https://github.com/equaltoai/greater-components/commit/31496039869acaa0c85583cc21e0abc8499cbc7d))
- **security:** harden HTML rendering and path handling ([d6f3bc9](https://github.com/equaltoai/greater-components/commit/d6f3bc94f52e9ffa778ce2a349110abc198723fa))
- **security:** harden HTML rendering and path handling ([f871ece](https://github.com/equaltoai/greater-components/commit/f871ece4e14464ee60d0ff1aa0315fa8c7ae826e))
- **social:** remove global BackupCodes theme styles ([8c9405a](https://github.com/equaltoai/greater-components/commit/8c9405adbf6bbf45941df99255b6d3c5264e4964))
- **soul:** satisfy strict svelte-check ([0603c37](https://github.com/equaltoai/greater-components/commit/0603c377420e7b28e5467b286876af2c4fc63be0))
- **staging:** patch flatted vulnerability ([c0d6109](https://github.com/equaltoai/greater-components/commit/c0d6109afd70b3b76ae36457b8e5c3c587a99b9f))
- Update date format test to handle year boundary edge case ([702b60e](https://github.com/equaltoai/greater-components/commit/702b60ecbde892bc00c27ebeb9b0f822d3073666))
- update Svelte check configuration and enhance accessibility report generation ([1ffd17c](https://github.com/equaltoai/greater-components/commit/1ffd17c36eae39f2a140ab057e462991cf9ab5f9))

### Refactors

- Clean up linting ignores and enhance gallery grid `aria-label` for improved accessibility. ([b671736](https://github.com/equaltoai/greater-components/commit/b671736cdadb7b8fbc5ecd50599ae7909f3b8355))
- streamline JSON formatting in registry index generation ([158d0ad](https://github.com/equaltoai/greater-components/commit/158d0ad9c82d2c039f4033d1f48ff8ab1e5af231))
- update numerous Svelte components, tests, and styling across artist, social, blog, and shared packages, and adjust CSP auditing. ([bf1791b](https://github.com/equaltoai/greater-components/commit/bf1791ba832f79d6c632918eca8d007d8ce91f27))
- update primitive components, their tests, and menu positioning logic. ([015f17d](https://github.com/equaltoai/greater-components/commit/015f17d0cbb591bd15e828a4bee48e295399f1c5))

### Docs

- add issue sweep plan for open issues ([7e9c169](https://github.com/equaltoai/greater-components/commit/7e9c169b7d4199341cbf20c07955acd0c0d77d71))
- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))
- **devops:** define release criteria ([30afbf1](https://github.com/equaltoai/greater-components/commit/30afbf17e7d1a445247d5a2c0587a45a8436d691))

### CI

- adopt premain/main release flow ([b44e1b5](https://github.com/equaltoai/greater-components/commit/b44e1b58c7765396e4b3258974169a284f769188))
- adopt premain/main release flow ([ff1bf38](https://github.com/equaltoai/greater-components/commit/ff1bf382af8c348672353ff31f93bba36ebf9669))
- **coverage:** make workflow dispatchable ([52a06d0](https://github.com/equaltoai/greater-components/commit/52a06d09f57dc9d7df0b9c6a7b8cac2981ba47a1))
- **deps:** bump artifact actions ([6bcd038](https://github.com/equaltoai/greater-components/commit/6bcd03801a04a4af9e613094907a7a90dfcbadeb))
- dispatch main/premain guard checks ([9d315de](https://github.com/equaltoai/greater-components/commit/9d315debb4b03114bf1006bebb303e5fcda335b8))
- dispatch main/premain guard checks ([c3a2607](https://github.com/equaltoai/greater-components/commit/c3a260740b07fd76d4f951f8d658da2ff0985618))
- make Codecov upload optional ([e4b96c2](https://github.com/equaltoai/greater-components/commit/e4b96c21b946a65cd4f11edc71a6eb00280ca6c2))
- make Codecov upload optional ([bed813d](https://github.com/equaltoai/greater-components/commit/bed813d133ef4a723fbe1f90bab3ca62ba2baade))
- **prerelease:** ignore stable manifest changes ([f087528](https://github.com/equaltoai/greater-components/commit/f087528bb68ef9aba9cf184739e861470cd26d57))
- **release:** keep premain prereleases ahead of stable ([af0d06b](https://github.com/equaltoai/greater-components/commit/af0d06b4c1df9353ac64b22371e1cf2040048c86))
- **release:** keep premain prereleases ahead of stable ([dec045f](https://github.com/equaltoai/greater-components/commit/dec045fb6d3d41d3eca10dc8c51094d63ee3dcb4))
- **release:** keep premain release-as prerelease ([44853fe](https://github.com/equaltoai/greater-components/commit/44853fe6e958ffa8a0c6d134d860d547fa54f310))
- **release:** release-please should include chore commits ([7d450f8](https://github.com/equaltoai/greater-components/commit/7d450f850c189a7da50099dbad7e558da265e9c4))
- **release:** treat chore commits as user-facing ([5a3b5e0](https://github.com/equaltoai/greater-components/commit/5a3b5e0b9654be1960c0551a46b09f738afff1f1))
- **release:** unify build + pack pipeline ([ab70579](https://github.com/equaltoai/greater-components/commit/ab705792be3d497409ea1661be5512cb18ba914d))
- streamline staging checks ([b57ca93](https://github.com/equaltoai/greater-components/commit/b57ca9346fb8a7021db16116bdc957b503d7c5fa))

### Tests

- fix wrappers and headless mocks ([14b624b](https://github.com/equaltoai/greater-components/commit/14b624b841691941bde23100a5edc1e8311a6dca))

### Chores

- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([7b8c0d6](https://github.com/equaltoai/greater-components/commit/7b8c0d633e9e76e79a0943e6c6c721eb5c435b2c))
- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([d4fd4e3](https://github.com/equaltoai/greater-components/commit/d4fd4e39d6518025996bc0e72142ece720c73e1a))
- add changeset and format new CLI files ([78adf68](https://github.com/equaltoai/greater-components/commit/78adf68841307a84b3df951bb5a6a724a59ff0f7))
- align versions and automate releases ([d0d449b](https://github.com/equaltoai/greater-components/commit/d0d449bb72358549815e8e42851267ace75a4a6a))
- align versions and automate releases ([6c9496f](https://github.com/equaltoai/greater-components/commit/6c9496f3d7efa4902f604b9aacf5cf3b112c539f))
- backmerge main into premain ([4925504](https://github.com/equaltoai/greater-components/commit/492550499fa69c84e8e0c421cb0ac53b971a8920))
- backmerge main into premain ([8e71eb1](https://github.com/equaltoai/greater-components/commit/8e71eb1b3a1fd4c12d7f8a76ff4286d5519b83bb))
- backmerge main into premain ([e611522](https://github.com/equaltoai/greater-components/commit/e611522b33c4ffa43be5c81d3d19aaa773579515))
- backmerge main into premain ([9a56db0](https://github.com/equaltoai/greater-components/commit/9a56db0365c6d4b53dc6e0746db9018a49a956d0))
- backmerge main into premain ([ae103e6](https://github.com/equaltoai/greater-components/commit/ae103e689a6246cdb5a54f229e16bc739430114a))
- backmerge main into premain ([04e265f](https://github.com/equaltoai/greater-components/commit/04e265f44442dfea7841b9b3607b3e64be9c7594))
- backmerge main into premain ([fdf8266](https://github.com/equaltoai/greater-components/commit/fdf8266bc275606183afc684dd7d1fc2d6bb1378))
- backmerge main into premain ([31cc7aa](https://github.com/equaltoai/greater-components/commit/31cc7aab4c70967a93743e47c6b2b12b55b65136))
- backmerge main into staging ([bcb6e55](https://github.com/equaltoai/greater-components/commit/bcb6e554ec6953131a859c3fb767a517ed874275))
- backmerge main into staging ([eacd418](https://github.com/equaltoai/greater-components/commit/eacd41859475c6fac063b40e4b7fcef4fbcbc2ac))
- backmerge premain into staging ([57ea8c1](https://github.com/equaltoai/greater-components/commit/57ea8c1093630d3d3c4104257cc29a8feead8fca))
- backmerge premain into staging ([01e2942](https://github.com/equaltoai/greater-components/commit/01e2942c35c362e7d38923f359f3d7feb65612ca))
- backmerge premain into staging ([9cfb655](https://github.com/equaltoai/greater-components/commit/9cfb655745de8345691bd2302881410adbe1cb56))
- backmerge premain into staging ([abd6805](https://github.com/equaltoai/greater-components/commit/abd6805136bdfbbc01208f859e6cd982f58d9d3e))
- backmerge premain into staging ([b7fe9fb](https://github.com/equaltoai/greater-components/commit/b7fe9fb091b54202b764ffba693478f24e7adad4))
- backmerge premain into staging ([b52676d](https://github.com/equaltoai/greater-components/commit/b52676d60fefa9a6f1b027684dac079929285a2d))
- backmerge premain into staging ([ee5d81c](https://github.com/equaltoai/greater-components/commit/ee5d81ce4a17202df4a1b773eb8bb6ca272c633d))
- backmerge premain into staging ([ff92e4c](https://github.com/equaltoai/greater-components/commit/ff92e4cbf8426191120b36b21583493ba340200b))
- backmerge premain into staging ([7f259f7](https://github.com/equaltoai/greater-components/commit/7f259f7aa6852ee3ebb54a4a7629c879a611c258))
- bump svelte to 5.53.0 ([9d6a300](https://github.com/equaltoai/greater-components/commit/9d6a300f6032dd345b581240348eb947667664bf))
- bump svelte to 5.53.0 ([acc3ce0](https://github.com/equaltoai/greater-components/commit/acc3ce071df62d17a6d5ba615369e192bdff53e0))
- **ci:** adopt AppTheory release flow ([3c6c2df](https://github.com/equaltoai/greater-components/commit/3c6c2df91dd625c8ef4ae2f101bc89a9ed439b58))
- **ci:** adopt AppTheory release flow + pin Node 24 ([496b85b](https://github.com/equaltoai/greater-components/commit/496b85b693bec32cc65f589c97443efa161b5aca))
- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **ci:** ensure release-please PRs run CI checks ([67f766b](https://github.com/equaltoai/greater-components/commit/67f766b8e55cdedfb1ceff4cfacd2b220e50c821))
- **ci:** fix prettier + playwright demo ([5c4886a](https://github.com/equaltoai/greater-components/commit/5c4886a11fde8255df81fbb5d2b2d9c464febbc3))
- **ci:** run checks for release-please PRs ([b2dc38d](https://github.com/equaltoai/greater-components/commit/b2dc38d23ac1b97e5e2bfa0718f68ba25534e683))
- **contracts:** bump lesser to v1.1.24 ([81a9829](https://github.com/equaltoai/greater-components/commit/81a98290895b06e9ace85e12454ab4aa1550d57d))
- **contracts:** bump lesser to v1.1.24 ([9c1f3ab](https://github.com/equaltoai/greater-components/commit/9c1f3ab54c263760d32e47fbbbc41ca0a323d8cd))
- **csp:** extend validate:csp for runtime strict CSP ([a8139a5](https://github.com/equaltoai/greater-components/commit/a8139a571164ba9b7e590f79c343585d8afc27de))
- **deps-dev:** Bump @types/node from 24.10.2 to 25.0.3 ([eefbafc](https://github.com/equaltoai/greater-components/commit/eefbafcd44f994fd236a4cb44f07b00c4facceba))
- **deps-dev:** Bump globals from 16.5.0 to 17.0.0 ([0864bf9](https://github.com/equaltoai/greater-components/commit/0864bf9098ed2148e5026d5b327f11079a26a334))
- **deps-dev:** Bump the svelte group with 3 updates ([7e35da4](https://github.com/equaltoai/greater-components/commit/7e35da4ea11d20e8dd3a2ee9e25fc0157a8aa9b6))
- **deps-dev:** Bump the typescript group with 3 updates ([d4a09dd](https://github.com/equaltoai/greater-components/commit/d4a09dd99cd4efe15767a27e859d9ecd35179514))
- **deps:** batch dependency updates ([ebde35b](https://github.com/equaltoai/greater-components/commit/ebde35b7cd21f63e0212c83af84c516513032d5c))
- **deps:** bump devalue to 5.6.4 ([da6279a](https://github.com/equaltoai/greater-components/commit/da6279a3850392a79bdb9a9687813b0b45801e79))
- **deps:** bump graphql-codegen ([d2490c5](https://github.com/equaltoai/greater-components/commit/d2490c5890f00641783c1c8637e6cb64237e7da0))
- **deps:** Bump the dependencies group across 1 directory with 26 updates ([9092ec8](https://github.com/equaltoai/greater-components/commit/9092ec8c2a805d73a94d81d0e4eadeed59000a90))
- **deps:** Bump the dependencies group with 26 updates ([a6d9167](https://github.com/equaltoai/greater-components/commit/a6d916793787d58a1e8e5d51524a7162ea7e9e12))
- **deps:** bump the dependencies group with 5 updates ([9482ccd](https://github.com/equaltoai/greater-components/commit/9482ccdddc681dc2a94e1247068a79fb753ee7db))
- **deps:** patch audited vulnerabilities ([c9902e6](https://github.com/equaltoai/greater-components/commit/c9902e6d560a76f27e5a6d67da765b8b264b06f1))
- **deps:** patch undici and flatted ([b8b6043](https://github.com/equaltoai/greater-components/commit/b8b6043f068f268d0d987bb477e25d91d3772ab1))
- **deps:** patch undici and flatted ([da8a266](https://github.com/equaltoai/greater-components/commit/da8a266130baa45cea4ac243f27552623a47091b))
- **deps:** update to latest stable ([8accdbf](https://github.com/equaltoai/greater-components/commit/8accdbfde97c9473cb0454dcc42bc217db9ea484))
- **deps:** update to latest stable ([863e1e2](https://github.com/equaltoai/greater-components/commit/863e1e277e5f0be1db7a9cf24850e33dc8e3ff42))
- **deps:** update workspace dependencies ([5e15fbc](https://github.com/equaltoai/greater-components/commit/5e15fbc3223cf96ef26d305506f705132fc1488d))
- **deps:** update workspace dependencies ([2391851](https://github.com/equaltoai/greater-components/commit/23918518bb23851a7e06761817c2f19b57fccff0))
- **deps:** update workspace dependencies ([0e44a94](https://github.com/equaltoai/greater-components/commit/0e44a94edcfe74ed9e12cdfa16adbb012e2b710f))
- fix CI validation ([f8c2958](https://github.com/equaltoai/greater-components/commit/f8c2958546c380839f30f3a1c4faed244a05dd0e))
- fix PR 136 CI failures ([1a25642](https://github.com/equaltoai/greater-components/commit/1a2564251aeeccc917babd653a2793c7cf32fa1d))
- format + regenerate registry ([ad0abd4](https://github.com/equaltoai/greater-components/commit/ad0abd42f5ee47f4ca35290f41de2940eee17acb))
- format adapter tests ([28d6a71](https://github.com/equaltoai/greater-components/commit/28d6a71874a4ca808fb017397c705606aa18ee1f))
- format and regenerate registry ([148f214](https://github.com/equaltoai/greater-components/commit/148f214da81663a646ebc2615791de1988318dce))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- **lesser:** pin contracts to 9f072443 ([2ef3e4b](https://github.com/equaltoai/greater-components/commit/2ef3e4bfa65d1f9d5839552ebdaf79eba5e25b0e))
- **lesser:** pin contracts to v1.1.10 ([c0d8fc2](https://github.com/equaltoai/greater-components/commit/c0d8fc20e1e0756832772e478c93520c38b3a228))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** promote premain adapter sync ([af34ff6](https://github.com/equaltoai/greater-components/commit/af34ff6474c6ca70e1b1b9dc48d3f5185377a5b6))
- **main:** promote premain adapter sync ([af369e8](https://github.com/equaltoai/greater-components/commit/af369e88a1ee5f24c7b852da93262bd24aa25891))
- **main:** release greater 0.1.10 ([667640a](https://github.com/equaltoai/greater-components/commit/667640a877db74622bede34003a86d9e600bb0dd))
- **main:** release greater 0.1.10 ([6ac2237](https://github.com/equaltoai/greater-components/commit/6ac22374d04c698932972320b3c79ab67ca76402))
- **main:** release greater 0.1.11 ([9c0ffec](https://github.com/equaltoai/greater-components/commit/9c0ffec99ff5906d9836909d1e303f2fe3df240e))
- **main:** release greater 0.1.11 ([7bac630](https://github.com/equaltoai/greater-components/commit/7bac6304929b7ce1e26cccaaa33057e77308f0f3))
- **main:** release greater 0.1.12 ([4c0a357](https://github.com/equaltoai/greater-components/commit/4c0a35779d1e5fe72cbe4bb3277d04a0cff9b72a))
- **main:** release greater 0.1.12 ([1b07132](https://github.com/equaltoai/greater-components/commit/1b071322ea489d2e37d00b4187060ad64fa98c02))
- **main:** release greater 0.1.13 ([0587386](https://github.com/equaltoai/greater-components/commit/0587386f177206f3c2c639909a2d1444b92856c9))
- **main:** release greater 0.1.13 ([c1ce3a6](https://github.com/equaltoai/greater-components/commit/c1ce3a6e4c30d584ad39d99c317783eae7fe6d59))
- **main:** release greater 0.1.14 ([df67b91](https://github.com/equaltoai/greater-components/commit/df67b911564eb3fcb13bf912302623d6d64cf90d))
- **main:** release greater 0.1.14 ([505dffe](https://github.com/equaltoai/greater-components/commit/505dffe6186e189cada19d7ad90502e00ecde878))
- **main:** release greater 0.1.15 ([fee7e6c](https://github.com/equaltoai/greater-components/commit/fee7e6cd9fcb907072fd304dcc0f6c88a640faf6))
- **main:** release greater 0.1.15 ([eea6ed8](https://github.com/equaltoai/greater-components/commit/eea6ed8915bb01ee5c15130cabb1755a981211b5))
- **main:** release greater 0.1.16 ([a79f2e0](https://github.com/equaltoai/greater-components/commit/a79f2e077f36c16f53eae22f9dee4111f1d59dc1))
- **main:** release greater 0.1.16 ([e43b3d4](https://github.com/equaltoai/greater-components/commit/e43b3d42b5f885799190a7ede01c5c45e2bd6628))
- **main:** release greater 0.1.17 ([7d18a8b](https://github.com/equaltoai/greater-components/commit/7d18a8b734bc583edf8e03ce0907f2d55538c07c))
- **main:** release greater 0.1.17 ([ff15bde](https://github.com/equaltoai/greater-components/commit/ff15bdeb7ecd509ab4e2922898e53186df685270))
- **main:** release greater 0.1.18 ([4e28b93](https://github.com/equaltoai/greater-components/commit/4e28b93bc7320d3d39bd845c259d26047d96eeec))
- **main:** release greater 0.1.18 ([f7c79da](https://github.com/equaltoai/greater-components/commit/f7c79da4b043b772c860ea0d41566b2b90d349b0))
- **main:** release greater 0.1.2 ([14081f1](https://github.com/equaltoai/greater-components/commit/14081f1dbd06a8bdb1e214e746c130c90e9fcf50))
- **main:** release greater 0.1.2 ([6c38f5b](https://github.com/equaltoai/greater-components/commit/6c38f5b88a7a5cd75c0a3f6eaa8ef05f95216a8d))
- **main:** release greater 0.1.3 ([4d2bdb1](https://github.com/equaltoai/greater-components/commit/4d2bdb1324069c57beb002ca2a392843bc672807))
- **main:** release greater 0.1.3 ([9233571](https://github.com/equaltoai/greater-components/commit/92335713080be1bae6565f91ed7e26f6859ad143))
- **main:** release greater 0.1.4 ([dcf4a35](https://github.com/equaltoai/greater-components/commit/dcf4a3555d1a5cb54b9ea73e28099225d1725223))
- **main:** release greater 0.1.4 ([fcf9858](https://github.com/equaltoai/greater-components/commit/fcf98582fdd561584d175009785000d6a18e836c))
- **main:** release greater 0.1.5 ([5301936](https://github.com/equaltoai/greater-components/commit/5301936bd01626ccbf982c59a632caa9a8825dfe))
- **main:** release greater 0.1.5 ([7827364](https://github.com/equaltoai/greater-components/commit/7827364fe0da2b0b5d1be8daf3e49b4762ead2b6))
- **main:** release greater 0.1.6 ([b68eaf8](https://github.com/equaltoai/greater-components/commit/b68eaf8b983c2511def417009771455b237774b1))
- **main:** release greater 0.1.6 ([5492fad](https://github.com/equaltoai/greater-components/commit/5492faddf363cdd55ba60e229bc4f0f0a044386f))
- **main:** release greater 0.1.7 ([c1970f1](https://github.com/equaltoai/greater-components/commit/c1970f1f7d51d69b1d924be718765c52b2c75d75))
- **main:** release greater 0.1.7 ([8182b0e](https://github.com/equaltoai/greater-components/commit/8182b0e056d49bf6b69fb8a50541cc36e5ea9539))
- **main:** release greater 0.1.8 ([1789f15](https://github.com/equaltoai/greater-components/commit/1789f15695b105e80aec7fadc2513893fdfcdcd6))
- **main:** release greater 0.1.8 ([e24b167](https://github.com/equaltoai/greater-components/commit/e24b167cf469079936cd1808a197184a78288029))
- **main:** release greater 0.1.9 ([c697281](https://github.com/equaltoai/greater-components/commit/c6972811cb190941800ca06992d8eba1ba76466c))
- **main:** release greater 0.1.9 ([b295a9f](https://github.com/equaltoai/greater-components/commit/b295a9f802c7b88debf3d8de84cffedcbb16ec43))
- **main:** release greater 0.2.0 ([8a548a0](https://github.com/equaltoai/greater-components/commit/8a548a0bb659cbccb38d1ace1d946cf027ecda02))
- **main:** release greater 0.2.0 ([b12c808](https://github.com/equaltoai/greater-components/commit/b12c808a15c14eeaf772fea0459433750b3f60b7))
- **main:** release greater 0.3.0 ([5fd2740](https://github.com/equaltoai/greater-components/commit/5fd27404174e90b28de231540e84be400940edbe))
- **main:** release greater 0.3.0 ([7531f13](https://github.com/equaltoai/greater-components/commit/7531f1368f65afc827cbef7a258c63c73837d827))
- **main:** release greater 0.4.0 ([9034252](https://github.com/equaltoai/greater-components/commit/90342525e3857bf6f9ee0a706431b3b0c044cbe1))
- **main:** release greater 0.4.0 ([dbf06f1](https://github.com/equaltoai/greater-components/commit/dbf06f16383806b20dada2a9b1bb35b6827d6bad))
- **main:** release greater 0.4.1 ([a8c7da6](https://github.com/equaltoai/greater-components/commit/a8c7da649cd324bb83ee7260550c472be4b37a99))
- **main:** release greater 0.4.1 ([526225d](https://github.com/equaltoai/greater-components/commit/526225d60f3d838f4b9fd381f6063fa9c38d0768))
- **main:** release greater 0.4.2 ([2a41018](https://github.com/equaltoai/greater-components/commit/2a41018a1fc0cf130510f1b8a5dfcdcd562e23f0))
- **main:** release greater 0.4.2 ([dbf2696](https://github.com/equaltoai/greater-components/commit/dbf26965d62b31ff8a6d213aee54d3499732491b))
- **main:** release greater 0.4.3 ([679a643](https://github.com/equaltoai/greater-components/commit/679a643bccf77265da4f68514ba9448d659783dc))
- **main:** release greater 0.4.3 ([38413b7](https://github.com/equaltoai/greater-components/commit/38413b7544c60b6d9bc23c00fa028ea9be3f1dfd))
- **main:** release greater 0.4.4 ([86ced6d](https://github.com/equaltoai/greater-components/commit/86ced6d92fedd1ca4b157ee9a586319b0c39c1cb))
- **main:** release greater 0.4.4 ([60f038f](https://github.com/equaltoai/greater-components/commit/60f038f25faef38213c6958cd7ca0826c82736ba))
- **main:** release greater 0.5.0 ([74a23c4](https://github.com/equaltoai/greater-components/commit/74a23c4783ede4c2a784b26a6edd18f33e710318))
- **main:** release greater 0.5.0 ([0e2f6d4](https://github.com/equaltoai/greater-components/commit/0e2f6d4c8a268afddc9f67b6ae3ff1d29133b2dd))
- **main:** release greater 0.5.1 ([da9bcac](https://github.com/equaltoai/greater-components/commit/da9bcac9822716871cbd42f8150692874b8891f6))
- **main:** release greater 0.5.1 ([cfd8517](https://github.com/equaltoai/greater-components/commit/cfd851789d17847ae3d2a0eb04d71684b21fafe0))
- **main:** release greater 0.5.2 ([c8c2c51](https://github.com/equaltoai/greater-components/commit/c8c2c512d568659d9592a904abce812f552aa5ba))
- **main:** release greater 0.5.2 ([79ee5ab](https://github.com/equaltoai/greater-components/commit/79ee5abbaa0fcd69b4641a3b2927993f4919b8c5))
- merge main into premain ([3f2ba88](https://github.com/equaltoai/greater-components/commit/3f2ba88b26ace6b4814e903f3780065944c5f942))
- merge premain into staging ([5401dc9](https://github.com/equaltoai/greater-components/commit/5401dc947959e547fca08ec7da624556f27abc1f))
- pin Lesser v1.1.10 + fix open issues ([a60c1e2](https://github.com/equaltoai/greater-components/commit/a60c1e204a512f7107ff36e2311d48756bb43afd))
- pin lesser v1.1.23 and lesser-host v0.1.0 contracts ([c47e701](https://github.com/equaltoai/greater-components/commit/c47e70193c0ada34aa08f2ece49b2068379b0fcc))
- **playground:** drop [@pai](https://github.com/pai) snippet ([484bfb4](https://github.com/equaltoai/greater-components/commit/484bfb4725485ec21d1336e9a2c5b6042ade83c2))
- **premain:** prepare release metadata for 0.1.2-rc ([52a60a3](https://github.com/equaltoai/greater-components/commit/52a60a3e7a3b12018552e653a98eb783ef6482a3))
- **premain:** promote staging adapter sync ([282a959](https://github.com/equaltoai/greater-components/commit/282a95915b0cae995a46eab0926295f34dd5ed23))
- **premain:** promote staging adapter sync ([548e7a2](https://github.com/equaltoai/greater-components/commit/548e7a266f36b3202846bdf14fd80f6cb6d45823))
- **premain:** release greater 0.1.10-rc.0 ([315a795](https://github.com/equaltoai/greater-components/commit/315a7953d6b3877c768c38d65b6b20782666e0be))
- **premain:** release greater 0.1.10-rc.0 ([c01b453](https://github.com/equaltoai/greater-components/commit/c01b45380a1d832c0978fe505bb1200f491fe22c))
- **premain:** release greater 0.1.11-rc.0 ([c3dd48e](https://github.com/equaltoai/greater-components/commit/c3dd48e96f586e7cae787d6fc5d568382cd20b65))
- **premain:** release greater 0.1.11-rc.0 ([0d94f53](https://github.com/equaltoai/greater-components/commit/0d94f53bf84447a4ddc4239493c3d22b739e8bc9))
- **premain:** release greater 0.1.12-rc.0 ([bd75d6d](https://github.com/equaltoai/greater-components/commit/bd75d6d8174b0ce9ad6fe4c19adc17494bee8847))
- **premain:** release greater 0.1.12-rc.0 ([ec71322](https://github.com/equaltoai/greater-components/commit/ec71322c0efeb4194730f4b9d31f81d51b9936ca))
- **premain:** release greater 0.1.13-rc.0 ([0d1572a](https://github.com/equaltoai/greater-components/commit/0d1572a8226ee53f3c9e86284076c0b601c7fc02))
- **premain:** release greater 0.1.13-rc.0 ([69d79a3](https://github.com/equaltoai/greater-components/commit/69d79a32f47d260345192e73e62f163e41a224fa))
- **premain:** release greater 0.1.14-rc.0 ([d00b84d](https://github.com/equaltoai/greater-components/commit/d00b84d2d27c66dbc2fa2e43e6b8a181b4867696))
- **premain:** release greater 0.1.14-rc.0 ([20cd845](https://github.com/equaltoai/greater-components/commit/20cd8450daecb015bd8f7213305d5f97112614d6))
- **premain:** release greater 0.1.15-rc.0 ([13b45a1](https://github.com/equaltoai/greater-components/commit/13b45a1313a749bb77ff4afb8113fc8820ae7f09))
- **premain:** release greater 0.1.15-rc.0 ([e1c4e6a](https://github.com/equaltoai/greater-components/commit/e1c4e6a08eb12068c0f17d1b252d1ece86ed329c))
- **premain:** release greater 0.1.15-rc.1 ([a4e3c62](https://github.com/equaltoai/greater-components/commit/a4e3c629d1315f69d410db8a7377dca4ab0ffdd4))
- **premain:** release greater 0.1.15-rc.1 ([538dee2](https://github.com/equaltoai/greater-components/commit/538dee2a808f14c5e357250fd5b35db4fade5700))
- **premain:** release greater 0.1.16-rc.0 ([0fbf993](https://github.com/equaltoai/greater-components/commit/0fbf993256f120a7b632c80bece9eb918de52785))
- **premain:** release greater 0.1.16-rc.0 ([54eed32](https://github.com/equaltoai/greater-components/commit/54eed323791ee1ac483db64903a66aa841868748))
- **premain:** release greater 0.1.16-rc.0 ([0731fc4](https://github.com/equaltoai/greater-components/commit/0731fc4dae688130c4b6e4998e4f84311d75e12f))
- **premain:** release greater 0.1.16-rc.0 ([0856c42](https://github.com/equaltoai/greater-components/commit/0856c42967ce71adaf93e7e0f064573f4ba17d38))
- **premain:** release greater 0.1.17-rc.0 ([7dca1e8](https://github.com/equaltoai/greater-components/commit/7dca1e810ef99fae7b05c604590105246e3cba3c))
- **premain:** release greater 0.1.17-rc.0 ([b0a9c47](https://github.com/equaltoai/greater-components/commit/b0a9c47df11ed1191971130ffdfe6f733b8733d1))
- **premain:** release greater 0.1.18-rc.0 ([8072468](https://github.com/equaltoai/greater-components/commit/8072468a20b582b5ede83147cbd75ee75fa9426e))
- **premain:** release greater 0.1.18-rc.0 ([eca909a](https://github.com/equaltoai/greater-components/commit/eca909afefad47a48c9f17576059366966bf5a43))
- **premain:** release greater 0.1.19-rc.0 ([36f456b](https://github.com/equaltoai/greater-components/commit/36f456b77d7bb7a3bcbd628292f5a95e463fa939))
- **premain:** release greater 0.1.19-rc.0 ([b1a0e7f](https://github.com/equaltoai/greater-components/commit/b1a0e7fb64e7fc4c31b885193dffba7ea87251d0))
- **premain:** release greater 0.1.2-rc ([5069dbe](https://github.com/equaltoai/greater-components/commit/5069dbed9a35f25f5c31fca7f852683d4687de9a))
- **premain:** release greater 0.1.2-rc ([e3a7494](https://github.com/equaltoai/greater-components/commit/e3a7494435f8a4eb535d074178b473cb8913e40d))
- **premain:** release greater 0.1.2-rc.1 ([1c3f7e4](https://github.com/equaltoai/greater-components/commit/1c3f7e4fb6c22f38939b459805ae4bced01cc6b9))
- **premain:** release greater 0.1.2-rc.1 ([defac6c](https://github.com/equaltoai/greater-components/commit/defac6cd2b2770b578c7cf2a0bb25f340cb8ac49))
- **premain:** release greater 0.1.2-rc.2 ([34d7305](https://github.com/equaltoai/greater-components/commit/34d7305ab8f6b30fc7baab37053c505cbf883961))
- **premain:** release greater 0.1.2-rc.2 ([56fbee1](https://github.com/equaltoai/greater-components/commit/56fbee16b0ab4c6966eb0ce3d516bb3f6ab8ec12))
- **premain:** release greater 0.1.2-rc.3 ([bd7113f](https://github.com/equaltoai/greater-components/commit/bd7113f64f34d859d456c1e0151ee84193bc9792))
- **premain:** release greater 0.1.2-rc.3 ([8b2abda](https://github.com/equaltoai/greater-components/commit/8b2abdaef2e825df1674980238fce40c399bb822))
- **premain:** release greater 0.1.2-rc.4 ([351802b](https://github.com/equaltoai/greater-components/commit/351802bb15064caba6f78018d3ae029f7e646d7f))
- **premain:** release greater 0.1.2-rc.4 ([d0ea8c7](https://github.com/equaltoai/greater-components/commit/d0ea8c78088cfae8123bbc35e6165f3d4938b10c))
- **premain:** release greater 0.1.4-rc.0 ([52a29bf](https://github.com/equaltoai/greater-components/commit/52a29bf233c004ec14dafb1d4727350181902355))
- **premain:** release greater 0.1.4-rc.0 ([14c0232](https://github.com/equaltoai/greater-components/commit/14c0232db6da6b87eb69816ebe433056b05dcfe5))
- **premain:** release greater 0.1.5-rc.0 ([732a24b](https://github.com/equaltoai/greater-components/commit/732a24b2a7e910cf3e0433cd948e4c97c197a42f))
- **premain:** release greater 0.1.5-rc.0 ([71a58b3](https://github.com/equaltoai/greater-components/commit/71a58b30c6e8c182aa3986910ef4019bac40ab5f))
- **premain:** release greater 0.1.6-rc.0 ([c0f824f](https://github.com/equaltoai/greater-components/commit/c0f824fe302b2f0d121a84b73ada5046dd15d2f0))
- **premain:** release greater 0.1.6-rc.0 ([172fe6f](https://github.com/equaltoai/greater-components/commit/172fe6f951466afa402b1a486160951a24c4fa25))
- **premain:** release greater 0.1.7-rc.0 ([28fe63e](https://github.com/equaltoai/greater-components/commit/28fe63e368431d6e202ad2ff2a59c31408233ba4))
- **premain:** release greater 0.1.7-rc.0 ([532c688](https://github.com/equaltoai/greater-components/commit/532c688b7cc54bfa4fb4bce307ddc89bac596663))
- **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
- **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
- **premain:** release greater 0.1.9-rc.0 ([c35b372](https://github.com/equaltoai/greater-components/commit/c35b372afa15e9ffc58c6e74a2cf9c04e8337ae6))
- **premain:** release greater 0.1.9-rc.0 ([07321c3](https://github.com/equaltoai/greater-components/commit/07321c3f4c3dd6d959fc11008107a8bdb4977ba9))
- **premain:** release greater 0.2.1-rc.0 ([fe728a3](https://github.com/equaltoai/greater-components/commit/fe728a315608dc30b3ab6a31bd086cc104cfc64b))
- **premain:** release greater 0.2.1-rc.0 ([348dcb7](https://github.com/equaltoai/greater-components/commit/348dcb774eb882275bb899f2586a24fba07c652e))
- **premain:** release greater 0.3.1-rc.0 ([a97cd2d](https://github.com/equaltoai/greater-components/commit/a97cd2d678ff1b65b720cd39b40979749e5261e2))
- **premain:** release greater 0.3.1-rc.0 ([7454aa1](https://github.com/equaltoai/greater-components/commit/7454aa107dfb1716b70b23599683dff1ae48574d))
- **premain:** release greater 0.4.1-rc.0 ([c0f50c0](https://github.com/equaltoai/greater-components/commit/c0f50c0c54a053085497f127299116c0344e75ea))
- **premain:** release greater 0.4.1-rc.0 ([63f8285](https://github.com/equaltoai/greater-components/commit/63f828590b8632e68d63dea774182b90970fcc32))
- **premain:** release greater 0.4.2-rc.0 ([627ba90](https://github.com/equaltoai/greater-components/commit/627ba90f1665cfd7bdd1cc52afed06dacc21123a))
- **premain:** release greater 0.4.2-rc.0 ([4601c8c](https://github.com/equaltoai/greater-components/commit/4601c8c434422fe330a6fa4aca651f84e1dbf2a6))
- **premain:** release greater 0.4.3-rc.0 ([80933c4](https://github.com/equaltoai/greater-components/commit/80933c47dee2178a0dbe462da6ce43511d22427c))
- **premain:** release greater 0.4.3-rc.0 ([2f911ab](https://github.com/equaltoai/greater-components/commit/2f911abc0e8516a2f2bfa3baeb4fa75265db1ab5))
- **premain:** release greater 0.4.4-rc.0 ([6e86938](https://github.com/equaltoai/greater-components/commit/6e86938e02d6cc52a7a642b8cffb664d8c01a398))
- **premain:** release greater 0.4.4-rc.0 ([55f8b66](https://github.com/equaltoai/greater-components/commit/55f8b664c3de11dae97889f59dfc7de8323a1c4c))
- **premain:** release greater 0.4.5-rc.0 ([58a5467](https://github.com/equaltoai/greater-components/commit/58a5467a37d0c2cb66709a510e8fd06423b003d9))
- **premain:** release greater 0.4.5-rc.0 ([ca99b3e](https://github.com/equaltoai/greater-components/commit/ca99b3e39f18a64135c885cbd5e2cf421ddc87be))
- **premain:** release greater 0.5.1-rc.0 ([7e9c698](https://github.com/equaltoai/greater-components/commit/7e9c6981d68f5c9d9e9950279865c80fdcb45dd6))
- **premain:** release greater 0.5.1-rc.0 ([e46916f](https://github.com/equaltoai/greater-components/commit/e46916f0e9ff7a2f92ecca11c79a8bab107ba054))
- **premain:** release greater 0.5.1-rc.1 ([802a8ef](https://github.com/equaltoai/greater-components/commit/802a8ef6a47923fb4c33b70cfbf574f2e2402dfc))
- **premain:** release greater 0.5.1-rc.1 ([a5a93d5](https://github.com/equaltoai/greater-components/commit/a5a93d5e98c42b9ccbeb6e167e1b262d58ec9c20))
- **premain:** release greater 0.5.2-rc.0 ([806f094](https://github.com/equaltoai/greater-components/commit/806f09420ca43822a32abbfb62a2a22e84815915))
- **premain:** release greater 0.5.2-rc.0 ([95554e6](https://github.com/equaltoai/greater-components/commit/95554e62d3a217041af32905a83e76aa7dab2d7d))
- **premain:** release greater 0.5.3-rc.0 ([a11219f](https://github.com/equaltoai/greater-components/commit/a11219f5772ccb8104439ae2a1ed9cd431ff403b))
- **premain:** release greater 0.5.3-rc.0 ([1ec7084](https://github.com/equaltoai/greater-components/commit/1ec7084ceae8eec7d060732232b7098277eb0e47))
- promote premain into main ([2ae6bbc](https://github.com/equaltoai/greater-components/commit/2ae6bbcf6a0a9a7e256c90bf188c13912ae7dc84))
- promote premain to main ([6831a05](https://github.com/equaltoai/greater-components/commit/6831a0546c000f25926deee7fab310cf3935d1aa))
- promote premain to main ([124fa61](https://github.com/equaltoai/greater-components/commit/124fa61d0360490765090d2a9064dc8496c5ce99))
- promote premain to main ([b7918d1](https://github.com/equaltoai/greater-components/commit/b7918d11f9e24b42995a728e1b574cf1b3a8b2f9))
- promote staging into premain ([19eddb3](https://github.com/equaltoai/greater-components/commit/19eddb33fd025be463efd0e4a620db5daa9a5e4c))
- promote staging to premain ([0a5170e](https://github.com/equaltoai/greater-components/commit/0a5170e4c23e572e37390cec1943dde624e4a630))
- promote staging to premain ([abc0eb6](https://github.com/equaltoai/greater-components/commit/abc0eb64b79466de07d90495fad75c2ca628091e))
- promote staging to premain ([4198cf0](https://github.com/equaltoai/greater-components/commit/4198cf0cd6dc661dcad0fbbc64015289aa9d74a9))
- promote staging to premain ([dbf01fd](https://github.com/equaltoai/greater-components/commit/dbf01fd63599e173ad50b7120418c55d7b0fd8ca))
- promote staging to premain ([4e885a8](https://github.com/equaltoai/greater-components/commit/4e885a8c8929c532e47173fbbad7b35d9f26f665))
- promote staging to premain ([40c561d](https://github.com/equaltoai/greater-components/commit/40c561de0e195e1257bdb0a53694f7ae78ae779a))
- promote staging to premain (RC) ([e910da0](https://github.com/equaltoai/greater-components/commit/e910da0b5a9d72995574a7d9ddbcb694fa2cb8b8))
- Reformat codebase ([792d2fa](https://github.com/equaltoai/greater-components/commit/792d2fa71e90caacff620d3d40e7468a66d9441f))
- regenerate registry ([fe70f15](https://github.com/equaltoai/greater-components/commit/fe70f152ca7dc75f7a41fa04ae9e9ed713b40389))
- regenerate registry ([58abe16](https://github.com/equaltoai/greater-components/commit/58abe161740f37a93ec8d35b4df1d9a5d3fce339))
- regenerate registry ([1760bcc](https://github.com/equaltoai/greater-components/commit/1760bcc3ee8f1009462128dc01b25c1a929ad2cf))
- Regenerate registry index after codegen updates ([fb07b39](https://github.com/equaltoai/greater-components/commit/fb07b39716c68019d02ec64a5b58d596339357e2))
- regenerate src type artifacts ([7bf3011](https://github.com/equaltoai/greater-components/commit/7bf3011db543b411156c0fb7d10d7d89b3bf2968))
- **registry:** enforce and format index ([367ba0f](https://github.com/equaltoai/greater-components/commit/367ba0f4a2d5fc5adeb17157c43fd64cb0e40770))
- **registry:** format index.json ([f8eaff5](https://github.com/equaltoai/greater-components/commit/f8eaff5289fa335bd7aa8f09a97fbe4d83dddb21))
- **registry:** regenerate index ([18cff39](https://github.com/equaltoai/greater-components/commit/18cff39803bbbd30f7cd72bdc24bdf0bafc56cd8))
- **registry:** regenerate index ([0cd0f1b](https://github.com/equaltoai/greater-components/commit/0cd0f1b1c44d346593fdf2cc6850167754a31581))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- **release:** add one-command release cutter ([e9df01e](https://github.com/equaltoai/greater-components/commit/e9df01e2199f2aaaeb45d340fce244b50f741654))
- **release:** add one-command release cutter ([eca6261](https://github.com/equaltoai/greater-components/commit/eca626146b842c240d059419483839e7b4feaa35))
- **release:** greater-v0.1.0 ([946e3be](https://github.com/equaltoai/greater-components/commit/946e3bee45baa52ec428c6d9b902abeae7aaea01))
- **release:** greater-v0.1.0 ([33c36f2](https://github.com/equaltoai/greater-components/commit/33c36f277c4ee9eb3358ee15cf93c903bfa958e6))
- **release:** greater-v0.1.0 ([0ff8d21](https://github.com/equaltoai/greater-components/commit/0ff8d21cb2c402cd26f9b996142f5f33ec291a32))
- **release:** greater-v0.1.1 ([ebb24dc](https://github.com/equaltoai/greater-components/commit/ebb24dc35afeb811dcd6f265e3b279196ff61067))
- **release:** greater-v0.1.1 ([0e26e63](https://github.com/equaltoai/greater-components/commit/0e26e6354ca6ef56ee3d462144d20812dbafc102))
- **release:** greater-v0.1.1 ([8c15a59](https://github.com/equaltoai/greater-components/commit/8c15a59b092ac3dcfb4c841836e8a4f646ccb854))
- **release:** prepare metadata ([05161d7](https://github.com/equaltoai/greater-components/commit/05161d76434af43342029e9fa80afa0d70d5319d))
- **release:** prepare metadata ([232e330](https://github.com/equaltoai/greater-components/commit/232e330b1787cb28f77976dd828deda211ab7d49))
- **release:** prepare metadata ([4bbdea4](https://github.com/equaltoai/greater-components/commit/4bbdea454487798cf34d354986bc1d7826184550))
- **release:** prepare metadata ([90a9b77](https://github.com/equaltoai/greater-components/commit/90a9b778b248cff2f4b0584ea8af62b64d062f42))
- **release:** prepare metadata ([ff847be](https://github.com/equaltoai/greater-components/commit/ff847be410a8aaa3e23916f35219c4073ce91fab))
- **release:** prepare metadata ([49985b4](https://github.com/equaltoai/greater-components/commit/49985b433a25ca5ae6640e8b5b291349fb66750c))
- **release:** prepare metadata ([6fb0736](https://github.com/equaltoai/greater-components/commit/6fb07369824bbe32a0cea45650aff47ba82a5cdc))
- **release:** prepare metadata ([56b348d](https://github.com/equaltoai/greater-components/commit/56b348d470f384d5c26a50d26c110b6bbaf5dd39))
- **release:** prepare metadata ([025467e](https://github.com/equaltoai/greater-components/commit/025467e65ca562b4985d4b27c54bc852d9851a55))
- **release:** prepare metadata ([8a923d9](https://github.com/equaltoai/greater-components/commit/8a923d9ebe5fef01b0c23708e1f8ba75b5edd9c4))
- **release:** prepare metadata ([83ce78c](https://github.com/equaltoai/greater-components/commit/83ce78ce37bd6590fba10cd5ae087fbdad1945a2))
- **release:** prepare metadata ([78117f0](https://github.com/equaltoai/greater-components/commit/78117f0af1560bd57ebcfb30ce880b1fd2088c80))
- **release:** prepare metadata ([e648c68](https://github.com/equaltoai/greater-components/commit/e648c68ba2f321b0b025da6c50823aef4634146b))
- **release:** prepare metadata ([d9b9510](https://github.com/equaltoai/greater-components/commit/d9b95107cde7657c8236d289bf5b8325cf12dc86))
- **release:** prepare metadata ([da8cc98](https://github.com/equaltoai/greater-components/commit/da8cc9824f1b898597726ba6cfeee80cd9af0326))
- **release:** prepare metadata ([2337162](https://github.com/equaltoai/greater-components/commit/2337162f5ba76bc7e59d1dba4e59ab8953ae2362))
- **release:** prepare metadata ([16ce94e](https://github.com/equaltoai/greater-components/commit/16ce94e9fab6871453bd5113ea87e6078b40b09f))
- **release:** prepare metadata ([4f1f6b8](https://github.com/equaltoai/greater-components/commit/4f1f6b8f88c48e6de1022df9bcef04909af08085))
- **release:** prepare metadata ([404f4ad](https://github.com/equaltoai/greater-components/commit/404f4ad5e72ca074fd3281e0c5d015deeb7089db))
- **release:** prepare metadata ([b3c8310](https://github.com/equaltoai/greater-components/commit/b3c83108430486d20a9370eb35105670a028abbd))
- **release:** prepare metadata ([17ea35d](https://github.com/equaltoai/greater-components/commit/17ea35d6ca301d8550befaf8a48974a1d41d9fea))
- **release:** prepare metadata ([f1ea82c](https://github.com/equaltoai/greater-components/commit/f1ea82cd088a57e00c02fde6f6a9147dc284ee86))
- **release:** prepare metadata ([4379cac](https://github.com/equaltoai/greater-components/commit/4379cac56ea23951531202ebdc49e8419a2c7f99))
- **release:** prepare metadata ([5c223e2](https://github.com/equaltoai/greater-components/commit/5c223e25b2ef230563fa3bf7a34b4820d9a6f8e8))
- **release:** prepare metadata ([1f929ab](https://github.com/equaltoai/greater-components/commit/1f929ab539b2c5096c00e26fa697fe0b2c4afcfd))
- **release:** prepare metadata ([84a143b](https://github.com/equaltoai/greater-components/commit/84a143b1dd990fe0019c6fafb65f03d123476ba0))
- **release:** prepare metadata ([207cc63](https://github.com/equaltoai/greater-components/commit/207cc63f280f8d523897fc512c0158d6b5ff7114))
- **release:** prepare metadata ([e2d7489](https://github.com/equaltoai/greater-components/commit/e2d7489b31a19d8766948156c3d33bf7c3a58043))
- **release:** prepare metadata ([9f83bd0](https://github.com/equaltoai/greater-components/commit/9f83bd089ce1f65f8645dcc67d152d9bdd127d48))
- **release:** prepare metadata ([38ce978](https://github.com/equaltoai/greater-components/commit/38ce978189f739a06bc65858e3c363b94901335a))
- **release:** prepare metadata ([dc957c0](https://github.com/equaltoai/greater-components/commit/dc957c0e79dd5d66c7ab2dba77a1b72d3b252701))
- **release:** prepare metadata ([d665069](https://github.com/equaltoai/greater-components/commit/d665069c5bfe443897250023407ffa6c6b12920e))
- **release:** prepare metadata ([85e6bf4](https://github.com/equaltoai/greater-components/commit/85e6bf431ec844ba66967b06f3049cdaab033f26))
- **release:** prepare metadata ([788a1c9](https://github.com/equaltoai/greater-components/commit/788a1c91af968f7c0e40d119d5e2b3e84518ba4c))
- **release:** prepare metadata ([f97aa37](https://github.com/equaltoai/greater-components/commit/f97aa37a5094f75a567871c61a08899b06dd36e1))
- **release:** prepare metadata ([34579db](https://github.com/equaltoai/greater-components/commit/34579db0e31cef88737e5cb0e232786b3d3798b6))
- **release:** prepare metadata ([d8ae17e](https://github.com/equaltoai/greater-components/commit/d8ae17ed46bf0fbfc68896a8b58fc70b167d21f1))
- **release:** prepare metadata ([8754c5b](https://github.com/equaltoai/greater-components/commit/8754c5b0306082c21245de6a3766017d2df6db0c))
- **release:** prepare metadata ([d073017](https://github.com/equaltoai/greater-components/commit/d0730175366cbcc918144519ac5dfb5063c0110b))
- **release:** prepare metadata ([7276ef3](https://github.com/equaltoai/greater-components/commit/7276ef39f4d998fa75d016132638b3fa8ca10e67))
- **release:** prepare metadata ([0b46575](https://github.com/equaltoai/greater-components/commit/0b465754b1063d99b0d1078e775a10bbda883646))
- **release:** prepare metadata ([0c69583](https://github.com/equaltoai/greater-components/commit/0c695831df309a10d522dbad42f58452bc515875))
- **release:** prepare metadata ([d3c0378](https://github.com/equaltoai/greater-components/commit/d3c0378b33f3945e5a12acee43791847775b1c48))
- **release:** prepare metadata ([8f3a64d](https://github.com/equaltoai/greater-components/commit/8f3a64d1226a84c6321947791006567fab84c49a))
- **release:** prepare metadata ([9e92fc9](https://github.com/equaltoai/greater-components/commit/9e92fc97e93b13c8521e517d40a64245b35e7882))
- **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))
- **release:** prepare metadata ([59b93e6](https://github.com/equaltoai/greater-components/commit/59b93e66e7af639ce9f8f2be5d1215910b8f7fe7))
- **release:** prepare metadata ([9f62828](https://github.com/equaltoai/greater-components/commit/9f62828301f7532fc0f7e27cb6dc31e965b3b29d))
- **release:** prepare metadata ([ed08549](https://github.com/equaltoai/greater-components/commit/ed0854991060157932b420fc46e42df24c45bf12))
- **release:** prepare metadata ([d9f731d](https://github.com/equaltoai/greater-components/commit/d9f731daf4f0a52080b55351d0bd8077280b6d74))
- **release:** prepare metadata ([4378aa3](https://github.com/equaltoai/greater-components/commit/4378aa3930cbf68320169f36105e01788356e8e5))
- **release:** prepare metadata ([e5d92bc](https://github.com/equaltoai/greater-components/commit/e5d92bcfe1a854e6238ac4b3f86bf9a2eff50166))
- **release:** prepare metadata ([28926cd](https://github.com/equaltoai/greater-components/commit/28926cd9134efeffb14ae6a5041765f798158c36))
- **release:** prepare metadata ([8c03743](https://github.com/equaltoai/greater-components/commit/8c037435ca9718edb2345e2c45c8c7f2d9b0ff77))
- **release:** prepare metadata ([078e714](https://github.com/equaltoai/greater-components/commit/078e71455c269c0bbec6a9b673d5999451fd492c))
- **release:** prepare metadata ([cf43fe4](https://github.com/equaltoai/greater-components/commit/cf43fe4978e7e091a1d50864c5355f1216fc18a3))
- **release:** prepare metadata ([f4044fe](https://github.com/equaltoai/greater-components/commit/f4044fe8f98fcc633d5333024ec41708d70295b5))
- **release:** prepare metadata ([cbb6681](https://github.com/equaltoai/greater-components/commit/cbb6681304b951def556cfb8ed206266b2907d98))
- **release:** prepare metadata ([c3b72dc](https://github.com/equaltoai/greater-components/commit/c3b72dc2c0a7a1f654dc77c1f48c641b19a49345))
- **release:** prepare metadata ([28d2d29](https://github.com/equaltoai/greater-components/commit/28d2d29e15f7ced4dffc9eab1e625a196b3c71f3))
- **release:** prepare metadata for 0.1.2-rc ([b9fea95](https://github.com/equaltoai/greater-components/commit/b9fea95c4b5741307e919b6410f7222fda3f1be0))
- remove nested pnpm lockfiles ([88832aa](https://github.com/equaltoai/greater-components/commit/88832aaf061c290096333f9c9ac20903e016ab67))
- remove nested pnpm lockfiles ([fb742bd](https://github.com/equaltoai/greater-components/commit/fb742bd93c9320518e2d0461e8d5062c7a8daebd))
- run prettier ([f927a03](https://github.com/equaltoai/greater-components/commit/f927a03bd013bedd1702f3e142c1e60938f59ae8))
- **staging:** backmerge main into staging ([49300c5](https://github.com/equaltoai/greater-components/commit/49300c5cf8d8b4b480f57dfff5549a72ddb16cac))
- **staging:** backmerge main into staging (repair promotion flow) ([5aec240](https://github.com/equaltoai/greater-components/commit/5aec24097c6404c95cd6d10cc4bf93d828d4e8a4))
- **staging:** backmerge premain into staging ([d906466](https://github.com/equaltoai/greater-components/commit/d906466b6eb819818a12cab7527f3224dd7fa479))
- **staging:** backmerge premain into staging ([5f4b78e](https://github.com/equaltoai/greater-components/commit/5f4b78e593fe5da09fad4d0a170c2a029f004dfb))
- **staging:** sync lesser contracts v1.1.53 ([98ed8c2](https://github.com/equaltoai/greater-components/commit/98ed8c263e5ba37d994e341492f88c9c105310b3))
- sync lesser contracts and refresh dependencies ([ba941c0](https://github.com/equaltoai/greater-components/commit/ba941c01830eea459a3351755aeedfc5f97d199f))
- sync Lesser contracts and refresh dependencies ([8fe9cee](https://github.com/equaltoai/greater-components/commit/8fe9cee039f23cbfd946654a60b1134bd38a25c7))
- sync Lesser contracts v1.1.0 ([d41ccc0](https://github.com/equaltoai/greater-components/commit/d41ccc0de4dce9e2b599263e41823d5fa890c39b))
- sync Lesser contracts v1.1.0 ([d76b06b](https://github.com/equaltoai/greater-components/commit/d76b06bd2a4afe55c8d3f86d7b3716c2cf200d31))
- sync lesser contracts v1.1.53 ([2c8fdda](https://github.com/equaltoai/greater-components/commit/2c8fddabf63ccabc73117c308d75c5e4d7b99dc7))
- sync lesser v1.1.52 and refresh dependencies ([0fc9d8b](https://github.com/equaltoai/greater-components/commit/0fc9d8b087e59b4f6c097900822623e1cb02e65f))
- sync lesser v1.1.52 and refresh dependencies ([11ee095](https://github.com/equaltoai/greater-components/commit/11ee095af48f583cc7dda49e4e7adb26b98d7e35))
- update registry checksums ([df448b6](https://github.com/equaltoai/greater-components/commit/df448b64e38e5e3b99a9c42f938086ff573723cd))

## [0.5.3-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.2-rc.0...greater-v0.5.3-rc.0) (2026-03-20)

### Bug Fixes

- **deps:** patch flatted vulnerability ([9b20492](https://github.com/equaltoai/greater-components/commit/9b20492b3620bd5c93f6f2c56b731b0bc9168bfe))
- **staging:** patch flatted vulnerability ([c0d6109](https://github.com/equaltoai/greater-components/commit/c0d6109afd70b3b76ae36457b8e5c3c587a99b9f))

### Chores

- **main:** release greater 0.5.2 ([c8c2c51](https://github.com/equaltoai/greater-components/commit/c8c2c512d568659d9592a904abce812f552aa5ba))
- **main:** release greater 0.5.2 ([79ee5ab](https://github.com/equaltoai/greater-components/commit/79ee5abbaa0fcd69b4641a3b2927993f4919b8c5))
- **release:** prepare metadata ([232e330](https://github.com/equaltoai/greater-components/commit/232e330b1787cb28f77976dd828deda211ab7d49))

## [0.5.2](https://github.com/equaltoai/greater-components/compare/greater-v0.5.1...greater-v0.5.2) (2026-03-20)

### Chores

- **premain:** release greater 0.5.2-rc.0 ([806f094](https://github.com/equaltoai/greater-components/commit/806f09420ca43822a32abbfb62a2a22e84815915))
- **premain:** release greater 0.5.2-rc.0 ([95554e6](https://github.com/equaltoai/greater-components/commit/95554e62d3a217041af32905a83e76aa7dab2d7d))
- **release:** prepare metadata ([4bbdea4](https://github.com/equaltoai/greater-components/commit/4bbdea454487798cf34d354986bc1d7826184550))
- **staging:** sync lesser contracts v1.1.53 ([98ed8c2](https://github.com/equaltoai/greater-components/commit/98ed8c263e5ba37d994e341492f88c9c105310b3))
- sync lesser contracts v1.1.53 ([2c8fdda](https://github.com/equaltoai/greater-components/commit/2c8fddabf63ccabc73117c308d75c5e4d7b99dc7))

## [0.5.2-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.5.1-rc.1...greater-v0.5.2-rc.0) (2026-03-20)

### Chores

- **main:** release greater 0.5.1 ([da9bcac](https://github.com/equaltoai/greater-components/commit/da9bcac9822716871cbd42f8150692874b8891f6))
- **main:** release greater 0.5.1 ([cfd8517](https://github.com/equaltoai/greater-components/commit/cfd851789d17847ae3d2a0eb04d71684b21fafe0))
- **release:** prepare metadata ([90a9b77](https://github.com/equaltoai/greater-components/commit/90a9b778b248cff2f4b0584ea8af62b64d062f42))
- **staging:** sync lesser contracts v1.1.53 ([98ed8c2](https://github.com/equaltoai/greater-components/commit/98ed8c263e5ba37d994e341492f88c9c105310b3))
- sync lesser contracts v1.1.53 ([2c8fdda](https://github.com/equaltoai/greater-components/commit/2c8fddabf63ccabc73117c308d75c5e4d7b99dc7))

## [0.5.1](https://github.com/equaltoai/greater-components/compare/greater-v0.5.0...greater-v0.5.1) (2026-03-19)

### Bug Fixes

- **adapters:** guard conversation participant id ([0c9db51](https://github.com/equaltoai/greater-components/commit/0c9db51e2387396487d9bfbf04cc0e292fe63e7e))
- **deps:** align undici override with lockfile ([5c2ae6b](https://github.com/equaltoai/greater-components/commit/5c2ae6b2fadd3f7bbe806c3630746176e7e1f976))
- **registry:** refresh checksums after warning cleanup ([76250a5](https://github.com/equaltoai/greater-components/commit/76250a5e8fcd8af84afe63a9c7b69fe0f68192b5))

### CI

- **prerelease:** ignore stable manifest changes ([f087528](https://github.com/equaltoai/greater-components/commit/f087528bb68ef9aba9cf184739e861470cd26d57))

### Chores

- **premain:** release greater 0.5.1-rc.0 ([7e9c698](https://github.com/equaltoai/greater-components/commit/7e9c6981d68f5c9d9e9950279865c80fdcb45dd6))
- **premain:** release greater 0.5.1-rc.0 ([e46916f](https://github.com/equaltoai/greater-components/commit/e46916f0e9ff7a2f92ecca11c79a8bab107ba054))
- **premain:** release greater 0.5.1-rc.1 ([802a8ef](https://github.com/equaltoai/greater-components/commit/802a8ef6a47923fb4c33b70cfbf574f2e2402dfc))
- **premain:** release greater 0.5.1-rc.1 ([a5a93d5](https://github.com/equaltoai/greater-components/commit/a5a93d5e98c42b9ccbeb6e167e1b262d58ec9c20))
- **release:** prepare metadata ([ff847be](https://github.com/equaltoai/greater-components/commit/ff847be410a8aaa3e23916f35219c4073ce91fab))
- **release:** prepare metadata ([49985b4](https://github.com/equaltoai/greater-components/commit/49985b433a25ca5ae6640e8b5b291349fb66750c))
- **staging:** backmerge main into staging ([49300c5](https://github.com/equaltoai/greater-components/commit/49300c5cf8d8b4b480f57dfff5549a72ddb16cac))
- **staging:** backmerge main into staging (repair promotion flow) ([5aec240](https://github.com/equaltoai/greater-components/commit/5aec24097c6404c95cd6d10cc4bf93d828d4e8a4))
- **staging:** backmerge premain into staging ([d906466](https://github.com/equaltoai/greater-components/commit/d906466b6eb819818a12cab7527f3224dd7fa479))
- **staging:** backmerge premain into staging ([5f4b78e](https://github.com/equaltoai/greater-components/commit/5f4b78e593fe5da09fad4d0a170c2a029f004dfb))
- sync lesser v1.1.52 and refresh dependencies ([0fc9d8b](https://github.com/equaltoai/greater-components/commit/0fc9d8b087e59b4f6c097900822623e1cb02e65f))
- sync lesser v1.1.52 and refresh dependencies ([11ee095](https://github.com/equaltoai/greater-components/commit/11ee095af48f583cc7dda49e4e7adb26b98d7e35))

## [0.5.1-rc.1](https://github.com/equaltoai/greater-components/compare/greater-v0.5.1-rc.0...greater-v0.5.1-rc.1) (2026-03-19)

### CI

- **prerelease:** ignore stable manifest changes ([f087528](https://github.com/equaltoai/greater-components/commit/f087528bb68ef9aba9cf184739e861470cd26d57))

### Chores

- **staging:** backmerge main into staging ([49300c5](https://github.com/equaltoai/greater-components/commit/49300c5cf8d8b4b480f57dfff5549a72ddb16cac))
- **staging:** backmerge main into staging (repair promotion flow) ([5aec240](https://github.com/equaltoai/greater-components/commit/5aec24097c6404c95cd6d10cc4bf93d828d4e8a4))

## [0.5.1-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.4.5-rc.0...greater-v0.5.1-rc.0) (2026-03-19)

### Bug Fixes

- **adapters:** guard conversation participant id ([0c9db51](https://github.com/equaltoai/greater-components/commit/0c9db51e2387396487d9bfbf04cc0e292fe63e7e))
- **deps:** align undici override with lockfile ([5c2ae6b](https://github.com/equaltoai/greater-components/commit/5c2ae6b2fadd3f7bbe806c3630746176e7e1f976))
- **registry:** refresh checksums after warning cleanup ([76250a5](https://github.com/equaltoai/greater-components/commit/76250a5e8fcd8af84afe63a9c7b69fe0f68192b5))

### Chores

- **staging:** backmerge premain into staging ([d906466](https://github.com/equaltoai/greater-components/commit/d906466b6eb819818a12cab7527f3224dd7fa479))
- **staging:** backmerge premain into staging ([5f4b78e](https://github.com/equaltoai/greater-components/commit/5f4b78e593fe5da09fad4d0a170c2a029f004dfb))
- sync lesser v1.1.52 and refresh dependencies ([0fc9d8b](https://github.com/equaltoai/greater-components/commit/0fc9d8b087e59b4f6c097900822623e1cb02e65f))
- sync lesser v1.1.52 and refresh dependencies ([11ee095](https://github.com/equaltoai/greater-components/commit/11ee095af48f583cc7dda49e4e7adb26b98d7e35))

## [0.4.5-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.4.4-rc.0...greater-v0.4.5-rc.0) (2026-03-17)

### Features

- **adapters:** sync lesser contract updates ([71fd0c1](https://github.com/equaltoai/greater-components/commit/71fd0c1e64f8925537ae51f2682a09f6ceec3a99))
- **adapters:** sync lesser contract updates ([76fa189](https://github.com/equaltoai/greater-components/commit/76fa1895a3b557f192486e12321dda05254da735))

### Bug Fixes

- **ci:** skip a11y comments on fork PRs ([8d44561](https://github.com/equaltoai/greater-components/commit/8d445617cf6308c70e0202c0d2c80a116722a950))
- **ci:** skip coverage comments on fork PRs ([e3f7fee](https://github.com/equaltoai/greater-components/commit/e3f7fee538a6794baa36067ed732b4aa437b82cc))
- **registry:** align staging release metadata ([8bfc673](https://github.com/equaltoai/greater-components/commit/8bfc6735580edb8b90efbe89d8e9f2d22e6bc41f))

### Chores

- **premain:** promote staging adapter sync ([282a959](https://github.com/equaltoai/greater-components/commit/282a95915b0cae995a46eab0926295f34dd5ed23))
- **premain:** promote staging adapter sync ([548e7a2](https://github.com/equaltoai/greater-components/commit/548e7a266f36b3202846bdf14fd80f6cb6d45823))

## [0.4.4-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.4.3-rc.0...greater-v0.4.4-rc.0) (2026-03-16)

### Chores

- promote staging into premain ([19eddb3](https://github.com/equaltoai/greater-components/commit/19eddb33fd025be463efd0e4a620db5daa9a5e4c))
- sync lesser contracts and refresh dependencies ([ba941c0](https://github.com/equaltoai/greater-components/commit/ba941c01830eea459a3351755aeedfc5f97d199f))
- sync Lesser contracts and refresh dependencies ([8fe9cee](https://github.com/equaltoai/greater-components/commit/8fe9cee039f23cbfd946654a60b1134bd38a25c7))

## [0.4.3-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.4.2-rc.0...greater-v0.4.3-rc.0) (2026-03-15)

### Chores

- **deps:** patch undici and flatted ([b8b6043](https://github.com/equaltoai/greater-components/commit/b8b6043f068f268d0d987bb477e25d91d3772ab1))
- **deps:** patch undici and flatted ([da8a266](https://github.com/equaltoai/greater-components/commit/da8a266130baa45cea4ac243f27552623a47091b))
- **main:** release greater 0.4.2 ([2a41018](https://github.com/equaltoai/greater-components/commit/2a41018a1fc0cf130510f1b8a5dfcdcd562e23f0))
- **main:** release greater 0.4.2 ([dbf2696](https://github.com/equaltoai/greater-components/commit/dbf26965d62b31ff8a6d213aee54d3499732491b))
- **release:** prepare metadata ([e648c68](https://github.com/equaltoai/greater-components/commit/e648c68ba2f321b0b025da6c50823aef4634146b))

## [0.4.2](https://github.com/equaltoai/greater-components/compare/greater-v0.4.1...greater-v0.4.2) (2026-03-13)

### Features

- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([915021e](https://github.com/equaltoai/greater-components/commit/915021e5bf5f5aaedc45c93244d17b5b43f3af3a))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([6d9bd15](https://github.com/equaltoai/greater-components/commit/6d9bd153c28de85e72a782606fa0794e79a696e5))

### Chores

- **deps:** bump devalue to 5.6.4 ([da6279a](https://github.com/equaltoai/greater-components/commit/da6279a3850392a79bdb9a9687813b0b45801e79))
- **premain:** release greater 0.4.2-rc.0 ([627ba90](https://github.com/equaltoai/greater-components/commit/627ba90f1665cfd7bdd1cc52afed06dacc21123a))
- **premain:** release greater 0.4.2-rc.0 ([4601c8c](https://github.com/equaltoai/greater-components/commit/4601c8c434422fe330a6fa4aca651f84e1dbf2a6))
- **release:** prepare metadata ([d9b9510](https://github.com/equaltoai/greater-components/commit/d9b95107cde7657c8236d289bf5b8325cf12dc86))

## [0.4.2-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.4.1-rc.0...greater-v0.4.2-rc.0) (2026-03-13)

### Features

- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([915021e](https://github.com/equaltoai/greater-components/commit/915021e5bf5f5aaedc45c93244d17b5b43f3af3a))
- **adapters:** sync lesser v1.1.38 and lesser-host v0.1.10 ([6d9bd15](https://github.com/equaltoai/greater-components/commit/6d9bd153c28de85e72a782606fa0794e79a696e5))

### Chores

- **deps:** bump devalue to 5.6.4 ([da6279a](https://github.com/equaltoai/greater-components/commit/da6279a3850392a79bdb9a9687813b0b45801e79))
- **main:** release greater 0.4.1 ([a8c7da6](https://github.com/equaltoai/greater-components/commit/a8c7da649cd324bb83ee7260550c472be4b37a99))
- **main:** release greater 0.4.1 ([526225d](https://github.com/equaltoai/greater-components/commit/526225d60f3d838f4b9fd381f6063fa9c38d0768))
- **release:** prepare metadata ([da8cc98](https://github.com/equaltoai/greater-components/commit/da8cc9824f1b898597726ba6cfeee80cd9af0326))

## [0.4.1](https://github.com/equaltoai/greater-components/compare/greater-v0.4.0...greater-v0.4.1) (2026-03-09)

### Features

- **adapters:** sync lesser-host v0.1.7 ([ebc93eb](https://github.com/equaltoai/greater-components/commit/ebc93eb598161e24c57f8e87dd11e5e517326cc6))
- **adapters:** sync lesser-host v0.1.7 and bump dependencies ([5e3b614](https://github.com/equaltoai/greater-components/commit/5e3b61462f98d02eed06862744458a56ccc6931c))

### Bug Fixes

- **docs:** remove stale svelte config suppression ([35ede19](https://github.com/equaltoai/greater-components/commit/35ede19557a92eb8be1b89b8e5b0e35e4bde750c))

### Chores

- backmerge main into premain ([4925504](https://github.com/equaltoai/greater-components/commit/492550499fa69c84e8e0c421cb0ac53b971a8920))
- backmerge premain into staging ([57ea8c1](https://github.com/equaltoai/greater-components/commit/57ea8c1093630d3d3c4104257cc29a8feead8fca))
- **deps:** bump the dependencies group with 5 updates ([9482ccd](https://github.com/equaltoai/greater-components/commit/9482ccdddc681dc2a94e1247068a79fb753ee7db))
- **premain:** release greater 0.4.1-rc.0 ([c0f50c0](https://github.com/equaltoai/greater-components/commit/c0f50c0c54a053085497f127299116c0344e75ea))
- **premain:** release greater 0.4.1-rc.0 ([63f8285](https://github.com/equaltoai/greater-components/commit/63f828590b8632e68d63dea774182b90970fcc32))
- **release:** prepare metadata ([2337162](https://github.com/equaltoai/greater-components/commit/2337162f5ba76bc7e59d1dba4e59ab8953ae2362))

## [0.4.1-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.3.1-rc.0...greater-v0.4.1-rc.0) (2026-03-09)

### Features

- **adapters:** sync lesser-host v0.1.7 ([ebc93eb](https://github.com/equaltoai/greater-components/commit/ebc93eb598161e24c57f8e87dd11e5e517326cc6))
- **adapters:** sync lesser-host v0.1.7 and bump dependencies ([5e3b614](https://github.com/equaltoai/greater-components/commit/5e3b61462f98d02eed06862744458a56ccc6931c))

### Bug Fixes

- **docs:** remove stale svelte config suppression ([35ede19](https://github.com/equaltoai/greater-components/commit/35ede19557a92eb8be1b89b8e5b0e35e4bde750c))

### Chores

- backmerge main into premain ([4925504](https://github.com/equaltoai/greater-components/commit/492550499fa69c84e8e0c421cb0ac53b971a8920))
- backmerge premain into staging ([57ea8c1](https://github.com/equaltoai/greater-components/commit/57ea8c1093630d3d3c4104257cc29a8feead8fca))
- **deps:** bump the dependencies group with 5 updates ([9482ccd](https://github.com/equaltoai/greater-components/commit/9482ccdddc681dc2a94e1247068a79fb753ee7db))
- **main:** release greater 0.4.0 ([9034252](https://github.com/equaltoai/greater-components/commit/90342525e3857bf6f9ee0a706431b3b0c044cbe1))
- **main:** release greater 0.4.0 ([dbf06f1](https://github.com/equaltoai/greater-components/commit/dbf06f16383806b20dada2a9b1bb35b6827d6bad))
- **release:** prepare metadata ([16ce94e](https://github.com/equaltoai/greater-components/commit/16ce94e9fab6871453bd5113ea87e6078b40b09f))

## [0.4.0](https://github.com/equaltoai/greater-components/compare/greater-v0.3.0...greater-v0.4.0) (2026-03-09)

### Features

- **adapters:** sync lesser v1.1.29 ([b5ef6a2](https://github.com/equaltoai/greater-components/commit/b5ef6a2fcda43a74ec0ccbd7b665b4add8a0a3d0))
- **adapters:** sync lesser v1.1.29 ([eb512c7](https://github.com/equaltoai/greater-components/commit/eb512c7fc9dc970368a8b0c2848deecaf90f2f46))

### Chores

- backmerge main into premain ([8e71eb1](https://github.com/equaltoai/greater-components/commit/8e71eb1b3a1fd4c12d7f8a76ff4286d5519b83bb))
- backmerge premain into staging ([01e2942](https://github.com/equaltoai/greater-components/commit/01e2942c35c362e7d38923f359f3d7feb65612ca))

## [0.3.1-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.2.1-rc.0...greater-v0.3.1-rc.0) (2026-03-09)

### Features

- **adapters:** sync lesser v1.1.29 ([b5ef6a2](https://github.com/equaltoai/greater-components/commit/b5ef6a2fcda43a74ec0ccbd7b665b4add8a0a3d0))
- **adapters:** sync lesser v1.1.29 ([eb512c7](https://github.com/equaltoai/greater-components/commit/eb512c7fc9dc970368a8b0c2848deecaf90f2f46))

### Chores

- backmerge main into premain ([8e71eb1](https://github.com/equaltoai/greater-components/commit/8e71eb1b3a1fd4c12d7f8a76ff4286d5519b83bb))
- backmerge premain into staging ([01e2942](https://github.com/equaltoai/greater-components/commit/01e2942c35c362e7d38923f359f3d7feb65612ca))
- **main:** release greater 0.3.0 ([5fd2740](https://github.com/equaltoai/greater-components/commit/5fd27404174e90b28de231540e84be400940edbe))
- **release:** prepare metadata ([404f4ad](https://github.com/equaltoai/greater-components/commit/404f4ad5e72ca074fd3281e0c5d015deeb7089db))

## [0.3.0](https://github.com/equaltoai/greater-components/compare/greater-v0.2.0...greater-v0.3.0) (2026-03-08)

### Features

- **adapters:** sync lesser graphql v1.1.28 ([9c15385](https://github.com/equaltoai/greater-components/commit/9c153850d123a7f892b5f997c97158ff04225bb1))
- **adapters:** sync lesser graphql v1.1.28 ([723e5f8](https://github.com/equaltoai/greater-components/commit/723e5f87ec7336c5b1e5945719c948d45f537316))

### Chores

- backmerge main into premain ([e611522](https://github.com/equaltoai/greater-components/commit/e611522b33c4ffa43be5c81d3d19aaa773579515))
- backmerge premain into staging ([9cfb655](https://github.com/equaltoai/greater-components/commit/9cfb655745de8345691bd2302881410adbe1cb56))

## [0.2.1-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.19-rc.0...greater-v0.2.1-rc.0) (2026-03-08)

### Features

- **adapters:** sync lesser graphql v1.1.28 ([9c15385](https://github.com/equaltoai/greater-components/commit/9c153850d123a7f892b5f997c97158ff04225bb1))
- **adapters:** sync lesser graphql v1.1.28 ([723e5f8](https://github.com/equaltoai/greater-components/commit/723e5f87ec7336c5b1e5945719c948d45f537316))

### Chores

- backmerge main into premain ([e611522](https://github.com/equaltoai/greater-components/commit/e611522b33c4ffa43be5c81d3d19aaa773579515))
- backmerge premain into staging ([9cfb655](https://github.com/equaltoai/greater-components/commit/9cfb655745de8345691bd2302881410adbe1cb56))
- **main:** release greater 0.2.0 ([8a548a0](https://github.com/equaltoai/greater-components/commit/8a548a0bb659cbccb38d1ace1d946cf027ecda02))
- **main:** release greater 0.2.0 ([b12c808](https://github.com/equaltoai/greater-components/commit/b12c808a15c14eeaf772fea0459433750b3f60b7))
- **release:** prepare metadata ([17ea35d](https://github.com/equaltoai/greater-components/commit/17ea35d6ca301d8550befaf8a48974a1d41d9fea))

## [0.2.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.18...greater-v0.2.0) (2026-03-08)

### Features

- **adapters:** sync lesser v1.1.27 soul inventory ([c3f4be0](https://github.com/equaltoai/greater-components/commit/c3f4be09f905483e8732866a11e7f1061cdb6556))
- **adapters:** sync lesser v1.1.27 soul inventory ([c02324b](https://github.com/equaltoai/greater-components/commit/c02324b1c540551a3965cdc7390dc8ec48991f9c))

### Bug Fixes

- **adapters:** satisfy lint and registry validation ([d5cd018](https://github.com/equaltoai/greater-components/commit/d5cd018efe73814042d0ef617695dc9ce78ef2fa))

### Chores

- backmerge main into premain ([9a56db0](https://github.com/equaltoai/greater-components/commit/9a56db0365c6d4b53dc6e0746db9018a49a956d0))
- backmerge premain into staging ([abd6805](https://github.com/equaltoai/greater-components/commit/abd6805136bdfbbc01208f859e6cd982f58d9d3e))

## [0.1.19-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.18-rc.0...greater-v0.1.19-rc.0) (2026-03-08)

### Features

- **adapters:** sync lesser v1.1.27 soul inventory ([c3f4be0](https://github.com/equaltoai/greater-components/commit/c3f4be09f905483e8732866a11e7f1061cdb6556))
- **adapters:** sync lesser v1.1.27 soul inventory ([c02324b](https://github.com/equaltoai/greater-components/commit/c02324b1c540551a3965cdc7390dc8ec48991f9c))

### Bug Fixes

- **adapters:** satisfy lint and registry validation ([d5cd018](https://github.com/equaltoai/greater-components/commit/d5cd018efe73814042d0ef617695dc9ce78ef2fa))

### Chores

- backmerge main into premain ([9a56db0](https://github.com/equaltoai/greater-components/commit/9a56db0365c6d4b53dc6e0746db9018a49a956d0))
- backmerge premain into staging ([abd6805](https://github.com/equaltoai/greater-components/commit/abd6805136bdfbbc01208f859e6cd982f58d9d3e))
- **main:** release greater 0.1.18 ([4e28b93](https://github.com/equaltoai/greater-components/commit/4e28b93bc7320d3d39bd845c259d26047d96eeec))
- **main:** release greater 0.1.18 ([f7c79da](https://github.com/equaltoai/greater-components/commit/f7c79da4b043b772c860ea0d41566b2b90d349b0))
- **release:** prepare metadata ([4379cac](https://github.com/equaltoai/greater-components/commit/4379cac56ea23951531202ebdc49e8419a2c7f99))

## [0.1.18](https://github.com/equaltoai/greater-components/compare/greater-v0.1.17...greater-v0.1.18) (2026-03-08)

### Chores

- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([7b8c0d6](https://github.com/equaltoai/greater-components/commit/7b8c0d633e9e76e79a0943e6c6c721eb5c435b2c))
- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([d4fd4e3](https://github.com/equaltoai/greater-components/commit/d4fd4e39d6518025996bc0e72142ece720c73e1a))
- backmerge main into premain ([ae103e6](https://github.com/equaltoai/greater-components/commit/ae103e689a6246cdb5a54f229e16bc739430114a))
- backmerge premain into staging ([b7fe9fb](https://github.com/equaltoai/greater-components/commit/b7fe9fb091b54202b764ffba693478f24e7adad4))
- **premain:** release greater 0.1.18-rc.0 ([8072468](https://github.com/equaltoai/greater-components/commit/8072468a20b582b5ede83147cbd75ee75fa9426e))
- **premain:** release greater 0.1.18-rc.0 ([eca909a](https://github.com/equaltoai/greater-components/commit/eca909afefad47a48c9f17576059366966bf5a43))
- **release:** prepare metadata ([5c223e2](https://github.com/equaltoai/greater-components/commit/5c223e25b2ef230563fa3bf7a34b4820d9a6f8e8))

## [0.1.18-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.17-rc.0...greater-v0.1.18-rc.0) (2026-03-08)

### Chores

- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([7b8c0d6](https://github.com/equaltoai/greater-components/commit/7b8c0d633e9e76e79a0943e6c6c721eb5c435b2c))
- **adapters:** sync lesser v1.1.26 and lesser-host v0.1.5 ([d4fd4e3](https://github.com/equaltoai/greater-components/commit/d4fd4e39d6518025996bc0e72142ece720c73e1a))
- backmerge main into premain ([ae103e6](https://github.com/equaltoai/greater-components/commit/ae103e689a6246cdb5a54f229e16bc739430114a))
- backmerge main into premain ([04e265f](https://github.com/equaltoai/greater-components/commit/04e265f44442dfea7841b9b3607b3e64be9c7594))
- backmerge premain into staging ([b7fe9fb](https://github.com/equaltoai/greater-components/commit/b7fe9fb091b54202b764ffba693478f24e7adad4))
- **main:** release greater 0.1.17 ([7d18a8b](https://github.com/equaltoai/greater-components/commit/7d18a8b734bc583edf8e03ce0907f2d55538c07c))
- **main:** release greater 0.1.17 ([ff15bde](https://github.com/equaltoai/greater-components/commit/ff15bdeb7ecd509ab4e2922898e53186df685270))
- **release:** prepare metadata ([1f929ab](https://github.com/equaltoai/greater-components/commit/1f929ab539b2c5096c00e26fa697fe0b2c4afcfd))

## [0.1.17](https://github.com/equaltoai/greater-components/compare/greater-v0.1.16...greater-v0.1.17) (2026-03-07)

### Bug Fixes

- **cli:** update full core package file sets ([0757d28](https://github.com/equaltoai/greater-components/commit/0757d28759e7dd99af091c6b59d8460fc2a49bd9))
- **cli:** update full core package file sets ([16df66b](https://github.com/equaltoai/greater-components/commit/16df66b8d9cebcf2113b997a748551b63f97ccea))

### Chores

- backmerge main into premain ([04e265f](https://github.com/equaltoai/greater-components/commit/04e265f44442dfea7841b9b3607b3e64be9c7594))
- **premain:** release greater 0.1.17-rc.0 ([7dca1e8](https://github.com/equaltoai/greater-components/commit/7dca1e810ef99fae7b05c604590105246e3cba3c))
- **premain:** release greater 0.1.17-rc.0 ([b0a9c47](https://github.com/equaltoai/greater-components/commit/b0a9c47df11ed1191971130ffdfe6f733b8733d1))
- **release:** prepare metadata ([84a143b](https://github.com/equaltoai/greater-components/commit/84a143b1dd990fe0019c6fafb65f03d123476ba0))

## [0.1.17-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.16-rc.0...greater-v0.1.17-rc.0) (2026-03-07)

### Bug Fixes

- **cli:** update full core package file sets ([0757d28](https://github.com/equaltoai/greater-components/commit/0757d28759e7dd99af091c6b59d8460fc2a49bd9))
- **cli:** update full core package file sets ([16df66b](https://github.com/equaltoai/greater-components/commit/16df66b8d9cebcf2113b997a748551b63f97ccea))

### Chores

- **premain:** release greater 0.1.16-rc.0 ([0fbf993](https://github.com/equaltoai/greater-components/commit/0fbf993256f120a7b632c80bece9eb918de52785))
- **premain:** release greater 0.1.16-rc.0 ([54eed32](https://github.com/equaltoai/greater-components/commit/54eed323791ee1ac483db64903a66aa841868748))
- **release:** prepare metadata ([e2d7489](https://github.com/equaltoai/greater-components/commit/e2d7489b31a19d8766948156c3d33bf7c3a58043))

## [0.1.16-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.15-rc.1...greater-v0.1.16-rc.0) (2026-03-07)

### Features

- **adapters:** add lesser-host soul client utilities ([9e80a9b](https://github.com/equaltoai/greater-components/commit/9e80a9bee5150d0fc166ef5d514f567338910b19))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([a043b15](https://github.com/equaltoai/greater-components/commit/a043b15f594bfcef1f46b807d8676f746b84f078))
- **adapters:** sync lesser v1.1.25 and lesser-host v0.1.3 ([812335b](https://github.com/equaltoai/greater-components/commit/812335b117e5e3cfa59a380fb8e92bcf37f65995))
- Add DefinitionItem and DefinitionList components, wallet icon, and truncateMiddle utility to the registry. ([e1d1597](https://github.com/equaltoai/greater-components/commit/e1d159717a8f14f727f5e6df780754e0da5bf370))
- Add initial system configuration and logging setup under the new .theory directory. ([7320f65](https://github.com/equaltoai/greater-components/commit/7320f65c6d4e011df71d599b624d22cca5d9c151))
- add numerous Svelte components, icons, and utilities to the CLI test fixture and update the transform utility. ([5bd0c89](https://github.com/equaltoai/greater-components/commit/5bd0c89e0123dca91b8bd2474a5408fa04976be3))
- Add Wallet icon, introduce DefinitionList components, and include truncateMiddle utility. ([85f5c54](https://github.com/equaltoai/greater-components/commit/85f5c54c51093cd0f08c7fe40f2778503be215f7))
- **admin:** improve moderation workflows ([1b5c2d4](https://github.com/equaltoai/greater-components/commit/1b5c2d4acf790e17cc80f585f9f0125ef23c902e)), closes [#154](https://github.com/equaltoai/greater-components/issues/154)
- Adopt Svelte 5 `$derived` for reactive computations and update notification color representation in tests. ([8bdaf5b](https://github.com/equaltoai/greater-components/commit/8bdaf5b215836686e280c2fb1e64a6cc630262f6))
- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))
- **chat:** add AI chat component suite ([20e26dc](https://github.com/equaltoai/greater-components/commit/20e26dc2fab471942aae45f963f27124eee33237))
- **cli:** add doctor --csp and strict CSP docs ([1cfdd12](https://github.com/equaltoai/greater-components/commit/1cfdd12300e4862b414cd563d3116775ef4d3b84))
- **csp:** Add CSP compliance baseline, audit tooling, and refactor core primitives ([7b7ccb3](https://github.com/equaltoai/greater-components/commit/7b7ccb39f8636481ae65babce69550014e2fe6be))
- **csp:** Refactor theme and layout primitives to eliminate inline styles ([3a38517](https://github.com/equaltoai/greater-components/commit/3a385179b670c4103ca55b6552655acc35e0d717))
- Enhance face installer dependency resolution and expand e2e smoke tests for multiple faces. ([b1d3f3f](https://github.com/equaltoai/greater-components/commit/b1d3f3f129b24f8a9874bf55c31d88105b5c2156))
- Generate Lesser API REST client from OpenAPI spec and update Gr… ([5658b8f](https://github.com/equaltoai/greater-components/commit/5658b8f7dae93b0de5b2039ab4089b3b7b442184))
- Generate Lesser API REST client from OpenAPI spec and update GraphQL types. ([4802336](https://github.com/equaltoai/greater-components/commit/4802336a5d085d6eed0213cef64be14077f66f37))
- implement granular package validation scripts and integrate automated package integrity audits into CI workflows, detailed in a new design document. ([0fb1633](https://github.com/equaltoai/greater-components/commit/0fb1633b33e78e13413c1bfc69a8c9a7929c927c))
- implement stable ID system for components and update primitives to utilize it. ([da4b9bd](https://github.com/equaltoai/greater-components/commit/da4b9bd326081ffcda2f5899c77a5fe9dac32955))
- Improve ID generation with `crypto.randomUUID()`, increase typecheck memory, and update registry schema. ([12c631c](https://github.com/equaltoai/greater-components/commit/12c631ce3ad662b273f63aca4ecdb32df126c907))
- Introduce a comprehensive plan to enhance Greater Components quality, completeness, and consistency for CLI-first, fully-vendored workflows. ([9a27fa2](https://github.com/equaltoai/greater-components/commit/9a27fa222483ebd2f793e8e64482b3f1a869b2f6))
- Introduce new shared packages and faces, update CLI tests and utilities, and refine documentation. ([e9557f9](https://github.com/equaltoai/greater-components/commit/e9557f989b369591c64611f62b83fba76bdcd8c7))
- Introduce new utility hooks for stable IDs, enhance CLI registry with core packages, and standardize Vite configurations across the monorepo. ([f326ed1](https://github.com/equaltoai/greater-components/commit/f326ed1625fa45541741e7a4e26c866495335c5f))
- Introduce strict CSP compatibility with new documentation, theme initialization, and build scripts. ([0d9543f](https://github.com/equaltoai/greater-components/commit/0d9543f7eaa21870b3b397c99ecd6a554b9b7972))
- **messaging:** allow background refresh ([fba11d5](https://github.com/equaltoai/greater-components/commit/fba11d5208add59c540dbca992afed1fc1989c06))
- **messaging:** delete-for-me (M4) ([f5c1501](https://github.com/equaltoai/greater-components/commit/f5c15016935c9e2cf9b667384f0242b79ee5cefb))
- **messaging:** inbox/requests dm handlers ([d579ac8](https://github.com/equaltoai/greater-components/commit/d579ac86822e043299f96e5bec81cbb2c7dc7be1))
- **messaging:** realtime updates (M5) ([d28af50](https://github.com/equaltoai/greater-components/commit/d28af5054e43b82ab7309e91505037b294f80f6b))
- **notifications:** render communication notifications ([4b645f8](https://github.com/equaltoai/greater-components/commit/4b645f8217c21bd4a1ecdb5583917867331e4491))
- **notifications:** support communication payloads ([1b1f5a1](https://github.com/equaltoai/greater-components/commit/1b1f5a1575e3a8c0c437587658d70a706764f7c3))
- Pin component references to commit SHAs for consistent fetching, diffing, and updating. ([6a3eb44](https://github.com/equaltoai/greater-components/commit/6a3eb440ddd5163019ec5bac8065bd568fd0704b))
- **prefs:** expose dm delivery setting ([b7d7fee](https://github.com/equaltoai/greater-components/commit/b7d7feecd4953b441cb17414d0c863e6fd7026a8))
- **primitives:** add layout and typography components (Card, Container, Section, Heading, Text) ([7f0f47a](https://github.com/equaltoai/greater-components/commit/7f0f47a4db372867177e229da40c349cdeb474b6))
- Simplify CLI invocation to `greater` and add GitHub releases documentation. ([dc176d1](https://github.com/equaltoai/greater-components/commit/dc176d139d294cbe2bc31bd8667062b474d7fb29))
- **social:** add Unicode fallback to CustomEmojiPicker ([43ff72f](https://github.com/equaltoai/greater-components/commit/43ff72f9d7bd3f8b8e70e40df4712d30ceb22f62))
- **social:** improve post interactions ([c6c12bf](https://github.com/equaltoai/greater-components/commit/c6c12bf83cdf52fbb5029d4db92480d0a7c06c20)), closes [#153](https://github.com/equaltoai/greater-components/issues/153)
- **soul:** add channels and preferences UI components ([1bd005b](https://github.com/equaltoai/greater-components/commit/1bd005b88ed663acd7c46437d30c0602aecc5cb3))

### Bug Fixes

- **a11y:** keep status roles out of feed ([724abfb](https://github.com/equaltoai/greater-components/commit/724abfbec3363004deecc2655c73324928506519))
- **adapters:** default empty conversations results ([32500ad](https://github.com/equaltoai/greater-components/commit/32500ad2e1e1055ad8418bf02daf8a88e2d1386e)), closes [#210](https://github.com/equaltoai/greater-components/issues/210)
- **adapters:** handle empty GraphQL query results ([58c7bfe](https://github.com/equaltoai/greater-components/commit/58c7bfece1a56eb97bab549f6c206000525d60bf))
- **adapters:** pin Lesser v1.1.11 + suppress empty conversations error ([f4b21c0](https://github.com/equaltoai/greater-components/commit/f4b21c0049b10af8b5a605e4b7648b9a59579989))
- **adapters:** trim baseUrl without regex ([f3cbe99](https://github.com/equaltoai/greater-components/commit/f3cbe9900a7f3fac06f569fdd167236c01f09683))
- add isomorphic-dompurify as optional peer dependency ([213d181](https://github.com/equaltoai/greater-components/commit/213d181a20ac31229ac42dae82bc307d9139abf6))
- add missing test wrapper components and format registry ([31fffb1](https://github.com/equaltoai/greater-components/commit/31fffb1ede34c5bcb19ddbb47dec3d4912165cbf))
- **admin:** use valid Button variant ([638824f](https://github.com/equaltoai/greater-components/commit/638824ff110a150621058572f7ad09e2d94523f3))
- **artist:** resolve accessibility violations and build errors ([531e521](https://github.com/equaltoai/greater-components/commit/531e521e15eaeec46350931efd9536683229979f))
- **ci:** accept semver and format registry index ([ed61735](https://github.com/equaltoai/greater-components/commit/ed617350a74be11c979eda014b51be509b78ac14))
- **ci:** configure git identity for release tags ([90784db](https://github.com/equaltoai/greater-components/commit/90784db0f72cbc0ad4eae1207f0155629d571847))
- **ci:** git identity for tag release ([d8372fa](https://github.com/equaltoai/greater-components/commit/d8372fa974dff37baa4f345ff893c27d94f41db0))
- **ci:** pass lint workflow ([d6a1c96](https://github.com/equaltoai/greater-components/commit/d6a1c96df1dfb813a5d9a2b6803ed7e5a7505c4b))
- **ci:** release guard semver regex ([0ddfefc](https://github.com/equaltoai/greater-components/commit/0ddfefc8f62753b0a8b00f594c4cd85b97a61990))
- **ci:** resolve lint/format/test failures ([634e629](https://github.com/equaltoai/greater-components/commit/634e6290b33d687e7100f01d620640a77a55768d))
- **cli,social:** install social timeline + virtual scrolling ([92c544f](https://github.com/equaltoai/greater-components/commit/92c544f463204136410097978fa2f7781f8da15b)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **cli:** include admin Agents files in vendored installs ([68c8541](https://github.com/equaltoai/greater-components/commit/68c8541aec282ef3a17add072ee46fc55ba114e3))
- **cli:** reliable CSS + consistent release artifacts ([68649a9](https://github.com/equaltoai/greater-components/commit/68649a92d6b8d30ba304b36462bfb72d13d6aa3b))
- **cli:** skip local CSS import injection when local CSS copy fails ([5ac951b](https://github.com/equaltoai/greater-components/commit/5ac951bfedbc5e2f9c18616f3b7c0aca9be09bf0))
- **cli:** skip local CSS injection when copy fails ([fc52dbc](https://github.com/equaltoai/greater-components/commit/fc52dbcbf9c23ed8b77f0e0b1166d41a75d17df9))
- **cli:** stabilize local CSS + ref fetching ([4fd1c25](https://github.com/equaltoai/greater-components/commit/4fd1c257d1cd612ff9b5810888990bd84020c859))
- **compose:** include new object fields in optimistic updates ([9f28a34](https://github.com/equaltoai/greater-components/commit/9f28a3440484eec3906b8fd32c22ecc792c32fd2))
- **csp:** make primitives transitions WAAPI-based ([703b1bd](https://github.com/equaltoai/greater-components/commit/703b1bda9aafd3d5b9939c8c6af160725fae502a))
- **csp:** remove inline style writes from utils ([79bb770](https://github.com/equaltoai/greater-components/commit/79bb770ec53125f283e9f2310d4012d174a764df))
- **csp:** remove inline styles from virtualized timelines ([22aa0fc](https://github.com/equaltoai/greater-components/commit/22aa0fc2a8f4d041cf92f92f4ead819337774742))
- **csp:** remove runtime inline-style writes from primitives ([b4e8a3d](https://github.com/equaltoai/greater-components/commit/b4e8a3dcf541bc3e0862692c864cd254a6aa831f))
- **csp:** remove runtime style injection from artist face ([c62a4d9](https://github.com/equaltoai/greater-components/commit/c62a4d979e74d3d9292bc1b8c89d71f8c4b92dfe))
- **csp:** remove runtime style writes from headless ([9858a2b](https://github.com/equaltoai/greater-components/commit/9858a2bc563480b9f2eb54be7a7d1fd2776c9971))
- **csp:** replace textarea autosize with CSS-driven helper ([c845b6a](https://github.com/equaltoai/greater-components/commit/c845b6a205af850efd3a9e9fca8746742ae56110))
- **csp:** strict CSP issue sweep ([#180](https://github.com/equaltoai/greater-components/issues/180), [#187](https://github.com/equaltoai/greater-components/issues/187)–[#195](https://github.com/equaltoai/greater-components/issues/195)) ([241aeab](https://github.com/equaltoai/greater-components/commit/241aeabfc01754668dad1a2fca5aa54492bcf9e5))
- **docs:** make theme init typecheck-safe ([3700db6](https://github.com/equaltoai/greater-components/commit/3700db6ec258449a7f4a4d042275d78d96da0672))
- fix usage and inline script interpolation in layout ([d55f080](https://github.com/equaltoai/greater-components/commit/d55f0804541b2fc9be3efab8df7137123ef5d762))
- **graphql:** pin Lesser v1.1.1 + expand fragments ([d68fd59](https://github.com/equaltoai/greater-components/commit/d68fd592e3e1e18b0bd08d925a5d6a1d2afbf19b)), closes [#168](https://github.com/equaltoai/greater-components/issues/168)
- make social scaffold pass strict checks ([a72e19b](https://github.com/equaltoai/greater-components/commit/a72e19b5d54e1c932a91dea20e096d06d46e3560)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **notifications:** add utils dependency ([3400e55](https://github.com/equaltoai/greater-components/commit/3400e553cde5bae810037bdcca9600f68c58af83))
- **playground:** bind search context ([ac0aa64](https://github.com/equaltoai/greater-components/commit/ac0aa64c912d8bb0f92c87ee3253282a3e755ea9))
- **playground:** prevent icon gallery crash ([5086560](https://github.com/equaltoai/greater-components/commit/5086560fd147546b7079fd5d0d394978a66a7ffa))
- reduce social face svelte-check errors ([2833ed4](https://github.com/equaltoai/greater-components/commit/2833ed4ee12b79eb4a3dbcac5ffe97f00d9379d7)), closes [#152](https://github.com/equaltoai/greater-components/issues/152)
- **registry:** keep index ref on release tag ([6664cdb](https://github.com/equaltoai/greater-components/commit/6664cdb208ab951fa8c2861a2eca6ed5645ddefe))
- **registry:** regenerate index ([43978b6](https://github.com/equaltoai/greater-components/commit/43978b6d293e385c040a96274f19302dbcb1c93d))
- **registry:** regenerate index ([17142da](https://github.com/equaltoai/greater-components/commit/17142da9d2b3f847cb9b856afd7d2fcb46ba246d))
- **registry:** regenerate index checksums ([f83435b](https://github.com/equaltoai/greater-components/commit/f83435b1c451771160d4aaeb2b74955c434537d5))
- **registry:** regenerate index checksums ([6e5b47b](https://github.com/equaltoai/greater-components/commit/6e5b47b29013f761bb4332a671590f2261d905e0))
- replace remaining regex patterns with indexOf-based parsing ([59d2139](https://github.com/equaltoai/greater-components/commit/59d2139d179ff87cbc846a3c0927ffb747b67685))
- resolve all CodeQL security alerts ([c1a510b](https://github.com/equaltoai/greater-components/commit/c1a510bb63c9d073d3719a9243d1a6669bbb55a1))
- resolve CodeQL security alerts ([6f749ba](https://github.com/equaltoai/greater-components/commit/6f749bab62f8c864c0bedae7cef1103bcbc794fe))
- resolve CodeQL security issues and remove changeset workflow ([4502a11](https://github.com/equaltoai/greater-components/commit/4502a1142901117b4f77f97294d5158ed12d8ab9))
- resolve ESLint errors in layout ([aff2264](https://github.com/equaltoai/greater-components/commit/aff22647af9cc1a897871321dfc2b1a80f734c24))
- resolve linting issues in tests ([62a9827](https://github.com/equaltoai/greater-components/commit/62a98274d802ad28854d9a844def3cbc9c37aded))
- resolve pnpm lint errors and avoid suppression, update registry index ([baf8019](https://github.com/equaltoai/greater-components/commit/baf801927048af6b74b353ee7682e62d50593491))
- resolve TypeScript errors in typecheck ([63bbaec](https://github.com/equaltoai/greater-components/commit/63bbaec6335d49bc7f522f3f55e55b65529f08c0))
- **security:** handle malformed closing script tags ([5fc4091](https://github.com/equaltoai/greater-components/commit/5fc409190dc2ac4e297c07d518e2d7c4b2a9d59d))
- **security:** harden CSP script tag regex ([3149603](https://github.com/equaltoai/greater-components/commit/31496039869acaa0c85583cc21e0abc8499cbc7d))
- **security:** harden HTML rendering and path handling ([d6f3bc9](https://github.com/equaltoai/greater-components/commit/d6f3bc94f52e9ffa778ce2a349110abc198723fa))
- **security:** harden HTML rendering and path handling ([f871ece](https://github.com/equaltoai/greater-components/commit/f871ece4e14464ee60d0ff1aa0315fa8c7ae826e))
- **social:** remove global BackupCodes theme styles ([8c9405a](https://github.com/equaltoai/greater-components/commit/8c9405adbf6bbf45941df99255b6d3c5264e4964))
- **soul:** satisfy strict svelte-check ([0603c37](https://github.com/equaltoai/greater-components/commit/0603c377420e7b28e5467b286876af2c4fc63be0))
- Update date format test to handle year boundary edge case ([702b60e](https://github.com/equaltoai/greater-components/commit/702b60ecbde892bc00c27ebeb9b0f822d3073666))
- update Svelte check configuration and enhance accessibility report generation ([1ffd17c](https://github.com/equaltoai/greater-components/commit/1ffd17c36eae39f2a140ab057e462991cf9ab5f9))
- use const for searchFrom variables (ESLint prefer-const) ([4ca9f7f](https://github.com/equaltoai/greater-components/commit/4ca9f7f0acfa3a491ac1381fe0d21d52cb1c10b7))
- use valid DCO action (tim-actions/dco) ([127597f](https://github.com/equaltoai/greater-components/commit/127597fe8fcd80b7f2ccb12b1800eb35d0b34007))

### Refactors

- Clean up linting ignores and enhance gallery grid `aria-label` for improved accessibility. ([b671736](https://github.com/equaltoai/greater-components/commit/b671736cdadb7b8fbc5ecd50599ae7909f3b8355))
- **cli:** resolve linting errors in dependency-resolver ([bd0ace0](https://github.com/equaltoai/greater-components/commit/bd0ace05344b64d33d236ee15867adbd14d6a931))
- replace wildcard package exports with explicit component paths and add a phase 3 planning document. ([816495b](https://github.com/equaltoai/greater-components/commit/816495bb323acd8f4f0971c38e8e1fc5dc5c96f4))
- streamline JSON formatting in registry index generation ([158d0ad](https://github.com/equaltoai/greater-components/commit/158d0ad9c82d2c039f4033d1f48ff8ab1e5af231))
- Update numerous icon components and their associated type definitions for primitives and utilities. ([b565587](https://github.com/equaltoai/greater-components/commit/b565587044de410c5fb2c76430c3d50abc926e28))
- update numerous Svelte components, tests, and styling across artist, social, blog, and shared packages, and adjust CSP auditing. ([bf1791b](https://github.com/equaltoai/greater-components/commit/bf1791ba832f79d6c632918eca8d007d8ce91f27))
- update primitive components, their tests, and menu positioning logic. ([015f17d](https://github.com/equaltoai/greater-components/commit/015f17d0cbb591bd15e828a4bee48e295399f1c5))

### Docs

- add issue sweep plan for open issues ([7e9c169](https://github.com/equaltoai/greater-components/commit/7e9c169b7d4199341cbf20c07955acd0c0d77d71))
- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))
- **devops:** define release criteria ([30afbf1](https://github.com/equaltoai/greater-components/commit/30afbf17e7d1a445247d5a2c0587a45a8436d691))
- update component import paths and usage examples across various documentation pages. ([ade651e](https://github.com/equaltoai/greater-components/commit/ade651e736b9c8491a7d846df292f243f68d61d8))

### CI

- adopt premain/main release flow ([b44e1b5](https://github.com/equaltoai/greater-components/commit/b44e1b58c7765396e4b3258974169a284f769188))
- adopt premain/main release flow ([ff1bf38](https://github.com/equaltoai/greater-components/commit/ff1bf382af8c348672353ff31f93bba36ebf9669))
- **coverage:** make workflow dispatchable ([52a06d0](https://github.com/equaltoai/greater-components/commit/52a06d09f57dc9d7df0b9c6a7b8cac2981ba47a1))
- **deps:** bump artifact actions ([6bcd038](https://github.com/equaltoai/greater-components/commit/6bcd03801a04a4af9e613094907a7a90dfcbadeb))
- dispatch main/premain guard checks ([9d315de](https://github.com/equaltoai/greater-components/commit/9d315debb4b03114bf1006bebb303e5fcda335b8))
- dispatch main/premain guard checks ([c3a2607](https://github.com/equaltoai/greater-components/commit/c3a260740b07fd76d4f951f8d658da2ff0985618))
- make Codecov upload optional ([e4b96c2](https://github.com/equaltoai/greater-components/commit/e4b96c21b946a65cd4f11edc71a6eb00280ca6c2))
- make Codecov upload optional ([bed813d](https://github.com/equaltoai/greater-components/commit/bed813d133ef4a723fbe1f90bab3ca62ba2baade))
- **release:** keep premain prereleases ahead of stable ([af0d06b](https://github.com/equaltoai/greater-components/commit/af0d06b4c1df9353ac64b22371e1cf2040048c86))
- **release:** keep premain prereleases ahead of stable ([dec045f](https://github.com/equaltoai/greater-components/commit/dec045fb6d3d41d3eca10dc8c51094d63ee3dcb4))
- **release:** keep premain release-as prerelease ([44853fe](https://github.com/equaltoai/greater-components/commit/44853fe6e958ffa8a0c6d134d860d547fa54f310))
- **release:** release-please should include chore commits ([7d450f8](https://github.com/equaltoai/greater-components/commit/7d450f850c189a7da50099dbad7e558da265e9c4))
- **release:** treat chore commits as user-facing ([5a3b5e0](https://github.com/equaltoai/greater-components/commit/5a3b5e0b9654be1960c0551a46b09f738afff1f1))
- **release:** unify build + pack pipeline ([ab70579](https://github.com/equaltoai/greater-components/commit/ab705792be3d497409ea1661be5512cb18ba914d))
- streamline staging checks ([b57ca93](https://github.com/equaltoai/greater-components/commit/b57ca9346fb8a7021db16116bdc957b503d7c5fa))

### Tests

- **adapters:** add comprehensive unit tests for transport classes ([9d69713](https://github.com/equaltoai/greater-components/commit/9d6971373179b4638a82222304f4999a58f6b57d))
- **adapters:** enhance coverage for transports and manager ([e477c55](https://github.com/equaltoai/greater-components/commit/e477c55b56979323cc020ecdef342943659f7ed0))
- **adapters:** increase coverage for lesser mappers, graphql adapter, and stores ([e914d10](https://github.com/equaltoai/greater-components/commit/e914d106c793dc305aa300d229a40141bc434610))
- **artist:** add coverage harness and initial scenarios for zero-coverage components ([70f3c78](https://github.com/equaltoai/greater-components/commit/70f3c78bc6a65db5c66cc94d5db40d67e6c6bf9d))
- **auth:** improve coverage to &gt;60% ([16dc071](https://github.com/equaltoai/greater-components/commit/16dc071bb05df9c5637f27164d9a2bd576a7fe5a))
- **chat:** improve coverage for chat components and context ([fcfc553](https://github.com/equaltoai/greater-components/commit/fcfc553073bdc02d3d1cbf8787fc50b1ccef7a0e))
- **cli:** complete test coverage expansion ([ae6a74d](https://github.com/equaltoai/greater-components/commit/ae6a74ddca1b6c25edcf2ff9689831cbaad4ca7f))
- **cli:** expand coverage for core commands ([09a9a06](https://github.com/equaltoai/greater-components/commit/09a9a06ae80169d6ac54449bf061d1a42bff0545))
- **compose:** improve coverage for compose components ([a509cac](https://github.com/equaltoai/greater-components/commit/a509cac2bd445e618d259393eb690514c1c66270))
- **coverage:** expand coverage for compose package ([0b5caaf](https://github.com/equaltoai/greater-components/commit/0b5caaf3b93127641a57b8130d4c95061cd8a5b7))
- **coverage:** expand tests for faces/community and shared/auth ([f281df5](https://github.com/equaltoai/greater-components/commit/f281df555acb1bff60df03b8a4a8ddc3e6e77387))
- **coverage:** improve coverage for notifications, tokens, and blog ([8b26fb3](https://github.com/equaltoai/greater-components/commit/8b26fb3b7da0115112fb0b40d10e2cd191f730b0))
- **faces/social:** add tests for SettingsPanel ([4bd973a](https://github.com/equaltoai/greater-components/commit/4bd973aeaaad934daefe9e1f4e9bde4858369f0a))
- **faces/social:** add tests for Status Content and Media components ([830fb29](https://github.com/equaltoai/greater-components/commit/830fb2932142372d0ec62b389a63f7cb2a457f58))
- **faces/social:** improve component test coverage ([869e6ef](https://github.com/equaltoai/greater-components/commit/869e6ef6f6533f7ab82c6deddc8073bce5c04970))
- **faces/social:** Improve coverage for social components ([903bfe0](https://github.com/equaltoai/greater-components/commit/903bfe0b8f5d1ec534bb999e2a17650bf6ed0ac8))
- fix wrappers and headless mocks ([14b624b](https://github.com/equaltoai/greater-components/commit/14b624b841691941bde23100a5edc1e8311a6dca))
- **icons:** add comprehensive prop tests and remove mocks ([dfa0ff6](https://github.com/equaltoai/greater-components/commit/dfa0ff640c7c8f251d99bac4e7c6ebcf4f9d6f97))
- **icons:** add registry and improved SSR tests ([5a7cb43](https://github.com/equaltoai/greater-components/commit/5a7cb43a33184a9340f8692166b4ed9efce68d0a))
- **messaging:** expand and improve component test coverage ([7db667c](https://github.com/equaltoai/greater-components/commit/7db667c73c15b99e8a990e4f84d750f829d126f6))
- **messaging:** improve coverage for utils, MediaUpload, and NewConversation ([c9304ca](https://github.com/equaltoai/greater-components/commit/c9304ca9e052ac5d470362ecbf4fb321be139149))
- **primitives:** expand coverage for Badge, Button, Select, and Menu ([8eff050](https://github.com/equaltoai/greater-components/commit/8eff05041b73d993b1824b91b81cdc0ba95ffb6f))
- **primitives:** improve coverage for Alert, Menu, Transitions and fixes config ([9c666c5](https://github.com/equaltoai/greater-components/commit/9c666c5e82ba78102d003a6c247c2d2d2b44dcd1))
- **shared:** add tests for messaging and search components, fix bugs and imports ([a275f78](https://github.com/equaltoai/greater-components/commit/a275f7851334ed932a04d2817dfc62179491a692))
- **social:** add component tests and improve coverage ([90a9d1a](https://github.com/equaltoai/greater-components/commit/90a9d1a842f119c8c506a17ec6ca5641c0b4a183))
- **social:** increase coverage for Profile, Timeline and Feed components ([8fdf796](https://github.com/equaltoai/greater-components/commit/8fdf79615997bcdb363351f851bb0b2b57c2a8cd))

### Chores

- add changeset and format new CLI files ([78adf68](https://github.com/equaltoai/greater-components/commit/78adf68841307a84b3df951bb5a6a724a59ff0f7))
- align versions and automate releases ([d0d449b](https://github.com/equaltoai/greater-components/commit/d0d449bb72358549815e8e42851267ace75a4a6a))
- align versions and automate releases ([6c9496f](https://github.com/equaltoai/greater-components/commit/6c9496f3d7efa4902f604b9aacf5cf3b112c539f))
- backmerge main into premain ([fdf8266](https://github.com/equaltoai/greater-components/commit/fdf8266bc275606183afc684dd7d1fc2d6bb1378))
- backmerge main into premain ([31cc7aa](https://github.com/equaltoai/greater-components/commit/31cc7aab4c70967a93743e47c6b2b12b55b65136))
- backmerge main into staging ([bcb6e55](https://github.com/equaltoai/greater-components/commit/bcb6e554ec6953131a859c3fb767a517ed874275))
- backmerge main into staging ([eacd418](https://github.com/equaltoai/greater-components/commit/eacd41859475c6fac063b40e4b7fcef4fbcbc2ac))
- backmerge premain into staging ([b52676d](https://github.com/equaltoai/greater-components/commit/b52676d60fefa9a6f1b027684dac079929285a2d))
- backmerge premain into staging ([ee5d81c](https://github.com/equaltoai/greater-components/commit/ee5d81ce4a17202df4a1b773eb8bb6ca272c633d))
- backmerge premain into staging ([ff92e4c](https://github.com/equaltoai/greater-components/commit/ff92e4cbf8426191120b36b21583493ba340200b))
- backmerge premain into staging ([7f259f7](https://github.com/equaltoai/greater-components/commit/7f259f7aa6852ee3ebb54a4a7629c879a611c258))
- bump svelte to 5.53.0 ([9d6a300](https://github.com/equaltoai/greater-components/commit/9d6a300f6032dd345b581240348eb947667664bf))
- bump svelte to 5.53.0 ([acc3ce0](https://github.com/equaltoai/greater-components/commit/acc3ce071df62d17a6d5ba615369e192bdff53e0))
- **ci:** adopt AppTheory release flow ([3c6c2df](https://github.com/equaltoai/greater-components/commit/3c6c2df91dd625c8ef4ae2f101bc89a9ed439b58))
- **ci:** adopt AppTheory release flow + pin Node 24 ([496b85b](https://github.com/equaltoai/greater-components/commit/496b85b693bec32cc65f589c97443efa161b5aca))
- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **ci:** ensure release-please PRs run CI checks ([67f766b](https://github.com/equaltoai/greater-components/commit/67f766b8e55cdedfb1ceff4cfacd2b220e50c821))
- **ci:** fix prettier + playwright demo ([5c4886a](https://github.com/equaltoai/greater-components/commit/5c4886a11fde8255df81fbb5d2b2d9c464febbc3))
- **ci:** run checks for release-please PRs ([b2dc38d](https://github.com/equaltoai/greater-components/commit/b2dc38d23ac1b97e5e2bfa0718f68ba25534e683))
- **contracts:** bump lesser to v1.1.24 ([81a9829](https://github.com/equaltoai/greater-components/commit/81a98290895b06e9ace85e12454ab4aa1550d57d))
- **contracts:** bump lesser to v1.1.24 ([9c1f3ab](https://github.com/equaltoai/greater-components/commit/9c1f3ab54c263760d32e47fbbbc41ca0a323d8cd))
- **csp:** extend validate:csp for runtime strict CSP ([a8139a5](https://github.com/equaltoai/greater-components/commit/a8139a571164ba9b7e590f79c343585d8afc27de))
- **deps-dev:** Bump @types/node from 24.10.2 to 25.0.3 ([eefbafc](https://github.com/equaltoai/greater-components/commit/eefbafcd44f994fd236a4cb44f07b00c4facceba))
- **deps-dev:** Bump globals from 16.5.0 to 17.0.0 ([0864bf9](https://github.com/equaltoai/greater-components/commit/0864bf9098ed2148e5026d5b327f11079a26a334))
- **deps-dev:** Bump the svelte group with 3 updates ([7e35da4](https://github.com/equaltoai/greater-components/commit/7e35da4ea11d20e8dd3a2ee9e25fc0157a8aa9b6))
- **deps-dev:** Bump the typescript group with 3 updates ([d4a09dd](https://github.com/equaltoai/greater-components/commit/d4a09dd99cd4efe15767a27e859d9ecd35179514))
- **deps:** batch dependency updates ([ebde35b](https://github.com/equaltoai/greater-components/commit/ebde35b7cd21f63e0212c83af84c516513032d5c))
- **deps:** bump graphql-codegen ([d2490c5](https://github.com/equaltoai/greater-components/commit/d2490c5890f00641783c1c8637e6cb64237e7da0))
- **deps:** Bump the dependencies group across 1 directory with 26 updates ([9092ec8](https://github.com/equaltoai/greater-components/commit/9092ec8c2a805d73a94d81d0e4eadeed59000a90))
- **deps:** Bump the dependencies group with 26 updates ([a6d9167](https://github.com/equaltoai/greater-components/commit/a6d916793787d58a1e8e5d51524a7162ea7e9e12))
- **deps:** patch audited vulnerabilities ([c9902e6](https://github.com/equaltoai/greater-components/commit/c9902e6d560a76f27e5a6d67da765b8b264b06f1))
- **deps:** update to latest stable ([8accdbf](https://github.com/equaltoai/greater-components/commit/8accdbfde97c9473cb0454dcc42bc217db9ea484))
- **deps:** update to latest stable ([863e1e2](https://github.com/equaltoai/greater-components/commit/863e1e277e5f0be1db7a9cf24850e33dc8e3ff42))
- **deps:** update workspace dependencies ([5e15fbc](https://github.com/equaltoai/greater-components/commit/5e15fbc3223cf96ef26d305506f705132fc1488d))
- **deps:** update workspace dependencies ([2391851](https://github.com/equaltoai/greater-components/commit/23918518bb23851a7e06761817c2f19b57fccff0))
- **deps:** update workspace dependencies ([0e44a94](https://github.com/equaltoai/greater-components/commit/0e44a94edcfe74ed9e12cdfa16adbb012e2b710f))
- fix CI validation ([f8c2958](https://github.com/equaltoai/greater-components/commit/f8c2958546c380839f30f3a1c4faed244a05dd0e))
- fix PR 136 CI failures ([1a25642](https://github.com/equaltoai/greater-components/commit/1a2564251aeeccc917babd653a2793c7cf32fa1d))
- format + regenerate registry ([ad0abd4](https://github.com/equaltoai/greater-components/commit/ad0abd42f5ee47f4ca35290f41de2940eee17acb))
- format adapter tests ([28d6a71](https://github.com/equaltoai/greater-components/commit/28d6a71874a4ca808fb017397c705606aa18ee1f))
- format and regenerate registry ([148f214](https://github.com/equaltoai/greater-components/commit/148f214da81663a646ebc2615791de1988318dce))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- include greater-components package in changeset ([bf145e2](https://github.com/equaltoai/greater-components/commit/bf145e2d5c7a6fd39419479817d87569bdb88f76))
- **lesser:** pin contracts to 9f072443 ([2ef3e4b](https://github.com/equaltoai/greater-components/commit/2ef3e4bfa65d1f9d5839552ebdaf79eba5e25b0e))
- **lesser:** pin contracts to v1.1.10 ([c0d8fc2](https://github.com/equaltoai/greater-components/commit/c0d8fc20e1e0756832772e478c93520c38b3a228))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** release greater 0.1.10 ([667640a](https://github.com/equaltoai/greater-components/commit/667640a877db74622bede34003a86d9e600bb0dd))
- **main:** release greater 0.1.10 ([6ac2237](https://github.com/equaltoai/greater-components/commit/6ac22374d04c698932972320b3c79ab67ca76402))
- **main:** release greater 0.1.11 ([9c0ffec](https://github.com/equaltoai/greater-components/commit/9c0ffec99ff5906d9836909d1e303f2fe3df240e))
- **main:** release greater 0.1.11 ([7bac630](https://github.com/equaltoai/greater-components/commit/7bac6304929b7ce1e26cccaaa33057e77308f0f3))
- **main:** release greater 0.1.12 ([4c0a357](https://github.com/equaltoai/greater-components/commit/4c0a35779d1e5fe72cbe4bb3277d04a0cff9b72a))
- **main:** release greater 0.1.12 ([1b07132](https://github.com/equaltoai/greater-components/commit/1b071322ea489d2e37d00b4187060ad64fa98c02))
- **main:** release greater 0.1.13 ([0587386](https://github.com/equaltoai/greater-components/commit/0587386f177206f3c2c639909a2d1444b92856c9))
- **main:** release greater 0.1.13 ([c1ce3a6](https://github.com/equaltoai/greater-components/commit/c1ce3a6e4c30d584ad39d99c317783eae7fe6d59))
- **main:** release greater 0.1.14 ([df67b91](https://github.com/equaltoai/greater-components/commit/df67b911564eb3fcb13bf912302623d6d64cf90d))
- **main:** release greater 0.1.14 ([505dffe](https://github.com/equaltoai/greater-components/commit/505dffe6186e189cada19d7ad90502e00ecde878))
- **main:** release greater 0.1.15 ([fee7e6c](https://github.com/equaltoai/greater-components/commit/fee7e6cd9fcb907072fd304dcc0f6c88a640faf6))
- **main:** release greater 0.1.15 ([eea6ed8](https://github.com/equaltoai/greater-components/commit/eea6ed8915bb01ee5c15130cabb1755a981211b5))
- **main:** release greater 0.1.2 ([14081f1](https://github.com/equaltoai/greater-components/commit/14081f1dbd06a8bdb1e214e746c130c90e9fcf50))
- **main:** release greater 0.1.2 ([6c38f5b](https://github.com/equaltoai/greater-components/commit/6c38f5b88a7a5cd75c0a3f6eaa8ef05f95216a8d))
- **main:** release greater 0.1.3 ([4d2bdb1](https://github.com/equaltoai/greater-components/commit/4d2bdb1324069c57beb002ca2a392843bc672807))
- **main:** release greater 0.1.3 ([9233571](https://github.com/equaltoai/greater-components/commit/92335713080be1bae6565f91ed7e26f6859ad143))
- **main:** release greater 0.1.4 ([dcf4a35](https://github.com/equaltoai/greater-components/commit/dcf4a3555d1a5cb54b9ea73e28099225d1725223))
- **main:** release greater 0.1.4 ([fcf9858](https://github.com/equaltoai/greater-components/commit/fcf98582fdd561584d175009785000d6a18e836c))
- **main:** release greater 0.1.5 ([5301936](https://github.com/equaltoai/greater-components/commit/5301936bd01626ccbf982c59a632caa9a8825dfe))
- **main:** release greater 0.1.5 ([7827364](https://github.com/equaltoai/greater-components/commit/7827364fe0da2b0b5d1be8daf3e49b4762ead2b6))
- **main:** release greater 0.1.6 ([b68eaf8](https://github.com/equaltoai/greater-components/commit/b68eaf8b983c2511def417009771455b237774b1))
- **main:** release greater 0.1.6 ([5492fad](https://github.com/equaltoai/greater-components/commit/5492faddf363cdd55ba60e229bc4f0f0a044386f))
- **main:** release greater 0.1.7 ([c1970f1](https://github.com/equaltoai/greater-components/commit/c1970f1f7d51d69b1d924be718765c52b2c75d75))
- **main:** release greater 0.1.7 ([8182b0e](https://github.com/equaltoai/greater-components/commit/8182b0e056d49bf6b69fb8a50541cc36e5ea9539))
- **main:** release greater 0.1.8 ([1789f15](https://github.com/equaltoai/greater-components/commit/1789f15695b105e80aec7fadc2513893fdfcdcd6))
- **main:** release greater 0.1.8 ([e24b167](https://github.com/equaltoai/greater-components/commit/e24b167cf469079936cd1808a197184a78288029))
- **main:** release greater 0.1.9 ([c697281](https://github.com/equaltoai/greater-components/commit/c6972811cb190941800ca06992d8eba1ba76466c))
- **main:** release greater 0.1.9 ([b295a9f](https://github.com/equaltoai/greater-components/commit/b295a9f802c7b88debf3d8de84cffedcbb16ec43))
- merge main into premain ([3f2ba88](https://github.com/equaltoai/greater-components/commit/3f2ba88b26ace6b4814e903f3780065944c5f942))
- merge premain into staging ([5401dc9](https://github.com/equaltoai/greater-components/commit/5401dc947959e547fca08ec7da624556f27abc1f))
- pin Lesser v1.1.10 + fix open issues ([a60c1e2](https://github.com/equaltoai/greater-components/commit/a60c1e204a512f7107ff36e2311d48756bb43afd))
- pin lesser v1.1.23 and lesser-host v0.1.0 contracts ([c47e701](https://github.com/equaltoai/greater-components/commit/c47e70193c0ada34aa08f2ece49b2068379b0fcc))
- **playground:** drop [@pai](https://github.com/pai) snippet ([484bfb4](https://github.com/equaltoai/greater-components/commit/484bfb4725485ec21d1336e9a2c5b6042ade83c2))
- **premain:** prepare release metadata for 0.1.2-rc ([52a60a3](https://github.com/equaltoai/greater-components/commit/52a60a3e7a3b12018552e653a98eb783ef6482a3))
- **premain:** release greater 0.1.10-rc.0 ([315a795](https://github.com/equaltoai/greater-components/commit/315a7953d6b3877c768c38d65b6b20782666e0be))
- **premain:** release greater 0.1.10-rc.0 ([c01b453](https://github.com/equaltoai/greater-components/commit/c01b45380a1d832c0978fe505bb1200f491fe22c))
- **premain:** release greater 0.1.11-rc.0 ([c3dd48e](https://github.com/equaltoai/greater-components/commit/c3dd48e96f586e7cae787d6fc5d568382cd20b65))
- **premain:** release greater 0.1.11-rc.0 ([0d94f53](https://github.com/equaltoai/greater-components/commit/0d94f53bf84447a4ddc4239493c3d22b739e8bc9))
- **premain:** release greater 0.1.12-rc.0 ([bd75d6d](https://github.com/equaltoai/greater-components/commit/bd75d6d8174b0ce9ad6fe4c19adc17494bee8847))
- **premain:** release greater 0.1.12-rc.0 ([ec71322](https://github.com/equaltoai/greater-components/commit/ec71322c0efeb4194730f4b9d31f81d51b9936ca))
- **premain:** release greater 0.1.13-rc.0 ([0d1572a](https://github.com/equaltoai/greater-components/commit/0d1572a8226ee53f3c9e86284076c0b601c7fc02))
- **premain:** release greater 0.1.13-rc.0 ([69d79a3](https://github.com/equaltoai/greater-components/commit/69d79a32f47d260345192e73e62f163e41a224fa))
- **premain:** release greater 0.1.14-rc.0 ([d00b84d](https://github.com/equaltoai/greater-components/commit/d00b84d2d27c66dbc2fa2e43e6b8a181b4867696))
- **premain:** release greater 0.1.14-rc.0 ([20cd845](https://github.com/equaltoai/greater-components/commit/20cd8450daecb015bd8f7213305d5f97112614d6))
- **premain:** release greater 0.1.15-rc.0 ([13b45a1](https://github.com/equaltoai/greater-components/commit/13b45a1313a749bb77ff4afb8113fc8820ae7f09))
- **premain:** release greater 0.1.15-rc.0 ([e1c4e6a](https://github.com/equaltoai/greater-components/commit/e1c4e6a08eb12068c0f17d1b252d1ece86ed329c))
- **premain:** release greater 0.1.15-rc.1 ([a4e3c62](https://github.com/equaltoai/greater-components/commit/a4e3c629d1315f69d410db8a7377dca4ab0ffdd4))
- **premain:** release greater 0.1.15-rc.1 ([538dee2](https://github.com/equaltoai/greater-components/commit/538dee2a808f14c5e357250fd5b35db4fade5700))
- **premain:** release greater 0.1.2-rc ([5069dbe](https://github.com/equaltoai/greater-components/commit/5069dbed9a35f25f5c31fca7f852683d4687de9a))
- **premain:** release greater 0.1.2-rc ([e3a7494](https://github.com/equaltoai/greater-components/commit/e3a7494435f8a4eb535d074178b473cb8913e40d))
- **premain:** release greater 0.1.2-rc.1 ([1c3f7e4](https://github.com/equaltoai/greater-components/commit/1c3f7e4fb6c22f38939b459805ae4bced01cc6b9))
- **premain:** release greater 0.1.2-rc.1 ([defac6c](https://github.com/equaltoai/greater-components/commit/defac6cd2b2770b578c7cf2a0bb25f340cb8ac49))
- **premain:** release greater 0.1.2-rc.2 ([34d7305](https://github.com/equaltoai/greater-components/commit/34d7305ab8f6b30fc7baab37053c505cbf883961))
- **premain:** release greater 0.1.2-rc.2 ([56fbee1](https://github.com/equaltoai/greater-components/commit/56fbee16b0ab4c6966eb0ce3d516bb3f6ab8ec12))
- **premain:** release greater 0.1.2-rc.3 ([bd7113f](https://github.com/equaltoai/greater-components/commit/bd7113f64f34d859d456c1e0151ee84193bc9792))
- **premain:** release greater 0.1.2-rc.3 ([8b2abda](https://github.com/equaltoai/greater-components/commit/8b2abdaef2e825df1674980238fce40c399bb822))
- **premain:** release greater 0.1.2-rc.4 ([351802b](https://github.com/equaltoai/greater-components/commit/351802bb15064caba6f78018d3ae029f7e646d7f))
- **premain:** release greater 0.1.2-rc.4 ([d0ea8c7](https://github.com/equaltoai/greater-components/commit/d0ea8c78088cfae8123bbc35e6165f3d4938b10c))
- **premain:** release greater 0.1.4-rc.0 ([52a29bf](https://github.com/equaltoai/greater-components/commit/52a29bf233c004ec14dafb1d4727350181902355))
- **premain:** release greater 0.1.4-rc.0 ([14c0232](https://github.com/equaltoai/greater-components/commit/14c0232db6da6b87eb69816ebe433056b05dcfe5))
- **premain:** release greater 0.1.5-rc.0 ([732a24b](https://github.com/equaltoai/greater-components/commit/732a24b2a7e910cf3e0433cd948e4c97c197a42f))
- **premain:** release greater 0.1.5-rc.0 ([71a58b3](https://github.com/equaltoai/greater-components/commit/71a58b30c6e8c182aa3986910ef4019bac40ab5f))
- **premain:** release greater 0.1.6-rc.0 ([c0f824f](https://github.com/equaltoai/greater-components/commit/c0f824fe302b2f0d121a84b73ada5046dd15d2f0))
- **premain:** release greater 0.1.6-rc.0 ([172fe6f](https://github.com/equaltoai/greater-components/commit/172fe6f951466afa402b1a486160951a24c4fa25))
- **premain:** release greater 0.1.7-rc.0 ([28fe63e](https://github.com/equaltoai/greater-components/commit/28fe63e368431d6e202ad2ff2a59c31408233ba4))
- **premain:** release greater 0.1.7-rc.0 ([532c688](https://github.com/equaltoai/greater-components/commit/532c688b7cc54bfa4fb4bce307ddc89bac596663))
- **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
- **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
- **premain:** release greater 0.1.9-rc.0 ([c35b372](https://github.com/equaltoai/greater-components/commit/c35b372afa15e9ffc58c6e74a2cf9c04e8337ae6))
- **premain:** release greater 0.1.9-rc.0 ([07321c3](https://github.com/equaltoai/greater-components/commit/07321c3f4c3dd6d959fc11008107a8bdb4977ba9))
- promote premain to main ([6831a05](https://github.com/equaltoai/greater-components/commit/6831a0546c000f25926deee7fab310cf3935d1aa))
- promote premain to main ([124fa61](https://github.com/equaltoai/greater-components/commit/124fa61d0360490765090d2a9064dc8496c5ce99))
- promote premain to main ([b7918d1](https://github.com/equaltoai/greater-components/commit/b7918d11f9e24b42995a728e1b574cf1b3a8b2f9))
- promote staging to premain ([0a5170e](https://github.com/equaltoai/greater-components/commit/0a5170e4c23e572e37390cec1943dde624e4a630))
- promote staging to premain ([abc0eb6](https://github.com/equaltoai/greater-components/commit/abc0eb64b79466de07d90495fad75c2ca628091e))
- promote staging to premain ([4198cf0](https://github.com/equaltoai/greater-components/commit/4198cf0cd6dc661dcad0fbbc64015289aa9d74a9))
- promote staging to premain ([dbf01fd](https://github.com/equaltoai/greater-components/commit/dbf01fd63599e173ad50b7120418c55d7b0fd8ca))
- promote staging to premain ([4e885a8](https://github.com/equaltoai/greater-components/commit/4e885a8c8929c532e47173fbbad7b35d9f26f665))
- promote staging to premain ([40c561d](https://github.com/equaltoai/greater-components/commit/40c561de0e195e1257bdb0a53694f7ae78ae779a))
- promote staging to premain (RC) ([e910da0](https://github.com/equaltoai/greater-components/commit/e910da0b5a9d72995574a7d9ddbcb694fa2cb8b8))
- Reformat codebase ([792d2fa](https://github.com/equaltoai/greater-components/commit/792d2fa71e90caacff620d3d40e7468a66d9441f))
- regenerate registry ([fe70f15](https://github.com/equaltoai/greater-components/commit/fe70f152ca7dc75f7a41fa04ae9e9ed713b40389))
- regenerate registry ([58abe16](https://github.com/equaltoai/greater-components/commit/58abe161740f37a93ec8d35b4df1d9a5d3fce339))
- regenerate registry ([1760bcc](https://github.com/equaltoai/greater-components/commit/1760bcc3ee8f1009462128dc01b25c1a929ad2cf))
- Regenerate registry index after codegen updates ([fb07b39](https://github.com/equaltoai/greater-components/commit/fb07b39716c68019d02ec64a5b58d596339357e2))
- regenerate registry index after context.ts changes ([bf9ebfb](https://github.com/equaltoai/greater-components/commit/bf9ebfb363e7716eadaf6cc1674c1da86c41e2cb))
- regenerate src type artifacts ([7bf3011](https://github.com/equaltoai/greater-components/commit/7bf3011db543b411156c0fb7d10d7d89b3bf2968))
- **registry:** enforce and format index ([367ba0f](https://github.com/equaltoai/greater-components/commit/367ba0f4a2d5fc5adeb17157c43fd64cb0e40770))
- **registry:** format index.json ([f8eaff5](https://github.com/equaltoai/greater-components/commit/f8eaff5289fa335bd7aa8f09a97fbe4d83dddb21))
- **registry:** regenerate index ([18cff39](https://github.com/equaltoai/greater-components/commit/18cff39803bbbd30f7cd72bdc24bdf0bafc56cd8))
- **registry:** regenerate index ([0cd0f1b](https://github.com/equaltoai/greater-components/commit/0cd0f1b1c44d346593fdf2cc6850167754a31581))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- release 2.2.1 ([bcbb9e7](https://github.com/equaltoai/greater-components/commit/bcbb9e788116f17e8a48bd8214146c3d6682aec3))
- release 2.2.2 ([657d449](https://github.com/equaltoai/greater-components/commit/657d449f28011b961838101f1c9dd8f87d7db870))
- release greater-components v2.0.1 ([5c3bc15](https://github.com/equaltoai/greater-components/commit/5c3bc153055e66a1bbe780668e493ea4d68bf77a))
- release packages ([283a2ec](https://github.com/equaltoai/greater-components/commit/283a2ecc6a186f6b204c02d03a781d3842c433a7))
- release v2.2.0 ([6c10b8f](https://github.com/equaltoai/greater-components/commit/6c10b8fd27689dba22fbee0843319f3d56fb93aa))
- **release:** add one-command release cutter ([e9df01e](https://github.com/equaltoai/greater-components/commit/e9df01e2199f2aaaeb45d340fce244b50f741654))
- **release:** add one-command release cutter ([eca6261](https://github.com/equaltoai/greater-components/commit/eca626146b842c240d059419483839e7b4feaa35))
- **release:** greater-v0.1.0 ([946e3be](https://github.com/equaltoai/greater-components/commit/946e3bee45baa52ec428c6d9b902abeae7aaea01))
- **release:** greater-v0.1.0 ([33c36f2](https://github.com/equaltoai/greater-components/commit/33c36f277c4ee9eb3358ee15cf93c903bfa958e6))
- **release:** greater-v0.1.0 ([0ff8d21](https://github.com/equaltoai/greater-components/commit/0ff8d21cb2c402cd26f9b996142f5f33ec291a32))
- **release:** greater-v0.1.1 ([ebb24dc](https://github.com/equaltoai/greater-components/commit/ebb24dc35afeb811dcd6f265e3b279196ff61067))
- **release:** greater-v0.1.1 ([0e26e63](https://github.com/equaltoai/greater-components/commit/0e26e6354ca6ef56ee3d462144d20812dbafc102))
- **release:** greater-v0.1.1 ([8c15a59](https://github.com/equaltoai/greater-components/commit/8c15a59b092ac3dcfb4c841836e8a4f646ccb854))
- **release:** prepare metadata ([38ce978](https://github.com/equaltoai/greater-components/commit/38ce978189f739a06bc65858e3c363b94901335a))
- **release:** prepare metadata ([dc957c0](https://github.com/equaltoai/greater-components/commit/dc957c0e79dd5d66c7ab2dba77a1b72d3b252701))
- **release:** prepare metadata ([d665069](https://github.com/equaltoai/greater-components/commit/d665069c5bfe443897250023407ffa6c6b12920e))
- **release:** prepare metadata ([85e6bf4](https://github.com/equaltoai/greater-components/commit/85e6bf431ec844ba66967b06f3049cdaab033f26))
- **release:** prepare metadata ([788a1c9](https://github.com/equaltoai/greater-components/commit/788a1c91af968f7c0e40d119d5e2b3e84518ba4c))
- **release:** prepare metadata ([f97aa37](https://github.com/equaltoai/greater-components/commit/f97aa37a5094f75a567871c61a08899b06dd36e1))
- **release:** prepare metadata ([34579db](https://github.com/equaltoai/greater-components/commit/34579db0e31cef88737e5cb0e232786b3d3798b6))
- **release:** prepare metadata ([d8ae17e](https://github.com/equaltoai/greater-components/commit/d8ae17ed46bf0fbfc68896a8b58fc70b167d21f1))
- **release:** prepare metadata ([8754c5b](https://github.com/equaltoai/greater-components/commit/8754c5b0306082c21245de6a3766017d2df6db0c))
- **release:** prepare metadata ([d073017](https://github.com/equaltoai/greater-components/commit/d0730175366cbcc918144519ac5dfb5063c0110b))
- **release:** prepare metadata ([7276ef3](https://github.com/equaltoai/greater-components/commit/7276ef39f4d998fa75d016132638b3fa8ca10e67))
- **release:** prepare metadata ([0b46575](https://github.com/equaltoai/greater-components/commit/0b465754b1063d99b0d1078e775a10bbda883646))
- **release:** prepare metadata ([0c69583](https://github.com/equaltoai/greater-components/commit/0c695831df309a10d522dbad42f58452bc515875))
- **release:** prepare metadata ([d3c0378](https://github.com/equaltoai/greater-components/commit/d3c0378b33f3945e5a12acee43791847775b1c48))
- **release:** prepare metadata ([8f3a64d](https://github.com/equaltoai/greater-components/commit/8f3a64d1226a84c6321947791006567fab84c49a))
- **release:** prepare metadata ([9e92fc9](https://github.com/equaltoai/greater-components/commit/9e92fc97e93b13c8521e517d40a64245b35e7882))
- **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))
- **release:** prepare metadata ([59b93e6](https://github.com/equaltoai/greater-components/commit/59b93e66e7af639ce9f8f2be5d1215910b8f7fe7))
- **release:** prepare metadata ([9f62828](https://github.com/equaltoai/greater-components/commit/9f62828301f7532fc0f7e27cb6dc31e965b3b29d))
- **release:** prepare metadata ([ed08549](https://github.com/equaltoai/greater-components/commit/ed0854991060157932b420fc46e42df24c45bf12))
- **release:** prepare metadata ([d9f731d](https://github.com/equaltoai/greater-components/commit/d9f731daf4f0a52080b55351d0bd8077280b6d74))
- **release:** prepare metadata ([4378aa3](https://github.com/equaltoai/greater-components/commit/4378aa3930cbf68320169f36105e01788356e8e5))
- **release:** prepare metadata ([e5d92bc](https://github.com/equaltoai/greater-components/commit/e5d92bcfe1a854e6238ac4b3f86bf9a2eff50166))
- **release:** prepare metadata ([28926cd](https://github.com/equaltoai/greater-components/commit/28926cd9134efeffb14ae6a5041765f798158c36))
- **release:** prepare metadata ([8c03743](https://github.com/equaltoai/greater-components/commit/8c037435ca9718edb2345e2c45c8c7f2d9b0ff77))
- **release:** prepare metadata ([078e714](https://github.com/equaltoai/greater-components/commit/078e71455c269c0bbec6a9b673d5999451fd492c))
- **release:** prepare metadata ([cf43fe4](https://github.com/equaltoai/greater-components/commit/cf43fe4978e7e091a1d50864c5355f1216fc18a3))
- **release:** prepare metadata ([f4044fe](https://github.com/equaltoai/greater-components/commit/f4044fe8f98fcc633d5333024ec41708d70295b5))
- **release:** prepare metadata ([cbb6681](https://github.com/equaltoai/greater-components/commit/cbb6681304b951def556cfb8ed206266b2907d98))
- **release:** prepare metadata ([c3b72dc](https://github.com/equaltoai/greater-components/commit/c3b72dc2c0a7a1f654dc77c1f48c641b19a49345))
- **release:** prepare metadata ([28d2d29](https://github.com/equaltoai/greater-components/commit/28d2d29e15f7ced4dffc9eab1e625a196b3c71f3))
- **release:** prepare metadata for 0.1.2-rc ([b9fea95](https://github.com/equaltoai/greater-components/commit/b9fea95c4b5741307e919b6410f7222fda3f1be0))
- remove nested pnpm lockfiles ([88832aa](https://github.com/equaltoai/greater-components/commit/88832aaf061c290096333f9c9ac20903e016ab67))
- remove nested pnpm lockfiles ([fb742bd](https://github.com/equaltoai/greater-components/commit/fb742bd93c9320518e2d0461e8d5062c7a8daebd))
- Remove trailing blank lines from local-repo utility and GitHub releases documentation. ([8d14fe8](https://github.com/equaltoai/greater-components/commit/8d14fe85134f1024904c621aa0fb73e13e691cd5))
- Remove trailing blank lines from local-repo utility and GitHub releases documentation. ([5684bec](https://github.com/equaltoai/greater-components/commit/5684bec370c2e8306156713d9f3a6d4aafc63902))
- run prettier ([f927a03](https://github.com/equaltoai/greater-components/commit/f927a03bd013bedd1702f3e142c1e60938f59ae8))
- sync Lesser contracts v1.1.0 ([d41ccc0](https://github.com/equaltoai/greater-components/commit/d41ccc0de4dce9e2b599263e41823d5fa890c39b))
- sync Lesser contracts v1.1.0 ([d76b06b](https://github.com/equaltoai/greater-components/commit/d76b06bd2a4afe55c8d3f86d7b3716c2cf200d31))
- Update package exports to point to compiled Svelte components and add main stylesheet export, and ensure consistent accessibility IDs in ContentRenderer. ([00c4427](https://github.com/equaltoai/greater-components/commit/00c4427c23876cddbe2b6bccde6df35214868489))
- update registry checksums ([df448b6](https://github.com/equaltoai/greater-components/commit/df448b64e38e5e3b99a9c42f938086ff573723cd))
- version packages for 3.0.0 ([2045bd5](https://github.com/equaltoai/greater-components/commit/2045bd5bf338a72c63d922597a810c2a3f6daa16))

## [0.1.15-rc.1](https://github.com/equaltoai/greater-components/compare/greater-v0.1.15-rc.0...greater-v0.1.15-rc.1) (2026-03-06)

### Chores

- backmerge main into premain ([31cc7aa](https://github.com/equaltoai/greater-components/commit/31cc7aab4c70967a93743e47c6b2b12b55b65136))

## [0.1.15-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.14-rc.0...greater-v0.1.15-rc.0) (2026-03-06)

### Features

- **notifications:** support communication payloads ([1b1f5a1](https://github.com/equaltoai/greater-components/commit/1b1f5a1575e3a8c0c437587658d70a706764f7c3))

### Bug Fixes

- **soul:** satisfy strict svelte-check ([0603c37](https://github.com/equaltoai/greater-components/commit/0603c377420e7b28e5467b286876af2c4fc63be0))

### CI

- **deps:** bump artifact actions ([6bcd038](https://github.com/equaltoai/greater-components/commit/6bcd03801a04a4af9e613094907a7a90dfcbadeb))

### Chores

- backmerge premain into staging ([ff92e4c](https://github.com/equaltoai/greater-components/commit/ff92e4cbf8426191120b36b21583493ba340200b))
- backmerge premain into staging ([7f259f7](https://github.com/equaltoai/greater-components/commit/7f259f7aa6852ee3ebb54a4a7629c879a611c258))
- **contracts:** bump lesser to v1.1.24 ([81a9829](https://github.com/equaltoai/greater-components/commit/81a98290895b06e9ace85e12454ab4aa1550d57d))
- **contracts:** bump lesser to v1.1.24 ([9c1f3ab](https://github.com/equaltoai/greater-components/commit/9c1f3ab54c263760d32e47fbbbc41ca0a323d8cd))
- **deps:** bump graphql-codegen ([d2490c5](https://github.com/equaltoai/greater-components/commit/d2490c5890f00641783c1c8637e6cb64237e7da0))
- format and regenerate registry ([148f214](https://github.com/equaltoai/greater-components/commit/148f214da81663a646ebc2615791de1988318dce))
- promote staging to premain ([abc0eb6](https://github.com/equaltoai/greater-components/commit/abc0eb64b79466de07d90495fad75c2ca628091e))
- regenerate registry ([fe70f15](https://github.com/equaltoai/greater-components/commit/fe70f152ca7dc75f7a41fa04ae9e9ed713b40389))

## [0.1.14-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.13-rc.0...greater-v0.1.14-rc.0) (2026-03-06)

### Features

- **adapters:** add lesser-host soul client utilities ([9e80a9b](https://github.com/equaltoai/greater-components/commit/9e80a9bee5150d0fc166ef5d514f567338910b19))
- Add initial system configuration and logging setup under the new .theory directory. ([7320f65](https://github.com/equaltoai/greater-components/commit/7320f65c6d4e011df71d599b624d22cca5d9c151))
- **notifications:** render communication notifications ([4b645f8](https://github.com/equaltoai/greater-components/commit/4b645f8217c21bd4a1ecdb5583917867331e4491))
- **soul:** add channels and preferences UI components ([1bd005b](https://github.com/equaltoai/greater-components/commit/1bd005b88ed663acd7c46437d30c0602aecc5cb3))

### Bug Fixes

- **adapters:** trim baseUrl without regex ([f3cbe99](https://github.com/equaltoai/greater-components/commit/f3cbe9900a7f3fac06f569fdd167236c01f09683))
- **playground:** bind search context ([ac0aa64](https://github.com/equaltoai/greater-components/commit/ac0aa64c912d8bb0f92c87ee3253282a3e755ea9))

### Chores

- **deps:** patch audited vulnerabilities ([c9902e6](https://github.com/equaltoai/greater-components/commit/c9902e6d560a76f27e5a6d67da765b8b264b06f1))
- **deps:** update workspace dependencies ([5e15fbc](https://github.com/equaltoai/greater-components/commit/5e15fbc3223cf96ef26d305506f705132fc1488d))
- fix CI validation ([f8c2958](https://github.com/equaltoai/greater-components/commit/f8c2958546c380839f30f3a1c4faed244a05dd0e))
- **main:** release greater 0.1.13 ([0587386](https://github.com/equaltoai/greater-components/commit/0587386f177206f3c2c639909a2d1444b92856c9))
- **main:** release greater 0.1.13 ([c1ce3a6](https://github.com/equaltoai/greater-components/commit/c1ce3a6e4c30d584ad39d99c317783eae7fe6d59))
- pin lesser v1.1.23 and lesser-host v0.1.0 contracts ([c47e701](https://github.com/equaltoai/greater-components/commit/c47e70193c0ada34aa08f2ece49b2068379b0fcc))
- **playground:** drop [@pai](https://github.com/pai) snippet ([484bfb4](https://github.com/equaltoai/greater-components/commit/484bfb4725485ec21d1336e9a2c5b6042ade83c2))
- regenerate registry ([58abe16](https://github.com/equaltoai/greater-components/commit/58abe161740f37a93ec8d35b4df1d9a5d3fce339))
- **release:** prepare metadata ([f97aa37](https://github.com/equaltoai/greater-components/commit/f97aa37a5094f75a567871c61a08899b06dd36e1))

## [0.1.13](https://github.com/equaltoai/greater-components/compare/greater-v0.1.12...greater-v0.1.13) (2026-02-20)

### Features

- **messaging:** allow background refresh ([fba11d5](https://github.com/equaltoai/greater-components/commit/fba11d5208add59c540dbca992afed1fc1989c06))
- **messaging:** delete-for-me (M4) ([f5c1501](https://github.com/equaltoai/greater-components/commit/f5c15016935c9e2cf9b667384f0242b79ee5cefb))
- **messaging:** inbox/requests dm handlers ([d579ac8](https://github.com/equaltoai/greater-components/commit/d579ac86822e043299f96e5bec81cbb2c7dc7be1))
- **messaging:** realtime updates (M5) ([d28af50](https://github.com/equaltoai/greater-components/commit/d28af5054e43b82ab7309e91505037b294f80f6b))
- **prefs:** expose dm delivery setting ([b7d7fee](https://github.com/equaltoai/greater-components/commit/b7d7feecd4953b441cb17414d0c863e6fd7026a8))

### Bug Fixes

- **admin:** use valid Button variant ([638824f](https://github.com/equaltoai/greater-components/commit/638824ff110a150621058572f7ad09e2d94523f3))
- **ci:** pass lint workflow ([d6a1c96](https://github.com/equaltoai/greater-components/commit/d6a1c96df1dfb813a5d9a2b6803ed7e5a7505c4b))
- **registry:** regenerate index ([43978b6](https://github.com/equaltoai/greater-components/commit/43978b6d293e385c040a96274f19302dbcb1c93d))
- **registry:** regenerate index ([17142da](https://github.com/equaltoai/greater-components/commit/17142da9d2b3f847cb9b856afd7d2fcb46ba246d))

### Chores

- bump svelte to 5.53.0 ([9d6a300](https://github.com/equaltoai/greater-components/commit/9d6a300f6032dd345b581240348eb947667664bf))
- bump svelte to 5.53.0 ([acc3ce0](https://github.com/equaltoai/greater-components/commit/acc3ce071df62d17a6d5ba615369e192bdff53e0))
- **lesser:** pin contracts to 9f072443 ([2ef3e4b](https://github.com/equaltoai/greater-components/commit/2ef3e4bfa65d1f9d5839552ebdaf79eba5e25b0e))
- **premain:** release greater 0.1.13-rc.0 ([0d1572a](https://github.com/equaltoai/greater-components/commit/0d1572a8226ee53f3c9e86284076c0b601c7fc02))
- **premain:** release greater 0.1.13-rc.0 ([69d79a3](https://github.com/equaltoai/greater-components/commit/69d79a32f47d260345192e73e62f163e41a224fa))
- **release:** prepare metadata ([34579db](https://github.com/equaltoai/greater-components/commit/34579db0e31cef88737e5cb0e232786b3d3798b6))

## [0.1.13-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.12-rc.0...greater-v0.1.13-rc.0) (2026-02-20)

### Features

- **messaging:** allow background refresh ([fba11d5](https://github.com/equaltoai/greater-components/commit/fba11d5208add59c540dbca992afed1fc1989c06))
- **messaging:** delete-for-me (M4) ([f5c1501](https://github.com/equaltoai/greater-components/commit/f5c15016935c9e2cf9b667384f0242b79ee5cefb))
- **messaging:** inbox/requests dm handlers ([d579ac8](https://github.com/equaltoai/greater-components/commit/d579ac86822e043299f96e5bec81cbb2c7dc7be1))
- **messaging:** realtime updates (M5) ([d28af50](https://github.com/equaltoai/greater-components/commit/d28af5054e43b82ab7309e91505037b294f80f6b))
- **prefs:** expose dm delivery setting ([b7d7fee](https://github.com/equaltoai/greater-components/commit/b7d7feecd4953b441cb17414d0c863e6fd7026a8))

### Bug Fixes

- **admin:** use valid Button variant ([638824f](https://github.com/equaltoai/greater-components/commit/638824ff110a150621058572f7ad09e2d94523f3))
- **ci:** pass lint workflow ([d6a1c96](https://github.com/equaltoai/greater-components/commit/d6a1c96df1dfb813a5d9a2b6803ed7e5a7505c4b))
- **registry:** regenerate index ([43978b6](https://github.com/equaltoai/greater-components/commit/43978b6d293e385c040a96274f19302dbcb1c93d))
- **registry:** regenerate index ([17142da](https://github.com/equaltoai/greater-components/commit/17142da9d2b3f847cb9b856afd7d2fcb46ba246d))

### Chores

- bump svelte to 5.53.0 ([9d6a300](https://github.com/equaltoai/greater-components/commit/9d6a300f6032dd345b581240348eb947667664bf))
- bump svelte to 5.53.0 ([acc3ce0](https://github.com/equaltoai/greater-components/commit/acc3ce071df62d17a6d5ba615369e192bdff53e0))
- **lesser:** pin contracts to 9f072443 ([2ef3e4b](https://github.com/equaltoai/greater-components/commit/2ef3e4bfa65d1f9d5839552ebdaf79eba5e25b0e))
- **main:** release greater 0.1.12 ([4c0a357](https://github.com/equaltoai/greater-components/commit/4c0a35779d1e5fe72cbe4bb3277d04a0cff9b72a))
- **main:** release greater 0.1.12 ([1b07132](https://github.com/equaltoai/greater-components/commit/1b071322ea489d2e37d00b4187060ad64fa98c02))
- **release:** prepare metadata ([d8ae17e](https://github.com/equaltoai/greater-components/commit/d8ae17ed46bf0fbfc68896a8b58fc70b167d21f1))

## [0.1.12](https://github.com/equaltoai/greater-components/compare/greater-v0.1.11...greater-v0.1.12) (2026-02-16)

### Bug Fixes

- **adapters:** default empty conversations results ([32500ad](https://github.com/equaltoai/greater-components/commit/32500ad2e1e1055ad8418bf02daf8a88e2d1386e)), closes [#210](https://github.com/equaltoai/greater-components/issues/210)
- **adapters:** pin Lesser v1.1.11 + suppress empty conversations error ([f4b21c0](https://github.com/equaltoai/greater-components/commit/f4b21c0049b10af8b5a605e4b7648b9a59579989))

### Tests

- fix wrappers and headless mocks ([14b624b](https://github.com/equaltoai/greater-components/commit/14b624b841691941bde23100a5edc1e8311a6dca))

### Chores

- **deps:** update workspace dependencies ([2391851](https://github.com/equaltoai/greater-components/commit/23918518bb23851a7e06761817c2f19b57fccff0))
- format adapter tests ([28d6a71](https://github.com/equaltoai/greater-components/commit/28d6a71874a4ca808fb017397c705606aa18ee1f))
- **premain:** release greater 0.1.12-rc.0 ([bd75d6d](https://github.com/equaltoai/greater-components/commit/bd75d6d8174b0ce9ad6fe4c19adc17494bee8847))
- **premain:** release greater 0.1.12-rc.0 ([ec71322](https://github.com/equaltoai/greater-components/commit/ec71322c0efeb4194730f4b9d31f81d51b9936ca))
- **release:** prepare metadata ([8754c5b](https://github.com/equaltoai/greater-components/commit/8754c5b0306082c21245de6a3766017d2df6db0c))

## [0.1.12-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.11-rc.0...greater-v0.1.12-rc.0) (2026-02-16)

### Bug Fixes

- **adapters:** default empty conversations results ([32500ad](https://github.com/equaltoai/greater-components/commit/32500ad2e1e1055ad8418bf02daf8a88e2d1386e)), closes [#210](https://github.com/equaltoai/greater-components/issues/210)
- **adapters:** pin Lesser v1.1.11 + suppress empty conversations error ([f4b21c0](https://github.com/equaltoai/greater-components/commit/f4b21c0049b10af8b5a605e4b7648b9a59579989))

### Tests

- fix wrappers and headless mocks ([14b624b](https://github.com/equaltoai/greater-components/commit/14b624b841691941bde23100a5edc1e8311a6dca))

### Chores

- **deps:** update workspace dependencies ([2391851](https://github.com/equaltoai/greater-components/commit/23918518bb23851a7e06761817c2f19b57fccff0))
- format adapter tests ([28d6a71](https://github.com/equaltoai/greater-components/commit/28d6a71874a4ca808fb017397c705606aa18ee1f))
- **main:** release greater 0.1.11 ([9c0ffec](https://github.com/equaltoai/greater-components/commit/9c0ffec99ff5906d9836909d1e303f2fe3df240e))
- **main:** release greater 0.1.11 ([7bac630](https://github.com/equaltoai/greater-components/commit/7bac6304929b7ce1e26cccaaa33057e77308f0f3))
- **release:** prepare metadata ([d073017](https://github.com/equaltoai/greater-components/commit/d0730175366cbcc918144519ac5dfb5063c0110b))

## [0.1.11](https://github.com/equaltoai/greater-components/compare/greater-v0.1.10...greater-v0.1.11) (2026-02-15)

### Features

- **social:** add Unicode fallback to CustomEmojiPicker ([43ff72f](https://github.com/equaltoai/greater-components/commit/43ff72f9d7bd3f8b8e70e40df4712d30ceb22f62))

### Bug Fixes

- **adapters:** handle empty GraphQL query results ([58c7bfe](https://github.com/equaltoai/greater-components/commit/58c7bfece1a56eb97bab549f6c206000525d60bf))
- **playground:** prevent icon gallery crash ([5086560](https://github.com/equaltoai/greater-components/commit/5086560fd147546b7079fd5d0d394978a66a7ffa))

### Chores

- format + regenerate registry ([ad0abd4](https://github.com/equaltoai/greater-components/commit/ad0abd42f5ee47f4ca35290f41de2940eee17acb))
- **lesser:** pin contracts to v1.1.10 ([c0d8fc2](https://github.com/equaltoai/greater-components/commit/c0d8fc20e1e0756832772e478c93520c38b3a228))
- pin Lesser v1.1.10 + fix open issues ([a60c1e2](https://github.com/equaltoai/greater-components/commit/a60c1e204a512f7107ff36e2311d48756bb43afd))
- **premain:** release greater 0.1.11-rc.0 ([c3dd48e](https://github.com/equaltoai/greater-components/commit/c3dd48e96f586e7cae787d6fc5d568382cd20b65))
- **premain:** release greater 0.1.11-rc.0 ([0d94f53](https://github.com/equaltoai/greater-components/commit/0d94f53bf84447a4ddc4239493c3d22b739e8bc9))
- **release:** prepare metadata ([7276ef3](https://github.com/equaltoai/greater-components/commit/7276ef39f4d998fa75d016132638b3fa8ca10e67))

## [0.1.11-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.10-rc.0...greater-v0.1.11-rc.0) (2026-02-15)

### Features

- **social:** add Unicode fallback to CustomEmojiPicker ([43ff72f](https://github.com/equaltoai/greater-components/commit/43ff72f9d7bd3f8b8e70e40df4712d30ceb22f62))

### Bug Fixes

- **adapters:** handle empty GraphQL query results ([58c7bfe](https://github.com/equaltoai/greater-components/commit/58c7bfece1a56eb97bab549f6c206000525d60bf))
- **playground:** prevent icon gallery crash ([5086560](https://github.com/equaltoai/greater-components/commit/5086560fd147546b7079fd5d0d394978a66a7ffa))

### Chores

- format + regenerate registry ([ad0abd4](https://github.com/equaltoai/greater-components/commit/ad0abd42f5ee47f4ca35290f41de2940eee17acb))
- **lesser:** pin contracts to v1.1.10 ([c0d8fc2](https://github.com/equaltoai/greater-components/commit/c0d8fc20e1e0756832772e478c93520c38b3a228))
- **main:** release greater 0.1.10 ([667640a](https://github.com/equaltoai/greater-components/commit/667640a877db74622bede34003a86d9e600bb0dd))
- **main:** release greater 0.1.10 ([6ac2237](https://github.com/equaltoai/greater-components/commit/6ac22374d04c698932972320b3c79ab67ca76402))
- pin Lesser v1.1.10 + fix open issues ([a60c1e2](https://github.com/equaltoai/greater-components/commit/a60c1e204a512f7107ff36e2311d48756bb43afd))
- **release:** prepare metadata ([0b46575](https://github.com/equaltoai/greater-components/commit/0b465754b1063d99b0d1078e775a10bbda883646))

## [0.1.10](https://github.com/equaltoai/greater-components/compare/greater-v0.1.9...greater-v0.1.10) (2026-02-12)

### Features

- **cli:** add doctor --csp and strict CSP docs ([1cfdd12](https://github.com/equaltoai/greater-components/commit/1cfdd12300e4862b414cd563d3116775ef4d3b84))

### Bug Fixes

- **cli:** include admin Agents files in vendored installs ([68c8541](https://github.com/equaltoai/greater-components/commit/68c8541aec282ef3a17add072ee46fc55ba114e3))
- **csp:** make primitives transitions WAAPI-based ([703b1bd](https://github.com/equaltoai/greater-components/commit/703b1bda9aafd3d5b9939c8c6af160725fae502a))
- **csp:** remove inline style writes from utils ([79bb770](https://github.com/equaltoai/greater-components/commit/79bb770ec53125f283e9f2310d4012d174a764df))
- **csp:** remove runtime inline-style writes from primitives ([b4e8a3d](https://github.com/equaltoai/greater-components/commit/b4e8a3dcf541bc3e0862692c864cd254a6aa831f))
- **csp:** remove runtime style injection from artist face ([c62a4d9](https://github.com/equaltoai/greater-components/commit/c62a4d979e74d3d9292bc1b8c89d71f8c4b92dfe))
- **csp:** remove runtime style writes from headless ([9858a2b](https://github.com/equaltoai/greater-components/commit/9858a2bc563480b9f2eb54be7a7d1fd2776c9971))
- **csp:** replace textarea autosize with CSS-driven helper ([c845b6a](https://github.com/equaltoai/greater-components/commit/c845b6a205af850efd3a9e9fca8746742ae56110))
- **csp:** strict CSP issue sweep ([#180](https://github.com/equaltoai/greater-components/issues/180), [#187](https://github.com/equaltoai/greater-components/issues/187)–[#195](https://github.com/equaltoai/greater-components/issues/195)) ([241aeab](https://github.com/equaltoai/greater-components/commit/241aeabfc01754668dad1a2fca5aa54492bcf9e5))
- **social:** remove global BackupCodes theme styles ([8c9405a](https://github.com/equaltoai/greater-components/commit/8c9405adbf6bbf45941df99255b6d3c5264e4964))

### Docs

- add issue sweep plan for open issues ([7e9c169](https://github.com/equaltoai/greater-components/commit/7e9c169b7d4199341cbf20c07955acd0c0d77d71))

### Chores

- **csp:** extend validate:csp for runtime strict CSP ([a8139a5](https://github.com/equaltoai/greater-components/commit/a8139a571164ba9b7e590f79c343585d8afc27de))
- **premain:** release greater 0.1.10-rc.0 ([315a795](https://github.com/equaltoai/greater-components/commit/315a7953d6b3877c768c38d65b6b20782666e0be))
- **premain:** release greater 0.1.10-rc.0 ([c01b453](https://github.com/equaltoai/greater-components/commit/c01b45380a1d832c0978fe505bb1200f491fe22c))
- regenerate registry ([1760bcc](https://github.com/equaltoai/greater-components/commit/1760bcc3ee8f1009462128dc01b25c1a929ad2cf))
- regenerate src type artifacts ([7bf3011](https://github.com/equaltoai/greater-components/commit/7bf3011db543b411156c0fb7d10d7d89b3bf2968))
- **release:** prepare metadata ([0c69583](https://github.com/equaltoai/greater-components/commit/0c695831df309a10d522dbad42f58452bc515875))
- run prettier ([f927a03](https://github.com/equaltoai/greater-components/commit/f927a03bd013bedd1702f3e142c1e60938f59ae8))
- update registry checksums ([df448b6](https://github.com/equaltoai/greater-components/commit/df448b64e38e5e3b99a9c42f938086ff573723cd))

## [0.1.10-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.9-rc.0...greater-v0.1.10-rc.0) (2026-02-12)

### Features

- **cli:** add doctor --csp and strict CSP docs ([1cfdd12](https://github.com/equaltoai/greater-components/commit/1cfdd12300e4862b414cd563d3116775ef4d3b84))

### Bug Fixes

- **cli:** include admin Agents files in vendored installs ([68c8541](https://github.com/equaltoai/greater-components/commit/68c8541aec282ef3a17add072ee46fc55ba114e3))
- **csp:** make primitives transitions WAAPI-based ([703b1bd](https://github.com/equaltoai/greater-components/commit/703b1bda9aafd3d5b9939c8c6af160725fae502a))
- **csp:** remove inline style writes from utils ([79bb770](https://github.com/equaltoai/greater-components/commit/79bb770ec53125f283e9f2310d4012d174a764df))
- **csp:** remove runtime inline-style writes from primitives ([b4e8a3d](https://github.com/equaltoai/greater-components/commit/b4e8a3dcf541bc3e0862692c864cd254a6aa831f))
- **csp:** remove runtime style injection from artist face ([c62a4d9](https://github.com/equaltoai/greater-components/commit/c62a4d979e74d3d9292bc1b8c89d71f8c4b92dfe))
- **csp:** remove runtime style writes from headless ([9858a2b](https://github.com/equaltoai/greater-components/commit/9858a2bc563480b9f2eb54be7a7d1fd2776c9971))
- **csp:** replace textarea autosize with CSS-driven helper ([c845b6a](https://github.com/equaltoai/greater-components/commit/c845b6a205af850efd3a9e9fca8746742ae56110))
- **csp:** strict CSP issue sweep ([#180](https://github.com/equaltoai/greater-components/issues/180), [#187](https://github.com/equaltoai/greater-components/issues/187)–[#195](https://github.com/equaltoai/greater-components/issues/195)) ([241aeab](https://github.com/equaltoai/greater-components/commit/241aeabfc01754668dad1a2fca5aa54492bcf9e5))
- **social:** remove global BackupCodes theme styles ([8c9405a](https://github.com/equaltoai/greater-components/commit/8c9405adbf6bbf45941df99255b6d3c5264e4964))

### Docs

- add issue sweep plan for open issues ([7e9c169](https://github.com/equaltoai/greater-components/commit/7e9c169b7d4199341cbf20c07955acd0c0d77d71))

### Chores

- **csp:** extend validate:csp for runtime strict CSP ([a8139a5](https://github.com/equaltoai/greater-components/commit/a8139a571164ba9b7e590f79c343585d8afc27de))
- **main:** release greater 0.1.9 ([c697281](https://github.com/equaltoai/greater-components/commit/c6972811cb190941800ca06992d8eba1ba76466c))
- **main:** release greater 0.1.9 ([b295a9f](https://github.com/equaltoai/greater-components/commit/b295a9f802c7b88debf3d8de84cffedcbb16ec43))
- regenerate registry ([1760bcc](https://github.com/equaltoai/greater-components/commit/1760bcc3ee8f1009462128dc01b25c1a929ad2cf))
- regenerate src type artifacts ([7bf3011](https://github.com/equaltoai/greater-components/commit/7bf3011db543b411156c0fb7d10d7d89b3bf2968))
- **release:** prepare metadata ([d3c0378](https://github.com/equaltoai/greater-components/commit/d3c0378b33f3945e5a12acee43791847775b1c48))
- run prettier ([f927a03](https://github.com/equaltoai/greater-components/commit/f927a03bd013bedd1702f3e142c1e60938f59ae8))
- update registry checksums ([df448b6](https://github.com/equaltoai/greater-components/commit/df448b64e38e5e3b99a9c42f938086ff573723cd))

## [0.1.9](https://github.com/equaltoai/greater-components/compare/greater-v0.1.7...greater-v0.1.9) (2026-02-12)

### Features

- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))

### Bug Fixes

- **notifications:** add utils dependency ([3400e55](https://github.com/equaltoai/greater-components/commit/3400e553cde5bae810037bdcca9600f68c58af83))
- **security:** harden HTML rendering and path handling ([d6f3bc9](https://github.com/equaltoai/greater-components/commit/d6f3bc94f52e9ffa778ce2a349110abc198723fa))
- **security:** harden HTML rendering and path handling ([f871ece](https://github.com/equaltoai/greater-components/commit/f871ece4e14464ee60d0ff1aa0315fa8c7ae826e))

### Docs

- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))

### Chores

- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** release greater 0.1.8 ([1789f15](https://github.com/equaltoai/greater-components/commit/1789f15695b105e80aec7fadc2513893fdfcdcd6))
- **main:** release greater 0.1.8 ([e24b167](https://github.com/equaltoai/greater-components/commit/e24b167cf469079936cd1808a197184a78288029))
- **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
- **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
- **premain:** release greater 0.1.9-rc.0 ([c35b372](https://github.com/equaltoai/greater-components/commit/c35b372afa15e9ffc58c6e74a2cf9c04e8337ae6))
- **premain:** release greater 0.1.9-rc.0 ([07321c3](https://github.com/equaltoai/greater-components/commit/07321c3f4c3dd6d959fc11008107a8bdb4977ba9))
- **registry:** regenerate index ([18cff39](https://github.com/equaltoai/greater-components/commit/18cff39803bbbd30f7cd72bdc24bdf0bafc56cd8))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- **release:** prepare metadata ([8f3a64d](https://github.com/equaltoai/greater-components/commit/8f3a64d1226a84c6321947791006567fab84c49a))
- **release:** prepare metadata ([9e92fc9](https://github.com/equaltoai/greater-components/commit/9e92fc97e93b13c8521e517d40a64245b35e7882))
- **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))

## [0.1.9-rc.0](https://github.com/equaltoai/greater-components/compare/greater-v0.1.7-rc.0...greater-v0.1.9-rc.0) (2026-02-11)

### Features

- **agents:** add GraphQL adapters and UI primitives ([bce6159](https://github.com/equaltoai/greater-components/commit/bce6159864a4cdf94e5d771662aee7e4c01a6335))
- **agents:** pin Lesser v1.1.3 + add agent GraphQL support ([0de5c02](https://github.com/equaltoai/greater-components/commit/0de5c028cb4ffc97788f596451f360110b0a8537))

### Bug Fixes

- **notifications:** add utils dependency ([3400e55](https://github.com/equaltoai/greater-components/commit/3400e553cde5bae810037bdcca9600f68c58af83))
- **security:** harden HTML rendering and path handling ([d6f3bc9](https://github.com/equaltoai/greater-components/commit/d6f3bc94f52e9ffa778ce2a349110abc198723fa))
- **security:** harden HTML rendering and path handling ([f871ece](https://github.com/equaltoai/greater-components/commit/f871ece4e14464ee60d0ff1aa0315fa8c7ae826e))

### Docs

- clarify Lesser sync and release flow ([ea06384](https://github.com/equaltoai/greater-components/commit/ea0638498cd4514d98ac4d75da59080d0626a30a))

### Chores

- **ci:** cancel redundant workflow runs ([32f251c](https://github.com/equaltoai/greater-components/commit/32f251c6ef6c28a6cd2f78c7d81c7fabbfe3db31))
- **format:** run prettier ([14a81e1](https://github.com/equaltoai/greater-components/commit/14a81e15b4921dce3f3496eb8c494c9284bb7335))
- **lesser:** pin contracts to v1.1.3 ([cd0d981](https://github.com/equaltoai/greater-components/commit/cd0d981b3e1c6c444dbdff0f1351f6941e50c68f))
- **main:** release greater 0.1.7 ([c1970f1](https://github.com/equaltoai/greater-components/commit/c1970f1f7d51d69b1d924be718765c52b2c75d75))
- **main:** release greater 0.1.7 ([8182b0e](https://github.com/equaltoai/greater-components/commit/8182b0e056d49bf6b69fb8a50541cc36e5ea9539))
- **premain:** release greater 0.1.8-rc.0 ([0d24dd7](https://github.com/equaltoai/greater-components/commit/0d24dd75a2a79972384fde1492604763c15c17c0))
- **premain:** release greater 0.1.8-rc.0 ([b8602f3](https://github.com/equaltoai/greater-components/commit/b8602f3be0aa9e1f685f1e714bbb1df76ed24c29))
- **registry:** regenerate index ([18cff39](https://github.com/equaltoai/greater-components/commit/18cff39803bbbd30f7cd72bdc24bdf0bafc56cd8))
- **registry:** update checksums ([f03a4e9](https://github.com/equaltoai/greater-components/commit/f03a4e99941602fb8545cb5aa3f23dbfc0700042))
- **release:** prepare metadata ([a489bac](https://github.com/equaltoai/greater-components/commit/a489baccac3e0f9746fb9476ec71e7b56ca77123))
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
