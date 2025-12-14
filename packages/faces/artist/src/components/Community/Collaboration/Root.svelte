<!--
Collaboration.Root - Container compound component for collaborations

Implements REQ-COMM-002: Collaboration
- Attribution chains tracking contributions
- Split handling for collaborative sales
- Shared galleries for group exhibitions

@component
@example
```svelte
<Collaboration.Root {collaboration} role="contributor" {handlers}>
  <Collaboration.Project />
  <Collaboration.Contributors />
  <Collaboration.Uploads />
  <Collaboration.Gallery />
  <Collaboration.Split />
</Collaboration.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createCollaborationContext, getStatusBadge, type CollaborationRole } from './context.js';
	import type { CollaborationData, CollaborationHandlers } from '../../../types/community.js';

	interface Props {
		/**
		 * Collaboration data
		 */
		collaboration: CollaborationData;

		/**
		 * User's role in the collaboration
		 */
		role?: CollaborationRole;

		/**
		 * Event handlers
		 */
		handlers?: CollaborationHandlers;

		/**
		 * Show project overview
		 */
		showProject?: boolean;

		/**
		 * Show contributors panel
		 */
		showContributors?: boolean;

		/**
		 * Show uploads panel
		 */
		showUploads?: boolean;

		/**
		 * Show gallery
		 */
		showGallery?: boolean;

		/**
		 * Show split configuration
		 */
		showSplit?: boolean;

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
		collaboration,
		role = 'viewer',
		handlers = {},
		showProject = true,
		showContributors = true,
		showUploads = true,
		showGallery = true,
		showSplit = true,
		class: className = '',
		children,
	}: Props = $props();

	// Create and set context for child components
	const config = $derived({
		showProject,
		showContributors,
		showUploads,
		showGallery,
		showSplit,
	});

	createCollaborationContext(
		() => collaboration,
		() => role,
		() => config,
		() => handlers
	);

	// Get status badge
	const statusBadge = $derived(getStatusBadge(collaboration.status));

	// Computed classes
	const rootClasses = $derived(
		['collaboration', `collaboration--${collaboration.status}`, `collaboration--${role}`, className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<section
	class={rootClasses}
	aria-label={`Collaboration: ${collaboration.title}`}
	data-status={collaboration.status}
	data-role={role}
>
	<!-- Header -->
	<header class="collaboration__header">
		{#if collaboration.coverImage}
			<div class="collaboration__cover">
				<img src={collaboration.coverImage} alt="" />
			</div>
		{/if}
		<div class="collaboration__info">
			<div class="collaboration__title-row">
				<h2 class="collaboration__title">{collaboration.title}</h2>
				<span class="collaboration__status" style="background: {statusBadge.color}">
					{statusBadge.label}
				</span>
			</div>
			<p class="collaboration__description">{collaboration.description}</p>
			<div class="collaboration__meta">
				<span
					>{collaboration.members.length} contributor{collaboration.members.length !== 1
						? 's'
						: ''}</span
				>
				{#if collaboration.deadline}
					<span>Due: {new Date(collaboration.deadline).toLocaleDateString()}</span>
				{/if}
				{#if !collaboration.isPublic}
					<span class="collaboration__private">Private</span>
				{/if}
			</div>
			{#if collaboration.tags?.length}
				<div class="collaboration__tags">
					{#each collaboration.tags as tag (tag)}
						<span class="collaboration__tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- Main content -->
	<div class="collaboration__content">
		{@render children()}
	</div>
</section>

<style>
	.collaboration {
		position: relative;
		width: 100%;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.collaboration__header {
		position: relative;
		padding: var(--gr-spacing-scale-6);
		background: var(--gr-color-gray-800);
	}

	.collaboration__cover {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.collaboration__cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.3;
	}

	.collaboration__info {
		position: relative;
		z-index: 1;
	}

	.collaboration__title-row {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.collaboration__title {
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-bold);
		margin: 0;
	}

	.collaboration__status {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-3);
		border-radius: var(--gr-radius-full);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		color: white;
	}

	.collaboration__description {
		color: var(--gr-color-gray-300);
		margin: 0 0 var(--gr-spacing-scale-3) 0;
		line-height: 1.6;
	}

	.collaboration__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-4);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.collaboration__private {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-warning-900);
		color: var(--gr-color-warning-300);
		border-radius: var(--gr-radius-sm);
	}

	.collaboration__tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-3);
	}

	.collaboration__tag {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
	}

	.collaboration__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-6);
		padding: var(--gr-spacing-scale-6);
	}

	.collaboration--completed {
		border: 2px solid var(--gr-color-primary-500);
	}
</style>
