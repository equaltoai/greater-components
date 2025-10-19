import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import HashtagsControlsHarness from './HashtagsControlsHarness.svelte';
import HashtagsFollowedListHarness from './HashtagsFollowedListHarness.svelte';
import HashtagsMutedListHarness from './HashtagsMutedListHarness.svelte';

describe('Hashtags components', () => {
	it('invokes adapter actions from controls', async () => {
		const adapter = {
			followHashtag: vi.fn().mockResolvedValue({}),
			muteHashtag: vi.fn().mockResolvedValue({}),
			unmuteHashtag: vi.fn().mockResolvedValue({}),
		} as unknown as LesserGraphQLAdapter;

		render(HashtagsControlsHarness, {
			props: {
				adapter,
				hashtag: 'news',
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /^follow$/i }));
		expect(adapter.followHashtag).toHaveBeenCalledWith('news');

		await fireEvent.click(screen.getByRole('button', { name: /^mute$/i }));
		expect(adapter.muteHashtag).toHaveBeenCalledWith('news');
	});

	it('unmutes hashtags from controls when requested', async () => {
		const adapter = {
			followHashtag: vi.fn().mockResolvedValue({}),
			muteHashtag: vi.fn().mockResolvedValue({}),
			unmuteHashtag: vi.fn().mockResolvedValue({}),
		} as unknown as LesserGraphQLAdapter;

		render(HashtagsControlsHarness, {
			props: {
				adapter,
				hashtag: 'events',
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /^unmute$/i }));
		expect(adapter.unmuteHashtag).toHaveBeenCalledWith('events');
	});

	it('renders followed hashtags from adapter data', async () => {
		const adapter = {
			getFollowedHashtags: vi.fn().mockResolvedValue({
				edges: [
					{
						node: {
							name: 'fediverse',
							url: 'https://example.com/tags/fediverse',
							notificationSettings: { muted: false },
						},
					},
					{
						node: {
							name: 'lesser',
							url: 'https://example.com/tags/lesser',
							notificationSettings: { muted: true },
						},
					},
				],
			}),
			unmuteHashtag: vi.fn().mockResolvedValue({}),
		} as unknown as LesserGraphQLAdapter;

		render(HashtagsFollowedListHarness, {
			props: {
				adapter,
			},
		});

    expect(await screen.findByText('fediverse')).toBeTruthy();
    expect(screen.getByText('lesser')).toBeTruthy();
	});

	it('filters muted hashtags using follow data', async () => {
		const adapter = {
			getFollowedHashtags: vi.fn().mockResolvedValue({
				edges: [
					{
						node: {
							name: 'muted-tag',
							notificationSettings: { muted: true, mutedUntil: new Date().toISOString(), level: 'ALL' },
						},
					},
					{
						node: {
							name: 'active-tag',
							notificationSettings: { muted: false },
						},
					},
				],
			}),
			unmuteHashtag: vi.fn().mockResolvedValue({}),
		} as unknown as LesserGraphQLAdapter;

		render(HashtagsMutedListHarness, {
			props: {
				adapter,
			},
		});

    expect(await screen.findByText('muted-tag')).toBeTruthy();
		expect(screen.queryByText('active-tag')).toBeNull();
	});

	it('reloads followed hashtags when refresh version changes', async () => {
		const adapter = {
			getFollowedHashtags: vi
				.fn()
				.mockResolvedValueOnce({
					edges: [{ node: { name: 'initial', notificationSettings: { muted: false } } }],
				})
				.mockResolvedValueOnce({
					edges: [{ node: { name: 'updated', notificationSettings: { muted: false } } }],
				}),
			unmuteHashtag: vi.fn().mockResolvedValue({}),
		} as unknown as LesserGraphQLAdapter;

		const { unmount } = render(HashtagsFollowedListHarness, {
			props: {
				adapter,
			},
		});

		expect(await screen.findByText('initial')).toBeTruthy();

		unmount();
		render(HashtagsFollowedListHarness, {
			props: {
				adapter,
				refreshVersion: 1,
			},
		});

		await screen.findByText('updated');
		expect(adapter.getFollowedHashtags).toHaveBeenCalledTimes(2);
	});

	it('allows unmuting hashtags from muted list', async () => {
		const adapter = {
			getFollowedHashtags: vi
				.fn()
				.mockResolvedValueOnce({
					edges: [
						{
							node: {
								name: 'muted-only',
								notificationSettings: { muted: true, level: 'FOLLOWING' },
							},
						},
					],
				})
				.mockResolvedValueOnce({
					edges: [
						{
							node: {
								name: 'muted-only',
								notificationSettings: { muted: false, level: 'FOLLOWING' },
							},
						},
					],
				}),
			unmuteHashtag: vi.fn().mockResolvedValue({}),
		} as unknown as LesserGraphQLAdapter;

		render(HashtagsMutedListHarness, {
			props: {
				adapter,
			},
		});

		const unmute = await screen.findByRole('button', { name: /^unmute$/i });
		await fireEvent.click(unmute);

		await waitFor(() => {
			expect(adapter.unmuteHashtag).toHaveBeenCalledWith('muted-only', {
				level: 'FOLLOWING',
				mutedUntil: null,
			});
		});

		await waitFor(() => {
			expect(adapter.getFollowedHashtags).toHaveBeenCalledTimes(2);
		});
	});
});
