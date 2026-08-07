# Patch — make CLI batch updates complete and memory-bounded

`greater update --all` now reuses one registry index per immutable ref and hydrates every installed entry from the generated Registry file list. Files added to a Registry entry are created even when the CLI's static metadata predates them. Vendored face installs no longer add the optional `content` package unless a selected component actually declares it.

Component APIs, the theming contract, and Mastodon-compatible behavior are unchanged.
