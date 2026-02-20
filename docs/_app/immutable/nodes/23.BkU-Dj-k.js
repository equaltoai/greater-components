import{a as k,f as C}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as A,s as e,c as t,$ as D,r as s,n as o}from"../chunks/HviJt0eG.js";import{h as O}from"../chunks/BIESLWc2.js";import{C as a}from"../chunks/D4U67pPq.js";import{A as U}from"../chunks/DRLcWBOK.js";var L=C('<meta name="description" content="Learn how to install and set up Greater Components in your Svelte application."/>'),V=C(`<article class="installation-page svelte-t06thp"><h1>Installation</h1> <p class="lead svelte-t06thp">Get started with Greater Components in your Svelte application.</p> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Prerequisites</h2> <ul><li>Node.js 20.0 or later</li> <li>Svelte 5.0 or later</li> <li>TypeScript 5.0 or later (optional but recommended)</li></ul></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Installation</h2> <h3 class="svelte-t06thp">Using the CLI (recommended)</h3> <!> <h3 class="svelte-t06thp">Using npm/pnpm (umbrella package)</h3> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Individual Packages</h2> <p>You can install packages individually based on your needs:</p> <div class="package-list svelte-t06thp"><div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Core Components</h4> <!> <p class="svelte-t06thp">Essential UI components like Button, Modal, TextField, etc.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Design Tokens</h4> <!> <p class="svelte-t06thp">Design tokens for theming and consistent styling.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Icons</h4> <!> <p class="svelte-t06thp">Comprehensive icon library with 200+ SVG icons.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Content Rendering</h4> <!> <p class="svelte-t06thp">Markdown + syntax highlighting components (CodeBlock, MarkdownRenderer).</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Utilities</h4> <!> <p class="svelte-t06thp">Helper functions and utilities.</p></div></div></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Basic Setup</h2> <h3 class="svelte-t06thp">1. Import CSS</h3> <p>Import tokens first, then primitives, then face styles (if used):</p> <!> <h3 class="svelte-t06thp">2. Use components</h3> <p>Import and use components in your Svelte files:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">TypeScript Setup</h2> <p>Greater Components is written in TypeScript and provides full type definitions.</p> <h3 class="svelte-t06thp">Configure TypeScript</h3> <p>Ensure your <code>tsconfig.json</code> includes the following:</p> <!> <h3 class="svelte-t06thp">Type imports</h3> <p>Import types alongside components:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Vite Configuration</h2> <p>If you're using Vite, no additional configuration is required. The packages are optimized for
			Vite out of the box.</p> <div class="note svelte-t06thp"><!> <div><strong class="svelte-t06thp">Note:</strong> If you encounter issues with SSR, ensure you have the latest version
				of <code>@sveltejs/vite-plugin-svelte</code>.</div></div></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">SvelteKit Configuration</h2> <p>For SvelteKit projects, the components work seamlessly with SSR enabled.</p> <h3 class="svelte-t06thp">Optimize dependencies</h3> <p>Add Greater Components to the optimized dependencies in your <code>vite.config.js</code>:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Next Steps</h2> <ul class="next-steps-list svelte-t06thp"><li class="svelte-t06thp"><a href="/guides/theming" class="svelte-t06thp">Learn about theming</a> - Customize the look and feel</li> <li class="svelte-t06thp"><a href="/components" class="svelte-t06thp">Browse components</a> - Explore available components</li> <li class="svelte-t06thp"><a href="/guides/typescript" class="svelte-t06thp">TypeScript guide</a> - Advanced TypeScript usage</li> <li class="svelte-t06thp"><a href="/guides/accessibility" class="svelte-t06thp">Accessibility guide</a> - Best practices for a11y</li></ul></section></article>`);function X(q){var i=V();O("t06thp",E=>{var P=L();A(()=>{D.title="Installation - Greater Components"}),k(E,P)});var l=e(t(i),6),g=e(t(l),4);a(g,{language:"bash",code:`# Install the CLI from GitHub Releases
# Replace \`greater-vX.Y.Z\` with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz

# Initialize config + CSS injection
greater init --face social

# Install the Social face bundle
greater add faces/social`});var I=e(g,4);a(I,{language:"bash",code:"pnpm add @equaltoai/greater-components"}),s(l);var n=e(l,2),u=e(t(n),4),p=t(u),w=e(t(p),2);a(w,{language:"bash",code:"npm install @equaltoai/greater-components-primitives"}),o(2),s(p);var r=e(p,2),T=e(t(r),2);a(T,{language:"bash",code:"npm install @equaltoai/greater-components-tokens"}),o(2),s(r);var c=e(r,2),M=e(t(c),2);a(M,{language:"bash",code:"npm install @equaltoai/greater-components-icons"}),o(2),s(c);var h=e(c,2),B=e(t(h),2);a(B,{language:"bash",code:"npm install @equaltoai/greater-components-content"}),o(2),s(h);var f=e(h,2),j=e(t(f),2);a(j,{language:"bash",code:"npm install @equaltoai/greater-components-utils"}),o(2),s(f),s(u),s(n);var v=e(n,2),y=e(t(v),6);a(y,{language:"svelte",title:"+layout.svelte",code:`<script lang="ts">
  import '@equaltoai/greater-components/tokens/theme.css';
  import '@equaltoai/greater-components/primitives/style.css';
  import '@equaltoai/greater-components/faces/social/style.css';

  import { ThemeProvider } from '@equaltoai/greater-components/primitives';

  let { children } = $props();
<\/script>

<ThemeProvider>
  {@render children()}
</ThemeProvider>`});var x=e(y,6);a(x,{language:"svelte",title:"MyComponent.svelte",code:`<script>
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
</Modal>`}),s(v);var d=e(v,2),S=e(t(d),8);a(S,{language:"json",title:"tsconfig.json",code:`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`});var G=e(S,6);a(G,{language:"typescript",code:`import { Button, type ButtonProps } from '@equaltoai/greater-components/primitives';
import type { ThemeConfig } from '@equaltoai/greater-components/tokens';`}),s(d);var m=e(d,2),_=e(t(m),4),z=t(_);U(z,{size:20}),o(2),s(_),s(m);var b=e(m,2),R=e(t(b),8);a(R,{language:"javascript",title:"vite.config.js",code:`export default {
  optimizeDeps: {
    include: [
      '@equaltoai/greater-components/primitives',
      '@equaltoai/greater-components/tokens',
      '@equaltoai/greater-components/icons'
    ]
  }
}`}),s(b),o(2),s(i),k(q,i)}export{X as component};
