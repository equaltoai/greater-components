# GHSA-96hv-2xvq-fx4p (`ws`)

[GHSA-96hv-2xvq-fx4p](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) is a
high-severity memory-exhaustion denial of service in `ws`. The advisory identifies the
following patched release in each affected major line:

| Release line | Patched release |
| ------------ | --------------- |
| 5.x          | 5.2.5           |
| 6.x          | 6.2.4           |
| 7.x          | 7.5.11          |
| 8.x          | 8.21.0          |

## Greater-components state

Greater-components reaches `ws` through two production dependency paths:

1. `graphql-ws` declares `ws: ^8` as an optional peer dependency. Fresh consumer resolutions can
   therefore select a patched 8.x release naturally. A stale consumer lockfile can retain an older,
   vulnerable 8.x resolution.
2. `viem@2.51.3` declared `ws: 8.20.1` as an exact production dependency. Fresh consumer installs
   were therefore vulnerable by default on this path. The next adapters release fixes the source
   dependency by changing `viem` from `2.51.3` to `^2.55.10`; `viem@2.55.10` pins patched
   `ws@8.21.0`.

The greater-components workspace lockfile resolves every `ws` path to at least `8.21.0`. That
lockfile and the root `pnpm.overrides` rule only control this repository and do not propagate to
consumers.

## Consumer guidance

Consumers on the adapters release containing this fix get `ws >=8.21.0` by default. Consumers
pinned to an older greater-components release should update when possible. Until then, refresh the
lockfile and use an override for both affected dependency paths.

The pnpm and npm forms do not have the same blast radius. `graphql-ws` declares `ws` as an optional
peer, not a child dependency, so pnpm's parent-scoped `graphql-ws>ws` selector is a no-op for that
peer. If another `ws` version already exists in the tree, `graphql-ws` can continue using it instead
of the patched range. The pnpm override must therefore target every 8.x `ws` resolution in the
consumer tree. This is intentionally broader than npm's parent-scoped form.

For pnpm, add this to `package.json` and reinstall:

```json
{
	"pnpm": {
		"overrides": {
			"ws@^8.0.0": "^8.21.0"
		}
	}
}
```

For npm, the nested override applies to the `graphql-ws` optional peer as well as viem's child
dependency. Add this to `package.json` and reinstall:

```json
{
	"overrides": {
		"graphql-ws": {
			"ws": "^8.21.0"
		},
		"viem": {
			"ws": "^8.21.0"
		}
	}
}
```

This guidance addresses [issue #922](https://github.com/equaltoai/greater-components/issues/922).
