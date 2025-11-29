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
	import { onDestroy } from 'svelte';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
	import { createProfileContext } from './context.js';
	import type { ProfileData, ProfileHandlers } from './context.js';
	import { ProfileGraphQLController } from './GraphQLAdapter.js';

	interface Props {
		/**
		 * Profile data to display (optional when using GraphQL adapter)
		 */
		profile?: ProfileData | null;

		/**
		 * Profile event handlers (overridden when GraphQL adapter is provided)
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

		/**
		 * Lesser GraphQL adapter instance for automatic wiring
		 */
		adapter?: LesserGraphQLAdapter;

		/**
		 * Username (handle) of the profile to load when using the adapter
		 */
		username?: string;

		/**
		 * Page size for followers/following pagination
		 * @default 40
		 */
		pageSize?: number;

		/**
		 * Enable preferences and privacy settings integration (only for own profile)
		 * @default true
		 */
		enablePreferences?: boolean;
	}

	let {
		profile: profileProp = null,
		handlers: handlersProp = {},
		isOwnProfile = false,
		children,
		class: className = '',
		adapter,
		username,
		pageSize = 40,
		enablePreferences = true,
	}: Props = $props();

	const context = createProfileContext(profileProp, handlersProp, isOwnProfile, adapter);

	let controller: ProfileGraphQLController | null = null;

	async function ensureController() {
		if (!adapter || !username) {
			controller?.destroy();
			controller = null;
			context.setHandlers(handlersProp);

			if (profileProp) {
				context.updateState({
					profile: profileProp,
					followersTotal: profileProp.followersCount,
					followingTotal: profileProp.followingCount,
				});
			}
			return;
		}

		if (controller && controller.matches(adapter, username, pageSize)) {
			controller.setIsOwnProfile(isOwnProfile);
			return;
		}

		controller?.destroy();
		controller = new ProfileGraphQLController({
			context,
			adapter,
			username,
			pageSize,
			isOwnProfile,
			enablePreferences: enablePreferences && isOwnProfile,
		});

		try {
			await controller.initialize();
		} catch (error) {
			console.error('Failed to initialize GraphQL profile adapter', error);
		}
	}

	$effect(() => {
		context.updateState({ isOwnProfile });
	});

	$effect(() => {
		ensureController();
	});

	$effect(() => {
		if (!adapter || !username) {
			context.setHandlers(handlersProp);
		}
	});

	$effect(() => {
		if ((!adapter || !username) && profileProp) {
			context.updateState({
				profile: profileProp,
				followersTotal: profileProp.followersCount,
				followingTotal: profileProp.followingCount,
			});
		}
	});

	onDestroy(() => {
		controller?.destroy();
		controller = null;
	});
</script>

<div class={`profile-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
