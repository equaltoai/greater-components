<!--
  Lists.Settings - List Privacy and Visibility Settings
  
  Configuration options for list privacy, sharing, and advanced settings.
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getListsContext, type ListFormData } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state, updateList } = getListsContext();

	const currentList = $derived(state.selectedList);

	// Settings state
	let visibility = $state<'public' | 'private'>('private');
	let saving = $state(false);
	let saveError = $state<string | null>(null);
	let saveSuccess = $state(false);

	// Initialize settings when list changes
	$effect(() => {
		if (currentList) {
			visibility = currentList.visibility;
		}
	});

	const saveButton = createButton({
		onClick: () => handleSave(),
	});

	async function handleSave() {
		if (!currentList || saving) return;

		saving = true;
		saveError = null;
		saveSuccess = false;

		try {
			const updateData: Partial<ListFormData> = {
				visibility,
			};

			await updateList(currentList.id, updateData);
			saveSuccess = true;

			// Clear success message after 3 seconds
			setTimeout(() => {
				saveSuccess = false;
			}, 3000);
		} catch (error) {
			saveError = error instanceof Error ? error.message : 'Failed to save settings';
		} finally {
			saving = false;
		}
	}

	const hasChanges = $derived(currentList && visibility !== currentList.visibility);
</script>

{#if currentList}
	<div class="list-settings {className}">
		<div class="list-settings__header">
			<h3 class="list-settings__title">List Settings</h3>
			<p class="list-settings__subtitle">
				Configure privacy and visibility for "{currentList.title}"
			</p>
		</div>

		{#if saveError}
			<div class="list-settings__error" role="alert">
				{saveError}
			</div>
		{/if}

		{#if saveSuccess}
			<div class="list-settings__success" role="status">Settings saved successfully!</div>
		{/if}

		<div class="list-settings__section">
			<div class="list-settings__section-header">
				<h4 class="list-settings__section-title">Privacy</h4>
				<p class="list-settings__section-description">
					Control who can see this list and its members
				</p>
			</div>

			<div class="list-settings__options">
				<label class="list-settings__option">
					<input
						type="radio"
						name="visibility"
						value="private"
						checked={visibility === 'private'}
						onchange={() => (visibility = 'private')}
					/>
					<div class="list-settings__option-content">
						<div class="list-settings__option-header">
							<svg class="list-settings__option-icon" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
								/>
							</svg>
							<strong class="list-settings__option-label">Private</strong>
						</div>
						<p class="list-settings__option-description">
							Only you can see this list and its members
						</p>
					</div>
				</label>

				<label class="list-settings__option">
					<input
						type="radio"
						name="visibility"
						value="public"
						checked={visibility === 'public'}
						onchange={() => (visibility = 'public')}
					/>
					<div class="list-settings__option-content">
						<div class="list-settings__option-header">
							<svg class="list-settings__option-icon" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
								/>
							</svg>
							<strong class="list-settings__option-label">Public</strong>
						</div>
						<p class="list-settings__option-description">
							Anyone can see this list and its members
						</p>
					</div>
				</label>
			</div>
		</div>

		<div class="list-settings__section">
			<div class="list-settings__section-header">
				<h4 class="list-settings__section-title">Information</h4>
			</div>

			<div class="list-settings__info">
				<div class="list-settings__info-item">
					<span class="list-settings__info-label">Created</span>
					<span class="list-settings__info-value">
						{new Date(currentList.createdAt).toLocaleDateString()}
					</span>
				</div>

				<div class="list-settings__info-item">
					<span class="list-settings__info-label">Last updated</span>
					<span class="list-settings__info-value">
						{new Date(currentList.updatedAt).toLocaleDateString()}
					</span>
				</div>

				<div class="list-settings__info-item">
					<span class="list-settings__info-label">Members</span>
					<span class="list-settings__info-value">
						{currentList.members.length}
					</span>
				</div>
			</div>
		</div>

		{#if hasChanges}
			<div class="list-settings__footer">
				<button use:saveButton.actions.button class="list-settings__save-button" disabled={saving}>
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="list-settings__no-list">
		<p>Select a list to configure settings</p>
	</div>
{/if}

<style>
	.list-settings {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.list-settings__header {
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		padding-bottom: 1rem;
	}

	.list-settings__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.25rem 0;
	}

	.list-settings__subtitle {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.list-settings__error {
		padding: 1rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
	}

	.list-settings__success {
		padding: 1rem;
		background: rgba(0, 186, 124, 0.1);
		border: 1px solid #00ba7c;
		border-radius: 0.5rem;
		color: #00ba7c;
	}

	.list-settings__section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.list-settings__section-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.list-settings__section-title {
		font-size: 1rem;
		font-weight: 700;
		margin: 0;
	}

	.list-settings__section-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.list-settings__options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.list-settings__option {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.list-settings__option:has(input:checked) {
		border-color: var(--primary-color, #1d9bf0);
		background: rgba(29, 155, 240, 0.05);
	}

	.list-settings__option input[type='radio'] {
		margin-top: 0.125rem;
		cursor: pointer;
	}

	.list-settings__option-content {
		flex: 1;
		min-width: 0;
	}

	.list-settings__option-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.list-settings__option-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
	}

	.list-settings__option
		input[type='radio']:checked
		~ .list-settings__option-content
		.list-settings__option-icon {
		color: var(--primary-color, #1d9bf0);
	}

	.list-settings__option-label {
		font-size: 0.9375rem;
	}

	.list-settings__option-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.list-settings__info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}

	.list-settings__info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.list-settings__info-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.list-settings__info-value {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.list-settings__footer {
		display: flex;
		justify-content: flex-end;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.list-settings__save-button {
		padding: 0.75rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		color: white;
		font-weight: 700;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.list-settings__save-button:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.list-settings__save-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.list-settings__no-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.list-settings__no-list p {
		margin: 0;
	}
</style>
