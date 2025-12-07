<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Alert, Button } from '@equaltoai/greater-components-primitives';
	import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from '@equaltoai/greater-components-icons';

	let showDismissible = $state(true);
	let showWithAction = $state(true);

	function handleDismiss() {
		showDismissible = false;
	}

	function handleAction() {
		alert('Action clicked!');
	}

	function resetDemos() {
		showDismissible = true;
		showWithAction = true;
	}

	const basicUsageCode = `<Alert variant="info" title="Information">
  This is an informational message.
</Alert>

<Alert variant="success" title="Success">
  Your changes have been saved.
</Alert>

<Alert variant="warning" title="Warning">
  Please review before continuing.
</Alert>

<Alert variant="error" title="Error">
  Something went wrong.
</Alert>`;

	const dismissibleCode = `<Alert 
  variant="info" 
  title="Dismissible Alert" 
  dismissible 
  onDismiss={handleDismiss}
>
  Click the X to dismiss this alert.
</Alert>`;

	const actionCode = `<Alert 
  variant="warning" 
  title="Action Required"
  actionLabel="View Details"
  onAction={handleAction}
>
  Your session will expire soon.
</Alert>`;

	const customIconCode = `<Alert variant="info" title="Custom Icon">
  {#snippet icon()}
    <StarIcon size={20} />
  {/snippet}
  This alert uses a custom icon.
</Alert>`;
</script>

<DemoPage
	eyebrow="Primitives"
	title="Alert Component"
	description="Versatile alert/banner component for displaying error, warning, success, and info messages with optional dismiss and action buttons."
>
	{#snippet actions()}
		<Button variant="outline" size="sm" onclick={resetDemos}>Reset Demos</Button>
	{/snippet}

	<section class="demo-section">
		<h2>Variants</h2>
		<p>Alert supports four semantic variants for different message types.</p>
		
		<div class="alert-stack">
			<Alert variant="info" title="Information">
				This is an informational message for general notices.
			</Alert>
			
			<Alert variant="success" title="Success">
				Your changes have been saved successfully.
			</Alert>
			
			<Alert variant="warning" title="Warning">
				Please review your input before continuing.
			</Alert>
			
			<Alert variant="error" title="Error">
				Something went wrong. Please try again.
			</Alert>
		</div>

		<CodeExample code={basicUsageCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Dismissible Alerts</h2>
		<p>Add a close button to allow users to dismiss the alert.</p>
		
		{#if showDismissible}
			<Alert 
				variant="info" 
				title="Dismissible Alert" 
				dismissible 
				onDismiss={handleDismiss}
			>
				Click the X button to dismiss this alert.
			</Alert>
		{:else}
			<p class="dismissed-message">Alert dismissed! <button onclick={() => showDismissible = true}>Show again</button></p>
		{/if}

		<CodeExample code={dismissibleCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Action Buttons</h2>
		<p>Include an action button for user interaction.</p>
		
		<Alert 
			variant="warning" 
			title="Session Expiring"
			actionLabel="Extend Session"
			onAction={handleAction}
		>
			Your session will expire in 5 minutes.
		</Alert>

		<CodeExample code={actionCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Without Title</h2>
		<p>Alerts can be used without a title for simpler messages.</p>
		
		<div class="alert-stack">
			<Alert variant="success">File uploaded successfully.</Alert>
			<Alert variant="error">Network connection lost.</Alert>
		</div>
	</section>

	<section class="demo-section">
		<h2>Accessibility</h2>
		<ul class="a11y-list">
			<li><strong>Role:</strong> Error and warning variants use <code>role="alert"</code>, success and info use <code>role="status"</code></li>
			<li><strong>Keyboard:</strong> Dismiss and action buttons are fully keyboard accessible</li>
			<li><strong>Screen readers:</strong> Alert content is announced appropriately based on variant</li>
			<li><strong>Focus:</strong> Focus is managed when alerts are dismissed</li>
		</ul>
	</section>
</DemoPage>

<style>
	.demo-section {
		margin-bottom: 3rem;
	}

	.demo-section h2 {
		margin-bottom: 0.5rem;
		font-size: var(--gr-typography-fontSize-xl);
	}

	.demo-section > p {
		margin-bottom: 1rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	.alert-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.dismissed-message {
		padding: 1rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-md);
		text-align: center;
	}

	.dismissed-message button {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: underline;
		background: none;
		border: none;
		cursor: pointer;
	}

	.a11y-list {
		list-style: disc;
		padding-left: 1.5rem;
	}

	.a11y-list li {
		margin-bottom: 0.5rem;
	}

	.a11y-list code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
		font-size: 0.875em;
	}
</style>