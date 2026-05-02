import{D as e,G as t,T as n,Y as r,lt as i,q as a,ut as o,v as s,z as c}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as l}from"../chunks/D7myQBsm.js";var u=e(`<meta name="description" content="Migration guide for strict CSP compatibility: Skeleton sizing, Text clamping, Container gutters, and Avatar placeholder colors."/>`),d=e(`<article class="guide-page svelte-nw4cuu"><header><p class="eyebrow svelte-nw4cuu">Guide</p> <h1 class="svelte-nw4cuu">CSP Migration Guide</h1> <p class="lead svelte-nw4cuu">If you’re upgrading from older Greater Components versions that allowed per-instance styling,
			these are the key breaking changes for strict CSP compatibility.</p></header> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">1) Skeleton: Preset Sizing</h2> <p class="svelte-nw4cuu">Strict CSP blocks <code class="svelte-nw4cuu">style="..."</code>, so Skeleton no longer supports arbitrary
			width/height values.</p> <!> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">2) Text: Bounded Line Clamping</h2> <p class="svelte-nw4cuu">Multi-line clamping is now class-based. <code class="svelte-nw4cuu">lines</code> supports 2–6 for CSP-safe presets.</p> <!> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">3) Container: Preset Gutters + External Custom Gutter</h2> <p class="svelte-nw4cuu">Container gutters are preset-only. For a custom gutter, set <code class="svelte-nw4cuu">--gr-container-custom-gutter</code> via external CSS on a class.</p> <!> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">4) Avatar: Deterministic Placeholder Colors</h2> <p class="svelte-nw4cuu">Avatar placeholder colors no longer use per-instance inline CSS. Instead, the component maps
			name/label to a deterministic palette class (stable across sessions).</p> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">5) Remove Any Use of the style Prop</h2> <p class="svelte-nw4cuu">Shipped Greater components do not support a <code class="svelte-nw4cuu">style</code> prop under strict CSP. If you were
			using it for token overrides, move those overrides into external CSS classes.</p> <!></section> <section class="svelte-nw4cuu"><h2 class="svelte-nw4cuu">Next</h2> <p class="svelte-nw4cuu">See <a href="/guides/csp-compatibility" class="svelte-nw4cuu">CSP Compatibility</a> for the full strict-CSP contract and
			a component matrix.</p></section></article>`);function f(e){var f=d();s(`nw4cuu`,e=>{var r=u();c(()=>{t.title=`CSP Migration Guide - Greater Components`}),n(e,r)});var p=r(a(f),2),m=r(a(p),4);l(m,{title:`Before`,language:`svelte`,code:`<!-- ❌ Before: arbitrary sizing -->
<Skeleton width="250px" height="80px" />
<Skeleton width={customWidth} height={customHeight} />`}),l(r(m,2),{title:`After`,language:`svelte`,code:`<!-- ✅ After: presets -->
<Skeleton width="full" height="md" />
<Skeleton width="1/2" height="lg" />

<!-- ✅ Custom sizes via external CSS -->
<Skeleton class="my-skeleton" />

<style>
  :global(.my-skeleton) {
    width: 250px;
    height: 80px;
  }
</style>`}),o(p);var h=r(p,2),g=r(a(h),4);l(g,{title:`Before`,language:`svelte`,code:`<!-- ❌ Before: per-instance line clamps via inline CSS -->
<Text truncate lines={10}>…</Text>
<Text truncate lines={dynamicLines}>…</Text>`}),l(r(g,2),{title:`After`,language:`svelte`,code:`<!-- ✅ After: presets (2–6) -->
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
</style>`}),o(h);var _=r(h,2),v=r(a(_),4);l(v,{title:`Before`,language:`svelte`,code:`<!-- ❌ Before: custom gutter values -->
<Container gutter="2.5rem">…</Container>
<Container gutter={customGutter}>…</Container>`}),l(r(v,2),{title:`After`,language:`svelte`,code:`<!-- ✅ After: presets -->
<Container gutter="md">…</Container>
<Container gutter="lg">…</Container>

<!-- ✅ Custom gutter via external CSS -->
<Container class="custom-gutter">…</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>`}),o(_);var y=r(_,2);l(r(a(y),4),{language:`svelte`,code:`<!-- ✅ No API change required -->
<Avatar name="Jane Doe" />

<!-- Placeholder color is now deterministic -->
<!-- e.g., gr-avatar--color-0 ... gr-avatar--color-11 -->`}),o(y);var b=r(y,2);l(r(a(b),4),{language:`svelte`,code:`<!-- ✅ Use class-based overrides -->
<Button class="brand-button">Continue</Button>

<style>
  :global(.brand-button) {
    --gr-button-bg: var(--gr-color-primary-600);
    --gr-button-bg-hover: var(--gr-color-primary-700);
  }
</style>`}),o(b),i(2),o(f),n(e,f)}export{f as component};