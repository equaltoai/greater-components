<script lang="ts">
	import Modal from '../../src/components/Modal.svelte';
	import Button from '../../src/components/Button.svelte';
	import type ModalComponent from '../../src/components/Modal.svelte';
	import type { ComponentProps } from 'svelte';
	import { untrack } from 'svelte';

	const { props = {} as ComponentProps<typeof ModalComponent> } = $props<{
		props?: ComponentProps<typeof ModalComponent>;
	}>();

	let open = $state(untrack(() => props.open ?? false));
</script>

<Modal bind:open {...props}>
	{#snippet children()}
		<p data-testid="modal-content">Demo body</p>
	{/snippet}

	{#snippet footer()}
		<Button data-testid="modal-close" onclick={() => (open = false)}>Close</Button>
	{/snippet}
</Modal>
