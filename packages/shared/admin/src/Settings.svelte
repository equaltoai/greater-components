<!--
  Admin.Settings - Instance Settings
  
  Configure instance-wide settings including registration,
  content limits, and feature flags.
  
  @component
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAdminContext } from './context.svelte.js';
	import { onMount } from 'svelte';
	import type { InstanceSettings } from './context.svelte.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: adminState, fetchSettings, handlers } = getAdminContext();

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
		if (adminState.settings && !editedSettings) {
			editedSettings = { ...adminState.settings };
		}
	});

	$effect(() => {
		if (editedSettings && adminState.settings) {
			hasChanges = JSON.stringify(editedSettings) !== JSON.stringify(adminState.settings);
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
		if (adminState.settings) {
			editedSettings = { ...adminState.settings };
			hasChanges = false;
		}
	}
</script>

<div class={`admin-settings ${className}`}>
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

	{#if adminState.loading && !editedSettings}
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
						<label for="max-post-length" class="admin-settings__label"> Max Post Length </label>
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
						<label for="max-media" class="admin-settings__label"> Max Media Attachments </label>
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
