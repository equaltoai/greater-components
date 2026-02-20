import{a as f,f as h}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as G,s as e,c as t,$ as T,r as i,n as F}from"../chunks/HviJt0eG.js";import{h as P}from"../chunks/BIESLWc2.js";import{C as s}from"../chunks/D4U67pPq.js";var z=h('<meta name="description" content="Learn about animation utilities, transitions, and motion design best practices in Greater Components."/>'),U=h(`<article class="guide-page svelte-19d1qy6"><header><p class="eyebrow svelte-19d1qy6">Guide</p> <h1 class="svelte-19d1qy6">Animations</h1> <p class="lead svelte-19d1qy6">Greater Components includes a set of animation utilities and transition helpers that make it
			easy to add polished motion to your interfaces while respecting user preferences for reduced
			motion.</p></header> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Animation Tokens</h2> <p class="svelte-19d1qy6">Design tokens for consistent animation timing and easing across your application:</p> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Svelte Transitions</h2> <p class="svelte-19d1qy6">Use Svelte's built-in transitions with Greater Components' timing tokens:</p> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Component Animations</h2> <p class="svelte-19d1qy6">Many Greater Components include built-in animations:</p> <h3 class="svelte-19d1qy6">Modal</h3> <!> <h3 class="svelte-19d1qy6">Alert</h3> <!> <h3 class="svelte-19d1qy6">Menu</h3> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Custom Transitions</h2> <p class="svelte-19d1qy6">Create custom transitions using Svelte's transition API:</p> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">CSS Animations</h2> <p class="svelte-19d1qy6">For repeating animations, use CSS keyframes:</p> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Reduced Motion</h2> <p class="svelte-19d1qy6">Always respect user preferences for reduced motion:</p> <!> <h3 class="svelte-19d1qy6">JavaScript Detection</h3> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Performance Best Practices</h2> <ul class="svelte-19d1qy6"><li class="svelte-19d1qy6"><strong>Use transform and opacity</strong> - These properties are GPU-accelerated and don't trigger
				layout recalculations.</li> <li class="svelte-19d1qy6"><strong>Avoid animating layout properties</strong> - Properties like <code class="svelte-19d1qy6">width</code>, <code class="svelte-19d1qy6">height</code>, <code class="svelte-19d1qy6">top</code>, <code class="svelte-19d1qy6">left</code> cause expensive reflows.</li> <li class="svelte-19d1qy6"><strong>Use will-change sparingly</strong> - Only add <code class="svelte-19d1qy6">will-change</code> to elements that
				will actually animate.</li> <li class="svelte-19d1qy6"><strong>Keep durations short</strong> - Most UI animations should be 150-300ms. Longer animations
				feel sluggish.</li> <li class="svelte-19d1qy6"><strong>Test on low-end devices</strong> - Animations that work smoothly on your development machine
				may stutter on mobile devices.</li></ul> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Animation Patterns</h2> <h3 class="svelte-19d1qy6">Staggered Lists</h3> <!> <h3 class="svelte-19d1qy6">Loading Skeleton</h3> <!></section> <section class="svelte-19d1qy6"><h2 class="svelte-19d1qy6">Related Resources</h2> <ul class="svelte-19d1qy6"><li class="svelte-19d1qy6"><a href="/tokens/animations" class="svelte-19d1qy6">Animation Tokens Reference</a> - All animation design tokens</li> <li class="svelte-19d1qy6"><a href="/components/skeleton" class="svelte-19d1qy6">Skeleton Component</a> - Loading placeholder with animations</li> <li class="svelte-19d1qy6"><a href="/components/spinner" class="svelte-19d1qy6">Spinner Component</a> - Animated loading indicator</li> <li class="svelte-19d1qy6"><a href="https://svelte.dev/docs/svelte-transition" class="svelte-19d1qy6">Svelte Transitions</a> - Official Svelte transition
				documentation</li></ul></section></article>`);function Y(q){var n=U();P("19d1qy6",x=>{var R=z();G(()=>{T.title="Animations Guide - Greater Components"}),f(x,R)});var a=e(t(n),2),b=e(t(a),4);s(b,{code:`/* Duration tokens */
--gr-animation-duration-fast: 150ms;
--gr-animation-duration-normal: 300ms;
--gr-animation-duration-slow: 500ms;

/* Easing tokens */
--gr-animation-easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--gr-animation-easing-in: cubic-bezier(0.4, 0, 1, 1);
--gr-animation-easing-out: cubic-bezier(0, 0, 0.2, 1);
--gr-animation-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--gr-animation-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);`,language:"css"}),i(a);var o=e(a,2),k=e(t(o),4);s(k,{code:`<script>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { fade, fly, slide, scale } from 'svelte/transition';
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let visible = $state(false);
<\/script>

<!-- Fade transition -->
{#if visible}
  <div transition:fade={{ duration: 300 }}>
    Fading content
  </div>
{/if}

<!-- Fly transition (slide + fade) -->
{#if visible}
  <div transition:fly={{ y: 20, duration: 300 }}>
    Flying content
  </div>
{/if}

<!-- Scale transition -->
{#if visible}
  <div transition:scale={{ start: 0.95, duration: 200 }}>
    Scaling content
  </div>
{/if}`,language:"svelte"}),i(o);var r=e(o,2),v=e(t(r),6);s(v,{code:`<!-- Modal uses fade + scale by default -->
<Modal bind:open={showModal}>
  Content animates in/out automatically
</Modal>

<!-- Customize animation -->
<Modal 
  bind:open={showModal}
  transition={{ type: 'fly', y: 50 }}
>
  Custom fly animation
</Modal>`,language:"svelte"});var u=e(v,4);s(u,{code:`<!-- Alert uses fade transition -->
<Alert variant="success" dismissible>
  Fades out when dismissed
</Alert>`,language:"svelte"});var w=e(u,4);s(w,{code:`<!-- Menu content animates based on placement -->
<Menu.Root placement="bottom-start">
  <Menu.Trigger>Open</Menu.Trigger>
  <Menu.Content>
    <!-- Slides down from trigger -->
  </Menu.Content>
</Menu.Root>`,language:"svelte"}),i(r);var l=e(r,2),M=e(t(l),4);s(M,{code:`<script>
  import { cubicOut } from 'svelte/easing';

  function slideAndFade(node, { delay = 0, duration = 300 }) {
    return {
      delay,
      duration,
      css: (t) => {
        const eased = cubicOut(t);
        // Return interpolated CSS string
        return 'opacity: ' + eased + '; transform: translateY(' + ((1 - eased) * 20) + 'px);';
      }
    };
  }
<\/script>

{#if visible}
  <div transition:slideAndFade={{ duration: 300 }}>
    Custom animated content
  </div>
{/if}`,language:"svelte"}),i(l);var d=e(l,2),C=e(t(d),4);s(C,{code:`/* Spinner animation */
@keyframes gr-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: gr-spin 1s linear infinite;
}

/* Pulse animation */
@keyframes gr-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  animation: gr-pulse 2s ease-in-out infinite;
}

/* Bounce animation */
@keyframes gr-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.notification-badge {
  animation: gr-bounce 1s ease-in-out;
}`,language:"css"}),i(d);var c=e(d,2),p=e(t(c),4);s(p,{code:`/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Or provide alternative, subtle animations */
@media (prefers-reduced-motion: reduce) {
  .modal {
    /* Replace scale animation with simple fade */
    animation: none;
    opacity: 1;
  }
}`,language:"css"});var _=e(p,4);s(_,{code:`<script>
  import { browser } from '$app/environment';

  const prefersReducedMotion = browser && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Use shorter durations or skip animations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const duration = prefersReducedMotion ? 0 : 300;
<\/script>

{#if visible}
  <div transition:fade={{ duration }}>
    Respects motion preferences
  </div>
{/if}`,language:"svelte"}),i(c);var m=e(c,2),A=e(t(m),4);s(A,{code:`/* Good: GPU-accelerated properties */
.animated {
  transition: transform 300ms, opacity 300ms;
}

.animated:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Avoid: Layout-triggering properties */
.animated-bad {
  transition: width 300ms, margin 300ms;
}

.animated-bad:hover {
  width: 110%;
  margin: 10px;
}`,language:"css"}),i(m);var g=e(m,2),y=e(t(g),4);s(y,{code:`<script>
  import { fly } from 'svelte/transition';
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
<\/script>

<ul>
  {#each items as item, i (item)}
    <li transition:fly={{ y: 20, delay: i * 50 }}>
      {item}
    </li>
  {/each}
</ul>`,language:"svelte"});var S=e(y,4);s(S,{code:`<div class="skeleton-container">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text short"></div>
</div>

<style>
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--gr-color-gray-200) 25%,
      var(--gr-color-gray-100) 50%,
      var(--gr-color-gray-200) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>`,language:"svelte"}),i(g),F(2),i(n),f(q,n)}export{Y as component};
