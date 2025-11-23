import"../chunks/DsnmJJEf.js";import"../chunks/BPH5uCMF.js";import{f as T,a as C,e as O,s as e,g as t,$ as F,i as s,n as a}from"../chunks/Dj2W9Ds7.js";import{h as V}from"../chunks/BwUPJ2kj.js";import{C as o}from"../chunks/CBocy8rB.js";import{A as N}from"../chunks/DkgvFiVh.js";var R=T('<meta name="description" content="Learn how to install and set up Greater Components in your Svelte application."/>'),K=T(`<article class="installation-page svelte-t06thp"><h1>Installation</h1> <p class="lead svelte-t06thp">Get started with Greater Components in your Svelte application.</p> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Prerequisites</h2> <ul><li>Node.js 18.0 or later</li> <li>Svelte 5.0 or later (for optimal compatibility)</li> <li>TypeScript 5.0 or later (optional but recommended)</li></ul></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Package Installation</h2> <h3 class="svelte-t06thp">Using npm</h3> <!> <h3 class="svelte-t06thp">Using pnpm</h3> <!> <h3 class="svelte-t06thp">Using yarn</h3> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Individual Packages</h2> <p>You can install packages individually based on your needs:</p> <div class="package-list svelte-t06thp"><div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Core Components</h4> <!> <p class="svelte-t06thp">Essential UI components like Button, Modal, TextField, etc.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Design Tokens</h4> <!> <p class="svelte-t06thp">Design tokens for theming and consistent styling.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Icons</h4> <!> <p class="svelte-t06thp">Comprehensive icon library with 200+ SVG icons.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Fediverse Components</h4> <!> <p class="svelte-t06thp">Specialized components for social platforms.</p></div> <div class="package-item svelte-t06thp"><h4 class="svelte-t06thp">Utilities</h4> <!> <p class="svelte-t06thp">Helper functions and utilities.</p></div></div></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Basic Setup</h2> <h3 class="svelte-t06thp">1. Import the CSS tokens</h3> <p>Add the token imports (theme + high contrast) to your global CSS file or app layout:</p> <!> <h3 class="svelte-t06thp">2. Set up the Theme Provider</h3> <p>Wrap your app with the ThemeProvider for theme management:</p> <!> <h3 class="svelte-t06thp">3. Use components</h3> <p>Import and use components in your Svelte files:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">TypeScript Setup</h2> <p>Greater Components is written in TypeScript and provides full type definitions.</p> <h3 class="svelte-t06thp">Configure TypeScript</h3> <p>Ensure your <code>tsconfig.json</code> includes the following:</p> <!> <h3 class="svelte-t06thp">Type imports</h3> <p>Import types alongside components:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Vite Configuration</h2> <p>If you're using Vite, no additional configuration is required. The packages are optimized for
			Vite out of the box.</p> <div class="note svelte-t06thp"><!> <div><strong class="svelte-t06thp">Note:</strong> If you encounter issues with SSR, ensure you have the latest version
				of <code>@sveltejs/vite-plugin-svelte</code>.</div></div></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">SvelteKit Configuration</h2> <p>For SvelteKit projects, the components work seamlessly with SSR enabled.</p> <h3 class="svelte-t06thp">Optimize dependencies</h3> <p>Add Greater Components to the optimized dependencies in your <code>vite.config.js</code>:</p> <!></section> <section class="svelte-t06thp"><h2 class="svelte-t06thp">Next Steps</h2> <ul class="next-steps-list svelte-t06thp"><li class="svelte-t06thp"><a href="/guides/theming" class="svelte-t06thp">Learn about theming</a> - Customize the look and feel</li> <li class="svelte-t06thp"><a href="/components" class="svelte-t06thp">Browse components</a> - Explore available components</li> <li class="svelte-t06thp"><a href="/guides/typescript" class="svelte-t06thp">TypeScript guide</a> - Advanced TypeScript usage</li> <li class="svelte-t06thp"><a href="/guides/accessibility" class="svelte-t06thp">Accessibility guide</a> - Best practices for a11y</li></ul></section></article>`);function Q(w){var i=K();V("t06thp",U=>{var D=R();O(()=>{F.title="Installation - Greater Components"}),C(U,D)});var l=e(t(i),6),u=e(t(l),4);o(u,{language:"bash",code:"npm install @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens"});var g=e(u,4);o(g,{language:"bash",code:"pnpm add @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens"});var I=e(g,4);o(I,{language:"bash",code:"yarn add @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens"}),s(l);var n=e(l,2),f=e(t(n),4),p=t(f),M=e(t(p),2);o(M,{language:"bash",code:"npm install @equaltoai/greater-components-primitives"}),a(2),s(p);var r=e(p,2),x=e(t(r),2);o(x,{language:"bash",code:"npm install @equaltoai/greater-components-tokens"}),a(2),s(r);var c=e(r,2),j=e(t(c),2);o(j,{language:"bash",code:"npm install @equaltoai/greater-components-icons"}),a(2),s(c);var h=e(c,2),B=e(t(h),2);o(B,{language:"bash",code:"npm install @equaltoai/greater-components-fediverse"}),a(2),s(h);var y=e(h,2),P=e(t(y),2);o(P,{language:"bash",code:"npm install @equaltoai/greater-components-utils"}),a(2),s(y),s(f),s(n);var v=e(n,2),_=e(t(v),6);o(_,{language:"css",title:"app.css",code:`/* Import design tokens */
@import '@equaltoai/greater-components-tokens/theme.css';
@import '@equaltoai/greater-components-tokens/high-contrast.css';`});var S=e(_,6);o(S,{language:"svelte",title:"+layout.svelte",code:`<script>
  import { ThemeProvider } from '@equaltoai/greater-components-primitives';
<\/script>

<ThemeProvider>
  <slot />
</ThemeProvider>`});var G=e(S,6);o(G,{language:"svelte",title:"MyComponent.svelte",code:`<script>
  import { Button, TextField, Modal } from '@equaltoai/greater-components-primitives';
  
  let showModal = false;
<\/script>

<Button on:click={() => showModal = true}>
  Open Modal
</Button>

<Modal bind:open={showModal}>
  <h2 slot="header">Welcome!</h2>
  <p>This is a modal from Greater Components.</p>
</Modal>`}),s(v);var d=e(v,2),k=e(t(d),8);o(k,{language:"json",title:"tsconfig.json",code:`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`});var z=e(k,6);o(z,{language:"typescript",code:`import { Button, type ButtonProps } from '@equaltoai/greater-components-primitives';
import type { ThemeConfig } from '@equaltoai/greater-components-tokens';`}),s(d);var m=e(d,2),b=e(t(m),4),A=t(b);N(A,{size:20}),a(2),s(b),s(m);var q=e(m,2),E=e(t(q),8);o(E,{language:"javascript",title:"vite.config.js",code:`export default {
  optimizeDeps: {
    include: [
      '@equaltoai/greater-components-primitives',
      '@equaltoai/greater-components-tokens',
      '@equaltoai/greater-components-icons'
    ]
  }
}`}),s(q),a(2),s(i),C(w,i)}export{Q as component};
