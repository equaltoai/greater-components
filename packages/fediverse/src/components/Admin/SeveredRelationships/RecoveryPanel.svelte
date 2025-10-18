<!--
Admin.SeveredRelationships.RecoveryPanel - Reconnection Controls
-->

<script lang="ts">
	import { getSeveredRelationshipsContext } from './context.js';

	interface Props {
		severanceId: string;
		class?: string;
	}

	let { severanceId, class: className = '' }: Props = $props();

	const context = getSeveredRelationshipsContext();
	let processing = $state(false);

	async function acknowledge() {
		processing = true;
		try {
			await context.config.adapter.acknowledgeSeverance(severanceId);
		} finally {
			processing = false;
		}
	}

	async function attemptReconnect() {
		processing = true;
		try {
			await context.config.adapter.attemptReconnection(severanceId);
		} finally {
			processing = false;
		}
	}
</script>

<div class={`recovery-panel ${className}`}>
	<button onclick={acknowledge} disabled={processing}>Acknowledge</button>
	<button onclick={attemptReconnect} disabled={processing}>Attempt Reconnection</button>
</div>
