<!--
Profile.TrustBadge - Lesser trust score and reputation display

Shows trust score, reputation details, and vouch count for accounts on Lesser instances.

@component
@example
```svelte
<Profile.Root {profile}>
  <Profile.Header />
  <Profile.TrustBadge />
</Profile.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Reputation } from '../../types.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Show detailed reputation breakdown
		 */
		showDetails?: boolean;

		/**
		 * Show vouch information
		 */
		showVouches?: boolean;

		/**
		 * Custom rendering
		 */
		content?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { showDetails = false, showVouches = true, content, class: className = '' }: Props = $props();

	const { state: profileState } = getProfileContext();

	// Extract Lesser-specific data from profile (ProfileData has these fields directly)
	const trustScore = $derived(profileState.profile?.trustScore);
	const reputation: Reputation | undefined = $derived(profileState.profile?.reputation);
	const vouches = $derived(profileState.profile?.vouches || []);

	const hasTrustData = $derived(
		trustScore !== undefined || reputation !== undefined || vouches.length > 0
	);

	// Trust score color and label
	const trustLevel = $derived(() => {
		if (!trustScore) return null;
		if (trustScore >= 80) return { color: 'green', label: 'High Trust' };
		if (trustScore >= 50) return { color: 'medium', label: 'Medium Trust' };
		if (trustScore >= 20) return { color: 'low', label: 'Low Trust' };
		return { color: 'critical', label: 'Very Low Trust' };
	});

	let showFullDetails = $state(false);

	function toggleDetails() {
		showFullDetails = !showFullDetails;
	}
</script>

{#if hasTrustData}
	<div class="profile-trust-badge {className}">
		{#if content}
			{@render content()}
		{:else}
			<!-- Trust Score Badge -->
			{#if trustScore !== undefined}
				<div class="trust-badge trust-badge--{trustLevel()?.color}">
					<svg class="trust-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
						/>
					</svg>
					<div class="trust-badge__content">
						<div class="trust-badge__score">{trustScore}</div>
						<div class="trust-badge__label">{trustLevel()?.label}</div>
					</div>
				</div>
			{/if}

			<!-- Vouch Count -->
			{#if showVouches && vouches.length > 0}
				<div class="vouch-count">
					<svg class="vouch-count__icon" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
						/>
					</svg>
					<span>{vouches.length} vouch{vouches.length !== 1 ? 'es' : ''}</span>
				</div>
			{/if}

			<!-- Reputation Details (toggle) -->
			{#if showDetails && reputation}
				<div class="reputation-details">
					<button
						class="reputation-details__toggle"
						onclick={toggleDetails}
						aria-expanded={showFullDetails}
					>
						<span>Reputation Details</span>
						<svg
							class="reputation-details__toggle-icon"
							class:expanded={showFullDetails}
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path fill="currentColor" d="M7 10l5 5 5-5z" />
						</svg>
					</button>

					{#if showFullDetails}
						<div class="reputation-details__content">
							<div class="reputation-score">
								<span class="reputation-score__label">Trust</span>
								<span class="reputation-score__value">{reputation.trustScore}</span>
							</div>
							<div class="reputation-score">
								<span class="reputation-score__label">Activity</span>
								<span class="reputation-score__value">{reputation.activityScore}</span>
							</div>
							<div class="reputation-score">
								<span class="reputation-score__label">Moderation</span>
								<span class="reputation-score__value">{reputation.moderationScore}</span>
							</div>
							<div class="reputation-score">
								<span class="reputation-score__label">Community</span>
								<span class="reputation-score__value">{reputation.communityScore}</span>
							</div>

							<div class="reputation-evidence">
								<div class="reputation-evidence__item">
									<span>Posts:</span>
									<span>{reputation.evidence.totalPosts}</span>
								</div>
								<div class="reputation-evidence__item">
									<span>Followers:</span>
									<span>{reputation.evidence.totalFollowers}</span>
								</div>
								<div class="reputation-evidence__item">
									<span>Account Age:</span>
									<span>{Math.floor(reputation.evidence.accountAge / 365)} years</span>
								</div>
								<div class="reputation-evidence__item">
									<span>Trusting Actors:</span>
									<span>{reputation.evidence.trustingActors}</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.profile-trust-badge {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.75rem;
		padding: 1rem;
		background: var(--profile-trust-bg, #f7f9fa);
		border: 1px solid var(--profile-trust-border, #e1e8ed);
		border-radius: 0.5rem;
	}

	.trust-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--profile-bg-primary, #ffffff);
		border: 2px solid;
		border-radius: 0.5rem;
	}

	.trust-badge--green {
		border-color: var(--trust-green, #10b981);
		color: var(--trust-green, #10b981);
	}

	.trust-badge--medium {
		border-color: var(--trust-yellow, #f59e0b);
		color: var(--trust-yellow, #f59e0b);
	}

	.trust-badge--low {
		border-color: var(--trust-orange, #f97316);
		color: var(--trust-orange, #f97316);
	}

	.trust-badge--critical {
		border-color: var(--trust-red, #ef4444);
		color: var(--trust-red, #ef4444);
	}

	.trust-badge__icon {
		width: 32px;
		height: 32px;
		flex-shrink: 0;
	}

	.trust-badge__content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.trust-badge__score {
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
	}

	.trust-badge__label {
		font-size: 0.75rem;
		font-weight: 500;
		opacity: 0.8;
	}

	.vouch-count {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--profile-bg-primary, #ffffff);
		border: 1px solid var(--profile-border, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--profile-text-secondary, #536471);
	}

	.vouch-count__icon {
		width: 20px;
		height: 20px;
	}

	.reputation-details {
		width: 100%;
	}

	.reputation-details__toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.5rem;
		background: transparent;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--profile-text-primary, #0f1419);
		cursor: pointer;
	}

	.reputation-details__toggle:hover {
		background: var(--profile-bg-hover, #f7f9fa);
		border-radius: 0.25rem;
	}

	.reputation-details__toggle-icon {
		width: 20px;
		height: 20px;
		transition: transform 0.2s;
	}

	.reputation-details__toggle-icon.expanded {
		transform: rotate(180deg);
	}

	.reputation-details__content {
		padding: 0.75rem;
		background: var(--profile-bg-primary, #ffffff);
		border: 1px solid var(--profile-border, #e1e8ed);
		border-radius: 0.5rem;
		margin-top: 0.5rem;
	}

	.reputation-score {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--profile-border-light, #f0f0f0);
	}

	.reputation-score:last-child {
		border-bottom: none;
	}

	.reputation-score__label {
		font-size: 0.875rem;
		color: var(--profile-text-secondary, #536471);
	}

	.reputation-score__value {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--profile-text-primary, #0f1419);
	}

	.reputation-evidence {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--profile-border, #e1e8ed);
	}

	.reputation-evidence__item {
		display: flex;
		justify-content: space-between;
		padding: 0.375rem 0;
		font-size: 0.8125rem;
		color: var(--profile-text-secondary, #536471);
	}

	.reputation-evidence__item span:last-child {
		font-weight: 500;
		color: var(--profile-text-primary, #0f1419);
	}
</style>
