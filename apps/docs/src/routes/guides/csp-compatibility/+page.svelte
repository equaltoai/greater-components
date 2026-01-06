<script>
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>CSP Compatibility - Greater Components</title>
	<meta
		name="description"
		content="Strict CSP compatibility for Greater Components: no inline styles/scripts, CSP-safe customization patterns, and a compatibility matrix."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>CSP Compatibility</h1>
		<p class="lead">
			Lesser deployments run with a strict Content Security Policy (CSP). This guide explains what’s
			blocked, what Greater Components guarantees, and the CSP-safe patterns to use for
			customization.
		</p>
	</header>

	<section>
		<h2>What Strict CSP Blocks</h2>
		<p>
			In strict CSP environments, the browser blocks inline JavaScript and inline CSS unless the CSP
			allows it explicitly (usually via nonces or hashes). Lesser’s policy is strict enough that you
			should assume inline output is not permitted.
		</p>
		<ul>
			<li>
				<strong>Inline scripts</strong>: <code>&lt;script&gt;...&lt;/script&gt;</code> without
				<code>src</code>
			</li>
			<li>
				<strong>Inline styles</strong>: any <code>style="..."</code> attribute (style hashes do not
				apply to style attributes without <code>'unsafe-hashes'</code>)
			</li>
		</ul>
	</section>

	<section>
		<h2>Greater Components CSP Contract</h2>
		<p>Greater Components is designed to be strict-CSP compatible by default:</p>
		<ul>
			<li><strong>No shipped components emit</strong> <code>style="..."</code> attributes.</li>
			<li><strong>No shipped components emit</strong> inline <code>&lt;script&gt;</code> tags.</li>
			<li>
				<strong>The <code>style</code> prop is not supported</strong> on shipped components; use
				<code>class</code> and external CSS.
			</li>
		</ul>

		<CodeExample
			title="CSP-safe styling: class + external CSS"
			language="svelte"
			code={`<!-- ✅ CSP-safe: use class -->
<Button class="brand-button">Continue</Button>

<style>
  :global(.brand-button) {
    --gr-button-bg: var(--gr-color-primary-600);
    --gr-button-bg-hover: var(--gr-color-primary-700);
  }
</style>`}
		/>
	</section>

	<section>
		<h2>Compatibility Matrix (Primitives)</h2>
		<p>These primitives are CSP-safe by default. Customization is via presets and classes.</p>

		<table class="matrix" aria-label="CSP compatibility matrix">
			<thead>
				<tr>
					<th scope="col">Component</th>
					<th scope="col">Status</th>
					<th scope="col">CSP-safe approach</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Skeleton</th>
					<td>✅</td>
					<td>Preset <code>width</code>/<code>height</code> + custom sizing via classes</td>
				</tr>
				<tr>
					<th scope="row">Avatar</th>
					<td>✅</td>
					<td>Deterministic palette classes (no dynamic inline colors)</td>
				</tr>
				<tr>
					<th scope="row">Text</th>
					<td>✅</td>
					<td>Bounded clamp classes (<code>lines</code> 2–6) + custom clamp via classes</td>
				</tr>
				<tr>
					<th scope="row">Container</th>
					<td>✅</td>
					<td>Preset gutters + custom gutter via external CSS variables on a class</td>
				</tr>
				<tr>
					<th scope="row">ThemeProvider</th>
					<td>✅</td>
					<td>Preset palette/fonts + custom theming via class-based CSS variables</td>
				</tr>
				<tr>
					<th scope="row">Section</th>
					<td>✅</td>
					<td>Preset spacing/background + custom styling via classes</td>
				</tr>
				<tr>
					<th scope="row">ThemeSwitcher</th>
					<td>✅</td>
					<td>Preset previews (no inline preview colors)</td>
				</tr>
				<tr>
					<th scope="row">Tooltip</th>
					<td>✅</td>
					<td>Class-based placement (no pixel style injection)</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>CSP-Safe Customization Patterns</h2>

		<h3>Skeleton sizing</h3>
		<CodeExample
			language="svelte"
			code={`<!-- Presets -->
<Skeleton width="full" height="md" />
<Skeleton width="1/2" height="lg" />

<!-- Custom sizes via external CSS -->
<Skeleton class="my-skeleton" />

<style>
  :global(.my-skeleton) {
    width: 280px;
    height: 80px;
  }
</style>`}
		/>

		<h3>Text clamping</h3>
		<CodeExample
			language="svelte"
			code={`<!-- Supported clamp range (2–6) -->
<Text truncate lines={3}>…</Text>

<!-- Custom clamp via external CSS -->
<Text truncate class="clamp-10">…</Text>

<style>
  :global(.clamp-10) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
</style>`}
		/>

		<h3>Custom container gutters</h3>
		<CodeExample
			language="svelte"
			code={`<!-- Presets -->
<Container gutter="md">…</Container>

<!-- Custom gutter via external CSS variable -->
<Container class="custom-gutter">…</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>`}
		/>
	</section>

	<section>
		<h2>Validation</h2>
		<p>
			The repository includes a CSP audit script that scans shipped Svelte templates and built
			output:
		</p>
		<CodeExample language="bash" code={`pnpm validate:csp`} />
		<p>
			It fails CI if any shipped templates emit inline styles, or if the docs/playground build output
			contains inline <code>&lt;script&gt;</code> tags or <code>style="..."</code> attributes.
		</p>
	</section>

	<section>
		<h2>Next</h2>
		<p>
			See <a href="/guides/csp-migration">CSP Migration Guide</a> for concrete before/after examples
			for breaking changes.
		</p>
	</section>
</article>

<style>
	.guide-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-action-primary-default);
		margin: 0 0 0.5rem;
	}

	h1 {
		font-size: var(--gr-typography-fontSize-4xl);
		margin: 0 0 1rem;
	}

	.lead {
		font-size: var(--gr-typography-fontSize-lg);
		color: var(--gr-semantic-foreground-secondary);
		margin: 0 0 2rem;
		line-height: 1.6;
	}

	section {
		margin-bottom: 3rem;
	}

	h2 {
		font-size: var(--gr-typography-fontSize-2xl);
		margin: 0 0 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--gr-semantic-border-default);
	}

	h3 {
		font-size: var(--gr-typography-fontSize-lg);
		margin: 1.5rem 0 0.75rem;
	}

	p {
		margin: 0 0 1rem;
		line-height: 1.6;
	}

	ul {
		margin: 0 0 1rem;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
		font-size: 0.9em;
	}

	a {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.matrix {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-md);
		overflow: hidden;
	}

	.matrix th,
	.matrix td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--gr-semantic-border-subtle);
		vertical-align: top;
	}

	.matrix thead th {
		background: var(--gr-semantic-background-secondary);
		font-weight: var(--gr-typography-fontWeight-semibold);
	}

	.matrix tbody tr:last-child th,
	.matrix tbody tr:last-child td {
		border-bottom: none;
	}
</style>
