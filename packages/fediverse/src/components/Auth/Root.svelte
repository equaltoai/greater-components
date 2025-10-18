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

	// Create auth context
	const context = createAuthContext(initialState, handlers);
</script>

<div class={`auth-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.auth-root {
		width: 100%;
		max-width: 100%;
	}
</style>
