import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import CreativeToolsTest from './CreativeToolsTest.svelte';
import type { WIPThreadData } from '../../src/types/creative-tools.js';

describe('CreativeTools Behavior', () => {
	const mockThread: WIPThreadData = {
		id: 't1',
		artistId: 'a1',
		artistName: 'Artist',
		title: 'WIP Project',
		updates: [
			{
				id: 'u1',
				content: 'Update 1',
				createdAt: new Date().toISOString(),
				media: [{ type: 'image', url: 'img1.jpg' }],
				likeCount: 5,
				commentCount: 2,
			},
			{
				id: 'u2',
				content: 'Update 2',
				createdAt: new Date().toISOString(),
				media: [{ type: 'image', url: 'img2.jpg' }],
				likeCount: 10,
				commentCount: 4,
			},
		],
		currentProgress: 50,
		isComplete: false,
		createdAt: new Date().toISOString(),
	};

	describe('WorkInProgress.Compare', () => {
		it('switches between comparison modes', async () => {
			render(CreativeToolsTest, {
				props: {
					thread: mockThread,
					component: 'Compare',
				},
			});

			const sliderBtn = screen.getByText('Slider');
			await fireEvent.click(sliderBtn);
			expect(sliderBtn.className).toContain('active');
			expect(screen.getByRole('slider', { name: 'Comparison slider' })).toBeInTheDocument();

			const overlayBtn = screen.getByText('Overlay');
			await fireEvent.click(overlayBtn);
			expect(overlayBtn.className).toContain('active');
			// Overlay slider has no label in component, targeting by type
			expect(screen.getAllByRole('slider').length).toBeGreaterThan(0);
		});
	});

	describe('WorkInProgress.VersionCard', () => {
		it('handles like interaction', async () => {
			const onLikeUpdate = vi.fn();

			render(CreativeToolsTest, {
				props: {
					thread: mockThread,
					component: 'VersionCard',
					handlers: { onLikeUpdate },
				},
			});

			const likeBtn = screen.getByLabelText('Like this update');
			await fireEvent.click(likeBtn);

			expect(onLikeUpdate).toHaveBeenCalledWith(expect.anything(), 'u2'); // u2 is last update (current)
		});
	});
});
