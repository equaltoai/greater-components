---
'@equaltoai/greater-components-primitives': minor
'@equaltoai/greater-components-notifications': patch
'@equaltoai/greater-components': patch
---

Add strict CSP compatibility across shipped components by eliminating inline `style="..."` output paths and providing CSP-safe preset/class alternatives (Skeleton/Avatar/Text/Container/ThemeProvider/Section/ThemeSwitcher/Tooltip). Adds a CI-enforced CSP audit (`pnpm validate:csp`) and documentation/migration guidance.
