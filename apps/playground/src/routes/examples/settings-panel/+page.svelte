<script lang="ts">
	import {
		SettingsSection,
		SettingsToggle,
		SettingsSelect,
	} from '@equaltoai/greater-components-primitives';
	import { createPreferenceStore } from '@equaltoai/greater-components-utils';

	const prefs = createPreferenceStore('app-settings', {
		notifications: true,
		autoplay: false,
		theme: 'system',
		language: 'en',
	});

	let settings = $state(prefs.get());

	prefs.subscribe((newSettings) => {
		settings = newSettings;
	});
</script>

<div class="example-container">
	<h1>Settings Panel</h1>

	<SettingsSection title="Preferences" description="Customize your experience">
		<SettingsToggle
			label="Enable Notifications"
			description="Receive updates and alerts"
			bind:value={settings.notifications}
		/>

		<SettingsToggle
			label="Autoplay Media"
			description="Automatically play videos and GIFs"
			bind:value={settings.autoplay}
		/>

		<SettingsSelect
			label="Theme"
			description="Choose your color scheme"
			bind:value={settings.theme}
			options={[
				{ value: 'light', label: 'Light' },
				{ value: 'dark', label: 'Dark' },
				{ value: 'system', label: 'System' },
			]}
		/>

		<SettingsSelect
			label="Language"
			bind:value={settings.language}
			options={[
				{ value: 'en', label: 'English' },
				{ value: 'es', label: 'Español' },
				{ value: 'fr', label: 'Français' },
			]}
		/>
	</SettingsSection>

	<div class="debug-info">
		<h3>Current Settings:</h3>
		<pre>{JSON.stringify(settings, null, 2)}</pre>
	</div>
</div>

<style>
	.example-container {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.debug-info {
		margin-top: 2rem;
		padding: 1rem;
		background: var(--gr-color-surface-subtle);
		border-radius: var(--gr-radius-md);
	}
</style>
