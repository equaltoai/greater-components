<!--
@component
Callout — informational call-out (status / alert / note).

Renders a tinted block with an optional icon, title, and dismiss button.
ARIA role defaults to `status` for `info` / `success` / `neutral` tones and
`alert` for `warning` / `danger` tones; consumers may override via `role`.

When `role === 'status'` the live region is polite; when `role === 'alert'`
it is assertive. `role === 'note'` is non-live (use for static guidance).

@example
```svelte
<Callout tone="warning" title="Provisioning incomplete">
	One instance has not finished provisioning yet.
	{#snippet actions()}<button>Retry</button>{/snippet}
</Callout>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { CalloutRole, CalloutTone } from '../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Visual / semantic tone. Drives both styling and the default ARIA role.
		 * @defaultValue 'info'
		 * @public
		 */
		tone?: CalloutTone;

		/**
		 * Explicit ARIA role override. When omitted, role is derived from `tone`.
		 * @public
		 */
		role?: CalloutRole;

		/** Optional title rendered as a paragraph (visually prominent). @public */
		title?: string;

		/** Optional leading icon snippet (rendered with `aria-hidden`). @public */
		icon?: Snippet;

		/** Optional trailing actions group. @public */
		actions?: Snippet;

		/**
		 * Whether to render a dismiss button. The button has an accessible
		 * label of `dismissLabel` and emits `ondismiss` when activated.
		 * @defaultValue false
		 * @public
		 */
		dismissible?: boolean;

		/**
		 * Accessible label for the dismiss button.
		 * @defaultValue 'Dismiss'
		 * @public
		 */
		dismissLabel?: string;

		/** Called when the dismiss button is activated. @public */
		ondismiss?: () => void;

		/** Additional CSS classes. @public */
		class?: string;

		/** Body content. @public */
		children: Snippet;
	}

	let {
		tone = 'info',
		role,
		title,
		icon,
		actions,
		dismissible = false,
		dismissLabel = 'Dismiss',
		ondismiss,
		class: className = '',
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const resolvedRole = $derived<CalloutRole>(
		role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status')
	);

	const ariaLive = $derived(
		resolvedRole === 'alert' ? 'assertive' : resolvedRole === 'status' ? 'polite' : undefined
	);

	const rootClass = $derived(() =>
		['gr-shell-callout', `gr-shell-callout--tone-${tone}`, className].filter(Boolean).join(' ')
	);

	function handleDismiss() {
		ondismiss?.();
	}
</script>

<div
	class={rootClass()}
	role={resolvedRole}
	aria-live={ariaLive}
	aria-atomic={ariaLive ? 'true' : undefined}
	{...restProps}
>
	{#if icon}
		<div class="gr-shell-callout__icon" aria-hidden="true">{@render icon()}</div>
	{/if}
	<div class="gr-shell-callout__body">
		{#if title}
			<p class="gr-shell-callout__title">{title}</p>
		{/if}
		<div class="gr-shell-callout__content">{@render children()}</div>
		{#if actions}
			<div class="gr-shell-callout__actions" role="group">{@render actions()}</div>
		{/if}
	</div>
	{#if dismissible}
		<button
			type="button"
			class="gr-shell-callout__dismiss"
			aria-label={dismissLabel}
			onclick={handleDismiss}
		>
			<span aria-hidden="true">×</span>
		</button>
	{/if}
</div>
