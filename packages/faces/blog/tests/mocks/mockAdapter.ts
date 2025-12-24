/**
 * Mock Adapter for Blog Face
 *
 * Mocks API interactions for article and publication data.
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

		// Article CRUD
		getArticle: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		createArticle: vi
			.fn()
			.mockImplementation(() => mockResponse({ success: true, data: { id: 'new-article' } })),
		updateArticle: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		deleteArticle: vi.fn().mockImplementation(() => mockResponse({ success: true })),

		// Lists & Pagination
		getArticleList: vi
			.fn()
			.mockImplementation(() => mockResponse({ data: [], pageInfo: { hasNextPage: false } })),
		getPublicationArticles: vi
			.fn()
			.mockImplementation(() => mockResponse({ data: [], pageInfo: { hasNextPage: false } })),

		// Entity fetching
		getAuthor: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		getPublication: vi.fn().mockImplementation(() => mockResponse({ data: {} })),

		// Engagement
		bookmarkArticle: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		shareArticle: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		reactToArticle: vi.fn().mockImplementation(() => mockResponse({ success: true })),
		commentOnArticle: vi.fn().mockImplementation(() => mockResponse({ success: true })),
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
