<!--
Monetization.InstitutionalTools - Lightweight institutional account tooling

REQ-ECON-006: Institutional tools (galleries, schools, collectives)
-->

<script lang="ts">
	import { untrack } from 'svelte';
	import type {
		InstitutionalAccount,
		InstitutionalToolsConfig,
		InstitutionalToolsHandlers,
	} from '../../types/monetization.js';

	interface Props {
		account: InstitutionalAccount;
		config?: InstitutionalToolsConfig;
		handlers?: InstitutionalToolsHandlers;
		class?: string;
	}

	let { account, config = {}, handlers = {}, class: className = '' }: Props = $props();

	const enableArtistManagement = $derived(config.enableArtistManagement ?? true);
	const enableExhibitionManagement = $derived(config.enableExhibitionManagement ?? true);
	const enableAnalytics = $derived(config.enableAnalytics ?? true);

	let artistId = $state('');
	let artistRole = $state('represented');

	let draftName = $state(untrack(() => account.name));
	let draftWebsite = $state(untrack(() => account.website ?? ''));
	let draftDescription = $state(untrack(() => account.description ?? ''));

	$effect(() => {
		draftName = account.name;
		draftWebsite = account.website ?? '';
		draftDescription = account.description ?? '';
	});

	async function addArtist() {
		if (!handlers.onAddArtist || !artistId.trim()) return;
		await handlers.onAddArtist(artistId.trim(), artistRole);
		artistId = '';
	}

	async function createExhibition() {
		if (!handlers.onCreateExhibition) return;
		await handlers.onCreateExhibition({ title: 'New Exhibition' });
	}

	async function updateAccount() {
		if (!handlers.onUpdateAccount) return;
		await handlers.onUpdateAccount({
			name: draftName.trim() || account.name,
			website: draftWebsite.trim() || undefined,
			description: draftDescription.trim() || undefined,
		});
	}

	const containerClass = $derived(['gr-monetization-institutional', className].filter(Boolean).join(' '));
</script>

<section class={containerClass} aria-label="Institutional tools">
	<header class="gr-monetization-institutional__header">
		<div class="gr-monetization-institutional__identity">
			<h3 class="gr-monetization-institutional__name">{account.name}</h3>
			<p class="gr-monetization-institutional__meta">
				<span class="gr-monetization-institutional__type">{account.type}</span>
				<span aria-hidden="true">·</span>
				<span class="gr-monetization-institutional__status">
					{account.isVerified ? 'Verified' : 'Unverified'}
				</span>
			</p>
		</div>

		{#if enableAnalytics && handlers.onViewAnalytics}
			<button type="button" class="gr-monetization-institutional__action" onclick={() => handlers.onViewAnalytics?.()}>
				View analytics
			</button>
		{/if}
	</header>

	<div class="gr-monetization-institutional__body">
		<div class="gr-monetization-institutional__panel" aria-label="Account settings">
			<label class="gr-monetization-institutional__field">
				<span>Name</span>
				<input class="gr-monetization-institutional__input" type="text" bind:value={draftName} />
			</label>

			<label class="gr-monetization-institutional__field">
				<span>Website</span>
				<input class="gr-monetization-institutional__input" type="url" bind:value={draftWebsite} />
			</label>

			<label class="gr-monetization-institutional__field">
				<span>Description</span>
				<textarea
					class="gr-monetization-institutional__textarea"
					rows="3"
					bind:value={draftDescription}
				></textarea>
			</label>

			{#if handlers.onUpdateAccount}
				<button type="button" class="gr-monetization-institutional__action" onclick={updateAccount}>
					Update account
				</button>
			{/if}
		</div>

		{#if enableArtistManagement}
			<div class="gr-monetization-institutional__panel" aria-label="Artist management">
				<h4 class="gr-monetization-institutional__panel-title">Artists</h4>

				<div class="gr-monetization-institutional__row">
					<label class="gr-monetization-institutional__field">
						<span>Artist ID</span>
						<input class="gr-monetization-institutional__input" type="text" bind:value={artistId} />
					</label>

					<label class="gr-monetization-institutional__field">
						<span>Role</span>
						<select class="gr-monetization-institutional__input" bind:value={artistRole}>
							<option value="represented">represented</option>
							<option value="exhibited">exhibited</option>
							<option value="member">member</option>
							<option value="faculty">faculty</option>
						</select>
					</label>
				</div>

				{#if handlers.onAddArtist}
					<button type="button" class="gr-monetization-institutional__action" onclick={addArtist}>
						Add artist
					</button>
				{/if}
			</div>
		{/if}

		{#if enableExhibitionManagement}
			<div class="gr-monetization-institutional__panel" aria-label="Exhibition management">
				<h4 class="gr-monetization-institutional__panel-title">Exhibitions</h4>
				{#if handlers.onCreateExhibition}
					<button type="button" class="gr-monetization-institutional__action" onclick={createExhibition}>
						Create exhibition
					</button>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.gr-monetization-institutional {
		border: 1px solid var(--gr-color-border-primary);
		border-radius: var(--gr-radius-lg);
		background: var(--gr-color-surface-primary);
		color: var(--gr-color-text-primary);
		overflow: hidden;
	}

	.gr-monetization-institutional__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
		border-bottom: 1px solid var(--gr-color-border-primary);
	}

	.gr-monetization-institutional__name {
		margin: 0;
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
	}

	.gr-monetization-institutional__meta {
		margin: var(--gr-spacing-scale-1) 0 0;
		display: flex;
		gap: var(--gr-spacing-scale-2);
		color: var(--gr-color-text-secondary);
		font-size: var(--gr-font-size-sm);
	}

	.gr-monetization-institutional__body {
		display: grid;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
	}

	.gr-monetization-institutional__panel {
		border: 1px solid var(--gr-color-border-secondary);
		border-radius: var(--gr-radius-md);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-surface-secondary);
	}

	.gr-monetization-institutional__panel-title {
		margin: 0 0 var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-md);
		font-weight: var(--gr-font-weight-semibold);
	}

	.gr-monetization-institutional__field {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
		margin-bottom: var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-text-secondary);
	}

	.gr-monetization-institutional__input,
	.gr-monetization-institutional__textarea {
		border: 1px solid var(--gr-color-border-primary);
		border-radius: var(--gr-radius-md);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-surface-primary);
		color: var(--gr-color-text-primary);
		font-size: var(--gr-font-size-sm);
	}

	.gr-monetization-institutional__row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--gr-spacing-scale-3);
	}

	@media (min-width: 640px) {
		.gr-monetization-institutional__row {
			grid-template-columns: 2fr 1fr;
			align-items: end;
		}
	}

	.gr-monetization-institutional__action {
		border: 1px solid var(--gr-color-border-primary);
		border-radius: var(--gr-radius-md);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-surface-primary);
		color: var(--gr-color-text-primary);
		cursor: pointer;
		font-size: var(--gr-font-size-sm);
	}

	.gr-monetization-institutional__action:hover {
		background: var(--gr-color-surface-tertiary);
	}
</style>
