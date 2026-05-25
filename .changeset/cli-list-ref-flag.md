---
'@equaltoai/greater-components-cli': minor
---

Add `--ref <tag>` to `greater list`. When supplied, the local in-memory registry is bypassed and the named ref's `registry/index.json` is fetched from GitHub. Useful for previewing what an arbitrary published tag offers before adopting it via `greater add --ref <tag>`. Both human-readable and `--json` output supported. Reused the same `resolveRef` → `resolveRefForFetch` immutable-SHA pinning chain that `greater add --ref` already uses (so the `--ref` semantics are uniform across both commands). Reported as host FYI #2 during Project 41 PR-A review (#680).
