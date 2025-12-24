import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import TimelineTest from './TimelineTest.svelte';
import { mockStatus } from '../../../src/mockData';

describe('Timeline/Components', () => {
	const items = [
		{ ...mockStatus, id: '1' },
		{ ...mockStatus, id: '2' },
	];

	it('renders timeline items', () => {
		render(TimelineTest, { items });

		expect(screen.getByText('1')).toBeTruthy();
		expect(screen.getByText('2')).toBeTruthy();
	});

	it('handles item click', async () => {
		const onItemClick = vi.fn();

		render(TimelineTest, { items, handlers: { onItemClick } });

		const item1 = screen.getByText('1').closest('div[role="button"]');
		expect(item1).toBeTruthy();

		if (!item1) throw new Error('Item not found');
		await fireEvent.click(item1);

		expect(onItemClick).toHaveBeenCalledWith(items[0], 0);
	});

	it('handles tombstone', () => {
		const tombstoneItem = { ...items[0], type: 'tombstone' };

		// TimelineTest doesn't support custom tombstone snippet passing yet via props loop easily,
		// but Item handles it internally.
		// We need to pass items including tombstone.

		render(TimelineTest, { items: [tombstoneItem] });

		expect(screen.getByText('This post has been deleted.')).toBeTruthy();
	});
});
