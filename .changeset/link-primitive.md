---
'@equaltoai/greater-components-primitives': minor
---

Add `Link` primitive for in-app navigation that preserves browser link
affordances (right-click "Open in new tab", middle-click, Cmd/Ctrl-click,
copy link address) while integrating with SPA routers via a modifier-key-gated
`onnavigate` callback.

Variants:

- `default` — primary nav-link affordance (outline-Button visual weight,
  no literal border)
- `ghost` — subdued nav link with no background, for in-card or in-table use
- `subtle` — muted secondary link, for breadcrumbs / footer / low-emphasis nav
- `inline` — underlined link inside body text; inherits font from surroundings

Renders a real `<a href>` (implicit `role="link"`) fixing the WCAG 4.1.2
(Name, Role, Value) gap that `Button + onclick` creates today. `onnavigate`
fires only on unmodified left-click — middle-click, right-click, and
Cmd/Ctrl/Shift/Alt-click all fall through to native browser behavior so SPA
routers do not intercept "open in new tab" intents. Keyboard Enter activation
uses the same gating predicate; **Space key is deliberately not intercepted**
because Space on `<a>` is not natively activating and scrolls the page —
intercepting would be an a11y anti-pattern.

Automatically injects `rel="noopener noreferrer"` when `target="_blank"`
and no `rel` is set, mirroring the `Card.svelte` precedent. Consumer-supplied
`rel` overrides the auto-injection.

Forwards standard `<a>` attributes (`target`, `rel`, `download`, `aria-label`,
`aria-current`, `id`, `data-*`) via rest-props. Consumers wire `aria-current="page"`
from their router for active-route state; the component applies a
`[aria-current="page"]` CSS hook for distinct visual treatment.

Reuses existing `--gr-semantic-action-link-{default,hover,active}` design
tokens with theme-aware overrides (light / dark / high-contrast). No new
tokens added.

No `disabled` prop — disabled navigation is an a11y anti-pattern; consumers
should remove the link or use a different affordance when navigation is
unavailable.

Closes #700.
