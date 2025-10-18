<!--
Profile.PrivacySettings - Account privacy configuration

Manages account privacy settings including:
- Private account (follow approval required)
- Follower/following list visibility
- Search engine indexing
- Discoverability preferences
- Media playback settings

@component
@example
```svelte
<script>
  import { Profile } from '@greater/fediverse';
  
  const settings = {
    isPrivate: false,
    requireFollowApproval: false,
    hideFollowers: false,
    hideFollowing: false,
    searchableBySearchEngines: true,
    discoverable: true
  };
  
  function handleUpdate(updated) {
    console.log('Privacy settings updated:', updated);
  }
</script>

<Profile.PrivacySettings {settings} onUpdate={handleUpdate} />
```
-->

<script lang="ts">
	import type { PrivacySettings } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Current privacy settings
		 */
		settings?: Partial<PrivacySettings>;

		/**
		 * Show detailed descriptions
		 */
		showDescriptions?: boolean;

		/**
		 * Group settings by category
		 */
		groupByCategory?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		settings = {},
		showDescriptions = true,
		groupByCategory = true,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	// Local state for settings
	let localSettings = $state<PrivacySettings>({
		isPrivate: settings.isPrivate ?? false,
		requireFollowApproval: settings.requireFollowApproval ?? false,
		hideFollowers: settings.hideFollowers ?? false,
		hideFollowing: settings.hideFollowing ?? false,
		hideRelationships: settings.hideRelationships ?? false,
		searchableBySearchEngines: settings.searchableBySearchEngines ?? true,
		discoverable: settings.discoverable ?? true,
		showAdultContent: settings.showAdultContent ?? false,
		autoplayGifs: settings.autoplayGifs ?? true,
		autoplayVideos: settings.autoplayVideos ?? false,
	});

	let saving = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	/**
	 * Check if settings have changed
	 */
	const hasChanges = $derived(
		Object.keys(settings).some(
			(key) =>
				localSettings[key as keyof PrivacySettings] !== settings[key as keyof PrivacySettings]
		)
	);

	/**
	 * Update a single setting
	 */
	function updateSetting<K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) {
		localSettings[key] = value;
		error = null;
		successMessage = null;
	}

	/**
	 * Save privacy settings
	 */
	async function handleSave() {
		if (!hasChanges || !context.handlers.onUpdatePrivacySettings) {
			return;
		}

		saving = true;
		error = null;
		successMessage = null;

		try {
			await context.handlers.onUpdatePrivacySettings(localSettings);
			successMessage = 'Privacy settings saved successfully';

			// Clear success message after 3 seconds
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save privacy settings';
		} finally {
			saving = false;
		}
	}

	/**
	 * Reset to original settings
	 */
	function handleReset() {
		localSettings = {
			isPrivate: settings.isPrivate ?? false,
			requireFollowApproval: settings.requireFollowApproval ?? false,
			hideFollowers: settings.hideFollowers ?? false,
			hideFollowing: settings.hideFollowing ?? false,
			hideRelationships: settings.hideRelationships ?? false,
			searchableBySearchEngines: settings.searchableBySearchEngines ?? true,
			discoverable: settings.discoverable ?? true,
			showAdultContent: settings.showAdultContent ?? false,
			autoplayGifs: settings.autoplayGifs ?? true,
			autoplayVideos: settings.autoplayVideos ?? false,
		};
		error = null;
		successMessage = null;
	}

	interface SettingConfig {
		key: keyof PrivacySettings;
		label: string;
		description: string;
		category: 'account' | 'visibility' | 'discovery' | 'media';
	}

	const settingConfigs: SettingConfig[] = [
		{
			key: 'isPrivate',
			label: 'Private account',
			description: 'Require approval for new followers',
			category: 'account',
		},
		{
			key: 'requireFollowApproval',
			label: 'Manually approve follow requests',
			description: 'Review each follow request individually',
			category: 'account',
		},
		{
			key: 'hideFollowers',
			label: 'Hide followers list',
			description: 'Only you can see who follows you',
			category: 'visibility',
		},
		{
			key: 'hideFollowing',
			label: 'Hide following list',
			description: 'Only you can see who you follow',
			category: 'visibility',
		},
		{
			key: 'hideRelationships',
			label: 'Hide relationship indicators',
			description: 'Hide "follows you" and mutual follow badges',
			category: 'visibility',
		},
		{
			key: 'searchableBySearchEngines',
			label: 'Allow search engine indexing',
			description: 'Let search engines index your public posts',
			category: 'discovery',
		},
		{
			key: 'discoverable',
			label: 'Suggest account to others',
			description: 'Appear in recommendations and suggestions',
			category: 'discovery',
		},
		{
			key: 'showAdultContent',
			label: 'Show adult content',
			description: 'Display posts marked as adult/sensitive',
			category: 'media',
		},
		{
			key: 'autoplayGifs',
			label: 'Autoplay animated GIFs',
			description: 'Automatically play GIF animations',
			category: 'media',
		},
		{
			key: 'autoplayVideos',
			label: 'Autoplay videos',
			description: 'Automatically play video content',
			category: 'media',
		},
	];

	const categories = [
		{ id: 'account', label: 'Account Privacy' },
		{ id: 'visibility', label: 'Profile Visibility' },
		{ id: 'discovery', label: 'Discoverability' },
		{ id: 'media', label: 'Media Settings' },
	];

	/**
	 * Get settings by category
	 */
	function getSettingsByCategory(categoryId: string): SettingConfig[] {
		return settingConfigs.filter((s) => s.category === categoryId);
	}
</script>

<div class={`privacy-settings ${className}`}>
	<div class="privacy-settings__header">
		<h2 class="privacy-settings__title">Privacy & Safety</h2>
		<p class="privacy-settings__subtitle">
			Control who can see your content and how you appear to others
		</p>
	</div>

	{#if error}
		<div class="privacy-settings__error" role="alert">
			{error}
		</div>
	{/if}

	{#if successMessage}
		<div class="privacy-settings__success" role="status">
			{successMessage}
		</div>
	{/if}

	<div class="privacy-settings__content">
		{#if groupByCategory}
			{#each categories as category (category.id)}
				{@const categorySettings = getSettingsByCategory(category.id)}
				{#if categorySettings.length > 0}
					<section class="privacy-settings__category">
						<h3 class="privacy-settings__category-title">{category.label}</h3>
						<div class="privacy-settings__list">
							{#each categorySettings as config (config.key)}
								<div class="privacy-settings__item">
									<label class="privacy-settings__label">
										<input
											type="checkbox"
											class="privacy-settings__checkbox"
											checked={localSettings[config.key]}
											onchange={(e) => updateSetting(config.key, e.currentTarget.checked)}
											disabled={saving}
										/>
										<div class="privacy-settings__text">
											<span class="privacy-settings__label-text">
												{config.label}
											</span>
											{#if showDescriptions}
												<span class="privacy-settings__description">
													{config.description}
												</span>
											{/if}
										</div>
									</label>
								</div>
							{/each}
						</div>
					</section>
				{/if}
			{/each}
		{:else}
			<div class="privacy-settings__list">
				{#each settingConfigs as config (config.key)}
					<div class="privacy-settings__item">
						<label class="privacy-settings__label">
							<input
								type="checkbox"
								class="privacy-settings__checkbox"
								checked={localSettings[config.key]}
								onchange={(e) => updateSetting(config.key, e.currentTarget.checked)}
								disabled={saving}
							/>
							<div class="privacy-settings__text">
								<span class="privacy-settings__label-text">
									{config.label}
								</span>
								{#if showDescriptions}
									<span class="privacy-settings__description">
										{config.description}
									</span>
								{/if}
							</div>
						</label>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="privacy-settings__actions">
		<button
			class="privacy-settings__button privacy-settings__button--secondary"
			onclick={handleReset}
			disabled={!hasChanges || saving}
			type="button"
		>
			Reset
		</button>
		<button
			class="privacy-settings__button privacy-settings__button--primary"
			onclick={handleSave}
			disabled={!hasChanges || saving}
			type="button"
		>
			{saving ? 'Saving...' : 'Save Changes'}
		</button>
	</div>
</div>

<style>
	.privacy-settings {
		width: 100%;
		max-width: 600px;
	}

	.privacy-settings__header {
		margin-bottom: 1.5rem;
	}

	.privacy-settings__title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		margin: 0 0 0.5rem;
	}

	.privacy-settings__subtitle {
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		margin: 0;
	}

	.privacy-settings__error,
	.privacy-settings__success {
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.9375rem;
	}

	.privacy-settings__error {
		background: var(--error-bg, #fee);
		color: var(--error-text, #c00);
		border: 1px solid var(--error-border, #fcc);
	}

	.privacy-settings__success {
		background: var(--success-bg, #e8f5e9);
		color: var(--success-text, #2e7d32);
		border: 1px solid var(--success-border, #a5d6a7);
	}

	.privacy-settings__content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.privacy-settings__category {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.privacy-settings__category-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		margin: 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color, #eff3f4);
	}

	.privacy-settings__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.privacy-settings__item {
		padding: 0.75rem;
		background: var(--item-bg, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		transition: background 0.2s;
	}

	.privacy-settings__item:hover {
		background: var(--item-hover-bg, #eff3f4);
	}

	.privacy-settings__label {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		cursor: pointer;
	}

	.privacy-settings__checkbox {
		width: 18px;
		height: 18px;
		margin-top: 0.125rem;
		cursor: pointer;
		flex-shrink: 0;
		accent-color: var(--primary-color, #1d9bf0);
	}

	.privacy-settings__checkbox:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.privacy-settings__text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.privacy-settings__label-text {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-primary, #0f1419);
	}

	.privacy-settings__description {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		line-height: 1.4;
	}

	.privacy-settings__actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color, #eff3f4);
	}

	.privacy-settings__button {
		padding: 0.625rem 1.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.privacy-settings__button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.privacy-settings__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.privacy-settings__button--primary:hover:not(:disabled) {
		background: var(--primary-hover, #1a8cd8);
	}

	.privacy-settings__button--primary:focus {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: 2px;
	}

	.privacy-settings__button--secondary {
		background: transparent;
		color: var(--text-primary, #0f1419);
		border: 1px solid var(--border-color, #cfd9de);
	}

	.privacy-settings__button--secondary:hover:not(:disabled) {
		background: var(--button-hover-bg, #f7f9fa);
	}

	.privacy-settings__button--secondary:focus {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: 2px;
	}

	@media (max-width: 640px) {
		.privacy-settings__actions {
			flex-direction: column-reverse;
		}

		.privacy-settings__button {
			width: 100%;
		}
	}
</style>
