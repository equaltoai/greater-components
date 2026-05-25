<!--
@component
StackMatrix — semantic table view of stack / version drift across rows.

Renders a real `<table>` with `<caption>` (visually-hidden by default
but available to AT), `<thead>` / `<tbody>` / `<th scope="col" |
"row">`. Drift state on each cell is communicated by an icon glyph +
text label (never color-only) inside the cell.

Sortable columns:
- When a column has `sortable: true`, its header `<th>` renders a
  `<button>` that emits the `onsort(columnId)` callback. The component
  reflects the consumer-supplied `sortBy` + `sortDirection` via
  `aria-sort` on the matching `<th>`.
- The component is presentation-only — it does not sort data internally.
  Consumers manage the sort state and reorder `rows` in response to the
  `onsort` callback.

Per-row CTA slot:
- `rowActions` snippet receives the current `StackMatrixRow` and renders
  inside a `<td>` at the end of each row (wrapped in `<div role="group">`
  with an accessible name).

Strict-CSP safe: no inline event handlers (Svelte's compiled
`on*` handlers attach after hydration); no `style` attributes set at
runtime; styling via stable `--gr-*` tokens.

@example
```svelte
<StackMatrix
	caption="Lesser fleet stack versions"
	columns={[
		{ id: 'lesser', label: 'Lesser', sortable: true },
		{ id: 'host',   label: 'Lesser Host', sortable: true },
	]}
	rows={[
		{ id: 'r1', label: 'lesser.example', subLabel: 'us-east-1',
		  cells: {
		    lesser: { value: 'v1.4.12', drift: 'in-sync' },
		    host:   { value: 'v0.4.5',  drift: 'pending' },
		  } },
	]}
	sortBy="lesser"
	sortDirection="ascending"
	onsort={(id) => …}
>
	{#snippet rowActions(row)}<button type="button">Manage</button>{/snippet}
</StackMatrix>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type {
		StackMatrixCell,
		StackMatrixColumn,
		StackMatrixDrift,
		StackMatrixRow,
		StackMatrixSortDirection,
	} from '../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Required accessible caption for the table. May be visually hidden. @public */
		caption: string;

		/**
		 * When true, the caption is rendered as `<caption class="gr-sr-only">`
		 * (still announced to AT). Default `true` to keep the visual surface
		 * compact for dashboard layouts.
		 * @public
		 */
		captionHidden?: boolean;

		/** Column definitions in left-to-right render order. @public */
		columns: StackMatrixColumn[];

		/** Rows in display order. @public */
		rows: StackMatrixRow[];

		/** Id of the currently-sorted column. @public */
		sortBy?: string;

		/** Current sort direction. Defaults to `'none'` (no aria-sort active). @public */
		sortDirection?: StackMatrixSortDirection;

		/**
		 * Called when a sortable column header is activated. Consumers manage
		 * sort state externally and re-supply `rows` in the desired order.
		 * @public
		 */
		onsort?: (columnId: string) => void;

		/** Empty-state message when `rows.length === 0`. @public */
		emptyMessage?: string;

		/** Accessible name for the per-row actions cell group. @public */
		rowActionsLabel?: string;

		/** Additional CSS classes on the wrapper. @public */
		class?: string;

		/** Optional custom cell renderer. @public */
		cellRenderer?: Snippet<[StackMatrixCell, StackMatrixRow, StackMatrixColumn]>;

		/** Per-row actions slot. @public */
		rowActions?: Snippet<[StackMatrixRow]>;
	}

	let {
		caption,
		captionHidden = true,
		columns,
		rows,
		sortBy,
		sortDirection = 'none',
		onsort,
		emptyMessage = 'No rows to display.',
		rowActionsLabel = 'Row actions',
		class: className = '',
		cellRenderer,
		rowActions,
		style: _style,
		...restProps
	}: Props = $props();

	const stableId = useStableId('host-stack-matrix');

	const driftInfo = $derived.by(() => {
		const map: Record<StackMatrixDrift, { icon: string; label: string }> = {
			'in-sync': { icon: '●', label: 'In sync' },
			pending: { icon: '◌', label: 'Update pending' },
			drifted: { icon: '⚠', label: 'Drifted' },
			unknown: { icon: '?', label: 'Unknown drift state' },
		};
		return map;
	});

	function ariaSortFor(columnId: string): StackMatrixSortDirection | undefined {
		if (columnId !== sortBy) return undefined;
		return sortDirection;
	}

	function handleHeaderClick(column: StackMatrixColumn) {
		if (!column.sortable) return;
		onsort?.(column.id);
	}

	function handleHeaderKeydown(event: KeyboardEvent, column: StackMatrixColumn) {
		// Native <button> handles Enter/Space; this is here purely for the
		// rare case a consumer styles the button so that activating it
		// requires explicit key handling. The default browser behavior is
		// already correct.
		if (event.key === 'Enter' || event.key === ' ') {
			if (!column.sortable) return;
			event.preventDefault();
			onsort?.(column.id);
		}
	}

	const rootClass = $derived(() =>
		['gr-host-platform-stack-matrix', className].filter(Boolean).join(' ')
	);

	const hasRows = $derived(rows.length > 0);
	const hasRowActions = $derived(!!rowActions);
</script>

<div class={rootClass()} {...restProps}>
	<table class="gr-host-platform-stack-matrix__table">
		<caption
			class={['gr-host-platform-stack-matrix__caption', captionHidden && 'gr-sr-only']
				.filter(Boolean)
				.join(' ')}
		>
			{caption}
		</caption>
		<thead>
			<tr>
				<th scope="col" class="gr-host-platform-stack-matrix__row-header-col">
					<span class="gr-sr-only">Row</span>
				</th>
				{#each columns as column (column.id)}
					{@const ariaSort = ariaSortFor(column.id)}
					<th
						scope="col"
						class={[
							'gr-host-platform-stack-matrix__col-header',
							column.sortable && 'gr-host-platform-stack-matrix__col-header--sortable',
						]
							.filter(Boolean)
							.join(' ')}
						aria-sort={ariaSort}
					>
						{#if column.sortable}
							<button
								type="button"
								class="gr-host-platform-stack-matrix__sort-button"
								onclick={() => handleHeaderClick(column)}
								onkeydown={(event) => handleHeaderKeydown(event, column)}
							>
								<span>{column.label}</span>
								<span class="gr-host-platform-stack-matrix__sort-indicator" aria-hidden="true">
									{#if ariaSort === 'ascending'}
										▲
									{:else if ariaSort === 'descending'}
										▼
									{:else}
										↕
									{/if}
								</span>
							</button>
						{:else}
							{column.label}
						{/if}
					</th>
				{/each}
				{#if hasRowActions}
					<th scope="col" class="gr-host-platform-stack-matrix__actions-header">
						<span class="gr-sr-only">{rowActionsLabel}</span>
					</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#if !hasRows}
				<tr class="gr-host-platform-stack-matrix__empty-row">
					<td
						colspan={columns.length + 1 + (hasRowActions ? 1 : 0)}
						class="gr-host-platform-stack-matrix__empty"
					>
						{emptyMessage}
					</td>
				</tr>
			{:else}
				{#each rows as row (row.id)}
					<tr
						id={stableId.value ? `${stableId.value}-row-${row.id}` : undefined}
						class="gr-host-platform-stack-matrix__row"
					>
						<th scope="row" class="gr-host-platform-stack-matrix__row-header">
							<span class="gr-host-platform-stack-matrix__row-label">{row.label}</span>
							{#if row.subLabel}
								<span class="gr-host-platform-stack-matrix__row-sublabel">{row.subLabel}</span>
							{/if}
						</th>
						{#each columns as column (column.id)}
							{@const cell = row.cells[column.id]}
							<td class="gr-host-platform-stack-matrix__cell">
								{#if cell === undefined}
									<span class="gr-sr-only">No data</span>
									<span aria-hidden="true">—</span>
								{:else if cellRenderer}
									{@render cellRenderer(cell, row, column)}
								{:else}
									{@const drift = cell.drift ?? 'in-sync'}
									{@const info = driftInfo[drift]}
									<span
										class={[
											'gr-host-platform-stack-matrix__cell-value',
											`gr-host-platform-stack-matrix__cell-value--drift-${drift}`,
										].join(' ')}
									>
										<span class="gr-host-platform-stack-matrix__drift-icon" aria-hidden="true"
											>{info.icon}</span
										>
										<span class="gr-host-platform-stack-matrix__cell-text">
											{cell.value}
										</span>
										<span class="gr-sr-only">
											{cell.description ?? info.label}
										</span>
									</span>
								{/if}
							</td>
						{/each}
						{#if hasRowActions}
							<td class="gr-host-platform-stack-matrix__actions-cell">
								<div
									class="gr-host-platform-stack-matrix__actions"
									role="group"
									aria-label={`${rowActionsLabel}: ${row.label}`}
								>
									{@render rowActions?.(row)}
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
