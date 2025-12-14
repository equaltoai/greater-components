import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TwoFactorSetup from '../src/TwoFactorSetup.svelte';
import TestWrapper from './fixtures/TestWrapper.svelte';
import type { AuthHandlers } from '../src/context.js';

describe('TwoFactorSetup Component', () => {
	const defaultHandlers: AuthHandlers = {
		onTwoFactorSetup: vi.fn(),
		onTwoFactorVerify: vi.fn(),
	};

	function setup(props = {}, handlers = {}, initialState = {}) {
		const mergedHandlers = { ...defaultHandlers, ...handlers };

		const { component, rerender } = render(TestWrapper, {
			component: TwoFactorSetup,
			handlers: mergedHandlers,
			initialState,
			...props,
		});

		return { handlers: mergedHandlers, component, rerender };
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders intro step correctly', () => {
		setup();
		expect(screen.getByRole('heading', { name: 'Enable Two-Factor Authentication' })).toBeTruthy();
		expect(screen.getByText('Add an extra layer of security')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Maybe later' })).toBeTruthy();
	});

	it('starts setup on button click', async () => {
		const onTwoFactorSetup = vi.fn().mockResolvedValue({ secret: 'SECRET123' });
		const { handlers } = setup({}, { onTwoFactorSetup });

		await fireEvent.click(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' }));

		expect(handlers.onTwoFactorSetup).toHaveBeenCalledWith('totp');
		// Should transition to scan step
		expect(await screen.findByText('Step 1 of 2: Scan QR code')).toBeTruthy();
		expect(screen.getByText('SECRET123')).toBeTruthy();
	});

	it('handles setup error', async () => {
		const onTwoFactorSetup = vi.fn().mockRejectedValue(new Error('Setup failed'));
		setup({}, { onTwoFactorSetup });

		await fireEvent.click(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' }));

		const alert = await screen.findByRole('alert');
		expect(alert.textContent).toContain('Setup failed');
		// Should stay on intro step
		expect(screen.getByText('Add an extra layer of security')).toBeTruthy();
	});

	it('verifies code and shows backup codes', async () => {
		const onTwoFactorSetup = vi
			.fn()
			.mockResolvedValueOnce({ secret: 'SECRET123' }) // for start
			.mockResolvedValueOnce({ codes: ['CODE1', 'CODE2'] }); // for backup codes
		const onTwoFactorVerify = vi.fn().mockResolvedValue(undefined);

		const { handlers } = setup({}, { onTwoFactorSetup, onTwoFactorVerify });

		// Start setup
		await fireEvent.click(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' }));
		await screen.findByText('Step 1 of 2: Scan QR code');

		// Enter verification code
		const input = screen.getByLabelText('Verification Code');
		await fireEvent.input(input, { target: { value: '123456' } });

		// Verify
		await fireEvent.click(screen.getByRole('button', { name: 'Verify and Continue' }));

		expect(handlers.onTwoFactorVerify).toHaveBeenCalledWith({
			code: '123456',
			method: 'totp',
		});

		expect(handlers.onTwoFactorSetup).toHaveBeenCalledWith('backup');

		// Check transition to backup step
		expect(await screen.findByText('Step 2 of 2: Save your backup codes')).toBeTruthy();
		expect(screen.getByText('CODE1')).toBeTruthy();
		expect(screen.getByText('CODE2')).toBeTruthy();
	});

	it('handles verification error', async () => {
		const onTwoFactorSetup = vi.fn().mockResolvedValue({ secret: 'SECRET123' });
		const onTwoFactorVerify = vi.fn().mockRejectedValue(new Error('Invalid code'));

		setup({}, { onTwoFactorSetup, onTwoFactorVerify });

		// Start setup
		await fireEvent.click(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' }));
		await screen.findByText('Step 1 of 2: Scan QR code');

		// Enter verification code
		const input = screen.getByLabelText('Verification Code');
		await fireEvent.input(input, { target: { value: '123456' } });

		// Verify
		await fireEvent.click(screen.getByRole('button', { name: 'Verify and Continue' }));

		expect(await screen.findByText('Invalid code')).toBeTruthy();
		// Should stay on scan step
		expect(screen.getByText('Step 1 of 2: Scan QR code')).toBeTruthy();
	});

	it('cancels setup from intro', async () => {
		const onCancel = vi.fn();
		setup({ onCancel });

		await fireEvent.click(screen.getByRole('button', { name: 'Maybe later' }));

		expect(onCancel).toHaveBeenCalled();
	});

	it('cancels setup from scan step', async () => {
		const onTwoFactorSetup = vi.fn().mockResolvedValue({ secret: 'SECRET123' });
		const onCancel = vi.fn();
		setup({ onCancel }, { onTwoFactorSetup });

		// Start setup
		await fireEvent.click(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' }));
		await screen.findByText('Step 1 of 2: Scan QR code');

		// Cancel
		await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

		expect(onCancel).toHaveBeenCalled();
	});

	it('finishes setup', async () => {
		const onTwoFactorSetup = vi
			.fn()
			.mockResolvedValueOnce({ secret: 'SECRET123' })
			.mockResolvedValueOnce({ codes: ['CODE1'] });
		const onTwoFactorVerify = vi.fn().mockResolvedValue(undefined);
		const onComplete = vi.fn();

		setup({ onComplete }, { onTwoFactorSetup, onTwoFactorVerify });

		// Go through flow
		await fireEvent.click(screen.getByRole('button', { name: 'Enable Two-Factor Authentication' }));
		await screen.findByText('Step 1 of 2: Scan QR code');

		await fireEvent.input(screen.getByLabelText('Verification Code'), {
			target: { value: '123456' },
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Verify and Continue' }));
		await screen.findByText('Step 2 of 2: Save your backup codes');

		// Finish
		await fireEvent.click(screen.getByRole('button', { name: 'Done' }));

		expect(onComplete).toHaveBeenCalledWith(['CODE1']);
	});
});
