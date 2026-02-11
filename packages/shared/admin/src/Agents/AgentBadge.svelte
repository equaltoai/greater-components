<script lang="ts">
	import { Badge } from '@equaltoai/greater-components-primitives';

	interface Props {
		agentType?: string | null;
		verified?: boolean;
		label?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		agentType = null,
		verified = false,
		label,
		size = 'sm',
		class: className = '',
	}: Props = $props();

	const badgeLabel = $derived(label ?? (agentType ? `${agentType} Agent` : 'Agent'));
	const status = $derived(verified ? 'Verified' : 'Unverified');
	const color = $derived(verified ? 'success' : 'warning');
</script>

<Badge
	variant="pill"
	{color}
	{size}
	label={badgeLabel}
	description={status}
	class={['admin-agent-badge', className].filter(Boolean).join(' ')}
/>

