<!--
  Search.ActorResult - Actor Search Result Item
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
	import { getSearchContext, formatCount } from './context.svelte.js';
	import type { SearchActor } from './context.svelte.js';

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

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	const sanitizedBio = $derived(
		actor.bio
			? sanitizeHtml(actor.bio, {
					allowedTags: ['p', 'br', 'span', 'a', 'strong', 'em', 'b', 'i', 'u', 'code'],
					allowedAttributes: ['href', 'rel', 'target', 'class', 'title'],
				}).trim()
			: ''
	);

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
	}
</script>

<article class={`actor-result ${className}`}>
	<div
		class="actor-result__interactive"
		role="button"
		tabindex="0"
		onclick={handleClick}
		onkeydown={handleKeyDown}
	>
		<div class="actor-result__avatar">
			{#if actor.avatar}
				<img src={actor.avatar} alt={actor.displayName || actor.username} />
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
			{#if sanitizedBio}
				<div class="actor-result__bio">
					<div class="actor-result__bio-content" use:setHtml={sanitizedBio}></div>
				</div>
			{/if}
			{#if actor.followersCount !== undefined}
				<div class="actor-result__stats">
					<span>{formatCount(actor.followersCount)} followers</span>
				</div>
			{/if}
		</div>
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
