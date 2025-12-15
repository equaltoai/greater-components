import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Gallery } from '../../../src/components/Gallery/index';
import { createMockArtworkList } from '../../mocks/mockArtwork';

describe('Gallery Offline Journey', () => {
	const mockItems = createMockArtworkList(10);

	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('handles infinite scroll and offline recovery', async () => {
		let isOnline = true;
		const onLoadMore = vi.fn().mockImplementation(async () => {
			if (!isOnline) throw new Error('Offline');
			return createMockArtworkList(5, 11);
		});

		render(Gallery.Grid, {
			props: {
				items: mockItems,
				onLoadMore,
			},
		});

		const container = screen.getByRole('region');

		// 1. Trigger Load More (Online)
		Object.defineProperty(container, 'scrollHeight', { value: 1000, configurable: true });
		Object.defineProperty(container, 'scrollTop', { value: 800, configurable: true });
		Object.defineProperty(container, 'clientHeight', { value: 500, configurable: true });
		await fireEvent.scroll(container);
		vi.advanceTimersByTime(200);

		expect(onLoadMore).toHaveBeenCalled();
		onLoadMore.mockClear();

		// 2. Simulate Offline
		isOnline = false;
		await fireEvent.scroll(container);
		vi.advanceTimersByTime(200);

		// Should attempt to load (component doesn't know offline status implicitly unless prop passed)
		expect(onLoadMore).toHaveBeenCalled();
		// It throws. Component might catch it.
		// GalleryGrid doesn't show error UI, so we check it doesn't crash.

		// 3. Simulate Online Recovery
		isOnline = true;
		onLoadMore.mockClear();

		// Scroll again or retry trigger
		await fireEvent.scroll(container);
		vi.advanceTimersByTime(200);
		expect(onLoadMore).toHaveBeenCalled();
	});
});
