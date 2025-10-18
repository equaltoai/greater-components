/**
 * Admin.Logs Component Tests
 * 
 * Tests for system logs viewer logic including:
 * - Log filtering (level, category, search)
 * - Auto-refresh functionality
 * - Category extraction
 * - Timestamp formatting
 * - Badge and entry styling
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface LogEntry {
	id: string;
	level: 'info' | 'warn' | 'error';
	category: string;
	message: string;
	timestamp: string;
	metadata?: Record<string, unknown>;
}

// Filter logs by level
function filterByLevel(logs: LogEntry[], level?: string): LogEntry[] {
	if (!level) return logs;
	return logs.filter((log) => log.level === level);
}

// Filter logs by category
function filterByCategory(logs: LogEntry[], category?: string): LogEntry[] {
	if (!category) return logs;
	return logs.filter((log) => log.category === category);
}

// Filter logs by search query
function filterBySearch(logs: LogEntry[], query: string): LogEntry[] {
	if (!query) return logs;
	const lowerQuery = query.toLowerCase();
	return logs.filter((log) => log.message.toLowerCase().includes(lowerQuery));
}

// Apply all filters
function applyAllFilters(
	logs: LogEntry[],
	level?: string,
	category?: string,
	search?: string
): LogEntry[] {
	let filtered = [...logs];

	filtered = filterByLevel(filtered, level);
	filtered = filterByCategory(filtered, category);
	if (search) filtered = filterBySearch(filtered, search);

	return filtered;
}

// Extract unique categories
function extractCategories(logs: LogEntry[]): string[] {
	return Array.from(new Set(logs.map((log) => log.category)));
}

// Format timestamp
function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp);
	return date.toLocaleString();
}

// Get badge class
function getBadgeClass(level: 'info' | 'warn' | 'error'): string {
	return `admin-logs__badge--${level}`;
}

// Get entry class
function getEntryClass(level: 'info' | 'warn' | 'error'): string {
	return `admin-logs__entry--${level}`;
}

// Check if has metadata
function hasMetadata(log: LogEntry): boolean {
	return log.metadata !== undefined && Object.keys(log.metadata).length > 0;
}

// Count logs by level
function countByLevel(logs: LogEntry[], level: 'info' | 'warn' | 'error'): number {
	return logs.filter((log) => log.level === level).length;
}

// Count logs by category
function countByCategory(logs: LogEntry[], category: string): number {
	return logs.filter((log) => log.category === category).length;
}

// Get error logs
function getErrorLogs(logs: LogEntry[]): LogEntry[] {
	return logs.filter((log) => log.level === 'error');
}

// Get warning logs
function getWarningLogs(logs: LogEntry[]): LogEntry[] {
	return logs.filter((log) => log.level === 'warn');
}

// Check if should show empty state
function shouldShowEmptyState(filteredLogs: LogEntry[], loading: boolean): boolean {
	return !loading && filteredLogs.length === 0;
}

// Check auto-refresh state
function isAutoRefreshActive(autoRefresh: boolean): boolean {
	return autoRefresh;
}

// Get refresh interval in milliseconds
function getRefreshInterval(): number {
	return 5000;
}

// Sort logs by timestamp
function sortByTimestamp(logs: LogEntry[], descending: boolean = true): LogEntry[] {
	return [...logs].sort((a, b) => {
		const timeA = new Date(a.timestamp).getTime();
		const timeB = new Date(b.timestamp).getTime();
		return descending ? timeB - timeA : timeA - timeB;
	});
}

// Get recent logs
function getRecentLogs(logs: LogEntry[], limit: number = 100): LogEntry[] {
	const sorted = sortByTimestamp(logs, true);
	return sorted.slice(0, limit);
}

// Check if log is recent
function isRecentLog(log: LogEntry, minutesThreshold: number = 5): boolean {
	const now = new Date();
	const logTime = new Date(log.timestamp);
	const diffMinutes = (now.getTime() - logTime.getTime()) / (1000 * 60);
	return diffMinutes <= minutesThreshold;
}

// Get logs in time range
function getLogsInRange(
	logs: LogEntry[],
	start: string,
	end: string
): LogEntry[] {
	const startTime = new Date(start).getTime();
	const endTime = new Date(end).getTime();

	return logs.filter((log) => {
		const logTime = new Date(log.timestamp).getTime();
		return logTime >= startTime && logTime <= endTime;
	});
}

// Format metadata for display
function formatMetadata(metadata: Record<string, unknown>): string {
	return JSON.stringify(metadata, null, 2);
}

// Check if critical error
function isCriticalError(log: LogEntry): boolean {
	return (
		log.level === 'error' &&
		(log.message.toLowerCase().includes('critical') ||
			log.message.toLowerCase().includes('fatal'))
	);
}

// Get log statistics
function getLogStatistics(logs: LogEntry[]): {
	total: number;
	info: number;
	warn: number;
	error: number;
	categories: number;
	withMetadata: number;
} {
	return {
		total: logs.length,
		info: countByLevel(logs, 'info'),
		warn: countByLevel(logs, 'warn'),
		error: countByLevel(logs, 'error'),
		categories: extractCategories(logs).length,
		withMetadata: logs.filter((log) => hasMetadata(log)).length,
	};
}

describe('Admin.Logs - Level Filtering', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'User logged in',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'warn',
			category: 'auth',
			message: 'Failed login attempt',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Connection timeout',
			timestamp: '2024-01-01T10:02:00Z',
		},
	];

	it('filters by info level', () => {
		expect(filterByLevel(logs, 'info')).toHaveLength(1);
	});

	it('filters by warn level', () => {
		expect(filterByLevel(logs, 'warn')).toHaveLength(1);
	});

	it('filters by error level', () => {
		expect(filterByLevel(logs, 'error')).toHaveLength(1);
	});

	it('returns all logs when no filter', () => {
		expect(filterByLevel(logs, undefined)).toHaveLength(3);
	});
});

describe('Admin.Logs - Category Filtering', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'User logged in',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'info',
			category: 'auth',
			message: 'User logged out',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Connection error',
			timestamp: '2024-01-01T10:02:00Z',
		},
	];

	it('filters by category', () => {
		expect(filterByCategory(logs, 'auth')).toHaveLength(2);
		expect(filterByCategory(logs, 'database')).toHaveLength(1);
	});

	it('returns all logs when no filter', () => {
		expect(filterByCategory(logs, undefined)).toHaveLength(3);
	});
});

describe('Admin.Logs - Search Filtering', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'User john logged in',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'info',
			category: 'auth',
			message: 'User alice logged in',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Connection error',
			timestamp: '2024-01-01T10:02:00Z',
		},
	];

	it('searches in messages', () => {
		expect(filterBySearch(logs, 'john')).toHaveLength(1);
		expect(filterBySearch(logs, 'logged in')).toHaveLength(2);
	});

	it('is case insensitive', () => {
		expect(filterBySearch(logs, 'JOHN')).toHaveLength(1);
		expect(filterBySearch(logs, 'ERROR')).toHaveLength(1);
	});

	it('returns all when no search', () => {
		expect(filterBySearch(logs, '')).toHaveLength(3);
	});

	it('returns empty for no matches', () => {
		expect(filterBySearch(logs, 'nonexistent')).toHaveLength(0);
	});
});

describe('Admin.Logs - Combined Filtering', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'User logged in',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'warn',
			category: 'auth',
			message: 'Failed login attempt',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Connection timeout',
			timestamp: '2024-01-01T10:02:00Z',
		},
		{
			id: '4',
			level: 'error',
			category: 'auth',
			message: 'Authentication failed',
			timestamp: '2024-01-01T10:03:00Z',
		},
	];

	it('applies level and category filters', () => {
		const filtered = applyAllFilters(logs, 'error', 'auth');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('4');
	});

	it('applies all filters', () => {
		const filtered = applyAllFilters(logs, 'error', 'database', 'timeout');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('3');
	});

	it('returns empty when no matches', () => {
		const filtered = applyAllFilters(logs, 'info', 'database');
		expect(filtered).toHaveLength(0);
	});
});

describe('Admin.Logs - Category Extraction', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Log 1',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'info',
			category: 'auth',
			message: 'Log 2',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Log 3',
			timestamp: '2024-01-01T10:02:00Z',
		},
		{
			id: '4',
			level: 'info',
			category: 'api',
			message: 'Log 4',
			timestamp: '2024-01-01T10:03:00Z',
		},
	];

	it('extracts unique categories', () => {
		const categories = extractCategories(logs);
		expect(categories).toHaveLength(3);
		expect(categories).toContain('auth');
		expect(categories).toContain('database');
		expect(categories).toContain('api');
	});

	it('handles empty logs', () => {
		expect(extractCategories([])).toHaveLength(0);
	});
});

describe('Admin.Logs - Timestamp Formatting', () => {
	it('formats timestamps', () => {
		const timestamp = '2024-01-01T12:00:00Z';
		const formatted = formatTimestamp(timestamp);
		expect(formatted).toBeTruthy();
		expect(formatted).toContain('2024');
	});
});

describe('Admin.Logs - Badge Classes', () => {
	it('gets badge classes', () => {
		expect(getBadgeClass('info')).toBe('admin-logs__badge--info');
		expect(getBadgeClass('warn')).toBe('admin-logs__badge--warn');
		expect(getBadgeClass('error')).toBe('admin-logs__badge--error');
	});
});

describe('Admin.Logs - Entry Classes', () => {
	it('gets entry classes', () => {
		expect(getEntryClass('info')).toBe('admin-logs__entry--info');
		expect(getEntryClass('warn')).toBe('admin-logs__entry--warn');
		expect(getEntryClass('error')).toBe('admin-logs__entry--error');
	});
});

describe('Admin.Logs - Metadata', () => {
	const withMetadata: LogEntry = {
		id: '1',
		level: 'error',
		category: 'api',
		message: 'Request failed',
		timestamp: '2024-01-01T10:00:00Z',
		metadata: { statusCode: 500, url: '/api/test' },
	};

	const withoutMetadata: LogEntry = {
		id: '2',
		level: 'info',
		category: 'auth',
		message: 'User logged in',
		timestamp: '2024-01-01T10:00:00Z',
	};

	it('detects metadata presence', () => {
		expect(hasMetadata(withMetadata)).toBe(true);
		expect(hasMetadata(withoutMetadata)).toBe(false);
	});

	it('formats metadata', () => {
		const metadata = withMetadata.metadata;
		expect(metadata).toBeDefined();
		if (!metadata) {
			throw new Error('Expected metadata to exist for formatting');
		}
		const formatted = formatMetadata(metadata);
		expect(formatted).toContain('statusCode');
		expect(formatted).toContain('500');
	});
});

describe('Admin.Logs - Counting', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Log 1',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'info',
			category: 'auth',
			message: 'Log 2',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'warn',
			category: 'database',
			message: 'Log 3',
			timestamp: '2024-01-01T10:02:00Z',
		},
		{
			id: '4',
			level: 'error',
			category: 'api',
			message: 'Log 4',
			timestamp: '2024-01-01T10:03:00Z',
		},
	];

	it('counts by level', () => {
		expect(countByLevel(logs, 'info')).toBe(2);
		expect(countByLevel(logs, 'warn')).toBe(1);
		expect(countByLevel(logs, 'error')).toBe(1);
	});

	it('counts by category', () => {
		expect(countByCategory(logs, 'auth')).toBe(2);
		expect(countByCategory(logs, 'database')).toBe(1);
		expect(countByCategory(logs, 'api')).toBe(1);
	});
});

describe('Admin.Logs - Severity Getters', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Log 1',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'warn',
			category: 'auth',
			message: 'Log 2',
			timestamp: '2024-01-01T10:01:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Log 3',
			timestamp: '2024-01-01T10:02:00Z',
		},
	];

	it('gets error logs', () => {
		expect(getErrorLogs(logs)).toHaveLength(1);
	});

	it('gets warning logs', () => {
		expect(getWarningLogs(logs)).toHaveLength(1);
	});
});

describe('Admin.Logs - UI State', () => {
	it('shows empty state correctly', () => {
		expect(shouldShowEmptyState([], false)).toBe(true);
		expect(shouldShowEmptyState([], true)).toBe(false);
		expect(shouldShowEmptyState([{ id: '1' } as LogEntry], false)).toBe(false);
	});
});

describe('Admin.Logs - Auto-refresh', () => {
	it('detects auto-refresh state', () => {
		expect(isAutoRefreshActive(true)).toBe(true);
		expect(isAutoRefreshActive(false)).toBe(false);
	});

	it('gets refresh interval', () => {
		expect(getRefreshInterval()).toBe(5000);
	});
});

describe('Admin.Logs - Sorting', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Log 1',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'info',
			category: 'auth',
			message: 'Log 2',
			timestamp: '2024-01-01T10:02:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Log 3',
			timestamp: '2024-01-01T10:01:00Z',
		},
	];

	it('sorts by timestamp descending', () => {
		const sorted = sortByTimestamp(logs);
		expect(sorted.map((l) => l.id)).toEqual(['2', '3', '1']);
	});

	it('sorts by timestamp ascending', () => {
		const sorted = sortByTimestamp(logs, false);
		expect(sorted.map((l) => l.id)).toEqual(['1', '3', '2']);
	});

	it('does not mutate original', () => {
		const original = [...logs];
		sortByTimestamp(logs);
		expect(logs).toEqual(original);
	});
});

describe('Admin.Logs - Recent Logs', () => {
	const now = new Date();
	const recent = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
	const old = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago

	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Recent log',
			timestamp: recent.toISOString(),
		},
		{
			id: '2',
			level: 'error',
			category: 'database',
			message: 'Old log',
			timestamp: old.toISOString(),
		},
	];

	it('detects recent logs', () => {
		expect(isRecentLog(logs[0], 5)).toBe(true);
		expect(isRecentLog(logs[1], 5)).toBe(false);
	});

	it('gets recent logs with limit', () => {
		const recent = getRecentLogs(logs, 1);
		expect(recent).toHaveLength(1);
		expect(recent[0].id).toBe('1');
	});
});

describe('Admin.Logs - Time Range', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Log 1',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'info',
			category: 'auth',
			message: 'Log 2',
			timestamp: '2024-01-01T11:00:00Z',
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Log 3',
			timestamp: '2024-01-01T12:00:00Z',
		},
	];

	it('gets logs in time range', () => {
		const inRange = getLogsInRange(
			logs,
			'2024-01-01T10:30:00Z',
			'2024-01-01T11:30:00Z'
		);
		expect(inRange).toHaveLength(1);
		expect(inRange[0].id).toBe('2');
	});

	it('includes boundary logs', () => {
		const inRange = getLogsInRange(
			logs,
			'2024-01-01T10:00:00Z',
			'2024-01-01T11:00:00Z'
		);
		expect(inRange).toHaveLength(2);
	});
});

describe('Admin.Logs - Critical Errors', () => {
	const criticalError: LogEntry = {
		id: '1',
		level: 'error',
		category: 'system',
		message: 'CRITICAL: System failure',
		timestamp: '2024-01-01T10:00:00Z',
	};

	const normalError: LogEntry = {
		id: '2',
		level: 'error',
		category: 'api',
		message: 'Request failed',
		timestamp: '2024-01-01T10:01:00Z',
	};

	it('detects critical errors', () => {
		expect(isCriticalError(criticalError)).toBe(true);
		expect(isCriticalError(normalError)).toBe(false);
	});
});

describe('Admin.Logs - Statistics', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'Log 1',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'warn',
			category: 'auth',
			message: 'Log 2',
			timestamp: '2024-01-01T10:01:00Z',
			metadata: { test: 'data' },
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Log 3',
			timestamp: '2024-01-01T10:02:00Z',
		},
	];

	it('calculates complete statistics', () => {
		const stats = getLogStatistics(logs);
		expect(stats.total).toBe(3);
		expect(stats.info).toBe(1);
		expect(stats.warn).toBe(1);
		expect(stats.error).toBe(1);
		expect(stats.categories).toBe(2);
		expect(stats.withMetadata).toBe(1);
	});
});

describe('Admin.Logs - Edge Cases', () => {
	it('handles empty log list', () => {
		expect(applyAllFilters([], 'info', 'auth', 'test')).toHaveLength(0);
		expect(extractCategories([])).toHaveLength(0);
		expect(getErrorLogs([])).toHaveLength(0);
	});

	it('handles logs with empty metadata', () => {
		const log: LogEntry = {
			id: '1',
			level: 'info',
			category: 'test',
			message: 'Test',
			timestamp: '2024-01-01T10:00:00Z',
			metadata: {},
		};
		expect(hasMetadata(log)).toBe(false);
	});

	it('handles special characters in messages', () => {
		const logs: LogEntry[] = [
			{
				id: '1',
				level: 'info',
				category: 'auth',
				message: 'User <test@example.com> logged in',
				timestamp: '2024-01-01T10:00:00Z',
			},
		];
		expect(filterBySearch(logs, 'test@example.com')).toHaveLength(1);
	});
});

describe('Admin.Logs - Integration', () => {
	const logs: LogEntry[] = [
		{
			id: '1',
			level: 'info',
			category: 'auth',
			message: 'User logged in successfully',
			timestamp: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			level: 'warn',
			category: 'auth',
			message: 'Failed login attempt',
			timestamp: '2024-01-01T10:01:00Z',
			metadata: { ip: '192.168.1.1' },
		},
		{
			id: '3',
			level: 'error',
			category: 'database',
			message: 'Connection timeout',
			timestamp: '2024-01-01T10:02:00Z',
			metadata: { host: 'db.example.com', timeout: 30000 },
		},
		{
			id: '4',
			level: 'error',
			category: 'auth',
			message: 'Authentication failed',
			timestamp: '2024-01-01T10:03:00Z',
		},
	];

	it('handles complete filtering workflow', () => {
		// Get categories
		const categories = extractCategories(logs);
		expect(categories).toHaveLength(2);

		// Filter by level
		const errors = filterByLevel(logs, 'error');
		expect(errors).toHaveLength(2);

		// Further filter by category
		const authErrors = applyAllFilters(logs, 'error', 'auth');
		expect(authErrors).toHaveLength(1);

		// Check styling
		expect(getBadgeClass(authErrors[0].level)).toBe('admin-logs__badge--error');
		expect(getEntryClass(authErrors[0].level)).toBe('admin-logs__entry--error');
	});

	it('handles search and display workflow', () => {
		// Search
		const searchResults = filterBySearch(logs, 'login');
		expect(searchResults).toHaveLength(1);

		// Sort by time
		const sorted = sortByTimestamp(searchResults);
		expect(sorted[0].id).toBe('2'); // Most recent

		// Format for display
		sorted.forEach((log) => {
			expect(formatTimestamp(log.timestamp)).toBeTruthy();
			expect(getBadgeClass(log.level)).toBeTruthy();
			if (hasMetadata(log) && log.metadata) {
				expect(formatMetadata(log.metadata)).toBeTruthy();
			}
		});
	});

	it('handles statistics and analysis', () => {
		// Get stats
		const stats = getLogStatistics(logs);
		expect(stats.total).toBe(4);
		expect(stats.error).toBe(2);

		// Get errors
		const errors = getErrorLogs(logs);
		expect(errors).toHaveLength(2);

		// Check for critical
		const critical = errors.filter(isCriticalError);
		expect(critical).toHaveLength(0);

		// Count by category
		expect(countByCategory(logs, 'auth')).toBe(3);
	});
});
