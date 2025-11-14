import { get, writable, type Readable } from 'svelte/store';
import type { Status, TimelineFilter, TimelineSeed } from '../types/fediverse';

const VIEW_DESCRIPTIONS = {
	home: 'People you follow plus curated boosts with client-side hydration hints.',
	local: 'Only actors from the current instance with moderation-friendly pacing.',
	federated: 'Wider network view with prefetch capped to avoid scroll jumps.',
} as const satisfies Record<TimelineFilter, string>;

const deepClone = <T>(value: T): T =>
	typeof structuredClone === 'function'
		? structuredClone(value)
		: JSON.parse(JSON.stringify(value));

const cloneList = (items: Status[]) => items.map((item) => deepClone(item));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type TimelineState = {
	filter: TimelineFilter;
	items: Status[];
	loading: boolean;
	error: string | null;
	hasMore: boolean;
	viewDescription: string;
	prefetched: number;
	lastUpdated: number;
};

export type TimelineController = {
	subscribe: Readable<TimelineState>['subscribe'];
	setFilter: (filter: TimelineFilter) => void;
	loadMore: () => Promise<void>;
	refresh: () => void;
	simulateError: (message?: string) => void;
	clearError: () => void;
};

type ControllerOptions = {
	seeds: TimelineSeed;
	pageSize?: number;
	prefetchTarget?: number;
	delayMs?: number;
	generator: (filter: TimelineFilter, page: number, pageSize: number) => Status[];
};

export function createTimelineController(options: ControllerOptions): TimelineController {
	const pageSize = options.pageSize ?? 5;
	const prefetchTarget = options.prefetchTarget ?? pageSize * 2;
	const delayMs = options.delayMs ?? 360;
	const generator = options.generator;

	const frozenSeeds = new Map<TimelineFilter, Status[]>(
		Object.entries(options.seeds).map(([key, value]) => [key as TimelineFilter, cloneList(value)])
	);

	const prefetchQueues = new Map<TimelineFilter, Status[]>();
	const pageCursor = new Map<TimelineFilter, number>();

	const store = writable<TimelineState>({
		filter: 'home',
		items: [],
		loading: false,
		error: null,
		hasMore: false,
		viewDescription: VIEW_DESCRIPTIONS.home,
		prefetched: 0,
		lastUpdated: Date.now(),
	});

	function hydrate(filter: TimelineFilter) {
		const baseline = cloneList(frozenSeeds.get(filter) ?? []);
		const initialChunk = baseline.splice(0, pageSize);
		prefetchQueues.set(filter, baseline);
		pageCursor.set(filter, 0);

		store.set({
			filter,
			items: initialChunk,
			loading: false,
			error: null,
			hasMore: baseline.length > 0,
			viewDescription: VIEW_DESCRIPTIONS[filter],
			prefetched: baseline.length,
			lastUpdated: Date.now(),
		});

		ensurePrefetch(filter);
	}

	function ensurePrefetch(filter: TimelineFilter) {
		const queue = prefetchQueues.get(filter) ?? [];

		while (queue.length < prefetchTarget) {
			const nextPage = (pageCursor.get(filter) ?? 0) + 1;
			const generated = cloneList(generator(filter, nextPage, pageSize));

			if (generated.length === 0) {
				break;
			}

			pageCursor.set(filter, nextPage);
			queue.push(...generated);
		}

		prefetchQueues.set(filter, queue);

		store.update((state) =>
			state.filter === filter
				? {
						...state,
						hasMore: queue.length > 0,
						prefetched: queue.length,
					}
				: state
		);
	}

	async function loadMore() {
		const current = get(store);
		if (current.loading || current.error || !current.hasMore) {
			return;
		}

		store.update((state) =>
			state.filter === current.filter ? { ...state, loading: true, error: null } : state
		);

		try {
			await wait(delayMs);
			const queue = prefetchQueues.get(current.filter) ?? [];

			if (queue.length === 0) {
				store.update((state) =>
					state.filter === current.filter
						? { ...state, loading: false, hasMore: false, prefetched: 0 }
						: state
				);
				return;
			}

			const nextChunk = queue.splice(0, pageSize);
			prefetchQueues.set(current.filter, queue);

			store.update((state) =>
				state.filter === current.filter
					? {
							...state,
							items: [...state.items, ...nextChunk],
							loading: false,
							hasMore: queue.length > 0,
							prefetched: queue.length,
							lastUpdated: Date.now(),
						}
					: state
			);

			ensurePrefetch(current.filter);
		} catch (error) {
			store.update((state) =>
				state.filter === current.filter
					? {
							...state,
							loading: false,
							error: (error as Error).message ?? 'Unable to load timeline batch.',
						}
					: state
			);
		}
	}

	function setFilter(filter: TimelineFilter) {
		const current = get(store);
		if (current.filter === filter) {
			hydrate(filter);
			return;
		}

		hydrate(filter);
	}

	function refresh() {
		const current = get(store);
		hydrate(current.filter);
	}

	function simulateError(message = 'Simulated network hiccup — retry to continue scrolling.') {
		store.update((state) => ({
			...state,
			loading: false,
			error: message,
		}));
	}

	function clearError() {
		store.update((state) => ({
			...state,
			error: null,
		}));
	}

	hydrate('home');

	return {
		subscribe: store.subscribe,
		setFilter,
		loadMore,
		refresh,
		simulateError,
		clearError,
	};
}
