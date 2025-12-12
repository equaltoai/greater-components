<script lang="ts">
	import * as Auth from '../../src/index.js';
	import type { AuthHandlers } from '../../src/types.js';

	let { handlers = {}, defaultInstance = '', submitLabel = 'Continue' } = $props();
</script>

<Auth.Root {handlers}>
	<Auth.InstanceSelector {defaultInstance} {submitLabel} />
</Auth.Root>
