import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { Status } from '../src/types.js';
import TimelineVirtualized from '../src/components/TimelineVirtualized.svelte';

vi.mock('@tanstack/svelte-virtual', () => ({
	createVirtualizer: vi.fn(() => ({
		getVirtualItems: () => [{ index: 0, size: 180, start: 0 }],
		getTotalSize: () => 180,
		measure: vi.fn(),
		updateOptions: vi.fn(),
	})),
}));

vi.mock('@equaltoai/greater-components-primitives', async () => ({
	Button: (await import('./components/ButtonStub.svelte')).default,
}));

vi.mock('@equaltoai/greater-components-icons', async () => {
	const Icon = (await import('./components/IconStub.svelte')).default;
	return {
		Reply: Icon,
		Boost: Icon,
		Favorite: Icon,
		Share: Icon,
		Unboost: Icon,
		Unfavorite: Icon,
	};
});

beforeAll(() => {
	if (!window.matchMedia) {
		window.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
	}
});

function createStatus(id: string): Status {
	const now = new Date().toISOString();

	return {
		id,
		uri: `https://example.com/status/${id}`,
		url: `https://example.com/status/${id}`,
		account: {
			id: `acct-${id}`,
			username: `user${id}`,
			acct: `user${id}@example.com`,
			displayName: `User ${id}`,
			avatar: 'https://example.com/avatar.png',
			url: `https://example.com/@user${id}`,
			createdAt: now,
		},
		content: 'Hello from timeline',
		createdAt: now,
		visibility: 'public',
		repliesCount: 0,
		reblogsCount: 0,
		favouritesCount: 0,
		sensitive: false,
		spoilerText: '',
		mediaAttachments: [],
		mentions: [],
		tags: [],
		communityNotes: [],
	};
}

describe('TimelineVirtualized - Action Handlers', () => {
	it('renders quote button when handlers provided even without quote count', async () => {
		const status = createStatus('quote');
		const onQuote = vi.fn();

		render(TimelineVirtualized, {
			props: {
				items: [status],
				actionHandlers: {
					onQuote,
				},
			},
		});

		const quoteButton = await screen.findByRole('button', { name: /quote this post/i });
		await fireEvent.click(quoteButton);

		expect(onQuote).toHaveBeenCalledTimes(1);
		expect(onQuote).toHaveBeenCalledWith(status);
	});

	it('supports function form action handler resolver', async () => {
		const status = createStatus('resolver');
		const onQuote = vi.fn();

		render(TimelineVirtualized, {
			props: {
				items: [status],
				actionHandlers: (current) => ({
					onQuote: () => onQuote(current.id),
				}),
			},
		});

		const quoteButton = await screen.findByRole('button', { name: /quote this post/i });
		await fireEvent.click(quoteButton);

		expect(onQuote).toHaveBeenCalledTimes(1);
		expect(onQuote).toHaveBeenCalledWith(status.id);
	});
});
