<!--
  Profile.Edit - Profile Edit Form
  
  Provides a complete form for editing profile information including
  display name, bio, avatar, header, and custom fields.
  
  @component
  @example
  ```svelte
  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    {#if profileState.editMode}
      <Profile.Edit maxFields={4} />
    {/if}
  </Profile.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getProfileContext } from './context.js';
	import type { ProfileEditData, ProfileField } from './context.js';

	interface Props {
		/**
		 * Maximum number of custom fields
		 * @default 4
		 */
		maxFields?: number;

		/**
		 * Maximum bio length
		 * @default 500
		 */
		maxBioLength?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { maxFields = 4, maxBioLength = 500, class: className = '' }: Props = $props();

	const { state: profileState, handlers, toggleEdit, updateState } = getProfileContext();

	// Form state
	let displayName = $state(profileState.profile?.displayName || '');
	let bio = $state(profileState.profile?.bio || '');
	let avatarFile = $state<File | null>(null);
	let headerFile = $state<File | null>(null);
	let avatarPreview = $state<string | null>(profileState.profile?.avatar || null);
	let headerPreview = $state<string | null>(profileState.profile?.header || null);
	let fields = $state<ProfileField[]>(profileState.profile?.fields || []);

	let avatarInput: HTMLInputElement;
	let headerInput: HTMLInputElement;

	const saveButton = createButton({
		onClick: () => handleSave(),
	});

	const cancelButton = createButton({
		onClick: () => handleCancel(),
	});

	const bioLength = $derived(bio.length);
	const bioOverLimit = $derived(bioLength > maxBioLength);

	/**
	 * Handle avatar file selection
	 */
	function handleAvatarChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			avatarFile = file;
			avatarPreview = URL.createObjectURL(file);
		}
	}

	/**
	 * Handle header file selection
	 */
	function handleHeaderChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			headerFile = file;
			headerPreview = URL.createObjectURL(file);
		}
	}

	/**
	 * Add a new field
	 */
	function addField() {
		if (fields.length < maxFields) {
			fields = [...fields, { name: '', value: '' }];
		}
	}

	/**
	 * Remove a field
	 */
	function removeField(index: number) {
		fields = fields.filter((_, i) => i !== index);
	}

	/**
	 * Update a field
	 */
	function updateField(index: number, key: 'name' | 'value', value: string) {
		fields[index] = { ...fields[index], [key]: value };
	}

	/**
	 * Handle form save
	 */
	async function handleSave() {
		if (profileState.loading || bioOverLimit) return;

		updateState({ loading: true, error: null });

		try {
			const editData: ProfileEditData = {
				displayName: displayName.trim(),
				bio: bio.trim(),
				fields: fields.filter((f) => f.name.trim() && f.value.trim()),
			};

			// Upload avatar if changed
			if (avatarFile && handlers.onAvatarUpload) {
				editData.avatar = await handlers.onAvatarUpload(avatarFile);
			}

			// Upload header if changed
			if (headerFile && handlers.onHeaderUpload) {
				editData.header = await handlers.onHeaderUpload(headerFile);
			}

			await handlers.onSave?.(editData);
			toggleEdit();
		} catch (error) {
			updateState({
				error: error instanceof Error ? error.message : 'Failed to save profile',
			});
		} finally {
			updateState({ loading: false });
		}
	}

	/**
	 * Handle form cancel
	 */
	function handleCancel() {
		// Reset form
		displayName = profileState.profile?.displayName || '';
		bio = profileState.profile?.bio || '';
		avatarFile = null;
		headerFile = null;
		avatarPreview = profileState.profile?.avatar || null;
		headerPreview = profileState.profile?.header || null;
		fields = profileState.profile?.fields || [];

		toggleEdit();
	}
</script>

<div class={`profile-edit ${className}`}>
	<div class="profile-edit__header">
		<h2 class="profile-edit__title">Edit Profile</h2>
		<button use:cancelButton.actions.button class="profile-edit__close" aria-label="Close">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
				/>
			</svg>
		</button>
	</div>

	{#if profileState.error}
		<div class="profile-edit__error" role="alert">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{profileState.error}
		</div>
	{/if}

	<form class="profile-edit__form">
		<!-- Header Image -->
		<div class="profile-edit__section">
			<p class="profile-edit__label">Cover Image</p>
			<div class="profile-edit__header-upload">
				{#if headerPreview}
					<img src={headerPreview} alt="Header preview" class="profile-edit__header-preview" />
				{:else}
					<div class="profile-edit__header-placeholder">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
							/>
						</svg>
					</div>
				{/if}
				<input
					type="file"
					accept="image/*"
					class="profile-edit__file-input"
					onchange={handleHeaderChange}
					bind:this={headerInput}
				/>
				<button
					type="button"
					class="profile-edit__upload-button"
					onclick={() => headerInput.click()}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
						/>
					</svg>
					{headerPreview ? 'Change' : 'Upload'}
				</button>
			</div>
		</div>

		<!-- Avatar -->
		<div class="profile-edit__section">
			<p class="profile-edit__label">Avatar</p>
			<div class="profile-edit__avatar-upload">
				<div class="profile-edit__avatar-preview">
					{#if avatarPreview}
						<img src={avatarPreview} alt="Avatar preview" />
					{:else}
						<div class="profile-edit__avatar-placeholder">
							{displayName[0]?.toUpperCase() || '?'}
						</div>
					{/if}
				</div>
				<input
					type="file"
					accept="image/*"
					class="profile-edit__file-input"
					onchange={handleAvatarChange}
					bind:this={avatarInput}
				/>
				<button
					type="button"
					class="profile-edit__upload-button"
					onclick={() => avatarInput.click()}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"
						/>
					</svg>
					{avatarPreview ? 'Change' : 'Upload'}
				</button>
			</div>
		</div>

		<!-- Display Name -->
		<div class="profile-edit__section">
			<label for="edit-display-name" class="profile-edit__label">Display Name</label>
			<input
				id="edit-display-name"
				type="text"
				class="profile-edit__input"
				bind:value={displayName}
				placeholder="Your name"
				disabled={profileState.loading}
				maxlength="50"
			/>
		</div>

		<!-- Bio -->
		<div class="profile-edit__section">
			<label for="edit-bio" class="profile-edit__label">
				Bio
				<span class="profile-edit__char-count" class:profile-edit__char-count--over={bioOverLimit}>
					{bioLength}/{maxBioLength}
				</span>
			</label>
			<textarea
				id="edit-bio"
				class="profile-edit__textarea"
				class:profile-edit__textarea--error={bioOverLimit}
				bind:value={bio}
				placeholder="Tell us about yourself"
				disabled={profileState.loading}
				rows="4"
			></textarea>
		</div>

		<!-- Custom Fields -->
		<div class="profile-edit__section">
			<div class="profile-edit__fields-header">
				<p class="profile-edit__label">Custom Fields</p>
				{#if fields.length < maxFields}
					<button
						type="button"
						class="profile-edit__add-field"
						onclick={addField}
						disabled={profileState.loading}
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
						</svg>
						Add Field
					</button>
				{/if}
			</div>

			{#if fields.length > 0}
				<div class="profile-edit__fields">
					{#each fields as field, index (`${field.name}-${index}`)}
						<div class="profile-edit__field">
							<input
								type="text"
								class="profile-edit__field-input"
								bind:value={field.name}
								onInput={(e) => updateField(index, 'name', e.currentTarget.value)}
								placeholder="Label"
								disabled={profileState.loading}
								maxlength="30"
							/>
							<input
								type="text"
								class="profile-edit__field-input"
								bind:value={field.value}
								onInput={(e) => updateField(index, 'value', e.currentTarget.value)}
								placeholder="Value"
								disabled={profileState.loading}
								maxlength="100"
							/>
							<button
								type="button"
								class="profile-edit__field-remove"
								onclick={() => removeField(index)}
								disabled={profileState.loading}
								aria-label="Remove field"
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
									/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</form>

	<div class="profile-edit__actions">
		<button
			use:cancelButton.actions.button
			class="profile-edit__button profile-edit__button--secondary"
			disabled={profileState.loading}
		>
			Cancel
		</button>
		<button
			use:saveButton.actions.button
			class="profile-edit__button profile-edit__button--primary"
			disabled={profileState.loading || bioOverLimit}
		>
			{#if profileState.loading}
				<span class="profile-edit__spinner"></span>
				Saving...
			{:else}
				Save Profile
			{/if}
		</button>
	</div>
</div>

<style>
	.profile-edit {
		width: 100%;
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
	}

	/* Header */
	.profile-edit__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.profile-edit__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.profile-edit__close {
		padding: 0.5rem;
		border: none;
		background: transparent;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		border-radius: 50%;
		transition: all 0.2s;
	}

	.profile-edit__close:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.profile-edit__close svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	/* Error */
	.profile-edit__error {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem;
		margin-bottom: 1.5rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid rgba(244, 33, 46, 0.3);
		border-radius: 0.5rem;
		color: #f4211e;
		font-size: 0.875rem;
	}

	.profile-edit__error svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Form */
	.profile-edit__form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.profile-edit__section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.profile-edit__label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.profile-edit__char-count {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}

	.profile-edit__char-count--over {
		color: #f4211e;
	}

	/* Header Upload */
	.profile-edit__header-upload {
		position: relative;
		width: 100%;
		height: 12rem;
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
	}

	.profile-edit__header-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-edit__header-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary, #536471);
	}

	.profile-edit__header-placeholder svg {
		width: 3rem;
		height: 3rem;
	}

	/* Avatar Upload */
	.profile-edit__avatar-upload {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.profile-edit__avatar-preview {
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		border: 4px solid var(--border-color, #e1e8ed);
		flex-shrink: 0;
	}

	.profile-edit__avatar-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-edit__avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	/* File Input */
	.profile-edit__file-input {
		display: none;
	}

	.profile-edit__upload-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		background: var(--bg-primary, #ffffff);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		transition: all 0.2s;
	}

	.profile-edit__upload-button:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.profile-edit__upload-button svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.profile-edit__header-upload .profile-edit__upload-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	/* Input */
	.profile-edit__input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 1rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: border-color 0.2s;
	}

	.profile-edit__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.profile-edit__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Textarea */
	.profile-edit__textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		resize: vertical;
		transition: border-color 0.2s;
	}

	.profile-edit__textarea:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.profile-edit__textarea--error {
		border-color: #f4211e;
	}

	.profile-edit__textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Fields */
	.profile-edit__fields-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.profile-edit__add-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		background: transparent;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--primary-color, #1d9bf0);
		cursor: pointer;
		transition: all 0.2s;
	}

	.profile-edit__add-field:hover:not(:disabled) {
		background: rgba(29, 155, 240, 0.1);
	}

	.profile-edit__add-field:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.profile-edit__add-field svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.profile-edit__fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.profile-edit__field {
		display: grid;
		grid-template-columns: 1fr 2fr auto;
		gap: 0.5rem;
		align-items: center;
	}

	.profile-edit__field-input {
		padding: 0.625rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		transition: border-color 0.2s;
	}

	.profile-edit__field-input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.profile-edit__field-remove {
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		border-radius: 50%;
		transition: all 0.2s;
	}

	.profile-edit__field-remove:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.profile-edit__field-remove svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Actions */
	.profile-edit__actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.profile-edit__button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.profile-edit__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.profile-edit__button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.profile-edit__button--secondary:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.profile-edit__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.profile-edit__button--primary:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	/* Spinner */
	.profile-edit__spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
