import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { MediaViewer } from '../../../src/components/MediaViewer/index.js';
import type {
	MediaViewerContext,
	MediaViewerHandlers,
} from '../../../src/components/MediaViewer/context.js';
import * as ContextModule from '../../../src/components/MediaViewer/context.js';
import { createMockArtworkList } from '../../mocks/mockArtwork.js';

// Mock getMediaViewerContext
vi.mock('../../../src/components/MediaViewer/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/MediaViewer/context.js');
	return {
		...actual,
		getMediaViewerContext: vi.fn(),
	};
});

describe('MediaViewer.Navigation', () => {
	const mockArtworks = createMockArtworkList(3);
	const handlers: MediaViewerHandlers = {
		onNavigate: vi.fn(),
	};

	const defaultContext: MediaViewerContext = {
		artworks: mockArtworks as any[],
		currentIndex: 1, // Middle item
		config: {
			background: 'black',
			showMetadata: true,
			showSocial: false,
			enableZoom: true,
			enablePan: true,
			showThumbnails: true,
		},
		handlers,
		zoomLevel: 1,
		panOffset: { x: 0, y: 0 },
		isMetadataVisible: true,
		isOpen: true,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue(defaultContext);
	});

	it('renders navigation buttons', () => {
		render(MediaViewer.Navigation);

		expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
		expect(screen.getByLabelText('Next image')).toBeInTheDocument();
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
	});

	it('disables previous button at start', () => {
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue({
			...defaultContext,
			currentIndex: 0,
		});

		render(MediaViewer.Navigation);

		expect(screen.getByLabelText('Previous image')).toBeDisabled();
		expect(screen.getByLabelText('Next image')).not.toBeDisabled();
	});

	it('disables next button at end', () => {
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue({
			...defaultContext,
			currentIndex: 2,
		});

		render(MediaViewer.Navigation);

		expect(screen.getByLabelText('Previous image')).not.toBeDisabled();
		expect(screen.getByLabelText('Next image')).toBeDisabled();
	});

	it('navigates to previous image', async () => {
		// Need a mutable context ref or check handler
		const context = { ...defaultContext, currentIndex: 1 };
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue(context);

		render(MediaViewer.Navigation);

		await fireEvent.click(screen.getByLabelText('Previous image'));

		// The component updates context.currentIndex locally too
		expect(context.currentIndex).toBe(0);
		expect(handlers.onNavigate).toHaveBeenCalledWith(0);
	});

	it('navigates to next image', async () => {
		const context = { ...defaultContext, currentIndex: 1 };
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue(context);

		render(MediaViewer.Navigation);

		await fireEvent.click(screen.getByLabelText('Next image'));

		expect(context.currentIndex).toBe(2);
		expect(handlers.onNavigate).toHaveBeenCalledWith(2);
	});

	it('renders thumbnails and navigates', async () => {
		const context = { ...defaultContext, currentIndex: 1 };
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue(context);

		render(MediaViewer.Navigation);

		const thumbnails = screen.getAllByRole('option');
		expect(thumbnails).toHaveLength(3);

		// Click first thumbnail
		await fireEvent.click(thumbnails[0]);

		expect(context.currentIndex).toBe(0);
		expect(handlers.onNavigate).toHaveBeenCalledWith(0);
	});

	it('resets zoom and pan on navigation', async () => {
		const context = {
			...defaultContext,
			currentIndex: 1,
			zoomLevel: 2,
			panOffset: { x: 100, y: 100 },
		};
		vi.mocked(ContextModule.getMediaViewerContext).mockReturnValue(context);

		render(MediaViewer.Navigation);

		await fireEvent.click(screen.getByLabelText('Next image'));

		expect(context.zoomLevel).toBe(1);
		expect(context.panOffset).toEqual({ x: 0, y: 0 });
	});
});
