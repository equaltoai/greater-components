import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/svelte';
import TestArtistProfileWrapper from './TestArtistProfileWrapper.svelte';
import { ArtistProfile } from '../../../src/components/ArtistProfile/index.js';
import type { ArtistData } from '../../../src/components/ArtistProfile/context.js';

describe('ArtistProfile.HeroBanner', () => {
	const mockArtist: ArtistData = {
		id: 'a1',
		displayName: 'Test Artist',
		username: 'testartist',
		profileUrl: '/u/testartist',
		heroBanner: 'https://example.com/banner.jpg',
		heroArtworks: [
			{
				id: 'art1',
				images: { full: 'https://example.com/art1.jpg' },
			},
			{
				id: 'art2',
				images: { full: 'https://example.com/art2.jpg' },
			},
		],
		badges: [],
		status: 'online',
		verified: false,
		commissionStatus: 'open',
		stats: {
			followers: 100,
			following: 10,
			works: 5,
			exhibitions: 1,
			collaborations: 0,
			totalViews: 500,
		},
		sections: [],
		joinedAt: new Date().toISOString(),
	};

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.useFakeTimers();

		// Mock matchMedia
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(), // deprecated
				removeListener: vi.fn(), // deprecated
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('renders static banner when not rotating', () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				config: { showHeroBanner: true },
				Component: ArtistProfile.HeroBanner,
				props: { rotating: false },
			},
		});

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', 'https://example.com/banner.jpg');
	});

	it('rotates artworks when enabled', async () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				config: { showHeroBanner: true },
				Component: ArtistProfile.HeroBanner,
				props: { rotating: true, rotationInterval: 1000 },
			},
		});

		const img = screen.getByRole('img');
		// Initial image is first artwork when rotating is true
		expect(img).toHaveAttribute('src', 'https://example.com/art1.jpg');

		// Fast-forward time
		await act(async () => {
			vi.advanceTimersByTime(1000);
		});

		// Wait for transition (300ms)
		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(img).toHaveAttribute('src', 'https://example.com/art2.jpg');
	});

	it('respects reduced motion preference for rotation', async () => {
		// Mock matchMedia to return true for reduced motion
		window.matchMedia = vi.fn().mockImplementation((query) => ({
			matches: query === '(prefers-reduced-motion: reduce)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				config: { showHeroBanner: true },
				Component: ArtistProfile.HeroBanner,
				props: { rotating: true, rotationInterval: 1000 },
			},
		});

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', 'https://example.com/art1.jpg');

		// Fast-forward time
		await act(async () => {
			vi.advanceTimersByTime(2000);
		});

		// Should NOT rotate
		expect(img).toHaveAttribute('src', 'https://example.com/art1.jpg');
	});

	it('does not emit inline parallax styles (strict CSP)', async () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				config: { showHeroBanner: true, enableParallax: true },
				Component: ArtistProfile.HeroBanner,
				props: { rotating: false },
			},
		});

		const banner = screen.getByRole('banner', { name: /banner/i });
		expect(banner).not.toHaveAttribute('style');

		// Scroll
		await act(async () => {
			window.scrollY = 100;
			window.dispatchEvent(new Event('scroll'));
		});

		expect(banner).not.toHaveAttribute('style');
	});

	it('does not emit parallax styles under reduced motion (strict CSP)', async () => {
		window.matchMedia = vi.fn().mockImplementation((query) => ({
			matches: query === '(prefers-reduced-motion: reduce)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				config: { showHeroBanner: true, enableParallax: true },
				Component: ArtistProfile.HeroBanner,
				props: { rotating: false },
			},
		});

		const banner = screen.getByRole('banner', { name: /banner/i });
		expect(banner).not.toHaveAttribute('style');

		// Scroll
		await act(async () => {
			window.scrollY = 100;
			window.dispatchEvent(new Event('scroll'));
		});

		expect(banner).not.toHaveAttribute('style');
	});

	it('falls back to first artwork when banner is missing', () => {
		const artistNoBanner = {
			...mockArtist,
			heroBanner: undefined,
			// heroArtworks is present in mockArtist
		};

		render(TestArtistProfileWrapper, {
			props: {
				artist: artistNoBanner,
				config: { showHeroBanner: true },
				Component: ArtistProfile.HeroBanner,
				props: { rotating: false },
			},
		});

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', 'https://example.com/art1.jpg');
	});
});
