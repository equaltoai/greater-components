import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockArtist } from '../../mocks/index.js';

// Mock context
const mockHandlers = {
	onFollow: vi.fn(),
	onUnfollow: vi.fn(),
	onMessage: vi.fn(),
	onCommission: vi.fn(),
};

const mockContext = {
	artist: {
		...createMockArtist('1'),
		commissionStatus: 'open',
	} as any,
	isOwnProfile: false,
	isFollowing: false,
	professionalMode: false,
	handlers: mockHandlers,
};

// Wrapper component to provide context
import TestWrapper from './ActionsTestWrapper.svelte';

describe('ArtistProfile.Actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders all buttons by default', () => {
		render(TestWrapper, { props: { context: mockContext } });
		expect(screen.getByText('Follow')).toBeTruthy();
		expect(screen.getByText('Message')).toBeTruthy();
		expect(screen.getByText('Open for Commissions')).toBeTruthy();
	});

	it('hides follow button when professionalMode is true', () => {
		render(TestWrapper, { props: { context: { ...mockContext, professionalMode: true } } });
		expect(screen.queryByText('Follow')).toBeNull();
	});

	it('hides buttons based on props', () => {
		render(TestWrapper, {
			props: {
				context: mockContext,
				componentProps: { showFollow: false, showMessage: false, showCommission: false },
			},
		});
		expect(screen.queryByText('Follow')).toBeNull();
		expect(screen.queryByText('Message')).toBeNull();
		expect(screen.queryByText('Open for Commissions')).toBeNull();
	});

	it('handles follow click', async () => {
		render(TestWrapper, { props: { context: mockContext } });
		const followBtn = screen.getByText('Follow');
		await fireEvent.click(followBtn);
		expect(mockHandlers.onFollow).toHaveBeenCalled();
		// Should toggle state (this tests the optimistic update in the component)
		expect(screen.getByText('Following')).toBeTruthy();
	});

	it('handles unfollow click', async () => {
		render(TestWrapper, { props: { context: { ...mockContext, isFollowing: true } } });
		const followingBtn = screen.getByText('Following');
		await fireEvent.click(followingBtn);
		expect(mockHandlers.onUnfollow).toHaveBeenCalled();
		expect(screen.getByText('Follow')).toBeTruthy();
	});

	it('shows loading spinner during follow action', async () => {
		let resolveFollow: any;
		const onFollowPromise = new Promise((resolve) => {
			resolveFollow = resolve;
		});
		mockHandlers.onFollow.mockReturnValue(onFollowPromise);

		render(TestWrapper, { props: { context: mockContext } });
		const followBtn = screen.getByText('Follow');
		await fireEvent.click(followBtn);

		// Check for spinner/loading state. The spinner has class profile-actions__spinner
		expect(
			screen.getByRole('button', { pressed: false }).querySelector('.profile-actions__spinner')
		).toBeTruthy();

		await resolveFollow(undefined);
	});

	it('handles message click', async () => {
		render(TestWrapper, { props: { context: mockContext } });
		const messageBtn = screen.getByText('Message').closest('button');
		if (messageBtn) await fireEvent.click(messageBtn);
		expect(mockHandlers.onMessage).toHaveBeenCalled();
	});

	it('handles commission click', async () => {
		render(TestWrapper, { props: { context: mockContext } });
		const commissionBtn = screen.getByText('Open for Commissions');
		await fireEvent.click(commissionBtn);
		expect(mockHandlers.onCommission).toHaveBeenCalled();
	});

	it('renders waitlist status', () => {
		const artistWaitlist = { ...createMockArtist('1'), commissionStatus: 'waitlist' } as any;
		render(TestWrapper, { props: { context: { ...mockContext, artist: artistWaitlist } } });
		expect(screen.getByText('Join Waitlist')).toBeTruthy();
	});

	it('does not render commission button if closed', () => {
		const artistClosed = { ...createMockArtist('1'), commissionStatus: 'closed' } as any;
		render(TestWrapper, { props: { context: { ...mockContext, artist: artistClosed } } });
		expect(screen.queryByText(/Commission/)).toBeNull();
		expect(screen.queryByText(/Waitlist/)).toBeNull();
	});

	it('does not render if isOwnProfile is true', () => {
		render(TestWrapper, { props: { context: { ...mockContext, isOwnProfile: true } } });
		expect(screen.queryByRole('group')).toBeNull();
	});
});
