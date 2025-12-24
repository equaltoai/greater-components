/**
 * Mock Adapter for Community Face
 *
 * Mocks API interactions for community, post, and comment data.
 */

import { vi } from 'vitest';

export interface MockAdapterConfig {
	delay?: number;
	shouldFail?: boolean;
	errorMessage?: string;
}

export function createMockAdapter(config: MockAdapterConfig = {}): Record<string, unknown> {
	const { delay = 0, shouldFail = false, errorMessage = 'Mock error' } = config;

	const mockResponse = <T>(data: T) => {
		if (shouldFail) return Promise.reject(new Error(errorMessage));
		if (delay > 0) return new Promise<T>((resolve) => setTimeout(() => resolve(data), delay));
		return Promise.resolve(data);
	};

	return {
		// Generic operations
		query: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		mutate: vi.fn().mockImplementation(() => mockResponse({ data: {} })),

		// Data Fetching
		getCommunity: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		getPost: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		getComments: vi.fn().mockImplementation(() => mockResponse({ data: [] })),

		// User Actions
		vote: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		subscribe: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		report: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		createPost: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		createComment: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// Moderation Actions
		removeContent: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		approveContent: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		banUser: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		lockThread: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		unlockThread: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		stickyPost: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// Wiki Operations
		getWikiPage: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		updateWikiPage: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		getWikiHistory: vi.fn().mockImplementation(() => mockResponse({ data: [] })),
	};
}

export function createMockTransportManager(): Record<string, unknown> {
	const handlers = new Map<string, Set<(payload: unknown) => void>>();

	return {
		subscribe: vi
			.fn()
			.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
				if (!handlers.has(channel)) {
					handlers.set(channel, new Set());
				}
				handlers.get(channel)?.add(handler);
				return () => {
					handlers.get(channel)?.delete(handler);
				};
			}),
		emit: (channel: string, payload: unknown) => {
			handlers.get(channel)?.forEach((h) => h(payload));
		},
		unsubscribe: vi.fn().mockImplementation((channel: string) => {
			handlers.delete(channel);
		}),
	};
}
