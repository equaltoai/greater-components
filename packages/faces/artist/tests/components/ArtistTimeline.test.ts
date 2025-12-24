import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ArtistTimeline from '../../src/components/ArtistTimeline.svelte';

const mockArtist = {
	id: '1',
	displayName: 'Test Artist',
	username: 'testartist',
	avatar: 'avatar.jpg',
	bio: 'Test bio',
	location: 'Test location',
	joinedAt: new Date().toISOString(),
	stats: {
		followers: 100,
		following: 50,
		views: 1000,
		likes: 500,
	},
};

const mockItems = [
	{
		id: '1',
		type: 'artwork',
		content: 'Check out my new work',
		createdAt: new Date().toISOString(),
		artwork: {
			id: 'a1',
			title: 'My Art',
			images: { standard: 'art.jpg' },
		},
		engagement: { likes: 10, comments: 5, shares: 2 },
	},
	{
		id: '2',
		type: 'exhibition',
		content: 'Come to my show',
		createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
		artwork: {
			id: 'a2',
			title: 'Show Poster',
			images: { standard: 'poster.jpg' },
		},
		engagement: { likes: 1200, comments: 50, shares: 20 },
	},
	{
		id: '3',
		type: 'status',
		content: 'Just a status',
		createdAt: new Date(Date.now() - 1000).toISOString(), // Just now
		engagement: { likes: 1500000, comments: 5000, shares: 2000 },
	},
];

describe('ArtistTimeline', () => {
	it('renders timeline items', () => {
		render(ArtistTimeline, { props: { artist: mockArtist, items: mockItems } });
		expect(screen.getByText('Check out my new work')).toBeInTheDocument();
		expect(screen.getByText('Come to my show')).toBeInTheDocument();
	});

	it('displays exhibition badge', () => {
		render(ArtistTimeline, { props: { artist: mockArtist, items: mockItems } });
		expect(screen.getByText('Exhibition')).toBeInTheDocument();
	});

	it('formats large numbers correctly', () => {
		render(ArtistTimeline, { props: { artist: mockArtist, items: mockItems } });
		expect(screen.getByText('1.2K')).toBeInTheDocument(); // 1200 likes
		expect(screen.getByText('1.5M')).toBeInTheDocument(); // 1500000 likes
		expect(screen.getByText('10')).toBeInTheDocument(); // 10 likes
	});

	it('formats relative time', () => {
		render(ArtistTimeline, { props: { artist: mockArtist, items: mockItems } });
		const justNowElements = screen.getAllByText('Just now');
		expect(justNowElements.length).toBeGreaterThan(0);
		expect(screen.getByText('1d')).toBeInTheDocument();
	});

	it('handles load more', async () => {
		const onLoadMore = vi.fn();
		const observe = vi.fn();
		const disconnect = vi.fn();

		window.IntersectionObserver = class {
			constructor(cb: any) {
				// Trigger callback immediately (async) to simulate intersection
				setTimeout(() => {
					cb([{ isIntersecting: true }], this);
				}, 0);
			}
			observe = observe;
			disconnect = disconnect;
			unobserve = vi.fn();
			takeRecords = vi.fn();
			root = null;
			rootMargin = '';
			thresholds = [];
		} as any;

		render(ArtistTimeline, {
			props: {
				artist: mockArtist,
				items: mockItems,
				hasMore: true,
				onLoadMore,
			},
		});

		// Effect runs and observer is triggered
		// expect(window.IntersectionObserver).toHaveBeenCalled(); // Can't check call on class directly if not a spy, but we can check side effects or wrap class in spy if needed.
		// But we don't need to check constructor call strictly if behavior works.

		// Wait for async load
		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(observe).toHaveBeenCalled();
		expect(onLoadMore).toHaveBeenCalled();
	});
});
