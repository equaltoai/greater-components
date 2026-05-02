---
'@equaltoai/greater-components-adapters': patch
'@equaltoai/greater-components-social': patch
'@equaltoai/greater-components-messaging': patch
'@equaltoai/greater-components-search': patch
'@equaltoai/greater-components': patch
---

Harden Greater-managed surfaces reported by sim after `greater-v0.8.10`: allow-list rendered hrefs, keep direct-message content warnings intact, normalize GraphQL adapter errors to user-safe messages while preserving debug detail, suppress unavailable/self follow actions, mark Unicode emoji fallback selections for raw Unicode handling, and align the FaceTheory example/test pin to the current built `v2.0.0` platform artifact so the release lane validates cleanly.
