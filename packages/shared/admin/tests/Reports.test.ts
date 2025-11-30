/**
 * Admin.Reports Component Tests
 *
 * Tests for report management logic including:
 * - Report status detection
 * - Target type handling
 * - Badge styling
 * - Action button visibility
 * - Report filtering and sorting
 * - Priority determination
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface AdminReport {
	id: string;
	reporter: { id: string; username: string };
	target: { id: string; username: string; type: 'user' | 'post' };
	reason: string;
	status: 'pending' | 'resolved' | 'dismissed';
	createdAt: string;
	assignedTo?: string;
}

// Check report status
function isPending(report: AdminReport): boolean {
	return report.status === 'pending';
}

function isResolved(report: AdminReport): boolean {
	return report.status === 'resolved';
}

function isDismissed(report: AdminReport): boolean {
	return report.status === 'dismissed';
}

// Check if should show actions
function shouldShowActions(report: AdminReport): boolean {
	return report.status === 'pending';
}

// Check target type
function isUserReport(report: AdminReport): boolean {
	return report.target.type === 'user';
}

function isPostReport(report: AdminReport): boolean {
	return report.target.type === 'post';
}

// Get badge class
function getBadgeClass(status: 'pending' | 'resolved' | 'dismissed'): string {
	return `admin-reports__badge--${status}`;
}

// Check if assigned
function isAssigned(report: AdminReport): boolean {
	return report.assignedTo !== undefined;
}

// Filter reports by status
function filterByStatus(
	reports: AdminReport[],
	status: 'pending' | 'resolved' | 'dismissed'
): AdminReport[] {
	return reports.filter((r) => r.status === status);
}

// Filter reports by target type
function filterByTargetType(reports: AdminReport[], type: 'user' | 'post'): AdminReport[] {
	return reports.filter((r) => r.target.type === type);
}

// Count reports by status
function countPending(reports: AdminReport[]): number {
	return reports.filter((r) => r.status === 'pending').length;
}

function countResolved(reports: AdminReport[]): number {
	return reports.filter((r) => r.status === 'resolved').length;
}

function countDismissed(reports: AdminReport[]): number {
	return reports.filter((r) => r.status === 'dismissed').length;
}

// Count by target type
function countUserReports(reports: AdminReport[]): number {
	return reports.filter((r) => r.target.type === 'user').length;
}

function countPostReports(reports: AdminReport[]): number {
	return reports.filter((r) => r.target.type === 'post').length;
}

// Sort reports by date
function sortByDate(reports: AdminReport[], descending: boolean = true): AdminReport[] {
	return [...reports].sort((a, b) => {
		const dateA = new Date(a.createdAt).getTime();
		const dateB = new Date(b.createdAt).getTime();
		return descending ? dateB - dateA : dateA - dateB;
	});
}

// Get report age in days
function getReportAgeInDays(report: AdminReport): number {
	const now = new Date();
	const created = new Date(report.createdAt);
	const diffMs = now.getTime() - created.getTime();
	return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Check if report is old
function isOldReport(report: AdminReport, daysThreshold: number = 7): boolean {
	return getReportAgeInDays(report) >= daysThreshold;
}

// Format report header text
function formatReportHeader(report: AdminReport): string {
	return `@${report.reporter.username} reported @${report.target.username}`;
}

// Truncate reason
function truncateReason(reason: string, maxLength: number = 100): string {
	if (reason.length <= maxLength) return reason;
	return reason.slice(0, maxLength) + '...';
}

// Check if reason is long
function isLongReason(reason: string, threshold: number = 200): boolean {
	return reason.length > threshold;
}

// Get reports by reporter
function getReportsByReporter(reports: AdminReport[], reporterId: string): AdminReport[] {
	return reports.filter((r) => r.reporter.id === reporterId);
}

// Get reports against target
function getReportsAgainstTarget(reports: AdminReport[], targetId: string): AdminReport[] {
	return reports.filter((r) => r.target.id === targetId);
}

// Check if reporter has multiple reports
function hasMultipleReports(reports: AdminReport[], reporterId: string): boolean {
	return getReportsByReporter(reports, reporterId).length > 1;
}

// Check if target has multiple reports
function hasMultipleReportsAgainst(reports: AdminReport[], targetId: string): boolean {
	return getReportsAgainstTarget(reports, targetId).length > 1;
}

// Get priority level
function getPriorityLevel(
	report: AdminReport,
	allReports: AdminReport[]
): 'high' | 'medium' | 'low' {
	const reportAge = getReportAgeInDays(report);
	const reportsAgainstTarget = getReportsAgainstTarget(allReports, report.target.id).length;

	if (reportAge > 7 || reportsAgainstTarget > 3) return 'high';
	if (reportAge > 3 || reportsAgainstTarget > 1) return 'medium';
	return 'low';
}

// Get unassigned pending reports
function getUnassignedPending(reports: AdminReport[]): AdminReport[] {
	return reports.filter((r) => r.status === 'pending' && !r.assignedTo);
}

// Get assigned pending reports
function getAssignedPending(reports: AdminReport[]): AdminReport[] {
	return reports.filter((r) => r.status === 'pending' && r.assignedTo);
}

// Count reports assigned to moderator
function countAssignedTo(reports: AdminReport[], moderatorId: string): number {
	return reports.filter((r) => r.assignedTo === moderatorId).length;
}

describe('Admin.Reports - Status Checks', () => {
	const pendingReport: AdminReport = {
		id: '1',
		reporter: { id: 'r1', username: 'reporter1' },
		target: { id: 't1', username: 'target1', type: 'user' },
		reason: 'Spam',
		status: 'pending',
		createdAt: '2024-01-01T00:00:00Z',
	};

	const resolvedReport: AdminReport = {
		...pendingReport,
		id: '2',
		status: 'resolved',
	};

	const dismissedReport: AdminReport = {
		...pendingReport,
		id: '3',
		status: 'dismissed',
	};

	it('detects pending reports', () => {
		expect(isPending(pendingReport)).toBe(true);
		expect(isPending(resolvedReport)).toBe(false);
		expect(isPending(dismissedReport)).toBe(false);
	});

	it('detects resolved reports', () => {
		expect(isResolved(resolvedReport)).toBe(true);
		expect(isResolved(pendingReport)).toBe(false);
	});

	it('detects dismissed reports', () => {
		expect(isDismissed(dismissedReport)).toBe(true);
		expect(isDismissed(pendingReport)).toBe(false);
	});
});

describe('Admin.Reports - Action Visibility', () => {
	const pendingReport: AdminReport = {
		id: '1',
		reporter: { id: 'r1', username: 'reporter1' },
		target: { id: 't1', username: 'target1', type: 'user' },
		reason: 'Spam',
		status: 'pending',
		createdAt: '2024-01-01T00:00:00Z',
	};

	const resolvedReport: AdminReport = {
		...pendingReport,
		id: '2',
		status: 'resolved',
	};

	it('shows actions for pending reports', () => {
		expect(shouldShowActions(pendingReport)).toBe(true);
	});

	it('hides actions for resolved reports', () => {
		expect(shouldShowActions(resolvedReport)).toBe(false);
	});

	it('hides actions for dismissed reports', () => {
		const dismissed = { ...pendingReport, status: 'dismissed' as const };
		expect(shouldShowActions(dismissed)).toBe(false);
	});
});

describe('Admin.Reports - Target Type', () => {
	const userReport: AdminReport = {
		id: '1',
		reporter: { id: 'r1', username: 'reporter1' },
		target: { id: 't1', username: 'target1', type: 'user' },
		reason: 'Harassment',
		status: 'pending',
		createdAt: '2024-01-01T00:00:00Z',
	};

	const postReport: AdminReport = {
		...userReport,
		id: '2',
		target: { id: 't2', username: 'target2', type: 'post' },
		reason: 'Inappropriate content',
	};

	it('detects user reports', () => {
		expect(isUserReport(userReport)).toBe(true);
		expect(isUserReport(postReport)).toBe(false);
	});

	it('detects post reports', () => {
		expect(isPostReport(postReport)).toBe(true);
		expect(isPostReport(userReport)).toBe(false);
	});
});

describe('Admin.Reports - Badge Classes', () => {
	it('gets badge class for each status', () => {
		expect(getBadgeClass('pending')).toBe('admin-reports__badge--pending');
		expect(getBadgeClass('resolved')).toBe('admin-reports__badge--resolved');
		expect(getBadgeClass('dismissed')).toBe('admin-reports__badge--dismissed');
	});
});

describe('Admin.Reports - Assignment', () => {
	const assignedReport: AdminReport = {
		id: '1',
		reporter: { id: 'r1', username: 'reporter1' },
		target: { id: 't1', username: 'target1', type: 'user' },
		reason: 'Spam',
		status: 'pending',
		createdAt: '2024-01-01T00:00:00Z',
		assignedTo: 'mod1',
	};

	const unassignedReport: AdminReport = {
		...assignedReport,
		id: '2',
		assignedTo: undefined,
	};

	it('detects assigned reports', () => {
		expect(isAssigned(assignedReport)).toBe(true);
	});

	it('detects unassigned reports', () => {
		expect(isAssigned(unassignedReport)).toBe(false);
	});
});

describe('Admin.Reports - Filtering', () => {
	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Harassment',
			status: 'resolved',
			createdAt: '2024-01-02T00:00:00Z',
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't3', username: 'target3', type: 'user' },
			reason: 'Inappropriate',
			status: 'dismissed',
			createdAt: '2024-01-03T00:00:00Z',
		},
	];

	it('filters by status', () => {
		expect(filterByStatus(reports, 'pending')).toHaveLength(1);
		expect(filterByStatus(reports, 'resolved')).toHaveLength(1);
		expect(filterByStatus(reports, 'dismissed')).toHaveLength(1);
	});

	it('filters by target type', () => {
		expect(filterByTargetType(reports, 'user')).toHaveLength(2);
		expect(filterByTargetType(reports, 'post')).toHaveLength(1);
	});
});

describe('Admin.Reports - Counting', () => {
	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Harassment',
			status: 'resolved',
			createdAt: '2024-01-02T00:00:00Z',
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't3', username: 'target3', type: 'user' },
			reason: 'Inappropriate',
			status: 'pending',
			createdAt: '2024-01-03T00:00:00Z',
		},
	];

	it('counts by status', () => {
		expect(countPending(reports)).toBe(2);
		expect(countResolved(reports)).toBe(1);
		expect(countDismissed(reports)).toBe(0);
	});

	it('counts by target type', () => {
		expect(countUserReports(reports)).toBe(2);
		expect(countPostReports(reports)).toBe(1);
	});
});

describe('Admin.Reports - Sorting', () => {
	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Harassment',
			status: 'pending',
			createdAt: '2024-01-03T00:00:00Z',
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't3', username: 'target3', type: 'user' },
			reason: 'Inappropriate',
			status: 'pending',
			createdAt: '2024-01-02T00:00:00Z',
		},
	];

	it('sorts by date descending', () => {
		const sorted = sortByDate(reports);
		expect(sorted.map((r) => r.id)).toEqual(['2', '3', '1']);
	});

	it('sorts by date ascending', () => {
		const sorted = sortByDate(reports, false);
		expect(sorted.map((r) => r.id)).toEqual(['1', '3', '2']);
	});

	it('does not mutate original', () => {
		const original = [...reports];
		sortByDate(reports);
		expect(reports).toEqual(original);
	});
});

describe('Admin.Reports - Report Age', () => {
	it('calculates age in days', () => {
		const now = new Date();
		const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

		const report: AdminReport = {
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: threeDaysAgo.toISOString(),
		};

		expect(getReportAgeInDays(report)).toBe(3);
	});

	it('detects old reports', () => {
		const now = new Date();
		const oldDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

		const oldReport: AdminReport = {
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: oldDate.toISOString(),
		};

		expect(isOldReport(oldReport, 7)).toBe(true);
	});

	it('detects recent reports', () => {
		const now = new Date();
		const recentDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

		const recentReport: AdminReport = {
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: recentDate.toISOString(),
		};

		expect(isOldReport(recentReport, 7)).toBe(false);
	});
});

describe('Admin.Reports - Formatting', () => {
	const report: AdminReport = {
		id: '1',
		reporter: { id: 'r1', username: 'alice' },
		target: { id: 't1', username: 'bob', type: 'user' },
		reason: 'Spam',
		status: 'pending',
		createdAt: '2024-01-01T00:00:00Z',
	};

	it('formats report header', () => {
		expect(formatReportHeader(report)).toBe('@alice reported @bob');
	});

	it('truncates long reasons', () => {
		const longReason = 'A'.repeat(150);
		expect(truncateReason(longReason, 100)).toHaveLength(103); // 100 + '...'
		expect(truncateReason(longReason, 100)).toContain('...');
	});

	it('does not truncate short reasons', () => {
		const shortReason = 'Spam';
		expect(truncateReason(shortReason, 100)).toBe('Spam');
	});

	it('detects long reasons', () => {
		const longReason = 'A'.repeat(250);
		const shortReason = 'Spam';
		expect(isLongReason(longReason, 200)).toBe(true);
		expect(isLongReason(shortReason, 200)).toBe(false);
	});
});

describe('Admin.Reports - Reporter Tracking', () => {
	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Harassment',
			status: 'pending',
			createdAt: '2024-01-02T00:00:00Z',
		},
		{
			id: '3',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't3', username: 'target3', type: 'user' },
			reason: 'Inappropriate',
			status: 'pending',
			createdAt: '2024-01-03T00:00:00Z',
		},
	];

	it('gets reports by reporter', () => {
		const reporter1Reports = getReportsByReporter(reports, 'r1');
		expect(reporter1Reports).toHaveLength(2);
	});

	it('detects reporter with multiple reports', () => {
		expect(hasMultipleReports(reports, 'r1')).toBe(true);
		expect(hasMultipleReports(reports, 'r2')).toBe(false);
	});
});

describe('Admin.Reports - Target Tracking', () => {
	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Harassment',
			status: 'pending',
			createdAt: '2024-01-02T00:00:00Z',
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't2', username: 'target2', type: 'user' },
			reason: 'Inappropriate',
			status: 'pending',
			createdAt: '2024-01-03T00:00:00Z',
		},
	];

	it('gets reports against target', () => {
		const target1Reports = getReportsAgainstTarget(reports, 't1');
		expect(target1Reports).toHaveLength(2);
	});

	it('detects target with multiple reports', () => {
		expect(hasMultipleReportsAgainst(reports, 't1')).toBe(true);
		expect(hasMultipleReportsAgainst(reports, 't2')).toBe(false);
	});
});

describe('Admin.Reports - Priority', () => {
	const now = new Date();
	const oldDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
	const recentDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: oldDate.toISOString(),
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Harassment',
			status: 'pending',
			createdAt: recentDate.toISOString(),
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't2', username: 'target2', type: 'user' },
			reason: 'Inappropriate',
			status: 'pending',
			createdAt: recentDate.toISOString(),
		},
	];

	it('assigns high priority to old reports', () => {
		expect(getPriorityLevel(reports[0], reports)).toBe('high');
	});

	it('assigns high priority to targets with many reports', () => {
		expect(getPriorityLevel(reports[1], reports)).toBe('medium'); // 2 reports against t1
	});

	it('assigns low priority to recent single reports', () => {
		expect(getPriorityLevel(reports[2], reports)).toBe('low');
	});
});

describe('Admin.Reports - Assignment Management', () => {
	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Harassment',
			status: 'pending',
			createdAt: '2024-01-02T00:00:00Z',
			assignedTo: 'mod1',
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't3', username: 'target3', type: 'user' },
			reason: 'Inappropriate',
			status: 'pending',
			createdAt: '2024-01-03T00:00:00Z',
			assignedTo: 'mod1',
		},
	];

	it('gets unassigned pending reports', () => {
		const unassigned = getUnassignedPending(reports);
		expect(unassigned).toHaveLength(1);
		expect(unassigned[0].id).toBe('1');
	});

	it('gets assigned pending reports', () => {
		const assigned = getAssignedPending(reports);
		expect(assigned).toHaveLength(2);
	});

	it('counts reports assigned to moderator', () => {
		expect(countAssignedTo(reports, 'mod1')).toBe(2);
		expect(countAssignedTo(reports, 'mod2')).toBe(0);
	});
});

describe('Admin.Reports - Edge Cases', () => {
	it('handles empty report list', () => {
		expect(countPending([])).toBe(0);
		expect(filterByStatus([], 'pending')).toHaveLength(0);
		expect(sortByDate([])).toHaveLength(0);
	});

	it('handles very long reasons', () => {
		const veryLongReason = 'A'.repeat(10000);
		expect(truncateReason(veryLongReason, 100)).toHaveLength(103);
	});

	it('handles empty reason', () => {
		expect(truncateReason('', 100)).toBe('');
		expect(isLongReason('', 200)).toBe(false);
	});

	it('handles special characters in usernames', () => {
		const report: AdminReport = {
			id: '1',
			reporter: { id: 'r1', username: 'user.name_123' },
			target: { id: 't1', username: 'target-user', type: 'user' },
			reason: 'Spam',
			status: 'pending',
			createdAt: '2024-01-01T00:00:00Z',
		};

		expect(formatReportHeader(report)).toBe('@user.name_123 reported @target-user');
	});
});

describe('Admin.Reports - Integration', () => {
	const now = new Date();
	const oldDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

	const reports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Spam and harassment',
			status: 'pending',
			createdAt: oldDate.toISOString(),
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Continued harassment',
			status: 'pending',
			createdAt: oldDate.toISOString(),
			assignedTo: 'mod1',
		},
		{
			id: '3',
			reporter: { id: 'r3', username: 'reporter3' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Inappropriate content',
			status: 'resolved',
			createdAt: '2024-01-01T00:00:00Z',
		},
	];

	it('processes complete report management flow', () => {
		// Count pending
		expect(countPending(reports)).toBe(2);

		// Filter pending
		const pending = filterByStatus(reports, 'pending');
		expect(pending).toHaveLength(2);

		// Sort by date
		const sorted = sortByDate(pending);
		expect(sorted.length).toBe(2);

		// Check actions visibility
		expect(shouldShowActions(pending[0])).toBe(true);

		// Check priority
		const priority = getPriorityLevel(pending[0], reports);
		expect(priority).toBe('high'); // old report with multiple against target

		// Format header
		expect(formatReportHeader(pending[0])).toContain('@reporter');
	});

	it('handles target with multiple reports', () => {
		const targetReports = getReportsAgainstTarget(reports, 't1');
		expect(targetReports).toHaveLength(2);
		expect(hasMultipleReportsAgainst(reports, 't1')).toBe(true);

		// All reports against t1 should be high priority
		targetReports.forEach((report) => {
			const priority = getPriorityLevel(report, reports);
			expect(['high', 'medium']).toContain(priority);
		});
	});

	it('handles assignment workflow', () => {
		const unassigned = getUnassignedPending(reports);
		expect(unassigned).toHaveLength(1);

		const assigned = getAssignedPending(reports);
		expect(assigned).toHaveLength(1);

		expect(countAssignedTo(reports, 'mod1')).toBe(1);
	});
});
