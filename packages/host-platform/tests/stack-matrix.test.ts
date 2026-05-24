import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import StackMatrix from '../src/components/StackMatrix.svelte';
import type { StackMatrixColumn, StackMatrixRow } from '../src/types.js';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

const columns: StackMatrixColumn[] = [
	{ id: 'lesser', label: 'Lesser', sortable: true },
	{ id: 'host', label: 'Lesser Host', sortable: true },
	{ id: 'body', label: 'Body', sortable: false },
];

const rows: StackMatrixRow[] = [
	{
		id: 'r1',
		label: 'lesser.example',
		subLabel: 'us-east-1',
		cells: {
			lesser: { value: 'v1.4.12', drift: 'in-sync' },
			host: { value: 'v0.4.5', drift: 'pending' },
			body: { value: 'v0.2.1', drift: 'in-sync' },
		},
	},
	{
		id: 'r2',
		label: 'lesser.staging',
		subLabel: 'us-west-2',
		cells: {
			lesser: { value: 'v1.4.10', drift: 'drifted' },
			host: { value: 'v0.4.5', drift: 'in-sync' },
			body: { value: 'v0.2.0', drift: 'drifted' },
		},
	},
];

describe('StackMatrix', () => {
	it('renders a real <table> with <caption>, <thead>, and <tbody>', () => {
		const { container } = render(StackMatrix, {
			caption: 'Lesser fleet stack versions',
			columns,
			rows,
		});
		const table = container.querySelector('table.gr-host-platform-stack-matrix__table');
		expect(table).toBeTruthy();
		expect(table?.querySelector('caption')).toBeTruthy();
		expect(table?.querySelector('thead')).toBeTruthy();
		expect(table?.querySelector('tbody')).toBeTruthy();
	});

	it('keeps the caption available to AT even when visually hidden (default)', () => {
		const { container } = render(StackMatrix, {
			caption: 'Lesser fleet stack versions',
			columns,
			rows,
		});
		const caption = container.querySelector('caption');
		expect(caption?.classList.contains('gr-sr-only')).toBe(true);
		expect(caption?.textContent?.trim()).toBe('Lesser fleet stack versions');
	});

	it('renders a column header per column with scope="col"', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
		});
		// First col header is the row-header placeholder, then one per column.
		const colHeaders = container.querySelectorAll('thead th[scope="col"]');
		// 1 row-header-col + 3 columns
		expect(colHeaders.length).toBe(1 + columns.length);
	});

	it('renders a row header per row with scope="row"', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
		});
		const rowHeaders = container.querySelectorAll('tbody th[scope="row"]');
		expect(rowHeaders.length).toBe(rows.length);
		expect(rowHeaders[0]?.textContent).toContain('lesser.example');
		expect(rowHeaders[0]?.textContent).toContain('us-east-1');
	});

	it('emits onsort when a sortable header button is clicked', async () => {
		const onsort = vi.fn();
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
			onsort,
		});
		const sortBtn = container.querySelector(
			'.gr-host-platform-stack-matrix__col-header--sortable .gr-host-platform-stack-matrix__sort-button'
		);
		expect(sortBtn).toBeTruthy();
		await fireEvent.click(sortBtn!);
		expect(onsort).toHaveBeenCalledTimes(1);
		expect(onsort.mock.calls[0]?.[0]).toBe('lesser');
	});

	it('does NOT emit onsort for non-sortable columns (no button rendered)', async () => {
		const onsort = vi.fn();
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
			onsort,
		});
		// "Body" column is not sortable; ensure no sort-button exists for it.
		const headers = Array.from(container.querySelectorAll('thead th[scope="col"]'));
		const bodyHeader = headers.find((h) => h.textContent?.includes('Body'));
		expect(bodyHeader).toBeTruthy();
		expect(bodyHeader?.querySelector('.gr-host-platform-stack-matrix__sort-button')).toBeNull();
	});

	it('reflects sortBy / sortDirection via aria-sort on the matching header only', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
			sortBy: 'lesser',
			sortDirection: 'descending',
		});
		const sorted = container.querySelectorAll('th[aria-sort]');
		expect(sorted.length).toBe(1);
		expect(sorted[0]?.getAttribute('aria-sort')).toBe('descending');
		expect(sorted[0]?.textContent).toContain('Lesser');
	});

	it.each([
		['in-sync', 'In sync'],
		['pending', 'Update pending'],
		['drifted', 'Drifted'],
		['unknown', 'Unknown drift state'],
	])(
		'communicates drift state %s with text label (%s) — never color-only',
		(drift, expectedLabel) => {
			const { container } = render(StackMatrix, {
				caption: 'c',
				columns: [{ id: 'col', label: 'Col' }],
				rows: [
					{
						id: 'r',
						label: 'row',
						cells: { col: { value: 'v', drift: drift as never } },
					},
				],
			});
			const cellValue = container.querySelector(
				`.gr-host-platform-stack-matrix__cell-value--drift-${drift}`
			);
			expect(cellValue).toBeTruthy();
			// The sr-only descriptor carries the drift label.
			expect(cellValue?.textContent).toContain(expectedLabel);
		}
	);

	it('renders rowActions inside a role="group" with row-specific accessible name', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
			rowActions: snippetOf('<button type="button" data-test="action">Manage</button>'),
		});
		const groups = container.querySelectorAll('.gr-host-platform-stack-matrix__actions');
		expect(groups.length).toBe(rows.length);
		expect(groups[0]?.getAttribute('role')).toBe('group');
		expect(groups[0]?.getAttribute('aria-label')).toBe('Row actions: lesser.example');
		expect(groups[0]?.querySelector('[data-test="action"]')).toBeTruthy();
	});

	it('omits the actions column entirely when rowActions snippet is not provided', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
		});
		expect(container.querySelector('.gr-host-platform-stack-matrix__actions')).toBeNull();
		expect(container.querySelector('.gr-host-platform-stack-matrix__actions-header')).toBeNull();
	});

	it('renders an empty-state row spanning all columns when rows.length === 0', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows: [],
			emptyMessage: 'Nothing yet.',
		});
		const empty = container.querySelector('.gr-host-platform-stack-matrix__empty');
		expect(empty?.textContent?.trim()).toBe('Nothing yet.');
		// colspan covers row-header + columns + (0 actions cols here).
		expect(empty?.getAttribute('colspan')).toBe(String(columns.length + 1));
	});

	it('does not set inline style attribute on any rendered element', () => {
		const { container } = render(StackMatrix, {
			caption: 'c',
			columns,
			rows,
			sortBy: 'lesser',
			sortDirection: 'ascending',
		});
		expect(container.querySelectorAll('[style]').length).toBe(0);
	});

	it('produces unique row ids across multiple matrix instances', () => {
		const a = render(StackMatrix, { caption: 'a', columns, rows });
		const b = render(StackMatrix, { caption: 'b', columns, rows });
		const idA = a.container.querySelector('tbody tr')?.getAttribute('id');
		const idB = b.container.querySelector('tbody tr')?.getAttribute('id');
		expect(idA).toBeTruthy();
		expect(idB).toBeTruthy();
		expect(idA).not.toBe(idB);
	});
});
