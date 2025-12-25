import"../chunks/DsnmJJEf.js";import"../chunks/ttMDPgN5.js";import{f as h,a as v,e as G,s as e,c as r,$ as _,o as m,r as s}from"../chunks/CAqKBpMZ.js";import{h as x}from"../chunks/BGh-p3ai.js";import{C as t}from"../chunks/BVft0-qW.js";var B=h('<meta name="description" content="Learn how to customize themes, create color palettes, and use design tokens in Greater Components."/>'),W=h(`<article class="guide-page svelte-anwrpt"><header><p class="eyebrow svelte-anwrpt">Guide</p> <h1 class="svelte-anwrpt">Theming</h1> <p class="lead svelte-anwrpt">Greater Components uses a powerful design token system that makes it easy to customize colors,
			typography, spacing, and more. This guide covers everything from quick theme switching to
			creating custom brand palettes.</p></header> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Quick Start</h2> <p class="svelte-anwrpt">The simplest way to theme your app is using the <code class="svelte-anwrpt">ThemeProvider</code> component with built-in
			presets.</p> <!> <h3 class="svelte-anwrpt">Built-in Themes</h3> <ul class="svelte-anwrpt"><li class="svelte-anwrpt"><strong>light</strong> - Clean, modern light interface (default)</li> <li class="svelte-anwrpt"><strong>dark</strong> - Easy-on-the-eyes dark mode</li> <li class="svelte-anwrpt"><strong>highContrast</strong> - WCAG AAA compliant high contrast</li></ul></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Color Palette Presets</h2> <p class="svelte-anwrpt">Greater Components includes several pre-built color palettes that you can use as starting
			points or apply directly.</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Custom Color Palettes</h2> <p class="svelte-anwrpt">Create your own color palette by defining primary, secondary, and semantic colors.</p> <!> <h3 class="svelte-anwrpt">Palette Structure</h3> <p class="svelte-anwrpt">A complete palette includes these color scales:</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">CSS Custom Properties</h2> <p class="svelte-anwrpt">All design tokens are exposed as CSS custom properties, making it easy to customize specific
			values without changing the entire theme.</p> <!> <h3 class="svelte-anwrpt">Semantic Tokens</h3> <p class="svelte-anwrpt">Semantic tokens map to specific use cases and automatically adapt to light/dark modes:</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Theme Workbench</h2> <p class="svelte-anwrpt">Use the <code class="svelte-anwrpt">ThemeWorkbench</code> component to visually create and preview custom themes:</p> <!> <p class="svelte-anwrpt">The workbench includes:</p> <ul class="svelte-anwrpt"><li class="svelte-anwrpt"><strong>Color Harmony Picker</strong> - Generate complementary, analogous, and triadic color schemes</li> <li class="svelte-anwrpt"><strong>Contrast Checker</strong> - Validate WCAG contrast ratios</li> <li class="svelte-anwrpt"><strong>Live Preview</strong> - See changes in real-time</li> <li class="svelte-anwrpt"><strong>Export</strong> - Generate CSS or JSON configuration</li></ul></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Programmatic Theme Generation</h2> <p class="svelte-anwrpt">Use utility functions to generate themes programmatically:</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Component-Level Theming</h2> <p class="svelte-anwrpt">Override theme values for specific components using CSS classes or inline styles:</p> <!></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Best Practices</h2> <ul class="best-practices svelte-anwrpt"><li class="svelte-anwrpt"><strong>Use semantic tokens</strong> - Prefer <code class="svelte-anwrpt">--gr-semantic-*</code> tokens over raw color
				values for automatic dark mode support.</li> <li class="svelte-anwrpt"><strong>Test contrast ratios</strong> - Always verify text/background combinations meet WCAG AA
				(4.5:1 for normal text, 3:1 for large text).</li> <li class="svelte-anwrpt"><strong>Provide theme toggle</strong> - Use <code class="svelte-anwrpt">ThemeSwitcher</code> to let users choose their
				preferred theme.</li> <li class="svelte-anwrpt"><strong>Respect system preferences</strong> - Honor <code class="svelte-anwrpt">prefers-color-scheme</code> for initial theme selection.</li> <li class="svelte-anwrpt"><strong>Document custom tokens</strong> - If you create custom tokens, document them for your
				team.</li></ul></section> <section class="svelte-anwrpt"><h2 class="svelte-anwrpt">Related Resources</h2> <ul class="svelte-anwrpt"><li class="svelte-anwrpt"><a href="/guides/dark-mode" class="svelte-anwrpt">Dark Mode Guide</a> - Best practices for dark mode implementation</li> <li class="svelte-anwrpt"><a href="/tokens/colors" class="svelte-anwrpt">Color Tokens Reference</a> - Complete list of color tokens</li> <li class="svelte-anwrpt"><a href="/components/theme-switcher" class="svelte-anwrpt">ThemeSwitcher Component</a> - User-facing theme toggle</li> <li class="svelte-anwrpt"><a href="/api/utilities#theme" class="svelte-anwrpt">Theme Utilities API</a> - Programmatic theme functions</li></ul></section></article>`);function Y(w){var a=W();x("anwrpt",T=>{var A=B();G(()=>{_.title="Theming Guide - Greater Components"}),v(T,A)});var o=e(r(a),2),f=e(r(o),4);t(f,{code:`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ThemeProvider } from '@equaltoai/greater-components/primitives';
<\/script>

<ThemeProvider theme="dark">
  <YourApp />
</ThemeProvider>`,language:"svelte"}),m(4),s(o);var n=e(o,2),y=e(r(n),4);t(y,{code:`import { palettePresets } from '@equaltoai/greater-components/tokens';

// Available presets
const presets = {
  default: { ... },    // Blue primary
  ocean: { ... },      // Teal/cyan palette
  forest: { ... },     // Green palette
  sunset: { ... },     // Orange/amber palette
  berry: { ... },      // Purple/pink palette
  slate: { ... },      // Neutral gray palette
};

// Apply a preset
<ThemeProvider palette={palettePresets.ocean}>
  <YourApp />
</ThemeProvider>`,language:"typescript"}),s(n);var l=e(n,2),g=e(r(l),4);t(g,{code:`import { createPalette } from '@equaltoai/greater-components/tokens';

// Generate a complete palette from a single brand color
const customPalette = createPalette({
  primary: '#6366f1',  // Your brand color
  // Optional overrides
  secondary: '#ec4899',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
});

<ThemeProvider palette={customPalette}>
  <YourApp />
</ThemeProvider>`,language:"typescript"});var C=e(g,6);t(C,{code:`interface ColorPalette {
  primary: ColorScale;    // 50-950 shades
  secondary: ColorScale;
  gray: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}`,language:"typescript"}),s(l);var c=e(l,2),d=e(r(c),4);t(d,{code:`:root {
  /* Override primary color */
  --gr-color-primary-500: #6366f1;
  --gr-color-primary-600: #4f46e5;
  
  /* Override typography */
  --gr-typography-fontFamily-sans: 'Inter', system-ui, sans-serif;
  
  /* Override spacing */
  --gr-spacing-4: 1rem;
  
  /* Override border radius */
  --gr-radii-lg: 12px;
}`,language:"css"});var k=e(d,6);t(k,{code:`:root {
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
}`,language:"css"}),s(c);var i=e(c,2),b=e(r(i),4);t(b,{code:`<script>
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
/>`,language:"svelte"}),m(4),s(i);var p=e(i,2),S=e(r(p),4);t(S,{code:`import { 
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
// Returns: true`,language:"typescript"}),s(p);var u=e(p,2),P=e(r(u),4);t(P,{code:`<!-- Using CSS class -->
<Button class="custom-button">Custom Styled</Button>

<style>
  .custom-button {
    --gr-button-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gr-button-color: white;
    --gr-button-border-radius: 9999px;
  }
</style>

<!-- Using style prop -->
<Button style="--gr-button-bg: #10b981;">Green Button</Button>`,language:"svelte"}),s(u),m(4),s(a),v(w,a)}export{Y as component};
