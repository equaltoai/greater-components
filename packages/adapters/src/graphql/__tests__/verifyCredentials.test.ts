import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LesserGraphQLAdapter } from '../LesserGraphQLAdapter';

// Mock the client creator
const mockQuery = vi.fn();
const mockMutate = vi.fn();
const mockUpdateToken = vi.fn();

vi.mock('../client', () => ({
	createGraphQLClient: () => ({
		client: {
			query: mockQuery,
			mutate: mockMutate,
		},
		updateToken: mockUpdateToken,
		close: vi.fn(),
	}),
}));

describe('LesserGraphQLAdapter.verifyCredentials', () => {
	let adapter: LesserGraphQLAdapter;

	beforeEach(() => {
		vi.clearAllMocks();
		adapter = new LesserGraphQLAdapter({
			httpEndpoint: 'https://example.com/graphql',
			token: 'valid-token',
		});
	});

	it('successfully returns viewer when authenticated', async () => {
		const mockViewer = { id: '1', username: 'alice' };
		mockQuery.mockResolvedValue({
			data: {
				viewer: mockViewer,
			},
		});

		const result = await adapter.verifyCredentials();
		expect(result).toEqual(mockViewer);
		expect(mockQuery).toHaveBeenCalled();
	});

	it('throws error when no token provided', async () => {
		adapter = new LesserGraphQLAdapter({
			httpEndpoint: 'https://example.com/graphql',
		});

		await expect(adapter.verifyCredentials()).rejects.toThrow(
			'No authentication token provided'
		);
	});

	it('throws error when viewer is null (invalid token)', async () => {
		mockQuery.mockResolvedValue({
			data: {
				viewer: null,
			},
		});

		await expect(adapter.verifyCredentials()).rejects.toThrow('Invalid authentication token');
	});

	it('handles 401 network errors', async () => {
		mockQuery.mockRejectedValue(new Error('Network error: 401 Unauthorized'));

		await expect(adapter.verifyCredentials()).rejects.toThrow(
			'Authentication failed: Invalid or expired token'
		);
	});

    it('helper methods work correctly', () => {
        expect(adapter.isAuthenticated()).toBe(true);
        expect(adapter.getToken()).toBe('valid-token');
        
        adapter.refreshToken('new-token');
        expect(adapter.getToken()).toBe('new-token');
        expect(mockUpdateToken).toHaveBeenCalledWith('new-token');
    });
});
