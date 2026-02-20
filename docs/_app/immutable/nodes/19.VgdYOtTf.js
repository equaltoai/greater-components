import{a as g,f as v}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as x,s as e,c as s,$ as k,r as a,n as P}from"../chunks/HviJt0eG.js";import{h as _}from"../chunks/BIESLWc2.js";import{C as t}from"../chunks/D4U67pPq.js";var A=v('<meta name="description" content="Migration guide for strict CSP compatibility: Skeleton sizing, Text clamping, Container gutters, and Avatar placeholder colors."/>'),T=v(`<article class="guide-page svelte-nw4cuu"><header><p class="eyebrow svelte-nw4cuu">Guide</p> <h1 class="svelte-nw4cuu">CSP Migration Guide</h1> <p class="lead svelte-nw4cuu">If you’re upgrading from older Greater Components versions that allowed per-instance styling,
			these are the key breaking changes for strict CSP compatibility.</p></header> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">1) Skeleton: Preset Sizing</h2> <p class="svelte-nw4cuu">Strict CSP blocks <code class="svelte-nw4cuu">style="..."</code>, so Skeleton no longer supports arbitrary
			width/height values.</p> <!> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">2) Text: Bounded Line Clamping</h2> <p class="svelte-nw4cuu">Multi-line clamping is now class-based. <code class="svelte-nw4cuu">lines</code> supports 2–6 for CSP-safe presets.</p> <!> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">3) Container: Preset Gutters + External Custom Gutter</h2> <p class="svelte-nw4cuu">Container gutters are preset-only. For a custom gutter, set <code class="svelte-nw4cuu">--gr-container-custom-gutter</code> via external CSS on a class.</p> <!> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">4) Avatar: Deterministic Placeholder Colors</h2> <p class="svelte-nw4cuu">Avatar placeholder colors no longer use per-instance inline CSS. Instead, the component maps
			name/label to a deterministic palette class (stable across sessions).</p> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">5) Remove Any Use of the style Prop</h2> <p class="svelte-nw4cuu">Shipped Greater components do not support a <code class="svelte-nw4cuu">style</code> prop under strict CSP. If you were
			using it for token overrides, move those overrides into external CSS classes.</p> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">Next</h2> <p class="svelte-nw4cuu">See <a href="/guides/csp-compatibility" class="svelte-nw4cuu">CSP Compatibility</a> for the full strict-CSP contract and
			a component matrix.</p></section></article>`);function D(m){var n=T();_("nw4cuu",b=>{var y=A();x(()=>{k.title="CSP Migration Guide - Greater Components"}),g(b,y)});var o=e(s(n),2),i=e(s(o),4);t(i,{title:"Before",language:"svelte",code:`<!-- ❌ Before: arbitrary sizing -->
<Skeleton width="250px" height="80px" />
<Skeleton width={customWidth} height={customHeight} />`});var h=e(i,2);t(h,{title:"After",language:"svelte",code:`<!-- ✅ After: presets -->
<Skeleton width="full" height="md" />
<Skeleton width="1/2" height="lg" />

<!-- ✅ Custom sizes via external CSS -->
<Skeleton class="my-skeleton" />

<style>
  :global(.my-skeleton) {
    width: 250px;
    height: 80px;
  }
</style>`}),a(o);var r=e(o,2),u=e(s(r),4);t(u,{title:"Before",language:"svelte",code:`<!-- ❌ Before: per-instance line clamps via inline CSS -->
<Text truncate lines={10}>…</Text>
<Text truncate lines={dynamicLines}>…</Text>`});var w=e(u,2);t(w,{title:"After",language:"svelte",code:`<!-- ✅ After: presets (2–6) -->
<Text truncate lines={3}>…</Text>

<!-- ✅ Custom clamp via external CSS -->
<Text truncate class="clamp-10">…</Text>

<style>
  :global(.clamp-10) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
</style>`}),a(r);var l=e(r,2),p=e(s(l),4);t(p,{title:"Before",language:"svelte",code:`<!-- ❌ Before: custom gutter values -->
<Container gutter="2.5rem">…</Container>
<Container gutter={customGutter}>…</Container>`});var C=e(p,2);t(C,{title:"After",language:"svelte",code:`<!-- ✅ After: presets -->
<Container gutter="md">…</Container>
<Container gutter="lg">…</Container>

<!-- ✅ Custom gutter via external CSS -->
<Container class="custom-gutter">…</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>`}),a(l);var c=e(l,2),f=e(s(c),4);t(f,{language:"svelte",code:`<!-- ✅ No API change required -->
<Avatar name="Jane Doe" />

<!-- Placeholder color is now deterministic -->
<!-- e.g., gr-avatar--color-0 ... gr-avatar--color-11 -->`}),a(c);var d=e(c,2),S=e(s(d),4);t(S,{language:"svelte",code:`<!-- ✅ Use class-based overrides -->
<Button class="brand-button">Continue</Button>

<style>
  :global(.brand-button) {
    --gr-button-bg: var(--gr-color-primary-600);
    --gr-button-bg-hover: var(--gr-color-primary-700);
  }
</style>`}),a(d),P(2),a(n),g(m,n)}export{D as component};
