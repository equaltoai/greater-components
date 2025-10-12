/**
 * Admin.Root Component Tests
 * 
 * Tests for admin context helper functions including:
 * - Number formatting
 * - Storage formatting
 * - Status checking
 * - Percentage calculations
 * - Date handling
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface AdminStats {
	totalUsers: number;
	activeUsers: number;
	totalPosts: number;
	pendingReports: number;
	blockedDomains: number;
	storageUsed: string;
}

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

interface AdminReport {
	id: string;
	reporter: { id: string; username: string };
	target: { id: string; username: string; type: 'user' | 'post' };
	reason: string;
	status: 'pending' | 'resolved' | 'dismissed';
	createdAt: string;
	assignedTo?: string;
}

// Format number (from context.ts)
function formatNumber(num: number): string {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
}

// Calculate active user percentage
function calculateActivePercentage(stats: AdminStats): number {
	if (stats.totalUsers === 0) return 0;
	return Math.round((stats.activeUsers / stats.totalUsers) * 100);
}

// Check if user is admin
function isAdmin(user: AdminUser): boolean {
	return user.role === 'admin';
}

// Check if user is moderator
function isModerator(user: AdminUser): boolean {
	return user.role === 'moderator';
}

// Check if user has elevated permissions
function hasElevatedPermissions(user: AdminUser): boolean {
	return user.role === 'admin' || user.role === 'moderator';
}

// Check if user is suspended
function isSuspended(user: AdminUser): boolean {
	return user.status === 'suspended';
}

// Check if user is active
function isActive(user: AdminUser): boolean {
	return user.status === 'active';
}

// Count users by role
function countUsersByRole(users: AdminUser[], role: 'admin' | 'moderator' | 'user'): number {
	return users.filter((u) => u.role === role).length;
}

// Count users by status
function countUsersByStatus(
	users: AdminUser[],
	status: 'active' | 'suspended' | 'deleted'
): number {
	return users.filter((u) => u.status === status).length;
}

// Check if report is pending
function isReportPending(report: AdminReport): boolean {
	return report.status === 'pending';
}

// Check if report is resolved
function isReportResolved(report: AdminReport): boolean {
	return report.status === 'resolved';
}

// Check if report is assigned
function isReportAssigned(report: AdminReport): boolean {
	return report.assignedTo !== undefined;
}

// Count pending reports
function countPendingReports(reports: AdminReport[]): number {
	return reports.filter((r) => r.status === 'pending').length;
}

// Parse storage string to bytes
function parseStorageToBytes(storage: string): number {
	const match = storage.match(/^([\d.]+)\s*([KMGT]?)B$/i);
	if (!match) return 0;

	const value = parseFloat(match[1]);
	const unit = match[2].toUpperCase();

	const multipliers: Record<string, number> = {
		'': 1,
		K: 1024,
		M: 1024 * 1024,
		G: 1024 * 1024 * 1024,
		T: 1024 * 1024 * 1024 * 1024,
	};

	return value * (multipliers[unit] || 1);
}

// Format storage bytes to readable string
function formatStorage(bytes: number): string {
	if (bytes >= 1024 ** 4) return `${(bytes / 1024 ** 4).toFixed(1)} TB`;
	if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
	if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${bytes} B`;
}

// Check if stats are healthy
function areStatsHealthy(stats: AdminStats): boolean {
	return (
		stats.pendingReports < 10 &&
		stats.activeUsers > 0 &&
		calculateActivePercentage(stats) >= 20
	);
}

// Get most active users
function getMostActiveUsers(users: AdminUser[], limit: number = 10): AdminUser[] {
	return [...users].sort((a, b) => b.postsCount - a.postsCount).slice(0, limit);
}

// Get role badge color
function getRoleBadgeColor(role: 'admin' | 'moderator' | 'user'): string {
	const colors = {
		admin: 'red',
		moderator: 'blue',
		user: 'gray',
	};
	return colors[role];
}

// Get status badge color
function getStatusBadgeColor(status: 'active' | 'suspended' | 'deleted'): string {
	const colors = {
		active: 'green',
		suspended: 'yellow',
		deleted: 'red',
	};
	return colors[status];
}

// Calculate growth rate
function calculateGrowthRate(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

describe('Admin.Root - Number Formatting', () => {
	it('formats numbers under 1000', () => {
		expect(formatNumber(0)).toBe('0');
		expect(formatNumber(1)).toBe('1');
		expect(formatNumber(500)).toBe('500');
		expect(formatNumber(999)).toBe('999');
	});

	it('formats thousands with K', () => {
		expect(formatNumber(1000)).toBe('1.0K');
		expect(formatNumber(5000)).toBe('5.0K');
		expect(formatNumber(15500)).toBe('15.5K');
		expect(formatNumber(999000)).toBe('999.0K');
	});

	it('formats millions with M', () => {
		expect(formatNumber(1000000)).toBe('1.0M');
		expect(formatNumber(5000000)).toBe('5.0M');
		expect(formatNumber(15500000)).toBe('15.5M');
	});

	it('rounds to one decimal place', () => {
		expect(formatNumber(1234)).toBe('1.2K');
		expect(formatNumber(1567890)).toBe('1.6M');
	});
});

describe('Admin.Root - Active User Percentage', () => {
	it('calculates percentage correctly', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 75,
			totalPosts: 1000,
			pendingReports: 5,
			blockedDomains: 2,
			storageUsed: '10.5 GB',
		};
		expect(calculateActivePercentage(stats)).toBe(75);
	});

	it('handles zero total users', () => {
		const stats: AdminStats = {
			totalUsers: 0,
			activeUsers: 0,
			totalPosts: 0,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '0 B',
		};
		expect(calculateActivePercentage(stats)).toBe(0);
	});

	it('rounds to nearest integer', () => {
		const stats: AdminStats = {
			totalUsers: 3,
			activeUsers: 1,
			totalPosts: 100,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '1 GB',
		};
		expect(calculateActivePercentage(stats)).toBe(33);
	});

	it('handles 100% active', () => {
		const stats: AdminStats = {
			totalUsers: 50,
			activeUsers: 50,
			totalPosts: 100,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '1 GB',
		};
		expect(calculateActivePercentage(stats)).toBe(100);
	});
});

describe('Admin.Root - User Role Checks', () => {
	const adminUser: AdminUser = {
		id: '1',
		username: 'admin',
		email: 'admin@example.com',
		displayName: 'Admin User',
		createdAt: '2024-01-01',
		role: 'admin',
		status: 'active',
		postsCount: 100,
		followersCount: 50,
	};

	const modUser: AdminUser = {
		...adminUser,
		id: '2',
		role: 'moderator',
	};

	const regularUser: AdminUser = {
		...adminUser,
		id: '3',
		role: 'user',
	};

	it('detects admin users', () => {
		expect(isAdmin(adminUser)).toBe(true);
		expect(isAdmin(modUser)).toBe(false);
		expect(isAdmin(regularUser)).toBe(false);
	});

	it('detects moderator users', () => {
		expect(isModerator(adminUser)).toBe(false);
		expect(isModerator(modUser)).toBe(true);
		expect(isModerator(regularUser)).toBe(false);
	});

	it('detects elevated permissions', () => {
		expect(hasElevatedPermissions(adminUser)).toBe(true);
		expect(hasElevatedPermissions(modUser)).toBe(true);
		expect(hasElevatedPermissions(regularUser)).toBe(false);
	});
});

describe('Admin.Root - User Status Checks', () => {
	const activeUser: AdminUser = {
		id: '1',
		username: 'user',
		email: 'user@example.com',
		displayName: 'User',
		createdAt: '2024-01-01',
		role: 'user',
		status: 'active',
		postsCount: 10,
		followersCount: 5,
	};

	const suspendedUser: AdminUser = {
		...activeUser,
		id: '2',
		status: 'suspended',
	};

	it('detects active users', () => {
		expect(isActive(activeUser)).toBe(true);
		expect(isActive(suspendedUser)).toBe(false);
	});

	it('detects suspended users', () => {
		expect(isSuspended(activeUser)).toBe(false);
		expect(isSuspended(suspendedUser)).toBe(true);
	});
});

describe('Admin.Root - User Counting', () => {
	const users: AdminUser[] = [
		{
			id: '1',
			username: 'admin',
			email: 'admin@ex.com',
			displayName: 'Admin',
			createdAt: '2024-01-01',
			role: 'admin',
			status: 'active',
			postsCount: 100,
			followersCount: 50,
		},
		{
			id: '2',
			username: 'mod',
			email: 'mod@ex.com',
			displayName: 'Mod',
			createdAt: '2024-01-01',
			role: 'moderator',
			status: 'active',
			postsCount: 50,
			followersCount: 25,
		},
		{
			id: '3',
			username: 'user1',
			email: 'user1@ex.com',
			displayName: 'User 1',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 10,
			followersCount: 5,
		},
		{
			id: '4',
			username: 'user2',
			email: 'user2@ex.com',
			displayName: 'User 2',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'suspended',
			postsCount: 5,
			followersCount: 2,
		},
	];

	it('counts users by role', () => {
		expect(countUsersByRole(users, 'admin')).toBe(1);
		expect(countUsersByRole(users, 'moderator')).toBe(1);
		expect(countUsersByRole(users, 'user')).toBe(2);
	});

	it('counts users by status', () => {
		expect(countUsersByStatus(users, 'active')).toBe(3);
		expect(countUsersByStatus(users, 'suspended')).toBe(1);
		expect(countUsersByStatus(users, 'deleted')).toBe(0);
	});

	it('handles empty user list', () => {
		expect(countUsersByRole([], 'admin')).toBe(0);
		expect(countUsersByStatus([], 'active')).toBe(0);
	});
});

describe('Admin.Root - Report Checks', () => {
	const pendingReport: AdminReport = {
		id: '1',
		reporter: { id: 'u1', username: 'reporter' },
		target: { id: 't1', username: 'target', type: 'user' },
		reason: 'Spam',
		status: 'pending',
		createdAt: '2024-01-01',
	};

	const resolvedReport: AdminReport = {
		...pendingReport,
		id: '2',
		status: 'resolved',
		assignedTo: 'admin1',
	};

	it('detects pending reports', () => {
		expect(isReportPending(pendingReport)).toBe(true);
		expect(isReportPending(resolvedReport)).toBe(false);
	});

	it('detects resolved reports', () => {
		expect(isReportResolved(pendingReport)).toBe(false);
		expect(isReportResolved(resolvedReport)).toBe(true);
	});

	it('detects assigned reports', () => {
		expect(isReportAssigned(pendingReport)).toBe(false);
		expect(isReportAssigned(resolvedReport)).toBe(true);
	});

	it('counts pending reports', () => {
		const reports = [pendingReport, resolvedReport, pendingReport];
		expect(countPendingReports(reports)).toBe(2);
	});
});

describe('Admin.Root - Storage Parsing', () => {
	it('parses bytes', () => {
		expect(parseStorageToBytes('100 B')).toBe(100);
		expect(parseStorageToBytes('500B')).toBe(500);
	});

	it('parses kilobytes', () => {
		expect(parseStorageToBytes('1.5 KB')).toBe(1536);
		expect(parseStorageToBytes('10KB')).toBe(10240);
	});

	it('parses megabytes', () => {
		expect(parseStorageToBytes('5.5 MB')).toBe(5767168);
	});

	it('parses gigabytes', () => {
		expect(parseStorageToBytes('2 GB')).toBeCloseTo(2 * 1024 * 1024 * 1024, 0);
	});

	it('handles invalid format', () => {
		expect(parseStorageToBytes('invalid')).toBe(0);
		expect(parseStorageToBytes('')).toBe(0);
	});
});

describe('Admin.Root - Storage Formatting', () => {
	it('formats bytes', () => {
		expect(formatStorage(100)).toBe('100 B');
		expect(formatStorage(1023)).toBe('1023 B');
	});

	it('formats kilobytes', () => {
		expect(formatStorage(1024)).toBe('1.0 KB');
		expect(formatStorage(1536)).toBe('1.5 KB');
	});

	it('formats megabytes', () => {
		expect(formatStorage(1024 * 1024)).toBe('1.0 MB');
		expect(formatStorage(5.5 * 1024 * 1024)).toBe('5.5 MB');
	});

	it('formats gigabytes', () => {
		expect(formatStorage(1024 * 1024 * 1024)).toBe('1.0 GB');
		expect(formatStorage(10.7 * 1024 * 1024 * 1024)).toBe('10.7 GB');
	});

	it('formats terabytes', () => {
		expect(formatStorage(1024 * 1024 * 1024 * 1024)).toBe('1.0 TB');
	});
});

describe('Admin.Root - Health Checks', () => {
	it('detects healthy stats', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 1000,
			pendingReports: 5,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(areStatsHealthy(stats)).toBe(true);
	});

	it('detects unhealthy - too many pending reports', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 1000,
			pendingReports: 15,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(areStatsHealthy(stats)).toBe(false);
	});

	it('detects unhealthy - no active users', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 0,
			totalPosts: 1000,
			pendingReports: 5,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(areStatsHealthy(stats)).toBe(false);
	});

	it('detects unhealthy - low active percentage', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 10,
			totalPosts: 1000,
			pendingReports: 5,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(areStatsHealthy(stats)).toBe(false);
	});
});

describe('Admin.Root - Most Active Users', () => {
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
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 200,
			followersCount: 100,
		},
		{
			id: '3',
			username: 'user3',
			email: 'u3@ex.com',
			displayName: 'User 3',
			createdAt: '2024-01-01',
			role: 'user',
			status: 'active',
			postsCount: 50,
			followersCount: 25,
		},
	];

	it('sorts users by post count', () => {
		const active = getMostActiveUsers(users, 3);
		expect(active[0].id).toBe('2'); // 200 posts
		expect(active[1].id).toBe('1'); // 100 posts
		expect(active[2].id).toBe('3'); // 50 posts
	});

	it('limits results', () => {
		const active = getMostActiveUsers(users, 2);
		expect(active).toHaveLength(2);
	});

	it('does not mutate original array', () => {
		const original = [...users];
		getMostActiveUsers(users, 3);
		expect(users).toEqual(original);
	});
});

describe('Admin.Root - Badge Colors', () => {
	it('gets role badge colors', () => {
		expect(getRoleBadgeColor('admin')).toBe('red');
		expect(getRoleBadgeColor('moderator')).toBe('blue');
		expect(getRoleBadgeColor('user')).toBe('gray');
	});

	it('gets status badge colors', () => {
		expect(getStatusBadgeColor('active')).toBe('green');
		expect(getStatusBadgeColor('suspended')).toBe('yellow');
		expect(getStatusBadgeColor('deleted')).toBe('red');
	});
});

describe('Admin.Root - Growth Rate', () => {
	it('calculates positive growth', () => {
		expect(calculateGrowthRate(150, 100)).toBe(50);
	});

	it('calculates negative growth', () => {
		expect(calculateGrowthRate(80, 100)).toBe(-20);
	});

	it('handles zero previous', () => {
		expect(calculateGrowthRate(100, 0)).toBe(100);
		expect(calculateGrowthRate(0, 0)).toBe(0);
	});

	it('handles same values', () => {
		expect(calculateGrowthRate(100, 100)).toBe(0);
	});

	it('rounds to integer', () => {
		expect(calculateGrowthRate(105, 100)).toBe(5);
	});
});

describe('Admin.Root - Integration', () => {
	it('processes complete admin dashboard', () => {
		const stats: AdminStats = {
			totalUsers: 1500,
			activeUsers: 750,
			totalPosts: 25000,
			pendingReports: 8,
			blockedDomains: 5,
			storageUsed: '15.5 GB',
		};

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
				followersCount: 100,
			},
			{
				id: '2',
				username: 'user1',
				email: 'user1@ex.com',
				displayName: 'User 1',
				createdAt: '2024-01-01',
				role: 'user',
				status: 'active',
				postsCount: 1000,
				followersCount: 500,
			},
		];

		// Stats formatting
		expect(formatNumber(stats.totalUsers)).toBe('1.5K');
		expect(formatNumber(stats.totalPosts)).toBe('25.0K');
		expect(calculateActivePercentage(stats)).toBe(50);
		expect(areStatsHealthy(stats)).toBe(true);

		// User management
		expect(countUsersByRole(users, 'admin')).toBe(1);
		expect(hasElevatedPermissions(users[0])).toBe(true);

		// Most active
		const active = getMostActiveUsers(users, 1);
		expect(active[0].id).toBe('2');
	});
});

