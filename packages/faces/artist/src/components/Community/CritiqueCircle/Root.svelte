<!--
CritiqueCircle.Root - Container compound component for critique circles

Implements REQ-COMM-001: Critique Circles
- Opt-in critique requests with specific questions
- Credentialed critics (verified educators/professionals)
- Anonymous feedback option

@component
@example
```svelte
<CritiqueCircle.Root {circle} membership="member" {handlers}>
  <CritiqueCircle.Queue />
  <CritiqueCircle.Session />
  <CritiqueCircle.History />
  <CritiqueCircle.Members />
</CritiqueCircle.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createCritiqueCircleContext, type MembershipStatus } from './context.js';
	import type { CritiqueCircleData, CritiqueCircleHandlers } from '../../../types/community.js';

	interface Props {
		/**
		 * Critique circle data
		 */
		circle: CritiqueCircleData;

		/**
		 * User's membership status
		 */
		membership?: MembershipStatus;

		/**
		 * Event handlers
		 */
		handlers?: CritiqueCircleHandlers;

		/**
		 * Show queue panel
		 */
		showQueue?: boolean;

		/**
		 * Show session panel
		 */
		showSession?: boolean;

		/**
		 * Show history panel
		 */
		showHistory?: boolean;

		/**
		 * Show members panel
		 */
		showMembers?: boolean;

		/**
		 * Enable anonymous feedback
		 */
		enableAnonymousFeedback?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Child content
		 */
		children: Snippet;
	}

	let {
		circle,
		membership = 'viewer',
		handlers = {},
		showQueue = true,
		showSession = true,
		showHistory = true,
		showMembers = true,
		enableAnonymousFeedback = true,
		class: className = '',
		children,
	}: Props = $props();

	// Create and set context for child components
	const config = $derived({
		showQueue,
		showSession,
		showHistory,
		showMembers,
		enableAnonymousFeedback,
	});

	const ctx = createCritiqueCircleContext(
		() => circle,
		() => membership,
		() => config,
		() => handlers
	);

	// Computed classes
	const rootClasses = $derived(
		[
			'critique-circle',
			`critique-circle--${membership}`,
			ctx.session.isActive && 'critique-circle--session-active',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<section
	class={rootClasses}
	aria-label={`Critique Circle: ${circle.name}`}
	data-membership={membership}
	data-session-active={ctx.session.isActive}
>
	<!-- Circle header -->
	<header class="critique-circle__header">
		{#if circle.coverImage}
			<div class="critique-circle__cover">
				<img src={circle.coverImage} alt="" />
			</div>
		{/if}
		<div class="critique-circle__info">
			<h2 class="critique-circle__name">{circle.name}</h2>
			{#if circle.description}
				<p class="critique-circle__description">{circle.description}</p>
			{/if}
			<div class="critique-circle__meta">
				<span class="critique-circle__member-count">
					{circle.members.length}{circle.maxMembers ? `/${circle.maxMembers}` : ''} members
				</span>
				{#if circle.skillLevel && circle.skillLevel !== 'all'}
					<span class="critique-circle__skill-level">{circle.skillLevel}</span>
				{/if}
				{#if !circle.isPublic}
					<span class="critique-circle__private">Private</span>
				{/if}
			</div>
			{#if circle.focusAreas?.length}
				<div class="critique-circle__focus-areas">
					{#each circle.focusAreas as area (area)}
						<span class="critique-circle__focus-tag">{area}</span>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- Main content -->
	<div class="critique-circle__content">
		{@render children()}
	</div>
</section>

<style>
	.critique-circle {
		position: relative;
		width: 100%;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.critique-circle__header {
		position: relative;
		padding: var(--gr-spacing-scale-6);
		background: var(--gr-color-gray-800);
	}

	.critique-circle__cover {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.critique-circle__cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.3;
	}

	.critique-circle__info {
		position: relative;
		z-index: 1;
	}

	.critique-circle__name {
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-bold);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.critique-circle__description {
		font-size: var(--gr-font-size-base);
		color: var(--gr-color-gray-300);
		margin: 0 0 var(--gr-spacing-scale-3) 0;
	}

	.critique-circle__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.critique-circle__skill-level {
		text-transform: capitalize;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-primary-900);
		color: var(--gr-color-primary-300);
		border-radius: var(--gr-radius-sm);
	}

	.critique-circle__private {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-warning-900);
		color: var(--gr-color-warning-300);
		border-radius: var(--gr-radius-sm);
	}

	.critique-circle__focus-areas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-3);
	}

	.critique-circle__focus-tag {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
	}

	.critique-circle__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-6);
		padding: var(--gr-spacing-scale-6);
	}

	.critique-circle--session-active {
		border: 2px solid var(--gr-color-success-500);
	}
</style>
