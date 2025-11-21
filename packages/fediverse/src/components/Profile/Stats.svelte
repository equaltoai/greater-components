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
