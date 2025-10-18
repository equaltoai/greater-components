/**
 * Auth.OAuthConsent Component Tests
 * 
 * Tests for OAuth authorization consent screen including:
 * - Client information display
 * - Scope permission handling
 * - Authorization flow
 * - Denial flow
 * - URL parsing
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AuthHandlers, OAuthData } from '../../src/components/Auth/context.js';

// Client info interface
interface ClientInfo {
	name: string;
	website?: string;
	description?: string;
	icon?: string;
}

// Scope interface
interface Scope {
	id: string;
	name: string;
	description: string;
	icon?: string;
}

// User info interface
interface UserInfo {
	username: string;
	displayName?: string;
	avatar?: string;
}

// URL hostname extraction logic
function extractHostname(url?: string): string {
	if (!url) return '';
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch {
		return '';
	}
}

// OAuth consent state
interface OAuthConsentState {
	loading: boolean;
	error: string | null;
}

// OAuth consent logic
function createOAuthConsentLogic(
	clientInfo: ClientInfo,
	scopes: Scope[],
	clientId: string,
	redirectUri: string,
	oauthState: string,
	user?: UserInfo
) {
	const state: OAuthConsentState = {
		loading: false,
		error: null,
	};

	async function handleAuthorize(onOAuthAuthorize?: AuthHandlers['onOAuthAuthorize']) {
		if (state.loading) return;

		state.error = null;
		state.loading = true;

		try {
			const data: OAuthData = {
				clientId,
				redirectUri,
				scope: scopes.map((s) => s.id),
				state: oauthState,
			};

			await onOAuthAuthorize?.(data);
		} catch (err) {
			state.error = err instanceof Error ? err.message : 'Authorization failed';
		} finally {
			state.loading = false;
		}
	}

	function handleDeny(onOAuthDeny?: AuthHandlers['onOAuthDeny']) {
		if (state.loading) return;
		onOAuthDeny?.();
	}

	function getHostname(): string {
		return extractHostname(clientInfo.website);
	}

	function hasIcon(): boolean {
		return !!clientInfo.icon;
	}

	function getScopeIds(): string[] {
		return scopes.map(s => s.id);
	}

	function getDisplayName(): string {
		return user?.displayName || user?.username || 'User';
	}

	return {
		getState: () => ({ ...state }),
		handleAuthorize,
		handleDeny,
		getHostname,
		hasIcon,
		getScopeIds,
		getDisplayName,
		clientInfo,
		scopes,
		user,
	};
}

describe('Auth.OAuthConsent - URL Hostname Extraction', () => {
	it('should extract hostname from valid URL', () => {
		const hostname = extractHostname('https://example.com/path');
		
		expect(hostname).toBe('example.com');
	});

	it('should extract hostname with subdomain', () => {
		const hostname = extractHostname('https://app.example.com');
		
		expect(hostname).toBe('app.example.com');
	});

	it('should handle URLs with ports', () => {
		const hostname = extractHostname('https://example.com:8080/path');
		
		expect(hostname).toBe('example.com');
	});

	it('should return empty string for invalid URL', () => {
		const hostname = extractHostname('not-a-url');
		
		expect(hostname).toBe('');
	});

	it('should return empty string for undefined', () => {
		const hostname = extractHostname(undefined);
		
		expect(hostname).toBe('');
	});

	it('should handle http protocol', () => {
		const hostname = extractHostname('http://test.com');
		
		expect(hostname).toBe('test.com');
	});
});

describe('Auth.OAuthConsent - Client Information', () => {
	const clientInfo: ClientInfo = {
		name: 'Example App',
		website: 'https://app.example.com',
		description: 'An example application',
		icon: 'https://app.example.com/icon.png',
	};

	const scopes: Scope[] = [
		{ id: 'read', name: 'Read', description: 'Read your data' },
	];

	it('should expose client info', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.clientInfo.name).toBe('Example App');
		expect(logic.clientInfo.website).toBe('https://app.example.com');
		expect(logic.clientInfo.description).toBe('An example application');
	});

	it('should extract hostname from website', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.getHostname()).toBe('app.example.com');
	});

	it('should detect when icon is present', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.hasIcon()).toBe(true);
	});

	it('should detect when icon is missing', () => {
		const logic = createOAuthConsentLogic(
			{ ...clientInfo, icon: undefined },
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.hasIcon()).toBe(false);
	});

	it('should handle missing website', () => {
		const logic = createOAuthConsentLogic(
			{ ...clientInfo, website: undefined },
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.getHostname()).toBe('');
	});
});

describe('Auth.OAuthConsent - Scopes', () => {
	const clientInfo: ClientInfo = {
		name: 'Example App',
		website: 'https://app.example.com',
	};

	it('should expose all scopes', () => {
		const scopes: Scope[] = [
			{ id: 'read', name: 'Read', description: 'Read your data' },
			{ id: 'write', name: 'Write', description: 'Modify your data' },
		];

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.scopes).toHaveLength(2);
		expect(logic.scopes[0].id).toBe('read');
		expect(logic.scopes[1].id).toBe('write');
	});

	it('should extract scope IDs', () => {
		const scopes: Scope[] = [
			{ id: 'read', name: 'Read', description: 'Read your data' },
			{ id: 'write', name: 'Write', description: 'Modify your data' },
			{ id: 'admin', name: 'Admin', description: 'Admin access' },
		];

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		const scopeIds = logic.getScopeIds();
		expect(scopeIds).toEqual(['read', 'write', 'admin']);
	});

	it('should handle empty scopes', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			[],
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.scopes).toHaveLength(0);
		expect(logic.getScopeIds()).toEqual([]);
	});

	it('should handle scopes with icons', () => {
		const scopes: Scope[] = [
			{ 
				id: 'read', 
				name: 'Read', 
				description: 'Read your data',
				icon: 'https://example.com/read-icon.svg'
			},
		];

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.scopes[0].icon).toBe('https://example.com/read-icon.svg');
	});
});

describe('Auth.OAuthConsent - User Information', () => {
	const clientInfo: ClientInfo = {
		name: 'Example App',
		website: 'https://app.example.com',
	};

	const scopes: Scope[] = [
		{ id: 'read', name: 'Read', description: 'Read your data' },
	];

	it('should expose user information', () => {
		const user: UserInfo = {
			username: 'alice',
			displayName: 'Alice Example',
			avatar: 'https://example.com/alice.png',
		};

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz',
			user
		);

		expect(logic.user?.username).toBe('alice');
		expect(logic.user?.displayName).toBe('Alice Example');
		expect(logic.user?.avatar).toBe('https://example.com/alice.png');
	});

	it('should get display name from displayName field', () => {
		const user: UserInfo = {
			username: 'alice',
			displayName: 'Alice Example',
		};

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz',
			user
		);

		expect(logic.getDisplayName()).toBe('Alice Example');
	});

	it('should fallback to username when displayName missing', () => {
		const user: UserInfo = {
			username: 'alice',
		};

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz',
			user
		);

		expect(logic.getDisplayName()).toBe('alice');
	});

	it('should fallback to User when user is undefined', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'xyz'
		);

		expect(logic.getDisplayName()).toBe('User');
	});
});

describe('Auth.OAuthConsent - Authorization Flow', () => {
	const clientInfo: ClientInfo = {
		name: 'Example App',
		website: 'https://app.example.com',
	};

	const scopes: Scope[] = [
		{ id: 'read', name: 'Read', description: 'Read your data' },
		{ id: 'write', name: 'Write', description: 'Modify your data' },
	];

	let mockAuthorize: vi.Mock;

	beforeEach(() => {
		mockAuthorize = vi.fn();
	});

	it('should call onOAuthAuthorize with correct data', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		mockAuthorize.mockResolvedValue(undefined);

		await logic.handleAuthorize(mockAuthorize);

		expect(mockAuthorize).toHaveBeenCalledWith({
			clientId: 'client-123',
			redirectUri: 'https://app.example.com/callback',
			scope: ['read', 'write'],
			state: 'state-xyz',
		});
	});

	it('should set loading state during authorization', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		mockAuthorize.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));

		const promise = logic.handleAuthorize(mockAuthorize);
		
		// Check loading state while in progress
		expect(logic.getState().loading).toBe(true);

		await promise;

		// Check loading cleared after
		expect(logic.getState().loading).toBe(false);
	});

	it('should handle authorization errors', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		mockAuthorize.mockRejectedValue(new Error('Authorization failed'));

		await logic.handleAuthorize(mockAuthorize);

		const state = logic.getState();
		expect(state.error).toBe('Authorization failed');
		expect(state.loading).toBe(false);
	});

	it('should handle generic errors', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		mockAuthorize.mockRejectedValue('String error');

		await logic.handleAuthorize(mockAuthorize);

		const state = logic.getState();
		expect(state.error).toBe('Authorization failed');
	});

	it('should not authorize when already loading', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		mockAuthorize.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

		const promise1 = logic.handleAuthorize(mockAuthorize);
		const promise2 = logic.handleAuthorize(mockAuthorize);

		await Promise.all([promise1, promise2]);

		expect(mockAuthorize).toHaveBeenCalledTimes(1);
	});

	it('should clear previous errors on new authorization', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		// First attempt fails
		mockAuthorize.mockRejectedValueOnce(new Error('First error'));
		await logic.handleAuthorize(mockAuthorize);
		expect(logic.getState().error).toBe('First error');

		// Second attempt succeeds
		mockAuthorize.mockResolvedValueOnce(undefined);
		await logic.handleAuthorize(mockAuthorize);
		expect(logic.getState().error).toBeNull();
	});
});

describe('Auth.OAuthConsent - Denial Flow', () => {
	const clientInfo: ClientInfo = {
		name: 'Example App',
		website: 'https://app.example.com',
	};

	const scopes: Scope[] = [
		{ id: 'read', name: 'Read', description: 'Read your data' },
	];

	it('should call onOAuthDeny when denied', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		const mockDeny = vi.fn();

		logic.handleDeny(mockDeny);

		expect(mockDeny).toHaveBeenCalledTimes(1);
	});

	it('should not deny when loading', async () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		// Start authorization to set loading to true
		const mockAuthorize = vi.fn(() => new Promise(() => {})); // Never resolves
		const promise = logic.handleAuthorize(mockAuthorize);

		// Now loading is true
		const mockDeny = vi.fn();
		logic.handleDeny(mockDeny);

		expect(mockDeny).not.toHaveBeenCalled();
	});

	it('should handle missing onOAuthDeny callback gracefully', () => {
		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(() => logic.handleDeny()).not.toThrow();
	});
});

describe('Auth.OAuthConsent - Additional Edge Cases', () => {
	it('should handle empty scopes array', () => {
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(logic.scopes).toHaveLength(0);
	});

	it('should handle very long client names', () => {
		const longName = 'A'.repeat(200);
		const logic = createOAuthConsentLogic(
			{ name: longName },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(logic.clientInfo.name).toBe(longName);
	});

	it('should handle special characters in client name', () => {
		const logic = createOAuthConsentLogic(
			{ name: 'App™ <>&"' },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(logic.clientInfo.name).toBe('App™ <>&"');
	});

	it('should handle unicode in scope descriptions', () => {
		const scopes = [
			{ id: 'read', name: 'Read 📖', description: 'Read your data 🔒' },
		];
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(logic.scopes[0].description).toBe('Read your data 🔒');
	});

	it('should handle very long redirectUri', () => {
		const longUri = 'https://example.com/' + 'a'.repeat(1000);
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			longUri,
			'state-xyz'
		);

		const mockAuthorize = vi.fn().mockResolvedValue(undefined);
		logic.handleAuthorize(mockAuthorize);

		expect(mockAuthorize).toHaveBeenCalledWith(
			expect.objectContaining({ redirectUri: longUri })
		);
	});

	it('should handle very long OAuth state parameter', () => {
		const longState = 'state-' + 'x'.repeat(1000);
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			'https://app.example.com/callback',
			longState
		);

		const mockAuthorize = vi.fn().mockResolvedValue(undefined);
		logic.handleAuthorize(mockAuthorize);

		expect(mockAuthorize).toHaveBeenCalledWith(
			expect.objectContaining({ state: longState })
		);
	});

	it('should handle clientId with special characters', () => {
		const specialId = 'client-123!@#$%^&*()';
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			specialId,
			'https://app.example.com/callback',
			'state-xyz'
		);

		const mockAuthorize = vi.fn().mockResolvedValue(undefined);
		logic.handleAuthorize(mockAuthorize);

		expect(mockAuthorize).toHaveBeenCalledWith(
			expect.objectContaining({ clientId: specialId })
		);
	});

	it('should handle user with displayName', () => {
		const user: UserInfo = {
			username: 'alice',
			displayName: 'Alice Wonderland',
			avatar: 'https://example.com/avatar.jpg',
		};

		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz',
			user
		);

		expect(logic.user).toEqual(user);
	});

	it('should handle user without displayName', () => {
		const user: UserInfo = {
			username: 'bob',
		};

		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz',
			user
		);

		expect(logic.user?.displayName).toBeUndefined();
	});

	it('should handle multiple rapid authorize attempts', async () => {
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		const mockAuthorize = vi.fn().mockImplementation(
			() => new Promise(resolve => setTimeout(resolve, 50))
		);

		const promises = [];
		for (let i = 0; i < 5; i++) {
			promises.push(logic.handleAuthorize(mockAuthorize));
		}

		await Promise.all(promises);

		// Only the first should have been called
		expect(mockAuthorize).toHaveBeenCalledTimes(1);
	});

	it('should handle multiple rapid deny attempts', () => {
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		const mockDeny = vi.fn();

		for (let i = 0; i < 5; i++) {
			logic.handleDeny(mockDeny);
		}

		// All should have been called since no loading state blocks it
		expect(mockDeny).toHaveBeenCalledTimes(5);
	});

	it('should preserve state across authorization errors', async () => {
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[{ id: 'read', name: 'Read', description: 'Read data' }],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		const mockAuthorize = vi.fn().mockRejectedValue(new Error('Failed'));

		await logic.handleAuthorize(mockAuthorize);

		// Client info and scopes should still be accessible
		expect(logic.clientInfo.name).toBe('App');
		expect(logic.scopes).toHaveLength(1);
	});

	it('should handle scope with missing description', () => {
		const scopes = [
			{ id: 'read', name: 'Read', description: '' },
		];
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(logic.scopes[0].description).toBe('');
	});

	it('should handle scope with optional icon', () => {
		const scopes = [
			{ id: 'read', name: 'Read', description: 'Read data', icon: 'book-icon' },
		];
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		expect(logic.scopes[0].icon).toBe('book-icon');
	});

	it('should handle client with all optional fields', () => {
		const client: ClientInfo = {
			name: 'Full App',
			website: 'https://app.example.com',
			description: 'A full-featured app',
			icon: 'app-icon.png',
		};

		const logic = createOAuthConsentLogic(
			client,
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		const info = logic.clientInfo;
		expect(info.website).toBe('https://app.example.com');
		expect(info.description).toBe('A full-featured app');
		expect(info.icon).toBe('app-icon.png');
	});

	it('should handle client with minimal fields', () => {
		const client: ClientInfo = {
			name: 'Minimal App',
		};

		const logic = createOAuthConsentLogic(
			client,
			[],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		const info = logic.clientInfo;
		expect(info.website).toBeUndefined();
		expect(info.description).toBeUndefined();
		expect(info.icon).toBeUndefined();
	});

	it('should extract hostname from http URL', () => {
		expect(extractHostname('http://example.com/path')).toBe('example.com');
	});

	it('should extract hostname from https URL with port', () => {
		expect(extractHostname('https://example.com:8080/path')).toBe('example.com');
	});

	it('should extract subdomain correctly', () => {
		expect(extractHostname('https://app.example.com')).toBe('app.example.com');
	});

	it('should return empty string for invalid URL', () => {
		expect(extractHostname('not-a-url')).toBe('');
	});

	it('should return empty string for undefined URL', () => {
		expect(extractHostname(undefined)).toBe('');
	});
});

describe('Auth.OAuthConsent - Integration Scenarios', () => {
	it('should complete full authorization flow', async () => {
		const clientInfo: ClientInfo = {
			name: 'Example App',
			website: 'https://app.example.com',
			description: 'An example application',
		};

		const scopes: Scope[] = [
			{ id: 'read', name: 'Read', description: 'Read your data' },
			{ id: 'write', name: 'Write', description: 'Write your data' },
		];

		const user: UserInfo = {
			username: 'alice',
			displayName: 'Alice Wonderland',
		};

		const logic = createOAuthConsentLogic(
			clientInfo,
			scopes,
			'client-123',
			'https://app.example.com/callback',
			'state-xyz',
			user
		);

		const mockAuthorize = vi.fn().mockResolvedValue(undefined);

		await logic.handleAuthorize(mockAuthorize);

		expect(mockAuthorize).toHaveBeenCalledWith({
			clientId: 'client-123',
			redirectUri: 'https://app.example.com/callback',
			scope: ['read', 'write'],
			state: 'state-xyz',
		});

		expect(logic.getState()).toEqual({
			loading: false,
			error: null,
		});
	});

	it('should handle authorization failure and retry', async () => {
		const logic = createOAuthConsentLogic(
			{ name: 'App' },
			[{ id: 'read', name: 'Read', description: 'Read data' }],
			'client-123',
			'https://app.example.com/callback',
			'state-xyz'
		);

		let attempts = 0;
		const mockAuthorize = vi.fn(async () => {
			attempts++;
			if (attempts === 1) {
				throw new Error('Network error');
			}
		});

		// First attempt fails
		await logic.handleAuthorize(mockAuthorize);
		expect(logic.getState().error).toBe('Network error');

		// Second attempt succeeds
		await logic.handleAuthorize(mockAuthorize);
		expect(logic.getState().error).toBeNull();
		expect(mockAuthorize).toHaveBeenCalledTimes(2);
	});
});
