import { describe, it, expect } from 'vitest';
import type { ModeratorPermission } from '../../src/types.js';

// Logic for permission checking

// Better permission check based on types
function hasPermission(permissions: ModeratorPermission[], required: ModeratorPermission): boolean {
	if (permissions.includes('all')) return true;
	return permissions.includes(required);
}

describe('Pattern: Permission Checks', () => {
	it('grants access if user has specific permission', () => {
		const userPerms: ModeratorPermission[] = ['posts', 'flair'];
		expect(hasPermission(userPerms, 'posts')).toBe(true);
		expect(hasPermission(userPerms, 'flair')).toBe(true);
	});

	it('denies access if user lacks permission', () => {
		const userPerms: ModeratorPermission[] = ['posts'];
		expect(hasPermission(userPerms, 'config')).toBe(false);
	});

	it('grants access if user has "all" permission', () => {
		const userPerms: ModeratorPermission[] = ['all'];
		expect(hasPermission(userPerms, 'config')).toBe(true);
		expect(hasPermission(userPerms, 'posts')).toBe(true);
	});
});
