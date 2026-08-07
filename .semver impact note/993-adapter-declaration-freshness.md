# Patch — gate tracked adapter declaration freshness

CI now re-emits the adapter package's committed `.d.ts` and `.d.ts.map` artifacts from its public entrypoint with the canonical TypeScript 6 command, formats them with the repository configuration, and fails when the tracked declarations differ or contain stale-only files. A companion generation command updates the tracked artifacts from the same isolated emit.

Runtime behavior, component APIs, the theming contract, and pinned contract bytes are unchanged.
