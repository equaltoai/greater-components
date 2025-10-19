<!--
  Profile.Fields - Custom Profile Fields Display
  
  Displays custom profile fields with optional verification indicators.
  Used for links, pronouns, location, etc.
  
  @component
  @example
  ```svelte
  <Profile.Root {profile} {handlers}>
    <Profile.Fields maxFields={4} />
  </Profile.Root>
  ```
-->
<script lang="ts">
	import { getProfileContext } from './context.js';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';

	interface Props {
		/**
		 * Maximum number of fields to display
		 * @default 4
		 */
		maxFields?: number;

		/**
		 * Show verification indicators
		 * @default true
		 */
		showVerification?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { maxFields = 4, showVerification = true, class: className = '' }: Props = $props();

	const { state: profileState } = getProfileContext();

	const displayFields = $derived(profileState.profile?.fields?.slice(0, maxFields) || []);

	function sanitizeFieldValue(html: string): string {
		return sanitizeHtml(html, {
			allowedTags: ['a', 'span', 'strong', 'em', 'code'],
			allowedAttributes: ['href', 'rel', 'target', 'class', 'title'],
		});
	}

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
	}
</script>

{#if displayFields.length > 0}
	<div class={`profile-fields ${className}`}>
		<dl class="profile-fields__list">
			{#each displayFields as field (field.name)}
				<div class="profile-fields__item" class:profile-fields__item--verified={field.verifiedAt}>
					<dt class="profile-fields__name">{field.name}</dt>
					<dd class="profile-fields__value">
						<span
							class="profile-fields__value-content"
							use:setHtml={sanitizeFieldValue(field.value)}
						></span>
						{#if showVerification && field.verifiedAt}
							<svg
								class="profile-fields__verified-icon"
								viewBox="0 0 24 24"
								fill="currentColor"
								title="Verified"
							>
								<path
									d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
								/>
							</svg>
						{/if}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
{/if}

<style>
	.profile-fields {
		width: 100%;
	}

	.profile-fields__list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
	}

	.profile-fields__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		transition: border-color 0.2s;
	}

	.profile-fields__item--verified {
		border-color: var(--success-color, #00ba7c);
		background: rgba(0, 186, 124, 0.05);
	}

	.profile-fields__name {
		margin: 0;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		word-break: break-word;
	}

	.profile-fields__value {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary, #0f1419);
		word-break: break-word;
	}

	.profile-fields__value :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.profile-fields__value :global(a:hover) {
		text-decoration: underline;
	}

	.profile-fields__verified-icon {
		width: 1.125rem;
		height: 1.125rem;
		color: var(--success-color, #00ba7c);
		flex-shrink: 0;
	}
</style>
