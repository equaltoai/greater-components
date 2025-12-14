import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import RegisterForm from '../src/RegisterForm.svelte';
import TestWrapper from './fixtures/TestWrapper.svelte';
import type { AuthHandlers } from '../src/context.js';

describe('RegisterForm', () => {
	const defaultHandlers: AuthHandlers = {
		onRegister: vi.fn(),
		onNavigateToLogin: vi.fn(),
	};

	function setup(props = {}, handlers = {}, initialState = {}) {
		const mergedHandlers = { ...defaultHandlers, ...handlers };

		const { component, rerender } = render(TestWrapper, {
			component: RegisterForm,
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
		expect(screen.getByLabelText(/email/i)).toBeTruthy();
		expect(screen.getByLabelText(/^username/i)).toBeTruthy();
		expect(screen.getByLabelText(/display name/i)).toBeTruthy();
		expect(screen.getByLabelText(/^password/i)).toBeTruthy();
		expect(screen.getByLabelText(/confirm password/i)).toBeTruthy();
		expect(screen.getByText(/agree to the/i)).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Create Account' })).toBeTruthy();
		expect(screen.getByText('Sign in')).toBeTruthy();
	});

	it('validates empty inputs', async () => {
		const { handlers } = setup();

		// Button should be disabled initially because terms are not checked
		const button = screen.getByRole('button', { name: 'Create Account' }) as HTMLButtonElement;
		expect(button.disabled).toBe(true);

		// Check terms to enable button (partially, form still invalid)
		await fireEvent.click(screen.getByRole('checkbox'));

		// Attempt submit via Enter on email
		await fireEvent.keyDown(screen.getByLabelText(/email/i), { key: 'Enter' });

		expect(screen.getByText('Email is required')).toBeTruthy();
		expect(screen.getByText('Username is required')).toBeTruthy();
		expect(screen.getByText('Password is required')).toBeTruthy();
		expect(screen.getByText('Please confirm your password')).toBeTruthy();
		expect(handlers.onRegister).not.toHaveBeenCalled();
	});

	it('validates invalid email', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
		await fireEvent.click(screen.getByRole('checkbox')); // Agree terms
		await fireEvent.keyDown(screen.getByLabelText(/email/i), { key: 'Enter' });

		expect(screen.getByText('Invalid email format')).toBeTruthy();
		expect(handlers.onRegister).not.toHaveBeenCalled();
	});

	it('validates password match', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/^password/i), {
			target: { value: 'Password123' },
		});
		await fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: 'Password456' },
		});
		await fireEvent.click(screen.getByRole('checkbox'));
		await fireEvent.keyDown(screen.getByLabelText(/^password/i), { key: 'Enter' });

		expect(screen.getByText('Passwords do not match')).toBeTruthy();
		expect(handlers.onRegister).not.toHaveBeenCalled();
	});

	it('validates terms agreement', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: 'user@example.com' },
		});
		await fireEvent.input(screen.getByLabelText(/^username/i), { target: { value: 'user123' } });
		await fireEvent.input(screen.getByLabelText(/^password/i), {
			target: { value: 'Password123' },
		});
		await fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: 'Password123' },
		});

		// Button should be disabled
		const button = screen.getByRole('button', { name: 'Create Account' }) as HTMLButtonElement;
		expect(button.disabled).toBe(true);

		// Try Enter key
		await fireEvent.keyDown(screen.getByLabelText(/^password/i), { key: 'Enter' });

		expect(screen.getByText('You must agree to the terms to continue')).toBeTruthy();
		expect(handlers.onRegister).not.toHaveBeenCalled();
	});

	it('submits with valid data', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: 'user@example.com' },
		});
		await fireEvent.input(screen.getByLabelText(/^username/i), { target: { value: 'user123' } });
		await fireEvent.input(screen.getByLabelText(/display name/i), {
			target: { value: 'User Name' },
		});
		await fireEvent.input(screen.getByLabelText(/^password/i), {
			target: { value: 'Password123' },
		});
		await fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: 'Password123' },
		});
		await fireEvent.click(screen.getByRole('checkbox')); // Agree terms

		await fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

		expect(handlers.onRegister).toHaveBeenCalledWith({
			email: 'user@example.com',
			username: 'user123',
			displayName: 'User Name',
			password: 'Password123',
			agreeToTerms: true,
			inviteCode: undefined,
		});
	});

	it('requires invite code when configured', async () => {
		const { handlers } = setup({ requireInvite: true });

		expect(screen.getByLabelText(/invite code/i)).toBeTruthy();

		await fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: 'user@example.com' },
		});
		await fireEvent.input(screen.getByLabelText(/^username/i), { target: { value: 'user123' } });
		await fireEvent.input(screen.getByLabelText(/^password/i), {
			target: { value: 'Password123' },
		});
		await fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: 'Password123' },
		});
		await fireEvent.click(screen.getByRole('checkbox'));

		// Try submit without invite code
		await fireEvent.keyDown(screen.getByLabelText(/^password/i), { key: 'Enter' });
		expect(screen.getByText('Invite code is required')).toBeTruthy();

		// Fill invite code and submit
		await fireEvent.input(screen.getByLabelText(/invite code/i), {
			target: { value: 'INVITE123' },
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

		expect(handlers.onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				inviteCode: 'INVITE123',
			})
		);
	});

	it('displays server error', () => {
		setup({}, {}, { error: 'Registration failed' });

		expect(screen.getByRole('alert').textContent).toContain('Registration failed');
	});

	it('disables inputs when loading', () => {
		setup({}, {}, { loading: true });

		expect((screen.getByLabelText(/email/i) as HTMLInputElement).disabled).toBe(true);
		expect((screen.getByLabelText(/^username/i) as HTMLInputElement).disabled).toBe(true);
		expect((screen.getByLabelText(/^password/i) as HTMLInputElement).disabled).toBe(true);
		expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBe(true);

		const button = screen.getByRole('button', { name: /creating account/i }) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('navigates to login', async () => {
		const { handlers } = setup();

		await fireEvent.click(screen.getByText('Sign in'));

		expect(handlers.onNavigateToLogin).toHaveBeenCalled();
	});

	it('hides login link when configured', () => {
		setup({ showLoginLink: false });

		expect(screen.queryByText('Sign in')).toBeNull();
	});
});
