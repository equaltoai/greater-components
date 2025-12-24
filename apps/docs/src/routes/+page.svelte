<script lang="ts">
	import { getComponentStats } from '$lib/data/registry.js';

	const stats = getComponentStats();

	const features = [
		{
			title: 'Headless Architecture',
			description: 'Behavior-only primitives with zero styling. Bring your own design system.',
			icon: '🎨',
		},
		{
			title: 'ActivityPub Native',
			description: 'Purpose-built for Fediverse apps with protocol-aware components.',
			icon: '🌐',
		},
		{
			title: 'Svelte 5 Runes',
			description: 'Built with latest Svelte 5 reactivity for optimal performance.',
			icon: '⚡',
		},
		{
			title: 'TypeScript First',
			description: 'Full type safety with strict mode and comprehensive type definitions.',
			icon: '🔒',
		},
		{
			title: 'Lesser Integration',
			description: 'Native support for Lesser GraphQL API with all components you need.',
			icon: '🚀',
		},
		{
			title: 'Accessible by Default',
			description: 'WCAG 2.1 AA/AAA compliance with comprehensive ARIA support.',
			icon: '♿',
		},
	];

	const quickStart = `# Install CLI
# Replace \`greater-vX.Y.Z\` with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz

# Initialize in your project
cd my-sveltekit-app
greater init

# Add components
greater add timeline status notifications`;
</script>

<svelte:head>
	<title>Greater Components - ActivityPub UI for Svelte 5</title>
	<meta
		name="description"
		content="Production-ready ActivityPub and Lesser components for Svelte 5. Headless primitives, compound components, and adapters."
	/>
</svelte:head>

<div class="homepage">
	<section class="hero">
		<div class="hero-content">
			<h1 class="hero-title">
				<span class="gradient-text">Greater Components</span>
			</h1>
			<p class="hero-subtitle">Production-ready ActivityPub components for Svelte 5</p>
			<p class="hero-description">
				Headless primitives, compound components, and adapters for building world-class Fediverse
				applications. Copy-paste into your project for full control.
			</p>

			<div class="hero-actions">
				<a href="/components" class="btn btn-primary">Browse Components</a>
				<a href="#quick-start" class="btn btn-secondary">Get Started</a>
			</div>

			<div class="hero-stats">
				<div class="stat">
					<div class="stat-value">{stats.total}</div>
					<div class="stat-label">Components</div>
				</div>
				<div class="stat">
					<div class="stat-value">{stats.byType.primitive}</div>
					<div class="stat-label">Primitives</div>
				</div>
				<div class="stat">
					<div class="stat-value">{stats.byCategory.activitypub + stats.byCategory.lesser}</div>
					<div class="stat-label">ActivityPub</div>
				</div>
				<div class="stat">
					<div class="stat-value">100%</div>
					<div class="stat-label">Type Safe</div>
				</div>
			</div>
		</div>
	</section>

	<section class="features">
		<div class="container">
			<h2>Why Greater Components?</h2>
			<div class="features-grid">
				{#each features as feature, featureIndex (`${featureIndex}-${feature.title}`)}
					<div class="feature-card">
						<div class="feature-icon">{feature.icon}</div>
						<h3>{feature.title}</h3>
						<p>{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section id="quick-start" class="quick-start">
		<div class="container">
			<h2>Quick Start</h2>
			<p class="section-subtitle">Get up and running in 60 seconds</p>

			<div class="code-example">
				<div class="code-header">
					<span class="lang">bash</span>
					<button class="copy-btn" onclick={() => navigator.clipboard.writeText(quickStart)}>
						Copy
					</button>
				</div>
				<pre><code>{quickStart}</code></pre>
			</div>

			<div class="steps">
				<div class="step">
					<div class="step-number">1</div>
					<div class="step-content">
						<h3>Install CLI</h3>
						<p>Install the Greater CLI from GitHub Releases (or build from source)</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">2</div>
					<div class="step-content">
						<h3>Initialize Project</h3>
						<p>Run <code>greater init</code> to configure your project</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">3</div>
					<div class="step-content">
						<h3>Add Components</h3>
						<p>Copy components directly into your codebase</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="showcase">
		<div class="container">
			<h2>Component Categories</h2>
			<div class="categories">
				<a href="/components?category=headless" class="category-card">
					<div class="category-icon">⚙️</div>
					<h3>Headless Primitives</h3>
					<p>{stats.byCategory.headless} components</p>
					<span class="category-description"> Behavior-only components with zero styling </span>
				</a>

				<a href="/components?category=activitypub" class="category-card">
					<div class="category-icon">🌐</div>
					<h3>ActivityPub</h3>
					<p>{stats.byCategory.activitypub} components</p>
					<span class="category-description"> Timeline, status, notifications, and more </span>
				</a>

				<a href="/components?category=lesser" class="category-card">
					<div class="category-icon">🚀</div>
					<h3>Lesser Integration</h3>
					<p>{stats.byCategory.lesser} components</p>
					<span class="category-description"> Auth, profile, search, admin, and GraphQL </span>
				</a>

				<a href="/components?category=adapters" class="category-card">
					<div class="category-icon">🔌</div>
					<h3>Adapters</h3>
					<p>{stats.byCategory.adapters} components</p>
					<span class="category-description"> GraphQL client with caching and subscriptions </span>
				</a>
			</div>
		</div>
	</section>

	<section class="philosophy">
		<div class="container">
			<h2>Copy, Don't Install</h2>
			<p class="section-subtitle">Inspired by shadcn/ui, components live in your codebase</p>

			<div class="comparison">
				<div class="comparison-item">
					<h3>Traditional npm Package</h3>
					<ul class="comparison-list con">
						<li>Updates break your app</li>
						<li>Customization requires forking</li>
						<li>Bundle includes unused code</li>
						<li>Lock-in to maintainer decisions</li>
						<li>Black box implementation</li>
					</ul>
				</div>

				<div class="comparison-item">
					<h3>Greater CLI (Copy)</h3>
					<ul class="comparison-list pro">
						<li>Full control over updates</li>
						<li>Customize directly in place</li>
						<li>Perfect tree-shaking</li>
						<li>Zero lock-in</li>
						<li>Read and learn from code</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="cta">
		<div class="container">
			<h2>Ready to Build?</h2>
			<p>Start building your Fediverse app with Greater Components today.</p>
			<div class="cta-actions">
				<a href="/components" class="btn btn-primary btn-large">Browse Components</a>
				<a
					href="https://github.com/equaltoai/greater-components"
					class="btn btn-secondary btn-large"
				>
					View on GitHub
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	.homepage {
		min-height: 100vh;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	/* Hero Section */
	.hero {
		padding: 6rem 2rem 4rem;
		text-align: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.hero-content {
		max-width: 900px;
		margin: 0 auto;
	}

	.hero-title {
		font-size: 4rem;
		font-weight: 800;
		margin: 0 0 1rem 0;
		line-height: 1.1;
	}

	.gradient-text {
		background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
		opacity: 0.95;
	}

	.hero-description {
		font-size: 1.125rem;
		opacity: 0.9;
		margin: 0 0 2.5rem 0;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 3rem;
	}

	.btn {
		display: inline-block;
		padding: 0.875rem 2rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-primary {
		background: white;
		color: #667eea;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 2px solid white;
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.btn-large {
		padding: 1.125rem 2.5rem;
		font-size: 1.125rem;
	}

	.hero-stats {
		display: flex;
		gap: 3rem;
		justify-content: center;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.3);
	}

	.stat {
		text-align: center;
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: bold;
		display: block;
	}

	.stat-label {
		font-size: 0.875rem;
		opacity: 0.9;
	}

	/* Features Section */
	.features {
		padding: 5rem 0;
		background: var(--color-bg);
	}

	.features h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 3rem;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		padding: 2rem;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		background: var(--color-bg-card);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
	}

	.feature-card p {
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* Quick Start Section */
	.quick-start {
		padding: 5rem 0;
		background: var(--color-bg-muted);
	}

	.quick-start h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.section-subtitle {
		text-align: center;
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin-bottom: 3rem;
	}

	.code-example {
		max-width: 700px;
		margin: 0 auto 3rem auto;
		background: var(--color-bg-code);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--color-bg-code-header);
		border-bottom: 1px solid var(--color-border);
	}

	.lang {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--color-text-secondary);
		font-family: monospace;
	}

	.copy-btn {
		padding: 0.375rem 0.875rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background: var(--color-bg);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.copy-btn:hover {
		background: var(--color-bg-hover);
	}

	.code-example pre {
		margin: 0;
		padding: 1.5rem;
		overflow-x: auto;
	}

	.code-example code {
		font-family: 'Fira Code', 'Consolas', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.step {
		display: flex;
		gap: 1rem;
	}

	.step-number {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.step-content h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
	}

	.step-content p {
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.step-content code {
		background: var(--color-bg-code);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	/* Showcase Section */
	.showcase {
		padding: 5rem 0;
	}

	.showcase h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 3rem;
	}

	.categories {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.category-card {
		padding: 2rem;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		background: var(--color-bg-card);
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.category-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}

	.category-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.category-card h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.category-card p {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--color-primary);
		margin-bottom: 0.5rem;
	}

	.category-description {
		display: block;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	/* Philosophy Section */
	.philosophy {
		padding: 5rem 0;
		background: var(--color-bg-muted);
	}

	.philosophy h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.comparison {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.comparison-item {
		padding: 2rem;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		background: var(--color-bg-card);
	}

	.comparison-item h3 {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.comparison-list {
		list-style: none;
		padding: 0;
	}

	.comparison-list li {
		padding: 0.75rem 0;
		padding-left: 2rem;
		position: relative;
	}

	.comparison-list li::before {
		position: absolute;
		left: 0;
		font-weight: bold;
		font-size: 1.25rem;
	}

	.comparison-list.pro li::before {
		content: '✓';
		color: #10b981;
	}

	.comparison-list.con li::before {
		content: '✗';
		color: #ef4444;
	}

	/* CTA Section */
	.cta {
		padding: 5rem 0;
		text-align: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.cta h2 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.cta p {
		font-size: 1.25rem;
		opacity: 0.95;
		margin-bottom: 2rem;
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.hero {
			padding: 4rem 1rem 3rem;
		}

		.hero-title {
			font-size: 2.5rem;
		}

		.hero-subtitle {
			font-size: 1.25rem;
		}

		.hero-stats {
			gap: 1.5rem;
		}

		.features,
		.quick-start,
		.showcase,
		.philosophy,
		.cta {
			padding: 3rem 0;
		}

		.features h2,
		.quick-start h2,
		.showcase h2,
		.philosophy h2,
		.cta h2 {
			font-size: 2rem;
		}

		.hero-actions,
		.cta-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
