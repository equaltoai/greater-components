import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import { Artwork } from '../../../src/components/Artwork/index.js';
import type { ArtworkContext, ArtworkData } from '../../../src/components/Artwork/context.js';
import * as ContextModule from '../../../src/components/Artwork/context.js';

// Mock getArtworkContext
vi.mock('../../../src/components/Artwork/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/Artwork/context.js');
	return {
		...actual,
		getArtworkContext: vi.fn(),
		updateImageLoadState: vi.fn(),
		updateCurrentResolution: vi.fn(),
	};
});

// Mock Image
const originalImage = global.Image;
let mockImageInstances: any[] = [];

describe('Artwork.Image', () => {
	const mockArtwork: ArtworkData = {
		id: '1',
		title: 'Test Artwork',
		artistId: 'a1',
		description: 'Test Description',
		altText: 'Alt Text',
		images: {
			thumbnail: 'thumb.jpg',
			preview: 'preview.jpg',
			standard: 'standard.jpg',
			highRes: 'highres.jpg',
		},
		dimensions: { width: 800, height: 600 },
		tags: [],
		createdAt: new Date().toISOString(),
		stats: { views: 0, likes: 0, shares: 0 },
		license: 'copyright',
		availability: 'available',
	};

	const handlers = {
		onImageError: vi.fn(),
	};

	const defaultContext: ArtworkContext = {
		artwork: mockArtwork,
		config: {
			layout: 'grid',
			showMetadata: true,
			enableZoom: false,
			lazyLoad: true,
			progressiveLoading: true,
			allowInteraction: true,
			showStats: true,
		},
		handlers,
		state: {
			isHovered: false,
			isFocused: false,
			imageLoadState: 'loading',
			currentResolution: 'thumbnail',
		},
		id: 'artwork-1-ctx',
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockImageInstances = [];

		global.Image = class {
			onload: (() => void) | null = null;
			onerror: (() => void) | null = null;
			private _src = '';

			set src(val: string) {
				this._src = val;
				// Add to tracker
				mockImageInstances.push(this);
			}

			get src() {
				return this._src;
			}

			// Helper to manually trigger load/error in tests
			triggerLoad() {
				this.onload?.();
			}
			triggerError() {
				this.onerror?.();
			}
		} as any;

		vi.mocked(ContextModule.getArtworkContext).mockReturnValue(defaultContext);
	});

	afterEach(() => {
		global.Image = originalImage;
	});

	it('renders with thumbnail initially', () => {
		render(Artwork.Image);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', 'thumb.jpg');
		expect(img).toHaveClass('gr-artist-artwork-image--loading');
	});

	it('handles progressive loading flow', async () => {
		render(Artwork.Image);

		// Should have started loading preview
		expect(mockImageInstances.length).toBeGreaterThan(0);
		const previewImg = mockImageInstances.find((i) => i.src === 'preview.jpg');
		expect(previewImg).toBeDefined();

		// Trigger preview load
		previewImg.triggerLoad();
		expect(ContextModule.updateCurrentResolution).toHaveBeenCalledWith(
			expect.anything(),
			'preview'
		);

		// Should update src to preview
		await waitFor(() => {
			const img = screen.getByRole('img');
			expect(img).toHaveAttribute('src', 'preview.jpg');
		});

		// Should have started loading standard
		const standardImg = mockImageInstances.find((i) => i.src === 'standard.jpg');
		expect(standardImg).toBeDefined();

		// Trigger standard load
		standardImg.triggerLoad();

		await waitFor(() => {
			const img = screen.getByRole('img');
			expect(img).toHaveAttribute('src', 'standard.jpg');
			expect(img).toHaveClass('gr-artist-artwork-image--loaded');
		});

		expect(ContextModule.updateCurrentResolution).toHaveBeenCalledWith(
			expect.anything(),
			'standard'
		);
		expect(ContextModule.updateImageLoadState).toHaveBeenCalledWith(expect.anything(), 'loaded');
	});

	it('handles image error', async () => {
		render(Artwork.Image);

		const previewImg = mockImageInstances.find((i) => i.src === 'preview.jpg');
		expect(previewImg).toBeDefined();

		previewImg.triggerError();

		await waitFor(() => {
			expect(ContextModule.updateImageLoadState).toHaveBeenCalledWith(expect.anything(), 'error');
			expect(handlers.onImageError).toHaveBeenCalled();
			// Should render fallback
			expect(screen.getByRole('img', { hidden: true })).toHaveClass(
				'gr-artist-artwork-image-fallback'
			);
		});
	});

	it('skips progressive loading if configured', () => {
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue({
			...defaultContext,
			config: {
				...defaultContext.config,
				progressiveLoading: false,
			},
		});

		render(Artwork.Image);

		const img = screen.getByRole('img');
		// It might set src to standard directly, but it's reactive
		expect(img).toHaveAttribute('src', 'standard.jpg');

		// Should NOT create new Image loaders
		expect(mockImageInstances.length).toBe(0);
	});

	it('respects aspect ratio preserve', () => {
		render(Artwork.Image, { props: { aspectRatio: 'preserve' } });
		// The style is applied to the container
		// We can't easily check style on container without selecting it by class
		// But we can check if it exists
		const figure = screen.getByRole('figure'); // figure wrap has the style
		// style: aspect-ratio: 800 / 600
		expect(figure).toHaveStyle({ aspectRatio: '800 / 600' });
	});

	it('respects aspect ratio 1:1', () => {
		render(Artwork.Image, { props: { aspectRatio: '1:1' } });
		const figure = screen.getByRole('figure');
		expect(figure).toHaveStyle({ aspectRatio: '1 / 1' });
	});
});
