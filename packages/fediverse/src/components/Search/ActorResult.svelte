<!--
  Search.ActorResult - Actor Search Result Item
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getSearchContext, formatCount } from './context.js';
	import type { SearchActor } from './context.js';

	interface Props {
		actor: SearchActor;
		class?: string;
	}

	let { actor, class: className = '' }: Props = $props();

	const { handlers } = getSearchContext();

	const followButton = createButton({
		onClick: () => handleFollow(),
	});

	async function handleFollow() {
		await handlers.onFollow?.(actor.id);
	}

	function handleClick() {
		handlers.onActorClick?.(actor);
	}
</script>

<article class={`actor-result ${className}`} onclick={handleClick}>
	<div class="actor-result__avatar">
		{#if actor.avatar}
			<img src={actor.avatar} alt={actor.displayName} />
		{:else}
			<div class="actor-result__avatar-placeholder">
				{actor.displayName[0]?.toUpperCase() || actor.username[0]?.toUpperCase()}
			</div>
		{/if}
	</div>

	<div class="actor-result__content">
		<div class="actor-result__header">
			<h4 class="actor-result__name">{actor.displayName}</h4>
			<span class="actor-result__username">@{actor.username}</span>
		</div>
		{#if actor.bio}
			<p class="actor-result__bio">{@html actor.bio}</p>
		{/if}
		{#if actor.followersCount !== undefined}
			<div class="actor-result__stats">
				<span>{formatCount(actor.followersCount)} followers</span>
			</div>
		{/if}
	</div>

	<button
		use:followButton.actions.button
		class="actor-result__follow"
		class:actor-result__follow--following={actor.isFollowing}
		onclick={(e) => {
			e.stopPropagation();
			handleFollow();
		}}
	>
		{actor.isFollowing ? 'Following' : 'Follow'}
	</button>
</article>

<style>
	.actor-result {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.actor-result:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.actor-result__avatar {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		flex-shrink: 0;
	}

	.actor-result__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.actor-result__avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.actor-result__content {
		flex: 1;
		min-width: 0;
	}

	.actor-result__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.actor-result__name {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.actor-result__username {
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
	}

	.actor-result__bio {
		margin: 0.25rem 0 0 0;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.actor-result__stats {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.actor-result__follow {
		padding: 0.5rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
		white-space: nowrap;
		align-self: flex-start;
	}

	.actor-result__follow:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.actor-result__follow--following {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}
</style>
