<script>
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Animations Guide - Greater Components</title>
	<meta
		name="description"
		content="Learn about animation utilities, transitions, and motion design best practices in Greater Components."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>Animations</h1>
		<p class="lead">
			Greater Components includes a set of animation utilities and transition helpers that make it
			easy to add polished motion to your interfaces while respecting user preferences for reduced
			motion.
		</p>
	</header>

	<section>
		<h2>Animation Tokens</h2>
		<p>Design tokens for consistent animation timing and easing across your application:</p>

		<CodeExample
			code={`/* Duration tokens */
--gr-animation-duration-fast: 150ms;
--gr-animation-duration-normal: 300ms;
--gr-animation-duration-slow: 500ms;

/* Easing tokens */
--gr-animation-easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--gr-animation-easing-in: cubic-bezier(0.4, 0, 1, 1);
--gr-animation-easing-out: cubic-bezier(0, 0, 0.2, 1);
--gr-animation-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--gr-animation-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);`}
			language="css"
		/>
	</section>

	<section>
		<h2>Svelte Transitions</h2>
		<p>Use Svelte's built-in transitions with Greater Components' timing tokens:</p>

		<CodeExample
			code={`<script>
  import { fade, fly, slide, scale } from 'svelte/transition';
  
  let visible = $state(false);
</script>

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
{/if}`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Component Animations</h2>
		<p>Many Greater Components include built-in animations:</p>

		<h3>Modal</h3>
		<CodeExample
			code={`<!-- Modal uses fade + scale by default -->
<Modal bind:open={showModal}>
  Content animates in/out automatically
</Modal>

<!-- Customize animation -->
<Modal 
  bind:open={showModal}
  transition={{ type: 'fly', y: 50 }}
>
  Custom fly animation
</Modal>`}
			language="svelte"
		/>

		<h3>Alert</h3>
		<CodeExample
			code={`<!-- Alert uses fade transition -->
<Alert variant="success" dismissible>
  Fades out when dismissed
</Alert>`}
			language="svelte"
		/>

		<h3>Menu</h3>
		<CodeExample
			code={`<!-- Menu content animates based on placement -->
<Menu.Root placement="bottom-start">
  <Menu.Trigger>Open</Menu.Trigger>
  <Menu.Content>
    <!-- Slides down from trigger -->
  </Menu.Content>
</Menu.Root>`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Custom Transitions</h2>
		<p>Create custom transitions using Svelte's transition API:</p>

		<CodeExample
			code={`<script>
  import { cubicOut } from 'svelte/easing';

  function slideAndFade(node, { delay = 0, duration = 300 }) {
    return {
      delay,
      duration,
      css: (t) => {
        const eased = cubicOut(t);
        return \`
          opacity: \${eased};
          transform: translateY(\${(1 - eased) * 20}px);
        \`;
      }
    };
  }
</script>

{#if visible}
  <div transition:slideAndFade={{ duration: 300 }}>
    Custom animated content
  </div>
{/if}`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>CSS Animations</h2>
		<p>For repeating animations, use CSS keyframes:</p>

		<CodeExample
			code={`/* Spinner animation */
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
}`}
			language="css"
		/>
	</section>

	<section>
		<h2>Reduced Motion</h2>
		<p>Always respect user preferences for reduced motion:</p>

		<CodeExample
			code={`/* Disable animations for users who prefer reduced motion */
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
}`}
			language="css"
		/>

		<h3>JavaScript Detection</h3>
		<CodeExample
			code={`<script>
  import { browser } from '$app/environment';

  const prefersReducedMotion = browser && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Use shorter durations or skip animations
  const duration = prefersReducedMotion ? 0 : 300;
</script>

{#if visible}
  <div transition:fade={{ duration }}>
    Respects motion preferences
  </div>
{/if}`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Performance Best Practices</h2>
		<ul>
			<li>
				<strong>Use transform and opacity</strong> - These properties are GPU-accelerated and don't trigger
				layout recalculations.
			</li>
			<li>
				<strong>Avoid animating layout properties</strong> - Properties like <code>width</code>,
				<code>height</code>, <code>top</code>, <code>left</code> cause expensive reflows.
			</li>
			<li>
				<strong>Use will-change sparingly</strong> - Only add <code>will-change</code> to elements that
				will actually animate.
			</li>
			<li>
				<strong>Keep durations short</strong> - Most UI animations should be 150-300ms. Longer animations
				feel sluggish.
			</li>
			<li>
				<strong>Test on low-end devices</strong> - Animations that work smoothly on your development
				machine may stutter on mobile devices.
			</li>
		</ul>

		<CodeExample
			code={`/* Good: GPU-accelerated properties */
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
}`}
			language="css"
		/>
	</section>

	<section>
		<h2>Animation Patterns</h2>

		<h3>Staggered Lists</h3>
		<CodeExample
			code={`<script>
  import { fly } from 'svelte/transition';
  
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
</script>

<ul>
  {#each items as item, i (item)}
    <li transition:fly={{ y: 20, delay: i * 50 }}>
      {item}
    </li>
  {/each}
</ul>`}
			language="svelte"
		/>

		<h3>Loading Skeleton</h3>
		<CodeExample
			code={`<div class="skeleton-container">
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
</style>`}
			language="svelte"
		/>
	</section>

	<section>
		<h2>Related Resources</h2>
		<ul>
			<li>
				<a href="/tokens/animations">Animation Tokens Reference</a> - All animation design tokens
			</li>
			<li>
				<a href="/components/skeleton">Skeleton Component</a> - Loading placeholder with animations
			</li>
			<li><a href="/components/spinner">Spinner Component</a> - Animated loading indicator</li>
			<li>
				<a href="https://svelte.dev/docs/svelte-transition">Svelte Transitions</a> - Official Svelte
				transition documentation
			</li>
		</ul>
	</section>
</article>

<style>
	.guide-page {
		max-width: 800px;
		margin: 0 auto;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-action-primary-default);
		margin: 0 0 0.5rem;
	}

	h1 {
		font-size: var(--gr-typography-fontSize-4xl);
		margin: 0 0 1rem;
	}

	.lead {
		font-size: var(--gr-typography-fontSize-lg);
		color: var(--gr-semantic-foreground-secondary);
		margin: 0 0 2rem;
		line-height: 1.6;
	}

	section {
		margin-bottom: 3rem;
	}

	h2 {
		font-size: var(--gr-typography-fontSize-2xl);
		margin: 0 0 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--gr-semantic-border-default);
	}

	h3 {
		font-size: var(--gr-typography-fontSize-lg);
		margin: 1.5rem 0 0.75rem;
	}

	p {
		margin: 0 0 1rem;
		line-height: 1.6;
	}

	ul {
		margin: 0 0 1rem;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
		font-size: 0.9em;
	}

	a {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
