<!--
  Lists.Editor - List Create/Edit Form
  
  Modal form for creating new lists or editing existing ones.
  Includes title, description, and visibility fields.
  
  @component
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { getListsContext, validateListForm } from './context.js';
	import type { ListFormData } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: listsState, closeEditor, createList, updateList } = getListsContext();

	let title = $state('');
	let description = $state('');
	let visibility = $state<'public' | 'private'>('public');
	let validationError = $state<string | null>(null);

	const isOpen = $derived(listsState.editorOpen);

	const modal = createModal({
		onClose: () => handleClose(),
	});

	$effect(() => {
		if (isOpen) {
			modal.helpers.open();
		} else {
			modal.helpers.close();
		}
	});

	const saveButton = createButton({
		onClick: () => handleSave(),
	});

	const cancelButton = createButton({
		onClick: () => handleClose(),
	});

	// Sync button states
	$effect(() => {
		saveButton.helpers.setDisabled(listsState.loading);
		saveButton.helpers.setLoading(listsState.loading);

		cancelButton.helpers.setDisabled(listsState.loading);
	});

	// Initialize form when editing list changes
	$effect(() => {
		if (listsState.editingList) {
			title = listsState.editingList.title;
			description = listsState.editingList.description || '';
			visibility = listsState.editingList.visibility;
		} else {
			title = '';
			description = '';
			visibility = 'public';
		}
		validationError = null;
	});

	function handleClose() {
		closeEditor();
		validationError = null;
	}

	async function handleSave() {
		const formData: ListFormData = {
			title: title.trim(),
			description: description.trim() || undefined,
			visibility,
		};

		const error = validateListForm(formData);
		if (error) {
			validationError = error;
			return;
		}

		try {
			if (listsState.editingList) {
				await updateList(listsState.editingList.id, formData);
			} else {
				await createList(formData);
			}
		} catch {
			// Error handled by context
		}
	}
</script>

{#if listsState.editorOpen}
	<div class="lists-editor__backdrop" use:modal.actions.backdrop>
		<div class={`lists-editor ${className}`} use:modal.actions.content>
			<div class="lists-editor__header">
				<h2 class="lists-editor__title">
					{listsState.editingList ? 'Edit List' : 'Create New List'}
				</h2>
				<button use:cancelButton.actions.button class="lists-editor__close" aria-label="Close">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
						/>
					</svg>
				</button>
			</div>

			{#if listsState.error}
				<div class="lists-editor__error" role="alert">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
						/>
					</svg>
					{listsState.error}
				</div>
			{/if}

			{#if validationError}
				<div class="lists-editor__error" role="alert">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
						/>
					</svg>
					{validationError}
				</div>
			{/if}

			<form
				class="lists-editor__form"
				onsubmit={(e) => {
					e.preventDefault();
					handleSave();
				}}
			>
				<div class="lists-editor__field">
					<label for="list-title" class="lists-editor__label">
						Title <span class="lists-editor__required">*</span>
					</label>
					<input
						id="list-title"
						type="text"
						class="lists-editor__input"
						bind:value={title}
						placeholder="e.g. Tech News, Friends, etc."
						disabled={listsState.loading}
						maxlength="100"
					/>
					<p class="lists-editor__hint">{title.length}/100</p>
				</div>

				<div class="lists-editor__field">
					<label for="list-description" class="lists-editor__label">Description</label>
					<textarea
						id="list-description"
						class="lists-editor__textarea"
						bind:value={description}
						placeholder="What is this list about?"
						disabled={listsState.loading}
						maxlength="500"
						rows="3"
					></textarea>
					<p class="lists-editor__hint">{description.length}/500</p>
				</div>

				<fieldset class="lists-editor__field lists-editor__field--radio">
					<legend class="lists-editor__label">Visibility</legend>
					<div class="lists-editor__radio-group">
						<label class="lists-editor__radio">
							<input
								type="radio"
								name="visibility"
								value="public"
								bind:group={visibility}
								disabled={listsState.loading}
							/>
							<div class="lists-editor__radio-content">
								<div class="lists-editor__radio-header">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
										/>
									</svg>
									<span class="lists-editor__radio-title">Public</span>
								</div>
								<p class="lists-editor__radio-description">Anyone can see this list</p>
							</div>
						</label>

						<label class="lists-editor__radio">
							<input
								type="radio"
								name="visibility"
								value="private"
								bind:group={visibility}
								disabled={listsState.loading}
							/>
							<div class="lists-editor__radio-content">
								<div class="lists-editor__radio-header">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
										/>
									</svg>
									<span class="lists-editor__radio-title">Private</span>
								</div>
								<p class="lists-editor__radio-description">Only you can see this list</p>
							</div>
						</label>
					</div>
				</fieldset>
			</form>

			<div class="lists-editor__actions">
				<button
					use:cancelButton.actions.button
					class="lists-editor__button lists-editor__button--secondary"
					disabled={listsState.loading}
				>
					Cancel
				</button>
				<button
					use:saveButton.actions.button
					class="lists-editor__button lists-editor__button--primary"
					disabled={listsState.loading}
				>
					{#if listsState.loading}
						<span class="lists-editor__spinner"></span>
						{listsState.editingList ? 'Updating...' : 'Creating...'}
					{:else}
						{listsState.editingList ? 'Update List' : 'Create List'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
