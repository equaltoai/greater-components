<script lang="ts">
	import { createAdminContext, type AdminHandlers, type AdminContext } from '../src/context.svelte.js';

	let {
		handlers = {},
		onContext,
	}: {
		handlers?: AdminHandlers;
		onContext: (ctx: AdminContext) => void;
	} = $props();

	const context = createAdminContext(handlers);
	onContext(context);
</script>
