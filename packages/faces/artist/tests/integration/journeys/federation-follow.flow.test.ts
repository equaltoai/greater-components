import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { CuratorSpotlight } from '../../../src/components/Curation/index.ts';

describe('Federation Follow Journey', () => {
	const mockRemoteCurator = {
		id: 'https://remote.instance/users/curator',
		name: 'Remote Curator',
		avatar: '',
		bio: 'From afar',
		collections: [],
		// Federation specific fields if any
	} as any;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('follows a remote artist', async () => {
		const onFollow = vi.fn().mockResolvedValue(undefined);

		const { rerender } = render(CuratorSpotlight, {
			props: {
				curator: mockRemoteCurator,
				collection: [],
				isFollowing: false,
				onFollow,
			},
		});

		const followBtn = screen.getByRole('button', { name: 'Follow' });
		expect(followBtn).toBeInTheDocument();

		await fireEvent.click(followBtn);

		expect(onFollow).toHaveBeenCalledWith(mockRemoteCurator);

		// Simulate successful follow updating state
		rerender({
			curator: mockRemoteCurator,
			collection: [],
			isFollowing: true,
			onFollow,
		});

		// Button should update to "Following" or "Unfollow" depending on component
		// CuratorSpotlight.svelte: {following ? 'Following' : 'Follow'}
		expect(screen.getByText('Following')).toBeInTheDocument();
	});
});
