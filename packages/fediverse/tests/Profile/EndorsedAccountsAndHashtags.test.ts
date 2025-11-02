import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import EndorsedAccounts from '../../src/components/Profile/EndorsedAccounts.svelte';
import FeaturedHashtags from '../../src/components/Profile/FeaturedHashtags.svelte';
import ProfileTestHarness from './ProfileTestHarness.svelte';
import { createProfile, createMockHandlers } from './test-utils';
import type { ProfileHandlers } from '../../src/components/Profile/context.js';

function renderProfileComponent(
	component: typeof EndorsedAccounts | typeof FeaturedHashtags,
	componentProps: Record<string, unknown>,
	handlerOverrides: Partial<ProfileHandlers> = {},
	{ isOwnProfile = false }: { isOwnProfile?: boolean } = {}
) {
	const handlers = createMockHandlers(handlerOverrides);

	return render(ProfileTestHarness, {
		props: {
			component,
			componentProps,
			profile: createProfile(),
			handlers,
			isOwnProfile,
		},
	});
}

describe('Profile.EndorsedAccounts', () => {
	const endorsed = [
		{ id: '1', username: 'user1', displayName: 'User One' },
		{ id: '2', username: 'user2', displayName: 'User Two' },
		{ id: '3', username: 'user3', displayName: 'User Three' },
		{ id: '4', username: 'user4', displayName: 'User Four' },
		{ id: '5', username: 'user5', displayName: 'User Five' },
	];

	it('limits displayed accounts to the configured maximum', () => {
		const { container } = renderProfileComponent(
			EndorsedAccounts,
			{ endorsed, maxAccounts: 3 },
			{},
			{ isOwnProfile: false }
		);

		const renderedItems = container.querySelectorAll('.endorsed-accounts__item');
		expect(renderedItems).toHaveLength(3);
		expect(renderedItems[0].textContent).toContain('User One');
		expect(renderedItems[2].textContent).toContain('User Three');
	});

	it('renders all accounts when no maximum is provided', () => {
		const { container } = renderProfileComponent(
			EndorsedAccounts,
			{ endorsed, maxAccounts: 0 },
			{},
			{ isOwnProfile: false }
		);

		const renderedItems = container.querySelectorAll('.endorsed-accounts__item');
		expect(renderedItems).toHaveLength(endorsed.length);
	});

	it('calls reorder handler when accounts are rearranged', async () => {
		const onReorderEndorsements = vi.fn().mockResolvedValue(undefined);
		const { container } = renderProfileComponent(
			EndorsedAccounts,
			{ endorsed, isOwnProfile: true, enableReordering: true },
			{ onReorderEndorsements },
			{ isOwnProfile: true }
		);

		const items = container.querySelectorAll('.endorsed-accounts__item');
		expect(items).toHaveLength(endorsed.length);

		await fireEvent.dragStart(items[0]);
		await fireEvent.dragOver(items[2]);
		await fireEvent.drop(items[2]);

		await waitFor(() => {
			expect(onReorderEndorsements).toHaveBeenCalledWith(['2', '3', '1', '4', '5']);
		});

		await waitFor(() => {
			const reordered = container.querySelectorAll('.endorsed-accounts__item');
			expect(reordered[0].textContent).toContain('User Two');
			expect(reordered[2].textContent).toContain('User One');
		});
	});

	it('shows the empty state when there are no endorsed accounts', () => {
		renderProfileComponent(
			EndorsedAccounts,
			{ endorsed: [] },
			{},
			{ isOwnProfile: false }
		);

		expect(screen.getByText('No featured accounts')).toBeTruthy();
	});
});

describe('Profile.FeaturedHashtags', () => {
	const now = Date.now();
	const hashtags = [
		{ name: 'svelte', usageCount: 1500, lastUsed: new Date(now).toISOString() },
		{ name: 'typescript', usageCount: 820, lastUsed: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString() },
		{ name: 'webdev', usageCount: 120, lastUsed: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString() },
	];

	beforeEach(() => {
		vi.spyOn(window, 'confirm').mockReturnValue(true);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('limits displayed hashtags to the configured maximum', () => {
		const { container } = renderProfileComponent(
			FeaturedHashtags,
			{ hashtags, maxHashtags: 2 },
			{},
			{ isOwnProfile: false }
		);

		const renderedItems = container.querySelectorAll('.featured-hashtags__item');
		expect(renderedItems).toHaveLength(2);
		expect(renderedItems[0].textContent).toContain('#svelte');
		expect(renderedItems[1].textContent).toContain('#typescript');
	});

	it('formats usage counts and relative timestamps from component logic', () => {
		renderProfileComponent(
			FeaturedHashtags,
			{ hashtags, showStats: true },
			{},
			{ isOwnProfile: false }
		);

		expect(screen.getByText('1.5K posts')).toBeTruthy();
		expect(screen.getByText('3d ago')).toBeTruthy();
	});

	it('calls reorder handler when hashtags are reordered', async () => {
		const onReorderHashtags = vi.fn().mockResolvedValue(undefined);
		const { container } = renderProfileComponent(
			FeaturedHashtags,
			{ hashtags, isOwnProfile: true, enableReordering: true },
			{ onReorderHashtags },
			{ isOwnProfile: true }
		);

		const items = container.querySelectorAll('.featured-hashtags__item');
		expect(items).toHaveLength(hashtags.length);

		await fireEvent.dragStart(items[0]);
		await fireEvent.dragOver(items[2]);
		await fireEvent.drop(items[2]);

		await waitFor(() => {
			expect(onReorderHashtags).toHaveBeenCalledWith(['typescript', 'webdev', 'svelte']);
		});
	});

	it('shows the empty state when there are no hashtags', () => {
		renderProfileComponent(
			FeaturedHashtags,
			{ hashtags: [] },
			{},
			{ isOwnProfile: false }
		);

		expect(screen.getByText('No featured hashtags')).toBeTruthy();
	});
});
