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
	const trustLevel = $derived.by(() => {
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
	<div class={`profile-trust-badge ${className}`}>
		{#if content}
			{@render content()}
		{:else}
				<!-- Trust Score Badge -->
				{#if trustScore !== undefined}
					<div class={`trust-badge trust-badge--${trustLevel?.color}`}>
						<svg class="trust-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
							/>
						</svg>
						<div class="trust-badge__content">
							<div class="trust-badge__score">{trustScore}</div>
							<div class="trust-badge__label">{trustLevel?.label}</div>
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
