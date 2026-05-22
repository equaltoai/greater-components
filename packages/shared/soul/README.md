# @equaltoai/greater-components-soul

UI components for `lesser-soul v3` reachability features:

- Channels display (ENS, email, phone)
- Contact preferences viewer/editor
- “Best way to contact” helper UI driven by preferences
- Anchor assurance display for hosted/offchain vs immutable/onchain soul metadata

These components are designed to be used by `simulacrum` without forking vendored code.

## Managed soul email channels

Lesser Host-managed `@lessersoul.ai` email values are rendered as opaque strings. Current
public channels use the Project 37 instance-scoped form
`<agent-local-id>.<instance-slug>@lessersoul.ai`; components do not split the dotted
local-part or infer agent/instance identity from it. The v0.4.3 contract text describes
legacy bare inbound aliases, but the channel payload does not expose authoritative alias
state metadata. Components therefore fail closed and do not infer or render a legacy label
from address shape.

## Anchor assurance

`AnchorAssuranceBadge` renders Lesser Host `anchor_assurance` as trust/display metadata only:

```svelte
<script lang="ts">
	import { AnchorAssuranceBadge } from '@equaltoai/greater-components/shared/soul';
</script>

<AnchorAssuranceBadge {assurance} showDetails />
```

The component distinguishes `hosted_offchain`/`host_record` from
`immutable_onchain`/`onchain_receipt`, but it never grants permissions based on
assurance state. Use explicit Host policy for capability authorization.
