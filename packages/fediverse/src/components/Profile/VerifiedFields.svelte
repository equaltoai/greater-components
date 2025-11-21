<!--
Profile.VerifiedFields - Display profile fields with verification badges

Shows custom profile fields with rel=me verification indicators for linked websites.
Supports external link icons and verification tooltips.

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
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

	getProfileContext();

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

<dl class={`verified-fields ${className}`}>
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
						title={`Verified on ${formatVerifiedDate(field.verifiedAt)}`}
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
