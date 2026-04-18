import{D as e,G as t,T as n,Y as r,lt as i,q as a,ut as o,v as s,z as c}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as l}from"../chunks/D7myQBsm.js";import{t as u}from"../chunks/DPpW-xwu.js";var d=e(`<meta name="description" content="Learn how to install and set up Greater Components in your Svelte application."/>`),f=e(`<article class="installation-page svelte-t06thp"><h1>Installation</h1> <p class="lead svelte-t06thp">Get started with Greater Components in your Svelte application.</p> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Prerequisites</h2> <ul><li>Node.js 20.0 or later</li> <li>Svelte 5.0 or later</li> <li>TypeScript 5.0 or later (optional but recommended)</li></ul></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Installation</h2> <h3 class="svelte-t06thp">Using the CLI (recommended)</h3> <!> <h3 class="svelte-t06thp">Using npm/pnpm (umbrella package)</h3> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Individual Packages</h2> <p>You can install packages individually based on your needs:</p> <div class="package-list svelte-t06thp"><div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Core Components</h4> <!> <p class="svelte-t06thp">Essential UI components like Button, Modal, TextField, etc.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Design Tokens</h4> <!> <p class="svelte-t06thp">Design tokens for theming and consistent styling.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Icons</h4> <!> <p class="svelte-t06thp">Comprehensive icon library with 200+ SVG icons.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Content Rendering</h4> <!> <p class="svelte-t06thp">Markdown + syntax highlighting components (CodeBlock, MarkdownRenderer).</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Utilities</h4> <!> <p class="svelte-t06thp">Helper functions and utilities.</p></div></div></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Basic Setup</h2> <h3 class="svelte-t06thp">1. Import CSS</h3> <p>Import tokens first, then primitives, then face styles (if used):</p> <!> <h3 class="svelte-t06thp">2. Use components</h3> <p>Import and use components in your Svelte files:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">TypeScript Setup</h2> <p>Greater Components is written in TypeScript and provides full type definitions.</p> <h3 class="svelte-t06thp">Configure TypeScript</h3> <p>Ensure your <code>tsconfig.json</code> includes the following:</p> <!> <h3 class="svelte-t06thp">Type imports</h3> <p>Import types alongside components:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Vite Configuration</h2> <p>If you're using Vite, no additional configuration is required. The packages are optimized for
			Vite out of the box.</p> <div class="note svelte-t06thp"><!> <div><strong class="svelte-t06thp">Note:</strong> If you encounter issues with SSR, ensure you have the latest version
				of <code>@sveltejs/vite-plugin-svelte</code>.</div></div></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">SvelteKit Configuration</h2> <p>For SvelteKit projects, the components work seamlessly with SSR enabled.</p> <h3 class="svelte-t06thp">Optimize dependencies</h3> <p>Add Greater Components to the optimized dependencies in your <code>vite.config.js</code>:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Next Steps</h2> <ul class="next-steps-list svelte-t06thp"><li class="svelte-t06thp"><a href="/guides/theming" class="svelte-t06thp">Learn about theming</a> - Customize the look and feel</li> <li class="svelte-t06thp"><a href="/components" class="svelte-t06thp">Browse components</a> - Explore available components</li> <li class="svelte-t06thp"><a href="/guides/typescript" class="svelte-t06thp">TypeScript guide</a> - Advanced TypeScript usage</li> <li class="svelte-t06thp"><a href="/guides/accessibility" class="svelte-t06thp">Accessibility guide</a> - Best practices for a11y</li></ul></section></article>`);function p(e){var p=f();s(`t06thp`,e=>{var r=d();c(()=>{t.title=`Installation - Greater Components`}),n(e,r)});var m=r(a(p),6),h=r(a(m),4);l(h,{language:`bash`,code:`# Install the CLI from GitHub Releases
# Replace \`greater-vX.Y.Z\` with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz

# Initialize config + CSS injection
greater init --face social

# Install the Social face bundle
greater add faces/social`}),l(r(h,4),{language:`bash`,code:`pnpm add @equaltoai/greater-components`}),o(m);var g=r(m,2),_=r(a(g),4),v=a(_);l(r(a(v),2),{language:`bash`,code:`npm install @equaltoai/greater-components-primitives`}),i(2),o(v);var y=r(v,2);l(r(a(y),2),{language:`bash`,code:`npm install @equaltoai/greater-components-tokens`}),i(2),o(y);var b=r(y,2);l(r(a(b),2),{language:`bash`,code:`npm install @equaltoai/greater-components-icons`}),i(2),o(b);var x=r(b,2);l(r(a(x),2),{language:`bash`,code:`npm install @equaltoai/greater-components-content`}),i(2),o(x);var S=r(x,2);l(r(a(S),2),{language:`bash`,code:`npm install @equaltoai/greater-components-utils`}),i(2),o(S),o(_),o(g);var C=r(g,2),w=r(a(C),6);l(w,{language:`svelte`,title:`+layout.svelte`,code:`<script lang="ts">
  import '@equaltoai/greater-components/tokens/theme.css';
  import '@equaltoai/greater-components/primitives/style.css';
  import '@equaltoai/greater-components/faces/social/style.css';

  import { ThemeProvider } from '@equaltoai/greater-components/primitives';

  let { children } = $props();
<\/script>

<ThemeProvider>
  {@render children()}
</ThemeProvider>`}),l(r(w,6),{language:`svelte`,title:`MyComponent.svelte`,code:`<script>
  import { Button, Modal } from '@equaltoai/greater-components/primitives';

  let showModal = false;
<\/script>

<Button onclick={() => (showModal = true)}>
  Open Modal
</Button>

<Modal bind:open={showModal} title="Welcome!">
  <p>This is a modal from Greater Components.</p>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showModal = false)}>Close</Button>
  {/snippet}
</Modal>`}),o(C);var T=r(C,2),E=r(a(T),8);l(E,{language:`json`,title:`tsconfig.json`,code:`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`}),l(r(E,6),{language:`typescript`,code:`import { Button, type ButtonProps } from '@equaltoai/greater-components/primitives';
import type { ThemeConfig } from '@equaltoai/greater-components/tokens';`}),o(T);var D=r(T,2),O=r(a(D),4);u(a(O),{size:20}),i(2),o(O),o(D);var k=r(D,2);l(r(a(k),8),{language:`javascript`,title:`vite.config.js`,code:`export default {
  optimizeDeps: {
    include: [
      '@equaltoai/greater-components/primitives',
      '@equaltoai/greater-components/tokens',
      '@equaltoai/greater-components/icons'
    ]
  }
}`}),o(k),i(2),o(p),n(e,p)}export{p as component};