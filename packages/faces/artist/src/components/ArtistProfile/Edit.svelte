<!--
ArtistProfile.Edit - Profile editing mode controls

Features:
- Profile editing mode toggle
- Inline editing for statement, sections
- Save/cancel controls
- Focus management in edit mode

@component
@example
```svelte
<ArtistProfile.Edit />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getArtistProfileContext();
	const { isOwnProfile, handlers } = ctx;

	// Local editing state
	let isEditing = $state(ctx.isEditing);
	let isSaving = $state(false);

	// Toggle edit mode
	function toggleEdit() {
		if (isEditing) {
			// Cancel editing
			handlers.onCancel?.();
		} else {
			// Enter edit mode
			handlers.onEdit?.();
		}
		isEditing = !isEditing;
		ctx.isEditing = isEditing;
	}

	// Save changes
	async function handleSave() {
		if (isSaving) return;
		isSaving = true;

		try {
			await handlers.onSave?.({});
			isEditing = false;
			ctx.isEditing = false;
		} catch (error) {
			console.error('Failed to save profile:', error);
		} finally {
			isSaving = false;
		}
	}

	// Cancel changes
	function handleCancel() {
		handlers.onCancel?.();
		isEditing = false;
		ctx.isEditing = false;
	}
</script>

{#if isOwnProfile}
	<div class={`profile-edit ${className}`} role="group" aria-label="Profile editing controls">
		{#if isEditing}
			<div class="profile-edit__actions">
				<button
					class="profile-edit__button profile-edit__button--save"
					onclick={handleSave}
					disabled={isSaving}
				>
					{#if isSaving}
						<span class="profile-edit__spinner" aria-hidden="true"></span>
						Saving...
					{:else}
						Save Changes
					{/if}
				</button>

				<button
					class="profile-edit__button profile-edit__button--cancel"
					onclick={handleCancel}
					disabled={isSaving}
				>
					Cancel
				</button>
			</div>
		{:else}
			<button class="profile-edit__button profile-edit__button--edit" onclick={toggleEdit}>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Edit Profile
			</button>
		{/if}
	</div>
{/if}

<style>
	.profile-edit {
		display: flex;
		align-items: center;
	}

	.profile-edit__actions {
		display: flex;
		gap: var(--gr-spacing-scale-3);
	}

	.profile-edit__button {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		border: 1px solid transparent;
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.profile-edit__button:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.profile-edit__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.profile-edit__button--edit {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-100);
	}

	.profile-edit__button--edit:hover:not(:disabled) {
		background: var(--gr-color-gray-600);
	}

	.profile-edit__button--save {
		background: var(--gr-color-primary-600);
		color: white;
	}

	.profile-edit__button--save:hover:not(:disabled) {
		background: var(--gr-color-primary-700);
	}

	.profile-edit__button--cancel {
		background: transparent;
		border-color: var(--gr-color-gray-600);
		color: var(--gr-color-gray-300);
	}

	.profile-edit__button--cancel:hover:not(:disabled) {
		border-color: var(--gr-color-gray-500);
		color: var(--gr-color-gray-200);
	}

	.profile-edit__spinner {
		width: 14px;
		height: 14px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-edit__button {
			transition: none;
		}

		.profile-edit__spinner {
			animation: none;
		}
	}
</style>
