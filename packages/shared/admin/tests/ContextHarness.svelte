<script lang="ts">
	import { untrack } from 'svelte';
	import {
		createAdminContext,
		type AdminHandlers,
		type AdminContext,
	} from '../src/context.svelte.js';

	let {
		handlers = {},
		onContext,
	}: {
		handlers?: AdminHandlers;
		onContext: (ctx: AdminContext) => void;
	} = $props();

	const context = createAdminContext(untrack(() => handlers));
	untrack(() => onContext)(context);
</script>
