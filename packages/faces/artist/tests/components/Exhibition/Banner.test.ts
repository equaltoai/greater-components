import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import BannerTestWrapper from './fixtures/BannerTestWrapper.svelte';

// Mock context data
const createMockContextData = () => ({
	exhibition: {
		id: '1',
		title: 'Test Exhibition',
		subtitle: 'A Great Show',
		status: 'current',
		startDate: '2024-01-01',
		endDate: '2024-02-01',
		bannerImage: 'banner.jpg',
		coverImage: 'cover.jpg',
		curator: {
			id: 'c1',
			name: 'Jane Doe',
			avatar: 'avatar.jpg',
			isVerified: true,
		},
		location: {
			venue: 'Gallery One',
			city: 'New York',
		},
		artworks: [{ id: 'a1' }],
	},
	config: {
		showDates: true,
		showCurator: true,
		showLocation: true,
		showArtworkCount: true,
	},
	handlers: {
		onShare: vi.fn(),
		onCuratorClick: vi.fn(),
	},
});

describe('Exhibition Banner', () => {
	it('renders basic info correctly', () => {
		render(BannerTestWrapper, {
			props: { contextData: createMockContextData() },
		});

		expect(screen.getByText('Test Exhibition')).toBeTruthy();
		expect(screen.getByText('A Great Show')).toBeTruthy();
		expect(screen.getByText('Now Showing')).toBeTruthy();
		// Date formatting might depend on locale, checking partial match or known format
		// formatExhibitionDates uses toLocaleDateString('en-US')
		// Matches "Jan 1, 2024" OR "Dec 31, 2023" (timezone diff)
		expect(screen.getByText(/2024/)).toBeTruthy();
		expect(screen.getByText(/Dec \d+|Jan \d+/)).toBeTruthy();
		expect(screen.getByText('1 artwork')).toBeTruthy();
	});

	it('handles status badges', async () => {
		const statuses = [
			['upcoming', 'Opening Soon'],
			['current', 'Now Showing'],
			['past', 'Past Exhibition'],
			['virtual', 'Virtual Exhibition'],
			['permanent', 'Permanent Collection'],
		] as const;

		for (const [status, label] of statuses) {
			const data = createMockContextData();
			// @ts-ignore: Testing invalid status values for coverage
			data.exhibition.status = status;

			const { unmount } = render(BannerTestWrapper, {
				props: { contextData: data },
			});
			expect(screen.getByText(label)).toBeTruthy();
			unmount();
		}
	});

	it('conditionally renders elements based on config', () => {
		const data = createMockContextData();
		data.config.showDates = false;
		data.config.showCurator = false;

		const { unmount } = render(BannerTestWrapper, {
			props: { contextData: data },
		});

		expect(screen.queryByText(/Jan 1, 2024/)).toBeNull();
		expect(screen.queryByText(/Jane Doe/)).toBeNull();
		unmount();
	});

	it('handles interactions', async () => {
		const data = createMockContextData();
		render(BannerTestWrapper, {
			props: {
				contextData: data,
				props: { showShare: true },
			},
		});

		const shareBtn = screen.getByLabelText('Share exhibition');
		await fireEvent.click(shareBtn);
		expect(data.handlers.onShare).toHaveBeenCalled();

		const curatorBtn = screen.getByLabelText('View curator: Jane Doe');
		await fireEvent.click(curatorBtn);
		expect(data.handlers.onCuratorClick).toHaveBeenCalled();
	});

	it('renders location correctly', () => {
		render(BannerTestWrapper, {
			props: { contextData: createMockContextData() },
		});
		expect(screen.getByText((content) => content.includes('Gallery One'))).toBeTruthy();
		expect(screen.getByText((content) => content.includes(', New York'))).toBeTruthy();
	});
});
