<!--
  Auth.Root - Authentication Context Provider
  
  Provides authentication context to all child auth components.
  Manages shared state and handlers for the authentication flow.
  
  @component
  @example
  ```svelte
  <Auth.Root {initialState} {handlers}>
    <Auth.LoginForm />
  </Auth.Root>
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createAuthContext } from './context.js';
	import type { AuthState, AuthHandlers } from './context.js';

	interface Props {
		/**
		 * Initial authentication state
		 */
		initialState?: Partial<AuthState>;

		/**
		 * Authentication event handlers
		 */
		handlers?: AuthHandlers;

		/**
		 * Child components
		 */
		children?: Snippet;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { initialState = {}, handlers = {}, children, class: className = '' }: Props = $props();

	// Initialize auth state inside a Svelte component so rune tracking works
	const state = $state<AuthState>(
		untrack(() => ({
			authenticated: initialState.authenticated ?? false,
			user: initialState.user ?? null,
			loading: initialState.loading ?? false,
			error: initialState.error ?? null,
			requiresTwoFactor: initialState.requiresTwoFactor ?? false,
			twoFactorSession: initialState.twoFactorSession,
		}))
	);

	const context = createAuthContext(
		state,
		untrack(() => handlers)
	);

	$effect(() => {
		if (initialState.authenticated !== undefined) state.authenticated = initialState.authenticated;
		if (initialState.user !== undefined) state.user = initialState.user;
		if (initialState.loading !== undefined) state.loading = initialState.loading;
		if (initialState.error !== undefined) state.error = initialState.error;
		if (initialState.requiresTwoFactor !== undefined)
			state.requiresTwoFactor = initialState.requiresTwoFactor;
		if (initialState.twoFactorSession !== undefined)
			state.twoFactorSession = initialState.twoFactorSession;
	});

	$effect(() => {
		Object.assign(context.handlers, handlers);
	});
</script>

<div class={`auth-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
