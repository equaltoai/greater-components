/**
 * Admin.Federation Component Tests
 * 
 * Tests for federation management logic including:
 * - Instance status filtering
 * - Domain blocking validation
 * - Reason validation
 * - Modal state management
 * - Instance statistics
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface FederatedInstance {
	domain: string;
	softwareName?: string;
	softwareVersion?: string;
	usersCount?: number;
	status: 'allowed' | 'limited' | 'blocked';
	lastSeen?: string;
}

type FilterStatus = 'all' | 'allowed' | 'limited' | 'blocked';

// Filter instances by status
function filterInstances(
	instances: FederatedInstance[],
	status: FilterStatus
): FederatedInstance[] {
	if (status === 'all') return instances;
	return instances.filter((i) => i.status === status);
}

// Check if can block instance
function canBlockInstance(domain: string | null, reason: string): boolean {
	return domain !== null && reason.trim().length > 0;
}

// Check if reason is valid
function isBlockReasonValid(reason: string, minLength: number = 10): boolean {
	return reason.trim().length >= minLength;
}

// Check if instance is blocked
function isBlocked(instance: FederatedInstance): boolean {
	return instance.status === 'blocked';
}

// Check if instance is limited
function isLimited(instance: FederatedInstance): boolean {
	return instance.status === 'limited';
}

// Check if instance is allowed
function isAllowed(instance: FederatedInstance): boolean {
	return instance.status === 'allowed';
}

// Get instance badge class
function getStatusBadgeClass(status: 'allowed' | 'limited' | 'blocked'): string {
	return `admin-federation__badge--${status}`;
}

// Check if should show block button
function shouldShowBlockButton(instance: FederatedInstance): boolean {
	return instance.status !== 'blocked';
}

// Check if should show unblock button
function shouldShowUnblockButton(instance: FederatedInstance): boolean {
	return instance.status === 'blocked';
}

// Count instances by status
function countByStatus(
	instances: FederatedInstance[],
	status: 'allowed' | 'limited' | 'blocked'
): number {
	return instances.filter((i) => i.status === status).length;
}

// Get total users across instances
function getTotalUsers(instances: FederatedInstance[]): number {
	return instances.reduce((sum, i) => sum + (i.usersCount || 0), 0);
}

// Check if has software info
function hasSoftwareInfo(instance: FederatedInstance): boolean {
	return !!instance.softwareName;
}

// Format software display
function formatSoftwareDisplay(instance: FederatedInstance): string {
	if (!instance.softwareName) return 'Unknown';
	if (instance.softwareVersion) {
		return `${instance.softwareName} ${instance.softwareVersion}`;
	}
	return instance.softwareName;
}

// Check if instance was seen recently
function isRecentlySeen(instance: FederatedInstance, daysThreshold: number = 7): boolean {
	if (!instance.lastSeen) return false;

	const now = new Date();
	const lastSeen = new Date(instance.lastSeen);
	const diffDays = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);

	return diffDays <= daysThreshold;
}

// Check if instance is inactive
function isInactive(instance: FederatedInstance, daysThreshold: number = 30): boolean {
	if (!instance.lastSeen) return true;
	return !isRecentlySeen(instance, daysThreshold);
}

// Sort instances by users count
function sortByUsersCount(
	instances: FederatedInstance[],
	descending: boolean = true
): FederatedInstance[] {
	return [...instances].sort((a, b) => {
		const countA = a.usersCount || 0;
		const countB = b.usersCount || 0;
		return descending ? countB - countA : countA - countB;
	});
}

// Sort instances by domain
function sortByDomain(
	instances: FederatedInstance[],
	ascending: boolean = true
): FederatedInstance[] {
	return [...instances].sort((a, b) => {
		return ascending ? a.domain.localeCompare(b.domain) : b.domain.localeCompare(a.domain);
	});
}

// Get largest instances
function getLargestInstances(
	instances: FederatedInstance[],
	limit: number = 10
): FederatedInstance[] {
	return sortByUsersCount(instances).slice(0, limit);
}

// Check if domain is valid
function isValidDomain(domain: string): boolean {
	const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
	return domainRegex.test(domain);
}

// Get filter label
function getFilterLabel(status: FilterStatus): string {
	const labels: Record<FilterStatus, string> = {
		all: 'All',
		allowed: 'Allowed',
		limited: 'Limited',
		blocked: 'Blocked',
	};
	return labels[status];
}

// Check if filter is active
function isFilterActive(currentFilter: FilterStatus, checkFilter: FilterStatus): boolean {
	return currentFilter === checkFilter;
}

// Get action button text
function getActionButtonText(instance: FederatedInstance): string {
	return instance.status === 'blocked' ? 'Unblock' : 'Block';
}

// Get instances with missing info
function getInstancesWithMissingInfo(instances: FederatedInstance[]): FederatedInstance[] {
	return instances.filter((i) => !i.softwareName || !i.lastSeen || i.usersCount === undefined);
}

// Calculate federation statistics
function getFederationStats(instances: FederatedInstance[]): {
	total: number;
	allowed: number;
	limited: number;
	blocked: number;
	totalUsers: number;
	withSoftwareInfo: number;
} {
	return {
		total: instances.length,
		allowed: countByStatus(instances, 'allowed'),
		limited: countByStatus(instances, 'limited'),
		blocked: countByStatus(instances, 'blocked'),
		totalUsers: getTotalUsers(instances),
		withSoftwareInfo: instances.filter((i) => hasSoftwareInfo(i)).length,
	};
}

describe('Admin.Federation - Instance Filtering', () => {
	const instances: FederatedInstance[] = [
		{ domain: 'mastodon.social', status: 'allowed', usersCount: 10000 },
		{ domain: 'spam.example', status: 'blocked', usersCount: 50 },
		{ domain: 'limited.example', status: 'limited', usersCount: 500 },
		{ domain: 'another.social', status: 'allowed', usersCount: 2000 },
	];

	it('shows all instances', () => {
		expect(filterInstances(instances, 'all')).toHaveLength(4);
	});

	it('filters by allowed', () => {
		expect(filterInstances(instances, 'allowed')).toHaveLength(2);
	});

	it('filters by blocked', () => {
		expect(filterInstances(instances, 'blocked')).toHaveLength(1);
	});

	it('filters by limited', () => {
		expect(filterInstances(instances, 'limited')).toHaveLength(1);
	});

	it('returns correct instances', () => {
		const blocked = filterInstances(instances, 'blocked');
		expect(blocked[0].domain).toBe('spam.example');
	});
});

describe('Admin.Federation - Block Validation', () => {
	it('can block with domain and reason', () => {
		expect(canBlockInstance('example.com', 'Spam')).toBe(true);
	});

	it('cannot block without domain', () => {
		expect(canBlockInstance(null, 'Spam')).toBe(false);
	});

	it('cannot block without reason', () => {
		expect(canBlockInstance('example.com', '')).toBe(false);
		expect(canBlockInstance('example.com', '   ')).toBe(false);
	});

	it('validates reason length', () => {
		expect(isBlockReasonValid('Short', 10)).toBe(false);
		expect(isBlockReasonValid('This is a valid reason', 10)).toBe(true);
	});

	it('uses default min length', () => {
		expect(isBlockReasonValid('Spam')).toBe(false);
		expect(isBlockReasonValid('Spam and harassment')).toBe(true);
	});
});

describe('Admin.Federation - Status Checks', () => {
	const allowedInstance: FederatedInstance = {
		domain: 'allowed.example',
		status: 'allowed',
	};

	const blockedInstance: FederatedInstance = {
		domain: 'blocked.example',
		status: 'blocked',
	};

	const limitedInstance: FederatedInstance = {
		domain: 'limited.example',
		status: 'limited',
	};

	it('detects blocked instances', () => {
		expect(isBlocked(blockedInstance)).toBe(true);
		expect(isBlocked(allowedInstance)).toBe(false);
	});

	it('detects limited instances', () => {
		expect(isLimited(limitedInstance)).toBe(true);
		expect(isLimited(allowedInstance)).toBe(false);
	});

	it('detects allowed instances', () => {
		expect(isAllowed(allowedInstance)).toBe(true);
		expect(isAllowed(blockedInstance)).toBe(false);
	});
});

describe('Admin.Federation - Badge Classes', () => {
	it('gets status badge classes', () => {
		expect(getStatusBadgeClass('allowed')).toBe('admin-federation__badge--allowed');
		expect(getStatusBadgeClass('limited')).toBe('admin-federation__badge--limited');
		expect(getStatusBadgeClass('blocked')).toBe('admin-federation__badge--blocked');
	});
});

describe('Admin.Federation - Action Buttons', () => {
	const allowedInstance: FederatedInstance = {
		domain: 'allowed.example',
		status: 'allowed',
	};

	const blockedInstance: FederatedInstance = {
		domain: 'blocked.example',
		status: 'blocked',
	};

	it('shows block button for non-blocked instances', () => {
		expect(shouldShowBlockButton(allowedInstance)).toBe(true);
	});

	it('hides block button for blocked instances', () => {
		expect(shouldShowBlockButton(blockedInstance)).toBe(false);
	});

	it('shows unblock button for blocked instances', () => {
		expect(shouldShowUnblockButton(blockedInstance)).toBe(true);
	});

	it('hides unblock button for allowed instances', () => {
		expect(shouldShowUnblockButton(allowedInstance)).toBe(false);
	});

	it('gets action button text', () => {
		expect(getActionButtonText(allowedInstance)).toBe('Block');
		expect(getActionButtonText(blockedInstance)).toBe('Unblock');
	});
});

describe('Admin.Federation - Instance Counting', () => {
	const instances: FederatedInstance[] = [
		{ domain: 'allowed1.example', status: 'allowed', usersCount: 1000 },
		{ domain: 'allowed2.example', status: 'allowed', usersCount: 2000 },
		{ domain: 'blocked.example', status: 'blocked', usersCount: 50 },
		{ domain: 'limited.example', status: 'limited', usersCount: 500 },
	];

	it('counts by status', () => {
		expect(countByStatus(instances, 'allowed')).toBe(2);
		expect(countByStatus(instances, 'blocked')).toBe(1);
		expect(countByStatus(instances, 'limited')).toBe(1);
	});

	it('gets total users', () => {
		expect(getTotalUsers(instances)).toBe(3550);
	});

	it('handles missing user counts', () => {
		const withMissing = [
			...instances,
			{ domain: 'unknown.example', status: 'allowed' },
		];
		expect(getTotalUsers(withMissing)).toBe(3550);
	});
});

describe('Admin.Federation - Software Info', () => {
	const withSoftware: FederatedInstance = {
		domain: 'mastodon.social',
		status: 'allowed',
		softwareName: 'Mastodon',
		softwareVersion: '4.2.0',
	};

	const withoutVersion: FederatedInstance = {
		domain: 'pixelfed.social',
		status: 'allowed',
		softwareName: 'Pixelfed',
	};

	const withoutSoftware: FederatedInstance = {
		domain: 'unknown.social',
		status: 'allowed',
	};

	it('detects software info', () => {
		expect(hasSoftwareInfo(withSoftware)).toBe(true);
		expect(hasSoftwareInfo(withoutSoftware)).toBe(false);
	});

	it('formats software display with version', () => {
		expect(formatSoftwareDisplay(withSoftware)).toBe('Mastodon 4.2.0');
	});

	it('formats software display without version', () => {
		expect(formatSoftwareDisplay(withoutVersion)).toBe('Pixelfed');
	});

	it('handles missing software info', () => {
		expect(formatSoftwareDisplay(withoutSoftware)).toBe('Unknown');
	});
});

describe('Admin.Federation - Activity Tracking', () => {
	const now = new Date();
	const recentDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
	const oldDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago

	const recentInstance: FederatedInstance = {
		domain: 'recent.example',
		status: 'allowed',
		lastSeen: recentDate.toISOString(),
	};

	const oldInstance: FederatedInstance = {
		domain: 'old.example',
		status: 'allowed',
		lastSeen: oldDate.toISOString(),
	};

	const neverSeenInstance: FederatedInstance = {
		domain: 'never.example',
		status: 'allowed',
	};

	it('detects recently seen instances', () => {
		expect(isRecentlySeen(recentInstance, 7)).toBe(true);
		expect(isRecentlySeen(oldInstance, 7)).toBe(false);
	});

	it('detects inactive instances', () => {
		expect(isInactive(oldInstance, 30)).toBe(true);
		expect(isInactive(recentInstance, 30)).toBe(false);
	});

	it('handles never seen instances', () => {
		expect(isRecentlySeen(neverSeenInstance, 7)).toBe(false);
		expect(isInactive(neverSeenInstance, 30)).toBe(true);
	});
});

describe('Admin.Federation - Sorting', () => {
	const instances: FederatedInstance[] = [
		{ domain: 'charlie.social', status: 'allowed', usersCount: 5000 },
		{ domain: 'alice.social', status: 'allowed', usersCount: 10000 },
		{ domain: 'bob.social', status: 'allowed', usersCount: 2000 },
	];

	it('sorts by users count descending', () => {
		const sorted = sortByUsersCount(instances);
		expect(sorted.map((i) => i.domain)).toEqual([
			'alice.social',
			'charlie.social',
			'bob.social',
		]);
	});

	it('sorts by users count ascending', () => {
		const sorted = sortByUsersCount(instances, false);
		expect(sorted.map((i) => i.domain)).toEqual([
			'bob.social',
			'charlie.social',
			'alice.social',
		]);
	});

	it('sorts by domain ascending', () => {
		const sorted = sortByDomain(instances);
		expect(sorted.map((i) => i.domain)).toEqual([
			'alice.social',
			'bob.social',
			'charlie.social',
		]);
	});

	it('sorts by domain descending', () => {
		const sorted = sortByDomain(instances, false);
		expect(sorted.map((i) => i.domain)).toEqual([
			'charlie.social',
			'bob.social',
			'alice.social',
		]);
	});

	it('does not mutate original', () => {
		const original = [...instances];
		sortByUsersCount(instances);
		expect(instances).toEqual(original);
	});
});

describe('Admin.Federation - Largest Instances', () => {
	const instances: FederatedInstance[] = [
		{ domain: 'small.social', status: 'allowed', usersCount: 100 },
		{ domain: 'large.social', status: 'allowed', usersCount: 10000 },
		{ domain: 'medium.social', status: 'allowed', usersCount: 5000 },
	];

	it('gets largest instances', () => {
		const largest = getLargestInstances(instances, 2);
		expect(largest).toHaveLength(2);
		expect(largest[0].domain).toBe('large.social');
		expect(largest[1].domain).toBe('medium.social');
	});

	it('limits results', () => {
		const largest = getLargestInstances(instances, 1);
		expect(largest).toHaveLength(1);
	});

	it('handles limit greater than array', () => {
		const largest = getLargestInstances(instances, 10);
		expect(largest).toHaveLength(3);
	});
});

describe('Admin.Federation - Domain Validation', () => {
	it('validates valid domains', () => {
		expect(isValidDomain('example.com')).toBe(true);
		expect(isValidDomain('sub.example.com')).toBe(true);
		expect(isValidDomain('mastodon.social')).toBe(true);
	});

	it('invalidates invalid domains', () => {
		expect(isValidDomain('not-a-domain')).toBe(false);
		expect(isValidDomain('example')).toBe(false);
		expect(isValidDomain('@example.com')).toBe(false);
	});

	it('handles edge cases', () => {
		expect(isValidDomain('')).toBe(false);
		expect(isValidDomain('.')).toBe(false);
		expect(isValidDomain('-.com')).toBe(false);
	});
});

describe('Admin.Federation - Filter Labels', () => {
	it('gets filter labels', () => {
		expect(getFilterLabel('all')).toBe('All');
		expect(getFilterLabel('allowed')).toBe('Allowed');
		expect(getFilterLabel('limited')).toBe('Limited');
		expect(getFilterLabel('blocked')).toBe('Blocked');
	});
});

describe('Admin.Federation - Filter State', () => {
	it('detects active filter', () => {
		expect(isFilterActive('all', 'all')).toBe(true);
		expect(isFilterActive('allowed', 'all')).toBe(false);
	});

	it('compares all filters', () => {
		expect(isFilterActive('allowed', 'allowed')).toBe(true);
		expect(isFilterActive('blocked', 'blocked')).toBe(true);
		expect(isFilterActive('limited', 'limited')).toBe(true);
	});
});

describe('Admin.Federation - Missing Info', () => {
	const instances: FederatedInstance[] = [
		{
			domain: 'complete.social',
			status: 'allowed',
			softwareName: 'Mastodon',
			lastSeen: '2024-01-01',
			usersCount: 1000,
		},
		{
			domain: 'partial.social',
			status: 'allowed',
			softwareName: 'Mastodon',
		},
		{
			domain: 'minimal.social',
			status: 'allowed',
		},
	];

	it('finds instances with missing info', () => {
		const missing = getInstancesWithMissingInfo(instances);
		expect(missing).toHaveLength(2);
	});

	it('identifies correct instances', () => {
		const missing = getInstancesWithMissingInfo(instances);
		expect(missing.map((i) => i.domain)).toContain('partial.social');
		expect(missing.map((i) => i.domain)).toContain('minimal.social');
	});
});

describe('Admin.Federation - Statistics', () => {
	const instances: FederatedInstance[] = [
		{
			domain: 'allowed1.social',
			status: 'allowed',
			usersCount: 1000,
			softwareName: 'Mastodon',
		},
		{
			domain: 'allowed2.social',
			status: 'allowed',
			usersCount: 2000,
		},
		{
			domain: 'blocked.social',
			status: 'blocked',
			usersCount: 50,
			softwareName: 'Mastodon',
		},
		{
			domain: 'limited.social',
			status: 'limited',
			usersCount: 500,
		},
	];

	it('calculates complete federation stats', () => {
		const stats = getFederationStats(instances);
		expect(stats.total).toBe(4);
		expect(stats.allowed).toBe(2);
		expect(stats.blocked).toBe(1);
		expect(stats.limited).toBe(1);
		expect(stats.totalUsers).toBe(3550);
		expect(stats.withSoftwareInfo).toBe(2);
	});
});

describe('Admin.Federation - Edge Cases', () => {
	it('handles empty instance list', () => {
		expect(filterInstances([], 'all')).toHaveLength(0);
		expect(countByStatus([], 'allowed')).toBe(0);
		expect(getTotalUsers([])).toBe(0);
	});

	it('handles very large user counts', () => {
		const instances: FederatedInstance[] = [
			{ domain: 'huge.social', status: 'allowed', usersCount: 1000000 },
		];
		expect(getTotalUsers(instances)).toBe(1000000);
	});

	it('handles special characters in domains', () => {
		const instance: FederatedInstance = {
			domain: 'test-domain.co.uk',
			status: 'allowed',
		};
		expect(isValidDomain(instance.domain)).toBe(true);
	});

	it('handles missing last seen gracefully', () => {
		const instance: FederatedInstance = {
			domain: 'test.social',
			status: 'allowed',
		};
		expect(isInactive(instance, 30)).toBe(true);
	});
});

describe('Admin.Federation - Integration', () => {
	const instances: FederatedInstance[] = [
		{
			domain: 'mastodon.social',
			status: 'allowed',
			softwareName: 'Mastodon',
			softwareVersion: '4.2.0',
			usersCount: 10000,
			lastSeen: new Date().toISOString(),
		},
		{
			domain: 'spam.example',
			status: 'blocked',
			usersCount: 50,
			lastSeen: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
		},
		{
			domain: 'limited.example',
			status: 'limited',
			usersCount: 500,
		},
	];

	it('handles complete filter and display flow', () => {
		// Filter allowed instances
		const allowed = filterInstances(instances, 'allowed');
		expect(allowed).toHaveLength(1);

		// Check software info
		expect(hasSoftwareInfo(allowed[0])).toBe(true);
		expect(formatSoftwareDisplay(allowed[0])).toBe('Mastodon 4.2.0');

		// Check action buttons
		expect(shouldShowBlockButton(allowed[0])).toBe(true);
		expect(shouldShowUnblockButton(allowed[0])).toBe(false);
	});

	it('handles block flow', () => {
		const instance = instances[0];
		const domain = instance.domain;
		const reason = 'Spam and abuse';

		// Validate can block
		expect(canBlockInstance(domain, reason)).toBe(true);
		expect(isBlockReasonValid(reason)).toBe(true);

		// Check action available
		expect(shouldShowBlockButton(instance)).toBe(true);

		// Get badge
		expect(getStatusBadgeClass(instance.status)).toBe('admin-federation__badge--allowed');
	});

	it('handles unblock flow', () => {
		const blockedInstance = instances.find((i) => i.status === 'blocked')!;

		// Check can unblock
		expect(shouldShowUnblockButton(blockedInstance)).toBe(true);
		expect(shouldShowBlockButton(blockedInstance)).toBe(false);

		// Get action text
		expect(getActionButtonText(blockedInstance)).toBe('Unblock');
	});

	it('handles statistics and sorting', () => {
		// Get stats
		const stats = getFederationStats(instances);
		expect(stats.total).toBe(3);
		expect(stats.totalUsers).toBe(10550);

		// Sort by users
		const sorted = sortByUsersCount(instances);
		expect(sorted[0].domain).toBe('mastodon.social');

		// Get largest
		const largest = getLargestInstances(instances, 1);
		expect(largest[0].domain).toBe('mastodon.social');
	});
});

