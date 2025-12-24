import { describe, it, expect } from 'vitest';
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

	describe('WorkInProgress.Timeline', () => {
		it('renders milestones correctly', () => {
			render(CreativeToolsTest, {
				props: {
					thread: mockThread,
					component: 'Timeline',
				},
			});

			expect(screen.getByText('v1')).toBeInTheDocument();
			expect(screen.getByText('v2')).toBeInTheDocument();
		});

		it('handles milestone click', async () => {
			render(CreativeToolsTest, {
				props: {
					thread: mockThread,
					component: 'Timeline',
				},
			});

			// Initial state is last version (v2, index 1)
			const v1Button = screen.getByRole('button', { name: /Version 1/ });
			await fireEvent.click(v1Button);

			// We can't easily check context state update here without exposing it in wrapper
			// But we can check if the button class changed if we could inspect it, or rely on visual feedback
			// However, since we are using a real context in wrapper, the state should update.
			// The button for v1 should become active.
			expect(v1Button.className).toContain('active');
		});

		it('shows time between versions', () => {
			render(CreativeToolsTest, {
				props: {
					thread: mockThread,
					component: 'Timeline',
				},
			});

			// mockThread dates are same (new Date().toISOString()), so should be "Less than an hour"
			expect(screen.getByText('Less than an hour')).toBeInTheDocument();
		});
	});
});
