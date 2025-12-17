import { describe, it, expect, vi } from 'vitest';
import {
	createExhibitionPattern,
	createGalleryExhibition,
	createNarrativeExhibition,
	createTimelineExhibition,
	formatExhibitionDates,
	getExhibitionStatusLabel,
} from '../../src/patterns/exhibition.js';

describe('Exhibition Pattern', () => {
	const mockArtworks = [
		{ id: '1', title: 'A1' },
		{ id: '2', title: 'A2' },
		{ id: '3', title: 'A3' },
	] as any;

	const mockExhibition = {
		id: 'e1',
		title: 'Exhibition',
		artworks: mockArtworks,
	} as any;

	describe('Factory & State', () => {
		it('initializes correctly', () => {
			const pattern = createExhibitionPattern({
				exhibition: mockExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});

			expect(pattern.state.navigation.totalArtworks).toBe(3);
			expect(pattern.state.navigation.currentIndex).toBe(0);
			expect(pattern.state.navigation.canNavigate).toBe(true);
			expect(pattern.state.navigation.isFirst).toBe(true);
			expect(pattern.state.navigation.isLast).toBe(false);
		});

		it('initializes with no navigation for single artwork', () => {
			const singleExhibition = { ...mockExhibition, artworks: [mockArtworks[0]] };
			const pattern = createExhibitionPattern({
				exhibition: singleExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});

			expect(pattern.state.navigation.canNavigate).toBe(false);
		});
	});

	describe('Navigation', () => {
		it('navigates next', () => {
			const onNavigate = vi.fn();
			const pattern = createExhibitionPattern(
				{
					exhibition: mockExhibition,
					layout: 'gallery',
					showCurator: true,
					showArtists: true,
					enableNavigation: true,
				},
				{ onNavigate }
			);

			pattern.state.navigateNext();
			expect(pattern.state.navigation.currentIndex).toBe(1);
			expect(pattern.state.navigation.isFirst).toBe(false);
			expect(onNavigate).toHaveBeenCalledWith(1);
		});

		it('navigates previous', () => {
			const pattern = createExhibitionPattern({
				exhibition: mockExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});

			pattern.state.navigateToIndex(2); // Go to last
			expect(pattern.state.navigation.currentIndex).toBe(2);

			pattern.state.navigatePrevious();
			expect(pattern.state.navigation.currentIndex).toBe(1);
		});

		it('respects bounds', () => {
			const pattern = createExhibitionPattern({
				exhibition: mockExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});

			pattern.state.navigatePrevious();
			expect(pattern.state.navigation.currentIndex).toBe(0); // Can't go below 0

			pattern.state.navigateToIndex(10);
			expect(pattern.state.navigation.currentIndex).toBe(2); // Clamped to max
		});
	});

	describe('Helpers & Factories', () => {
		it('createGalleryExhibition creates specific layout', () => {
			const pattern = createGalleryExhibition({
				exhibition: mockExhibition,
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});
			expect(pattern.config.layout).toBe('gallery');
		});

		it('createNarrativeExhibition creates specific layout', () => {
			const pattern = createNarrativeExhibition({
				exhibition: mockExhibition,
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});
			expect(pattern.config.layout).toBe('narrative');
		});

		it('createTimelineExhibition creates specific layout', () => {
			const pattern = createTimelineExhibition({
				exhibition: mockExhibition,
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});
			expect(pattern.config.layout).toBe('timeline');
		});

		it('formats dates correctly', () => {
			// Use noon to avoid timezone shift to previous day
			const d1 = new Date('2023-01-01T12:00:00');
			const d2 = new Date('2023-01-31T12:00:00');
			const result = formatExhibitionDates(d1, d2);

			expect(result).toContain('Jan 1');
			expect(result).toContain('Jan 31');
			expect(result).toContain('2023');

			const resultOpen = formatExhibitionDates(d1);
			expect(resultOpen).toContain('Opens Jan 1');
		});

		it('returns status labels', () => {
			expect(getExhibitionStatusLabel('current')).toBe('Now Showing');
		});
	});

	describe('Additional Coverage', () => {
		it('handles share success', async () => {
			const onShare = vi.fn().mockResolvedValue(undefined);
			const pattern = createExhibitionPattern(
				{
					exhibition: mockExhibition,
					layout: 'gallery',
					showCurator: true,
					showArtists: true,
					enableNavigation: true,
				},
				{ onShare }
			);

			await pattern.state.share('twitter');
			expect(onShare).toHaveBeenCalledWith('twitter');
			expect(pattern.state.shareState.state).toBe('success');
		});

		it('handles share error', async () => {
			const error = new Error('Share failed');
			const onShare = vi.fn().mockRejectedValue(error);
			const pattern = createExhibitionPattern(
				{
					exhibition: mockExhibition,
					layout: 'gallery',
					showCurator: true,
					showArtists: true,
					enableNavigation: true,
				},
				{ onShare }
			);

			await expect(pattern.state.share('twitter')).rejects.toThrow('Share failed');
			expect(pattern.state.shareState.state).toBe('error');
		});

		it('generates default embed code', () => {
			const pattern = createExhibitionPattern({
				exhibition: { ...mockExhibition, slug: 'my-exhibition' },
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});

			const code = pattern.state.getEmbedCode();
			expect(code).toContain('src="/exhibitions/my-exhibition/embed"');
		});

		it('uses custom embed handler', () => {
			const onEmbed = vi.fn().mockReturnValue('<custom-embed>');
			const pattern = createExhibitionPattern(
				{
					exhibition: mockExhibition,
					layout: 'gallery',
					showCurator: true,
					showArtists: true,
					enableNavigation: true,
				},
				{ onEmbed }
			);

			expect(pattern.state.getEmbedCode()).toBe('<custom-embed>');
		});

		it('selects artwork by object', () => {
			const onArtworkSelect = vi.fn();
			const pattern = createExhibitionPattern(
				{
					exhibition: mockExhibition,
					layout: 'gallery',
					showCurator: true,
					showArtists: true,
					enableNavigation: true,
				},
				{ onArtworkSelect }
			);

			pattern.handlers.onArtworkSelect?.(mockArtworks[1]);
			expect(pattern.state.navigation.currentIndex).toBe(1);
			expect(onArtworkSelect).toHaveBeenCalledWith(mockArtworks[1]);
		});

		it('selects artwork handles unknown artwork', () => {
			const onArtworkSelect = vi.fn();
			const pattern = createExhibitionPattern(
				{
					exhibition: mockExhibition,
					layout: 'gallery',
					showCurator: true,
					showArtists: true,
					enableNavigation: true,
				},
				{ onArtworkSelect }
			);

			const unknownArtwork = { id: 'unknown' };
			pattern.handlers.onArtworkSelect?.(unknownArtwork);
			expect(pattern.state.navigation.currentIndex).toBe(0); // Should not change
			expect(onArtworkSelect).toHaveBeenCalledWith(unknownArtwork);
		});

		it('getCurrentArtwork returns undefined if index out of bounds', () => {
			const pattern = createExhibitionPattern({
				exhibition: mockExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});
			// Force invalid index
			pattern.state.navigation.currentIndex = 99;
			expect(pattern.state.getCurrentArtwork()).toBeUndefined();
		});

		it('formats dates crossing years', () => {
			const d1 = new Date('2023-12-31T12:00:00');
			const d2 = new Date('2024-01-01T12:00:00');
			const result = formatExhibitionDates(d1, d2);
			expect(result).toContain('Dec 31, 2023');
			expect(result).toContain('Jan 1, 2024');
		});

		it('navigation guards', () => {
			const pattern = createExhibitionPattern({
				exhibition: mockExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});

			// Already at 0
			pattern.state.navigatePrevious();
			expect(pattern.state.navigation.currentIndex).toBe(0);

			// Go to end
			pattern.state.navigateToIndex(2);
			pattern.state.navigateNext();
			expect(pattern.state.navigation.currentIndex).toBe(2);

			// Disable navigation
			pattern.state.navigation.canNavigate = false;
			pattern.state.navigateToIndex(0);
			expect(pattern.state.navigation.currentIndex).toBe(2); // Should not change
		});

		it('getLayoutColumns returns responsive value', () => {
			const pattern = createExhibitionPattern({
				exhibition: mockExhibition,
				layout: 'gallery',
				showCurator: true,
				showArtists: true,
				enableNavigation: true,
			});
			// Since we can't easily mock window.matchMedia in this unit test context
			// without setup, we just check it returns a number.
			expect(typeof pattern.state.getLayoutColumns()).toBe('number');
		});
	});
});
