<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
	import AlertCircleIcon from '@equaltoai/greater-components-icons/icons/alert-circle.svelte';
</script>

<svelte:head>
	<title>Installation - Greater Components</title>
	<meta
		name="description"
		content="Learn how to install and set up Greater Components in your Svelte application."
	/>
</svelte:head>

<article class="installation-page">
	<h1>Installation</h1>
	<p class="lead">Get started with Greater Components in your Svelte application.</p>

	<section>
		<h2>Prerequisites</h2>
		<ul>
			<li>Node.js 18.0 or later</li>
			<li>Svelte 5.0 or later (for optimal compatibility)</li>
			<li>TypeScript 5.0 or later (optional but recommended)</li>
		</ul>
	</section>

	<section>
		<h2>Package Installation</h2>

		<h3>Using npm</h3>
		<CodeExample
			language="bash"
			code={`npm install @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens`}
		/>

		<h3>Using pnpm</h3>
		<CodeExample
			language="bash"
			code={`pnpm add @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens`}
		/>

		<h3>Using yarn</h3>
		<CodeExample
			language="bash"
			code={`yarn add @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens`}
		/>
	</section>

	<section>
		<h2>Individual Packages</h2>
		<p>You can install packages individually based on your needs:</p>

		<div class="package-list">
			<div class="package-item">
				<h4>Core Components</h4>
				<CodeExample
					language="bash"
					code={`npm install @equaltoai/greater-components-primitives`}
				/>
				<p>Essential UI components like Button, Modal, TextField, etc.</p>
			</div>

			<div class="package-item">
				<h4>Design Tokens</h4>
				<CodeExample language="bash" code={`npm install @equaltoai/greater-components-tokens`} />
				<p>Design tokens for theming and consistent styling.</p>
			</div>

			<div class="package-item">
				<h4>Icons</h4>
				<CodeExample language="bash" code={`npm install @equaltoai/greater-components-icons`} />
				<p>Comprehensive icon library with 200+ SVG icons.</p>
			</div>

			<div class="package-item">
				<h4>Fediverse Components</h4>
				<CodeExample language="bash" code={`npm install @equaltoai/greater-components-social`} />
				<p>Specialized components for social platforms.</p>
			</div>

			<div class="package-item">
				<h4>Utilities</h4>
				<CodeExample language="bash" code={`npm install @equaltoai/greater-components-utils`} />
				<p>Helper functions and utilities.</p>
			</div>
		</div>
	</section>

	<section>
		<h2>Basic Setup</h2>

		<h3>1. Import the CSS tokens</h3>
		<p>Add the token imports (theme + high contrast) to your global CSS file or app layout:</p>
		<CodeExample
			language="css"
			title="app.css"
			code={`/* Import design tokens */
@import '@equaltoai/greater-components-tokens/theme.css';
@import '@equaltoai/greater-components-tokens/high-contrast.css';`}
		/>

		<h3>2. Set up the Theme Provider</h3>
		<p>Wrap your app with the ThemeProvider for theme management:</p>
		<CodeExample
			language="svelte"
			title="+layout.svelte"
			code={`<script>
  import { ThemeProvider } from '@equaltoai/greater-components-primitives';
<` +
				`/script>

<ThemeProvider>
  <slot />
</ThemeProvider>`}
		/>

		<h3>3. Use components</h3>
		<p>Import and use components in your Svelte files:</p>
		<CodeExample
			language="svelte"
			title="MyComponent.svelte"
			code={`<script>
  import { Button, TextField, Modal } from '@equaltoai/greater-components-primitives';
  
  let showModal = false;
<` +
				`/script>

<Button on:click={() => showModal = true}>
  Open Modal
</Button>

<Modal bind:open={showModal}>
  <h2 slot="header">Welcome!</h2>
  <p>This is a modal from Greater Components.</p>
</Modal>`}
		/>
	</section>

	<section>
		<h2>TypeScript Setup</h2>
		<p>Greater Components is written in TypeScript and provides full type definitions.</p>

		<h3>Configure TypeScript</h3>
		<p>Ensure your <code>tsconfig.json</code> includes the following:</p>
		<CodeExample
			language="json"
			title="tsconfig.json"
			code={`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`}
		/>

		<h3>Type imports</h3>
		<p>Import types alongside components:</p>
		<CodeExample
			language="typescript"
			code={`import { Button, type ButtonProps } from '@equaltoai/greater-components-primitives';
import type { ThemeConfig } from '@equaltoai/greater-components-tokens';`}
		/>
	</section>

	<section>
		<h2>Vite Configuration</h2>
		<p>
			If you're using Vite, no additional configuration is required. The packages are optimized for
			Vite out of the box.
		</p>

		<div class="note">
			<AlertCircleIcon size={20} />
			<div>
				<strong>Note:</strong> If you encounter issues with SSR, ensure you have the latest version
				of <code>@sveltejs/vite-plugin-svelte</code>.
			</div>
		</div>
	</section>

	<section>
		<h2>SvelteKit Configuration</h2>
		<p>For SvelteKit projects, the components work seamlessly with SSR enabled.</p>

		<h3>Optimize dependencies</h3>
		<p>Add Greater Components to the optimized dependencies in your <code>vite.config.js</code>:</p>
		<CodeExample
			language="javascript"
			title="vite.config.js"
			code={`export default {
  optimizeDeps: {
    include: [
      '@equaltoai/greater-components-primitives',
      '@equaltoai/greater-components-tokens',
      '@equaltoai/greater-components-icons'
    ]
  }
}`}
		/>
	</section>

	<section>
		<h2>Next Steps</h2>
		<ul class="next-steps-list">
			<li>
				<a href="/guides/theming">Learn about theming</a> - Customize the look and feel
			</li>
			<li>
				<a href="/components">Browse components</a> - Explore available components
			</li>
			<li>
				<a href="/guides/typescript">TypeScript guide</a> - Advanced TypeScript usage
			</li>
			<li>
				<a href="/guides/accessibility">Accessibility guide</a> - Best practices for a11y
			</li>
		</ul>
	</section>
</article>

<style>
	.installation-page {
		max-width: 800px;
	}

	.lead {
		font-size: 1.25rem;
		opacity: 0.8;
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 3rem;
	}

	h2 {
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--doc-border);
	}

	h3 {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	h4 {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.package-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 1.5rem;
	}

	.package-item p {
		margin-top: 0.5rem;
		opacity: 0.8;
	}

	.note {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: #fef3c7;
		border: 1px solid #f59e0b;
		border-radius: 0.5rem;
		margin: 1.5rem 0;
		color: #92400e;
	}

	:global(.dark) .note {
		background: #78350f;
		border-color: #f59e0b;
		color: #fef3c7;
	}

	.note strong {
		font-weight: 600;
	}

	.next-steps-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.next-steps-list li {
		padding: 1rem;
		background: var(--doc-surface-secondary);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.next-steps-list li:hover {
		background: var(--doc-surface-tertiary);
		transform: translateX(4px);
	}

	.next-steps-list a {
		display: block;
		text-decoration: none;
		color: var(--doc-text);
	}

	.next-steps-list a::after {
		content: ' →';
		opacity: 0.5;
	}
</style>
