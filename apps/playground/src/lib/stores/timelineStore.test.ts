import { describe, expect, it } from 'vitest';
import type { Status, TimelineFilter, TimelineSeed } from '../types/fediverse';
import { createTimelineController, type TimelineState } from './timelineStore';

const makeStatus = (id: string, overrides: Partial<Status> = {}): Status => ({
	id,
	uri: `https://example.social/@tester/${id}`,
	url: `https://example.social/@tester/${id}`,
	account: {
		id: `acct-${id}`,
		username: 'tester',
		acct: 'tester@example.social',
		displayName: 'Timeline Tester',
		avatar: 'https://placehold.co/64x64',
		url: 'https://example.social/@tester',
		createdAt: '2024-01-01T00:00:00Z',
		followersCount: 0,
		followingCount: 0,
		statusesCount: 0,
	},
	content: `<p>Status ${id}</p>`,
	createdAt: '2024-01-01T00:00:00Z',
	visibility: 'public',
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
	mediaAttachments: [],
	mentions: [],
	tags: [],
	...overrides,
});

const seedFactory = (): TimelineSeed => ({
	home: [makeStatus('home-initial-1'), makeStatus('home-initial-2')],
	local: [makeStatus('local-1')],
	federated: [],
});

const generator = (filter: TimelineFilter, page: number, pageSize: number): Status[] =>
	Array.from({ length: pageSize }).map((_, index) =>
		makeStatus(`${filter}-generated-${page}-${index}`)
	);

describe('createTimelineController', () => {
	it('initializes with the home feed and descriptive copy', () => {
		const controller = createTimelineController({
			seeds: seedFactory(),
			generator,
			pageSize: 1,
			delayMs: 0,
		});

		let snapshot: TimelineState | undefined;
		const unsubscribe = controller.subscribe((value) => {
			snapshot = value;
		});

		expect(snapshot?.filter).toBe('home');
		expect(snapshot?.items).toHaveLength(1);
		expect(snapshot?.viewDescription).toMatch(/People you follow/);
		expect(snapshot?.prefetched ?? 0).toBeGreaterThanOrEqual(1);

		unsubscribe();
	});

	it('switches filters and resets cached items', () => {
		const controller = createTimelineController({
			seeds: seedFactory(),
			generator,
			pageSize: 1,
			delayMs: 0,
		});

		let snapshot: TimelineState | undefined;
		const unsubscribe = controller.subscribe((value) => {
			snapshot = value;
		});

		controller.setFilter('local');
		expect(snapshot?.filter).toBe('local');
		expect(snapshot?.items[0]?.id).toBe('local-1');
		expect(snapshot?.viewDescription).toMatch(/current instance/i);

		controller.setFilter('home');
		expect(snapshot?.filter).toBe('home');
		expect(snapshot?.items[0]?.id).toBe('home-initial-1');

		unsubscribe();
	});

	it('enqueues additional batches when loadMore is called', async () => {
		const controller = createTimelineController({
			seeds: seedFactory(),
			generator,
			pageSize: 1,
			delayMs: 0,
		});

		let snapshot: TimelineState | undefined;
		const unsubscribe = controller.subscribe((value) => {
			snapshot = value;
		});

		await controller.loadMore();
		expect(snapshot?.items).toHaveLength(2);
		expect(snapshot?.items[1]?.id).toBeTruthy();
		expect(snapshot?.prefetched ?? 0).toBeGreaterThanOrEqual(1);

		unsubscribe();
	});
	it('simulates and clears errors without losing hydrated items', () => {
		const controller = createTimelineController({
			seeds: seedFactory(),
			generator,
			pageSize: 1,
			delayMs: 0,
		});

		let snapshot: TimelineState | undefined;
		const unsubscribe = controller.subscribe((value) => {
			snapshot = value;
		});

		controller.simulateError('Offline');
		expect(snapshot?.error).toBe('Offline');
		expect(snapshot?.items).toHaveLength(1);

		controller.clearError();
		expect(snapshot?.error).toBeNull();

		unsubscribe();
	});

});
