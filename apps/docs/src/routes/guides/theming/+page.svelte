<script>
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Theming Guide - Greater Components</title>
	<meta
		name="description"
		content="Learn how to customize themes, create color palettes, and use design tokens in Greater Components."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>Theming</h1>
		<p class="lead">
			Greater Components uses a powerful design token system that makes it easy to customize colors,
			typography, spacing, and more. This guide covers everything from quick theme switching to
			creating custom brand palettes.
		</p>
	</header>

	<section>
		<h2>Quick Start</h2>
		<p>
			The simplest way to theme your app is using the <code>ThemeProvider</code> component with built-in
			presets.
		</p>

		<CodeExample
			code={`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';
</script>

<ThemeProvider theme="dark">
  <YourApp />
</ThemeProvider>`}
			language="svelte"
		/>

		<h3>Built-in Themes</h3>
		<ul>
			<li><strong>light</strong> - Clean, modern light interface (default)</li>
			<li><strong>dark</strong> - Easy-on-the-eyes dark mode</li>
			<li><strong>high-contrast</strong> - WCAG AAA compliant high contrast</li>
			<li><strong>auto</strong> - Follow system preference</li>
		</ul>
	</section>

	<section>
		<h2>Color Palette Presets</h2>
		<p>
			Greater Components includes several pre-built color palettes that you can use as starting
			points or apply directly.
		</p>

		<CodeExample
			code={`<!-- Palette presets are class-based for strict CSP compatibility -->
<ThemeProvider palette="slate">
  <YourApp />
</ThemeProvider>

<!-- Available presets: slate, stone, neutral, zinc, gray -->`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Custom Themes (External CSS)</h2>
		<p>
			For strict CSP compatibility, shipped components do not support runtime “custom theme objects”
			or a
			<code>style</code> prop. To customize your theme, define CSS custom properties in your own
			stylesheets (scoped via <code>class</code> when appropriate).
		</p>

		<CodeExample
			code={`<ThemeProvider class="brand-theme">
  <YourApp />
</ThemeProvider>

<style>
  :global(.brand-theme) {
    /* Override a small set of tokens */
    --gr-color-primary-600: #4f46e5;
    --gr-color-primary-700: #4338ca;
    --gr-semantic-action-primary-default: var(--gr-color-primary-600);
    --gr-semantic-action-primary-hover: var(--gr-color-primary-700);
  }
</style>`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>CSS Custom Properties</h2>
		<p>
			All design tokens are exposed as CSS custom properties, making it easy to customize specific
			values without changing the entire theme.
		</p>

		<CodeExample
			code={`:root {
  /* Override primary color */
  --gr-color-primary-500: #6366f1;
  --gr-color-primary-600: #4f46e5;
  
  /* Override typography */
  --gr-typography-fontFamily-sans: 'Inter', system-ui, sans-serif;
  
  /* Override spacing */
  --gr-spacing-4: 1rem;
  
  /* Override border radius */
  --gr-radii-lg: 12px;
}`}
			language="css"
		/>

		<h3>Semantic Tokens</h3>
		<p>Semantic tokens map to specific use cases and automatically adapt to light/dark modes:</p>

		<CodeExample
			code={`:root {
  /* Background colors */
  --gr-semantic-background-primary: var(--gr-color-white);
  --gr-semantic-background-secondary: var(--gr-color-gray-50);
  
  /* Foreground colors */
  --gr-semantic-foreground-primary: var(--gr-color-gray-900);
  --gr-semantic-foreground-secondary: var(--gr-color-gray-600);
  
  /* Action colors */
  --gr-semantic-action-primary-default: var(--gr-color-primary-600);
  --gr-semantic-action-primary-hover: var(--gr-color-primary-700);
  
  /* Border colors */
  --gr-semantic-border-default: var(--gr-color-gray-200);
}

[data-theme="dark"] {
  --gr-semantic-background-primary: var(--gr-color-gray-900);
  --gr-semantic-foreground-primary: var(--gr-color-gray-50);
  /* ... dark mode overrides */
}`}
			language="css"
		/>
	</section>

	<section>
		<h2>Theme Workbench</h2>
		<p>
			Use the <code>ThemeWorkbench</code> component to visually create and preview custom themes:
		</p>

		<CodeExample
			code={`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeWorkbench } from '@equaltoai/greater-components/primitives';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleSave(theme) {
    console.log('Generated theme:', theme);
    // Save to your theme configuration
  }
</script>

<ThemeWorkbench 
  initialColor="#3b82f6" 
  onSave={handleSave} 
/>`}
			language="svelte"
		/>

		<p>
			The workbench is intended for development workflows. For strict CSP deployments, export the
			result and apply it via external CSS (not per-instance inline styles).
		</p>

		<p>The workbench includes:</p>
		<ul>
			<li>
				<strong>Color Harmony Picker</strong> - Generate complementary, analogous, and triadic color schemes
			</li>
			<li><strong>Contrast Checker</strong> - Validate WCAG contrast ratios</li>
			<li><strong>Live Preview</strong> - See changes in real-time</li>
			<li><strong>Export</strong> - Generate CSS or JSON configuration</li>
		</ul>
	</section>

	<section>
		<h2>Programmatic Theme Generation</h2>
		<p>Use utility functions to generate themes programmatically:</p>

		<CodeExample
			code={`import { 
  generateTheme, 
  generateColorHarmony,
  getContrastRatio,
  meetsWCAG 
} from '@equaltoai/greater-components/utils';

// Generate complete theme from brand color
const theme = generateTheme('#6366f1');

// Generate color harmonies
const harmonies = generateColorHarmony('#6366f1', 'triadic');
// Returns: ['#6366f1', '#f16366', '#66f163']

// Check contrast ratio
const ratio = getContrastRatio('#ffffff', '#6366f1');
// Returns: 4.56

// Validate WCAG compliance
const passes = meetsWCAG('#ffffff', '#6366f1', 'AA');
// Returns: true`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Component-Level Theming</h2>
		<p>
			Override theme values for specific components using CSS classes. Inline style attributes are
			not CSP-safe and are not supported by shipped components.
		</p>

		<CodeExample
			code={`<!-- Using CSS class -->
<Button class="custom-button">Custom Styled</Button>

<style>
  .custom-button {
    --gr-button-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gr-button-color: white;
    --gr-button-border-radius: 9999px;
  }
</style>
`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<ul class="best-practices">
			<li>
				<strong>Use semantic tokens</strong> - Prefer <code>--gr-semantic-*</code> tokens over raw color
				values for automatic dark mode support.
			</li>
			<li>
				<strong>Test contrast ratios</strong> - Always verify text/background combinations meet WCAG AA
				(4.5:1 for normal text, 3:1 for large text).
			</li>
			<li>
				<strong>Provide theme toggle</strong> - Use <code>ThemeSwitcher</code> to let users choose their
				preferred theme.
			</li>
			<li>
				<strong>Respect system preferences</strong> - Honor <code>prefers-color-scheme</code>
				for initial theme selection.
			</li>
			<li>
				<strong>Document custom tokens</strong> - If you create custom tokens, document them for your
				team.
			</li>
		</ul>
	</section>

	<section>
		<h2>Related Resources</h2>
		<ul>
			<li>
				<a href="/guides/dark-mode">Dark Mode Guide</a> - Best practices for dark mode implementation
			</li>
			<li>
				<a href="/guides/csp-compatibility">CSP Compatibility</a> - Strict CSP constraints and supported
				patterns
			</li>
			<li>
				<a href="/guides/csp-migration">CSP Migration Guide</a> - Before/after examples for CSP-driven
				breaking changes
			</li>
			<li><a href="/tokens/colors">Color Tokens Reference</a> - Complete list of color tokens</li>
			<li>
				<a href="/components/theme-switcher">ThemeSwitcher Component</a> - User-facing theme toggle
			</li>
			<li><a href="/api/utilities#theme">Theme Utilities API</a> - Programmatic theme functions</li>
		</ul>
	</section>
</article>

<style>
	.guide-page {
		max-width: 800px;
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

	.best-practices li {
		margin-bottom: 1rem;
	}

	a {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
