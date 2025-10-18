<!--
  Profile.Stats - Profile Statistics Display
  
  Displays follower count, following count, and post count with clickable links.
  
  @component
  @example
  ```svelte
  <Profile.Root {profile} {handlers}>
    <Profile.Stats clickable={true} />
  </Profile.Root>
  ```
-->
<script lang="ts">
	import { getProfileContext, formatCount } from './context.js';

	interface Props {
		/**
		 * Make stats clickable
		 * @default true
		 */
		clickable?: boolean;

		/**
		 * Show posts count
		 * @default true
		 */
		showPosts?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { clickable = true, showPosts = true, class: className = '' }: Props = $props();

	const { state: profileState } = getProfileContext();

	/**
	 * Handle stat click
	 */
	function handleClick(type: 'followers' | 'following' | 'posts') {
		if (!clickable) return;

		// Emit event or navigate
		const event = new CustomEvent('statClick', {
			detail: { type, profile: profileState.profile },
			bubbles: true,
		});
		dispatchEvent(event);
	}
</script>

{#if profileState.profile}
	<div class={`profile-stats ${className}`}>
		{#if showPosts}
			<button
				class="profile-stats__item"
				class:profile-stats__item--clickable={clickable}
				onclick={() => handleClick('posts')}
				disabled={!clickable}
			>
				<span class="profile-stats__value">{formatCount(profileState.profile.statusesCount)}</span>
				<span class="profile-stats__label">
					{profileState.profile.statusesCount === 1 ? 'Post' : 'Posts'}
				</span>
			</button>
		{/if}

		<button
			class="profile-stats__item"
			class:profile-stats__item--clickable={clickable}
			onclick={() => handleClick('following')}
			disabled={!clickable}
		>
			<span class="profile-stats__value">{formatCount(profileState.profile.followingCount)}</span>
			<span class="profile-stats__label">Following</span>
		</button>

		<button
			class="profile-stats__item"
			class:profile-stats__item--clickable={clickable}
			onclick={() => handleClick('followers')}
			disabled={!clickable}
		>
			<span class="profile-stats__value">{formatCount(profileState.profile.followersCount)}</span>
			<span class="profile-stats__label">
				{profileState.profile.followersCount === 1 ? 'Follower' : 'Followers'}
			</span>
		</button>
	</div>
{/if}

<style>
	.profile-stats {
		display: flex;
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.profile-stats__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		padding: 0;
		border: none;
		background: transparent;
		font-family: inherit;
		cursor: default;
		transition: opacity 0.2s;
	}

	.profile-stats__item--clickable {
		cursor: pointer;
	}

	.profile-stats__item--clickable:hover {
		opacity: 0.7;
	}

	.profile-stats__item:disabled {
		cursor: default;
		opacity: 1;
	}

	.profile-stats__value {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.profile-stats__label {
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}
</style>
