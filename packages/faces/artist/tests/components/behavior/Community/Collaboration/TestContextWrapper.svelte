<script lang="ts">
	import { createCollaborationContext } from '../../../../../src/components/Community/Collaboration/context.js';
	import type {
		CollaborationData,
		CollaborationRole,
		CollaborationConfig,
	} from '../../../../../src/types/community.js';

	interface Props {
		collaboration: CollaborationData;
		role?: CollaborationRole;
		config?: CollaborationConfig;
		children?: import('svelte').Snippet;
	}

	let { collaboration, role = 'viewer', config = {}, children }: Props = $props();

	createCollaborationContext(
		() => collaboration,
		() => role,
		() => config
	);
</script>

{@render children?.()}
