<!--
@component
Breadcrumb — breadcrumb navigation with `aria-current="page"` on the current item.

Renders a `<nav aria-label>` containing an `<ol>` of breadcrumb items. Items
with `href` render as `<a>`; items without `href` (and the explicitly-current
item) render as `<span>`. The current item additionally receives
`aria-current="page"`.

@example
```svelte
<Breadcrumb
	items={[
		{ label: 'Dashboard', href: '/' },
		{ label: 'Instances', href: '/instances' },
		{ label: 'lesser.example', current: true },
	]}
/>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { BreadcrumbItem } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
		/** Ordered breadcrumb items. @public */
		items: BreadcrumbItem[];

		/**
		 * Separator between items. May be a string (rendered as text with
		 * `aria-hidden`) or a snippet for icon-based separators.
		 * @defaultValue '/'
		 * @public
		 */
		separator?: string | Snippet;

		/**
		 * Accessible name for the navigation landmark.
		 * @defaultValue 'Breadcrumb'
		 * @public
		 */
		label?: string;

		/** Additional CSS classes. @public */
		class?: string;
	}

	let {
		items,
		separator = '/',
		label = 'Breadcrumb',
		class: className = '',
		style: _style,
		...restProps
	}: Props = $props();

	const rootClass = $derived(() => ['gr-shell-breadcrumb', className].filter(Boolean).join(' '));

	const separatorIsString = $derived(typeof separator === 'string');

	// Mark the last item as current if no explicit current is set.
	const resolvedItems = $derived.by(() => {
		const explicit = items.some((item) => item.current);
		return items.map((item, index) => ({
			...item,
			current: explicit ? !!item.current : index === items.length - 1,
		}));
	});
</script>

<nav class={rootClass()} aria-label={label} {...restProps}>
	<ol class="gr-shell-breadcrumb__list">
		{#each resolvedItems as item, index (index)}
			<li class="gr-shell-breadcrumb__item">
				{#if item.href && !item.current}
					<a href={item.href} class="gr-shell-breadcrumb__link">{item.label}</a>
				{:else}
					<span
						class="gr-shell-breadcrumb__current"
						aria-current={item.current ? 'page' : undefined}
					>
						{item.label}
					</span>
				{/if}
				{#if index < resolvedItems.length - 1}
					{#if separatorIsString}
						<span class="gr-shell-breadcrumb__separator" aria-hidden="true">{separator}</span>
					{:else if separator}
						<span class="gr-shell-breadcrumb__separator" aria-hidden="true"
							>{@render (separator as Snippet)()}</span
						>
					{/if}
				{/if}
			</li>
		{/each}
	</ol>
</nav>
