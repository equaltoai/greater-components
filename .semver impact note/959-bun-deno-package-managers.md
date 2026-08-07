# Patch — honor Bun and Deno package managers

The CLI now detects Bun and Deno lockfiles and `packageManager` declarations, and uses their native dependency-add commands instead of silently falling back to npm.

Component APIs, the theming contract, and Registry integrity are unchanged.
