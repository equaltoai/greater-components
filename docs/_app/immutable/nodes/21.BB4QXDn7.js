import{D as e,G as t,T as n,Y as r,lt as i,q as a,ut as o,v as s,z as c}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as l}from"../chunks/D7myQBsm.js";var u=e(`<meta name="description" content="Learn how to customize themes, create color palettes, and use design tokens in Greater Components."/>`),d=e(`<article class="guide-page svelte-anwrpt"><header><p class="eyebrow svelte-anwrpt">Guide</p> <h1 class="svelte-anwrpt">Theming</h1> <p class="lead svelte-anwrpt">Greater Components uses a powerful design token system that makes it easy to customize colors,
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
				breaking changes</li> <li class="svelte-anwrpt"><a href="/tokens/colors" class="svelte-anwrpt">Color Tokens Reference</a> - Complete list of color tokens</li> <li class="svelte-anwrpt"><a href="/components/theme-switcher" class="svelte-anwrpt">ThemeSwitcher Component</a> - User-facing theme toggle</li> <li class="svelte-anwrpt"><a href="/api/utilities#theme" class="svelte-anwrpt">Theme Utilities API</a> - Programmatic theme functions</li></ul></section></article>`);function f(e){var f=d();s(`anwrpt`,e=>{var r=u();c(()=>{t.title=`Theming Guide - Greater Components`}),n(e,r)});var p=r(a(f),2);l(r(a(p),4),{code:`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';
<\/script>

<ThemeProvider theme="dark">
  <YourApp />
</ThemeProvider>`,language:`svelte`}),i(4),o(p);var m=r(p,2);l(r(a(m),4),{code:`<!-- Palette presets are class-based for strict CSP compatibility -->
<ThemeProvider palette="slate">
  <YourApp />
</ThemeProvider>

<!-- Available presets: slate, stone, neutral, zinc, gray -->`,language:`svelte`}),o(m);var h=r(m,2);l(r(a(h),4),{code:`<ThemeProvider class="brand-theme">
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
</style>`,language:`svelte`}),o(h);var g=r(h,2),_=r(a(g),4);l(_,{code:`:root {
  /* Override primary color */
  --gr-color-primary-500: #6366f1;
  --gr-color-primary-600: #4f46e5;
  
  /* Override typography */
  --gr-typography-fontFamily-sans: 'Inter', system-ui, sans-serif;
  
  /* Override spacing */
  --gr-spacing-4: 1rem;
  
  /* Override border radius */
  --gr-radii-lg: 12px;
}`,language:`css`}),l(r(_,6),{code:`:root {
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
}`,language:`css`}),o(g);var v=r(g,2);l(r(a(v),4),{code:`<script>
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
/>`,language:`svelte`}),i(6),o(v);var y=r(v,2);l(r(a(y),4),{code:`import { 
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
// Returns: true`,language:`typescript`}),o(y);var b=r(y,2);l(r(a(b),4),{code:`<!-- Using CSS class -->
<Button class="custom-button">Custom Styled</Button>

<style>
  .custom-button {
    --gr-button-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gr-button-color: white;
    --gr-button-border-radius: 9999px;
  }
</style>
`,language:`svelte`}),o(b),i(4),o(f),n(e,f)}export{f as component};