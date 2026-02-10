/**
 * Admin Context
 *
 * Provides admin dashboard state and handlers.
 * For instance administrators and moderators.
 *
 * @module Admin/context
 */

import { getContext, setContext } from 'svelte';

const ADMIN_CONTEXT_KEY = Symbol('admin-context');

// Overview Types
export interface AdminStats {
	totalUsers: number;
	activeUsers: number;
	totalPosts: number;
	pendingReports: number;
	blockedDomains: number;
	storageUsed: string;
}

// User Management Types
export interface AdminUser {
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

// Reports Types
export interface AdminReport {
	id: string;
	reporter: { id: string; username: string };
	target: { id: string; username: string; type: 'user' | 'post' };
	reason: string;
	status: 'pending' | 'resolved' | 'dismissed';
	createdAt: string;
	assignedTo?: string;
}

// Federation Types
export interface FederatedInstance {
	domain: string;
	softwareName?: string;
	softwareVersion?: string;
	usersCount?: number;
	status: 'allowed' | 'limited' | 'blocked';
	lastSeen?: string;
}

// Settings Types
export interface InstanceSettings {
	name: string;
	description: string;
	registrationOpen: boolean;
	approvalRequired: boolean;
	inviteOnly: boolean;
	maxPostLength: number;
	maxMediaAttachments: number;
}

// Log Entry Types
export interface LogEntry {
	id: string;
	timestamp: string;
	level: 'info' | 'warn' | 'error';
	category: string;
	message: string;
	metadata?: Record<string, unknown>;
}

// Analytics Types
export interface AnalyticsData {
	period: 'day' | 'week' | 'month';
	userGrowth: { date: string; count: number }[];
	postActivity: { date: string; count: number }[];
	federationActivity: { date: string; count: number }[];
}

// Admin Handlers
export interface AdminHandlers {
	// Overview
	onFetchStats?: () => Promise<AdminStats>;

	// Users
	onFetchUsers?: (filters?: {
		role?: string;
		status?: string;
		search?: string;
	}) => Promise<AdminUser[]>;
	onSuspendUser?: (userId: string, reason: string) => Promise<void>;
	onUnsuspendUser?: (userId: string) => Promise<void>;
	onChangeUserRole?: (userId: string, role: 'admin' | 'moderator' | 'user') => Promise<void>;
	onSearchUsers?: (query: string) => Promise<AdminUser[]>;

	// Reports
	onFetchReports?: (status?: 'pending' | 'resolved' | 'dismissed') => Promise<AdminReport[]>;
	onResolveReport?: (reportId: string, action: string) => Promise<void>;
	onDismissReport?: (reportId: string) => Promise<void>;

	// Federation
	onFetchInstances?: () => Promise<FederatedInstance[]>;
	onBlockInstance?: (domain: string, reason: string) => Promise<void>;
	onUnblockInstance?: (domain: string) => Promise<void>;

	// Settings
	onFetchSettings?: () => Promise<InstanceSettings>;
	onUpdateSettings?: (settings: Partial<InstanceSettings>) => Promise<void>;

	// Logs
	onFetchLogs?: (filters?: {
		level?: string;
		category?: string;
		limit?: number;
	}) => Promise<LogEntry[]>;

	// Analytics
	onFetchAnalytics?: (period: 'day' | 'week' | 'month') => Promise<AnalyticsData>;
}

// Admin State
export interface AdminState {
	stats: AdminStats | null;
	users: AdminUser[];
	reports: AdminReport[];
	instances: FederatedInstance[];
	settings: InstanceSettings | null;
	logs: LogEntry[];
	analytics: AnalyticsData | null;
	loading: boolean;
	error: string | null;
}

// Admin Context
export interface AdminContext {
	state: AdminState;
	handlers: AdminHandlers;
	updateState: (partial: Partial<AdminState>) => void;
	clearError: () => void;
	fetchStats: () => Promise<void>;
	fetchUsers: (filters?: { role?: string; status?: string; search?: string }) => Promise<void>;
	fetchReports: (status?: 'pending' | 'resolved' | 'dismissed') => Promise<void>;
	fetchInstances: () => Promise<void>;
	fetchSettings: () => Promise<void>;
	fetchLogs: (filters?: { level?: string; category?: string; limit?: number }) => Promise<void>;
	fetchAnalytics: (period: 'day' | 'week' | 'month') => Promise<void>;
}

export function createAdminContext(handlers: AdminHandlers = {}): AdminContext {
	const state = $state<AdminState>({
		stats: null,
		users: [],
		reports: [],
		instances: [],
		settings: null,
		logs: [],
		analytics: null,
		loading: false,
		error: null,
	});

	const context: AdminContext = {
		state,
		handlers,
		updateState: (partial: Partial<AdminState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
		fetchStats: async () => {
			state.loading = true;
			state.error = null;
			try {
				const stats = await handlers.onFetchStats?.();
				if (stats) state.stats = stats;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch stats';
			} finally {
				state.loading = false;
			}
		},
		fetchUsers: async (filters?: { role?: string; status?: string; search?: string }) => {
			state.loading = true;
			state.error = null;
			try {
				const users = await handlers.onFetchUsers?.(filters);
				if (users) state.users = users;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch users';
			} finally {
				state.loading = false;
			}
		},
		fetchReports: async (status?) => {
			state.loading = true;
			state.error = null;
			try {
				const reports = await handlers.onFetchReports?.(status);
				if (reports) state.reports = reports;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch reports';
			} finally {
				state.loading = false;
			}
		},
		fetchInstances: async () => {
			state.loading = true;
			state.error = null;
			try {
				const instances = await handlers.onFetchInstances?.();
				if (instances) state.instances = instances;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch instances';
			} finally {
				state.loading = false;
			}
		},
		fetchSettings: async () => {
			state.loading = true;
			state.error = null;
			try {
				const settings = await handlers.onFetchSettings?.();
				if (settings) state.settings = settings;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch settings';
			} finally {
				state.loading = false;
			}
		},
		fetchLogs: async (filters?) => {
			state.loading = true;
			state.error = null;
			try {
				const logs = await handlers.onFetchLogs?.(filters);
				if (logs) state.logs = logs;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch logs';
			} finally {
				state.loading = false;
			}
		},
		fetchAnalytics: async (period) => {
			state.loading = true;
			state.error = null;
			try {
				const analytics = await handlers.onFetchAnalytics?.(period);
				if (analytics) state.analytics = analytics;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch analytics';
			} finally {
				state.loading = false;
			}
		},
	};

	setContext(ADMIN_CONTEXT_KEY, context);
	return context;
}

export function getAdminContext(): AdminContext {
	const context = getContext<AdminContext>(ADMIN_CONTEXT_KEY);
	if (!context) {
		throw new Error('Admin components must be used within an Admin.Root component');
	}
	return context;
}

export function formatNumber(num: number): string {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
}
