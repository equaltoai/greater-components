<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import {
		SimpleMenu,
		Button,
		ThemeSwitcher,
		preferencesStore,
		type PreferencesState,
	} from '@equaltoai/greater-components-primitives';
	import type { DemoPageData } from '$lib/types/demo';

	let { data }: { data: DemoPageData } = $props();

	type MenuItem = {
		id: string;
		label: string;
		disabled?: boolean;
		submenu?: MenuItem[];
	};

	const primaryMenu: MenuItem[] = [
		{ id: 'profile', label: 'Profile overview' },
		{ id: 'security', label: 'Security settings' },
		{
			id: 'notifications',
			label: 'Notifications',
			submenu: [
				{ id: 'email', label: 'Email alerts' },
				{ id: 'push', label: 'Push notifications' },
				{ id: 'mute', label: 'Mute channel', disabled: true },
			],
		},
		{ id: 'billing', label: 'Billing portal' },
	];

	const contextMenuItems: MenuItem[] = [
		{ id: 'reply', label: 'Reply' },
		{ id: 'boost', label: 'Boost' },
		{
			id: 'share',
			label: 'Share',
			submenu: [
				{ id: 'copy-link', label: 'Copy link' },
				{ id: 'bookmark', label: 'Bookmark' },
			],
		},
		{ id: 'delete', label: 'Delete', disabled: true },
	];

	let lastSelection = $state('Select a menu item to log it.');
	let contextSelection = $state('Right click the card or press Shift+F10.');

	function handleMenuSelect(item: MenuItem) {
		lastSelection = `Selected: ${item.label}`;
	}

	function handleContextSelect(item: MenuItem) {
		contextSelection = `Context action: ${item.label}`;
	}

	let preferenceState = $state<PreferencesState>(preferencesStore.state);

	function syncPreferences() {
		preferenceState = preferencesStore.state;
	}

	function resetPreferences() {
		preferencesStore.reset();
		syncPreferences();
	}

	$effect(() => {
		const interval = setInterval(syncPreferences, 750);
		return () => clearInterval(interval);
	});

	const menuSnippet = `
<Menu items={primaryMenu} onItemSelect={handleMenuSelect}>
  {#snippet trigger({ open, toggle })}
    <Button aria-expanded={open} onclick={toggle}>
      Account actions
    </Button>
  {/snippet}
</Menu>`;

	const contextSnippet = `
<Menu items={contextMenuItems} onItemSelect={handleContextSelect}>
  {#snippet trigger({ toggle })}
    <div
      class="context-target"
      role="button"
      tabindex="0"
      oncontextmenu={(event) => {
        event.preventDefault();
        toggle();
      }}
      onclick={toggle}
      onkeydown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
    >
      Right click or press Shift+F10
    </div>
  {/snippet}
</Menu>`;

	const themeSnippet = `
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`;

	const providerSnippet = `
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`;
</script>

<DemoPage
	eyebrow="Component Demos"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="demo-section">
		<header>
			<h2>Menu &amp; Keyboard Navigation</h2>
			<p>
				Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.
			</p>
		</header>

		<div class="menu-stack">
			<SimpleMenu items={primaryMenu} onItemSelect={handleMenuSelect}>
				{#snippet trigger({ open, toggle })}
					<Button aria-expanded={open} aria-haspopup="true" onclick={toggle}>
						Account actions
					</Button>
				{/snippet}
			</SimpleMenu>
			<p class="status-callout" aria-live="polite">{lastSelection}</p>
		</div>

		<p class="a11y-tip">
			Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.
		</p>

		<CodeExample
			title="Menu trigger"
			description="Trigger snippet receives the menu open state and toggle handler."
			code={menuSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Context Menu Surface</h2>
			<p>Right-click or use Shift+F10 to open the same Menu component as a context menu.</p>
		</header>

		<SimpleMenu items={contextMenuItems} onItemSelect={handleContextSelect}>
			{#snippet trigger({ toggle })}
				<div
					class="context-target"
					role="button"
					tabindex="0"
					oncontextmenu={(event) => {
						event.preventDefault();
						toggle();
					}}
					onclick={toggle}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							toggle();
						}
					}}
				>
					Right click or press Shift+F10
				</div>
			{/snippet}
		</SimpleMenu>

		<p class="status-callout" aria-live="polite">{contextSelection}</p>
		<p class="a11y-tip">
			Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.
		</p>

		<CodeExample
			title="Context trigger"
			description="Wrap any surface and pair the contextmenu event with the menu toggle."
			code={contextSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Theme Switcher Variants</h2>
			<p>
				Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.
			</p>
		</header>

		<div class="theme-grid">
			<div>
				<p class="subhead">Compact</p>
				<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
			</div>
			<div>
				<p class="subhead">Full</p>
				<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />
			</div>
			<div class="preference-card" aria-live="polite">
				<p class="subhead">Resolved preferences</p>
				<dl>
					<div>
						<dt>Color scheme</dt>
						<dd>{preferenceState.resolvedColorScheme}</dd>
					</div>
					<div>
						<dt>Density</dt>
						<dd>{preferenceState.density}</dd>
					</div>
					<div>
						<dt>Font size</dt>
						<dd>{preferenceState.fontSize}</dd>
					</div>
					<div>
						<dt>Motion</dt>
						<dd>{preferenceState.motion}</dd>
					</div>
				</dl>
				<Button size="sm" variant="outline" onclick={resetPreferences}>Reset preferences</Button>
			</div>
		</div>

		<p class="a11y-tip">
			The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.
		</p>

		<CodeExample
			title="Theme switchers"
			description="Both variants consume the same published component."
			code={themeSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Theme Provider Setup</h2>
			<p>
				Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.
			</p>
		</header>

		<p class="a11y-tip">
			Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.
		</p>

		<CodeExample
			title="App shell usage"
			description="Import from the published primitives build—no local source paths."
			code={providerSnippet}
		/>
	</section>
</DemoPage>

<style>
	.demo-section {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 2rem;
		background: var(--gr-semantic-background-primary);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	header p {
		margin: 0.25rem 0 0;
		color: var(--gr-semantic-foreground-secondary);
	}

	.menu-stack {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.context-target {
		border: 1px dashed var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-lg);
		padding: 1.25rem;
		text-align: center;
		cursor: pointer;
		user-select: none;
	}

	.context-target:focus-visible {
		outline: 2px solid var(--gr-semantic-action-primary-default);
		outline-offset: 4px;
	}

	.status-callout {
		margin: 0;
		color: var(--gr-semantic-foreground-secondary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.a11y-tip {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
		margin: 0;
	}

	.theme-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
	}

	.subhead {
		margin: 0 0 0.5rem;
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-secondary);
	}

	.preference-card {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-lg);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	dl {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.5rem 1rem;
	}

	dt {
		font-size: var(--gr-typography-fontSize-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--gr-semantic-foreground-tertiary);
	}

	dd {
		margin: 0;
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	@media (max-width: 640px) {
		.demo-section {
			padding: 1.5rem;
		}
	}
</style>
