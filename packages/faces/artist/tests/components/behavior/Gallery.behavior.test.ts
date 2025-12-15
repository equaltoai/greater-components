import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { Gallery } from '../../../src/components/Gallery/index.js';
import { createMockArtworkList } from '../../mocks/mockArtwork.js';

describe('Gallery Behavior', () => {
	const mockItems = createMockArtworkList(10);

	beforeEach(() => {
		vi.useFakeTimers();
		// ResizeObserver is mocked in setup.ts
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Infinite Scroll', () => {
		it('triggers load more on scroll', async () => {
			const onLoadMore = vi.fn();
			render(Gallery.Grid, {
				props: {
					items: mockItems,
					onLoadMore,
					virtualScrolling: false, // Simpler to test without virtual scrolling logic interference if possible, but Grid uses it.
				},
			});

			const container = screen.getByRole('region');

			// Simulate scroll to bottom
			// We need to mock scrollHeight/scrollTop/clientHeight
			Object.defineProperty(container, 'scrollHeight', { value: 1000, configurable: true });
			Object.defineProperty(container, 'scrollTop', { value: 0, configurable: true });
			Object.defineProperty(container, 'clientHeight', { value: 500, configurable: true });

			// Scroll close to bottom
			Object.defineProperty(container, 'scrollTop', { value: 400, configurable: true });

			await fireEvent.scroll(container);
			vi.advanceTimersByTime(200);

			expect(onLoadMore).toHaveBeenCalled();
		});
	});

	describe('Keyboard Navigation', () => {
		it('navigates with arrow keys', async () => {
			const onItemClick = vi.fn();
			render(Gallery.Grid, {
				props: {
					items: mockItems,
					columns: 2, // Force 2 columns
					onItemClick,
				},
			});

			// Target elements by data-index to handle Masonry DOM reordering
			const container = screen.getByRole('region');
			const getItem = (index: number) =>
				container.querySelector(`[data-index="${index}"]`) as HTMLElement;

			// Focus first item (Index 0)
			const item0 = getItem(0);
			const button0 = item0.querySelector('button');
			await fireEvent.focusIn(button0 || item0);
			vi.advanceTimersByTime(50);
			expect(item0).toHaveClass('focused');

			// Right arrow -> next item (Index 1)
			await fireEvent.keyDown(container, { key: 'ArrowRight' });
			vi.advanceTimersByTime(50);
			const item1 = getItem(1);
			expect(item1).toHaveClass('focused');

			// Down arrow -> item in next row (Index 3)
			await fireEvent.keyDown(container, { key: 'ArrowDown' });
			vi.advanceTimersByTime(50);
			const item3 = getItem(3);
			expect(item3).toHaveClass('focused');

			// Enter -> click
			await fireEvent.keyDown(container, { key: 'Enter' });
			vi.advanceTimersByTime(50);
			expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: mockItems[3]?.id }));
		});
	});
});
