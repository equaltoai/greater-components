/**
 * Performance Utilities
 *
 * Image optimization, virtual scrolling, and bundle optimization utilities.
 * Implements REQ-PERF-001 through REQ-PERF-005.
 *
 * @module @equaltoai/greater-components-artist/utils/performance
 */

import { applyCspSafeStyles } from './cspSafeStyles';

// ============================================================================
// Image Optimization (REQ-PERF-001, REQ-PERF-003)
// ============================================================================

/**
 * Progressive loader configuration
 */
export interface ProgressiveLoaderConfig {
	/** Low-resolution placeholder URL */
	placeholder: string;
	/** Full resolution image URL */
	src: string;
	/** Blur amount for placeholder (px) */
	blurAmount?: number;
	/** Transition duration (ms) */
	transitionDuration?: number;
	/** Callback when full image loads */
	onLoad?: () => void;
	/** Callback on error */
	onError?: (error: Error) => void;
}

/**
 * Progressive loader state
 */
export interface ProgressiveLoaderState {
	/** Current image source */
	currentSrc: string;
	/** Whether full image is loaded */
	isLoaded: boolean;
	/** Whether loading is in progress */
	isLoading: boolean;
	/** Error if loading failed */
	error: Error | null;
	/** CSS filter for blur effect */
	blurFilter: string;
}

/**
 * Create progressive image loader with blur-up effect
 * Implements REQ-PERF-001 blur-up placeholder loading
 *
 * @example
 * ```typescript
 * const loader = createProgressiveLoader({
 *   placeholder: '/images/artwork-thumb.jpg',
 *   src: '/images/artwork-full.jpg',
 *   onLoad: () => console.log('Loaded!')
 * });
 * loader.start();
 * ```
 */
export function createProgressiveLoader(config: ProgressiveLoaderConfig): {
	state: ProgressiveLoaderState;
	start: () => void;
	abort: () => void;
} {
	const {
		placeholder,
		src,
		blurAmount = 20,
		transitionDuration: _ = 300,
		onLoad,
		onError,
	} = config;

	const state: ProgressiveLoaderState = {
		currentSrc: placeholder,
		isLoaded: false,
		isLoading: false,
		error: null,
		blurFilter: `blur(${blurAmount}px)`,
	};

	let aborted = false;

	const start = () => {
		if (state.isLoading || state.isLoaded) return;

		state.isLoading = true;
		aborted = false;

		const img = new Image();

		img.onload = () => {
			if (aborted) return;

			state.currentSrc = src;
			state.isLoaded = true;
			state.isLoading = false;
			state.blurFilter = 'blur(0px)';
			onLoad?.();
		};

		img.onerror = () => {
			if (aborted) return;

			const error = new Error(`Failed to load image: ${src}`);
			state.error = error;
			state.isLoading = false;
			onError?.(error);
		};

		img.src = src;
	};

	const abort = () => {
		aborted = true;
		state.isLoading = false;
	};

	return { state, start, abort };
}

/**
 * Srcset breakpoint configuration
 */
export interface SrcsetBreakpoint {
	/** Width in pixels */
	width: number;
	/** URL for this size */
	url: string;
}

/**
 * Generate responsive image srcset
 * Implements REQ-PERF-003 responsive image srcsets
 *
 * @example
 * ```typescript
 * const srcset = generateSrcSet([
 *   { width: 320, url: '/img/artwork-320.jpg' },
 *   { width: 640, url: '/img/artwork-640.jpg' },
 *   { width: 1280, url: '/img/artwork-1280.jpg' },
 * ]);
 * // Returns: "/img/artwork-320.jpg 320w, /img/artwork-640.jpg 640w, ..."
 * ```
 */
export function generateSrcSet(breakpoints: SrcsetBreakpoint[]): string {
	return breakpoints
		.sort((a, b) => a.width - b.width)
		.map(({ width, url }) => `${url} ${width}w`)
		.join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: Array<{ minWidth?: number; size: string }>): string {
	return breakpoints
		.map(({ minWidth, size }) => (minWidth ? `(min-width: ${minWidth}px) ${size}` : size))
		.join(', ');
}

/**
 * Lazy load image configuration
 */
export interface LazyLoadConfig {
	/** Root element for intersection observer */
	root?: Element | null;
	/** Root margin */
	rootMargin?: string;
	/** Intersection threshold */
	threshold?: number;
	/** Callback when image enters viewport */
	onEnterViewport?: () => void;
}

/**
 * Create lazy loading for images using Intersection Observer
 * Implements REQ-PERF-001 lazy loading
 *
 * @example
 * ```typescript
 * const cleanup = lazyLoadImage(imgElement, {
 *   rootMargin: '100px',
 *   onEnterViewport: () => console.log('Loading image')
 * });
 * ```
 */
export function lazyLoadImage(element: HTMLImageElement, config: LazyLoadConfig = {}): () => void {
	const { root = null, rootMargin = '50px', threshold = 0, onEnterViewport } = config;

	// Get the actual src from data attribute
	const actualSrc = element.dataset['src'];
	const actualSrcset = element.dataset['srcset'];

	if (!actualSrc && !actualSrcset) {
		console.warn('lazyLoadImage: No data-src or data-srcset found');
		return () => {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					onEnterViewport?.();

					if (actualSrc) {
						element.src = actualSrc;
					}
					if (actualSrcset) {
						element.srcset = actualSrcset;
					}

					element.removeAttribute('data-src');
					element.removeAttribute('data-srcset');
					observer.unobserve(element);
				}
			});
		},
		{ root, rootMargin, threshold }
	);

	observer.observe(element);

	return () => {
		observer.unobserve(element);
		observer.disconnect();
	};
}

/**
 * Preload critical images for above-the-fold content
 * Implements REQ-PERF-001 preload critical images
 */
export function preloadCriticalImages(urls: string[]): void {
	urls.forEach((url) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = url;
		document.head.appendChild(link);
	});
}

/**
 * Preload image and return promise
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
		img.src = url;
	});
}

// ============================================================================
// Virtual Scrolling (REQ-PERF-005)
// ============================================================================

/**
 * Virtual list configuration
 */
export interface VirtualListConfig<T> {
	/** All items in the list */
	items: T[];
	/** Estimated height of each item (px) */
	estimatedItemHeight: number;
	/** Container height (px) */
	containerHeight: number;
	/** Number of items to render outside viewport */
	overscan?: number;
}

/**
 * Virtual list state
 */
export interface VirtualListState<T> {
	/** Visible items to render */
	visibleItems: Array<{ item: T; index: number; offset: number }>;
	/** Total height of all items */
	totalHeight: number;
	/** Start index of visible range */
	startIndex: number;
	/** End index of visible range */
	endIndex: number;
}

/**
 * Create virtual list for efficient rendering of large lists
 * Implements REQ-PERF-005 virtual scrolling
 *
 * @example
 * ```typescript
 * const virtualList = createVirtualList({
 *   items: artworks,
 *   estimatedItemHeight: 300,
 *   containerHeight: 800,
 *   overscan: 3
 * });
 *
 * const state = virtualList.calculateVisibleItems(scrollTop);
 * ```
 */
export function createVirtualList<T>(config: VirtualListConfig<T>): {
	calculateVisibleItems: (scrollTop: number) => VirtualListState<T>;
	getItemOffset: (index: number) => number;
	scrollToIndex: (index: number) => number;
} {
	const { items, estimatedItemHeight, containerHeight, overscan = 3 } = config;

	// Item heights cache (for variable height items)
	const itemHeights = new Map<number, number>();

	const getItemHeight = (index: number): number => {
		return itemHeights.get(index) ?? estimatedItemHeight;
	};

	const getItemOffset = (index: number): number => {
		let offset = 0;
		for (let i = 0; i < index; i++) {
			offset += getItemHeight(i);
		}
		return offset;
	};

	const getTotalHeight = (): number => {
		let total = 0;
		for (let i = 0; i < items.length; i++) {
			total += getItemHeight(i);
		}
		return total;
	};

	const calculateVisibleItems = (scrollTop: number): VirtualListState<T> => {
		// Find start index
		let startIndex = 0;
		let offset = 0;
		while (startIndex < items.length && offset + getItemHeight(startIndex) < scrollTop) {
			offset += getItemHeight(startIndex);
			startIndex++;
		}

		// Apply overscan
		startIndex = Math.max(0, startIndex - overscan);

		// Find end index
		let endIndex = startIndex;
		let visibleHeight = 0;
		while (endIndex < items.length && visibleHeight < containerHeight + scrollTop - offset) {
			visibleHeight += getItemHeight(endIndex);
			endIndex++;
		}

		// Apply overscan
		endIndex = Math.min(items.length, endIndex + overscan);

		// Build visible items
		const visibleItems: Array<{ item: T; index: number; offset: number }> = [];
		let currentOffset = getItemOffset(startIndex);

		for (let i = startIndex; i < endIndex; i++) {
			const item = items[i];
			if (item) {
				visibleItems.push({
					item,
					index: i,
					offset: currentOffset,
				});
			}
			currentOffset += getItemHeight(i);
		}

		return {
			visibleItems,
			totalHeight: getTotalHeight(),
			startIndex,
			endIndex,
		};
	};

	const scrollToIndex = (index: number): number => {
		return getItemOffset(index);
	};

	return {
		calculateVisibleItems,
		getItemOffset,
		scrollToIndex,
	};
}

/**
 * Recycle DOM nodes for virtual scrolling
 * Reuses existing nodes instead of creating new ones
 */
export function recycleNodes<T>(
	container: HTMLElement,
	items: Array<{ item: T; index: number; offset: number }>,
	renderItem: (item: T, index: number) => HTMLElement,
	keyFn: (item: T) => string
): void {
	const existingNodes = new Map<string, HTMLElement>();

	// Collect existing nodes
	Array.from(container.children).forEach((child) => {
		const key = (child as HTMLElement).dataset['key'];
		if (key) {
			existingNodes.set(key, child as HTMLElement);
		}
	});

	const usedKeys = new Set<string>();

	// Update or create nodes
	items.forEach(({ item, index, offset }) => {
		const key = keyFn(item);
		usedKeys.add(key);

		let node = existingNodes.get(key);

		if (!node) {
			node = renderItem(item, index);
			node.dataset['key'] = key;
			container.appendChild(node);
		}

		node.classList.add('gr-virtual-item');
		applyCspSafeStyles(node, {
			transform: `translate3d(0, ${offset}px, 0)`,
		});
	});

	// Remove unused nodes
	existingNodes.forEach((node, key) => {
		if (!usedKeys.has(key)) {
			node.remove();
		}
	});
}

/**
 * Maintain scroll position during navigation
 */
export function maintainScrollPosition(key: string): { save: () => void; restore: () => void } {
	const storageKey = `scroll-position-${key}`;

	return {
		save() {
			const position = {
				x: window.scrollX,
				y: window.scrollY,
				timestamp: Date.now(),
			};
			sessionStorage.setItem(storageKey, JSON.stringify(position));
		},
		restore() {
			const stored = sessionStorage.getItem(storageKey);
			if (stored) {
				const position = JSON.parse(stored);
				// Only restore if saved within last 5 minutes
				if (Date.now() - position.timestamp < 5 * 60 * 1000) {
					window.scrollTo(position.x, position.y);
				}
				sessionStorage.removeItem(storageKey);
			}
		},
	};
}

// ============================================================================
// Bundle Optimization (REQ-PERF-004)
// ============================================================================

/**
 * Dynamic import with loading state
 */
export async function dynamicImport<T>(
	importFn: () => Promise<{ default: T }>,
	onLoading?: () => void,
	onLoaded?: () => void
): Promise<T> {
	onLoading?.();
	try {
		const module = await importFn();
		onLoaded?.();
		return module.default;
	} catch (error) {
		onLoaded?.();
		throw error;
	}
}

/**
 * Create code splitting boundary
 * Wraps dynamic imports with error handling
 */
export function createCodeSplitBoundary<T>(importFn: () => Promise<{ default: T }>): {
	load: () => Promise<T>;
	preload: () => void;
} {
	let cached: T | null = null;
	let loading: Promise<T> | null = null;

	return {
		async load() {
			if (cached) return cached;

			if (!loading) {
				loading = importFn().then((module) => {
					cached = module.default;
					return cached;
				});
			}

			return loading;
		},
		preload() {
			if (!cached && !loading) {
				loading = importFn().then((module) => {
					cached = module.default;
					return cached;
				});
			}
		},
	};
}
