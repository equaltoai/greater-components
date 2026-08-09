# Patch — make CLI face CSS installs truly CSS-only

`greater add --css-only faces/<name>` now writes only Registry-provided stylesheet files. It no
longer injects imports into existing consumer source, rewrites `components.json`, or installs package
dependencies.
