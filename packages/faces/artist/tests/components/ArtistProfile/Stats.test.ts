import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StatsTestWrapper from './StatsTestWrapper.svelte';
import { createMockArtist } from '../../mocks/index.js';

describe('ArtistProfile.Stats', () => {
	const mockHandlers = {
		onStatsClick: vi.fn(),
	};

	const mockArtist = {
		...createMockArtist('1'),
		stats: {
			followers: 1200,
			following: 300,
			works: 45,
			exhibitions: 5,
			collaborations: 2,
			totalViews: 5000,
		},
	};

	const mockContext = {
		artist: mockArtist,
		handlers: mockHandlers,
		isOwnProfile: false,
		isFollowing: false,
		professionalMode: false,
	} as any;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders default stats', () => {
		render(StatsTestWrapper, { props: { context: mockContext } });

		expect(screen.getByText('1.2K')).toBeTruthy();
		expect(screen.getByText('Followers')).toBeTruthy();

		expect(screen.getByText('45')).toBeTruthy();
		expect(screen.getByText('Works')).toBeTruthy();

		expect(screen.getByText('5')).toBeTruthy();
		expect(screen.getByText('Exhibitions')).toBeTruthy();

		expect(screen.getByText('2')).toBeTruthy();
		expect(screen.getByText('Collaborations')).toBeTruthy();
	});

	it('filters stats based on show prop', () => {
		render(StatsTestWrapper, {
			props: {
				context: mockContext,
				componentProps: { show: ['followers', 'totalViews'] },
			},
		});

		expect(screen.getByText('Followers')).toBeTruthy();
		expect(screen.getByText('Views')).toBeTruthy();

		expect(screen.queryByText('Works')).toBeNull();
		expect(screen.queryByText('Exhibitions')).toBeNull();
	});

	it('handles clicks when clickable is true', async () => {
		render(StatsTestWrapper, {
			props: { context: mockContext, componentProps: { clickable: true } },
		});

		const followerStat = screen.getByLabelText('1200 Followers');
		expect(followerStat.tagName).toBe('BUTTON');

		await fireEvent.click(followerStat);
		expect(mockHandlers.onStatsClick).toHaveBeenCalledWith('followers');
	});

	it('renders as non-clickable div when clickable is false', () => {
		render(StatsTestWrapper, {
			props: { context: mockContext, componentProps: { clickable: false } },
		});

		const followerStat = screen.getByLabelText('1200 Followers');
		expect(followerStat.tagName).toBe('DIV');

		// Clicks should not trigger handler (though harder to test on div without handler,
		// we mainly verify it's not a button and has no onclick implicitly)
	});

	it('applies direction class', () => {
		const { container } = render(StatsTestWrapper, {
			props: {
				context: mockContext,
				componentProps: { direction: 'column' },
			},
		});

		const list = container.querySelector('.profile-stats');
		expect(list?.classList.contains('profile-stats--column')).toBe(true);
	});

	it('applies custom class', () => {
		const { container } = render(StatsTestWrapper, {
			props: {
				context: mockContext,
				componentProps: { class: 'custom-class' },
			},
		});

		const list = container.querySelector('.profile-stats');
		expect(list?.classList.contains('custom-class')).toBe(true);
	});
});
