/**
 * Admin.Overview Component Tests
 * 
 * Tests for admin overview dashboard logic including:
 * - Stats display logic
 * - Card state determination
 * - Warning detection
 * - Loading state handling
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

// Check if should show warning for pending reports
function shouldShowReportsWarning(pendingReports: number, threshold: number = 5): boolean {
	return pendingReports >= threshold;
}

// Check if should show loading
function shouldShowLoading(loading: boolean, stats: AdminStats | null): boolean {
	return loading && stats === null;
}

// Check if should show stats
function shouldShowStats(stats: AdminStats | null): boolean {
	return stats !== null;
}

// Get card variant
function getCardVariant(
	cardType: 'users' | 'posts' | 'reports' | 'domains' | 'storage',
	stats: AdminStats
): 'default' | 'warning' {
	if (cardType === 'reports' && stats.pendingReports > 0) {
		return 'warning';
	}
	return 'default';
}

// Calculate stats summary
function getStatsSummary(stats: AdminStats): {
	totalItems: number;
	criticalCount: number;
	hasWarnings: boolean;
} {
	return {
		totalItems: stats.totalUsers + stats.totalPosts,
		criticalCount: stats.pendingReports,
		hasWarnings: stats.pendingReports > 0,
	};
}

// Get comparison status
function getComparisonStatus(current: number, previous: number): 'up' | 'down' | 'same' {
	if (current > previous) return 'up';
	if (current < previous) return 'down';
	return 'same';
}

// Calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

// Get trend icon
function getTrendIcon(status: 'up' | 'down' | 'same'): string {
	const icons = {
		up: '↑',
		down: '↓',
		same: '→',
	};
	return icons[status];
}

// Check if stat is critical
function isStatCritical(value: number, type: 'reports' | 'domains'): boolean {
	const thresholds = {
		reports: 10,
		domains: 100,
	};
	return value >= thresholds[type];
}

// Format stat for display
function formatStatDisplay(
	value: number,
	type: 'count' | 'storage' | 'percentage'
): string {
	switch (type) {
		case 'count':
			return value.toString();
		case 'percentage':
			return `${value}%`;
		case 'storage':
			return `${value} GB`;
		default:
			return value.toString();
	}
}

// Get card class
function getCardClass(variant: 'default' | 'warning'): string {
	return variant === 'warning' ? 'admin-overview__card--warning' : '';
}

// Check if stats are empty
function areStatsEmpty(stats: AdminStats): boolean {
	return (
		stats.totalUsers === 0 &&
		stats.activeUsers === 0 &&
		stats.totalPosts === 0 &&
		stats.pendingReports === 0 &&
		stats.blockedDomains === 0
	);
}

// Count total entities
function countTotalEntities(stats: AdminStats): number {
	return stats.totalUsers + stats.totalPosts + stats.blockedDomains;
}

// Get most important metric
function getMostImportantMetric(stats: AdminStats): 'reports' | 'users' | 'posts' {
	if (stats.pendingReports > 5) return 'reports';
	if (stats.totalUsers > stats.totalPosts) return 'users';
	return 'posts';
}

describe('Admin.Overview - Loading State', () => {
	it('shows loading when loading and no stats', () => {
		expect(shouldShowLoading(true, null)).toBe(true);
	});

	it('hides loading when not loading', () => {
		expect(shouldShowLoading(false, null)).toBe(false);
	});

	it('hides loading when has stats', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 500,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '10 GB',
		};
		expect(shouldShowLoading(true, stats)).toBe(false);
	});
});

describe('Admin.Overview - Stats Display', () => {
	it('shows stats when available', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 500,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '10 GB',
		};
		expect(shouldShowStats(stats)).toBe(true);
	});

	it('hides stats when null', () => {
		expect(shouldShowStats(null)).toBe(false);
	});
});

describe('Admin.Overview - Warning Detection', () => {
	it('shows warning for high pending reports', () => {
		expect(shouldShowReportsWarning(10, 5)).toBe(true);
	});

	it('shows warning at threshold', () => {
		expect(shouldShowReportsWarning(5, 5)).toBe(true);
	});

	it('hides warning below threshold', () => {
		expect(shouldShowReportsWarning(4, 5)).toBe(false);
	});

	it('uses default threshold', () => {
		expect(shouldShowReportsWarning(5)).toBe(true);
		expect(shouldShowReportsWarning(4)).toBe(false);
	});
});

describe('Admin.Overview - Card Variants', () => {
	const stats: AdminStats = {
		totalUsers: 100,
		activeUsers: 50,
		totalPosts: 500,
		pendingReports: 8,
		blockedDomains: 2,
		storageUsed: '10 GB',
	};

	it('returns warning for reports card with pending reports', () => {
		expect(getCardVariant('reports', stats)).toBe('warning');
	});

	it('returns default for other cards', () => {
		expect(getCardVariant('users', stats)).toBe('default');
		expect(getCardVariant('posts', stats)).toBe('default');
		expect(getCardVariant('domains', stats)).toBe('default');
		expect(getCardVariant('storage', stats)).toBe('default');
	});

	it('returns default for reports with no pending', () => {
		const noReports = { ...stats, pendingReports: 0 };
		expect(getCardVariant('reports', noReports)).toBe('default');
	});
});

describe('Admin.Overview - Stats Summary', () => {
	const stats: AdminStats = {
		totalUsers: 1000,
		activeUsers: 500,
		totalPosts: 5000,
		pendingReports: 8,
		blockedDomains: 2,
		storageUsed: '50 GB',
	};

	it('calculates total items', () => {
		const summary = getStatsSummary(stats);
		expect(summary.totalItems).toBe(6000);
	});

	it('identifies critical count', () => {
		const summary = getStatsSummary(stats);
		expect(summary.criticalCount).toBe(8);
	});

	it('detects warnings', () => {
		const summary = getStatsSummary(stats);
		expect(summary.hasWarnings).toBe(true);
	});

	it('detects no warnings', () => {
		const noWarnings = { ...stats, pendingReports: 0 };
		const summary = getStatsSummary(noWarnings);
		expect(summary.hasWarnings).toBe(false);
	});
});

describe('Admin.Overview - Comparison', () => {
	it('detects upward trend', () => {
		expect(getComparisonStatus(150, 100)).toBe('up');
	});

	it('detects downward trend', () => {
		expect(getComparisonStatus(80, 100)).toBe('down');
	});

	it('detects same', () => {
		expect(getComparisonStatus(100, 100)).toBe('same');
	});

	it('gets trend icons', () => {
		expect(getTrendIcon('up')).toBe('↑');
		expect(getTrendIcon('down')).toBe('↓');
		expect(getTrendIcon('same')).toBe('→');
	});
});

describe('Admin.Overview - Percentage Change', () => {
	it('calculates positive change', () => {
		expect(calculatePercentageChange(150, 100)).toBe(50);
	});

	it('calculates negative change', () => {
		expect(calculatePercentageChange(75, 100)).toBe(-25);
	});

	it('handles zero previous', () => {
		expect(calculatePercentageChange(100, 0)).toBe(100);
	});

	it('handles zero current', () => {
		expect(calculatePercentageChange(0, 100)).toBe(-100);
	});

	it('rounds to integer', () => {
		expect(calculatePercentageChange(105, 100)).toBe(5);
	});
});

describe('Admin.Overview - Critical Status', () => {
	it('detects critical reports', () => {
		expect(isStatCritical(15, 'reports')).toBe(true);
		expect(isStatCritical(5, 'reports')).toBe(false);
	});

	it('detects critical domains', () => {
		expect(isStatCritical(150, 'domains')).toBe(true);
		expect(isStatCritical(50, 'domains')).toBe(false);
	});

	it('uses correct thresholds', () => {
		expect(isStatCritical(10, 'reports')).toBe(true);
		expect(isStatCritical(100, 'domains')).toBe(true);
	});
});

describe('Admin.Overview - Stat Formatting', () => {
	it('formats count', () => {
		expect(formatStatDisplay(100, 'count')).toBe('100');
	});

	it('formats percentage', () => {
		expect(formatStatDisplay(75, 'percentage')).toBe('75%');
	});

	it('formats storage', () => {
		expect(formatStatDisplay(50, 'storage')).toBe('50 GB');
	});
});

describe('Admin.Overview - Card Classes', () => {
	it('returns warning class', () => {
		expect(getCardClass('warning')).toBe('admin-overview__card--warning');
	});

	it('returns empty for default', () => {
		expect(getCardClass('default')).toBe('');
	});
});

describe('Admin.Overview - Empty Stats', () => {
	it('detects empty stats', () => {
		const empty: AdminStats = {
			totalUsers: 0,
			activeUsers: 0,
			totalPosts: 0,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '0 B',
		};
		expect(areStatsEmpty(empty)).toBe(true);
	});

	it('detects non-empty stats', () => {
		const notEmpty: AdminStats = {
			totalUsers: 1,
			activeUsers: 0,
			totalPosts: 0,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '0 B',
		};
		expect(areStatsEmpty(notEmpty)).toBe(false);
	});
});

describe('Admin.Overview - Entity Counting', () => {
	const stats: AdminStats = {
		totalUsers: 100,
		activeUsers: 50,
		totalPosts: 500,
		pendingReports: 8,
		blockedDomains: 2,
		storageUsed: '10 GB',
	};

	it('counts total entities', () => {
		expect(countTotalEntities(stats)).toBe(602);
	});

	it('handles zero entities', () => {
		const empty: AdminStats = {
			totalUsers: 0,
			activeUsers: 0,
			totalPosts: 0,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '0 B',
		};
		expect(countTotalEntities(empty)).toBe(0);
	});
});

describe('Admin.Overview - Most Important Metric', () => {
	it('prioritizes reports when high', () => {
		const stats: AdminStats = {
			totalUsers: 1000,
			activeUsers: 500,
			totalPosts: 5000,
			pendingReports: 10,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(getMostImportantMetric(stats)).toBe('reports');
	});

	it('prioritizes users when more than posts', () => {
		const stats: AdminStats = {
			totalUsers: 5000,
			activeUsers: 500,
			totalPosts: 1000,
			pendingReports: 2,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(getMostImportantMetric(stats)).toBe('users');
	});

	it('defaults to posts', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 500,
			pendingReports: 2,
			blockedDomains: 2,
			storageUsed: '10 GB',
		};
		expect(getMostImportantMetric(stats)).toBe('posts');
	});
});

describe('Admin.Overview - Edge Cases', () => {
	it('handles very large numbers', () => {
		const stats: AdminStats = {
			totalUsers: 999999999,
			activeUsers: 500000000,
			totalPosts: 5000000000,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '999 TB',
		};
		expect(shouldShowStats(stats)).toBe(true);
		expect(countTotalEntities(stats)).toBeGreaterThan(0);
	});

	it('handles negative pending reports gracefully', () => {
		const stats: AdminStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 500,
			pendingReports: -1,
			blockedDomains: 0,
			storageUsed: '10 GB',
		};
		expect(shouldShowReportsWarning(-1, 5)).toBe(false);
	});
});

describe('Admin.Overview - Integration', () => {
	it('processes complete overview display', () => {
		const stats: AdminStats = {
			totalUsers: 1500,
			activeUsers: 750,
			totalPosts: 25000,
			pendingReports: 8,
			blockedDomains: 5,
			storageUsed: '150 GB',
		};

		// Display state
		expect(shouldShowStats(stats)).toBe(true);
		expect(shouldShowLoading(false, stats)).toBe(false);

		// Warning state
		expect(shouldShowReportsWarning(stats.pendingReports)).toBe(true);
		expect(getCardVariant('reports', stats)).toBe('warning');

		// Summary
		const summary = getStatsSummary(stats);
		expect(summary.hasWarnings).toBe(true);
		expect(summary.criticalCount).toBe(8);
		expect(summary.totalItems).toBe(26500);

		// Most important
		expect(getMostImportantMetric(stats)).toBe('reports');
	});

	it('handles healthy dashboard', () => {
		const stats: AdminStats = {
			totalUsers: 1000,
			activeUsers: 800,
			totalPosts: 10000,
			pendingReports: 0,
			blockedDomains: 2,
			storageUsed: '50 GB',
		};

		expect(shouldShowReportsWarning(stats.pendingReports)).toBe(false);
		expect(getCardVariant('reports', stats)).toBe('default');

		const summary = getStatsSummary(stats);
		expect(summary.hasWarnings).toBe(false);

		expect(getMostImportantMetric(stats)).toBe('posts');
	});

	it('handles comparison with trends', () => {
		const current = 1500;
		const previous = 1000;

		const status = getComparisonStatus(current, previous);
		expect(status).toBe('up');

		const change = calculatePercentageChange(current, previous);
		expect(change).toBe(50);

		const icon = getTrendIcon(status);
		expect(icon).toBe('↑');
	});
});

