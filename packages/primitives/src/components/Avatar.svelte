<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import defaultAvatar from '../assets/greater-default-profile.png';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
		src?: string;
		alt?: string;
		name?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		shape?: 'circle' | 'square' | 'rounded';
		loading?: boolean;
		status?: 'online' | 'offline' | 'busy' | 'away';
		statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
		class?: string;
		fallback?: Snippet;
	}

	let {
		src,
		alt,
		name = '',
		size = 'md',
		shape = 'circle',
		loading = false,
		status,
		statusPosition = 'bottom-right',
		class: className = '',
		fallback,
		id,
		style,
		onclick,
		onmouseenter,
		onmouseleave,
		onfocus,
		onblur,
		onkeydown,
		onkeyup,
		role,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		tabindex,
	}: Props = $props();

	const INTERACTIVE_ROLES = new Set([
		'button',
		'checkbox',
		'combobox',
		'link',
		'menuitem',
		'menuitemcheckbox',
		'menuitemradio',
		'option',
		'radio',
		'searchbox',
		'slider',
		'spinbutton',
		'switch',
		'tab',
		'textbox',
		'treeitem',
	]);

	const parsedTabIndex = $derived<number | undefined>(() => {
		if (tabindex === undefined || tabindex === null) {
			return undefined;
		}
		if (typeof tabindex === 'number') {
			return Number.isFinite(tabindex) ? tabindex : undefined;
		}
		const numericValue = Number(tabindex);
		return Number.isFinite(numericValue) ? numericValue : undefined;
	});

	const hasInteractiveHandlers = $derived(() => Boolean(onclick || onkeydown || onkeyup));

	const isInteractiveRole = (roleValue: string | undefined): boolean => {
		if (!roleValue) {
			return false;
		}
		return INTERACTIVE_ROLES.has(roleValue);
	};

	const isInteractive = $derived(() => {
		if (isInteractiveRole(role)) {
			return true;
		}
		if (hasInteractiveHandlers) {
			return true;
		}
		if (parsedTabIndex !== undefined && parsedTabIndex >= 0) {
			return true;
		}
		return false;
	});

	// State management
	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageElement: HTMLImageElement | null = $state(null);

	// Compute avatar classes
	const avatarClass = $derived(() => {
		const classes = [
			'gr-avatar',
			`gr-avatar--${size}`,
			`gr-avatar--${shape}`,
			loading && 'gr-avatar--loading',
			status && 'gr-avatar--has-status',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Compute status classes
	const statusClass = $derived(() => {
		if (!status) return '';

		const classes = [
			'gr-avatar__status',
			`gr-avatar__status--${status}`,
			`gr-avatar__status--${statusPosition}`,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Generate initials from name
	const initials = $derived(() => {
		if (!name) return '';

		const words = name.trim().split(/\s+/);
		if (words.length === 1) {
			// Single word - take first two characters
			return words[0].substring(0, 2).toUpperCase();
		} else {
			// Multiple words - take first character of first two words
			return words
				.slice(0, 2)
				.map((word) => word.charAt(0))
				.join('')
				.toUpperCase();
		}
	});

	// Generate background color from name
	const initialsBackgroundColor = $derived(() => {
		if (!name) return 'var(--gr-semantic-background-secondary)';

		// Simple hash function to generate consistent color
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		// Convert to HSL for better color distribution
		const hue = Math.abs(hash) % 360;
		return `hsl(${hue}, 65%, 55%)`;
	});

	function handleImageLoad() {
		imageLoaded = true;
		imageError = false;
	}

	function handleImageError() {
		imageLoaded = false;
		imageError = true;
	}

	// Reset image state when src changes
	$effect(() => {
		if (src) {
			imageLoaded = false;
			imageError = false;
		}
	});

	// Compute accessible name
	const accessibleName = $derived(() => {
		if (alt) return alt;
		if (name) return name;
		return 'Avatar';
	});

	// Generate unique ID for status
	const statusId = `avatar-status-${Math.random().toString(36).substr(2, 9)}`;
</script>

{#snippet AvatarContent()}
	{#if loading}
		<div class="gr-avatar__loading" aria-hidden="true">
			<svg
				class="gr-avatar__spinner"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12a9 9 0 11-6.219-8.56" />
			</svg>
		</div>
	{:else if src && !imageError}
		<img
			bind:this={imageElement}
			class="gr-avatar__image"
			{src}
			alt={alt || name || 'Avatar'}
			onload={handleImageLoad}
			onerror={handleImageError}
			style="display: {imageLoaded ? 'block' : 'none'}"
		/>

		{#if !imageLoaded}
			{@const computedInitials = initials()}
			<div class="gr-avatar__placeholder" aria-hidden="true">
				{#if computedInitials}
					<span class="gr-avatar__initials" style="background-color: {initialsBackgroundColor()}">
						{computedInitials}
					</span>
				{:else if fallback}
					{@render fallback()}
				{:else}
					<img
						class="gr-avatar__fallback-image"
						src={defaultAvatar}
						alt="Default avatar"
						loading="lazy"
					/>
				{/if}
			</div>
		{/if}
	{:else}
		<!-- No image src or image failed to load -->
		{@const computedInitials = initials()}
		<div class="gr-avatar__placeholder" aria-hidden="true">
			{#if computedInitials}
				<span
					class="gr-avatar__initials"
					style="background-color: {initialsBackgroundColor()}; color: white;"
				>
					{computedInitials}
				</span>
			{:else if fallback}
				{@render fallback()}
			{:else}
				<img
					class="gr-avatar__fallback-image"
					src={defaultAvatar}
					alt="Default avatar"
					loading="lazy"
				/>
			{/if}
		</div>
	{/if}

	{#if status}
		<div class={statusClass()} id={statusId} role="status" aria-label={`Status: ${status}`}></div>
	{/if}
{/snippet}

{#if isInteractive}
	<button
		class={avatarClass()}
		aria-label={ariaLabel ?? accessibleName()}
		aria-labelledby={ariaLabelledby}
		aria-describedby={ariaDescribedby ?? (status ? statusId : undefined)}
		{id}
		{style}
		{onclick}
		{onmouseenter}
		{onmouseleave}
		{onfocus}
		{onblur}
		{onkeydown}
		{onkeyup}
		{role}
		tabindex={parsedTabIndex}
		type="button"
	>
		{@render AvatarContent()}
	</button>
{:else}
	<div
		class={avatarClass()}
		role={role ?? 'img'}
		aria-label={ariaLabel ?? accessibleName()}
		aria-labelledby={ariaLabelledby}
		aria-describedby={ariaDescribedby ?? (status ? statusId : undefined)}
		{id}
		{style}
		{onclick}
		{onmouseenter}
		{onmouseleave}
		{onfocus}
		{onblur}
		{onkeydown}
		{onkeyup}
	>
		{@render AvatarContent()}
	</div>
{/if}
