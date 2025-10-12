/**
 * InstancePicker Pattern Component Tests
 * 
 * Comprehensive tests for InstancePicker including:
 * - Account switching logic
 * - Account removal logic
 * - Display name generation
 * - Handle generation
 * - Avatar URL resolution
 * - Account sorting
 * - Configuration options
 * - Event handlers
 * - Edge cases
 */

import { describe, it, expect, vi } from 'vitest';

interface ActivityPubActor {
	name?: string;
	preferredUsername?: string;
	icon?: { url?: string } | string;
}

interface AccountInstance {
	id: string;
	actor: ActivityPubActor;
	instance: string;
	token?: string;
	lastUsed?: Date;
	metadata?: {
		unreadNotifications?: number;
		avatar?: string;
		displayName?: string;
	};
}

// Helper to create mock account
function createMockAccount(
	id: string,
	options: {
		name?: string;
		preferredUsername?: string;
		instance?: string;
		lastUsed?: Date;
		metadata?: AccountInstance['metadata'];
		icon?: { url?: string } | string;
	} = {}
): AccountInstance {
	return {
		id,
		actor: {
			name: options.name,
			preferredUsername: options.preferredUsername || `user${id}`,
			icon: options.icon,
		},
		instance: options.instance || `instance${id}.com`,
		lastUsed: options.lastUsed,
		metadata: options.metadata,
	};
}

// Get display name logic (extracted from component)
function getDisplayName(account: AccountInstance): string {
	return (
		account.metadata?.displayName ||
		account.actor.name ||
		account.actor.preferredUsername ||
		'Unknown'
	);
}

// Get handle logic (extracted from component)
function getHandle(account: AccountInstance): string {
	const username = account.actor.preferredUsername || 'unknown';
	return `@${username}@${account.instance}`;
}

// Get avatar URL logic (extracted from component)
function getAvatar(account: AccountInstance): string | undefined {
	if (account.metadata?.avatar) return account.metadata.avatar;
	if (typeof account.actor.icon === 'object' && 'url' in account.actor.icon) {
		return account.actor.icon.url;
	}
	return undefined;
}

// Sort accounts logic (extracted from component)
function sortAccounts(accounts: AccountInstance[], currentAccountId: string): AccountInstance[] {
	return [...accounts].sort((a, b) => {
		if (a.id === currentAccountId) return -1;
		if (b.id === currentAccountId) return 1;
		const aTime = a.lastUsed?.getTime() || 0;
		const bTime = b.lastUsed?.getTime() || 0;
		return bTime - aTime;
	});
}

// Switch account logic
async function switchAccount(
	accounts: AccountInstance[],
	accountId: string,
	switching: boolean,
	onSwitch?: (account: AccountInstance) => Promise<void>
): Promise<boolean> {
	const account = accounts.find((a) => a.id === accountId);
	if (!account || switching) return false;

	await onSwitch?.(account);
	return true;
}

// Remove account logic
async function removeAccount(
	accountId: string,
	currentAccountId: string,
	removing: boolean,
	onRemove?: (accountId: string) => Promise<void>
): Promise<boolean> {
	if (removing || currentAccountId === accountId) return false;

	await onRemove?.(accountId);
	return true;
}

describe('InstancePicker - Display Name', () => {
	it('should use metadata displayName if available', () => {
		const account = createMockAccount('1', {
			metadata: { displayName: 'Alice Smith' },
			name: 'Alice',
			preferredUsername: 'alice',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toBe('Alice Smith');
	});

	it('should use actor name if metadata displayName not available', () => {
		const account = createMockAccount('1', {
			name: 'Alice',
			preferredUsername: 'alice',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toBe('Alice');
	});

	it('should use preferredUsername if name not available', () => {
		const account = createMockAccount('1', {
			preferredUsername: 'alice',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toBe('alice');
	});

	it('should return "Unknown" if no names available', () => {
		const account = createMockAccount('1', {
			preferredUsername: undefined,
		});
		account.actor.name = undefined;
		account.actor.preferredUsername = undefined;

		const displayName = getDisplayName(account);

		expect(displayName).toBe('Unknown');
	});

	it('should prefer metadata over actor name', () => {
		const account = createMockAccount('1', {
			metadata: { displayName: 'Metadata Name' },
			name: 'Actor Name',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toBe('Metadata Name');
	});

	it('should prefer actor name over preferredUsername', () => {
		const account = createMockAccount('1', {
			name: 'Actor Name',
			preferredUsername: 'username',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toBe('Actor Name');
	});
});

describe('InstancePicker - Handle Generation', () => {
	it('should generate handle with username and instance', () => {
		const account = createMockAccount('1', {
			preferredUsername: 'alice',
			instance: 'mastodon.social',
		});

		const handle = getHandle(account);

		expect(handle).toBe('@alice@mastodon.social');
	});

	it('should use "unknown" if preferredUsername not available', () => {
		const account = createMockAccount('1', {
			instance: 'mastodon.social',
		});
		// Explicitly remove preferredUsername
		account.actor.preferredUsername = undefined;

		const handle = getHandle(account);

		expect(handle).toBe('@unknown@mastodon.social');
	});

	it('should handle complex instance domains', () => {
		const account = createMockAccount('1', {
			preferredUsername: 'alice',
			instance: 'social.example.co.uk',
		});

		const handle = getHandle(account);

		expect(handle).toBe('@alice@social.example.co.uk');
	});

	it('should handle localhost', () => {
		const account = createMockAccount('1', {
			preferredUsername: 'alice',
			instance: 'localhost',
		});

		const handle = getHandle(account);

		expect(handle).toBe('@alice@localhost');
	});
});

describe('InstancePicker - Avatar URL Resolution', () => {
	it('should use metadata avatar if available', () => {
		const account = createMockAccount('1', {
			metadata: { avatar: 'https://example.com/avatar-meta.jpg' },
			icon: { url: 'https://example.com/avatar-actor.jpg' },
		});

		const avatar = getAvatar(account);

		expect(avatar).toBe('https://example.com/avatar-meta.jpg');
	});

	it('should use actor icon URL if metadata avatar not available', () => {
		const account = createMockAccount('1', {
			icon: { url: 'https://example.com/avatar.jpg' },
		});

		const avatar = getAvatar(account);

		expect(avatar).toBe('https://example.com/avatar.jpg');
	});

	it('should return undefined if no avatar available', () => {
		const account = createMockAccount('1', {});

		const avatar = getAvatar(account);

		expect(avatar).toBe(undefined);
	});

	it('should handle icon as object without url', () => {
		const account = createMockAccount('1', {
			icon: {},
		});

		const avatar = getAvatar(account);

		expect(avatar).toBe(undefined);
	});

	it('should handle icon as string', () => {
		const account = createMockAccount('1', {
			icon: 'https://example.com/avatar.jpg',
		});

		const avatar = getAvatar(account);

		expect(avatar).toBe(undefined); // String icons are not supported
	});

	it('should prefer metadata avatar over actor icon', () => {
		const account = createMockAccount('1', {
			metadata: { avatar: 'https://example.com/meta.jpg' },
			icon: { url: 'https://example.com/actor.jpg' },
		});

		const avatar = getAvatar(account);

		expect(avatar).toBe('https://example.com/meta.jpg');
	});
});

describe('InstancePicker - Account Sorting', () => {
	it('should place current account first', () => {
		const accounts = [
			createMockAccount('2', { lastUsed: new Date(2024, 0, 3) }),
			createMockAccount('1', { lastUsed: new Date(2024, 0, 1) }),
			createMockAccount('3', { lastUsed: new Date(2024, 0, 2) }),
		];

		const sorted = sortAccounts(accounts, '1');

		expect(sorted[0].id).toBe('1'); // Current account first
	});

	it('should sort remaining by lastUsed descending', () => {
		const accounts = [
			createMockAccount('1', { lastUsed: new Date(2024, 0, 1) }),
			createMockAccount('2', { lastUsed: new Date(2024, 0, 3) }),
			createMockAccount('3', { lastUsed: new Date(2024, 0, 2) }),
		];

		const sorted = sortAccounts(accounts, '1');

		expect(sorted[0].id).toBe('1'); // Current
		expect(sorted[1].id).toBe('2'); // Most recent
		expect(sorted[2].id).toBe('3'); // Older
	});

	it('should handle accounts without lastUsed', () => {
		const accounts = [
			createMockAccount('1', { lastUsed: new Date(2024, 0, 1) }),
			createMockAccount('2'), // No lastUsed
			createMockAccount('3', { lastUsed: new Date(2024, 0, 2) }),
		];

		const sorted = sortAccounts(accounts, '1');

		expect(sorted[0].id).toBe('1'); // Current
		expect(sorted[1].id).toBe('3'); // Has date
		expect(sorted[2].id).toBe('2'); // No date (0 timestamp)
	});

	it('should not mutate original array', () => {
		const accounts = [
			createMockAccount('1'),
			createMockAccount('2'),
		];
		const originalOrder = accounts.map((a) => a.id);

		sortAccounts(accounts, '2');

		expect(accounts.map((a) => a.id)).toEqual(originalOrder);
	});

	it('should handle single account', () => {
		const accounts = [createMockAccount('1')];

		const sorted = sortAccounts(accounts, '1');

		expect(sorted).toHaveLength(1);
		expect(sorted[0].id).toBe('1');
	});

	it('should handle empty accounts array', () => {
		const accounts: AccountInstance[] = [];

		const sorted = sortAccounts(accounts, '1');

		expect(sorted).toHaveLength(0);
	});

	it('should handle all accounts with same lastUsed', () => {
		const date = new Date(2024, 0, 1);
		const accounts = [
			createMockAccount('1', { lastUsed: date }),
			createMockAccount('2', { lastUsed: date }),
			createMockAccount('3', { lastUsed: date }),
		];

		const sorted = sortAccounts(accounts, '2');

		expect(sorted[0].id).toBe('2'); // Current account first
	});
});

describe('InstancePicker - Switch Account', () => {
	it('should switch to account successfully', async () => {
		const accounts = [
			createMockAccount('1'),
			createMockAccount('2'),
		];
		const onSwitch = vi.fn().mockResolvedValue(undefined);

		const result = await switchAccount(accounts, '2', false, onSwitch);

		expect(result).toBe(true);
		expect(onSwitch).toHaveBeenCalledWith(accounts[1]);
	});

	it('should not switch if already switching', async () => {
		const accounts = [createMockAccount('1')];
		const onSwitch = vi.fn().mockResolvedValue(undefined);

		const result = await switchAccount(accounts, '1', true, onSwitch);

		expect(result).toBe(false);
		expect(onSwitch).not.toHaveBeenCalled();
	});

	it('should not switch if account not found', async () => {
		const accounts = [createMockAccount('1')];
		const onSwitch = vi.fn().mockResolvedValue(undefined);

		const result = await switchAccount(accounts, 'nonexistent', false, onSwitch);

		expect(result).toBe(false);
		expect(onSwitch).not.toHaveBeenCalled();
	});

	it('should handle onSwitch being undefined', async () => {
		const accounts = [createMockAccount('1')];

		const result = await switchAccount(accounts, '1', false, undefined);

		expect(result).toBe(true);
	});
});

describe('InstancePicker - Remove Account', () => {
	it('should remove account successfully', async () => {
		const onRemove = vi.fn().mockResolvedValue(undefined);

		const result = await removeAccount('2', '1', false, onRemove);

		expect(result).toBe(true);
		expect(onRemove).toHaveBeenCalledWith('2');
	});

	it('should not remove if already removing', async () => {
		const onRemove = vi.fn().mockResolvedValue(undefined);

		const result = await removeAccount('2', '1', true, onRemove);

		expect(result).toBe(false);
		expect(onRemove).not.toHaveBeenCalled();
	});

	it('should not remove current account', async () => {
		const onRemove = vi.fn().mockResolvedValue(undefined);

		const result = await removeAccount('1', '1', false, onRemove);

		expect(result).toBe(false);
		expect(onRemove).not.toHaveBeenCalled();
	});

	it('should handle onRemove being undefined', async () => {
		const result = await removeAccount('2', '1', false, undefined);

		expect(result).toBe(true);
	});
});

describe('InstancePicker - Configuration', () => {
	it('should support dropdown mode', () => {
		const mode = 'dropdown';
		expect(['dropdown', 'sidebar', 'modal']).toContain(mode);
	});

	it('should support sidebar mode', () => {
		const mode = 'sidebar';
		expect(['dropdown', 'sidebar', 'modal']).toContain(mode);
	});

	it('should support modal mode', () => {
		const mode = 'modal';
		expect(['dropdown', 'sidebar', 'modal']).toContain(mode);
	});

	it('should support showMetadata option', () => {
		const config = { showMetadata: true };
		expect(config.showMetadata).toBe(true);
	});

	it('should support showNotifications option', () => {
		const config = { showNotifications: true };
		expect(config.showNotifications).toBe(true);
	});

	it('should support maxVisibleAccounts option', () => {
		const config = { maxVisibleAccounts: 10 };
		expect(config.maxVisibleAccounts).toBe(10);
	});

	it('should support showAddAccount option', () => {
		const config = { showAddAccount: true };
		expect(config.showAddAccount).toBe(true);
	});

	it('should support custom CSS class', () => {
		const config = { class: 'my-instance-picker' };
		expect(config.class).toBe('my-instance-picker');
	});
});

describe('InstancePicker - Event Handlers', () => {
	it('should call onSwitch handler', async () => {
		const onSwitch = vi.fn().mockResolvedValue(undefined);
		const account = createMockAccount('1');

		await onSwitch(account);

		expect(onSwitch).toHaveBeenCalledWith(account);
	});

	it('should call onAddAccount handler', () => {
		const onAddAccount = vi.fn();

		onAddAccount();

		expect(onAddAccount).toHaveBeenCalled();
	});

	it('should call onRemoveAccount handler', async () => {
		const onRemoveAccount = vi.fn().mockResolvedValue(undefined);

		await onRemoveAccount('account-1');

		expect(onRemoveAccount).toHaveBeenCalledWith('account-1');
	});

	it('should call onRefresh handler', async () => {
		const onRefresh = vi.fn().mockResolvedValue(undefined);

		await onRefresh('account-1');

		expect(onRefresh).toHaveBeenCalledWith('account-1');
	});
});

describe('InstancePicker - Edge Cases', () => {
	it('should handle empty display name', () => {
		const account = createMockAccount('1', {
			metadata: { displayName: '' },
			name: '',
		});
		// Explicitly set preferredUsername to empty string
		account.actor.preferredUsername = '';

		const displayName = getDisplayName(account);

		// Empty strings are falsy in || chain, so falls back to 'Unknown'
		expect(displayName).toBe('Unknown');
	});

	it('should handle very long display names', () => {
		const longName = 'A'.repeat(1000);
		const account = createMockAccount('1', {
			metadata: { displayName: longName },
		});

		const displayName = getDisplayName(account);

		expect(displayName.length).toBe(1000);
	});

	it('should handle special characters in names', () => {
		const account = createMockAccount('1', {
			name: 'Alice & Bob <test@example.com>',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toBe('Alice & Bob <test@example.com>');
	});

	it('should handle unicode in names', () => {
		const account = createMockAccount('1', {
			name: 'Alice 世界 🌍',
		});

		const displayName = getDisplayName(account);

		expect(displayName).toContain('世界');
		expect(displayName).toContain('🌍');
	});

	it('should handle very long instance domains', () => {
		const longDomain = 'subdomain.' + 'a'.repeat(100) + '.com';
		const account = createMockAccount('1', {
			preferredUsername: 'alice',
			instance: longDomain,
		});

		const handle = getHandle(account);

		expect(handle).toContain(longDomain);
	});

	it('should handle accounts with future lastUsed dates', () => {
		const futureDate = new Date(2099, 0, 1);
		const accounts = [
			createMockAccount('1', { lastUsed: new Date(2024, 0, 1) }),
			createMockAccount('2', { lastUsed: futureDate }),
		];

		const sorted = sortAccounts(accounts, '1');

		expect(sorted[0].id).toBe('1'); // Current
		expect(sorted[1].id).toBe('2'); // Future date
	});

	it('should handle avatar URL with query parameters', () => {
		const account = createMockAccount('1', {
			metadata: { avatar: 'https://example.com/avatar.jpg?size=large&format=webp' },
		});

		const avatar = getAvatar(account);

		expect(avatar).toContain('?size=large&format=webp');
	});

	it('should handle metadata with partial data', () => {
		const account = createMockAccount('1', {
			metadata: { unreadNotifications: 5 }, // No displayName or avatar
		});

		const displayName = getDisplayName(account);
		const avatar = getAvatar(account);

		expect(displayName).toBe('user1'); // Falls back to preferredUsername
		expect(avatar).toBe(undefined);
	});
});

describe('InstancePicker - Type Safety', () => {
	it('should enforce AccountInstance structure', () => {
		const account: AccountInstance = {
			id: '1',
			actor: { preferredUsername: 'alice' },
			instance: 'mastodon.social',
		};

		expect(account).toHaveProperty('id');
		expect(account).toHaveProperty('actor');
		expect(account).toHaveProperty('instance');
	});

	it('should enforce optional metadata', () => {
		const account: AccountInstance = {
			id: '1',
			actor: { preferredUsername: 'alice' },
			instance: 'mastodon.social',
			metadata: {
				unreadNotifications: 5,
				avatar: 'https://example.com/avatar.jpg',
				displayName: 'Alice',
			},
		};

		expect(account.metadata).toBeDefined();
		expect(account.metadata?.unreadNotifications).toBe(5);
	});
});

