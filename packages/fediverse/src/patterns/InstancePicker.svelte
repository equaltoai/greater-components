<!--
  InstancePicker - Multi-Instance Account Switching
  
  Allows users to switch between multiple ActivityPub accounts across different instances.
  Supports account management, quick switching, and profile display.
  
  @component
  @example
  ```svelte
  <InstancePicker
    accounts={userAccounts}
    currentAccount={active}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createMenu } from '@greater/headless/menu';
	import type { ActivityPubActor } from '../generics/index.js';

	export interface AccountInstance {
		/**
		 * Unique identifier
		 */
		id: string;

		/**
		 * ActivityPub actor
		 */
		actor: ActivityPubActor;

		/**
		 * Instance domain
		 */
		instance: string;

		/**
		 * Access token (stored securely)
		 */
		token?: string;

		/**
		 * Last used timestamp
		 */
		lastUsed?: Date;

		/**
		 * Account metadata
		 */
		metadata?: {
			unreadNotifications?: number;
			avatar?: string;
			displayName?: string;
		};
	}

	interface InstancePickerConfig {
		/**
		 * Display mode
		 */
		mode?: 'dropdown' | 'sidebar' | 'modal';

		/**
		 * Show account metadata
		 */
		showMetadata?: boolean;

		/**
		 * Show notification badges
		 */
		showNotifications?: boolean;

		/**
		 * Maximum accounts to display before scrolling
		 */
		maxVisibleAccounts?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Show add account button
		 */
		showAddAccount?: boolean;
	}

	interface InstancePickerHandlers {
		/**
		 * Switch to account
		 */
		onSwitch?: (account: AccountInstance) => Promise<void>;

		/**
		 * Add new account
		 */
		onAddAccount?: () => void;

		/**
		 * Remove account
		 */
		onRemoveAccount?: (accountId: string) => Promise<void>;

		/**
		 * Refresh account data
		 */
		onRefresh?: (accountId: string) => Promise<void>;
	}

	interface Props {
		/**
		 * Available accounts
		 */
		accounts: AccountInstance[];

		/**
		 * Currently active account
		 */
		currentAccount: AccountInstance;

		/**
		 * Configuration
		 */
		config?: InstancePickerConfig;

		/**
		 * Event handlers
		 */
		handlers?: InstancePickerHandlers;

		/**
		 * Custom account renderer
		 */
		renderAccount?: Snippet<[AccountInstance, boolean]>;

		/**
		 * Custom trigger renderer
		 */
		renderTrigger?: Snippet<[AccountInstance]>;
	}

	let {
		accounts,
		currentAccount,
		config = {},
		handlers = {},
		renderAccount,
		renderTrigger,
	}: Props = $props();

	const {
		mode = 'dropdown',
	showMetadata: _showMetadata = true,
		showNotifications = true,
		maxVisibleAccounts = 5,
		class: className = '',
		showAddAccount = true,
	} = config;

	let switching = $state(false);
	let removingId = $state<string | null>(null);

	/**
	 * Menu for dropdown mode
	 */
	const menu = createMenu({
		closeOnSelect: true,
		onSelect: async (value) => {
			if (value === '__add__') {
				handlers.onAddAccount?.();
			} else {
				await switchAccount(value);
			}
		},
	});

	/**
	 * Switch to account
	 */
	async function switchAccount(accountId: string) {
		const account = accounts.find((a) => a.id === accountId);
		if (!account || switching) return;

		switching = true;
		try {
			await handlers.onSwitch?.(account);
		} finally {
			switching = false;
		}
	}

	/**
	 * Remove account
	 */
	async function removeAccount(accountId: string, event: Event) {
		event.stopPropagation();
		if (removingId || currentAccount.id === accountId) return;

		removingId = accountId;
		try {
			await handlers.onRemoveAccount?.(accountId);
		} finally {
			removingId = null;
		}
	}

	function handleRemoveKey(event: KeyboardEvent, accountId: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			removeAccount(accountId, event);
		}
	}

	/**
	 * Get display name for account
	 */
	function getDisplayName(account: AccountInstance): string {
		return (
			account.metadata?.displayName ||
			account.actor.name ||
			account.actor.preferredUsername ||
			'Unknown'
		);
	}

	/**
	 * Get handle for account
	 */
	function getHandle(account: AccountInstance): string {
		const username = account.actor.preferredUsername || 'unknown';
		return `@${username}@${account.instance}`;
	}

	/**
	 * Get avatar URL
	 */
	function getAvatar(account: AccountInstance): string | undefined {
		if (account.metadata?.avatar) return account.metadata.avatar;
		if (typeof account.actor.icon === 'object' && 'url' in account.actor.icon) {
			return account.actor.icon.url;
		}
		return undefined;
	}

	/**
	 * Sort accounts by last used
	 */
	const sortedAccounts = $derived(
		[...accounts].sort((a, b) => {
			if (a.id === currentAccount.id) return -1;
			if (b.id === currentAccount.id) return 1;
			const aTime = a.lastUsed?.getTime() || 0;
			const bTime = b.lastUsed?.getTime() || 0;
			return bTime - aTime;
		})
	);
</script>

<div class={`instance-picker instance-picker--${mode} ${className}`}>
	{#if mode === 'dropdown'}
		<!-- Dropdown mode -->
		<button use:menu.actions.trigger class="instance-picker__trigger" disabled={switching}>
			{#if renderTrigger}
				{@render renderTrigger(currentAccount)}
			{:else}
				<div class="instance-picker__current">
					{#if getAvatar(currentAccount)}
						<img
							src={getAvatar(currentAccount)}
							alt={getDisplayName(currentAccount)}
							class="instance-picker__avatar"
						/>
					{:else}
						<div class="instance-picker__avatar-placeholder">
							{getDisplayName(currentAccount).charAt(0)}
						</div>
					{/if}

					<div class="instance-picker__info">
						<span class="instance-picker__name">
							{getDisplayName(currentAccount)}
						</span>
						<span class="instance-picker__handle">
							{getHandle(currentAccount)}
						</span>
					</div>

					<svg class="instance-picker__chevron" viewBox="0 0 24 24" fill="currentColor">
						<path d="M7 10l5 5 5-5z" />
					</svg>
				</div>
			{/if}
		</button>

		{#if menu.state.open}
			<div use:menu.actions.menu class="instance-picker__menu">
				<div class="instance-picker__accounts" style={`max-height: ${maxVisibleAccounts * 64}px`}>
					{#each sortedAccounts as account (account.id)}
						<button
							use:menu.actions.item={account.id}
							class="instance-picker__account"
							class:instance-picker__account--current={account.id === currentAccount.id}
						>
							{#if renderAccount}
								{@render renderAccount(account, account.id === currentAccount.id)}
							{:else}
								{#if getAvatar(account)}
									<img
										src={getAvatar(account)}
										alt={getDisplayName(account)}
										class="instance-picker__account-avatar"
									/>
								{:else}
									<div class="instance-picker__account-avatar-placeholder">
										{getDisplayName(account).charAt(0)}
									</div>
								{/if}

								<div class="instance-picker__account-info">
									<span class="instance-picker__account-name">
										{getDisplayName(account)}
									</span>
									<span class="instance-picker__account-handle">
										{getHandle(account)}
									</span>
								</div>

								{#if showNotifications && account.metadata?.unreadNotifications}
									<span class="instance-picker__badge">
										{account.metadata.unreadNotifications}
									</span>
								{/if}

					{#if account.id === currentAccount.id}
						<svg class="instance-picker__check" viewBox="0 0 24 24" fill="currentColor">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
					{:else}
						<span
							class="instance-picker__remove"
							role="button"
							tabindex="0"
							onclick={(e) => removeAccount(account.id, e)}
							onkeydown={(event) => handleRemoveKey(event, account.id)}
							aria-label="Remove account"
							aria-disabled={removingId === account.id}
						>
							{#if removingId === account.id}
								<svg class="instance-picker__spinner" viewBox="0 0 24 24">
									<circle class="instance-picker__spinner-track" cx="12" cy="12" r="10" />
									<circle class="instance-picker__spinner-path" cx="12" cy="12" r="10" />
								</svg>
							{:else}
								×
							{/if}
						</span>
					{/if}
							{/if}
						</button>
					{/each}
				</div>

				{#if showAddAccount}
					<button use:menu.actions.item={'__add__'} class="instance-picker__add">
						<svg class="instance-picker__add-icon" viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
						</svg>
						<span>Add Account</span>
					</button>
				{/if}
			</div>
		{/if}
	{:else if mode === 'sidebar'}
		<!-- Sidebar mode -->
		<div class="instance-picker__sidebar">
			<div class="instance-picker__sidebar-header">
				<h3>Accounts</h3>
			</div>

			<div class="instance-picker__sidebar-list">
				{#each sortedAccounts as account (account.id)}
					<button
						class="instance-picker__sidebar-account"
						class:instance-picker__sidebar-account--active={account.id === currentAccount.id}
						onclick={() => switchAccount(account.id)}
						disabled={switching}
					>
						{#if getAvatar(account)}
							<img
								src={getAvatar(account)}
								alt={getDisplayName(account)}
								class="instance-picker__sidebar-avatar"
							/>
						{:else}
							<div class="instance-picker__sidebar-avatar-placeholder">
								{getDisplayName(account).charAt(0)}
							</div>
						{/if}

						{#if showNotifications && account.metadata?.unreadNotifications}
							<span class="instance-picker__sidebar-badge">
								{account.metadata.unreadNotifications}
							</span>
						{/if}
					</button>
				{/each}

			{#if showAddAccount}
				<button
					class="instance-picker__sidebar-add"
					onclick={() => handlers.onAddAccount?.()}
					aria-label="Add account"
				>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Trigger */
	.instance-picker__trigger {
		width: 100%;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.instance-picker__current {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.instance-picker__current:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.instance-picker__avatar,
	.instance-picker__avatar-placeholder {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
	}

	.instance-picker__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 600;
		font-size: 1.25rem;
	}

	.instance-picker__info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		flex: 1;
		min-width: 0;
	}

	.instance-picker__name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.instance-picker__handle {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.instance-picker__chevron {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
		flex-shrink: 0;
	}

	/* Menu */
	.instance-picker__menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 1000;
	}

	.instance-picker__accounts {
		overflow-y: auto;
	}

	.instance-picker__account {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s;
		position: relative;
	}

	.instance-picker__account:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.instance-picker__account--current {
		background: var(--bg-selected, #e8f5fe);
	}

	.instance-picker__account-avatar,
	.instance-picker__account-avatar-placeholder {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
	}

	.instance-picker__account-avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 600;
		font-size: 1.25rem;
	}

	.instance-picker__account-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.instance-picker__account-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.instance-picker__account-handle {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.instance-picker__badge {
		padding: 0.125rem 0.5rem;
		background: var(--primary-color, #1d9bf0);
		color: white;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.instance-picker__check {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--primary-color, #1d9bf0);
		flex-shrink: 0;
	}

	.instance-picker__remove {
		padding: 0.25rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		font-size: 1.5rem;
		line-height: 1;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.instance-picker__remove:hover:not(:disabled) {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.instance-picker__spinner {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	.instance-picker__spinner-track {
		fill: none;
		stroke: var(--border-color, #e1e8ed);
		stroke-width: 2;
	}

	.instance-picker__spinner-path {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-dasharray: 60;
		stroke-dashoffset: 20;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.instance-picker__add {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem;
		background: transparent;
		border: none;
		border-top: 1px solid var(--border-color, #e1e8ed);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		transition: background-color 0.2s;
	}

	.instance-picker__add:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.instance-picker__add-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Sidebar mode */
	.instance-picker__sidebar {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--bg-secondary, #f7f9fa);
		border-right: 1px solid var(--border-color, #e1e8ed);
	}

	.instance-picker__sidebar-header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.instance-picker__sidebar-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.instance-picker__sidebar-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		overflow-y: auto;
	}

	.instance-picker__sidebar-account {
		position: relative;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.instance-picker__sidebar-avatar,
	.instance-picker__sidebar-avatar-placeholder {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid transparent;
		transition: all 0.2s;
	}

	.instance-picker__sidebar-account:hover .instance-picker__sidebar-avatar,
	.instance-picker__sidebar-account:hover .instance-picker__sidebar-avatar-placeholder {
		border-color: var(--primary-color, #1d9bf0);
	}

	.instance-picker__sidebar-account--active .instance-picker__sidebar-avatar,
	.instance-picker__sidebar-account--active .instance-picker__sidebar-avatar-placeholder {
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 2px var(--bg-secondary, #f7f9fa);
	}

	.instance-picker__sidebar-avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 600;
		font-size: 1.5rem;
	}

	.instance-picker__sidebar-badge {
		position: absolute;
		top: -0.25rem;
		right: -0.25rem;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--danger-color, #f4211e);
		color: white;
		border-radius: 9999px;
		font-size: 0.625rem;
		font-weight: 700;
		border: 2px solid var(--bg-secondary, #f7f9fa);
	}

	.instance-picker__sidebar-add {
		width: 3rem;
		height: 3rem;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-primary, #ffffff);
		border: 2px dashed var(--border-color, #e1e8ed);
		border-radius: 50%;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.instance-picker__sidebar-add:hover {
		background: var(--primary-color, #1d9bf0);
		border-color: var(--primary-color, #1d9bf0);
		color: white;
	}

	.instance-picker__sidebar-add svg {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
