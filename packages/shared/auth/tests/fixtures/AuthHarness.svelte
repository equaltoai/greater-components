<script lang="ts">
	import * as Auth from '../../src/index.js';

	const handlers = {
		onLogin: async () => {},
		onWebAuthnLogin: async () => {},
	};
</script>

<Auth.Root {handlers}>
	<Auth.LoginForm />
</Auth.Root>
