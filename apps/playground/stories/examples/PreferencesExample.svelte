<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createLesserGraphQLAdapter,
		type LesserGraphQLAdapter,
	} from '@equaltoai/greater-components-adapters';

	interface Props {
		useMockData?: boolean;
	}

	let { useMockData = false }: Props = $props();

	let graphqlAdapter = $state<LesserGraphQLAdapter | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

	// Form state
	let defaultVisibility = $state<'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT'>('PUBLIC');
	let defaultSensitive = $state(false);
	let defaultLanguage = $state('en');
	let expandSpoilers = $state(false);
	let expandMedia = $state<'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL'>('DEFAULT');
	let autoplayGifs = $state(true);
	let showFollowCounts = $state(true);
	let timelineOrder = $state<'NEWEST' | 'OLDEST'>('NEWEST');
	let searchSuggestionsEnabled = $state(true);
	let personalizedSearchEnabled = $state(true);
	let defaultQuality = $state<'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA'>('AUTO');
	let autoQuality = $state(true);
	let preloadNext = $state(false);
	let dataSaver = $state(false);
	// Note: notifications are read from preferences but not editable in this form
	// They would be managed in a separate notifications settings page
	let indexable = $state(true);
	let showOnlineStatus = $state(false);

	onMount(async () => {
		await initializeAdapter();
		await loadPreferences();
	});

	async function initializeAdapter() {
		try {
			const lesserToken = useMockData ? null : localStorage.getItem('lesser_token') || null;

			if (!lesserToken && !useMockData) {
				error = 'No authentication token found. Please set lesser_token in localStorage.';
				return;
			}

			if (!useMockData && lesserToken) {
				graphqlAdapter = createLesserGraphQLAdapter({
					httpEndpoint: 'https://dev.lesser.host/api/graphql',
					wsEndpoint: 'wss://dev.lesser.host/api/graphql',
					token: lesserToken,
					debug: true,
				});
			}
		} catch (err) {
			console.error('Failed to initialize GraphQL adapter:', err);
			error = err instanceof Error ? err.message : 'Initialization failed';
		}
	}

	async function loadPreferences() {
		if (!graphqlAdapter) {
			// Load mock data
			setMockPreferences();
			return;
		}

		loading = true;
		error = null;

		try {
			const prefs = await graphqlAdapter.getUserPreferences();
			// Hydrate form from loaded preferences
			defaultVisibility = prefs.posting.defaultVisibility;
			defaultSensitive = prefs.posting.defaultSensitive;
			defaultLanguage = prefs.posting.defaultLanguage;
			expandSpoilers = prefs.reading.expandSpoilers;
			expandMedia = prefs.reading.expandMedia;
			autoplayGifs = prefs.reading.autoplayGifs;
			timelineOrder = prefs.reading.timelineOrder;
			showFollowCounts = prefs.discovery.showFollowCounts;
			searchSuggestionsEnabled = prefs.discovery.searchSuggestionsEnabled;
			personalizedSearchEnabled = prefs.discovery.personalizedSearchEnabled;
			defaultQuality = prefs.streaming.defaultQuality;
			autoQuality = prefs.streaming.autoQuality;
			preloadNext = prefs.streaming.preloadNext;
			dataSaver = prefs.streaming.dataSaver;
			indexable = prefs.privacy.indexable;
			showOnlineStatus = prefs.privacy.showOnlineStatus;
		} catch (err) {
			console.error('Failed to load preferences:', err);
			error = err instanceof Error ? err.message : 'Failed to load preferences';
			setMockPreferences();
		} finally {
			loading = false;
		}
	}

	function setMockPreferences() {
		// Set reasonable defaults
		defaultVisibility = 'PUBLIC';
		defaultSensitive = false;
		defaultLanguage = 'en';
		expandSpoilers = false;
		expandMedia = 'DEFAULT';
		autoplayGifs = true;
		showFollowCounts = true;
		timelineOrder = 'NEWEST';
		searchSuggestionsEnabled = true;
		personalizedSearchEnabled = true;
		defaultQuality = 'AUTO';
		autoQuality = true;
		preloadNext = false;
		dataSaver = false;
		indexable = true;
		showOnlineStatus = false;
	}

	async function savePreferences(event: SubmitEvent) {
		event.preventDefault();

		if (!graphqlAdapter) {
			saveStatus = 'error';
			error = 'GraphQL adapter not initialized';
			return;
		}

		saveStatus = 'saving';
		error = null;

		try {
			await graphqlAdapter.updateUserPreferences({
				defaultPostingVisibility: defaultVisibility,
				defaultMediaSensitive: defaultSensitive,
				language: defaultLanguage,
				expandSpoilers,
				expandMedia,
				autoplayGifs,
				showFollowCounts,
				preferredTimelineOrder: timelineOrder,
				searchSuggestionsEnabled,
				personalizedSearchEnabled,
				streaming: {
					defaultQuality,
					autoQuality,
					preloadNext,
					dataSaver,
				},
			});

			saveStatus = 'saved';

			// Reset status after 3 seconds
			setTimeout(() => {
				saveStatus = 'idle';
			}, 3000);
		} catch (err) {
			console.error('Failed to save preferences:', err);
			error = err instanceof Error ? err.message : 'Failed to save preferences';
			saveStatus = 'error';
		}
	}
</script>

<div class="preferences-page">
	<div class="preferences-container">
		<h1>User Preferences</h1>

		{#if error}
			<div class="error-banner">
				<strong>Error:</strong>
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="loading">Loading preferences...</div>
		{:else}
			<form onsubmit={savePreferences}>
				<!-- Posting Preferences -->
				<section class="prefs-section">
					<h2>Posting</h2>

					<div class="form-field">
						<label for="defaultVisibility">Default Visibility</label>
						<select id="defaultVisibility" bind:value={defaultVisibility}>
							<option value="PUBLIC">Public</option>
							<option value="UNLISTED">Unlisted</option>
							<option value="FOLLOWERS">Followers Only</option>
							<option value="DIRECT">Direct</option>
						</select>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={defaultSensitive} />
							Mark media as sensitive by default
						</label>
					</div>

					<div class="form-field">
						<label for="defaultLanguage">Default Language</label>
						<select id="defaultLanguage" bind:value={defaultLanguage}>
							<option value="en">English</option>
							<option value="es">Spanish</option>
							<option value="fr">French</option>
							<option value="de">German</option>
							<option value="ja">Japanese</option>
						</select>
					</div>
				</section>

				<!-- Reading Preferences -->
				<section class="prefs-section">
					<h2>Reading</h2>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={expandSpoilers} />
							Always expand content warnings
						</label>
					</div>

					<div class="form-field">
						<label for="expandMedia">Expand Media</label>
						<select id="expandMedia" bind:value={expandMedia}>
							<option value="DEFAULT">Default (hide sensitive)</option>
							<option value="SHOW_ALL">Show all</option>
							<option value="HIDE_ALL">Hide all</option>
						</select>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={autoplayGifs} />
							Autoplay GIFs
						</label>
					</div>

					<div class="form-field">
						<label for="timelineOrder">Timeline Order</label>
						<select id="timelineOrder" bind:value={timelineOrder}>
							<option value="NEWEST">Newest First</option>
							<option value="OLDEST">Oldest First</option>
						</select>
					</div>
				</section>

				<!-- Discovery Preferences -->
				<section class="prefs-section">
					<h2>Discovery</h2>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={showFollowCounts} />
							Show follow counts
						</label>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={searchSuggestionsEnabled} />
							Enable search suggestions
						</label>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={personalizedSearchEnabled} />
							Enable personalized search
						</label>
					</div>
				</section>

				<!-- Streaming Preferences -->
				<section class="prefs-section">
					<h2>Streaming</h2>

					<div class="form-field">
						<label for="defaultQuality">Default Quality</label>
						<select id="defaultQuality" bind:value={defaultQuality}>
							<option value="AUTO">Auto</option>
							<option value="LOW">Low (480p)</option>
							<option value="MEDIUM">Medium (720p)</option>
							<option value="HIGH">High (1080p)</option>
							<option value="ULTRA">Ultra (4K)</option>
						</select>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={autoQuality} />
							Automatic quality adjustment
						</label>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={preloadNext} />
							Preload next video
						</label>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={dataSaver} />
							Data saver mode
						</label>
					</div>
				</section>

				<!-- Privacy Preferences -->
				<section class="prefs-section">
					<h2>Privacy</h2>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={indexable} />
							Allow search engines to index my profile
						</label>
					</div>

					<div class="form-field checkbox">
						<label>
							<input type="checkbox" bind:checked={showOnlineStatus} />
							Show online status
						</label>
					</div>
				</section>

				<!-- Save Button -->
				<div class="form-actions">
					<button type="submit" class="primary" disabled={saveStatus === 'saving'}>
						{#if saveStatus === 'saving'}
							Saving...
						{:else if saveStatus === 'saved'}
							✓ Saved
						{:else}
							Save Preferences
						{/if}
					</button>
				</div>

				{#if saveStatus === 'saved'}
					<div class="success-banner">Preferences saved successfully!</div>
				{/if}
			</form>
		{/if}
	</div>
</div>

<style>
	.preferences-page {
		min-height: 100vh;
		background: var(--gc-color-surface-100);
		padding: var(--gc-spacing-lg);
	}

	.preferences-container {
		max-width: 800px;
		margin: 0 auto;
		background: var(--gc-color-surface-200);
		border-radius: var(--gc-radius-lg);
		padding: var(--gc-spacing-xl);
	}

	h1 {
		margin: 0 0 var(--gc-spacing-lg) 0;
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-2xl);
	}

	.error-banner,
	.success-banner {
		padding: var(--gc-spacing-md);
		border-radius: var(--gc-radius-sm);
		margin-bottom: var(--gc-spacing-md);
	}

	.error-banner {
		background: var(--gc-color-error-100);
		color: var(--gc-color-error-700);
		border: 1px solid var(--gc-color-error-300);
	}

	.success-banner {
		background: var(--gc-color-success-100);
		color: var(--gc-color-success-700);
		border: 1px solid var(--gc-color-success-300);
	}

	.loading {
		padding: var(--gc-spacing-xl);
		text-align: center;
		color: var(--gc-color-text-secondary);
	}

	.prefs-section {
		margin-bottom: var(--gc-spacing-xl);
		padding-bottom: var(--gc-spacing-lg);
		border-bottom: 1px solid var(--gc-color-border-subtle);
	}

	.prefs-section:last-of-type {
		border-bottom: none;
	}

	.prefs-section h2 {
		margin: 0 0 var(--gc-spacing-md) 0;
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-lg);
		font-weight: 600;
	}

	.form-field {
		margin-bottom: var(--gc-spacing-md);
	}

	.form-field label {
		display: block;
		margin-bottom: var(--gc-spacing-xs);
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
		font-weight: 500;
	}

	.form-field select {
		width: 100%;
		padding: var(--gc-spacing-sm);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-surface-100);
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-md);
	}

	.form-field.checkbox label {
		display: flex;
		align-items: center;
		gap: var(--gc-spacing-sm);
		cursor: pointer;
		color: var(--gc-color-text-primary);
	}

	.form-field.checkbox input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: var(--gc-spacing-lg);
	}

	.form-actions button {
		padding: var(--gc-spacing-md) var(--gc-spacing-lg);
		border: none;
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-primary-500);
		color: white;
		font-size: var(--gc-font-size-md);
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		min-width: 150px;
	}

	.form-actions button:hover:not(:disabled) {
		background: var(--gc-color-primary-600);
	}

	.form-actions button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
