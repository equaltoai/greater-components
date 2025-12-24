import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import LogsHarness from './LogsHarness.svelte';
import type { LogEntry, AdminHandlers } from '../src/context.svelte.js';

describe('Admin.Logs Component', () => {
	const mockLogs: LogEntry[] = [
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
			category: 'system',
			message: 'High CPU usage',
			timestamp: '2024-01-01T10:01:00Z',
			metadata: { cpu: '95%' },
		},
		{
			id: '3',
			level: 'error',
			category: 'db',
			message: 'Database connection failed',
			timestamp: '2024-01-01T10:02:00Z',
		},
	];

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onFetchLogs: vi.fn().mockResolvedValue(mockLogs),
		};
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders logs list with data', async () => {
		render(LogsHarness, { handlers });

		// Wait for logs to be loaded
		await waitFor(() => {
			expect(screen.getByText('User logged in')).toBeTruthy();
		});

		expect(screen.getByText('High CPU usage')).toBeTruthy();
		expect(screen.getByText('Database connection failed')).toBeTruthy();

		// Check categories
		expect(screen.getAllByText('auth').length).toBeGreaterThan(0);
		expect(screen.getAllByText('system').length).toBeGreaterThan(0);
		expect(screen.getAllByText('db').length).toBeGreaterThan(0);

		// Check badges
		expect(screen.getAllByText('info').length).toBeGreaterThan(0);
		expect(screen.getAllByText('warn').length).toBeGreaterThan(0);
		expect(screen.getAllByText('error').length).toBeGreaterThan(0);
	});

	it('filters logs by level', async () => {
		render(LogsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('User logged in')).toBeTruthy();
		});

		const levelSelect = screen.getByLabelText('Level:');
		await fireEvent.change(levelSelect, { target: { value: 'error' } });

		// Filter is applied client-side or server-side depending on implementation.
		// In Logs.svelte, fetchLogs is called with filters on refresh, but there is also a client-side filter logic?
		// Let's check Logs.svelte code again.
		// It has `const filteredLogs = $derived(...)` which filters adminState.logs.
		// BUT `handleRefresh` calls `fetchLogs` with filters.
		// However, changing the select `bind:value={filterLevel}` updates the derived `filteredLogs`.
		// Wait, `filteredLogs` filters `adminState.logs`. If `adminState.logs` contains all logs, it works client side.
		// But `fetchLogs` is only called on mount and refresh button.
		// Ah, looking at Logs.svelte:
		// <select id="logs-level" class="admin-logs__select" bind:value={filterLevel}>
		// It binds value. `filteredLogs` depends on `filterLevel`.
		// So it filters client-side immediately.

		// The mock returns all logs. Client side filter should hide non-matching ones.
		expect(screen.queryByText('User logged in')).toBeNull(); // info
		expect(screen.getByText('Database connection failed')).toBeTruthy(); // error
	});

	it('filters logs by category', async () => {
		render(LogsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('User logged in')).toBeTruthy();
		});

		const categorySelect = screen.getByLabelText('Category:');
		await fireEvent.change(categorySelect, { target: { value: 'system' } });

		expect(screen.queryByText('User logged in')).toBeNull();
		expect(screen.getByText('High CPU usage')).toBeTruthy();
	});

	it('searches logs', async () => {
		render(LogsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('User logged in')).toBeTruthy();
		});

		const searchInput = screen.getByPlaceholderText('Search logs...');
		await fireEvent.input(searchInput, { target: { value: 'CPU' } });

		expect(screen.queryByText('User logged in')).toBeNull();
		expect(screen.getByText('High CPU usage')).toBeTruthy();
	});

	it('refreshes logs manually', async () => {
		render(LogsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('User logged in')).toBeTruthy();
		});

		const refreshButton = screen.getByText('Refresh');
		await fireEvent.click(refreshButton);

		expect(handlers.onFetchLogs).toHaveBeenCalledTimes(2); // Once on mount, once on click
	});

	it('auto-refreshes logs', async () => {
		render(LogsHarness, { handlers });

		const autoRefreshCheckbox = screen.getByLabelText('Auto-refresh (5s)');
		await fireEvent.click(autoRefreshCheckbox);

		// Advance time
		await vi.advanceTimersByTimeAsync(5000);

		expect(handlers.onFetchLogs).toHaveBeenCalledTimes(2); // Mount + 1 auto refresh

		await vi.advanceTimersByTimeAsync(5000);
		expect(handlers.onFetchLogs).toHaveBeenCalledTimes(3);
	});

	it('shows metadata details', async () => {
		render(LogsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('High CPU usage')).toBeTruthy();
		});

		// Find details element
		const details = screen.getByText('Metadata');
		expect(details).toBeTruthy();

		// In JSDOM details open state might not work perfectly with user events, but we can check existence
		expect(screen.getByText(/"cpu": "95%"/)).toBeTruthy();
	});
});
