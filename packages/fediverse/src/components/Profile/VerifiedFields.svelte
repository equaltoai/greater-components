<!--
Profile.VerifiedFields - Display profile fields with verification badges

Shows custom profile fields with rel=me verification indicators for linked websites.
Supports external link icons and verification tooltips.

@component
@example
```svelte
<script>
  import { Profile } from '@greater/fediverse';
  
  const fields = [
    { name: 'Website', value: 'https://example.com', verifiedAt: '2024-01-15' },
    { name: 'GitHub', value: 'https://github.com/user', verifiedAt: null }
  ];
</script>

<Profile.VerifiedFields {fields} showVerificationBadge={true} />
```
-->

<script lang="ts">
	import type { ProfileField } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * Profile fields to display
		 */
		fields?: ProfileField[];

		/**
		 * Show verification badges for verified fields
		 */
		showVerificationBadge?: boolean;

		/**
		 * Maximum fields to display (0 = all)
		 */
		maxFields?: number;

		/**
		 * Show external link icons for URLs
		 */
		showExternalIcon?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		fields = [],
		showVerificationBadge = true,
		maxFields = 4,
		showExternalIcon = true,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	// Limit fields if maxFields is set
	const displayFields = $derived(maxFields > 0 ? fields.slice(0, maxFields) : fields);

	/**
	 * Check if value is a URL
	 */
	function isUrl(value: string): boolean {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Check if field is verified
	 */
	function isVerified(field: ProfileField): boolean {
		return !!field.verifiedAt;
	}

	/**
	 * Format verification date for tooltip
	 */
	function formatVerifiedDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch {
			return 'Verified';
		}
	}

	/**
	 * Parse HTML value safely (for Mastodon-style fields)
	 */
	function parseValue(value: string): { text: string; url?: string } {
		// Check if value contains HTML link
		const linkMatch = value.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
		if (linkMatch) {
			return {
				text: linkMatch[2],
				url: linkMatch[1],
			};
		}

		// Check if value is a plain URL
		if (isUrl(value)) {
			return {
				text: value,
				url: value,
			};
		}

		return {
			text: value,
		};
	}
</script>

<dl class="verified-fields {className}">
	{#each displayFields as field (field.name)}
		{@const parsedValue = parseValue(field.value)}
		{@const verified = isVerified(field)}

		<div class="verified-fields__item" class:verified-fields__item--verified={verified}>
			<dt class="verified-fields__name">
				{field.name}
			</dt>
			<dd class="verified-fields__value">
				{#if parsedValue.url}
					<a
						href={parsedValue.url}
						target="_blank"
						rel="nofollow noopener noreferrer me"
						class="verified-fields__link"
					>
						{parsedValue.text}
						{#if showExternalIcon}
							<svg
								class="verified-fields__external-icon"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-label="External link"
							>
								<path
									d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
								/>
							</svg>
						{/if}
					</a>
				{:else}
					<span class="verified-fields__text">{parsedValue.text}</span>
				{/if}

				{#if showVerificationBadge && verified && field.verifiedAt}
					<span
						class="verified-fields__badge"
						title="Verified on {formatVerifiedDate(field.verifiedAt)}"
						aria-label="Verified field"
					>
						<svg
							class="verified-fields__check-icon"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
					</span>
				{/if}
			</dd>
		</div>
	{/each}

	{#if fields.length === 0}
		<div class="verified-fields__empty">
			<p>No profile fields</p>
		</div>
	{/if}
</dl>

<style>
	.verified-fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
	}

	.verified-fields__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--field-bg, #f7f9fa);
		border: 1px solid var(--field-border, #eff3f4);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.verified-fields__item--verified {
		background: var(--verified-field-bg, #e8f5e9);
		border-color: var(--verified-field-border, #4caf50);
	}

	.verified-fields__name {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		margin: 0;
		word-break: break-word;
	}

	.verified-fields__value {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		margin: 0;
		word-break: break-word;
	}

	.verified-fields__link {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		transition: color 0.2s;
	}

	.verified-fields__link:hover {
		color: var(--primary-hover, #1a8cd8);
		text-decoration: underline;
	}

	.verified-fields__link:focus {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: 2px;
		border-radius: 0.25rem;
	}

	.verified-fields__text {
		color: var(--text-primary, #0f1419);
	}

	.verified-fields__external-icon {
		flex-shrink: 0;
		opacity: 0.6;
	}

	.verified-fields__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		background: var(--verified-badge-bg, #4caf50);
		border-radius: 50%;
		flex-shrink: 0;
		cursor: help;
	}

	.verified-fields__check-icon {
		color: white;
		width: 14px;
		height: 14px;
	}

	.verified-fields__empty {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.9375rem;
	}

	.verified-fields__empty p {
		margin: 0;
	}

	@media (max-width: 640px) {
		.verified-fields__item {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.verified-fields__name {
			padding-bottom: 0.25rem;
			border-bottom: 1px solid var(--field-divider, #eff3f4);
		}
	}
</style>
