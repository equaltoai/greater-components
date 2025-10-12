<!--
  Profile.Root - Profile Context Provider
  
  Provides profile context to all child profile components.
  Manages shared state and handlers for the profile view and edit flow.
  
  @component
  @example
  ```svelte
  <Profile.Root {profile} {handlers} {isOwnProfile}>
    <Profile.Header />
    <Profile.Stats />
    <Profile.Tabs />
  </Profile.Root>
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createProfileContext } from './context.js';
	import type { ProfileData, ProfileHandlers } from './context.js';

	interface Props {
		/**
		 * Profile data to display
		 */
		profile: ProfileData | null;

		/**
		 * Profile event handlers
		 */
		handlers?: ProfileHandlers;

		/**
		 * Whether this is the current user's profile
		 * @default false
		 */
		isOwnProfile?: boolean;

		/**
		 * Child components
		 */
		children?: Snippet;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		profile,
		handlers = {},
		isOwnProfile = false,
		children,
		class: className = '',
	}: Props = $props();

	// Create profile context
	const context = createProfileContext(profile, handlers, isOwnProfile);

	// Update profile when prop changes
	$effect(() => {
		if (profile) {
			context.updateState({ profile });
		}
	});
</script>

<div class="profile-root {className}">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.profile-root {
		width: 100%;
		max-width: 100%;
	}
</style>
