<!--
Transparency.EthicalSourcingBadge - Ethical AI sourcing verification badge

REQ-AI-010: Verify AI training data respects artist rights

Features:
- Model provenance information
- Flag potentially problematic AI sources
- Certification levels:
  - Verified ethical
  - Unverified
  - Flagged concerns

@component
@example
```svelte
<script>
  import { EthicalSourcingBadge } from '@equaltoai/greater-components/faces/artist/Transparency';
  
  const verification = {
    id: '1',
    category: 'ai-ethics',
    level: 'third-party-verified',
    title: 'Ethical AI Training',
    description: 'This AI model was trained on ethically sourced data',
    verifiedAt: new Date()
  };
</script>

<EthicalSourcingBadge {verification} />
```
-->

<script lang="ts">
	import type {
		EthicalVerification,
		EthicalVerificationLevel,
		EthicalSourcingCategory,
	} from '../../types/transparency.js';

	interface Props {
		/** Verification data */
		verification: EthicalVerification;
		/** Badge size */
		size?: 'sm' | 'md' | 'lg';
		/** Show verification level */
		showLevel?: boolean;
		/** Show verifier information */
		showVerifier?: boolean;
		/** Show expiration date */
		showExpiration?: boolean;
		/** Enable click for details */
		clickable?: boolean;
		/** Custom CSS class */
		class?: string;
		/** Click handler */
		onClick?: (verification: EthicalVerification) => void;
	}

	let {
		verification,
		size = 'md',
		showLevel = true,
		showVerifier = false,
		showExpiration = false,
		clickable = true,
		class: className = '',
		onClick,
	}: Props = $props();

	// Expanded state for details
	let showDetails = $state(false);

	// Get verification status
	const verificationStatus = $derived(() => {
		const level = verification.level;
		if (level === 'third-party-verified') {
			return { status: 'verified', label: 'Verified Ethical', color: 'green' };
		} else if (level === 'peer-verified') {
			return { status: 'peer', label: 'Peer Verified', color: 'blue' };
		} else if (level === 'self-declared') {
			return { status: 'unverified', label: 'Self-Declared', color: 'yellow' };
		}
		return { status: 'unknown', label: 'Unknown', color: 'gray' };
	});

	// Check if verification is expired
	const isExpired = $derived(() => {
		if (!verification.expiresAt) return false;
		const expiry =
			typeof verification.expiresAt === 'string'
				? new Date(verification.expiresAt)
				: verification.expiresAt;
		return expiry < new Date();
	});

	// Format date
	function formatDate(date: Date | string | undefined): string {
		if (!date) return '';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	// Get category icon
	function getCategoryIcon(category: EthicalSourcingCategory): string {
		const icons: Record<EthicalSourcingCategory, string> = {
			materials: '🎨',
			labor: '👷',
			environmental: '🌱',
			cultural: '🌍',
			'ai-ethics': '🤖',
		};
		return icons[category] || '✓';
	}

	// Get level icon
	function getLevelIcon(level: EthicalVerificationLevel): string {
		const icons: Record<EthicalVerificationLevel, string> = {
			'third-party-verified': '✓✓',
			'peer-verified': '✓',
			'self-declared': '○',
		};
		return icons[level] || '?';
	}

	// Handle click
	function handleClick() {
		if (clickable) {
			if (onClick) {
				onClick(verification);
			} else {
				showDetails = !showDetails;
			}
		}
	}

	// Handle keyboard
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	// Compute CSS classes
	const badgeClass = $derived(
		[
			'gr-transparency-ethical-badge',
			`gr-transparency-ethical-badge--${size}`,
			`gr-transparency-ethical-badge--${verificationStatus().color}`,
			isExpired() && 'gr-transparency-ethical-badge--expired',
			clickable && 'gr-transparency-ethical-badge--clickable',
			showDetails && 'gr-transparency-ethical-badge--expanded',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={badgeClass}>
	<button
		type="button"
		class="gr-transparency-ethical-badge-main"
		onclick={handleClick}
		onkeydown={handleKeydown}
		aria-expanded={showDetails}
		aria-label="{verification.title} - {verificationStatus().label}"
		disabled={!clickable}
	>
		<!-- Badge icon -->
		<span class="gr-transparency-ethical-badge-icon" aria-hidden="true">
			{#if verification.badgeUrl}
				<img src={verification.badgeUrl} alt="" />
			{:else}
				<span class="gr-transparency-ethical-badge-icon-text">
					{getCategoryIcon(verification.category)}
				</span>
			{/if}
		</span>

		<!-- Badge content -->
		<span class="gr-transparency-ethical-badge-content">
			<span class="gr-transparency-ethical-badge-title">{verification.title}</span>
			{#if showLevel}
				<span class="gr-transparency-ethical-badge-level">
					<span class="gr-transparency-ethical-badge-level-icon" aria-hidden="true">
						{getLevelIcon(verification.level)}
					</span>
					{verificationStatus().label}
				</span>
			{/if}
		</span>

		<!-- Status indicator -->
		<span class="gr-transparency-ethical-badge-status" aria-hidden="true">
			{#if isExpired()}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
			{:else if verificationStatus().status === 'verified'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			{:else if verificationStatus().status === 'peer'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="16" x2="12" y2="12" />
					<line x1="12" y1="8" x2="12.01" y2="8" />
				</svg>
			{/if}
		</span>
	</button>

	<!-- Expanded details -->
	{#if showDetails}
		<div
			class="gr-transparency-ethical-badge-details"
			role="region"
			aria-label="Verification details"
		>
			<p class="gr-transparency-ethical-badge-desc">{verification.description}</p>

			<dl class="gr-transparency-ethical-badge-meta">
				<div class="gr-transparency-ethical-badge-meta-item">
					<dt>Category</dt>
					<dd>{verification.category.replace('-', ' ')}</dd>
				</div>

				<div class="gr-transparency-ethical-badge-meta-item">
					<dt>Verified</dt>
					<dd>{formatDate(verification.verifiedAt)}</dd>
				</div>

				{#if showExpiration && verification.expiresAt}
					<div class="gr-transparency-ethical-badge-meta-item">
						<dt>Expires</dt>
						<dd class:expired={isExpired()}>{formatDate(verification.expiresAt)}</dd>
					</div>
				{/if}

				{#if showVerifier && verification.verifier}
					<div
						class="gr-transparency-ethical-badge-meta-item gr-transparency-ethical-badge-meta-item--full"
					>
						<dt>Verified by</dt>
						<dd>
							{verification.verifier.name}
							{#if verification.verifier.organization}
								<span class="gr-transparency-ethical-badge-org">
									({verification.verifier.organization})
								</span>
							{/if}
							{#if verification.verifier.url}
								<a
									href={verification.verifier.url}
									target="_blank"
									rel="noopener noreferrer"
									class="gr-transparency-ethical-badge-link"
								>
									View profile
								</a>
							{/if}
						</dd>
					</div>
				{/if}
			</dl>

			{#if verification.documentation?.length}
				<div class="gr-transparency-ethical-badge-docs">
					<span class="gr-transparency-ethical-badge-docs-label">Documentation:</span>
					<ul class="gr-transparency-ethical-badge-docs-list">
						{#each verification.documentation as doc (doc)}
							<li>
								<a href={doc} target="_blank" rel="noopener noreferrer"> View document </a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.gr-transparency-ethical-badge {
		font-family: var(--gr-typography-fontFamily-sans);
		display: inline-flex;
		flex-direction: column;
	}

	/* Main badge button */
	.gr-transparency-ethical-badge-main {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		cursor: default;
		transition: all 200ms ease-out;
	}

	.gr-transparency-ethical-badge--clickable .gr-transparency-ethical-badge-main {
		cursor: pointer;
	}

	.gr-transparency-ethical-badge--clickable .gr-transparency-ethical-badge-main:hover {
		background: var(--gr-color-gray-750);
		border-color: var(--gr-color-gray-600);
	}

	.gr-transparency-ethical-badge-main:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-transparency-ethical-badge-main:disabled {
		cursor: default;
	}

	/* Size variants */
	.gr-transparency-ethical-badge--sm .gr-transparency-ethical-badge-main {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		gap: var(--gr-spacing-scale-1);
	}

	.gr-transparency-ethical-badge--lg .gr-transparency-ethical-badge-main {
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		gap: var(--gr-spacing-scale-3);
	}

	/* Color variants */
	.gr-transparency-ethical-badge--green .gr-transparency-ethical-badge-main {
		border-color: var(--gr-color-green-700);
		background: var(--gr-color-green-900);
	}

	.gr-transparency-ethical-badge--blue .gr-transparency-ethical-badge-main {
		border-color: var(--gr-color-blue-700);
		background: var(--gr-color-blue-900);
	}

	.gr-transparency-ethical-badge--yellow .gr-transparency-ethical-badge-main {
		border-color: var(--gr-color-amber-700);
		background: var(--gr-color-amber-900);
	}

	.gr-transparency-ethical-badge--expired .gr-transparency-ethical-badge-main {
		border-color: var(--gr-color-red-700);
		background: var(--gr-color-red-900);
		opacity: 0.7;
	}

	/* Icon */
	.gr-transparency-ethical-badge-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}

	.gr-transparency-ethical-badge--sm .gr-transparency-ethical-badge-icon {
		width: 18px;
		height: 18px;
	}

	.gr-transparency-ethical-badge--lg .gr-transparency-ethical-badge-icon {
		width: 32px;
		height: 32px;
	}

	.gr-transparency-ethical-badge-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.gr-transparency-ethical-badge-icon-text {
		font-size: var(--gr-typography-fontSize-base);
	}

	.gr-transparency-ethical-badge--sm .gr-transparency-ethical-badge-icon-text {
		font-size: var(--gr-typography-fontSize-sm);
	}

	.gr-transparency-ethical-badge--lg .gr-transparency-ethical-badge-icon-text {
		font-size: var(--gr-typography-fontSize-lg);
	}

	/* Content */
	.gr-transparency-ethical-badge-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-0-5);
	}

	.gr-transparency-ethical-badge-title {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-gray-100);
	}

	.gr-transparency-ethical-badge--sm .gr-transparency-ethical-badge-title {
		font-size: var(--gr-typography-fontSize-xs);
	}

	.gr-transparency-ethical-badge--lg .gr-transparency-ethical-badge-title {
		font-size: var(--gr-typography-fontSize-base);
	}

	.gr-transparency-ethical-badge-level {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-ethical-badge--green .gr-transparency-ethical-badge-level {
		color: var(--gr-color-green-400);
	}

	.gr-transparency-ethical-badge--blue .gr-transparency-ethical-badge-level {
		color: var(--gr-color-blue-400);
	}

	.gr-transparency-ethical-badge--yellow .gr-transparency-ethical-badge-level {
		color: var(--gr-color-amber-400);
	}

	.gr-transparency-ethical-badge-level-icon {
		font-weight: var(--gr-typography-fontWeight-bold);
	}

	/* Status */
	.gr-transparency-ethical-badge-status {
		margin-left: auto;
	}

	.gr-transparency-ethical-badge-status svg {
		width: 18px;
		height: 18px;
	}

	.gr-transparency-ethical-badge--sm .gr-transparency-ethical-badge-status svg {
		width: 14px;
		height: 14px;
	}

	.gr-transparency-ethical-badge--lg .gr-transparency-ethical-badge-status svg {
		width: 22px;
		height: 22px;
	}

	.gr-transparency-ethical-badge--green .gr-transparency-ethical-badge-status {
		color: var(--gr-color-green-400);
	}

	.gr-transparency-ethical-badge--blue .gr-transparency-ethical-badge-status {
		color: var(--gr-color-blue-400);
	}

	.gr-transparency-ethical-badge--yellow .gr-transparency-ethical-badge-status {
		color: var(--gr-color-amber-400);
	}

	.gr-transparency-ethical-badge--expired .gr-transparency-ethical-badge-status {
		color: var(--gr-color-red-400);
	}

	/* Details */
	.gr-transparency-ethical-badge-details {
		margin-top: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-850);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
	}

	.gr-transparency-ethical-badge-desc {
		margin: 0 0 var(--gr-spacing-scale-4) 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
		line-height: 1.5;
	}

	.gr-transparency-ethical-badge-meta {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--gr-spacing-scale-3);
		margin: 0;
	}

	.gr-transparency-ethical-badge-meta-item {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-0-5);
	}

	.gr-transparency-ethical-badge-meta-item--full {
		grid-column: 1 / -1;
	}

	.gr-transparency-ethical-badge-meta dt {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.gr-transparency-ethical-badge-meta dd {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-200);
		text-transform: capitalize;
	}

	.gr-transparency-ethical-badge-meta dd.expired {
		color: var(--gr-color-red-400);
	}

	.gr-transparency-ethical-badge-org {
		color: var(--gr-color-gray-400);
	}

	.gr-transparency-ethical-badge-link {
		display: block;
		margin-top: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-primary-400);
		text-decoration: none;
	}

	.gr-transparency-ethical-badge-link:hover {
		text-decoration: underline;
	}

	/* Documentation */
	.gr-transparency-ethical-badge-docs {
		margin-top: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-3);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.gr-transparency-ethical-badge-docs-label {
		display: block;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ethical-badge-docs-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
	}

	.gr-transparency-ethical-badge-docs-list a {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-primary-400);
		text-decoration: none;
	}

	.gr-transparency-ethical-badge-docs-list a:hover {
		text-decoration: underline;
	}
</style>
