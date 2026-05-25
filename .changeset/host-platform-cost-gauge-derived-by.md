---
'@equaltoai/greater-components-host-platform': patch
---

Fix `CostGauge` Svelte 5 reactivity declarations. Author used `$derived<T>(() => ...)` (expression-form rune passed an arrow function) where they meant `$derived.by<T>(() => ...)` (lazy form). Result: `resolvedStatus` and `rootClass` were typed as `() => T` instead of `T`, and three call sites compensated with phantom `()` invocations. `svelte-check` strict mode rejected. Fixed by switching declarations to `$derived.by` and removing the phantom call-site invocations. Runtime behavior is unchanged — the compiler emits equivalent getter access in both forms.
