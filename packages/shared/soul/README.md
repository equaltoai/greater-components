# @equaltoai/greater-components-soul

UI components for `lesser-soul v3` reachability features:

- Channels display (ENS, email, phone)
- Contact preferences viewer/editor
- “Best way to contact” helper UI driven by preferences
- Anchor assurance display for hosted/offchain vs immutable/onchain soul metadata

These components are designed to be used by `simulacrum` without forking vendored code.

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
