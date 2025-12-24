import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TestArtistProfileWrapper from './TestArtistProfileWrapper.svelte';
import { ArtistProfile } from '../../../src/components/ArtistProfile/index.js';
import type { ArtistData } from '../../../src/components/ArtistProfile/context.js';

describe('ArtistProfile.Avatar', () => {
	const mockArtist: ArtistData = {
		id: 'a1',
		displayName: 'Test Artist',
		username: 'testartist',
		profileUrl: '/u/testartist',
		avatar: 'https://example.com/avatar.jpg',
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
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders avatar image when present', () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				Component: ArtistProfile.Avatar,
				props: { size: 'lg' },
			},
		});

		const img = screen.getByRole('presentation', { hidden: true });
		expect(img).toHaveAttribute('src', mockArtist.avatar);
		expect(img).toHaveClass('avatar__image');
	});

	it('renders initials fallback when avatar is missing', () => {
		const artistNoAvatar = { ...mockArtist, avatar: undefined };

		render(TestArtistProfileWrapper, {
			props: {
				artist: artistNoAvatar,
				Component: ArtistProfile.Avatar,
				props: {},
			},
		});

		expect(screen.queryByRole('img')).not.toBeInTheDocument();
		expect(screen.getByText('TA')).toBeInTheDocument(); // Test Artist -> TA
	});

	it('renders initials fallback on image error', async () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				Component: ArtistProfile.Avatar,
				props: {},
			},
		});

		const img = screen.getByRole('presentation', { hidden: true });
		await fireEvent.error(img);

		expect(screen.queryByRole('img')).not.toBeInTheDocument();
		expect(screen.getByText('TA')).toBeInTheDocument();
	});

	it('renders status indicator correctly', () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist, // status: 'online'
				Component: ArtistProfile.Avatar,
				props: { showStatus: true },
			},
		});

		const status = screen.getByTitle('Online');
		expect(status).toBeInTheDocument();
		expect(status).toHaveClass('avatar__status');
	});

	it('hides status indicator when showStatus is false', () => {
		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				Component: ArtistProfile.Avatar,
				props: { showStatus: false },
			},
		});

		expect(screen.queryByTitle('Online')).not.toBeInTheDocument();
	});

	it('handles click events', async () => {
		const onAvatarClick = vi.fn();

		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				handlers: { onAvatarClick },
				Component: ArtistProfile.Avatar,
				props: {},
			},
		});

		const button = screen.getByRole('button');
		await fireEvent.click(button);

		expect(onAvatarClick).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard Enter key', async () => {
		const onAvatarClick = vi.fn();

		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				handlers: { onAvatarClick },
				Component: ArtistProfile.Avatar,
				props: {},
			},
		});

		const button = screen.getByRole('button');
		await fireEvent.keyDown(button, { key: 'Enter' });

		expect(onAvatarClick).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard Space key', async () => {
		const onAvatarClick = vi.fn();

		render(TestArtistProfileWrapper, {
			props: {
				artist: mockArtist,
				handlers: { onAvatarClick },
				Component: ArtistProfile.Avatar,
				props: {},
			},
		});

		const button = screen.getByRole('button');
		await fireEvent.keyDown(button, { key: ' ' });

		expect(onAvatarClick).toHaveBeenCalledTimes(1);
	});
});
