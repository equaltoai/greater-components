<!--
  UserButton - User Avatar Menu Component
  
  Displays authenticated user information with sign-out functionality.
  Supports inline and dropdown variants.
  
  @component
  @example Dropdown variant (default)
  ```svelte
  <script>
    import { UserButton } from '@equaltoai/greater-components-auth';
    import { SettingsIcon, UserIcon } from '@equaltoai/greater-components-icons';
    
    const user = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      imageUrl: 'https://example.com/avatar.jpg'
    };
    
    const menuItems = [
      { id: 'profile', label: 'Profile', icon: UserIcon, onClick: () => goto('/profile') },
      { id: 'settings', label: 'Settings', icon: SettingsIcon, onClick: () => goto('/settings') },
    ];
    
    async function handleSignOut() {
      await signOut();
    }
  </script>
  
  <UserButton 
    {user}
    onSignOut={handleSignOut}
    {menuItems}
  />
  ```
  
  @example Inline variant
  ```svelte
  <UserButton 
    {user}
    onSignOut={handleSignOut}
    variant="inline"
  />
  ```
-->
<script lang="ts">
	import type { UserButtonProps, UserMenuItem } from './types.js';
	import { Avatar, Text, Spinner, Menu } from '@equaltoai/greater-components-primitives';
	import { LogOutIcon } from '@equaltoai/greater-components-icons';

	let {
		user,
		onSignOut,
		variant = 'dropdown',
		loading = false,
		menuItems = [],
		class: className = '',
		size = 'md',
	}: UserButtonProps = $props();

	let signingOut = $state(false);

	/**
	 * Handle sign out action
	 */
	async function handleSignOut() {
		if (signingOut || loading) return;
		signingOut = true;
		try {
			await onSignOut();
		} finally {
			signingOut = false;
		}
	}

	/**
	 * Handle menu item click
	 */
	function handleMenuItemClick(item: UserMenuItem) {
		if (item.disabled) return;
		item.onClick?.();
	}

	// Map size to avatar size
	const avatarSizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
		sm: 'sm',
		md: 'md',
		lg: 'lg',
	};

	// Compute component classes
	const containerClass = $derived(
		['auth-user-button', `auth-user-button--${variant}`, className].filter(Boolean).join(' ')
	);

	// Check if currently loading (either prop or signing out)
	const isLoading = $derived(loading || signingOut);
</script>

{#if variant === 'inline'}
	<!-- Inline variant: Avatar with name, click triggers sign-out -->
	<button
		type="button"
		class={containerClass}
		onclick={handleSignOut}
		disabled={isLoading}
		aria-label={`Signed in as ${user.name}. Click to sign out.`}
		aria-busy={isLoading}
	>
		<Avatar
			src={user.imageUrl}
			name={user.name}
			size={avatarSizeMap[size]}
			class="auth-user-button__avatar"
		/>
		<span class="auth-user-button__info">
			<Text size="sm" weight="medium" class="auth-user-button__name">
				{user.name}
			</Text>
			{#if user.email}
				<Text size="xs" color="secondary" class="auth-user-button__email">
					{user.email}
				</Text>
			{/if}
		</span>
		{#if isLoading}
			<Spinner size="sm" color="current" label="Signing out" />
		{/if}
	</button>
{:else}
	<!-- Dropdown variant: Avatar trigger with menu -->
	<Menu.Root class={containerClass}>
		<Menu.Trigger
			class="auth-user-button__trigger"
			aria-label={`User menu for ${user.name}`}
			aria-haspopup="menu"
		>
			<Avatar
				src={user.imageUrl}
				name={user.name}
				size={avatarSizeMap[size]}
				class="auth-user-button__avatar"
			/>
		</Menu.Trigger>

		<Menu.Content matchTriggerWidth={false} class="auth-user-button__menu">
			<!-- User info header -->
			<Menu.Header>
				<div class="auth-user-button__menu-header">
					<Avatar
						src={user.imageUrl}
						name={user.name}
						size="md"
						class="auth-user-button__menu-avatar"
					/>
					<div class="auth-user-button__menu-info">
						<Text size="sm" weight="medium" class="auth-user-button__menu-name">
							{user.name}
						</Text>
						{#if user.email}
							<Text size="xs" color="secondary" class="auth-user-button__menu-email">
								{user.email}
							</Text>
						{/if}
					</div>
				</div>
			</Menu.Header>

			<!-- Custom menu items -->
			{#if menuItems.length > 0}
				<Menu.Separator />
				{#each menuItems as item (item.id)}
					<Menu.Item
						label={item.label}
						disabled={item.disabled}
						destructive={item.destructive}
						shortcut={item.shortcut}
						onclick={() => handleMenuItemClick(item)}
					>
						{#snippet icon()}
							{#if item.icon}
								{@const Icon = item.icon}
								<Icon size={16} aria-hidden="true" />
							{/if}
						{/snippet}
					</Menu.Item>
				{/each}
			{/if}

			<!-- Sign out -->
			<Menu.Separator />
			<Menu.Item
				label={isLoading ? 'Signing out...' : 'Sign out'}
				destructive
				disabled={isLoading}
				onclick={handleSignOut}
			>
				{#snippet icon()}
					{#if isLoading}
						<Spinner size="xs" color="current" label="Signing out" />
					{:else}
						<LogOutIcon size={16} aria-hidden="true" />
					{/if}
				{/snippet}
			</Menu.Item>
		</Menu.Content>
	</Menu.Root>
{/if}

<style>
	.auth-user-button {
		display: inline-flex;
		align-items: center;
	}

	/* Inline variant styles */
	.auth-user-button--inline {
		gap: var(--gr-spacing-sm, 0.5rem);
		padding: var(--gr-spacing-xs, 0.25rem) var(--gr-spacing-sm, 0.5rem);
		border: none;
		background: transparent;
		border-radius: var(--gr-radius-md, 0.5rem);
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.auth-user-button--inline:hover:not(:disabled) {
		background-color: var(--gr-color-surface-hover, #f3f4f6);
	}

	.auth-user-button--inline:focus-visible {
		outline: 2px solid var(--gr-color-focus-ring, #3b82f6);
		outline-offset: 2px;
	}

	.auth-user-button--inline:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.auth-user-button__info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
	}

	:global(.auth-user-button__name) {
		line-height: 1.2;
	}

	:global(.auth-user-button__email) {
		line-height: 1.2;
	}

	/* Dropdown variant styles */
	.auth-user-button__trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--gr-spacing-xs, 0.25rem);
		border: none;
		background: transparent;
		border-radius: 50%;
		cursor: pointer;
		transition: box-shadow 0.15s ease;
	}

	.auth-user-button__trigger:hover {
		box-shadow: 0 0 0 2px var(--gr-color-surface-hover, #f3f4f6);
	}

	.auth-user-button__trigger:focus-visible {
		outline: 2px solid var(--gr-color-focus-ring, #3b82f6);
		outline-offset: 2px;
	}

	:global(.auth-user-button__menu) {
		min-width: 220px;
	}

	.auth-user-button__menu-header {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-sm, 0.75rem);
		padding: var(--gr-spacing-xs, 0.25rem) 0;
	}

	.auth-user-button__menu-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	:global(.auth-user-button__menu-name) {
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.auth-user-button__menu-email) {
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
