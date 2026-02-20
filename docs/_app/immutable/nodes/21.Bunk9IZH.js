import{a as v,f as h}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as A,s as e,c as t,$ as G,n as m,r as s}from"../chunks/HviJt0eG.js";import{h as x}from"../chunks/BIESLWc2.js";import{C as r}from"../chunks/D4U67pPq.js";var _=h('<meta name="description" content="Learn how to customize themes, create color palettes, and use design tokens in Greater Components."/>'),W=h(`<article class="guide-page svelte-anwrpt"><header><p class="eyebrow svelte-anwrpt">Guide</p> <h1 class="svelte-anwrpt">Theming</h1> <p class="lead svelte-anwrpt">Greater Components uses a powerful design token system that makes it easy to customize colors,
			typography, spacing, and more. This guide covers everything from quick theme switching to
			creating custom brand palettes.</p></header> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Quick Start</h2> <p class="svelte-anwrpt">The simplest way to theme your app is using the <code class="svelte-anwrpt">ThemeProvider</code> component with built-in
			presets.</p> <!> <h3 class="svelte-anwrpt">Built-in Themes</h3> <ul class="svelte-anwrpt"><li class="svelte-anwrpt"><strong>light</strong> - Clean, modern light interface (default)</li> <li class="svelte-anwrpt"><strong>dark</strong> - Easy-on-the-eyes dark mode</li> <li class="svelte-anwrpt"><strong>high-contrast</strong> - WCAG AAA compliant high contrast</li> <li class="svelte-anwrpt"><strong>auto</strong> - Follow system preference</li></ul></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Color Palette Presets</h2> <p class="svelte-anwrpt">Greater Components includes several pre-built color palettes that you can use as starting
			points or apply directly.</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Custom Themes (External CSS)</h2> <p class="svelte-anwrpt">For strict CSP compatibility, shipped components do not support runtime “custom theme objects”
			or a <code class="svelte-anwrpt">style</code> prop. To customize your theme, define CSS custom properties in your own
			stylesheets (scoped via <code class="svelte-anwrpt">class</code> when appropriate).</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">CSS Custom Properties</h2> <p class="svelte-anwrpt">All design tokens are exposed as CSS custom properties, making it easy to customize specific
			values without changing the entire theme.</p> <!> <h3 class="svelte-anwrpt">Semantic Tokens</h3> <p class="svelte-anwrpt">Semantic tokens map to specific use cases and automatically adapt to light/dark modes:</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Theme Workbench</h2> <p class="svelte-anwrpt">Use the <code class="svelte-anwrpt">ThemeWorkbench</code> component to visually create and preview custom themes:</p> <!> <p class="svelte-anwrpt">The workbench is intended for development workflows. For strict CSP deployments, export the
			result and apply it via external CSS (not per-instance inline styles).</p> <p class="svelte-anwrpt">The workbench includes:</p> <ul class="svelte-anwrpt"><li class="svelte-anwrpt"><strong>Color Harmony Picker</strong> - Generate complementary, analogous, and triadic color schemes</li> <li class="svelte-anwrpt"><strong>Contrast Checker</strong> - Validate WCAG contrast ratios</li> <li class="svelte-anwrpt"><strong>Live Preview</strong> - See changes in real-time</li> <li class="svelte-anwrpt"><strong>Export</strong> - Generate CSS or JSON configuration</li></ul></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Programmatic Theme Generation</h2> <p class="svelte-anwrpt">Use utility functions to generate themes programmatically:</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Component-Level Theming</h2> <p class="svelte-anwrpt">Override theme values for specific components using CSS classes. Inline style attributes are
			not CSP-safe and are not supported by shipped components.</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Best Practices</h2> <ul class="best-practices svelte-anwrpt"><li class="svelte-anwrpt"><strong>Use semantic tokens</strong> - Prefer <code class="svelte-anwrpt">--gr-semantic-*</code> tokens over raw color
				values for automatic dark mode support.</li> <li class="svelte-anwrpt"><strong>Test contrast ratios</strong> - Always verify text/background combinations meet WCAG AA
				(4.5:1 for normal text, 3:1 for large text).</li> <li class="svelte-anwrpt"><strong>Provide theme toggle</strong> - Use <code class="svelte-anwrpt">ThemeSwitcher</code> to let users choose their
				preferred theme.</li> <li class="svelte-anwrpt"><strong>Respect system preferences</strong> - Honor <code class="svelte-anwrpt">prefers-color-scheme</code> for initial theme selection.</li> <li class="svelte-anwrpt"><strong>Document custom tokens</strong> - If you create custom tokens, document them for your
				team.</li></ul></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Related Resources</h2> <ul class="svelte-anwrpt"><li class="svelte-anwrpt"><a href="/guides/dark-mode" class="svelte-anwrpt">Dark Mode Guide</a> - Best practices for dark mode implementation</li> <li class="svelte-anwrpt"><a href="/guides/csp-compatibility" class="svelte-anwrpt">CSP Compatibility</a> - Strict CSP constraints and supported
				patterns</li> <li class="svelte-anwrpt"><a href="/guides/csp-migration" class="svelte-anwrpt">CSP Migration Guide</a> - Before/after examples for CSP-driven
				breaking changes</li> <li class="svelte-anwrpt"><a href="/tokens/colors" class="svelte-anwrpt">Color Tokens Reference</a> - Complete list of color tokens</li> <li class="svelte-anwrpt"><a href="/components/theme-switcher" class="svelte-anwrpt">ThemeSwitcher Component</a> - User-facing theme toggle</li> <li class="svelte-anwrpt"><a href="/api/utilities#theme" class="svelte-anwrpt">Theme Utilities API</a> - Programmatic theme functions</li></ul></section></article>`);function F(u){var a=W();x("anwrpt",T=>{var P=_();A(()=>{G.title="Theming Guide - Greater Components"}),v(T,P)});var o=e(t(a),2),w=e(t(o),4);r(w,{code:`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';
<\/script>

<ThemeProvider theme="dark">
  <YourApp />
</ThemeProvider>`,language:"svelte"}),m(4),s(o);var n=e(o,2),f=e(t(n),4);r(f,{code:`<!-- Palette presets are class-based for strict CSP compatibility -->
<ThemeProvider palette="slate">
  <YourApp />
</ThemeProvider>

<!-- Available presets: slate, stone, neutral, zinc, gray -->`,language:"svelte"}),s(n);var l=e(n,2),y=e(t(l),4);r(y,{code:`<ThemeProvider class="brand-theme">
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
</style>`,language:"svelte"}),s(l);var i=e(l,2),g=e(t(i),4);r(g,{code:`:root {
  /* Override primary color */
  --gr-color-primary-500: #6366f1;
  --gr-color-primary-600: #4f46e5;
  
  /* Override typography */
  --gr-typography-fontFamily-sans: 'Inter', system-ui, sans-serif;
  
  /* Override spacing */
  --gr-spacing-4: 1rem;
  
  /* Override border radius */
  --gr-radii-lg: 12px;
}`,language:"css"});var C=e(g,6);r(C,{code:`:root {
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
}`,language:"css"}),s(i);var c=e(i,2),b=e(t(c),4);r(b,{code:`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeWorkbench } from '@equaltoai/greater-components/primitives';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleSave(theme) {
    console.log('Generated theme:', theme);
    // Save to your theme configuration
  }
<\/script>

<ThemeWorkbench 
  initialColor="#3b82f6" 
  onSave={handleSave} 
/>`,language:"svelte"}),m(6),s(c);var p=e(c,2),k=e(t(p),4);r(k,{code:`import { 
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
// Returns: true`,language:"typescript"}),s(p);var d=e(p,2),S=e(t(d),4);r(S,{code:`<!-- Using CSS class -->
<Button class="custom-button">Custom Styled</Button>

<style>
  .custom-button {
    --gr-button-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gr-button-color: white;
    --gr-button-border-radius: 9999px;
  }
</style>
`,language:"svelte"}),s(d),m(4),s(a),v(u,a)}export{F as component};
