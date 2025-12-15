import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import CommissionJourneyApp from './CommissionJourneyApp.svelte';

describe('Commission Lifecycle Journey', () => {
	const mockCommission = {
		id: 'c1',
		status: 'inquiry',
		// ... other fields
	} as any;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('progresses through lifecycle steps', async () => {
		const onStatusChange = vi.fn();
		render(CommissionJourneyApp, {
			props: {
				initialCommission: mockCommission,
				onStatusChange,
			},
		});

		expect(screen.getByText('Status: inquiry')).toBeInTheDocument();

		await fireEvent.click(screen.getByText('Request Quote'));

		expect(onStatusChange).toHaveBeenCalledWith('quoted');
		expect(screen.getByText('Status: quoted')).toBeInTheDocument();

		await fireEvent.click(screen.getByText('Accept Quote'));

		expect(onStatusChange).toHaveBeenCalledWith('accepted');
		expect(screen.getByText('Status: accepted')).toBeInTheDocument();
	});
});
