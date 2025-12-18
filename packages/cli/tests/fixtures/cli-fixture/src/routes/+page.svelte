<script lang="ts">
	import StatusRoot from '$lib/components/Status/Root.svelte';
	import { createButton } from '$lib/greater/headless/button';

	const button = createButton();
	const status = {} as Record<string, unknown>;
</script>

<h1>Greater CLI Smoke</h1>

<button use:button.actions.button>Click</button>

<StatusRoot {status} />
