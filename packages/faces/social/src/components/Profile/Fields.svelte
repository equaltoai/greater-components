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
							>
								<title>Verified</title>
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
