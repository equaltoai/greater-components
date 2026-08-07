# Patch — keep `greater update --all` within the default Node heap

The CLI now compares update bytes directly and constructs a detailed line diff only when a consumer
explicitly asks to inspect a conflict. Large vendored updates no longer allocate a quadratic diff
matrix for every existing file or retain those diffs through the whole batch.

CLI help and documentation also state that `--yes` is required for unattended and CI updates.
