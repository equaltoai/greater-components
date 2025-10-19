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
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
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
									<div class="account-migration__target-avatar" style="background: #ccc;"></div>
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
							{migration.followersCount} follower{migration.followersCount !== 1 ? 's' : ''} will be
							notified
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

<style>
	.account-migration {
		width: 100%;
	}

	.account-migration__notice {
		display: flex;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--notice-bg, #fff3cd);
		border: 1px solid var(--notice-border, #ffc107);
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.account-migration__notice--completed {
		background: var(--notice-completed-bg, #e8f5e9);
		border-color: var(--notice-completed-border, #4caf50);
	}

	.account-migration__notice-icon {
		flex-shrink: 0;
		color: var(--notice-icon-color, #ff9800);
	}

	.account-migration__notice--completed .account-migration__notice-icon {
		color: var(--success-color, #4caf50);
	}

	.account-migration__notice-content {
		flex: 1;
	}

	.account-migration__notice-title {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text-primary, #0f1419);
		margin: 0 0 0.5rem;
	}

	.account-migration__notice-text {
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		margin: 0 0 1rem;
	}

	.account-migration__management {
		width: 100%;
	}

	.account-migration__header {
		margin-bottom: 1.5rem;
	}

	.account-migration__title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		margin: 0 0 0.5rem;
	}

	.account-migration__description {
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		margin: 0;
	}

	.account-migration__status {
		padding: 1.5rem;
		background: var(--status-bg, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.account-migration__status--pending {
		background: var(--pending-bg, #fff3cd);
		border-color: var(--pending-border, #ffc107);
	}

	.account-migration__status--completed {
		background: var(--completed-bg, #e8f5e9);
		border-color: var(--completed-border, #4caf50);
	}

	.account-migration__status--failed {
		background: var(--failed-bg, #fee);
		border-color: var(--failed-border, #f44336);
	}

	.account-migration__status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.account-migration__status-badge--pending {
		background: var(--pending-badge-bg, #ff9800);
		color: white;
	}

	.account-migration__status-badge--completed {
		background: var(--success-color, #4caf50);
		color: white;
	}

	.account-migration__status-badge--failed {
		background: var(--error-color, #f44336);
		color: white;
	}

	.account-migration__target-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		margin: 0 0 0.5rem;
	}

	.account-migration__target-link,
	.account-migration__target-account {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: white;
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		text-decoration: none;
		transition: background 0.2s;
	}

	.account-migration__target-link:hover {
		background: var(--item-hover-bg, #f7f9fa);
	}

	.account-migration__target-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
	}

	.account-migration__target-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.account-migration__target-name {
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
	}

	.account-migration__target-username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.account-migration__followers,
	.account-migration__date {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		margin: 0;
	}

	.account-migration__form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.account-migration__form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.account-migration__label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.account-migration__input {
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.5rem;
		background: var(--input-bg, white);
		color: var(--text-primary, #0f1419);
		outline: none;
		transition: all 0.2s;
	}

	.account-migration__input:focus {
		border-color: var(--primary-color, #1d9bf0);
	}

	.account-migration__input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.account-migration__hint {
		font-size: 0.8125rem;
		color: var(--text-tertiary, #8899a6);
		margin: 0;
	}

	.account-migration__form-error,
	.account-migration__error {
		padding: 0.75rem 1rem;
		background: var(--error-bg, #fee);
		color: var(--error-text, #c00);
		border: 1px solid var(--error-border, #fcc);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		margin: 0;
	}

	.account-migration__form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.account-migration__button {
		padding: 0.625rem 1.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.account-migration__button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.account-migration__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.account-migration__button--primary:hover:not(:disabled) {
		background: var(--primary-hover, #1a8cd8);
	}

	.account-migration__button--secondary {
		background: transparent;
		color: var(--text-primary, #0f1419);
		border: 1px solid var(--border-color, #cfd9de);
	}

	.account-migration__button--secondary:hover:not(:disabled) {
		background: var(--button-hover-bg, #f7f9fa);
	}

	.account-migration__button--cancel {
		background: transparent;
		color: var(--error-color, #f44336);
		border: 1px solid var(--error-color, #f44336);
	}

	.account-migration__button--cancel:hover:not(:disabled) {
		background: var(--error-color, #f44336);
		color: white;
	}

	.account-migration__warning {
		padding: 1rem;
		background: var(--warning-bg, #fff3cd);
		border: 1px solid var(--warning-border, #ffc107);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.account-migration__warning p {
		margin: 0 0 0.5rem;
	}

	.account-migration__warning ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.account-migration__warning li {
		margin: 0.25rem 0;
	}

	@media (max-width: 640px) {
		.account-migration__form-actions {
			flex-direction: column-reverse;
		}

		.account-migration__button {
			width: 100%;
		}
	}
</style>
