import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Actions from '../../../src/components/Artwork/Actions.svelte';
import * as ContextModule from '../../../src/components/Artwork/context.js';

vi.mock('../../../src/components/Artwork/context.js', async () => {
	const actual = await vi.importActual('../../../src/components/Artwork/context.js');
	return {
		...actual,
		getArtworkContext: vi.fn(),
	};
});

describe('Artwork.Actions', () => {
	const mockHandlers = {
		onLike: vi.fn(),
		onCollect: vi.fn(),
		onShare: vi.fn(),
		onComment: vi.fn(),
	};

	const mockArtwork = { id: '1', title: 'Test' };

	const defaultContext = {
		artwork: mockArtwork,
		config: { showActions: true },
		handlers: mockHandlers,
		isLiked: false,
		isCollected: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue(defaultContext);
		// Reset context state
		defaultContext.isLiked = false;
		defaultContext.isCollected = false;
	});

	it('renders enabled actions', () => {
		render(Actions);
		expect(screen.getByLabelText('Like artwork')).toBeInTheDocument();
		expect(screen.getByLabelText('Add to collection')).toBeInTheDocument();
		expect(screen.getByLabelText('Share artwork')).toBeInTheDocument();
		expect(screen.getByLabelText('Comment on artwork')).toBeInTheDocument();
	});

	it('hides actions based on props', () => {
		render(Actions, {
			props: {
				showLike: false,
				showCollect: false,
				showShare: false,
				showComment: false,
			},
		});
		expect(screen.queryByLabelText(/Like/)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/collection/)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/Share/)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/Comment/)).not.toBeInTheDocument();
	});

	it('handles like action success', async () => {
		mockHandlers.onLike.mockResolvedValueOnce(undefined);
		render(Actions);

		const btn = screen.getByLabelText('Like artwork');
		await fireEvent.click(btn);

		expect(mockHandlers.onLike).toHaveBeenCalledWith(mockArtwork);
		expect(defaultContext.isLiked).toBe(true);
	});

	it('handles like action failure', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		mockHandlers.onLike.mockRejectedValueOnce(new Error('Fail'));
		render(Actions);

		const btn = screen.getByLabelText('Like artwork');
		await fireEvent.click(btn);

		expect(mockHandlers.onLike).toHaveBeenCalled();
		// State should not change
		expect(defaultContext.isLiked).toBe(false);
		expect(consoleSpy).toHaveBeenCalledWith('Failed to like artwork:', expect.any(Error));
		consoleSpy.mockRestore();
	});

	it('handles collect action success', async () => {
		mockHandlers.onCollect.mockResolvedValueOnce(undefined);
		render(Actions);

		const btn = screen.getByLabelText('Add to collection');
		await fireEvent.click(btn);

		expect(mockHandlers.onCollect).toHaveBeenCalledWith(mockArtwork);
		expect(defaultContext.isCollected).toBe(true);
	});

	it('handles share action', async () => {
		render(Actions);
		await fireEvent.click(screen.getByLabelText('Share artwork'));
		expect(mockHandlers.onShare).toHaveBeenCalledWith(mockArtwork);
	});

	it('handles comment action', async () => {
		render(Actions);
		await fireEvent.click(screen.getByLabelText('Comment on artwork'));
		expect(mockHandlers.onComment).toHaveBeenCalledWith(mockArtwork);
	});

	it('reflects active states', () => {
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue({
			...defaultContext,
			isLiked: true,
			isCollected: true,
		});

		render(Actions);
		expect(screen.getByLabelText('Unlike artwork')).toHaveClass('active');
		expect(screen.getByLabelText('Remove from collection')).toHaveClass('active');
	});

	it('disables buttons when handlers are missing', () => {
		vi.mocked(ContextModule.getArtworkContext).mockReturnValue({
			...defaultContext,
			handlers: {}, // No handlers
		});

		render(Actions);
		expect(screen.getByLabelText('Like artwork')).toBeDisabled();
		expect(screen.getByLabelText('Add to collection')).toBeDisabled();
		expect(screen.getByLabelText('Share artwork')).toBeDisabled();
		expect(screen.getByLabelText('Comment on artwork')).toBeDisabled();
	});
});
