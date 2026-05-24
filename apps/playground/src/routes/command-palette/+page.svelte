<!--
CommandPalette playground demo.

Exercises the @equaltoai/greater-components-shell CommandPalette with:
- Grouped results (Pages + Actions)
- Disabled item (skipped by keyboard navigation)
- Shortcut chip
- Click-to-open trigger (Cmd/Ctrl + K binding lives in the consumer; this
  demo uses a plain button to keep the demo self-contained and CSP-safe).

Strict-CSP safe: no inline handlers; all event handlers are real Svelte
handlers; all styling consumes --gr-* tokens via the bundled shell.css.
-->
<script lang="ts">
	import { CommandPalette } from '@equaltoai/greater-components-shell';
	import type {
		CommandPaletteGroup,
		CommandPaletteItem,
	} from '@equaltoai/greater-components-shell';
	import '@equaltoai/greater-components-shell/shell.css';

	let open = $state(false);
	let lastSelected = $state<string | null>(null);
	let triggerEl = $state<HTMLButtonElement | null>(null);

	const groups: CommandPaletteGroup[] = [
		{
			id: 'pages',
			label: 'Pages',
			items: [
				{
					id: 'overview',
					label: 'Overview',
					description: 'Fleet overview dashboard',
					keywords: ['home', 'fleet'],
					shortcut: '⌘O',
				},
				{
					id: 'instances',
					label: 'Instances',
					description: 'Provisioned instances',
					keywords: ['servers', 'nodes'],
				},
				{
					id: 'billing',
					label: 'Billing & invoicing',
					description: 'Monthly cycles, usage, invoices',
					keywords: ['cost', 'invoice'],
				},
				{
					id: 'settings',
					label: 'Settings',
					description: 'Account, security, team',
					keywords: ['preferences', 'account'],
				},
			],
		},
		{
			id: 'actions',
			label: 'Actions',
			items: [
				{
					id: 'refresh',
					label: 'Refresh',
					description: 'Reload current view',
					shortcut: '⌘R',
				},
				{
					id: 'theme-toggle',
					label: 'Toggle theme',
					description: 'Switch between light, dark, and high contrast',
					keywords: ['dark', 'light', 'mode'],
					shortcut: 'T',
				},
				{
					id: 'invite',
					label: 'Invite teammate',
					keywords: ['email', 'collaborator'],
				},
				{
					id: 'archive',
					label: 'Archive instance',
					description: 'Coming soon',
					disabled: true,
				},
			],
		},
	];

	function openPalette() {
		open = true;
	}

	function handleSelect(item: CommandPaletteItem) {
		lastSelected = item.label;
		open = false;
	}
</script>

<svelte:head>
	<title>CommandPalette — Greater Components Playground</title>
</svelte:head>

<div class="page">
	<header>
		<h1>CommandPalette</h1>
		<p>
			Accessible, strict-CSP-safe command palette. Open with the button below, then type to filter,
			use ArrowUp/ArrowDown/Home/End to navigate, Enter to activate, Escape to close.
		</p>
	</header>

	<section>
		<button
			type="button"
			bind:this={triggerEl}
			onclick={openPalette}
			aria-haspopup="dialog"
			aria-expanded={open}
		>
			Open command palette
		</button>

		{#if lastSelected}
			<p class="last-selected">
				<strong>Last selected:</strong>
				{lastSelected}
			</p>
		{/if}
	</section>

	<section>
		<h2>Accessibility behaviors covered</h2>
		<ul>
			<li>Dialog role + accessible name (`Command palette`).</li>
			<li>
				Combobox + listbox virtual focus via <code>aria-activedescendant</code>; keyboard input
				stays on the search field.
			</li>
			<li>
				ArrowUp / ArrowDown / Home / End navigate options, skipping disabled items.
				<em>Archive instance</em> is disabled and skipped.
			</li>
			<li>
				Enter activates the active option; Escape closes; clicking outside closes; focus is returned
				to the opener button.
			</li>
			<li>Grouped results expose <code>role="group"</code> with linked group headers.</li>
			<li>Live region politely announces result counts and empty / loading state changes.</li>
		</ul>
	</section>

	<CommandPalette
		bind:open
		label="Greater playground command palette"
		inputLabel="Search pages and actions"
		placeholder="Type to search…"
		{groups}
		returnFocusTo={triggerEl}
		onselect={handleSelect}
	/>
</div>

<style>
	.page {
		max-width: 48rem;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			sans-serif;
		color: var(--gr-semantic-foreground-primary, #111827);
	}
	header {
		margin-bottom: 1.5rem;
	}
	h1 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
	}
	section {
		margin-top: 1.5rem;
	}
	button {
		font: inherit;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		border: 1px solid var(--gr-semantic-border-subtle, #e5e7eb);
		background: var(--gr-semantic-background-surface, #fff);
		cursor: pointer;
	}
	button:hover {
		background: var(--gr-semantic-background-secondary, #f3f4f6);
	}
	.last-selected {
		margin-top: 1rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		background: var(--gr-color-success-50, #f0fdf4);
		color: var(--gr-color-success-900, #14532d);
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.875em;
	}
</style>
