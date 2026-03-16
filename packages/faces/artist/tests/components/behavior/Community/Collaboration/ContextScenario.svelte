<script lang="ts">
	import TestContextWrapper from './TestContextWrapper.svelte';
	import TestContextConsumer from './TestContextConsumer.svelte';
	import type {
		CollaborationData,
		CollaborationConfig,
	} from '../../../../../src/types/community.js';
	import type {
		CollaborationContext,
		CollaborationRole,
	} from '../../../../../src/components/Community/Collaboration/context.js';

	interface Props {
		collaboration: CollaborationData;
		role?: CollaborationRole;
		config?: CollaborationConfig;
		onContext: (ctx: CollaborationContext) => void;
	}

	let { collaboration, role = 'viewer', config = {}, onContext }: Props = $props();
</script>

<TestContextWrapper {collaboration} {role} {config}>
	{#snippet children()}
		<TestContextConsumer {onContext} />
	{/snippet}
</TestContextWrapper>
