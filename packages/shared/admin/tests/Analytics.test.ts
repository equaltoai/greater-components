import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/svelte';
import AnalyticsHarness from './AnalyticsHarness.svelte';
import type { AdminHandlers, AnalyticsData } from '../src/context.svelte.js';

describe('Admin.Analytics Component', () => {
	const mockAnalyticsData: AnalyticsData = {
		period: 'week',
		userGrowth: [
			{ date: '2024-01-01', count: 10 },
			{ date: '2024-01-02', count: 20 },
			{ date: '2024-01-03', count: 15 },
		],
		postActivity: [
			{ date: '2024-01-01', count: 5 },
			{ date: '2024-01-02', count: 8 },
			{ date: '2024-01-03', count: 12 },
		],
		federationActivity: [
			{ date: '2024-01-01', count: 2 },
			{ date: '2024-01-02', count: 4 },
			{ date: '2024-01-03', count: 1 },
		],
	};

	it('renders loading state initially', () => {
		const handlers: AdminHandlers = {
			onFetchAnalytics: vi.fn().mockReturnValue(new Promise(() => {})), // Never resolves
		};

		render(AnalyticsHarness, { props: { handlers } });

		expect(screen.getByText('Loading analytics...')).toBeTruthy();
	});

	it('renders charts when data is loaded', async () => {
		const handlers: AdminHandlers = {
			onFetchAnalytics: vi.fn().mockResolvedValue(mockAnalyticsData),
		};

		render(AnalyticsHarness, { props: { handlers } });

		await waitFor(() => {
			expect(screen.getByText('User Growth')).toBeTruthy();
		});

		expect(screen.getByText('Post Activity')).toBeTruthy();
		expect(screen.getByText('Federation Activity')).toBeTruthy();

		// Check for specific data points (using titles in bars)
		expect(screen.getByTitle('20 users')).toBeTruthy();
		expect(screen.getByTitle('12 posts')).toBeTruthy();
	});

	it('allows switching periods', async () => {
		const handlers: AdminHandlers = {
			onFetchAnalytics: vi.fn().mockResolvedValue(mockAnalyticsData),
		};

		render(AnalyticsHarness, { props: { handlers } });

		await waitFor(() => {
			expect(screen.getByText('User Growth')).toBeTruthy();
		});

		const dayButton = screen.getByText('24 Hours');
		await fireEvent.click(dayButton);

		expect(handlers.onFetchAnalytics).toHaveBeenCalledWith('day');

		const monthButton = screen.getByText('30 Days');
		await fireEvent.click(monthButton);

		expect(handlers.onFetchAnalytics).toHaveBeenCalledWith('month');
	});

	it('calculates and displays summaries', async () => {
		const handlers: AdminHandlers = {
			onFetchAnalytics: vi.fn().mockResolvedValue(mockAnalyticsData),
		};

		render(AnalyticsHarness, { props: { handlers } });

		await waitFor(() => {
			expect(screen.getByText('User Growth')).toBeTruthy();
		});

		// User growth total: 10+20+15 = 45
		// We can look for text "45" but might be ambiguous.
		// The component displays it in summary-value.
		const values = screen.getAllByText('45');
		expect(values.length).toBeGreaterThan(0);

		// Average: 45 / 3 = 15
		// Post total: 5+8+12 = 25
		// Federation total: 2+4+1 = 7

		expect(screen.getAllByText('25').length).toBeGreaterThan(0);
		expect(screen.getAllByText('7').length).toBeGreaterThan(0);
	});
});
