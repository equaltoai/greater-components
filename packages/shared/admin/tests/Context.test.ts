import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import ContextHarness from './ContextHarness.svelte';
import type { AdminContext } from '../src/context.svelte.js';

describe('Admin Context', () => {
	it('initializes with default state', () => {
		let context: AdminContext | undefined;
		render(ContextHarness, {
			props: {
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		expect(context.state.loading).toBe(false);
		expect(context.state.error).toBe(null);
		expect(context.state.stats).toBe(null);
	});

	it('fetches stats successfully', async () => {
		let context: AdminContext | undefined;
		const mockStats = {
			totalUsers: 100,
			activeUsers: 50,
			totalPosts: 500,
			pendingReports: 0,
			blockedDomains: 0,
			storageUsed: '1GB',
		};
		const handlers = {
			onFetchStats: vi.fn().mockResolvedValue(mockStats),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchStats();

		expect(context.state.loading).toBe(true);

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.loading).toBe(false);
		});

		expect(context.state.stats).toEqual(mockStats);
		expect(handlers.onFetchStats).toHaveBeenCalled();
	});

	it('handles fetch error', async () => {
		let context: AdminContext | undefined;
		const handlers = {
			onFetchStats: vi.fn().mockRejectedValue(new Error('Fetch failed')),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchStats();

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.error).toBe('Fetch failed');
			expect(context.state.loading).toBe(false);
		});
	});

	it('fetches users', async () => {
		let context: AdminContext | undefined;
		const mockUsers = [{ id: '1', username: 'u1' }];
		const handlers = {
			onFetchUsers: vi.fn().mockResolvedValue(mockUsers),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchUsers({ role: 'admin' });

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.users).toEqual(mockUsers);
		});

		expect(handlers.onFetchUsers).toHaveBeenCalledWith({ role: 'admin' });
	});

	it('updates state manually', () => {
		let context: AdminContext | undefined;
		render(ContextHarness, {
			props: {
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.updateState({ loading: true, error: 'Manual error' });
		expect(context.state.loading).toBe(true);
		expect(context.state.error).toBe('Manual error');
	});

	it('clears error', () => {
		let context: AdminContext | undefined;
		render(ContextHarness, {
			props: {
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.updateState({ error: 'Some error' });
		expect(context.state.error).toBe('Some error');

		context.clearError();
		expect(context.state.error).toBe(null);
	});

	it('fetches reports', async () => {
		let context: AdminContext | undefined;
		const mockReports = [{ id: '1', reason: 'spam' }];
		const handlers = {
			onFetchReports: vi.fn().mockResolvedValue(mockReports),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchReports('pending');

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.reports).toEqual(mockReports);
		});
		expect(handlers.onFetchReports).toHaveBeenCalledWith('pending');
	});

	it('fetches instances', async () => {
		let context: AdminContext | undefined;
		const mockInstances = [{ domain: 'example.com' }];
		const handlers = {
			onFetchInstances: vi.fn().mockResolvedValue(mockInstances),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchInstances();

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.instances).toEqual(mockInstances);
		});
		expect(handlers.onFetchInstances).toHaveBeenCalled();
	});

	it('fetches settings', async () => {
		let context: AdminContext | undefined;
		const mockSettings = { name: 'My Instance' };
		const handlers = {
			onFetchSettings: vi.fn().mockResolvedValue(mockSettings),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchSettings();

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.settings).toEqual(mockSettings);
		});
		expect(handlers.onFetchSettings).toHaveBeenCalled();
	});

	it('fetches logs', async () => {
		let context: AdminContext | undefined;
		const mockLogs = [{ id: '1', message: 'error' }];
		const handlers = {
			onFetchLogs: vi.fn().mockResolvedValue(mockLogs),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchLogs({ level: 'error' });

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.logs).toEqual(mockLogs);
		});
		expect(handlers.onFetchLogs).toHaveBeenCalledWith({ level: 'error' });
	});

	it('fetches analytics', async () => {
		let context: AdminContext | undefined;
		const mockAnalytics = { period: 'day', userGrowth: [] };
		const handlers = {
			onFetchAnalytics: vi.fn().mockResolvedValue(mockAnalytics),
		};

		render(ContextHarness, {
			props: {
				handlers,
				onContext: (ctx: AdminContext) => {
					context = ctx;
				},
			},
		});

		if (!context) throw new Error('Context missing');
		context.fetchAnalytics('day');

		await waitFor(() => {
			if (!context) throw new Error('Context missing');
			expect(context.state.analytics).toEqual(mockAnalytics);
		});
		expect(handlers.onFetchAnalytics).toHaveBeenCalledWith('day');
	});
});

import { formatNumber } from '../src/context.svelte.js';

describe('Admin Context Utilities', () => {
	it('formats numbers', () => {
		expect(formatNumber(100)).toBe('100');
		expect(formatNumber(1500)).toBe('1.5K');
		expect(formatNumber(2000000)).toBe('2.0M');
	});
});
