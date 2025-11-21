<!--
  Lists.Settings - List Privacy and Visibility Settings
  
  Configuration options for list privacy, sharing, and advanced settings.
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getListsContext, type ListFormData } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: listsState, updateList } = getListsContext();

	const currentList = $derived(listsState.selectedList);

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
	<div class={`list-settings ${className}`}>
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
