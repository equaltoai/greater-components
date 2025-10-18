<!--
  Filters.Editor - Filter Creation/Editing Form
  
  Form for creating new filters or editing existing ones.
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { createModal } from '@greater/headless/modal';
	import { getFiltersContext, type FilterContext, type FilterFormData } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: filtersState, createFilter, updateFilter, closeEditor } = getFiltersContext();

	// Form state
	let phrase = $state('');
	let contexts = $state<FilterContext[]>(['home']);
	let expiresIn = $state<number | null>(null);
	let irreversible = $state(false);
	let wholeWord = $state(true);

	// Initialize form when editing
	$effect(() => {
		if (filtersState.selectedFilter) {
			phrase = filtersState.selectedFilter.phrase;
			contexts = [...filtersState.selectedFilter.context];
			irreversible = filtersState.selectedFilter.irreversible;
			wholeWord = filtersState.selectedFilter.wholeWord;

			// Calculate expiresIn from expiresAt
			if (filtersState.selectedFilter.expiresAt) {
				const now = new Date();
				const expires = new Date(filtersState.selectedFilter.expiresAt);
				const diff = expires.getTime() - now.getTime();
				expiresIn = Math.floor(diff / 1000);
			} else {
				expiresIn = null;
			}
		} else {
			// Reset form for new filter
			phrase = '';
			contexts = ['home'];
			expiresIn = null;
			irreversible = false;
			wholeWord = true;
		}
	});

	const isOpen = $derived(filtersState.editorOpen);
	const isValid = $derived(phrase.trim().length > 0 && contexts.length > 0);

	const modal = createModal();

	$effect(() => {
		if (isOpen) {
			modal.helpers.open();
		} else {
			modal.helpers.close();
		}
	});

	async function handleSubmit() {
		if (!isValid || filtersState.saving) return;

		const formData: FilterFormData = {
			phrase: phrase.trim(),
			context: contexts,
			expiresIn,
			irreversible,
			wholeWord,
		};

		try {
			if (filtersState.selectedFilter) {
				await updateFilter(filtersState.selectedFilter.id, formData);
			} else {
				await createFilter(formData);
			}
		} catch (_error) {
			// Error handled by context
		}
	}

	function toggleContext(context: FilterContext) {
		if (contexts.includes(context)) {
			contexts = contexts.filter((c) => c !== context);
		} else {
			contexts = [...contexts, context];
		}
	}

	const cancelButton = createButton({
		onClick: () => closeEditor(),
	});

	const saveButton = createButton({
		onClick: () => handleSubmit(),
	});

	const allContexts: { value: FilterContext; label: string; description: string }[] = [
		{
			value: 'home',
			label: 'Home timeline',
			description: 'Posts from people you follow',
		},
		{
			value: 'notifications',
			label: 'Notifications',
			description: 'Mentions, boosts, favorites, and follows',
		},
		{
			value: 'public',
			label: 'Public timelines',
			description: 'Local and federated timelines',
		},
		{
			value: 'thread',
			label: 'Conversations',
			description: 'Replies and threads',
		},
		{
			value: 'account',
			label: 'Profiles',
			description: 'Posts on user profiles',
		},
	];

	const expirationOptions = [
		{ value: null, label: 'Never' },
		{ value: 1800, label: '30 minutes' },
		{ value: 3600, label: '1 hour' },
		{ value: 21600, label: '6 hours' },
		{ value: 43200, label: '12 hours' },
		{ value: 86400, label: '1 day' },
		{ value: 604800, label: '1 week' },
	];
</script>

{#if isOpen}
	<div use:modal.actions.backdrop class="filter-editor__backdrop">
		<div use:modal.actions.content class={`filter-editor__modal ${className}`}>
			<div class="filter-editor__header">
				<h3 class="filter-editor__title">
					{filtersState.selectedFilter ? 'Edit Filter' : 'New Filter'}
				</h3>
				<button use:modal.actions.close class="filter-editor__close" aria-label="Close"> × </button>
			</div>

			<form
				class="filter-editor__form"
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				{#if filtersState.error}
					<div class="filter-editor__error" role="alert">
						{filtersState.error}
					</div>
				{/if}

				<!-- Phrase Input -->
				<div class="filter-editor__field">
					<label for="filter-phrase" class="filter-editor__label"> Keyword or phrase </label>
				<input
					id="filter-phrase"
					type="text"
					class="filter-editor__input"
					bind:value={phrase}
					placeholder="e.g., spoilers, politics, crypto"
					required
				/>
					<p class="filter-editor__hint">Posts containing this text will be filtered</p>
				</div>

				<!-- Whole Word Option -->
				<div class="filter-editor__field">
					<label class="filter-editor__checkbox">
						<input type="checkbox" bind:checked={wholeWord} />
						<span class="filter-editor__checkbox-label"> Match whole word only </span>
					</label>
					<p class="filter-editor__hint">
						{#if wholeWord}
							Will match "cat" but not "catch" or "scat"
						{:else}
							Will match "cat" in "catch", "scat", etc.
						{/if}
					</p>
				</div>

			<!-- Contexts -->
			<div class="filter-editor__field">
				<p class="filter-editor__label">Filter in</p>
				<div class="filter-editor__contexts">
					{#each allContexts as context (context.value)}
							<button
								type="button"
								class="filter-editor__context-button"
								class:filter-editor__context-button--active={contexts.includes(context.value)}
								onclick={() => toggleContext(context.value)}
							>
								<div class="filter-editor__context-check">
									{#if contexts.includes(context.value)}
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
											/>
										</svg>
									{/if}
								</div>
								<div class="filter-editor__context-text">
									<div class="filter-editor__context-label">{context.label}</div>
									<div class="filter-editor__context-description">{context.description}</div>
								</div>
							</button>
						{/each}
					</div>
					{#if contexts.length === 0}
						<p class="filter-editor__error-text">Select at least one context</p>
					{/if}
				</div>

				<!-- Expiration -->
				<div class="filter-editor__field">
				<label for="filter-expires" class="filter-editor__label"> Expire after </label>
				<select id="filter-expires" class="filter-editor__select" bind:value={expiresIn}>
					{#each expirationOptions as option (option.value ?? 'never')}
							<option value={option.value}>
								{option.label}
							</option>
						{/each}
					</select>
					<p class="filter-editor__hint">
						{#if expiresIn}
							Filter will automatically be removed after this duration
						{:else}
							Filter will remain active until manually removed
						{/if}
					</p>
				</div>

			<!-- Filter Action -->
			<div class="filter-editor__field">
				<p class="filter-editor__label">Filter action</p>
					<div class="filter-editor__radio-group">
						<label class="filter-editor__radio">
							<input
								type="radio"
								name="action"
								value="warn"
								checked={!irreversible}
								onchange={() => (irreversible = false)}
							/>
							<div>
								<div class="filter-editor__radio-label">Show with warning</div>
								<div class="filter-editor__radio-description">
									Hide content behind a warning that can be revealed
								</div>
							</div>
						</label>

						<label class="filter-editor__radio">
							<input
								type="radio"
								name="action"
								value="hide"
								checked={irreversible}
								onchange={() => (irreversible = true)}
							/>
							<div>
								<div class="filter-editor__radio-label">Hide completely</div>
								<div class="filter-editor__radio-description">
									Remove content entirely from timelines
								</div>
							</div>
						</label>
					</div>
				</div>
			</form>

			<div class="filter-editor__footer">
				<button
					use:cancelButton.actions.button
					class="filter-editor__button filter-editor__button--secondary"
					disabled={filtersState.saving}
				>
					Cancel
				</button>
				<button
					use:saveButton.actions.button
					class="filter-editor__button filter-editor__button--primary"
					disabled={filtersState.saving || !isValid}
				>
					{#if filtersState.saving}
						Saving...
					{:else}
						{filtersState.selectedFilter ? 'Update Filter' : 'Create Filter'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.filter-editor__backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 1rem;
	}

	.filter-editor__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 0.75rem;
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.filter-editor__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.filter-editor__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.filter-editor__close {
		padding: 0.5rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
	}

	.filter-editor__form {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.filter-editor__error {
		padding: 1rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
		margin-bottom: 1rem;
	}

	.filter-editor__field {
		margin-bottom: 1.5rem;
	}

	.filter-editor__label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		font-size: 0.9375rem;
	}

	.filter-editor__input,
	.filter-editor__select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: border-color 0.2s;
	}

	.filter-editor__input:focus,
	.filter-editor__select:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.filter-editor__hint {
		margin: 0.5rem 0 0 0;
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}

	.filter-editor__error-text {
		margin: 0.5rem 0 0 0;
		font-size: 0.8125rem;
		color: #f4211e;
	}

	.filter-editor__checkbox {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	.filter-editor__checkbox input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.filter-editor__checkbox-label {
		font-size: 0.9375rem;
	}

	.filter-editor__contexts {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.filter-editor__context-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-primary, #ffffff);
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.filter-editor__context-button:hover {
		border-color: var(--primary-color, #1d9bf0);
		background: var(--bg-hover, #eff3f4);
	}

	.filter-editor__context-button--active {
		border-color: var(--primary-color, #1d9bf0);
		background: rgba(29, 155, 240, 0.1);
	}

	.filter-editor__context-check {
		width: 1.5rem;
		height: 1.5rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s;
	}

	.filter-editor__context-button--active .filter-editor__context-check {
		border-color: var(--primary-color, #1d9bf0);
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.filter-editor__context-check svg {
		width: 1rem;
		height: 1rem;
	}

	.filter-editor__context-text {
		flex: 1;
		min-width: 0;
	}

	.filter-editor__context-label {
		font-size: 0.9375rem;
		font-weight: 600;
		margin-bottom: 0.125rem;
	}

	.filter-editor__context-description {
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}

	.filter-editor__radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filter-editor__radio {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-editor__radio:has(input:checked) {
		border-color: var(--primary-color, #1d9bf0);
		background: rgba(29, 155, 240, 0.05);
	}

	.filter-editor__radio input[type='radio'] {
		margin-top: 0.125rem;
		cursor: pointer;
	}

	.filter-editor__radio-label {
		font-size: 0.9375rem;
		font-weight: 600;
		margin-bottom: 0.125rem;
	}

	.filter-editor__radio-description {
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}

	.filter-editor__footer {
		display: flex;
		gap: 0.75rem;
		padding: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		justify-content: flex-end;
	}

	.filter-editor__button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-editor__button--secondary {
		background: transparent;
		color: var(--text-primary, #0f1419);
		border: 1px solid var(--border-color, #e1e8ed);
	}

	.filter-editor__button--secondary:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.filter-editor__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.filter-editor__button--primary:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.filter-editor__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
