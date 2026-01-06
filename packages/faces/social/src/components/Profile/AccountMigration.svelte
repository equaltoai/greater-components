<!--
Profile.AccountMigration - Account migration UI

Handles account migration workflow:
- Initiate migration to new account
- Display migration status
- Cancel pending migration
- Show redirected account notice

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components/faces/social';
  
  const migration = {
    targetAccount: {
      id: '2',
      username: 'newaccount',
      displayName: 'My New Account'
    },
    status: 'pending',
    followersCount: 150
  };
</script>

<Profile.AccountMigration {migration} />
```
-->

<script lang="ts">
	import type { AccountMigration } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Current migration data
		 */
		migration?: AccountMigration | null;

		/**
		 * Whether this is the user's own profile
		 */
		isOwnProfile?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { migration = null, isOwnProfile = false, class: className = '' }: Props = $props();

	const context = getProfileContext();

	let showMigrationForm = $state(false);
	let targetAccountInput = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	/**
	 * Check if migration is active
	 */
	const hasMigration = $derived(migration !== null);

	/**
	 * Check if migration is pending
	 */
	const isPending = $derived(migration?.status === 'pending');

	/**
	 * Check if migration is completed
	 */
	const isCompleted = $derived(migration?.status === 'completed');

	/**
	 * Check if migration failed
	 */
	const isFailed = $derived(migration?.status === 'failed');

	/**
	 * Format date
	 */
	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) throw new Error('Invalid date');
			return date.toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch {
			return dateString;
		}
	}

	/**
	 * Toggle migration form
	 */
	function toggleMigrationForm() {
		showMigrationForm = !showMigrationForm;
		error = null;
		targetAccountInput = '';
	}

	/**
	 * Initiate migration
	 */
	async function handleInitiateMigration() {
		if (!targetAccountInput.trim() || !context.handlers.onInitiateMigration) {
			return;
		}

		loading = true;
		error = null;

		try {
			await context.handlers.onInitiateMigration(targetAccountInput.trim());
			showMigrationForm = false;
			targetAccountInput = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to initiate migration';
		} finally {
			loading = false;
		}
	}

	/**
	 * Cancel migration
	 */
	async function handleCancelMigration() {
		if (!context.handlers.onCancelMigration) {
			return;
		}

		if (!confirm('Are you sure you want to cancel the account migration?')) {
			return;
		}

		loading = true;
		error = null;

		try {
			await context.handlers.onCancelMigration();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to cancel migration';
		} finally {
			loading = false;
		}
	}

	/**
	 * Validate account handle format
	 */
	function isValidAccountHandle(handle: string): boolean {
		// Basic validation for @username@domain or @username format
		return /^@?[a-zA-Z0-9_]+(@[a-zA-Z0-9.-]+)?$/.test(handle);
	}

	/**
	 * Check if input is valid
	 */
	const inputIsValid = $derived(
		targetAccountInput.trim() !== '' && isValidAccountHandle(targetAccountInput.trim())
	);
</script>

<div class={`account-migration ${className}`}>
	{#if !isOwnProfile && isCompleted}
		<!-- Migration notice for visitors -->
		<div class="account-migration__notice account-migration__notice--completed">
			<div class="account-migration__notice-icon">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					/>
				</svg>
			</div>
			<div class="account-migration__notice-content">
				<p class="account-migration__notice-title">This account has moved</p>
				<p class="account-migration__notice-text">The owner of this account has migrated to:</p>
				{#if migration?.targetAccount}
					<a
						href={`/profile/${migration.targetAccount.username}`}
						class="account-migration__target-link"
					>
						<img
							src={migration.targetAccount.avatar}
							alt=""
							class="account-migration__target-avatar"
						/>
						<div class="account-migration__target-info">
							<span class="account-migration__target-name">
								{migration.targetAccount.displayName}
							</span>
							<span class="account-migration__target-username">
								@{migration.targetAccount.username}
							</span>
						</div>
					</a>
				{/if}
			</div>
		</div>
	{:else if isOwnProfile}
		<!-- Migration management for own profile -->
		<div class="account-migration__management">
			<div class="account-migration__header">
				<h3 class="account-migration__title">Account Migration</h3>
				<p class="account-migration__description">
					Move your followers to a new account on another instance
				</p>
			</div>

			{#if hasMigration && migration}
				<!-- Existing migration status -->
				<div class={`account-migration__status account-migration__status--${migration.status}`}>
					<div class="account-migration__status-header">
						{#if isPending}
							<span
								class="account-migration__status-badge account-migration__status-badge--pending"
							>
								Pending
							</span>
						{:else if isCompleted}
							<span
								class="account-migration__status-badge account-migration__status-badge--completed"
							>
								Completed
							</span>
						{:else if isFailed}
							<span class="account-migration__status-badge account-migration__status-badge--failed">
								Failed
							</span>
						{/if}
					</div>

					{#if migration.targetAccount}
						<div class="account-migration__target">
							<p class="account-migration__target-label">Migrating to:</p>
							<div class="account-migration__target-account">
								{#if migration.targetAccount.avatar}
									<img
										src={migration.targetAccount.avatar}
										alt=""
										class="account-migration__target-avatar"
									/>
								{:else}
									<div
										class="account-migration__target-avatar account-migration__target-avatar--placeholder"
									></div>
								{/if}
								<div class="account-migration__target-info">
									<span class="account-migration__target-name">
										{migration.targetAccount.displayName}
									</span>
									<span class="account-migration__target-username">
										@{migration.targetAccount.username}
									</span>
								</div>
							</div>
						</div>
					{/if}

					{#if migration.followersCount !== undefined}
						<p class="account-migration__followers">
							{migration.followersCount} follower{migration.followersCount !== 1 ? 's' : ''} will be notified
						</p>
					{/if}

					{#if migration.movedAt}
						<p class="account-migration__date">
							Migrated on {formatDate(migration.movedAt)}
						</p>
					{/if}

					{#if isPending}
						<button
							class="account-migration__button account-migration__button--cancel"
							onclick={handleCancelMigration}
							disabled={loading}
							type="button"
						>
							{loading ? 'Canceling...' : 'Cancel Migration'}
						</button>
					{/if}

					{#if error}
						<p class="account-migration__error">
							{error}
						</p>
					{/if}

					{#if isFailed}
						<p class="account-migration__error">
							Migration failed. Please try again or contact support.
						</p>
					{/if}
				</div>
			{:else}
				<!-- No migration - show initiate button -->
				{#if !showMigrationForm}
					<button
						class="account-migration__button account-migration__button--primary"
						onclick={toggleMigrationForm}
						type="button"
					>
						Initiate Migration
					</button>
				{:else}
					<!-- Migration form -->
					<div class="account-migration__form">
						<div class="account-migration__form-field">
							<label for="target-account" class="account-migration__label">
								New account handle
							</label>
							<input
								id="target-account"
								type="text"
								class="account-migration__input"
								placeholder="@username@instance.com"
								bind:value={targetAccountInput}
								disabled={loading}
							/>
							<p class="account-migration__hint">Enter the full handle of your new account</p>
						</div>

						{#if error}
							<div class="account-migration__form-error" role="alert">
								{error}
							</div>
						{/if}

						<div class="account-migration__form-actions">
							<button
								class="account-migration__button account-migration__button--secondary"
								onclick={toggleMigrationForm}
								disabled={loading}
								type="button"
							>
								Cancel
							</button>
							<button
								class="account-migration__button account-migration__button--primary"
								onclick={handleInitiateMigration}
								disabled={!inputIsValid || loading}
								type="button"
							>
								{loading ? 'Processing...' : 'Start Migration'}
							</button>
						</div>

						<div class="account-migration__warning">
							<p><strong>Important:</strong></p>
							<ul>
								<li>Your followers will be notified and can choose to follow the new account</li>
								<li>Your posts will remain on this instance</li>
								<li>This action cannot be easily undone</li>
							</ul>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
