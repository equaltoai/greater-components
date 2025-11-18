import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimelineStore } from '../timelineStore.js';
import type { TimelineItem, TimelineConfig } from '../types.js';

const transportManagerStub = {
	on: vi.fn().mockReturnValue(() => {}),
	send: vi.fn(),
	connect: vi.fn(),
	disconnect: vi.fn(),
} as unknown as TimelineConfig['transportManager'];

const adapterStub = {
	deleteObject: vi.fn().mockResolvedValue(true),
} as unknown as NonNullable<TimelineConfig['adapter']>;

const baseItem: TimelineItem = {
	id: 'status-1',
	type: 'status',
	timestamp: Date.now(),
	content: { id: 'status-1' },
};

describe('timelineStore deletion/tombstone behavior', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.runAllTimers();
		vi.useRealTimers();
	});

	it('converts deleteStatus into a tombstone when deletionMode is tombstone', async () => {
		const store = createTimelineStore({
			transportManager: transportManagerStub,
			adapter: adapterStub,
			initialItems: [baseItem],
			deletionMode: 'tombstone',
			updateDebounceMs: 0,
		});

		await store.deleteStatus(baseItem.id);

		vi.runAllTimers();

		const items = store.get().items;
		expect(items).toHaveLength(1);
		const [first] = items;
		expect(first?.type).toBe('tombstone');
		expect(first?.metadata?.lesser?.isDeleted).toBe(true);
		expect(adapterStub.deleteObject).toHaveBeenCalledWith(baseItem.id);
	});

	it('removes items when deletionMode is remove', async () => {
		const store = createTimelineStore({
			transportManager: transportManagerStub,
			adapter: adapterStub,
			initialItems: [baseItem],
			deletionMode: 'remove',
			updateDebounceMs: 0,
		});

		await store.deleteStatus(baseItem.id);

		expect(store.get().items).toHaveLength(0);
	});

	it('normalizes streaming delete edits into tombstones', async () => {
		const store = createTimelineStore({
			transportManager: transportManagerStub,
			adapter: adapterStub,
			initialItems: [baseItem],
			deletionMode: 'tombstone',
			updateDebounceMs: 0,
		});

		store.applyStreamingEdit({
			type: 'delete',
			itemId: baseItem.id,
			timestamp: Date.now(),
		});

		vi.runAllTimers();

		const item = store.get().items.find((candidate) => candidate.id === baseItem.id);
		expect(item?.type).toBe('tombstone');
		expect(item?.metadata?.lesser?.isDeleted).toBe(true);
	});
});
