<script>
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Dark Mode Guide - Greater Components</title>
	<meta
		name="description"
		content="Best practices for implementing dark mode with Greater Components, including system preference detection and accessibility considerations."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>Dark Mode</h1>
		<p class="lead">
			Greater Components provides built-in dark mode support with automatic system preference
			detection. This guide covers implementation patterns, accessibility considerations, and best
			practices for dark mode design.
		</p>
	</header>

	<section>
		<h2>Quick Implementation</h2>
		<p>
			The easiest way to add dark mode is using the <code>ThemeSwitcher</code> component:
		</p>

		<CodeExample
			code={`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeProvider, ThemeSwitcher } from '@equaltoai/greater-components/primitives';
</script>

<ThemeProvider>
  <header>
    <ThemeSwitcher />
  </header>
  <main>
    <YourApp />
  </main>
</ThemeProvider>`}
			language="svelte"
		/>

		<p>
			This automatically handles theme persistence, system preference detection, and smooth
			transitions.
		</p>
	</section>

	<section>
		<h2>System Preference Detection</h2>
		<p>
			Respect user's system-level dark mode preference using <code>prefers-color-scheme</code>:
		</p>

		<CodeExample
			code={`<script>
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';
  import { browser } from '$app/environment';

  // Detect system preference
  function getInitialTheme() {
    if (!browser) return 'light';
    
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }

  let theme = $state(getInitialTheme());
</script>

<ThemeProvider {theme}>
  <YourApp />
</ThemeProvider>`}
			language="svelte"
		/>

		<h3>Listening for System Changes</h3>
		<p>React to system preference changes in real-time:</p>

		<CodeExample
			code={`<script>
  import { onMount } from 'svelte';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let theme = $state('light');

  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial value
    theme = mediaQuery.matches ? 'dark' : 'light';
    
    // Listen for changes
    mediaQuery.addEventListener('change', (e) => {
      theme = e.matches ? 'dark' : 'light';
    });
  });
</script>

<p>Current theme: {theme}</p>`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>CSS Implementation</h2>
		<p>
			Greater Components uses the <code>data-theme</code> attribute for theme switching:
		</p>

		<CodeExample
			code={`/* Light mode (default) */
:root {
  --gr-semantic-background-primary: #ffffff;
  --gr-semantic-foreground-primary: #0f172a;
  --gr-semantic-border-default: #e2e8f0;
}

/* Dark mode */
[data-theme="dark"] {
  --gr-semantic-background-primary: #0f172a;
  --gr-semantic-foreground-primary: #f8fafc;
  --gr-semantic-border-default: #334155;
}

/* High contrast mode */
[data-theme="highContrast"] {
  --gr-semantic-background-primary: #000000;
  --gr-semantic-foreground-primary: #ffffff;
  --gr-semantic-border-default: #ffffff;
}`}
			language="css"
		/>

		<h3>CSS-Only Dark Mode</h3>
		<p>For simpler setups, use CSS media queries without JavaScript:</p>

		<CodeExample
			code={`@media (prefers-color-scheme: dark) {
  :root {
    --gr-semantic-background-primary: #0f172a;
    --gr-semantic-foreground-primary: #f8fafc;
    /* ... other dark mode overrides */
  }
}`}
			language="css"
		/>
	</section>

	<section>
		<h2>Smooth Transitions</h2>
		<p>Add smooth transitions when switching themes:</p>

		<CodeExample
			code={`/* Add to your global styles */
:root {
  /* Transition background and text colors */
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

/* Disable transitions for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    transition: none;
  }
}`}
			language="css"
		/>
	</section>

	<section>
		<h2>Preventing Flash</h2>
		<p>Prevent the flash of incorrect theme on page load by setting the theme before render:</p>

		<CodeExample
			code={`<!-- In your app.html -->
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>`}
			language="html"
		/>
	</section>

	<section>
		<h2>Dark Mode Design Best Practices</h2>

		<h3>Color Considerations</h3>
		<ul>
			<li>
				<strong>Avoid pure black (#000)</strong> - Use dark grays like <code>#0f172a</code> or
				<code>#1e293b</code> for backgrounds. Pure black can cause eye strain.
			</li>
			<li>
				<strong>Reduce contrast slightly</strong> - Pure white text on dark backgrounds can be
				harsh. Use <code>#f8fafc</code> or <code>#f1f5f9</code> instead.
			</li>
			<li>
				<strong>Desaturate colors</strong> - Bright, saturated colors can appear too vibrant in dark mode.
				Reduce saturation by 10-20%.
			</li>
			<li>
				<strong>Maintain hierarchy</strong> - Use different shades of gray to maintain visual hierarchy
				(surfaces, cards, modals).
			</li>
		</ul>

		<h3>Elevation and Depth</h3>
		<CodeExample
			code={`/* Light mode: darker shadows for depth */
.card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Dark mode: lighter surfaces for depth */
[data-theme="dark"] .card {
  background: #1e293b; /* Lighter than page background */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}`}
			language="css"
		/>

		<h3>Images and Media</h3>
		<ul>
			<li>
				<strong>Reduce image brightness</strong> - Bright images can be jarring in dark mode.
			</li>
			<li>
				<strong>Provide dark variants</strong> - For logos and illustrations, provide dark-mode specific
				versions when possible.
			</li>
		</ul>

		<CodeExample
			code={`/* Reduce image brightness in dark mode */
[data-theme="dark"] img {
  filter: brightness(0.9);
}

/* Or use picture element for different sources */
<picture>
  <source srcset="logo-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="logo-light.svg" alt="Logo">
</picture>`}
			language="html"
		/>
	</section>

	<section>
		<h2>Accessibility Considerations</h2>
		<ul>
			<li>
				<strong>Maintain contrast ratios</strong> - Dark mode must still meet WCAG AA contrast requirements
				(4.5:1 for normal text).
			</li>
			<li>
				<strong>Test with screen readers</strong> - Ensure theme changes are not announced disruptively.
			</li>
			<li>
				<strong>Provide high contrast option</strong> - Some users need higher contrast than standard
				dark mode provides.
			</li>
			<li>
				<strong>Don't force dark mode</strong> - Always let users choose their preferred theme.
			</li>
		</ul>
	</section>

	<section>
		<h2>Testing Dark Mode</h2>
		<p>Test your dark mode implementation thoroughly:</p>

		<CodeExample
			code={`// In your tests
import { render } from '@testing-library/svelte';

describe('Dark mode', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders correctly in dark mode', () => {
    const { container } = render(MyComponent);
    // Assert dark mode styles are applied
  });
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Related Resources</h2>
		<ul>
			<li><a href="/guides/theming">Theming Guide</a> - Complete theming documentation</li>
			<li>
				<a href="/components/theme-switcher">ThemeSwitcher Component</a> - User-facing theme toggle
			</li>
			<li><a href="/tokens/colors">Color Tokens Reference</a> - All available color tokens</li>
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

	a {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
