<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import AccessibilityScorecard from '$lib/components/AccessibilityScorecard.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';

	const switcherProps = [
		{
			name: 'variant',
			type: "'compact' | 'full'",
			default: "'compact'",
			description:
				'Determines whether ThemeSwitcher renders the dropdown (compact) or full control grid.',
		},
		{
			name: 'showAdvanced',
			type: 'boolean',
			default: 'false',
			description: 'Toggles density/font/motion controls. Enabled inside the settings app.',
		},
		{
			name: 'value',
			type: "'light' | 'dark' | 'high-contrast' | 'auto'",
			description:
				'Optional controlled color scheme. When omitted, component syncs with preferencesStore.',
		},
		{
			name: 'onThemeChange',
			type: '(theme: ColorScheme) => void',
			description:
				'Callback invoked when a new scheme is selected (used to persist to local settings).',
		},
	];

	const packages = [
		{
			name: '@equaltoai/greater-components-primitives',
			detail:
				'ThemeSwitcher, Button, Switch, Select, TextField, TextArea components driving the UI.',
		},
		{
			name: '@equaltoai/greater-components-primitives/preferencesStore',
			detail: 'Shared store powering ThemeProvider + preview cards.',
		},
		{
			name: '@equaltoai/greater-components-social',
			detail: 'StatusCard + notification snippets used in the preview column.',
		},
		{
			name: 'apps/playground/src/lib/stores/storage.ts',
			detail: 'LocalStorage helpers (loadPersistedState/persistState) reused by multiple demos.',
		},
	];

	const snippet = `<script lang="ts">
  import {
    Button,
    ThemeProvider,
    ThemeSwitcher,
    Select,
    Switch,
    preferencesStore
  } from '@equaltoai/greater-components-primitives';
  import { loadPersistedState, persistState } from '$lib/stores/storage';

  const settingsStorageKey = 'playground-settings-demo';
  let settings = $state(loadPersistedState(settingsStorageKey, defaultSettings));

  function updateSettings(section, partial) {
    settings = { ...settings, [section]: { ...settings[section], ...partial } };
    persistState(settingsStorageKey, settings);
  }
</${'script'}>

<ThemeProvider>
  <ThemeSwitcher
    variant="full"
    showAdvanced
    value={settings.appearance.theme}
    onThemeChange={(theme) => updateSettings('appearance', { theme })}
  />

  <label for="density-select">Density</label>
  <Select
    id="density-select"
    options={densityOptions}
    value={settings.appearance.density}
    onchange={(value) => updateSettings('appearance', { density: value })}
  />

  <div class="toggle-row">
    <span>Email alerts</span>
    <Switch checked={settings.notifications.email} onclick={() => toggleNotification('email')} />
  </div>
</ThemeProvider>`;

	const accessibility = {
		wcagLevel: 'AA' as const,
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'ThemeSwitcher radio buttons/tiles are fully tabbable and reflect current scheme via aria-checked.',
			'Digest select + account inputs use explicit <label> controls for screen reader compatibility.',
			'Preview column exposes aria-live="polite" so settings changes are announced as state summaries.',
			'Saved toast (<code>aria-live</code>) confirms persistence without intrusive modals.',
		],
		axeScore: 100,
	};

	const performance = [
		'All preference writes go through `persistState`, keeping the preview reactive without extra fetches.',
		'Digest/density selects use native <select> for keyboard + mobile ergonomics.',
		'Privacy + notification switches mutate Svelte state only; no timers or network chatter.',
		'Preview region recomputes at most once per 800ms via interval throttle inside the route.',
	];

	const testing = [
		{
			label: 'packages/testing/tests/demo/settings.spec.ts',
			detail: 'Covers select-based interactions and toast announcements.',
		},
		{
			label: 'apps/playground/src/lib/stores/storage.test.ts',
			detail:
				'Unit tests validating serialization/SSR fallbacks for loadPersistedState and persistState.',
		},
	];
</script>

<svelte:head>
	<title>Settings Demo Documentation - Greater Components</title>
	<meta
		name="description"
		content="Guidance for the preferences and settings surface powering the /settings playground route."
	/>
</svelte:head>

<DemoPage
	eyebrow="Demo Suite"
	title="Settings experience"
	description="Theme controls, privacy toggles, digest preferences, and account editors stitched together with shared stores."
>
	<section>
		<h2>Packages</h2>
		<ul>
			{#each packages as pkg (pkg.name)}
				<li>
					<strong><code>{pkg.name}</code></strong> — {pkg.detail}
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>ThemeSwitcher props</h2>
		<PropsTable props={switcherProps} />
	</section>

	<section>
		<h2>Usage snippet</h2>
		<CodeExample language="svelte" code={snippet} />
	</section>

	<section>
		<h2>Accessibility</h2>
		<AccessibilityScorecard {...accessibility} />
	</section>

	<section>
		<h2>Performance notes</h2>
		<ul>
			{#each performance as tip, index (`${index}-${tip}`)}
				<li>{tip}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Testing references</h2>
		<ul>
			{#each testing as link (link.label)}
				<li>
					<code>{link.label}</code> — {link.detail}
				</li>
			{/each}
		</ul>
	</section>
</DemoPage>
