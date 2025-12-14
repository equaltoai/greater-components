/**
 * Mock Adapter
 *
 * Mocked API adapter for testing Artist Face components and stores.
 * Follows patterns from packages/faces/social/tests mock adapters.
 */

import { vi, type Mock } from 'vitest';
import type { ArtworkData } from '../../src/components/Artwork/context.js';

export interface MockAdapterConfig {
	delay?: number;
	shouldFail?: boolean;
	errorMessage?: string;
}

interface MockAdapter {
	fetchArtworks: Mock;
	getArtwork: Mock;
	createArtwork: Mock;
	updateArtwork: Mock;
	deleteArtwork: Mock;
	likeArtwork: Mock;
	unlikeArtwork: Mock;
	collectArtwork: Mock;
	uncollectArtwork: Mock;
	searchArtworks: Mock;
	getRecommendations: Mock;
	searchByColor: Mock;
	fetchCommissions: Mock;
	getCommission: Mock;
	createCommission: Mock;
	updateCommissionStatus: Mock;
	addCommissionMessage: Mock;
	getArtistProfile: Mock;
	updateArtistProfile: Mock;
	query: Mock;
	mutate: Mock;
}

/**
 * Creates a mock adapter with configurable behavior
 */
export function createMockAdapter(config: MockAdapterConfig = {}): MockAdapter {
	const { delay = 0, shouldFail = false, errorMessage = 'Mock error' } = config;

	const mockResponse = <T>(data: T) => {
		if (shouldFail) {
			return Promise.reject(new Error(errorMessage));
		}
		if (delay > 0) {
			return new Promise<T>((resolve) => setTimeout(() => resolve(data), delay));
		}
		return Promise.resolve(data);
	};

	return {
		// Artwork operations
		fetchArtworks: vi
			.fn()
			.mockImplementation(() => mockResponse({ edges: [], pageInfo: { hasNextPage: false } })),
		getArtwork: vi
			.fn()
			.mockImplementation((id: string) => mockResponse({ id, title: `Artwork ${id}` })),
		createArtwork: vi
			.fn()
			.mockImplementation((input: Partial<ArtworkData>) =>
				mockResponse({ id: 'new-artwork', ...input })
			),
		updateArtwork: vi
			.fn()
			.mockImplementation((id: string, input: Partial<ArtworkData>) =>
				mockResponse({ id, ...input })
			),
		deleteArtwork: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// Interaction operations
		likeArtwork: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		unlikeArtwork: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		collectArtwork: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		uncollectArtwork: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// Discovery operations
		searchArtworks: vi.fn().mockImplementation(() => mockResponse({ results: [], total: 0 })),
		getRecommendations: vi.fn().mockImplementation(() => mockResponse({ artworks: [] })),
		searchByColor: vi.fn().mockImplementation(() => mockResponse({ results: [] })),

		// Commission operations
		fetchCommissions: vi
			.fn()
			.mockImplementation(() => mockResponse({ edges: [], pageInfo: { hasNextPage: false } })),
		getCommission: vi
			.fn()
			.mockImplementation((id: string) => mockResponse({ id, status: 'inquiry' })),
		createCommission: vi
			.fn()
			.mockImplementation(() => mockResponse({ id: 'new-commission', status: 'inquiry' })),
		updateCommissionStatus: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		addCommissionMessage: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// Artist profile operations
		getArtistProfile: vi
			.fn()
			.mockImplementation((id: string) => mockResponse({ id, username: `artist${id}` })),
		updateArtistProfile: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// GraphQL operations
		query: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		mutate: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
	};
}

export interface MockTransportManager {
	subscribe: Mock;
	unsubscribe: Mock;
	on: Mock;
	emit: (channel: string, payload: unknown) => void;
	connect: Mock;
	disconnect: Mock;
}

/**
 * Creates a mock transport manager for real-time updates
 */
export function createMockTransportManager(): MockTransportManager {
	const handlers = new Map<string, Set<(payload: unknown) => void>>();

	const subscribe = vi
		.fn()
		.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
			if (!handlers.has(channel)) {
				handlers.set(channel, new Set());
			}
			handlers.get(channel)?.add(handler);
			return () => handlers.get(channel)?.delete(handler);
		});

	return {
		subscribe,
		on: subscribe,
		unsubscribe: vi.fn(),
		emit: (channel: string, payload: unknown) => {
			handlers.get(channel)?.forEach((handler) => handler(payload));
		},
		connect: vi.fn().mockResolvedValue(undefined),
		disconnect: vi.fn(),
	};
}
