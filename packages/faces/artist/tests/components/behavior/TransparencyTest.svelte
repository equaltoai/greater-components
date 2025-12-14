<script lang="ts">
	import AIOptOutControls from '../../../src/components/Transparency/AIOptOutControls.svelte';
	import AIDisclosure from '../../../src/components/Transparency/AIDisclosure.svelte';

	interface Props {
		component: 'AIOptOutControls' | 'AIDisclosure';
		props: any;
		handlers?: any;
	}

	let { component, props, handlers = {} }: Props = $props();
</script>

{#if component === 'AIOptOutControls'}
	<AIOptOutControls {...props} onUpdate={handlers.onUpdate} />
{:else if component === 'AIDisclosure'}
	<AIDisclosure {...props} />
{/if}
