<!--
  FederationIndicator - Show Local vs Remote Content
  
  Displays indicator for content source (local instance vs federated).
  Useful for helping users understand where content comes from.
  
  @component
  @example
  ```svelte
  <FederationIndicator
    actorUrl="https://mastodon.social/@alice"
    localInstance="lesser.occult.institute"
    {config}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ActivityPubActor } from '../generics/index.js';

	interface FederationConfig {
		/**
		 * Display mode
		 */
		mode?: 'icon' | 'badge' | 'full';

		/**
		 * Show instance name
		 */
		showInstance?: boolean;

		/**
		 * Position
		 */
		position?: 'inline' | 'absolute';

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Show tooltip
		 */
		showTooltip?: boolean;
	}

	interface Props {
		/**
		 * The actor (account) to check
		 */
		actor?: ActivityPubActor;

		/**
		 * Alternative: actor URL string
		 */
		actorUrl?: string;

		/**
		 * Local instance domain
		 */
		localInstance: string;

		/**
		 * Configuration
		 */
		config?: FederationConfig;

		/**
		 * Custom local indicator
		 */
		renderLocal?: Snippet;

		/**
		 * Custom remote indicator
		 */
		renderRemote?: Snippet<[string]>;

		/**
		 * Click handler
		 */
		onClick?: (isLocal: boolean, instanceDomain: string) => void;
	}

	let {
		actor,
		actorUrl,
		localInstance,
		config = {},
		renderLocal,
		renderRemote,
		onClick,
	}: Props = $props();

	const {
		mode = 'badge',
		showInstance = true,
		position = 'inline',
		class: className = '',
		showTooltip = true,
	} = config;

	/**
	 * Extract instance domain from actor URL
	 */
	function getInstanceDomain(url: string): string {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname;
		} catch {
			return '';
		}
	}

	/**
	 * Get actor URL from actor object or string
	 */
	function getActorUrl(): string {
		if (actorUrl) return actorUrl;
		if (actor?.id) return actor.id;
		if (actor?.url) return actor.url;
		return '';
	}

	const url = $derived(getActorUrl());
	const instanceDomain = $derived(getInstanceDomain(url));
	const isLocal = $derived(instanceDomain === localInstance || instanceDomain === '');

	/**
	 * Get tooltip text
	 */
	function getTooltip(): string {
		if (isLocal) {
			return `Local account on ${localInstance}`;
		}
		return `Remote account from ${instanceDomain}`;
	}

	const tooltip = $derived(getTooltip());

	/**
	 * Handle click
	 */
	function handleClick() {
		onClick?.(isLocal, instanceDomain);
	}
</script>

<svelte:element
	this={onClick ? 'button' : 'div'}
	type={onClick ? 'button' : undefined}
	class={`federation-indicator federation-indicator--${mode} federation-indicator--${position} ${className}`}
	class:federation-indicator--local={isLocal}
	class:federation-indicator--remote={!isLocal}
	role={onClick ? 'button' : undefined}
	title={showTooltip ? tooltip : undefined}
	onclick={onClick ? handleClick : undefined}
>
	{#if isLocal}
		{#if renderLocal}
			{@render renderLocal()}
		{:else if mode === 'icon'}
			<svg class="federation-indicator__icon" viewBox="0 0 24 24" fill="currentColor">
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			</svg>
		{:else if mode === 'badge'}
			<span class="federation-indicator__badge">
				<svg class="federation-indicator__badge-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
				</svg>
				{#if showInstance}
					<span class="federation-indicator__text">Local</span>
				{/if}
			</span>
		{:else}
			<span class="federation-indicator__full">
				<svg class="federation-indicator__full-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
				</svg>
				<span class="federation-indicator__full-text">
					<span class="federation-indicator__label">Local</span>
					{#if showInstance}
						<span class="federation-indicator__instance">{localInstance}</span>
					{/if}
				</span>
			</span>
		{/if}
	{:else if renderRemote}
		{@render renderRemote(instanceDomain)}
	{:else if mode === 'icon'}
		<svg class="federation-indicator__icon" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
			/>
		</svg>
	{:else if mode === 'badge'}
		<span class="federation-indicator__badge">
			<svg class="federation-indicator__badge-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
				/>
			</svg>
			{#if showInstance}
				<span class="federation-indicator__text">{instanceDomain}</span>
			{/if}
		</span>
	{:else}
		<span class="federation-indicator__full">
			<svg class="federation-indicator__full-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
				/>
			</svg>
			<span class="federation-indicator__full-text">
				<span class="federation-indicator__label">Federated</span>
				{#if showInstance}
					<span class="federation-indicator__instance">{instanceDomain}</span>
				{/if}
			</span>
		</span>
	{/if}
</svelte:element>

<style>
	.federation-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		user-select: none;
	}

	.federation-indicator--inline {
		vertical-align: middle;
	}

	.federation-indicator--absolute {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
	}

	/* Icon mode */
	.federation-indicator--icon .federation-indicator__icon {
		width: 1rem;
		height: 1rem;
		color: var(--text-secondary, #536471);
	}

	.federation-indicator--icon.federation-indicator--local .federation-indicator__icon {
		color: var(--success-color, #00ba7c);
	}

	.federation-indicator--icon.federation-indicator--remote .federation-indicator__icon {
		color: var(--info-color, #1d9bf0);
	}

	/* Badge mode */
	.federation-indicator__badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1;
	}

	.federation-indicator--local .federation-indicator__badge {
		background: var(--success-bg, #d4edda);
		color: var(--success-text, #155724);
	}

	.federation-indicator--remote .federation-indicator__badge {
		background: var(--info-bg, #d1ecf1);
		color: var(--info-text, #0c5460);
	}

	.federation-indicator__badge-icon {
		width: 0.875rem;
		height: 0.875rem;
	}

	/* Full mode */
	.federation-indicator__full {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
	}

	.federation-indicator--local .federation-indicator__full {
		background: var(--success-bg, #d4edda);
		border-color: var(--success-border, #c3e6cb);
	}

	.federation-indicator--remote .federation-indicator__full {
		background: var(--info-bg, #d1ecf1);
		border-color: var(--info-border, #bee5eb);
	}

	.federation-indicator__full-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.federation-indicator--local .federation-indicator__full-icon {
		color: var(--success-color, #28a745);
	}

	.federation-indicator--remote .federation-indicator__full-icon {
		color: var(--info-color, #17a2b8);
	}

	.federation-indicator__full-text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.federation-indicator__label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.federation-indicator--local .federation-indicator__label {
		color: var(--success-text, #155724);
	}

	.federation-indicator--remote .federation-indicator__label {
		color: var(--info-text, #0c5460);
	}

	.federation-indicator__instance {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary, #0f1419);
	}

	/* Clickable styles */
	.federation-indicator[role='button'] {
		cursor: pointer;
		transition: all 0.2s;
	}

	.federation-indicator[role='button']:hover {
		opacity: 0.8;
	}

	.federation-indicator[role='button']:focus-visible {
		outline: 2px solid var(--focus-color, #1d9bf0);
		outline-offset: 2px;
	}
</style>
