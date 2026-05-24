---
'@equaltoai/greater-components-cli': patch
'@equaltoai/greater-components': patch
---

Fix CSR-054: add missing headless primitives (alert, avatar, skeleton, spinner, textfield) to CLI registry and HEADLESS_PRIMITIVE_SUBPATHS, ensuring complete import rewriting coverage for all 10 headless package primitives in both hybrid and vendored modes. Add targeted regression tests.
