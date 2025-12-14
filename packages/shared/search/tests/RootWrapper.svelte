<script lang="ts">
	import Root from '../src/Root.svelte';

	interface Props {
		handlers?: Record<string, unknown>;
		initialQuery?: string;
		className?: string;
	}

	let { handlers, initialQuery, className }: Props = $props();
</script>

<Root {handlers} {initialQuery} class={className}>
	<div data-testid="child-content">Child Content</div>
	<div data-testid="context-check" id="context-check"></div>
</Root>
