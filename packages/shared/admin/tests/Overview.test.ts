import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import OverviewHarness from './OverviewHarness.svelte';
import type { AdminHandlers, AdminStats } from '../src/context.svelte.js';

describe('Admin.Overview Component', () => {
	const mockStats: AdminStats = {
		totalUsers: 1500,
		activeUsers: 1200,
		totalPosts: 50000,
		pendingReports: 5,
		blockedDomains: 10,
		storageUsed: '5.2 GB',
	};

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onFetchStats: vi.fn().mockResolvedValue(mockStats),
		};
	});

	it('renders stats with data', async () => {
		render(OverviewHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Total Users')).toBeTruthy();
		});

		// Check formatted numbers (assuming formatNumber works as expected, 1.5K)
		// formatNumber implementation: 
		// if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		// if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		
		expect(screen.getByText('1.5K')).toBeTruthy(); // 1500
		expect(screen.getByText('1.2K')).toBeTruthy(); // 1200
		expect(screen.getByText('50.0K')).toBeTruthy(); // 50000

		expect(screen.getByText('5')).toBeTruthy(); // Pending Reports
		expect(screen.getByText('10')).toBeTruthy(); // Blocked Domains
		expect(screen.getByText('5.2 GB')).toBeTruthy(); // Storage Used
	});

	it('calls fetchStats on mount', async () => {
		render(OverviewHarness, { handlers });
		expect(handlers.onFetchStats).toHaveBeenCalled();
	});
});