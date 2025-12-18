import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TestStableId from './TestStableId.svelte';
import TestStableIdWithProvider from './TestStableIdWithProvider.svelte';

describe('useStableId', () => {
	it('generates sequential IDs with IdProvider', () => {
		render(TestStableIdWithProvider);
		const elements = screen.getAllByTestId('id-value');
		expect(elements[0].textContent).toBe('gr-test-1');
		expect(elements[1].textContent).toBe('gr-test-2');
	});

	it('updates ID on mount without IdProvider', async () => {
		render(TestStableId, { props: { prefix: 'fallback' } });
		const element = screen.getByTestId('id-value');

		// Initially empty (SSR safe) or updated immediately if on client
		// We wait for the value to match the fallback pattern
		await waitFor(() => {
			expect(element.textContent).toMatch(/^gr-fallback-\d+$/);
		});
	});
});
