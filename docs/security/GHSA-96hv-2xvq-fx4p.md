# GHSA-96hv-2xvq-fx4p (`ws`)

[GHSA-96hv-2xvq-fx4p](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) is a
high-severity memory-exhaustion denial of service in `ws`. The affected 8.x range is
`>=8.0.0 <8.21.0`; `8.21.0` is patched.

## Greater-components state

Greater-components has a root `pnpm.overrides` rule that floors `ws@^8.0.0` to `^8.21.0`.
The workspace lockfile resolves `ws` to `8.21.1`, and `pnpm why -r ws` reports no resolution
below `8.21.0`.

The consumer path is `@apollo/client` to its optional `graphql-ws` peer, whose optional `ws`
peer accepts `^8`. The consumer's package manager resolves that path, not greater-components'
lockfile. Greater-components' root override only controls this repository; it does not propagate
to consumers.

## Consumer guidance

Fresh installs resolve `graphql-ws`'s `ws: ^8` peer to a patched release. Consumers whose stale
lockfiles pin `ws` below `8.21.0` must update the lockfile entry or add their own package-manager
override.

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

For npm, add this to `package.json` and reinstall:

```json
{
	"overrides": {
		"ws": "^8.21.0"
	}
}
```

This guidance addresses [issue #922](https://github.com/equaltoai/greater-components/issues/922)
and rides with the v0.13.0 release notes.
