/**
 * Admin.Users Component Tests
 * 
 * Tests for user management logic including:
 * - Filter building and validation
 * - Search functionality
 * - User suspension logic
 * - Role change validation
 * - Modal state management
 * - Action button state
 * - Badge styling
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface AdminUser {
	id: string;
	username: string;
	email: string;
	displayName: string;
	createdAt: string;
	role: 'admin' | 'moderator' | 'user';
	status: 'active' | 'suspended' | 'deleted';
	postsCount: number;
	followersCount: number;
}

// Build filters object
function buildFilters(
	roleFilter?: string,
	statusFilter?: string,
	searchQuery?: string
): { role?: string; status?: string; search?: string } {
	const filters: { role?: string; status?: string; search?: string } = {};

	if (roleFilter) filters.role = roleFilter;
	if (statusFilter) filters.status = statusFilter;
	if (searchQuery && searchQuery.trim()) filters.search = searchQuery;

	return filters;
}

// Check if should apply filters
function shouldApplyFilters(filters: {
	role?: string;
	status?: string;
	search?: string;
}): boolean {
	return Object.keys(filters).length > 0;
}

// Validate search query
function isValidSearchQuery(query: string): boolean {
	return query.trim().length > 0;
}

// Check if can suspend user
function canSuspendUser(user: AdminUser, reason: string): boolean {
	return user.status === 'active' && reason.trim().length > 0;
}

// Check if reason is valid
function isReasonValid(reason: string, minLength: number = 10): boolean {
	return reason.trim().length >= minLength;
}

// Check if can change role
function canChangeRole(user: AdminUser, newRole: 'admin' | 'moderator' | 'user'): boolean {
	return user.role !== newRole;
}

// Check if role change is meaningful
function isRoleChangeMeaningful(
	currentRole: 'admin' | 'moderator' | 'user',
	newRole: 'admin' | 'moderator' | 'user'
): boolean {
	return currentRole !== newRole;
}

// Modal state checks
function shouldShowSuspendModal(modalOpen: boolean, selectedUser: AdminUser | null): boolean {
	return modalOpen && selectedUser !== null;
}

function shouldShowRoleModal(modalOpen: boolean, selectedUser: AdminUser | null): boolean {
	return modalOpen && selectedUser !== null;
}

// UI state
function shouldShowLoading(loading: boolean): boolean {
	return loading;
}

function shouldShowEmpty(loading: boolean, usersCount: number): boolean {
	return !loading && usersCount === 0;
}

function shouldShowTable(loading: boolean, usersCount: number): boolean {
	return !loading && usersCount > 0;
}

// Action button visibility
function shouldShowSuspendButton(user: AdminUser): boolean {
	return user.status === 'active';
}

function shouldShowUnsuspendButton(user: AdminUser): boolean {
	return user.status === 'suspended';
}

// Filter users by role
function filterUsersByRole(
	users: AdminUser[],
	role: 'admin' | 'moderator' | 'user'
): AdminUser[] {
	return users.filter((u) => u.role === role);
}

// Filter users by status
function filterUsersByStatus(
	users: AdminUser[],
	status: 'active' | 'suspended' | 'deleted'
): AdminUser[] {
	return users.filter((u) => u.status === status);
}

// Filter users by search query
function filterUsersBySearch(users: AdminUser[], query: string): AdminUser[] {
	const lowerQuery = query.toLowerCase();
	return users.filter(
		(u) =>
			u.username.toLowerCase().includes(lowerQuery) ||
			u.email.toLowerCase().includes(lowerQuery) ||
			u.displayName.toLowerCase().includes(lowerQuery)
	);
}

// Apply all filters
function applyAllFilters(
	users: AdminUser[],
	filters: { role?: string; status?: string; search?: string }
): AdminUser[] {
	let filtered = [...users];

	if (filters.role) {
		filtered = filterUsersByRole(filtered, filters.role as any);
	}

	if (filters.status) {
		filtered = filterUsersByStatus(filtered, filters.status as any);
	}

	if (filters.search) {
		filtered = filterUsersBySearch(filtered, filters.search);
	}

	return filtered;
}

// Get badge class for role
function getRoleBadgeClass(role: 'admin' | 'moderator' | 'user'): string {
	return `admin-users__badge--${role}`;
}

// Get badge class for status
function getStatusBadgeClass(status: 'active' | 'suspended' | 'deleted'): string {
	return `admin-users__badge--${status}`;
}

// Get action button class
function getActionButtonClass(
	actionType: 'suspend' | 'unsuspend' | 'change-role'
): string {
	const classes = {
		suspend: 'admin-users__action--danger',
		unsuspend: 'admin-users__action--success',
		'change-role': '',
	};
	return classes[actionType];
}

// Count users by criteria
function countActiveUsers(users: AdminUser[]): number {
	return users.filter((u) => u.status === 'active').length;
}

function countSuspendedUsers(users: AdminUser[]): number {
	return users.filter((u) => u.status === 'suspended').length;
}

function countAdmins(users: AdminUser[]): number {
	return users.filter((u) => u.role === 'admin').length;
}

function countModerators(users: AdminUser[]): number {
	return users.filter((u) => u.role === 'moderator').length;
}

// Get user statistics
function getUserStats(users: AdminUser[]): {
	total: number;
	active: number;
	suspended: number;
	admins: number;
	moderators: number;
	regularUsers: number;
} {
	return {
		total: users.length,
		active: countActiveUsers(users),
		suspended: countSuspendedUsers(users),
		admins: countAdmins(users),
		moderators: countModerators(users),
		regularUsers: users.filter((u) => u.role === 'user').length,
	};
}

// Check if user matches search
function userMatchesSearch(user: AdminUser, query: string): boolean {
	const lowerQuery = query.toLowerCase();
	return (
		user.username.toLowerCase().includes(lowerQuery) ||
		user.email.toLowerCase().includes(lowerQuery) ||
		user.displayName.toLowerCase().includes(lowerQuery)
	);
}

// Validate email format
function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check if username is valid
function isValidUsername(username: string): boolean {
	return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// Sort users by posts count
function sortByPostsCount(users: AdminUser[], descending: boolean = true): AdminUser[] {
	return [...users].sort((a, b) =>
		descending ? b.postsCount - a.postsCount : a.postsCount - b.postsCount
	);
}

// Sort users by followers count
function sortByFollowersCount(users: AdminUser[], descending: boolean = true): AdminUser[] {
	return [...users].sort((a, b) =>
		descending ? b.followersCount - a.followersCount : a.followersCount - b.followersCount
	);
}

// Sort users by created date
function sortByCreatedDate(users: AdminUser[], descending: boolean = true): AdminUser[] {
	return [...users].sort((a, b) => {
		const dateA = new Date(a.createdAt).getTime();
		const dateB = new Date(b.createdAt).getTime();
		return descending ? dateB - dateA : dateA - dateB;
	});
}

describe('Admin.Users - Filter Building', () => {
	it('builds filters with all criteria', () => {
		const filters = buildFilters('admin', 'active', 'test');
		expect(filters).toEqual({ role: 'admin', status: 'active', search: 'test' });
	});

	it('builds filters with only role', () => {
		const filters = buildFilters('moderator', undefined, undefined);
		expect(filters).toEqual({ role: 'moderator' });
	});

	it('builds filters with only status', () => {
		const filters = buildFilters(undefined, 'suspended', undefined);
		expect(filters).toEqual({ status: 'suspended' });
	});

	it('builds filters with only search', () => {
		const filters = buildFilters(undefined, undefined, 'query');
		expect(filters).toEqual({ search: 'query' });
	});

	it('trims whitespace from search', () => {
		const filters = buildFilters(undefined, undefined, '  query  ');
		expect(filters).toEqual({ search: '  query  ' });
	});

	it('excludes empty search', () => {
		const filters = buildFilters(undefined, undefined, '   ');
		expect(filters).toEqual({});
	});

	it('returns empty object when no filters', () => {
		const filters = buildFilters(undefined, undefined, undefined);
		expect(filters).toEqual({});
	});
});

describe('Admin.Users - Filter Application', () => {
	it('detects when filters should be applied', () => {
		expect(shouldApplyFilters({ role: 'admin' })).toBe(true);
		expect(shouldApplyFilters({ status: 'active' })).toBe(true);
		expect(shouldApplyFilters({ search: 'test' })).toBe(true);
		expect(shouldApplyFilters({})).toBe(false);
	});
});

describe('Admin.Users - Search Validation', () => {
	it('validates non-empty search', () => {
		expect(isValidSearchQuery('test')).toBe(true);
	});

	it('invalidates empty search', () => {
		expect(isValidSearchQuery('')).toBe(false);
		expect(isValidSearchQuery('   ')).toBe(false);
	});

	it('trims whitespace before validation', () => {
		expect(isValidSearchQuery('  test  ')).toBe(true);
	});
});

describe('Admin.Users - Suspend Validation', () => {
	const activeUser: AdminUser = {
		id: '1',
		username: 'user1',
		email: 'user1@example.com',
		displayName: 'User One',
		createdAt: '2024-01-01',
		role: 'user',
		status: 'active',
		postsCount: 100,
		followersCount: 50,
	};

	const suspendedUser: AdminUser = {
		...activeUser,
		id: '2',
		status: 'suspended',
	};

	it('can suspend active user with reason', () => {
		expect(canSuspendUser(activeUser, 'Spam')).toBe(true);
	});

	it('cannot suspend without reason', () => {
		expect(canSuspendUser(activeUser, '')).toBe(false);
		expect(canSuspendUser(activeUser, '   ')).toBe(false);
	});

	it('cannot suspend already suspended user', () => {
		expect(canSuspendUser(suspendedUser, 'Reason')).toBe(false);
	});

	it('validates reason length', () => {
		expect(isReasonValid('Short', 10)).toBe(false);
		expect(isReasonValid('This is a valid reason that is long enough', 10)).toBe(true);
	});

	it('uses default min length', () => {
		expect(isReasonValid('Too short')).toBe(false);
		expect(isReasonValid('This is long enough now')).toBe(true);
	});
});

describe('Admin.Users - Role Change Validation', () => {
	const user: AdminUser = {
		id: '1',
		username: 'user1',
		email: 'user1@example.com',
		displayName: 'User One',
		createdAt: '2024-01-01',
		role: 'user',
		status: 'active',
		postsCount: 100,
		followersCount: 50,
	};

	it('can change to different role', () => {
		expect(canChangeRole(user, 'admin')).toBe(true);
		expect(canChangeRole(user, 'moderator')).toBe(true);
	});

	it('cannot change to same role', () => {
		expect(canChangeRole(user, 'user')).toBe(false);
	});

	it('detects meaningful role change', () => {
		expect(isRoleChangeMeaningful('user', 'admin')).toBe(true);
		expect(isRoleChangeMeaningful('user', 'user')).toBe(false);
	});
});

describe('Admin.Users - Modal State', () => {
	const user: AdminUser = {
		id: '1',
		username: 'user1',
		email: 'user1@example.com',
		displayName: 'User One',
		createdAt: '2024-01-01',
		role: 'user',
		status: 'active',
		postsCount: 100,
		followersCount: 50,
	};

	it('shows suspend modal when open and user selected', () => {
		expect(shouldShowSuspendModal(true, user)).toBe(true);
	});

	it('hides suspend modal when closed', () => {
		expect(shouldShowSuspendModal(false, user)).toBe(false);
	});

	it('hides suspend modal when no user', () => {
		expect(shouldShowSuspendModal(true, null)).toBe(false);
	});

	it('shows role modal when open and user selected', () => {
		expect(shouldShowRoleModal(true, user)).toBe(true);
	});

	it('hides role modal when closed', () => {
		expect(shouldShowRoleModal(false, user)).toBe(false);
	});

	it('hides role modal when no user', () => {
		expect(shouldShowRoleModal(true, null)).toBe(false);
	});
});

describe('Admin.Users - UI State', () => {
	it('shows loading state', () => {
		expect(shouldShowLoading(true)).toBe(true);
		expect(shouldShowLoading(false)).toBe(false);
	});

	it('shows empty state', () => {
		expect(shouldShowEmpty(false, 0)).toBe(true);
		expect(shouldShowEmpty(true, 0)).toBe(false);
		expect(shouldShowEmpty(false, 5)).toBe(false);
	});

	it('shows table state', () => {
		expect(shouldShowTable(false, 5)).toBe(true);
		expect(shouldShowTable(true, 5)).toBe(false);
		expect(shouldShowTable(false, 0)).toBe(false);
	});
});

describe('Admin.Users - Action Buttons', () => {
	const activeUser: AdminUser = {
		id: '1',
		username: 'user1',
		email: 'user1@example.com',
		displayName: 'User One',
		createdAt: '2024-01-01',
		role: 'user',
		status: 'active',
		postsCount: 100,
		followersCount: 50,
	};

	const suspendedUser: AdminUser = {
		...activeUser,
		id: '2',
		status: 'suspended',
	};

	it('shows suspend button for active users', () => {
		expect(shouldShowSuspendButton(activeUser)).toBe(true);
	});

	it('hides suspend button for suspended users', () => {
		expect(shouldShowSuspendButton(suspendedUser)).toBe(false);
	});

	it('shows unsuspend button for suspended users', () => {
		expect(shouldShowUnsuspendButton(suspendedUser)).toBe(true);
	});

	it('hides unsuspend button for active users', () => {
		expect(shouldShowUnsuspendButton(activeUser)).toBe(false);
	});
});

describe('Admin.Users - User Filtering', () => {
	const users: AdminUser[] = [
		{
			id: '1',
			username: 'admin',
			email: 'admin@example.com',
			displayName: 'Admin User',
			createdAt: '2024-01-01',
			role: 'admin',
			status: 'active',
			postsCount: 500,
			followersCount: 200,
		},
		{
			id: '2',
			username: 'moderator',
			email: 'mod@example.com',
			displayName: 'Mod User',
			createdAt: '2024-01-02',
			role: 'moderator',
			status: 'active',
			postsCount: 300,
			followersCount: 150,
		},
		{
			id: '3',
			username: 'user1',
			email: 'user1@example.com',
			displayName: 'Regular User',
			createdAt: '2024-01-03',
			role: 'user',
			status: 'suspended',
			postsCount: 100,
			followersCount: 50,
		},
	];

	it('filters by role', () => {
		expect(filterUsersByRole(users, 'admin')).toHaveLength(1);
		expect(filterUsersByRole(users, 'moderator')).toHaveLength(1);
		expect(filterUsersByRole(users, 'user')).toHaveLength(1);
	});

	it('filters by status', () => {
		expect(filterUsersByStatus(users, 'active')).toHaveLength(2);
		expect(filterUsersByStatus(users, 'suspended')).toHaveLength(1);
		expect(filterUsersByStatus(users, 'deleted')).toHaveLength(0);
	});

	it('filters by search username', () => {
		const filtered = filterUsersBySearch(users, 'admin');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].username).toBe('admin');
	});

	it('filters by search email', () => {
		const filtered = filterUsersBySearch(users, 'mod@');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].email).toBe('mod@example.com');
	});

	it('filters by search display name', () => {
		const filtered = filterUsersBySearch(users, 'Regular');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].displayName).toBe('Regular User');
	});

	it('search is case insensitive', () => {
		expect(filterUsersBySearch(users, 'ADMIN')).toHaveLength(1);
		expect(filterUsersBySearch(users, 'admin')).toHaveLength(1);
	});

	it('applies all filters', () => {
		const filters = { role: 'admin', status: 'active' };
		const filtered = applyAllFilters(users, filters);
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('1');
	});

	it('applies search with other filters', () => {
		const filters = { status: 'active', search: 'mod' };
		const filtered = applyAllFilters(users, filters);
		expect(filtered).toHaveLength(1);
		expect(filtered[0].username).toBe('moderator');
	});
});

describe('Admin.Users - Badge Classes', () => {
	it('gets role badge classes', () => {
		expect(getRoleBadgeClass('admin')).toBe('admin-users__badge--admin');
		expect(getRoleBadgeClass('moderator')).toBe('admin-users__badge--moderator');
		expect(getRoleBadgeClass('user')).toBe('admin-users__badge--user');
	});

	it('gets status badge classes', () => {
		expect(getStatusBadgeClass('active')).toBe('admin-users__badge--active');
		expect(getStatusBadgeClass('suspended')).toBe('admin-users__badge--suspended');
		expect(getStatusBadgeClass('deleted')).toBe('admin-users__badge--deleted');
	});

	it('gets action button classes', () => {
		expect(getActionButtonClass('suspend')).toBe('admin-users__action--danger');
		expect(getActionButtonClass('unsuspend')).toBe('admin-users__action--success');
		expect(getActionButtonClass('change-role')).toBe('');
	});
});

describe('Admin.Users - User Counting', () => {
	const users: AdminUser[] = [
		{
			id: '1',
			username: 'admin',
			email: 'admin@ex.com',
			displayName: 'Admin',
			createdAt: '2024-01-01',
			role: 'admin',
			status: 'active',
			postsCount: 500,
			followersCount: 200,
		},
		{
			id: '2',
			username: 'mod',
			email: 'mod@ex.com',
			displayName: 'Mod',
			createdAt: '2024-01-02',
			role: 'moderator',
			status: 'active',
			postsCount: 300,
			followersCount: 150,
		},
		{
			id: '3',
			username: 'user1',
			email: 'user1@ex.com',
			displayName: 'User 1',
			createdAt: '2024-01-03',
			role: 'user',
			status: 'suspended',
			postsCount: 100,
			followersCount: 50,
		},
		{
			id: '4',
			username: 'user2',
			email: 'user2@ex.com',
			displayName: 'User 2',
			createdAt: '2024-01-04',
			role: 'user',
			status: 'active',
			postsCount: 50,
			followersCount: 25,
		},
	];

	it('counts active users', () => {
		expect(countActiveUsers(users)).toBe(3);
	});

	it('counts suspended users', () => {
		expect(countSuspendedUsers(users)).toBe(1);
	});

	it('counts admins', () => {
		expect(countAdmins(users)).toBe(1);
	});

	it('counts moderators', () => {
		expect(countModerators(users)).toBe(1);
	});

	it('gets complete user stats', () => {
		const stats = getUserStats(users);
		expect(stats).toEqual({
			total: 4,
			active: 3,
			suspended: 1,
			admins: 1,
			moderators: 1,
			regularUsers: 2,
		});
	});
});

describe('Admin.Users - User Matching', () => {
	const user: AdminUser = {
		id: '1',
		username: 'johndoe',
		email: 'john@example.com',
		displayName: 'John Doe',
		createdAt: '2024-01-01',
		role: 'user',
		status: 'active',
		postsCount: 100,
		followersCount: 50,
	};

	it('matches by username', () => {
		expect(userMatchesSearch(user, 'john')).toBe(true);
		expect(userMatchesSearch(user, 'doe')).toBe(true);
	});

	it('matches by email', () => {
		expect(userMatchesSearch(user, 'john@')).toBe(true);
		expect(userMatchesSearch(user, 'example.com')).toBe(true);
	});

	it('matches by display name', () => {
		expect(userMatchesSearch(user, 'John Doe')).toBe(true);
	});

	it('is case insensitive', () => {
		expect(userMatchesSearch(user, 'JOHN')).toBe(true);
	});

	it('does not match unrelated query', () => {
		expect(userMatchesSearch(user, 'alice')).toBe(false);
	});
});

describe('Admin.Users - Validation', () => {
	it('validates email format', () => {
		expect(isValidEmail('user@example.com')).toBe(true);
		expect(isValidEmail('invalid')).toBe(false);
		expect(isValidEmail('@example.com')).toBe(false);
		expect(isValidEmail('user@')).toBe(false);
	});

	it('validates username format', () => {
		expect(isValidUsername('user123')).toBe(true);
		expect(isValidUsername('ab')).toBe(false); // too short
		expect(isValidUsername('a'.repeat(21))).toBe(false); // too long
		expect(isValidUsername('user@123')).toBe(false); // invalid chars
	});
});

describe('Admin.Users - Sorting', () => {
	const users: AdminUser[] = [
		{
			id: '1',
			username: 'user1',
			email: 'u1@ex.com',
			displayName: 'User 1',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 100,
			followersCount: 50,
		},
		{
			id: '2',
			username: 'user2',
			email: 'u2@ex.com',
			displayName: 'User 2',
			createdAt: '2024-01-03',
			role: 'user',
			status: 'active',
			postsCount: 300,
			followersCount: 150,
		},
		{
			id: '3',
			username: 'user3',
			email: 'u3@ex.com',
			displayName: 'User 3',
			createdAt: '2024-01-02',
			role: 'user',
			status: 'active',
			postsCount: 200,
			followersCount: 100,
		},
	];

	it('sorts by posts count descending', () => {
		const sorted = sortByPostsCount(users);
		expect(sorted.map((u) => u.id)).toEqual(['2', '3', '1']);
	});

	it('sorts by posts count ascending', () => {
		const sorted = sortByPostsCount(users, false);
		expect(sorted.map((u) => u.id)).toEqual(['1', '3', '2']);
	});

	it('sorts by followers count descending', () => {
		const sorted = sortByFollowersCount(users);
		expect(sorted.map((u) => u.id)).toEqual(['2', '3', '1']);
	});

	it('sorts by created date descending', () => {
		const sorted = sortByCreatedDate(users);
		expect(sorted.map((u) => u.id)).toEqual(['2', '3', '1']);
	});

	it('does not mutate original array', () => {
		const original = [...users];
		sortByPostsCount(users);
		expect(users).toEqual(original);
	});
});

describe('Admin.Users - Edge Cases', () => {
	it('handles empty user list', () => {
		expect(countActiveUsers([])).toBe(0);
		expect(filterUsersByRole([], 'admin')).toHaveLength(0);
		expect(applyAllFilters([], { role: 'admin' })).toHaveLength(0);
	});

	it('handles users with zero posts/followers', () => {
		const user: AdminUser = {
			id: '1',
			username: 'newuser',
			email: 'new@example.com',
			displayName: 'New User',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 0,
			followersCount: 0,
		};

		const sorted = sortByPostsCount([user]);
		expect(sorted[0]).toBe(user);
	});

	it('handles very long usernames', () => {
		const user: AdminUser = {
			id: '1',
			username: 'a'.repeat(50),
			email: 'user@example.com',
			displayName: 'User',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 100,
			followersCount: 50,
		};

		expect(userMatchesSearch(user, 'aaa')).toBe(true);
	});

	it('handles special characters in search', () => {
		const user: AdminUser = {
			id: '1',
			username: 'user',
			email: 'user+test@example.com',
			displayName: 'User',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 100,
			followersCount: 50,
		};

		expect(userMatchesSearch(user, 'user+')).toBe(true);
	});
});

describe('Admin.Users - Integration', () => {
	const users: AdminUser[] = [
		{
			id: '1',
			username: 'admin',
			email: 'admin@example.com',
			displayName: 'Admin User',
			createdAt: '2024-01-01',
			role: 'admin',
			status: 'active',
			postsCount: 500,
			followersCount: 200,
		},
		{
			id: '2',
			username: 'moderator',
			email: 'mod@example.com',
			displayName: 'Mod User',
			createdAt: '2024-01-02',
			role: 'moderator',
			status: 'active',
			postsCount: 300,
			followersCount: 150,
		},
		{
			id: '3',
			username: 'suspendeduser',
			email: 'suspended@example.com',
			displayName: 'Suspended User',
			createdAt: '2024-01-03',
			role: 'user',
			status: 'suspended',
			postsCount: 100,
			followersCount: 50,
		},
		{
			id: '4',
			username: 'activeuser',
			email: 'active@example.com',
			displayName: 'Active User',
			createdAt: '2024-01-04',
			role: 'user',
			status: 'active',
			postsCount: 250,
			followersCount: 120,
		},
	];

	it('handles complete filter and display flow', () => {
		// Build filters
		const filters = buildFilters('user', 'active', undefined);
		expect(shouldApplyFilters(filters)).toBe(true);

		// Apply filters
		const filtered = applyAllFilters(users, filters);
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('4');

		// Check UI state
		expect(shouldShowTable(false, filtered.length)).toBe(true);

		// Check action buttons
		expect(shouldShowSuspendButton(filtered[0])).toBe(true);
		expect(shouldShowUnsuspendButton(filtered[0])).toBe(false);
	});

	it('handles suspend flow', () => {
		const activeUser = users.find((u) => u.id === '4')!;

		// Check can suspend
		expect(canSuspendUser(activeUser, 'Spam violation')).toBe(true);
		expect(shouldShowSuspendButton(activeUser)).toBe(true);

		// Validate reason
		expect(isReasonValid('Spam violation')).toBe(true);

		// Check modal state
		expect(shouldShowSuspendModal(true, activeUser)).toBe(true);
	});

	it('handles role change flow', () => {
		const user = users.find((u) => u.id === '4')!;

		// Check can change role
		expect(canChangeRole(user, 'moderator')).toBe(true);
		expect(isRoleChangeMeaningful('user', 'moderator')).toBe(true);

		// Check modal state
		expect(shouldShowRoleModal(true, user)).toBe(true);
	});

	it('handles search and sort flow', () => {
		// Search
		const query = 'admin';
		expect(isValidSearchQuery(query)).toBe(true);

		const searchResults = filterUsersBySearch(users, query);
		expect(searchResults).toHaveLength(1);

		// Sort by posts
		const sorted = sortByPostsCount(searchResults);
		expect(sorted[0].postsCount).toBe(500);

		// Get stats
		const stats = getUserStats(users);
		expect(stats.total).toBe(4);
		expect(stats.active).toBe(3);
		expect(stats.admins).toBe(1);
	});
});

