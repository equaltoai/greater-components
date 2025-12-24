<script lang="ts">
	import { default as IdProvider } from '../src/id-provider.svelte';
	import TestStableId from './TestStableId.svelte';
</script>

<IdProvider>
	<TestStableId prefix="test" />
	<TestStableId prefix="test" />
</IdProvider>
