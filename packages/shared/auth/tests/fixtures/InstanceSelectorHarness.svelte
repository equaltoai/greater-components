<script lang="ts">
	import * as Auth from '../../src/index.js';

	const handlers = {
		onOAuthStart: async () => {},
	} satisfies Auth.AuthHandlers;
</script>

<Auth.Root {handlers}>
	<Auth.InstanceSelector defaultInstance="https://dev.lesser.host" submitLabel="Continue" />
</Auth.Root>
