<!--
  Profile.Timeline - User Profile Timeline Display
  
  Displays posts, replies, and media from a specific user's profile.
  Wraps TimelineVirtualizedReactive with profile-specific configuration.
  
  @component
  @example
  ```svelte
  <script>
    import { Profile } from '@equaltoai/greater-components/fediverse';
    
    const adapter = new LesserGraphQLAdapter({ ... });
  </script>
  
  <Profile.Timeline
    username="alice"
    {adapter}
    showReplies={true}
    showBoosts={true}
  />
  ```
-->

<script lang="ts">
	import TimelineVirtualizedReactive from '../TimelineVirtualizedReactive.svelte';
	import { tryGetProfileContext } from './context.js';
	import type { ProfileTimelineProps } from './context.js';

	let {
		username: usernameProp,
		adapter: adapterProp,
		showReplies = false,
		showBoosts = true,
		onlyMedia = false,
		showPinned = true,
		virtualScrolling = true,
		estimateSize = 400,
		class: className = '',
		header,
		emptyState,
	}: ProfileTimelineProps = $props();

	// Try to get from context if not provided
	const profileContext = tryGetProfileContext();

	const username = $derived(
		usernameProp ??
			profileContext?.state.profile?.username ??
			(() => {
				throw new Error('Profile.Timeline requires username prop or Profile.Root context');
			})()
	);

	const adapter = $derived(
		adapterProp ??
			profileContext?.adapter ??
			(() => {
				throw new Error('Profile.Timeline requires adapter prop or Profile.Root context');
			})()
	);

	// Build timeline view configuration
	const view = $derived({
		type: 'profile' as const,
		username,
		showReplies,
		showBoosts,
		onlyMedia,
		showPinned,
	});
</script>

<div class={`profile-timeline ${className}`}>
	{#if header}
		<div class="profile-timeline__header">
			{@render header()}
		</div>
	{/if}

	<TimelineVirtualizedReactive {adapter} {view} {virtualScrolling} {estimateSize}>
		{#snippet empty()}
			{#if emptyState}
				{@render emptyState()}
			{:else}
				<div class="profile-timeline__empty">
					<p>No posts yet</p>
				</div>
			{/if}
		{/snippet}
	</TimelineVirtualizedReactive>
</div>

<style>
	.profile-timeline {
		width: 100%;
	}

	.profile-timeline__empty {
		padding: 2rem;
		text-align: center;
		color: var(--gr-color-gray-600);
	}
</style>
