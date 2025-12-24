<script lang="ts">
	import * as Auth from '../../src/index.js';

	let { handlers = {}, defaultInstance = '', submitLabel = 'Continue' } = $props();
</script>

<Auth.Root {handlers}>
	<Auth.InstanceSelector {defaultInstance} {submitLabel} />
</Auth.Root>
