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
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
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

	function buildEffectiveSettings(): PrivacySettings {
		const contextSettings = context.state.privacySettings;
		if (contextSettings) {
			return { ...contextSettings };
		}

		return {
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
	}

	// Load preferences from context if available (GraphQL-backed)
	$effect(() => {
		if (context.handlers.onLoadPreferences && context.state.isOwnProfile) {
			context.handlers.onLoadPreferences().catch((error) => {
				console.error('Failed to load preferences:', error);
			});
		}
	});

	// Use context privacy settings if available, otherwise use props
	const effectiveSettings = $derived<PrivacySettings>(buildEffectiveSettings());

	// Local state for settings (editable copy)
	let localSettings = $state<PrivacySettings>(buildEffectiveSettings());

	// Sync local settings when effective settings change
	$effect(() => {
		if (!hasChanges) {
			localSettings = { ...effectiveSettings };
		}
	});

	let saving = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	/**
	 * Check if settings have changed
	 */
	const hasChanges = $derived(
		Object.keys(localSettings).some(
			(key) =>
				localSettings[key as keyof PrivacySettings] !==
				effectiveSettings[key as keyof PrivacySettings]
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
		localSettings = { ...effectiveSettings };
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
