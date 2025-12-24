import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TwoFactorVerify from '../src/TwoFactorVerify.svelte';
import TestWrapper from './fixtures/TestWrapper.svelte';
import type { AuthHandlers } from '../src/context.js';

describe('TwoFactorVerify Component', () => {
	const defaultHandlers: AuthHandlers = {
		onTwoFactorVerify: vi.fn(),
	};

	function setup(props = {}, handlers = {}, initialState = {}) {
		const mergedHandlers = { ...defaultHandlers, ...handlers };

		const { component, rerender } = render(TestWrapper, {
			component: TwoFactorVerify,
			handlers: mergedHandlers,
			initialState,
			...props,
		});

		return { handlers: mergedHandlers, component, rerender };
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly', () => {
		setup();
		expect(screen.getByRole('heading', { name: 'Enter Verification Code' })).toBeTruthy();
		expect(screen.getByLabelText('6-Digit Code')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Verify' })).toBeTruthy();
	});

	it('verifies TOTP code', async () => {
		const { handlers } = setup();

		const input = screen.getByLabelText('6-Digit Code');
		await fireEvent.input(input, { target: { value: '123456' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

		expect(handlers.onTwoFactorVerify).toHaveBeenCalledWith({
			code: '123456',
			method: 'totp',
		});
	});

	it('validates TOTP code length', async () => {
		const { handlers } = setup();

		const input = screen.getByLabelText('6-Digit Code');
		await fireEvent.input(input, { target: { value: '123' } });

		// Button should be disabled for short code (based on markup logic)
		const button = screen.getByRole('button', { name: 'Verify' }) as HTMLButtonElement;
		expect(button.disabled).toBe(true);

		// Try Enter key
		await fireEvent.keyDown(input, { key: 'Enter' });

		// Verify logic inside component also checks length
		expect(handlers.onTwoFactorVerify).not.toHaveBeenCalled();

		// Wait and check if error message appears after explicit verify attempt
		// Note: The button is disabled, so click won't work.
		// The `handleVerify` function has a length check, which sets `codeError`.
		// But `handleKeyDown` also calls `handleVerify`.
	});

	it('displays backup option when available', async () => {
		setup(
			{},
			{},
			{
				twoFactorSession: {
					email: 'test@example.com',
					methods: ['totp', 'backup'],
				},
			}
		);

		expect(screen.getByRole('button', { name: 'Authenticator App' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Backup Code' })).toBeTruthy();
	});

	it('switches to backup code method', async () => {
		const { handlers } = setup(
			{},
			{},
			{
				twoFactorSession: {
					email: 'test@example.com',
					methods: ['totp', 'backup'],
				},
			}
		);

		await fireEvent.click(screen.getByRole('button', { name: 'Backup Code' }));

		expect(screen.getByLabelText('Backup Code')).toBeTruthy();
		expect(screen.queryByLabelText('6-Digit Code')).toBeNull();

		const input = screen.getByLabelText('Backup Code');
		await fireEvent.input(input, { target: { value: 'BACKUP123' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

		expect(handlers.onTwoFactorVerify).toHaveBeenCalledWith({
			code: 'BACKUP123',
			method: 'backup',
		});
	});

	it('handles verification error', async () => {
		const onTwoFactorVerify = vi.fn().mockRejectedValue(new Error('Invalid code'));
		setup({}, { onTwoFactorVerify });

		await fireEvent.input(screen.getByLabelText('6-Digit Code'), { target: { value: '123456' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

		expect(await screen.findByRole('alert')).toBeTruthy();
		// Match partial text as the full message is long
		expect(screen.getByText(/Invalid verification code/)).toBeTruthy();
	});

	it('disables inputs when loading', () => {
		setup({}, {}, { loading: true });

		expect((screen.getByLabelText('6-Digit Code') as HTMLInputElement).disabled).toBe(true);
		expect(
			(screen.getByRole('button', { name: 'Verifying...' }) as HTMLButtonElement).disabled
		).toBe(true);
	});
});
