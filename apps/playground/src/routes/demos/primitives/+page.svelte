<script lang="ts">
	import { Button, Modal, Menu } from '@equaltoai/greater-components-primitives';
	import DemoPage from '$lib/components/DemoPage.svelte';

	type MenuItem = {
		id: string;
		label: string;
		disabled?: boolean;
	};

	const menuItems: MenuItem[] = [
		{ id: 'profile-overview', label: 'Profile Overview' },
		{ id: 'security-logins', label: 'Security Logins' },
		{ id: 'notification-prefs', label: 'Notification Preferences', disabled: true },
		{ id: 'billing-plan', label: 'Billing Plan' },
	];

	let primaryClicks = $state(0);
	let modalOpen = $state(false);
	let lastSelection = $state('Nothing selected');

	function handleMenuSelect(item: MenuItem) {
		lastSelection = item.label;
	}
</script>

<DemoPage
	eyebrow="Component Demos"
	title="Validate Primitives Interactively"
	description="These demos power our automated Playwright suites. Explore them locally before running the tests to understand the expected behavior."
>
	<section data-testid="button-demo">
		<div class="section-header">
			<h2>Buttons</h2>
			<p>Demonstrates enabled vs disabled states plus click counters.</p>
		</div>

		<div class="demo-row">
			<Button data-testid="primary-button" onclick={() => primaryClicks++}>Primary Action</Button>
			<Button variant="outline" disabled data-testid="disabled-button">Disabled Action</Button>
		</div>
		<p data-testid="button-click-count" class="status">
			Primary button clicked {primaryClicks}
			{primaryClicks === 1 ? 'time' : 'times'}
		</p>
	</section>

	<section data-testid="modal-demo">
		<div class="section-header">
			<h2>Modal</h2>
			<p>Opens an accessible dialog with focus management.</p>
		</div>

		<Button variant="solid" data-testid="open-modal-button" onclick={() => (modalOpen = true)}>
			Open Demo Modal
		</Button>

		<Modal bind:open={modalOpen} title="Demo Modal">
			<p data-testid="modal-body">
				This modal showcases focus trapping, keyboard dismissal via ESC, and footer actions.
			</p>

			{#snippet footer()}
				<div class="modal-actions">
					<Button
						variant="ghost"
						data-testid="close-modal-button"
						onclick={() => (modalOpen = false)}
					>
						Close
					</Button>
				</div>
			{/snippet}
		</Modal>
	</section>

	<section data-testid="menu-demo">
		<div class="section-header">
			<h2>Menu</h2>
			<p>Verifies typeahead, keyboard navigation, and selection callbacks.</p>
		</div>

		<Menu items={menuItems} onItemSelect={handleMenuSelect}>
			{#snippet trigger({ open, toggle })}
				<Button variant="outline" data-testid="menu-trigger" aria-expanded={open} onclick={toggle}>
					{open ? 'Close menu' : 'Open menu'}
				</Button>
			{/snippet}
		</Menu>

		<p data-testid="menu-selection" class="status">
			Last selection: {lastSelection}
		</p>
	</section>
</DemoPage>

<style>
	section {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 2rem;
		background: var(--gr-semantic-background-primary);
		box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
	}

	.section-header {
		margin-bottom: 1.5rem;
	}

	.section-header h2 {
		margin: 0 0 0.25rem 0;
	}

	.demo-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.status {
		margin-top: 1rem;
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-secondary);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
</style>
