<!--
@component
CommandPalette — accessible, strict-CSP-safe command palette for app
navigation, quick actions, and settings search.

Implements the WAI-ARIA combobox + listbox pattern with virtual focus
(`aria-activedescendant`). The input keeps real focus; arrow keys move
a virtual selection through the rendered options. Screen-reader users
hear result counts and active-option labels via a polite live region.

Composition:
- `<div role="dialog" aria-modal="true" aria-label>` overlay
- `<input role="combobox" aria-autocomplete="list" aria-expanded
   aria-controls aria-activedescendant>` query input
- `<ul role="listbox">` per group (when groups are provided) or one
  flat `<ul role="listbox">` (when items are provided)
- Each `<li role="option" aria-selected={isActive} aria-disabled>` item

Headless behaviors reused from `@equaltoai/greater-components-headless`:
- `createFocusTrap` — traps focus inside the panel; returns focus to the
  opener on close (or to `returnFocusTo` when supplied)
- `createDismissable` — ESC + outside-click close, integrated into the
  shared layer stack so nested overlays close in the correct order
- `createLiveRegion` — polite announcements for result counts and
  loading / empty state changes

Strict-CSP safe: no inline event handlers, no `style` attributes set at
runtime, no module-level browser globals. All keyboard handling goes
through real Svelte event handlers; all styling consumes `--gr-*`
tokens via the bundled `shell.css`.

@example
```svelte
<CommandPalette
	open={paletteOpen}
	label="Command palette"
	inputLabel="Search commands"
	groups={[
		{ id: 'pages', label: 'Pages', items: [
			{ id: 'overview', label: 'Overview', description: 'Fleet overview' },
			{ id: 'instances', label: 'Instances' },
		] },
		{ id: 'actions', label: 'Actions', items: [
			{ id: 'refresh', label: 'Refresh', shortcut: '⌘R' },
		] },
	]}
	onclose={() => (paletteOpen = false)}
	onselect={(item) => {
		paletteOpen = false;
		navigate(item.id);
	}}
/>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { onDestroy, tick, untrack } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import {
		createFocusTrap,
		createDismissable,
		createLiveRegion,
		type FocusTrap,
		type Dismissable,
		type LiveRegion,
	} from '@equaltoai/greater-components-headless';
	import type { CommandPaletteFilter, CommandPaletteGroup, CommandPaletteItem } from '../types.js';
	import { filterAndRankItems, tokenizeQuery } from '../utils/fuzzy-filter.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'> {
		/**
		 * Whether the palette is open. Bind with `bind:open` or control via
		 * `onopen` / `onclose`.
		 * @public
		 */
		open?: boolean;

		/**
		 * Accessible name for the dialog. Strongly recommended; defaults to
		 * `'Command palette'`.
		 * @public
		 */
		label?: string;

		/**
		 * Accessible name for the search input. Defaults to `'Search commands'`.
		 * The label is rendered visually-hidden by default; consumers can opt
		 * into a visible label by setting `inputLabelHidden={false}` (the
		 * default is `true` for the typical palette UX).
		 * @public
		 */
		inputLabel?: string;

		/**
		 * When false, the input label is rendered visibly above the input.
		 * Default is `true` (label is sr-only).
		 * @public
		 */
		inputLabelHidden?: boolean;

		/** Placeholder text shown when the input is empty. @public */
		placeholder?: string;

		/**
		 * Externally-controlled query string. Bind with `bind:query` or
		 * read via `onquerychange`.
		 * @public
		 */
		query?: string;

		/**
		 * Grouped items. When supplied, the palette renders one `<ul role="listbox">`
		 * per group with the group label exposed via `aria-labelledby`. Exactly
		 * one of `groups` or `items` must be supplied.
		 * @public
		 */
		groups?: CommandPaletteGroup[];

		/**
		 * Flat item list. When supplied, the palette renders a single
		 * `<ul role="listbox">`. Exactly one of `groups` or `items` must be
		 * supplied.
		 * @public
		 */
		items?: CommandPaletteItem[];

		/**
		 * Optional custom filter / ranker. When omitted, the built-in
		 * `scoreCommandPaletteItem` is used. Return `null` to exclude an item;
		 * otherwise return a numeric score (higher = better).
		 * @public
		 */
		filter?: CommandPaletteFilter;

		/**
		 * When true, the palette shows a loading state instead of results.
		 * The live region announces the change.
		 * @public
		 */
		loading?: boolean;

		/** Status message rendered while `loading` is true. @public */
		loadingMessage?: string;

		/** Status message rendered when no items match the query. @public */
		emptyMessage?: string;

		/**
		 * Element to return focus to on close. Defaults to the previously
		 * focused element (typically the trigger button).
		 * @public
		 */
		returnFocusTo?: HTMLElement | null;

		/** Additional CSS classes. @public */
		class?: string;

		/**
		 * Custom item renderer. Receives the `item` and a boolean `active`
		 * (true when this item is the current virtual-focus target). When
		 * omitted, the default renderer shows label / description / shortcut.
		 * @public
		 */
		itemTemplate?: Snippet<[CommandPaletteItem, boolean]>;

		/** Empty-state slot override (when query yields no matches). @public */
		emptyState?: Snippet;

		/** Loading-state slot override. @public */
		loadingState?: Snippet;

		/** Called when the palette transitions from closed to open. @public */
		onopen?: () => void;

		/** Called when the palette closes (ESC, outside click, programmatic). @public */
		onclose?: () => void;

		/** Called whenever the query input changes. @public */
		onquerychange?: (value: string) => void;

		/** Called when a (non-disabled) item is activated. @public */
		onselect?: (item: CommandPaletteItem) => void;
	}

	let {
		open = $bindable(false),
		label = 'Command palette',
		inputLabel = 'Search commands',
		inputLabelHidden = true,
		placeholder = 'Type to search…',
		query = $bindable(''),
		groups,
		items,
		filter,
		loading = false,
		loadingMessage = 'Loading…',
		emptyMessage = 'No results.',
		returnFocusTo,
		class: className = '',
		itemTemplate,
		emptyState,
		loadingState,
		onopen,
		onclose,
		onquerychange,
		onselect,
		style: _style,
		...restProps
	}: Props = $props();

	// Stable per-instance ids. SSR/hydration-safe via useStableId.
	const stableId = useStableId('shell-cmdk');
	const labelId = $derived(stableId.value ? `${stableId.value}-label` : undefined);
	const inputId = $derived(stableId.value ? `${stableId.value}-input` : undefined);
	const inputLabelId = $derived(stableId.value ? `${stableId.value}-input-label` : undefined);
	const listboxOwningId = $derived(stableId.value ? `${stableId.value}-listbox` : undefined);
	const statusId = $derived(stableId.value ? `${stableId.value}-status` : undefined);

	// Element refs.
	let panelEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);

	// Headless behaviors.
	let focusTrap: FocusTrap | null = null;
	let dismissable: Dismissable | null = null;
	let liveRegion: LiveRegion | null = null;

	// Derived: filter groups / items by query.
	function applyFilter(list: CommandPaletteItem[], q: string): CommandPaletteItem[] {
		const tokens = tokenizeQuery(q);
		if (tokens.length === 0) return list.slice();
		if (filter) {
			const scored: Array<{ item: CommandPaletteItem; score: number; index: number }> = [];
			for (let i = 0; i < list.length; i++) {
				const it = list[i]!;
				const s = filter(it, q);
				if (typeof s === 'number') scored.push({ item: it, score: s, index: i });
			}
			scored.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.index - b.index));
			return scored.map((e) => e.item);
		}
		return filterAndRankItems(list, q);
	}

	type FlatEntry =
		| { kind: 'item'; item: CommandPaletteItem; groupId?: string; optionId: string }
		| { kind: 'group-header'; groupId: string };

	const filteredGroups = $derived.by<CommandPaletteGroup[] | null>(() => {
		if (!groups) return null;
		return groups
			.map((g) => ({ ...g, items: applyFilter(g.items, query) }))
			.filter((g) => g.items.length > 0);
	});

	const filteredItems = $derived.by<CommandPaletteItem[] | null>(() => {
		if (!items) return null;
		return applyFilter(items, query);
	});

	function optionDomId(baseId: string | undefined, groupId: string | undefined, itemId: string) {
		const safeBase = baseId ?? 'gr-shell-cmdk';
		return groupId ? `${safeBase}-opt-${groupId}-${itemId}` : `${safeBase}-opt-${itemId}`;
	}

	function groupHeaderDomId(baseId: string | undefined, groupId: string) {
		const safeBase = baseId ?? 'gr-shell-cmdk';
		return `${safeBase}-group-${groupId}`;
	}

	const flatEntries = $derived.by<FlatEntry[]>(() => {
		const out: FlatEntry[] = [];
		const base = stableId.value;
		if (filteredGroups) {
			for (const g of filteredGroups) {
				out.push({ kind: 'group-header', groupId: g.id });
				for (const it of g.items) {
					out.push({
						kind: 'item',
						item: it,
						groupId: g.id,
						optionId: optionDomId(base, g.id, it.id),
					});
				}
			}
		} else if (filteredItems) {
			for (const it of filteredItems) {
				out.push({ kind: 'item', item: it, optionId: optionDomId(base, undefined, it.id) });
			}
		}
		return out;
	});

	const itemEntries = $derived(
		flatEntries.filter((e): e is FlatEntry & { kind: 'item' } => e.kind === 'item')
	);
	const totalItems = $derived(itemEntries.length);

	// Virtual focus pointer. Clamped to [0, totalItems-1] reactively.
	let activeIndex = $state(0);

	// When totalItems or query changes, snap activeIndex to the first selectable item.
	$effect(() => {
		// Reset whenever the result set shrinks or the query changes meaningfully.
		void totalItems;
		void query;
		untrack(() => {
			if (totalItems === 0) {
				activeIndex = 0;
				return;
			}
			// Move to first non-disabled item.
			const first = findNextEnabledIndex(-1, 1);
			activeIndex = first === -1 ? 0 : first;
		});
	});

	const activeOptionId = $derived.by<string | undefined>(() => {
		if (totalItems === 0) return undefined;
		const safe = Math.min(Math.max(0, activeIndex), totalItems - 1);
		return itemEntries[safe]?.optionId;
	});

	function findNextEnabledIndex(fromIndex: number, step: 1 | -1): number {
		if (itemEntries.length === 0) return -1;
		const n = itemEntries.length;
		let i = fromIndex;
		for (let visited = 0; visited < n; visited++) {
			i = (i + step + n) % n;
			const entry = itemEntries[i];
			if (entry && !entry.item.disabled) return i;
		}
		// All items disabled — return the first.
		return 0;
	}

	function moveActive(step: 1 | -1) {
		const next = findNextEnabledIndex(activeIndex, step);
		if (next >= 0) activeIndex = next;
	}

	function moveToEdge(edge: 'start' | 'end') {
		if (totalItems === 0) return;
		if (edge === 'start') {
			const first = findNextEnabledIndex(-1, 1);
			if (first >= 0) activeIndex = first;
		} else {
			const last = findNextEnabledIndex(itemEntries.length, -1);
			if (last >= 0) activeIndex = last;
		}
	}

	function activateActive() {
		if (totalItems === 0) return;
		const safe = Math.min(Math.max(0, activeIndex), totalItems - 1);
		const entry = itemEntries[safe];
		if (entry && !entry.item.disabled) {
			onselect?.(entry.item);
		}
	}

	function close() {
		if (!open) return;
		open = false;
		onclose?.();
	}

	function handleQueryInput(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value;
		query = value;
		onquerychange?.(value);
	}

	function handleInputKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				moveActive(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				moveActive(-1);
				return;
			case 'Home':
				event.preventDefault();
				moveToEdge('start');
				return;
			case 'End':
				event.preventDefault();
				moveToEdge('end');
				return;
			case 'Enter':
				event.preventDefault();
				activateActive();
				return;
			case 'Escape':
				event.preventDefault();
				close();
				return;
			default:
				return;
		}
	}

	function handleOptionPointerEnter(index: number) {
		if (index < 0 || index >= itemEntries.length) return;
		activeIndex = index;
	}

	function handleOptionClick(entry: FlatEntry & { kind: 'item' }) {
		if (entry.item.disabled) return;
		onselect?.(entry.item);
	}

	function handleBackdropPointerDown(event: PointerEvent) {
		// Click on backdrop (outside the panel) closes the palette.
		const target = event.target as HTMLElement;
		if (panelEl && !panelEl.contains(target)) {
			close();
		}
	}

	// Open/close lifecycle: activate/deactivate behaviors.
	$effect(() => {
		const isOpen = open;

		if (!isOpen) {
			// Cleanup on close.
			if (focusTrap) {
				focusTrap.deactivate();
				focusTrap = null;
			}
			if (dismissable) {
				dismissable.deactivate();
				dismissable = null;
			}
			return;
		}

		// Defer until DOM nodes exist.
		void tick().then(() => {
			if (!panelEl) return;
			onopen?.();

			focusTrap = createFocusTrap({
				initialFocus: () => inputEl,
				returnFocusTo: returnFocusTo ?? undefined,
				returnFocus: true,
				autoFocus: true,
			});
			focusTrap.activate(panelEl);

			dismissable = createDismissable({
				closeOnEscape: true,
				closeOnClickOutside: false, // handled by backdrop pointerdown for precise targeting
				onDismiss: () => {
					close();
				},
			});
			dismissable.activate(panelEl);
		});
	});

	// Announce result-count / loading / empty changes via a polite live region.
	$effect(() => {
		// Listen to relevant state.
		const isLoading = loading;
		const count = totalItems;
		const tokens = tokenizeQuery(query);
		void open;

		untrack(() => {
			if (!liveRegion) {
				liveRegion = createLiveRegion({ politeness: 'polite' });
			}
			if (!open) return;
			if (isLoading) {
				liveRegion.announce(loadingMessage, { politeness: 'polite' });
				return;
			}
			if (tokens.length === 0) {
				// Quietly announce initial state once on open (without flooding).
				liveRegion.announce(`${count} result${count === 1 ? '' : 's'} available.`, {
					politeness: 'polite',
				});
				return;
			}
			if (count === 0) {
				liveRegion.announce(emptyMessage, { politeness: 'polite' });
			} else {
				liveRegion.announce(`${count} result${count === 1 ? '' : 's'} for ${query.trim()}.`, {
					politeness: 'polite',
				});
			}
		});
	});

	onDestroy(() => {
		focusTrap?.deactivate();
		dismissable?.deactivate();
		liveRegion?.destroy();
		focusTrap = null;
		dismissable = null;
		liveRegion = null;
	});

	// Visible status text (separate from the live region so it can be styled).
	const statusText = $derived.by<string>(() => {
		if (loading) return loadingMessage;
		if (totalItems === 0) return emptyMessage;
		const q = query.trim();
		if (q.length === 0) return `${totalItems} result${totalItems === 1 ? '' : 's'}`;
		return `${totalItems} result${totalItems === 1 ? '' : 's'} for "${q}"`;
	});

	const rootClass = $derived(() =>
		['gr-shell-command-palette', className].filter(Boolean).join(' ')
	);
</script>

{#if open}
	<!--
		Backdrop is a sibling, not a parent, so clicking it doesn't dispatch
		through the panel's event handlers. Backdrop pointerdown closes.
	-->
	<div
		class={rootClass()}
		role="dialog"
		aria-modal="true"
		aria-labelledby={labelId}
		onpointerdown={handleBackdropPointerDown}
		{...restProps}
	>
		<span id={labelId} class="gr-shell-command-palette__sr-only">{label}</span>

		<div class="gr-shell-command-palette__panel" bind:this={panelEl} role="presentation">
			<div class="gr-shell-command-palette__input-row">
				{#if !inputLabelHidden}
					<label id={inputLabelId} for={inputId} class="gr-shell-command-palette__input-label">
						{inputLabel}
					</label>
				{:else}
					<label
						id={inputLabelId}
						for={inputId}
						class="gr-shell-command-palette__input-label gr-shell-command-palette__sr-only"
					>
						{inputLabel}
					</label>
				{/if}
				<input
					id={inputId}
					bind:this={inputEl}
					type="text"
					autocomplete="off"
					spellcheck={false}
					{placeholder}
					value={query}
					role="combobox"
					aria-autocomplete="list"
					aria-expanded="true"
					aria-controls={listboxOwningId}
					aria-activedescendant={activeOptionId}
					aria-labelledby={inputLabelId}
					oninput={handleQueryInput}
					onkeydown={handleInputKeydown}
					class="gr-shell-command-palette__input"
				/>
			</div>

			<div class="gr-shell-command-palette__results" aria-busy={loading ? 'true' : undefined}>
				{#if loading}
					<div class="gr-shell-command-palette__loading">
						{#if loadingState}{@render loadingState()}{:else}{loadingMessage}{/if}
					</div>
				{:else if totalItems === 0}
					<div class="gr-shell-command-palette__empty">
						{#if emptyState}{@render emptyState()}{:else}{emptyMessage}{/if}
					</div>
				{:else if filteredGroups}
					{#each filteredGroups as group (group.id)}
						{@const headerId = groupHeaderDomId(stableId.value, group.id)}
						<div class="gr-shell-command-palette__group" role="group" aria-labelledby={headerId}>
							<div class="gr-shell-command-palette__group-header" id={headerId}>
								{group.label}
							</div>
							<ul
								id={`${listboxOwningId}-${group.id}`}
								class="gr-shell-command-palette__listbox"
								role="listbox"
								aria-labelledby={headerId}
							>
								{#each group.items as item (item.id)}
									{@const entryIndex = itemEntries.findIndex(
										(e) => e.groupId === group.id && e.item.id === item.id
									)}
									{@const isActive = entryIndex === activeIndex}
									{@const optId = optionDomId(stableId.value, group.id, item.id)}
									<!--
										W3C ARIA Combobox / Listbox pattern: option elements receive
										virtual focus via aria-activedescendant; real focus stays on the
										combobox input, which owns the keyboard handlers. Mouse clicks
										still need a click handler, but Svelte's a11y_click_events_have_key_events
										linter incorrectly flags it. Documented exception per ARIA APG.
									-->
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<li
										id={optId}
										class={[
											'gr-shell-command-palette__option',
											isActive && 'gr-shell-command-palette__option--active',
											item.disabled && 'gr-shell-command-palette__option--disabled',
										]
											.filter(Boolean)
											.join(' ')}
										role="option"
										aria-selected={isActive}
										aria-disabled={item.disabled ? 'true' : undefined}
										onclick={() =>
											handleOptionClick({
												kind: 'item',
												item,
												groupId: group.id,
												optionId: optId,
											})}
										onpointerenter={() => handleOptionPointerEnter(entryIndex)}
									>
										{#if itemTemplate}
											{@render itemTemplate(item, isActive)}
										{:else}
											<span class="gr-shell-command-palette__option-body">
												<span class="gr-shell-command-palette__option-label">{item.label}</span>
												{#if item.description}
													<span class="gr-shell-command-palette__option-description">
														{item.description}
													</span>
												{/if}
											</span>
											{#if item.shortcut}
												<kbd class="gr-shell-command-palette__option-shortcut" aria-hidden="true">
													{item.shortcut}
												</kbd>
											{/if}
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				{:else if filteredItems}
					<ul id={listboxOwningId} class="gr-shell-command-palette__listbox" role="listbox">
						{#each filteredItems as item (item.id)}
							{@const entryIndex = itemEntries.findIndex((e) => e.item.id === item.id)}
							{@const isActive = entryIndex === activeIndex}
							{@const optId = optionDomId(stableId.value, undefined, item.id)}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<li
								id={optId}
								class={[
									'gr-shell-command-palette__option',
									isActive && 'gr-shell-command-palette__option--active',
									item.disabled && 'gr-shell-command-palette__option--disabled',
								]
									.filter(Boolean)
									.join(' ')}
								role="option"
								aria-selected={isActive}
								aria-disabled={item.disabled ? 'true' : undefined}
								onclick={() => handleOptionClick({ kind: 'item', item, optionId: optId })}
								onpointerenter={() => handleOptionPointerEnter(entryIndex)}
							>
								{#if itemTemplate}
									{@render itemTemplate(item, isActive)}
								{:else}
									<span class="gr-shell-command-palette__option-body">
										<span class="gr-shell-command-palette__option-label">{item.label}</span>
										{#if item.description}
											<span class="gr-shell-command-palette__option-description">
												{item.description}
											</span>
										{/if}
									</span>
									{#if item.shortcut}
										<kbd class="gr-shell-command-palette__option-shortcut" aria-hidden="true">
											{item.shortcut}
										</kbd>
									{/if}
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<!--
				Visible status text. The live region (created via createLiveRegion)
				announces this content politely to assistive tech; this element is
				the visible affordance.
			-->
			<div class="gr-shell-command-palette__status" id={statusId} aria-live="off">
				{statusText}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Component CSS lives in CommandPalette.css and is bundled into shell.css.
	   This empty <style> exists so the file is a valid Svelte component module
	   even when consumers haven't imported the CSS bundle. */
</style>
