import{a as m,f as v}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as S,s as e,c as t,$ as y,r as l,n as d}from"../chunks/HviJt0eG.js";import{h as f}from"../chunks/BIESLWc2.js";import{C as s}from"../chunks/D4U67pPq.js";var P=v('<meta name="description" content="Strict CSP compatibility for Greater Components: no inline styles/scripts, CSP-safe customization patterns, and a compatibility matrix."/>'),x=v(`<article class="guide-page svelte-rl24im"><header><p class="eyebrow svelte-rl24im">Guide</p> <h1 class="svelte-rl24im">CSP Compatibility</h1> <p class="lead svelte-rl24im">Lesser deployments run with a strict Content Security Policy (CSP). This guide explains what’s
			blocked, what Greater Components guarantees, and the CSP-safe patterns to use for
			customization.</p></header> <section class="svelte-rl24im"><h2 class="svelte-rl24im">What Strict CSP Blocks</h2> <p class="svelte-rl24im">In strict CSP environments, the browser blocks inline JavaScript and inline CSS unless the CSP
			allows it explicitly (usually via nonces or hashes). Lesser’s policy is strict enough that you
			should assume inline output is not permitted.</p> <ul class="svelte-rl24im"><li class="svelte-rl24im"><strong>Inline scripts</strong>: <code class="svelte-rl24im">&lt;script&gt;...&lt;/script&gt;</code> without <code class="svelte-rl24im">src</code></li> <li class="svelte-rl24im"><strong>Inline styles</strong>: any <code class="svelte-rl24im">style="..."</code> attribute (style hashes do not
				apply to style attributes without <code class="svelte-rl24im">'unsafe-hashes'</code>)</li></ul></section> <section class="svelte-rl24im"><h2 class="svelte-rl24im">Greater Components CSP Contract</h2> <p class="svelte-rl24im">Greater Components is designed to be strict-CSP compatible by default:</p> <ul class="svelte-rl24im"><li class="svelte-rl24im"><strong>No shipped components emit</strong> <code class="svelte-rl24im">style="..."</code> attributes.</li> <li class="svelte-rl24im"><strong>No shipped components emit</strong> inline <code class="svelte-rl24im">&lt;script&gt;</code> tags.</li> <li class="svelte-rl24im"><strong>The <code class="svelte-rl24im">style</code> prop is not supported</strong> on shipped components; use <code class="svelte-rl24im">class</code> and external CSS.</li></ul> <!></section> <section class="svelte-rl24im"><h2 class="svelte-rl24im">Compatibility Matrix (Primitives)</h2> <p class="svelte-rl24im">These primitives are CSP-safe by default. Customization is via presets and classes.</p> <table class="matrix svelte-rl24im" aria-label="CSP compatibility matrix"><thead class="svelte-rl24im"><tr><th scope="col" class="svelte-rl24im">Component</th><th scope="col" class="svelte-rl24im">Status</th><th scope="col" class="svelte-rl24im">CSP-safe approach</th></tr></thead><tbody class="svelte-rl24im"><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">Skeleton</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Preset <code class="svelte-rl24im">width</code>/<code class="svelte-rl24im">height</code> + custom sizing via classes</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">Avatar</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Deterministic palette classes (no dynamic inline colors)</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">Text</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Bounded clamp classes (<code class="svelte-rl24im">lines</code> 2–6) + custom clamp via classes</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">Container</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Preset gutters + custom gutter via external CSS variables on a class</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">ThemeProvider</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Preset palette/fonts + custom theming via class-based CSS variables</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">Section</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Preset spacing/background + custom styling via classes</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">ThemeSwitcher</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Preset previews (no inline preview colors)</td></tr><tr class="svelte-rl24im"><th scope="row" class="svelte-rl24im">Tooltip</th><td class="svelte-rl24im">✅</td><td class="svelte-rl24im">Class-based placement (no pixel style injection)</td></tr></tbody></table></section> <section class="svelte-rl24im"><h2 class="svelte-rl24im">CSP-Safe Customization Patterns</h2> <h3 class="svelte-rl24im">Skeleton sizing</h3> <!> <h3 class="svelte-rl24im">Text clamping</h3> <!> <h3 class="svelte-rl24im">Custom container gutters</h3> <!></section> <section class="svelte-rl24im"><h2 class="svelte-rl24im">Validation</h2> <p class="svelte-rl24im">The repository includes a CSP audit script that scans shipped Svelte templates and built
			output:</p> <!> <p class="svelte-rl24im">It fails CI if any shipped templates emit inline styles, or if the docs/playground build
			output contains inline <code class="svelte-rl24im">&lt;script&gt;</code> tags or <code class="svelte-rl24im">style="..."</code> attributes.</p></section> <section class="svelte-rl24im"><h2 class="svelte-rl24im">Next</h2> <p class="svelte-rl24im">See <a href="/guides/csp-migration" class="svelte-rl24im">CSP Migration Guide</a> for concrete before/after examples for
			breaking changes.</p></section></article>`);function G(p){var i=x();f("rl24im",C=>{var b=P();S(()=>{y.title="CSP Compatibility - Greater Components"}),m(C,b)});var a=e(t(i),4),h=e(t(a),6);s(h,{title:"CSP-safe styling: class + external CSS",language:"svelte",code:`<!-- ✅ CSP-safe: use class -->
<Button class="brand-button">Continue</Button>

<style>
  :global(.brand-button) {
    --gr-button-bg: var(--gr-color-primary-600);
    --gr-button-bg-hover: var(--gr-color-primary-700);
  }
</style>`}),l(a);var r=e(a,4),o=e(t(r),4);s(o,{language:"svelte",code:`<!-- Presets -->
<Skeleton width="full" height="md" />
<Skeleton width="1/2" height="lg" />

<!-- Custom sizes via external CSS -->
<Skeleton class="my-skeleton" />

<style>
  :global(.my-skeleton) {
    width: 280px;
    height: 80px;
  }
</style>`});var c=e(o,4);s(c,{language:"svelte",code:`<!-- Supported clamp range (2–6) -->
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
</style>`});var u=e(c,4);s(u,{language:"svelte",code:`<!-- Presets -->
<Container gutter="md">…</Container>

<!-- Custom gutter via external CSS variable -->
<Container class="custom-gutter">…</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>`}),l(r);var n=e(r,2),g=e(t(n),4);s(g,{language:"bash",code:"pnpm validate:csp"}),d(2),l(n),d(2),l(i),m(p,i)}export{G as component};
