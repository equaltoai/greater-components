<script lang="ts">
	import {
		Button,
		Modal,
		SimpleMenu,
		Card,
		Container,
		Section,
		Heading,
		Text,
	} from '@equaltoai/greater-components-primitives';
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

		<SimpleMenu items={menuItems} onItemSelect={handleMenuSelect}>
			{#snippet trigger({ open, toggle })}
				<Button variant="outline" data-testid="menu-trigger" aria-expanded={open} onclick={toggle}>
					{open ? 'Close menu' : 'Open menu'}
				</Button>
			{/snippet}
		</SimpleMenu>

		<p data-testid="menu-selection" class="status">
			Last selection: {lastSelection}
		</p>
	</section>

	<section data-testid="card-demo">
		<div class="section-header">
			<h2>Card</h2>
			<p>Demonstrates card variants and slots.</p>
		</div>

		<div class="demo-row">
			<Card variant="elevated" style="width: 300px;" hoverable clickable>
				{#snippet header()}
					<h3 style="margin: 0;">Elevated Card</h3>
				{/snippet}
				<p>This is an elevated, clickable card content.</p>
				{#snippet footer()}
					<Button size="sm">Action</Button>
				{/snippet}
			</Card>

			<Card variant="outlined" style="width: 300px;">
				{#snippet header()}
					<h3 style="margin: 0;">Outlined Card</h3>
				{/snippet}
				<p>This is an outlined card content.</p>
			</Card>
		</div>
	</section>

	<section data-testid="container-demo">
		<div class="section-header">
			<h2>Container</h2>
			<p>Demonstrates max-width centering constraints.</p>
		</div>

		<Container maxWidth="md" class="demo-container">
			<p>This content is centered with max-width: md (768px).</p>
		</Container>

		<Container maxWidth="sm" class="demo-container" style="margin-top: 1rem;">
			<p>This content is centered with max-width: sm (640px).</p>
		</Container>
	</section>

	<section data-testid="section-demo">
		<div class="section-header">
			<h2>Section</h2>
			<p>Semantic wrappers with vertical spacing consistency.</p>
		</div>

		<div style="border: 1px solid var(--gr-semantic-border-subtle);">
			<Section spacing="sm" class="demo-section-inner">
				<p>Section with 'sm' spacing (2rem margin top/bottom).</p>
			</Section>
			<hr />
			<Section spacing="lg" class="demo-section-inner">
				<p>Section with 'lg' spacing (6rem margin top/bottom).</p>
			</Section>
		</div>
	</section>

	<section data-testid="heading-demo">
		<div class="section-header">
			<h2>Heading</h2>
			<p>Semantic levels with decoupled visual sizing.</p>
		</div>

		<div class="demo-headings">
			<Heading level={1}>H1 Heading (Default Size)</Heading>
			<Heading level={2}>H2 Heading (Default Size)</Heading>
			<Heading level={3} size="xl">H3 with XL Size</Heading>
			<Heading level={4} align="center">H4 Center Aligned</Heading>
		</div>
	</section>

	<section data-testid="text-demo">
		<div class="section-header">
			<h2>Text</h2>
			<p>Body text variants with truncation support.</p>
		</div>

		<div class="demo-texts">
			<Text>Standard body text (size: base, weight: normal, color: primary).</Text>
			<Text size="sm" color="secondary">Small secondary text for metadata or captions.</Text>
			<Text size="lg" weight="medium">Large medium text for emphasis.</Text>
			<Text color="success" weight="bold">Success Text</Text>
			<Text color="error" align="right">Error Text (Right Aligned)</Text>

			<div class="truncation-demo">
				<Text truncate>
					Truncated text: This is a very long line of text that should be truncated with an ellipsis
					because it exceeds the width of its container.
				</Text>
				<Text truncate lines={2}>
					Multi-line truncation (2 lines): This is a long paragraph that is intended to demonstrate
					multi-line truncation. It should clamp after two lines of text, showing an ellipsis at the
					end of the second line. This is very useful for card descriptions or preview text where
					space is limited.
				</Text>
			</div>
		</div>
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

	:global(.demo-container) {
		background-color: var(--gr-semantic-background-secondary);
		border: 1px dashed var(--gr-semantic-border-default);
		padding-top: 1rem;
		padding-bottom: 1rem;
		text-align: center;
	}

	:global(.demo-section-inner) {
		background-color: var(--gr-semantic-background-secondary);
		padding: 1rem;
		text-align: center;
	}

	.demo-headings {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid var(--gr-semantic-border-subtle);
		padding: 1.5rem;
		border-radius: var(--gr-radii-lg);
	}

	.demo-texts {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid var(--gr-semantic-border-subtle);
		padding: 1.5rem;
		border-radius: var(--gr-radii-lg);
	}

	.truncation-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 300px;
		padding: 1rem;
		background-color: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-md);
	}
</style>
