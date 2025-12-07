<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Spinner, LoadingState, Button } from '@equaltoai/greater-components-primitives';

	let showFullscreen = $state(false);

	function toggleFullscreen() {
		showFullscreen = true;
		setTimeout(() => {
			showFullscreen = false;
		}, 2000);
	}

	const sizesCode = `<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`;

	const colorsCode = `<Spinner color="primary" />
<Spinner color="current" />
<Spinner color="white" />
<Spinner color="gray" />`;

	const loadingStateCode = `<LoadingState message="Loading your data..." />

<LoadingState size="lg" message="Please wait...">
  <p>Custom content below spinner</p>
</LoadingState>`;

	const fullscreenCode = `<LoadingState 
  fullscreen 
  size="lg" 
  message="Loading application..." 
/>`;

	const buttonLoadingCode = `<Button disabled>
  <Spinner size="sm" color="current" />
  Loading...
</Button>`;
</script>

<DemoPage
	eyebrow="Primitives"
	title="Spinner & LoadingState"
	description="Accessible loading indicators with configurable size, color, and wrapper support for loading states."
>
	<section class="demo-section">
		<h2>Spinner Sizes</h2>
		<p>Five size options from extra-small (12px) to extra-large (48px).</p>
		
		<div class="spinner-row">
			<div class="spinner-item">
				<Spinner size="xs" />
				<span>xs (12px)</span>
			</div>
			<div class="spinner-item">
				<Spinner size="sm" />
				<span>sm (16px)</span>
			</div>
			<div class="spinner-item">
				<Spinner size="md" />
				<span>md (24px)</span>
			</div>
			<div class="spinner-item">
				<Spinner size="lg" />
				<span>lg (32px)</span>
			</div>
			<div class="spinner-item">
				<Spinner size="xl" />
				<span>xl (48px)</span>
			</div>
		</div>

		<CodeExample code={sizesCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Spinner Colors</h2>
		<p>Four color options for different contexts and backgrounds.</p>
		
		<div class="spinner-row">
			<div class="spinner-item">
				<Spinner color="primary" />
				<span>primary</span>
			</div>
			<div class="spinner-item">
				<Spinner color="gray" />
				<span>gray</span>
			</div>
			<div class="spinner-item" style="color: #3b82f6;">
				<Spinner color="current" />
				<span>current</span>
			</div>
			<div class="spinner-item dark-bg">
				<Spinner color="white" />
				<span>white</span>
			</div>
		</div>

		<CodeExample code={colorsCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>LoadingState Component</h2>
		<p>Wrapper component that combines Spinner with optional message and layout.</p>
		
		<div class="loading-demos">
			<div class="loading-demo-item">
				<LoadingState message="Loading your data..." />
			</div>
			<div class="loading-demo-item">
				<LoadingState size="lg" message="Please wait while we process your request..." />
			</div>
		</div>

		<CodeExample code={loadingStateCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Fullscreen Overlay</h2>
		<p>LoadingState can display as a fullscreen overlay for page-level loading.</p>
		
		<Button onclick={toggleFullscreen}>
			Show Fullscreen Loading (2s)
		</Button>

		{#if showFullscreen}
			<LoadingState 
				fullscreen 
				size="lg" 
				message="Loading application..." 
			/>
		{/if}

		<CodeExample code={fullscreenCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Button Loading State</h2>
		<p>Use Spinner inside buttons to indicate loading actions.</p>
		
		<div class="button-row">
			<Button disabled>
				<Spinner size="sm" color="current" />
				<span>Loading...</span>
			</Button>
			<Button variant="outline" disabled>
				<Spinner size="sm" color="current" />
				<span>Saving...</span>
			</Button>
		</div>

		<CodeExample code={buttonLoadingCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Accessibility</h2>
		<ul class="a11y-list">
			<li><strong>Role:</strong> Uses <code>role="status"</code> for screen reader announcements</li>
			<li><strong>ARIA:</strong> Includes <code>aria-live="polite"</code> and <code>aria-busy="true"</code></li>
			<li><strong>Label:</strong> Customizable accessible label (default: "Loading")</li>
			<li><strong>Motion:</strong> Respects <code>prefers-reduced-motion</code> preference</li>
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

	.spinner-row {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: flex-end;
		margin-bottom: 1rem;
		padding: 1.5rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
	}

	.spinner-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.spinner-item span {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.spinner-item.dark-bg {
		background: var(--gr-color-gray-900);
		padding: 1rem;
		border-radius: var(--gr-radii-md);
	}

	.spinner-item.dark-bg span {
		color: white;
	}

	.loading-demos {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 1rem;
	}

	.loading-demo-item {
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		min-height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button-row {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.button-row :global(button) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
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