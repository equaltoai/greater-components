<script lang="ts">
	import { goto } from '$app/navigation';
	import RocketIcon from '@greater/icons/icons/zap.svelte';
	import BookIcon from '@greater/icons/icons/book.svelte';
	import PackageIcon from '@greater/icons/icons/package.svelte';
	import AccessibilityIcon from '@greater/icons/icons/eye.svelte';
</script>

<svelte:head>
	<title>Greater Components - Modern Component Library</title>
	<meta name="description" content="A comprehensive design system and component library for modern web applications built with Svelte 5." />
</svelte:head>

<div class="home-page">
	<section class="hero">
		<div class="hero-content">
			<h1>Greater Components</h1>
			<p class="hero-subtitle">
				A comprehensive design system and component library for modern web applications. 
				Built with Svelte 5, TypeScript, and a focus on accessibility.
			</p>
			<div class="hero-actions">
				<button class="btn-primary" on:click={() => goto('/installation')}>
					Get Started
				</button>
				<button class="btn-secondary" on:click={() => goto('/components')}>
					Browse Components
				</button>
			</div>
			<div class="hero-code">
				<code>npm install @greater/primitives</code>
			</div>
		</div>
	</section>
	
	<section class="features">
		<div class="features-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<RocketIcon size={24} />
				</div>
				<h3>Built for Svelte 5</h3>
				<p>Leveraging the latest Svelte 5 features including runes, snippets, and enhanced reactivity for optimal performance.</p>
			</div>
			
			<div class="feature-card">
				<div class="feature-icon">
					<AccessibilityIcon size={24} />
				</div>
				<h3>Accessibility First</h3>
				<p>WCAG AA compliant components with full keyboard navigation, screen reader support, and focus management.</p>
			</div>
			
			<div class="feature-card">
				<div class="feature-icon">
					<PackageIcon size={24} />
				</div>
				<h3>Modular Architecture</h3>
				<p>Tree-shakeable components organized in logical packages. Use only what you need, nothing more.</p>
			</div>
			
			<div class="feature-card">
				<div class="feature-icon">
					<BookIcon size={24} />
				</div>
				<h3>Comprehensive Docs</h3>
				<p>Detailed documentation with live examples, API references, and accessibility guidelines for every component.</p>
			</div>
		</div>
	</section>
	
	<section class="packages">
		<h2>Available Packages</h2>
		<div class="packages-grid">
			<a href="/components" class="package-card">
				<h3>@greater/primitives</h3>
				<p>Core UI components like Button, Modal, Tooltip, and more.</p>
				<span class="package-version">v0.1.0</span>
			</a>
			
			<a href="/components#fediverse" class="package-card">
				<h3>@greater/fediverse</h3>
				<p>Specialized components for social platforms and ActivityPub.</p>
				<span class="package-version">v0.1.0</span>
			</a>
			
			<a href="/tokens" class="package-card">
				<h3>@greater/tokens</h3>
				<p>Design tokens for consistent theming across your application.</p>
				<span class="package-version">v0.1.0</span>
			</a>
			
			<a href="/api/utilities" class="package-card">
				<h3>@greater/utils</h3>
				<p>Utility functions for common tasks and helpers.</p>
				<span class="package-version">v0.1.0</span>
			</a>
			
			<a href="/api/adapters" class="package-card">
				<h3>@greater/adapters</h3>
				<p>Platform adapters for Mastodon, Bluesky, and more.</p>
				<span class="package-version">v0.1.0</span>
			</a>
			
			<a href="/guides/icons" class="package-card">
				<h3>@greater/icons</h3>
				<p>Comprehensive icon library with 200+ optimized SVG icons.</p>
				<span class="package-version">v0.1.0</span>
			</a>
		</div>
	</section>
	
	<section class="quick-start">
		<h2>Quick Start</h2>
		<div class="quick-start-content">
			<div class="step">
				<div class="step-number">1</div>
				<div class="step-content">
					<h3>Install the packages</h3>
					<code>npm install @greater/primitives @greater/tokens</code>
				</div>
			</div>
			
			<div class="step">
				<div class="step-number">2</div>
				<div class="step-content">
					<h3>Import components</h3>
					<code>import {'{ Button, Modal }'} from '@greater/primitives';</code>
				</div>
			</div>
			
			<div class="step">
				<div class="step-number">3</div>
				<div class="step-content">
					<h3>Use in your app</h3>
					<code>&lt;Button variant="primary" on:click={'{handleClick}'}&gt;Click me&lt;/Button&gt;</code>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.home-page {
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.hero {
		text-align: center;
		padding: 4rem 0;
		border-bottom: 1px solid var(--doc-border);
	}
	
	.hero-content h1 {
		font-size: 3.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.hero-subtitle {
		font-size: 1.25rem;
		opacity: 0.8;
		max-width: 600px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}
	
	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}
	
	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 500;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}
	
	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
	}
	
	.btn-secondary {
		background: var(--doc-surface-secondary);
		color: var(--doc-text);
		border: 1px solid var(--doc-border);
	}
	
	.btn-secondary:hover {
		background: var(--doc-surface-tertiary);
	}
	
	.hero-code {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--doc-surface-secondary);
		border-radius: 0.5rem;
		font-family: var(--font-mono);
	}
	
	.features {
		padding: 4rem 0;
	}
	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}
	
	.feature-card {
		text-align: center;
		padding: 2rem;
	}
	
	.feature-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 1rem;
		margin-bottom: 1rem;
	}
	
	.feature-card h3 {
		margin-bottom: 0.5rem;
	}
	
	.feature-card p {
		opacity: 0.8;
		line-height: 1.6;
	}
	
	.packages {
		padding: 4rem 0;
		border-top: 1px solid var(--doc-border);
	}
	
	.packages h2 {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.packages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	
	.package-card {
		display: block;
		padding: 1.5rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		border-radius: 0.5rem;
		text-decoration: none;
		color: var(--doc-text);
		transition: all 0.2s;
	}
	
	.package-card:hover {
		border-color: var(--doc-link);
		transform: translateY(-2px);
		box-shadow: var(--doc-shadow-md);
	}
	
	.package-card h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--doc-link);
	}
	
	.package-card p {
		margin-bottom: 1rem;
		opacity: 0.8;
	}
	
	.package-version {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: var(--doc-bg);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}
	
	.quick-start {
		padding: 4rem 0;
		border-top: 1px solid var(--doc-border);
	}
	
	.quick-start h2 {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.quick-start-content {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.step {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 50%;
		font-weight: 600;
		flex-shrink: 0;
	}
	
	.step-content {
		flex: 1;
	}
	
	.step-content h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}
	
	.step-content code {
		display: block;
		padding: 0.75rem;
		background: var(--doc-surface-secondary);
		border-radius: 0.375rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
	}
	
	@media (max-width: 768px) {
		.hero-content h1 {
			font-size: 2.5rem;
		}
		
		.hero-actions {
			flex-direction: column;
			align-items: center;
		}
		
		.packages-grid {
			grid-template-columns: 1fr;
		}
	}
</style>