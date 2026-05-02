import{D as e,G as t,T as n,Y as r,lt as i,q as a,ut as o,v as s,z as c}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as l}from"../chunks/D7myQBsm.js";var u=e(`<meta name="description" content="Best practices for implementing dark mode with Greater Components, including system preference detection and accessibility considerations."/>`),d=e(`<article class="guide-page svelte-12sz6f3"><header><p class="eyebrow svelte-12sz6f3">Guide</p> <h1 class="svelte-12sz6f3">Dark Mode</h1> <p class="lead svelte-12sz6f3">Greater Components provides built-in dark mode support with automatic system preference
			detection. This guide covers implementation patterns, accessibility considerations, and best
			practices for dark mode design.</p></header> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Quick Implementation</h2> <p class="svelte-12sz6f3">The easiest way to add dark mode is using the <code class="svelte-12sz6f3">ThemeSwitcher</code> component:</p> <!> <p class="svelte-12sz6f3">This automatically handles theme persistence, system preference detection, and smooth
			transitions.</p></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">System Preference Detection</h2> <p class="svelte-12sz6f3">Respect user's system-level dark mode preference using <code class="svelte-12sz6f3">prefers-color-scheme</code>:</p> <!> <h3 class="svelte-12sz6f3">Listening for System Changes</h3> <p class="svelte-12sz6f3">React to system preference changes in real-time:</p> <!></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">CSS Implementation</h2> <p class="svelte-12sz6f3">Greater Components uses the <code class="svelte-12sz6f3">data-theme</code> attribute for theme switching:</p> <!> <h3 class="svelte-12sz6f3">CSS-Only Dark Mode</h3> <p class="svelte-12sz6f3">For simpler setups, use CSS media queries without JavaScript:</p> <!></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Smooth Transitions</h2> <p class="svelte-12sz6f3">Add smooth transitions when switching themes:</p> <!></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Preventing Flash</h2> <p class="svelte-12sz6f3">Prevent the flash of incorrect theme on page load by setting the theme before render:</p> <!></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Dark Mode Design Best Practices</h2> <h3 class="svelte-12sz6f3">Color Considerations</h3> <ul class="svelte-12sz6f3"><li class="svelte-12sz6f3"><strong>Avoid pure black (#000)</strong> - Use dark grays like <code class="svelte-12sz6f3">#0f172a</code> or <code class="svelte-12sz6f3">#1e293b</code> for backgrounds. Pure black can cause eye strain.</li> <li class="svelte-12sz6f3"><strong>Reduce contrast slightly</strong> - Pure white text on dark backgrounds can be
				harsh. Use <code class="svelte-12sz6f3">#f8fafc</code> or <code class="svelte-12sz6f3">#f1f5f9</code> instead.</li> <li class="svelte-12sz6f3"><strong>Desaturate colors</strong> - Bright, saturated colors can appear too vibrant in dark mode.
				Reduce saturation by 10-20%.</li> <li class="svelte-12sz6f3"><strong>Maintain hierarchy</strong> - Use different shades of gray to maintain visual hierarchy
				(surfaces, cards, modals).</li></ul> <h3 class="svelte-12sz6f3">Elevation and Depth</h3> <!> <h3 class="svelte-12sz6f3">Images and Media</h3> <ul class="svelte-12sz6f3"><li class="svelte-12sz6f3"><strong>Reduce image brightness</strong> - Bright images can be jarring in dark mode.</li> <li class="svelte-12sz6f3"><strong>Provide dark variants</strong> - For logos and illustrations, provide dark-mode specific
				versions when possible.</li></ul> <!></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Accessibility Considerations</h2> <ul class="svelte-12sz6f3"><li class="svelte-12sz6f3"><strong>Maintain contrast ratios</strong> - Dark mode must still meet WCAG AA contrast requirements
				(4.5:1 for normal text).</li> <li class="svelte-12sz6f3"><strong>Test with screen readers</strong> - Ensure theme changes are not announced disruptively.</li> <li class="svelte-12sz6f3"><strong>Provide high contrast option</strong> - Some users need higher contrast than standard
				dark mode provides.</li> <li class="svelte-12sz6f3"><strong>Don't force dark mode</strong> - Always let users choose their preferred theme.</li></ul></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Testing Dark Mode</h2> <p class="svelte-12sz6f3">Test your dark mode implementation thoroughly:</p> <!></section> <section class="svelte-12sz6f3"><h2 class="svelte-12sz6f3">Related Resources</h2> <ul class="svelte-12sz6f3"><li class="svelte-12sz6f3"><a href="/guides/theming" class="svelte-12sz6f3">Theming Guide</a> - Complete theming documentation</li> <li class="svelte-12sz6f3"><a href="/components/theme-switcher" class="svelte-12sz6f3">ThemeSwitcher Component</a> - User-facing theme toggle</li> <li class="svelte-12sz6f3"><a href="/tokens/colors" class="svelte-12sz6f3">Color Tokens Reference</a> - All available color tokens</li></ul></section></article>`);function f(e){var f=d();s(`12sz6f3`,e=>{var r=u();c(()=>{t.title=`Dark Mode Guide - Greater Components`}),n(e,r)});var p=r(a(f),2);l(r(a(p),4),{code:`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeProvider, ThemeSwitcher } from '@equaltoai/greater-components/primitives';
<\/script>

<ThemeProvider>
  <header>
    <ThemeSwitcher />
  </header>
  <main>
    <YourApp />
  </main>
</ThemeProvider>`,language:`svelte`}),i(2),o(p);var m=r(p,2),h=r(a(m),4);l(h,{code:`<script>
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
<\/script>

<ThemeProvider {theme}>
  <YourApp />
</ThemeProvider>`,language:`svelte`}),l(r(h,6),{code:`<script>
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
<\/script>

<p>Current theme: {theme}</p>`,language:`svelte`}),o(m);var g=r(m,2),_=r(a(g),4);l(_,{code:`/* Light mode (default) */
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
}`,language:`css`}),l(r(_,6),{code:`@media (prefers-color-scheme: dark) {
  :root {
    --gr-semantic-background-primary: #0f172a;
    --gr-semantic-foreground-primary: #f8fafc;
    /* ... other dark mode overrides */
  }
}`,language:`css`}),o(g);var v=r(g,2);l(r(a(v),4),{code:`/* Add to your global styles */
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
}`,language:`css`}),o(v);var y=r(v,2);l(r(a(y),4),{code:`<!-- In your app.html -->
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  <\/script>
</head>`,language:`html`}),o(y);var b=r(y,2),x=r(a(b),8);l(x,{code:`/* Light mode: darker shadows for depth */
.card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Dark mode: lighter surfaces for depth */
[data-theme="dark"] .card {
  background: #1e293b; /* Lighter than page background */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}`,language:`css`}),l(r(x,6),{code:`/* Reduce image brightness in dark mode */
[data-theme="dark"] img {
  filter: brightness(0.9);
}

/* Or use picture element for different sources */
<picture>
  <source srcset="logo-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="logo-light.svg" alt="Logo">
</picture>`,language:`html`}),o(b);var S=r(b,4);l(r(a(S),4),{code:`// In your tests
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
});`,language:`typescript`}),o(S),i(2),o(f),n(e,f)}export{f as component};