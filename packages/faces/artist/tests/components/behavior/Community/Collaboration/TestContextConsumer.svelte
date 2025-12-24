<script lang="ts">
	import {
		getCollaborationContext,
		type CollaborationContext,
	} from '../../../../../src/components/Community/Collaboration/context.js';

	interface Props {
		onContext: (ctx: CollaborationContext) => void;
	}

	let { onContext }: Props = $props();

	const ctx = getCollaborationContext();
	// svelte-ignore state_referenced_locally
	onContext(ctx);
</script>
