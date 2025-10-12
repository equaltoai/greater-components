<!--
  Admin.Settings - Instance Settings
  
  Configure instance-wide settings including registration,
  content limits, and feature flags.
  
  @component
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getAdminContext } from './context.js';
	import { onMount } from 'svelte';
	import type { InstanceSettings } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state, fetchSettings, handlers } = getAdminContext();

	let editedSettings = $state<InstanceSettings | null>(null);
	let hasChanges = $state(false);
	let saving = $state(false);

	const saveButton = createButton({
		onClick: () => handleSave(),
	});

	onMount(() => {
		fetchSettings();
	});

	$effect(() => {
		if (state.settings && !editedSettings) {
			editedSettings = { ...state.settings };
		}
	});

	$effect(() => {
		if (editedSettings && state.settings) {
			hasChanges = JSON.stringify(editedSettings) !== JSON.stringify(state.settings);
		}
	});

	async function handleSave() {
		if (!editedSettings || !hasChanges) return;

		saving = true;
		try {
			await handlers.onUpdateSettings?.(editedSettings);
			await fetchSettings();
			hasChanges = false;
		} finally {
			saving = false;
		}
	}

	function handleReset() {
		if (state.settings) {
			editedSettings = { ...state.settings };
			hasChanges = false;
		}
	}
</script>

<div class="admin-settings {className}">
	<div class="admin-settings__header">
		<h2 class="admin-settings__title">Instance Settings</h2>
		{#if hasChanges}
			<div class="admin-settings__save-bar">
				<span class="admin-settings__changes-indicator">Unsaved changes</span>
				<div class="admin-settings__save-actions">
					<button
						class="admin-settings__button admin-settings__button--secondary"
						onclick={handleReset}
						disabled={saving}
					>
						Reset
					</button>
					<button
						use:saveButton.actions.button
						class="admin-settings__button admin-settings__button--primary"
						disabled={saving}
					>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>
		{/if}
	</div>

	{#if state.loading && !editedSettings}
		<div class="admin-settings__loading">Loading settings...</div>
	{:else if editedSettings}
		<div class="admin-settings__sections">
			<!-- General Settings -->
			<div class="admin-settings__section">
				<h3 class="admin-settings__subtitle">General</h3>
				<div class="admin-settings__fields">
					<div class="admin-settings__field">
						<label for="instance-name" class="admin-settings__label">Instance Name</label>
						<input
							id="instance-name"
							type="text"
							class="admin-settings__input"
							bind:value={editedSettings.name}
							placeholder="My ActivityPub Instance"
						/>
						<p class="admin-settings__help">The public name of your instance</p>
					</div>

					<div class="admin-settings__field">
						<label for="instance-description" class="admin-settings__label">Description</label>
						<textarea
							id="instance-description"
							class="admin-settings__textarea"
							bind:value={editedSettings.description}
							placeholder="A brief description of your instance..."
							rows="3"
						></textarea>
						<p class="admin-settings__help">Shown on the about page and instance directory</p>
					</div>
				</div>
			</div>

			<!-- Registration Settings -->
			<div class="admin-settings__section">
				<h3 class="admin-settings__subtitle">Registration</h3>
				<div class="admin-settings__fields">
					<label class="admin-settings__checkbox-field">
						<input
							type="checkbox"
							class="admin-settings__checkbox"
							bind:checked={editedSettings.registrationOpen}
						/>
						<div class="admin-settings__checkbox-content">
							<span class="admin-settings__checkbox-label">Open Registration</span>
							<span class="admin-settings__checkbox-help">Allow anyone to sign up</span>
						</div>
					</label>

					<label class="admin-settings__checkbox-field">
						<input
							type="checkbox"
							class="admin-settings__checkbox"
							bind:checked={editedSettings.approvalRequired}
							disabled={!editedSettings.registrationOpen}
						/>
						<div class="admin-settings__checkbox-content">
							<span class="admin-settings__checkbox-label">Require Approval</span>
							<span class="admin-settings__checkbox-help">
								Manually approve new registrations
							</span>
						</div>
					</label>

					<label class="admin-settings__checkbox-field">
						<input
							type="checkbox"
							class="admin-settings__checkbox"
							bind:checked={editedSettings.inviteOnly}
							disabled={!editedSettings.registrationOpen}
						/>
						<div class="admin-settings__checkbox-content">
							<span class="admin-settings__checkbox-label">Invite Only</span>
							<span class="admin-settings__checkbox-help">Require an invite code to register</span>
						</div>
					</label>
				</div>
			</div>

			<!-- Content Limits -->
			<div class="admin-settings__section">
				<h3 class="admin-settings__subtitle">Content Limits</h3>
				<div class="admin-settings__fields">
					<div class="admin-settings__field">
						<label for="max-post-length" class="admin-settings__label">
							Max Post Length
						</label>
						<input
							id="max-post-length"
							type="number"
							class="admin-settings__input"
							bind:value={editedSettings.maxPostLength}
							min="1"
							max="100000"
						/>
						<p class="admin-settings__help">Maximum characters per post (default: 500)</p>
					</div>

					<div class="admin-settings__field">
						<label for="max-media" class="admin-settings__label">
							Max Media Attachments
						</label>
						<input
							id="max-media"
							type="number"
							class="admin-settings__input"
							bind:value={editedSettings.maxMediaAttachments}
							min="1"
							max="20"
						/>
						<p class="admin-settings__help">Maximum media files per post (default: 4)</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-settings {
		padding: 1.5rem;
	}

	.admin-settings__header {
		margin-bottom: 1.5rem;
	}

	.admin-settings__title {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-settings__save-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: rgba(29, 155, 240, 0.1);
		border: 1px solid rgba(29, 155, 240, 0.3);
		border-radius: 0.5rem;
	}

	.admin-settings__changes-indicator {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
	}

	.admin-settings__save-actions {
		display: flex;
		gap: 0.75rem;
	}

	.admin-settings__button {
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-settings__button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.admin-settings__button--secondary:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.admin-settings__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.admin-settings__button--primary:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.admin-settings__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.admin-settings__loading {
		padding: 4rem 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.admin-settings__sections {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.admin-settings__section {
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-settings__subtitle {
		margin: 0 0 1.5rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-settings__fields {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.admin-settings__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.admin-settings__label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-settings__input {
		padding: 0.75rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		transition: border-color 0.2s;
	}

	.admin-settings__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-settings__textarea {
		padding: 0.75rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		resize: vertical;
		transition: border-color 0.2s;
	}

	.admin-settings__textarea:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-settings__help {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.admin-settings__checkbox-field {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.admin-settings__checkbox-field:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.admin-settings__checkbox {
		width: 1.25rem;
		height: 1.25rem;
		margin: 0;
		cursor: pointer;
		flex-shrink: 0;
	}

	.admin-settings__checkbox:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.admin-settings__checkbox-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.admin-settings__checkbox-label {
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.admin-settings__checkbox-help {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}
</style>

