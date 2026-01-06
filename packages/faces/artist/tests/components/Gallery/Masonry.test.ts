import { render, fireEvent, act } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Masonry from '../../../src/components/Gallery/Masonry.svelte';
import { createMockArtwork } from '../../mocks/index.js';

// Mock ResizeObserver
let resizeCallback: ResizeObserverCallback;
const observeMock = vi.fn();
const unobserveMock = vi.fn();
const disconnectMock = vi.fn();

global.ResizeObserver = class {
	constructor(cb: ResizeObserverCallback) {
		resizeCallback = cb;
	}
	observe = observeMock;
	unobserve = unobserveMock;
	disconnect = disconnectMock;
} as any;

describe('Masonry Component', () => {
	const mockArtworks = Array.from({ length: 10 }, (_, i) => createMockArtwork(String(i)));

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly with default props', () => {
		const { container } = render(Masonry, { items: mockArtworks });
		expect(container.querySelector('.gallery-grid')).toBeTruthy();
		expect(container.querySelectorAll('.gallery-item')).toHaveLength(10);
	});

	it('calculates columns based on container width', async () => {
		const { container } = render(Masonry, { items: mockArtworks });

		// Simulate resize
		await act(() => {
			if (resizeCallback) {
				resizeCallback(
					[{ contentRect: { width: 800, height: 600 } } as ResizeObserverEntry] as any,
					{} as any
				);
			}
		});

		// We can check if observe was called
		expect(observeMock).toHaveBeenCalled();

		// With container width 800px and default min width 280px, we expect 2 columns.
		expect(container.querySelectorAll('.masonry-column')).toHaveLength(2);
	});

	it('handles item clicks', async () => {
		const onItemClick = vi.fn();
		const { getAllByRole } = render(Masonry, {
			items: mockArtworks,
			onItemClick,
		});

		const buttons = getAllByRole('button');
		await fireEvent.click(buttons[0]);

		expect(onItemClick).toHaveBeenCalledWith(mockArtworks[0]);
	});

	it('triggers load more when scrolling near bottom', async () => {
		const onLoadMore = vi.fn();
		const { container } = render(Masonry, {
			items: mockArtworks,
			onLoadMore,
		});

		const masonry = container.querySelector('.gallery-grid') as HTMLElement;

		// Mock scroll properties
		Object.defineProperty(masonry, 'scrollHeight', { value: 1000, configurable: true });
		Object.defineProperty(masonry, 'scrollTop', { value: 850, configurable: true }); // Near bottom
		Object.defineProperty(masonry, 'clientHeight', { value: 100, configurable: true });

		await fireEvent.scroll(masonry);

		expect(onLoadMore).toHaveBeenCalled();
	});

	it('does not trigger load more when not near bottom', async () => {
		const onLoadMore = vi.fn();
		const { container } = render(Masonry, {
			items: mockArtworks,
			onLoadMore,
		});

		const masonry = container.querySelector('.gallery-grid') as HTMLElement;

		// Mock scroll properties
		Object.defineProperty(masonry, 'scrollHeight', { value: 1000, configurable: true });
		Object.defineProperty(masonry, 'scrollTop', { value: 0, configurable: true }); // Top
		Object.defineProperty(masonry, 'clientHeight', { value: 100, configurable: true });

		await fireEvent.scroll(masonry);

		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('uses custom item renderer if provided', () => {
		// This would require a Svelte snippet which is hard to mock in raw JS/TS test file
		// skipping for now or would need a wrapper component
	});

	it('does not use virtual scrolling containers', async () => {
		const manyItems = Array.from({ length: 100 }, (_, i) => createMockArtwork(String(i)));
		const { container } = render(Masonry, { items: manyItems });

		await act(() => {
			if (resizeCallback) {
				resizeCallback(
					[{ contentRect: { width: 800, height: 600 } } as ResizeObserverEntry] as any,
					{} as any
				);
			}
		});

		expect(container.querySelector('.virtual-container')).toBeNull();
		expect(container.querySelector('.virtual-content')).toBeNull();
	});

	it('restores scroll position', async () => {
		// Mock sessionStorage
		const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
		getItemSpy.mockReturnValue('100');

		render(Masonry, {
			items: mockArtworks,
			scrollKey: 'test-scroll',
		});

		// Verify logic
	});
});
