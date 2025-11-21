<!--
  Auth.InstanceSelector - Fediverse OAuth entry point

  Collects an instance URL/host and triggers the OAuth start handler.

  @component
  @example
  ```svelte
  <Auth.Root {handlers}>
    <Auth.InstanceSelector />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import { getAuthContext, isValidInstanceUrl } from './context.js';

	interface Props {
		/**
		 * Default instance value (e.g., dev.lesser.host)
		 */
		defaultInstance?: string;
		/**
		 * Button label
		 */
		submitLabel?: string;
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { defaultInstance = '', submitLabel = 'Continue', class: className = '' }: Props = $props();

	const { handlers, state: authState, updateState, clearError } = getAuthContext();

	let instanceInput = $state(defaultInstance);
	let instanceError = $state<string | null>(null);

	function normalizeInstance(value: string): string {
		const trimmed = value.trim();
		if (!trimmed) return '';
		return trimmed.startsWith('http://') || trimmed.startsWith('https://')
			? trimmed
			: `https://${trimmed}`;
	}

	async function handleSubmit() {
		if (authState.loading) return;
		instanceError = null;
		clearError();

		if (!isValidInstanceUrl(instanceInput)) {
			instanceError = 'Enter a valid instance URL (e.g., dev.lesser.host)';
			return;
		}

		const normalized = normalizeInstance(instanceInput);

		updateState({ loading: true });
		try {
			await handlers.onOAuthStart?.(normalized);
		} catch (error) {
			instanceError =
				error instanceof Error ? error.message : 'Unable to start OAuth flow for this instance';
		} finally {
			updateState({ loading: false });
		}
	}
</script>

<div class={`auth-instance ${className}`}>
	<label class="auth-instance__label" for="instance">Instance</label>
	<input
		id="instance"
		name="instance"
		type="text"
		class="auth-instance__input"
		placeholder="https://dev.lesser.host"
		bind:value={instanceInput}
		autocomplete="url"
		inputmode="url"
		aria-invalid={instanceError ? 'true' : 'false'}
	/>

	{#if instanceError}
		<p class="auth-instance__error" role="alert">{instanceError}</p>
	{/if}

	<button
		class="auth-instance__submit"
		disabled={authState.loading}
		aria-busy={authState.loading}
		onclick={handleSubmit}
	>
		{authState.loading ? 'Connecting…' : submitLabel}
	</button>
</div>
