<script lang="ts">
	import { page } from '$app/stores';
	import { getComponentBySlug } from '$lib/data/registry.js';
	import type { Component } from '$lib/data/registry.js';

	const component = $derived<Component | undefined>(getComponentBySlug($page.params.slug ?? ''));

	let selectedExample = $state(0);
	let copiedCode = $state(false);

	function copyCode(code: string) {
		navigator.clipboard.writeText(code);
		copiedCode = true;
		setTimeout(() => (copiedCode = false), 2000);
	}

	function installCommand(pkg: string) {
		return `npx @equaltoai/greater-components-cli add ${pkg}`;
	}
</script>

<svelte:head>
	{#if component}
		<title>{component.name} - Greater Components</title>
		<meta name="description" content={component.description} />
	{:else}
		<title>Component Not Found - Greater Components</title>
	{/if}
</svelte:head>

{#if !component}
	<div class="not-found">
		<h1>Component Not Found</h1>
		<p>The component "{$page.params.slug}" does not exist.</p>
		<a href="/components">← Back to Components</a>
	</div>
{:else}
	<div class="component-detail">
		<header class="detail-header">
			<div class="breadcrumb">
				<a href="/components">Components</a>
				<span>/</span>
				<span>{component.name}</span>
			</div>

			<div class="header-content">
				<div class="title-section">
					<h1>{component.name}</h1>
					<div class="badges">
						<span class="badge type-{component.type}">{component.type}</span>
						<span class="badge category-{component.category}">{component.category}</span>
						<span class="badge status-{component.status}">{component.status}</span>
						<span class="badge wcag">WCAG {component.accessibility.wcag}</span>
					</div>
				</div>

				<p class="description">{component.longDescription}</p>

				<div class="install-section">
					<div class="install-code">
						<code>{installCommand(component.npm.package)}</code>
					</div>
					<button class="copy-btn" onclick={() => copyCode(installCommand(component.npm.package))}>
						{copiedCode ? 'Copied!' : 'Copy'}
					</button>
				</div>
			</div>
		</header>

		<div class="detail-content">
			<aside class="sidebar">
				<nav class="toc">
					<h3>On This Page</h3>
					<ul>
						<li><a href="#features">Features</a></li>
						<li><a href="#examples">Examples</a></li>
						{#if component.api}
							<li><a href="#api">API Reference</a></li>
						{/if}
						<li><a href="#installation">Installation</a></li>
						<li><a href="#accessibility">Accessibility</a></li>
					</ul>
				</nav>

				<div class="meta-info">
					<h3>Package Info</h3>
					<dl>
						<dt>Package</dt>
						<dd><code>{component.npm.package}</code></dd>

						<dt>Version</dt>
						<dd>{component.npm.version}</dd>

						{#if component.bundleSize}
							<dt>Bundle Size</dt>
							<dd>
								<span title="Gzipped">{component.bundleSize.gzipped}</span>
							</dd>
						{/if}

						<dt>Dependencies</dt>
						<dd>
							{#if component.dependencies.length > 0}
								<ul class="dep-list">
									{#each component.dependencies as dep, depIndex (`${component.slug}-dep-${depIndex}-${dep}`)}
										<li><code>{dep}</code></li>
									{/each}
								</ul>
							{:else}
								None
							{/if}
						</dd>

						{#if component.registryDependencies.length > 0}
							<dt>Components</dt>
							<dd>
								<ul class="dep-list">
									{#each component.registryDependencies as dep, depIndex (`${component.slug}-registry-${depIndex}-${dep}`)}
										<li><a href="/components/{dep}">{dep}</a></li>
									{/each}
								</ul>
							</dd>
						{/if}
					</dl>
				</div>
			</aside>

			<main class="main-content">
				<section id="features">
					<h2>Features</h2>
					<ul class="features-list">
						{#each component.features as feature, featureIndex (`${component.slug}-feature-${featureIndex}-${feature}`)}
							<li>{feature}</li>
						{/each}
					</ul>
				</section>

				<section id="examples">
					<h2>Examples</h2>

					{#if component.examples.length > 1}
						<div class="example-tabs">
							{#each component.examples as example, i (`${component.slug}-tab-${i}-${example.name}`)}
								<button
									class="example-tab"
									class:active={selectedExample === i}
									onclick={() => (selectedExample = i)}
								>
									{example.name}
								</button>
							{/each}
						</div>
					{/if}

					{#each component.examples as example, i (`${component.slug}-example-${i}-${example.name}`)}
						{#if selectedExample === i}
							<div class="example">
								<h3>{example.name}</h3>
								<p class="example-description">{example.description}</p>

								<div class="code-block">
									<div class="code-header">
										<span class="lang">svelte</span>
										<button class="copy-btn" onclick={() => copyCode(example.code)}>
											{copiedCode ? 'Copied!' : 'Copy'}
										</button>
									</div>
									<pre><code>{example.code}</code></pre>
								</div>
							</div>
						{/if}
					{/each}
				</section>

				{#if component.api}
					<section id="api">
						<h2>API Reference</h2>

						{#if component.api.props}
							<h3>Props</h3>
							<div class="api-table">
								<table>
									<thead>
										<tr>
											<th>Name</th>
											<th>Type</th>
											<th>Default</th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										{#each component.api.props as prop, propIndex (`${component.slug}-prop-${propIndex}-${prop.name}`)}
											<tr>
												<td>
													<code>{prop.name}</code>
													{#if prop.required}
														<span class="required">*</span>
													{/if}
												</td>
												<td><code>{prop.type}</code></td>
												<td>{prop.default ? `<code>${prop.default}</code>` : '—'}</td>
												<td>{prop.description}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}

						{#if component.api.events}
							<h3>Events</h3>
							<div class="api-table">
								<table>
									<thead>
										<tr>
											<th>Name</th>
											<th>Payload</th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										{#each component.api.events as event, eventIndex (`${component.slug}-event-${eventIndex}-${event.name}`)}
											<tr>
												<td><code>{event.name}</code></td>
												<td>{event.payload ? `<code>${event.payload}</code>` : '—'}</td>
												<td>{event.description}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}

						{#if component.api.slots}
							<h3>Slots</h3>
							<div class="api-table">
								<table>
									<thead>
										<tr>
											<th>Name</th>
											<th>Props</th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										{#each component.api.slots as slot, slotIndex (`${component.slug}-slot-${slotIndex}-${slot.name}`)}
											<tr>
												<td><code>{slot.name}</code></td>
												<td>{slot.props ? `<code>${slot.props}</code>` : '—'}</td>
												<td>{slot.description}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</section>
				{/if}

				<section id="installation">
					<h2>Installation</h2>

					<h3>Using the CLI (Recommended)</h3>
					<p>Add the component directly to your project with full source code:</p>
					<div class="code-block">
						<pre><code>{installCommand(component.npm.package)}</code></pre>
					</div>

					<h3>Manual Installation</h3>
					<p>Install from npm:</p>
					<div class="code-block">
						<pre><code>npm install {component.npm.package}</code></pre>
					</div>

					<p>Then import in your components:</p>
					<div class="code-block">
						<pre><code>import {'{'} {component.name} {'}'} from '{component.npm.package}';</code
							></pre>
					</div>
				</section>

				<section id="accessibility">
					<h2>Accessibility</h2>
					<p>
						This component meets <strong>WCAG {component.accessibility.wcag}</strong> standards.
					</p>

					<h3>Accessibility Features</h3>
					<ul class="features-list">
						{#each component.accessibility.features as feature, featureIndex (`${component.slug}-a11y-${featureIndex}-${feature}`)}
							<li>{feature}</li>
						{/each}
					</ul>
				</section>
			</main>
		</div>
	</div>
{/if}

<style>
	.not-found {
		max-width: 600px;
		margin: 4rem auto;
		text-align: center;
		padding: 2rem;
	}

	.not-found a {
		display: inline-block;
		margin-top: 2rem;
		color: var(--color-primary);
	}

	.component-detail {
		max-width: 1400px;
		margin: 0 auto;
	}

	.detail-header {
		padding: 2rem;
		border-bottom: 1px solid var(--color-border);
	}

	.breadcrumb {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.breadcrumb a {
		color: var(--color-primary);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.header-content {
		max-width: 800px;
	}

	.title-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.detail-header h1 {
		font-size: 2.5rem;
		margin: 0;
	}

	.badges {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.badge {
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.type-primitive {
		background: #e0f2fe;
		color: #0369a1;
	}

	.type-compound {
		background: #fef3c7;
		color: #92400e;
	}

	.type-pattern {
		background: #ddd6fe;
		color: #5b21b6;
	}

	.type-adapter {
		background: #d1fae5;
		color: #065f46;
	}

	.category-headless {
		background: #f0f9ff;
		color: #0c4a6e;
	}

	.category-activitypub {
		background: #f0fdf4;
		color: #14532d;
	}

	.category-lesser {
		background: #fef2f2;
		color: #991b1b;
	}

	.category-adapters {
		background: #faf5ff;
		color: #6b21a8;
	}

	.status-stable {
		background: #d1fae5;
		color: #065f46;
	}

	.status-beta {
		background: #fef3c7;
		color: #92400e;
	}

	.wcag {
		background: #e0e7ff;
		color: #3730a3;
	}

	.description {
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin: 1rem 0 2rem 0;
	}

	.install-section {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.install-code {
		flex: 1;
		padding: 1rem;
		background: var(--color-bg-code);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.copy-btn {
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-bg);
		cursor: pointer;
		transition: all 0.2s;
	}

	.copy-btn:hover {
		background: var(--color-bg-hover);
	}

	.detail-content {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 3rem;
		padding: 2rem;
	}

	.sidebar {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.toc h3,
	.meta-info h3 {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-secondary);
		margin-bottom: 1rem;
	}

	.toc ul {
		list-style: none;
		padding: 0;
	}

	.toc li {
		margin-bottom: 0.5rem;
	}

	.toc a {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
	}

	.toc a:hover {
		color: var(--color-primary);
	}

	.meta-info {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}

	.meta-info dl {
		font-size: 0.875rem;
	}

	.meta-info dt {
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.25rem;
	}

	.meta-info dd {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.dep-list {
		list-style: none;
		padding: 0;
	}

	.dep-list li {
		margin-top: 0.25rem;
	}

	.main-content {
		max-width: 800px;
	}

	.main-content section {
		margin-bottom: 3rem;
	}

	.main-content h2 {
		font-size: 1.75rem;
		margin-bottom: 1rem;
	}

	.main-content h3 {
		font-size: 1.25rem;
		margin: 1.5rem 0 1rem 0;
	}

	.features-list {
		list-style: none;
		padding: 0;
	}

	.features-list li {
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
		position: relative;
	}

	.features-list li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-success);
		font-weight: bold;
	}

	.example-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.example-tab {
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.example-tab.active {
		border-bottom-color: var(--color-primary);
		color: var(--color-primary);
	}

	.example {
		margin-bottom: 2rem;
	}

	.example-description {
		color: var(--color-text-secondary);
		margin-bottom: 1rem;
	}

	.code-block {
		position: relative;
		background: var(--color-bg-code);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		overflow: hidden;
		margin: 1rem 0;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-bg-code-header);
	}

	.lang {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--color-text-secondary);
		font-family: monospace;
	}

	.code-block pre {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
	}

	.code-block code {
		font-family: 'Fira Code', 'Consolas', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.api-table {
		overflow-x: auto;
		margin: 1rem 0;
	}

	.api-table table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.api-table th,
	.api-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border);
	}

	.api-table th {
		font-weight: 600;
		background: var(--color-bg-muted);
	}

	.api-table code {
		background: var(--color-bg-code);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
	}

	.required {
		color: var(--color-error);
		font-weight: bold;
	}

	@media (max-width: 1024px) {
		.detail-content {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}
	}

	@media (max-width: 768px) {
		.detail-header {
			padding: 1rem;
		}

		.detail-header h1 {
			font-size: 2rem;
		}

		.title-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.detail-content {
			padding: 1rem;
		}

		.sidebar {
			grid-template-columns: 1fr;
		}

		.install-section {
			flex-direction: column;
		}

		.copy-btn {
			width: 100%;
		}
	}
</style>
