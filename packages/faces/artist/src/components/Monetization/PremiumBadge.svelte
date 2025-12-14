<!--
Monetization.PremiumBadge - Premium tier indicator component

REQ-ECON-003: Premium features indicator
REQ-PHIL-007: No algorithmic promotion tied to payment

Features:
- Tier-based styling (free, pro, studio, enterprise)
- Feature list tooltip
- Non-intrusive upgrade prompt
- Accessible design

@component
@example
```svelte
<script>
  import { PremiumBadge } from '@equaltoai/greater-components/faces/artist/Monetization';
</script>

<PremiumBadge 
  tier="pro" 
  features={['Advanced analytics', 'Unlimited storage']} 
  showUpgrade 
/>
```
-->

<script lang="ts">
	import type { PremiumTier, PremiumFeature } from '../../types/index.js';

	interface Props {
		/** Current premium tier */
		tier: PremiumTier;
		/** Features included in tier */
		features?: string[] | PremiumFeature[];
		/** Badge size */
		size?: 'sm' | 'md' | 'lg';
		/** Show tier name */
		showTierName?: boolean;
		/** Show features on hover */
		showFeaturesOnHover?: boolean;
		/** Show upgrade prompt */
		showUpgrade?: boolean;
		/** Called when upgrade is clicked */
		onUpgrade?: () => void;
		/** Custom CSS class */
		class?: string;
	}

	let {
		tier,
		features = [],
		size = 'md',
		showTierName = true,
		showFeaturesOnHover = true,
		showUpgrade = false,
		onUpgrade,
		class: className = '',
	}: Props = $props();

	// State
	let showTooltip = $state(false);

	// Tier configuration
	const tierConfig: Record<PremiumTier, { label: string; icon: string; color: string }> = {
		free: { label: 'Free', icon: '○', color: 'gray' },
		pro: { label: 'Pro', icon: '★', color: 'primary' },
		studio: { label: 'Studio', icon: '◆', color: 'warning' },
		enterprise: { label: 'Enterprise', icon: '◈', color: 'success' },
	};

	const config = $derived(tierConfig[tier] || tierConfig.free);

	// Get feature names
	const featureNames = $derived(() => {
		return features.map((f) => (typeof f === 'string' ? f : f.name));
	});

	// Can upgrade
	const canUpgrade = $derived(tier !== 'enterprise' && showUpgrade);

	// Next tier
	const nextTier = $derived(() => {
		const tiers: PremiumTier[] = ['free', 'pro', 'studio', 'enterprise'];
		const currentIndex = tiers.indexOf(tier);
		return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
	});

	// Handle mouse events
	function handleMouseEnter() {
		if (showFeaturesOnHover && featureNames().length > 0) {
			showTooltip = true;
		}
	}

	function handleMouseLeave() {
		showTooltip = false;
	}

	// Handle keyboard
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			if (canUpgrade && onUpgrade) {
				event.preventDefault();
				onUpgrade();
			}
		}
	}

	// Compute CSS classes
	const badgeClass = $derived(
		[
			'gr-monetization-badge',
			`gr-monetization-badge--${size}`,
			`gr-monetization-badge--${config.color}`,
			canUpgrade && 'gr-monetization-badge--clickable',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={badgeClass}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onfocus={handleMouseEnter}
	onblur={handleMouseLeave}
	onkeydown={handleKeydown}
	role={canUpgrade ? 'button' : 'status'}
	tabindex={canUpgrade ? 0 : -1}
	aria-label="{config.label} tier{featureNames().length > 0
		? `, includes ${featureNames().length} features`
		: ''}"
>
	<span class="gr-monetization-badge-icon" aria-hidden="true">{config.icon}</span>
	{#if showTierName}
		<span class="gr-monetization-badge-label">{config.label}</span>
	{/if}

	<!-- Tooltip -->
	{#if showTooltip && featureNames().length > 0}
		<div class="gr-monetization-badge-tooltip" role="tooltip">
			<div class="gr-monetization-badge-tooltip-header">
				<span class="gr-monetization-badge-tooltip-tier">{config.label} Features</span>
			</div>
			<ul class="gr-monetization-badge-tooltip-features">
				{#each featureNames() as feature (feature)}
					<li class="gr-monetization-badge-tooltip-feature">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						{feature}
					</li>
				{/each}
			</ul>
			{#if canUpgrade && nextTier()}
				<button type="button" class="gr-monetization-badge-tooltip-upgrade" onclick={onUpgrade}>
					Upgrade to {tierConfig[nextTier()!].label}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.gr-monetization-badge {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		border-radius: var(--gr-radii-full);
		font-family: var(--gr-typography-fontFamily-sans);
		font-weight: var(--gr-typography-fontWeight-medium);
		transition: all 200ms ease-out;
	}

	/* Sizes */
	.gr-monetization-badge--sm {
		font-size: var(--gr-typography-fontSize-xs);
		padding: 2px var(--gr-spacing-scale-2);
	}

	.gr-monetization-badge--md {
		font-size: var(--gr-typography-fontSize-sm);
	}

	.gr-monetization-badge--lg {
		font-size: var(--gr-typography-fontSize-base);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
	}

	/* Colors */
	.gr-monetization-badge--gray {
		background: var(--gr-color-gray-800);
		color: var(--gr-color-gray-300);
	}

	.gr-monetization-badge--primary {
		background: var(--gr-color-primary-500/20);
		color: var(--gr-color-primary-400);
	}

	.gr-monetization-badge--warning {
		background: var(--gr-color-warning-500/20);
		color: var(--gr-color-warning-400);
	}

	.gr-monetization-badge--success {
		background: var(--gr-color-success-500/20);
		color: var(--gr-color-success-400);
	}

	/* Clickable */
	.gr-monetization-badge--clickable {
		cursor: pointer;
	}

	.gr-monetization-badge--clickable:hover {
		filter: brightness(1.1);
	}

	.gr-monetization-badge--clickable:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Icon */
	.gr-monetization-badge-icon {
		font-size: 1.1em;
	}

	/* Tooltip */
	.gr-monetization-badge-tooltip {
		position: absolute;
		top: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		min-width: 200px;
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		padding: var(--gr-spacing-scale-3);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 100;
	}

	.gr-monetization-badge-tooltip::before {
		content: '';
		position: absolute;
		top: -6px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-bottom: 6px solid var(--gr-color-gray-700);
	}

	.gr-monetization-badge-tooltip-header {
		margin-bottom: var(--gr-spacing-scale-2);
		padding-bottom: var(--gr-spacing-scale-2);
		border-bottom: 1px solid var(--gr-color-gray-700);
	}

	.gr-monetization-badge-tooltip-tier {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-semibold);
		color: var(--gr-color-gray-100);
	}

	.gr-monetization-badge-tooltip-features {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.gr-monetization-badge-tooltip-feature {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-1) 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
	}

	.gr-monetization-badge-tooltip-feature svg {
		width: 14px;
		height: 14px;
		color: var(--gr-color-success-400);
		flex-shrink: 0;
	}

	.gr-monetization-badge-tooltip-upgrade {
		width: 100%;
		margin-top: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		cursor: pointer;
		transition: background 200ms ease-out;
	}

	.gr-monetization-badge-tooltip-upgrade:hover {
		background: var(--gr-color-primary-500);
	}
</style>
