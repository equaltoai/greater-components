import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	createProgressiveLoader,
	generateSrcSet,
	lazyLoadImage,
	createVirtualList,
	maintainScrollPosition,
	preloadImage,
	generateSizes,
	recycleNodes,
} from '../../src/utils/performance';

describe('performance Utils', () => {
	let imageInstances: any[] = [];

	class MockImage {
		onload: () => void = () => {};
		onerror: () => void = () => {};
		src: string = '';
		constructor() {
			imageInstances.push(this);
		}
	}

	let observerInstances: any[] = [];

	beforeEach(() => {
		imageInstances = [];
		observerInstances = [];
		// @ts-ignore - Resetting performance object for testing
		global.Image = MockImage;

		// Mock IntersectionObserver
		// @ts-ignore - Mocking performance observer
		global.IntersectionObserver = class MockIntersectionObserver {
			_callback: any;
			constructor(callback: any) {
				this._callback = callback;
				observerInstances.push(this);
			}
			observe = vi.fn();
			unobserve = vi.fn();
			disconnect = vi.fn();
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('createProgressiveLoader', () => {
		it('starts loading and updates state on success', () => {
			const onLoad = vi.fn();
			const loader = createProgressiveLoader({
				placeholder: 'thumb.jpg',
				src: 'full.jpg',
				onLoad,
			});

			expect(loader.state.isLoading).toBe(false);
			expect(loader.state.currentSrc).toBe('thumb.jpg');

			loader.start();
			expect(loader.state.isLoading).toBe(true);

			// Simulate load
			const img = imageInstances[0];
			img.onload();

			expect(loader.state.isLoading).toBe(false);
			expect(loader.state.isLoaded).toBe(true);
			expect(loader.state.currentSrc).toBe('full.jpg');
			expect(loader.state.blurFilter).toBe('blur(0px)');
			expect(onLoad).toHaveBeenCalled();
		});

		it('handles error state', () => {
			const onError = vi.fn();
			const loader = createProgressiveLoader({
				placeholder: 'thumb.jpg',
				src: 'broken.jpg',
				onError,
			});

			loader.start();
			const img = imageInstances[0];
			img.onerror();

			expect(loader.state.isLoading).toBe(false);
			expect(loader.state.error).toBeTruthy();
			expect(onError).toHaveBeenCalled();
		});

		it('allows aborting', () => {
			const loader = createProgressiveLoader({
				placeholder: 'thumb.jpg',
				src: 'full.jpg',
			});

			loader.start();
			loader.abort();

			const img = imageInstances[0];
			img.onload(); // Should be ignored

			expect(loader.state.isLoaded).toBe(false);
		});
	});

	describe('generateSrcSet', () => {
		it('generates correct string', () => {
			const srcset = generateSrcSet([
				{ width: 300, url: 'small.jpg' },
				{ width: 1000, url: 'large.jpg' },
			]);
			expect(srcset).toBe('small.jpg 300w, large.jpg 1000w');
		});
	});

	describe('generateSizes', () => {
		it('generates sizes attribute', () => {
			const sizes = generateSizes([{ minWidth: 800, size: '800px' }, { size: '100vw' }]);
			expect(sizes).toBe('(min-width: 800px) 800px, 100vw');
		});
	});

	describe('lazyLoadImage', () => {
		it('observes element', () => {
			const img = document.createElement('img');
			img.dataset['src'] = 'real.jpg';

			const cleanup = lazyLoadImage(img);

			expect(observerInstances.length).toBe(1);
			const observerInstance = observerInstances[0];
			expect(observerInstance.observe).toHaveBeenCalledWith(img);

			cleanup();
		});

		it('loads image on intersection', () => {
			const img = document.createElement('img');
			img.dataset['src'] = 'real.jpg';

			lazyLoadImage(img);

			const observerInstance = observerInstances[0];
			const callback = observerInstance._callback;

			// Simulate intersection
			callback([{ isIntersecting: true, target: img }]);

			expect(img.src).toContain('real.jpg');
			expect(observerInstance.unobserve).toHaveBeenCalledWith(img);
		});
	});

	describe('preloadImage', () => {
		it('resolves on load', async () => {
			const promise = preloadImage('test.jpg');
			const img = imageInstances[0];
			img.onload();
			await expect(promise).resolves.toBeDefined();
		});

		it('rejects on error', async () => {
			const promise = preloadImage('test.jpg');
			const img = imageInstances[0];
			img.onerror();
			await expect(promise).rejects.toThrow();
		});
	});

	describe('createVirtualList', () => {
		it('calculates visible items correctly', () => {
			const items = Array.from({ length: 100 }, (_, i) => i);
			const list = createVirtualList({
				items,
				estimatedItemHeight: 50,
				containerHeight: 200, // Show ~4 items
				overscan: 1,
			});

			// Scroll top 0
			let state = list.calculateVisibleItems(0);
			// 0-4 visible, +/- 1 overscan -> 0-5
			expect(state.startIndex).toBe(0);
			// height 200 / 50 = 4 items. Overscan 1. End index around 5.
			// visible items: 0,1,2,3 (in viewport) + 4 (overscan) = 5 items total 0-4
			// actually logic:
			// start 0.
			// visible height loop: 0(50), 1(100), 2(150), 3(200). End index 4.
			// Overscan 1 -> end 5.
			expect(state.visibleItems.length).toBeGreaterThanOrEqual(4);
			// expect(state.visibleItems[0].index).toBe(0);

			// Scroll to 500 (item 10)
			state = list.calculateVisibleItems(500);
			// 500 / 50 = 10. Start index ~10.
			expect(state.startIndex).toBeGreaterThanOrEqual(8); // overscan
		});

		it('calculates total height', () => {
			const list = createVirtualList({
				items: [1, 2, 3],
				estimatedItemHeight: 100,
				containerHeight: 500,
			});
			const state = list.calculateVisibleItems(0);
			expect(state.totalHeight).toBe(300);
		});
	});

	describe('recycleNodes', () => {
		it('reuses existing nodes', () => {
			const container = document.createElement('div');
			const renderItem = (item: any, _i: number) => {
				const el = document.createElement('div');
				el.textContent = String(item);
				return el;
			};
			const keyFn = (item: any) => String(item);

			// First render
			recycleNodes(container, [{ item: 1, index: 0, offset: 0 }], renderItem, keyFn);
			expect(container.children.length).toBe(1);
			const firstChild = container.children[0] as HTMLElement;

			// Second render (same item, diff offset)
			recycleNodes(container, [{ item: 1, index: 0, offset: 50 }], renderItem, keyFn);
			expect(container.children.length).toBe(1);
			expect(container.children[0]).toBe(firstChild); // Same node
			expect(firstChild.style.top).toBe('50px');

			// Third render (new item)
			recycleNodes(container, [{ item: 2, index: 1, offset: 100 }], renderItem, keyFn);
			expect(container.children.length).toBe(1); // Old removed
			expect(container.children[0]?.textContent).toBe('2');
		});
	});

	describe('maintainScrollPosition', () => {
		it('saves and restores scroll', () => {
			const { save, restore } = maintainScrollPosition('test');

			// Mock scroll
			global.window.scrollX = 0;
			global.window.scrollY = 100;
			global.window.scrollTo = vi.fn();

			save();

			// Reset
			global.window.scrollY = 0;

			restore();

			expect(window.scrollTo).toHaveBeenCalledWith(0, 100);
		});
	});
});
