import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import LoginForm from '../src/LoginForm.svelte';
import TestWrapper from './fixtures/TestWrapper.svelte';
import type { AuthHandlers } from '../src/context.js';

describe('LoginForm', () => {
	const defaultHandlers: AuthHandlers = {
		onLogin: vi.fn(),
		onWebAuthnLogin: vi.fn(),
		onNavigateToForgotPassword: vi.fn(),
		onNavigateToRegister: vi.fn(),
	};

	function setup(props = {}, handlers = {}, initialState = {}) {
		const mergedHandlers = { ...defaultHandlers, ...handlers };
		
		const { component, rerender } = render(TestWrapper, {
			component: LoginForm,
			handlers: mergedHandlers,
			initialState,
			...props
		});

		return { handlers: mergedHandlers, component, rerender };
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly', () => {
		setup();
		expect(screen.getByLabelText(/email/i)).toBeTruthy();
		expect(screen.getByLabelText(/password/i)).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
		expect(screen.getByText('Remember me')).toBeTruthy();
		expect(screen.getByText('Forgot password?')).toBeTruthy();
		expect(screen.getByText('Sign up')).toBeTruthy();
	});

	it('validates empty inputs', async () => {
		const { handlers } = setup();

		const button = screen.getByRole('button', { name: 'Sign In' }) as HTMLButtonElement;
		expect(button.disabled).toBe(true);

		// Trigger via Enter key since button is disabled
		await fireEvent.keyDown(screen.getByLabelText(/email/i), { key: 'Enter' });

		expect(screen.getByText('Email is required')).toBeTruthy();
		expect(screen.getByText('Password is required')).toBeTruthy();
		expect(handlers.onLogin).not.toHaveBeenCalled();
	});

	it('validates invalid email', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
		await fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

		expect(screen.getByText('Invalid email format')).toBeTruthy();
		expect(handlers.onLogin).not.toHaveBeenCalled();
	});

	it('submits with valid credentials', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
		await fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

		expect(handlers.onLogin).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'password123',
			remember: false,
		});
	});

	it('toggles remember me', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
		await fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
		await fireEvent.click(screen.getByLabelText(/remember me/i));
		await fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

		expect(handlers.onLogin).toHaveBeenCalledWith(expect.objectContaining({
			remember: true
		}));
	});

	it('handles webauthn login', async () => {
		const { handlers } = setup();

		await fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
		await fireEvent.click(screen.getByRole('button', { name: /sign in with biometric/i }));

		expect(handlers.onWebAuthnLogin).toHaveBeenCalledWith({
			email: 'user@example.com'
		});
	});

	it('validates email before webauthn', async () => {
		const { handlers } = setup();

		await fireEvent.click(screen.getByRole('button', { name: /sign in with biometric/i }));

		expect(screen.getByText('Email is required for WebAuthn')).toBeTruthy();
		expect(handlers.onWebAuthnLogin).not.toHaveBeenCalled();
	});

	it('displays server error', () => {
		setup({}, {}, { error: 'Invalid credentials' });
		
		expect(screen.getByRole('alert').textContent).toContain('Invalid credentials');
	});

	it('disables inputs when loading', () => {
		setup({}, {}, { loading: true });

		expect((screen.getByLabelText(/email/i) as HTMLInputElement).disabled).toBe(true);
		expect((screen.getByLabelText(/password/i) as HTMLInputElement).disabled).toBe(true);
		expect((screen.getByRole('button', { name: /signing in/i }) as HTMLButtonElement).disabled).toBe(true);
	});

	it('navigates to forgot password', async () => {
		const { handlers } = setup();
		
		await fireEvent.click(screen.getByText('Forgot password?'));
		
		expect(handlers.onNavigateToForgotPassword).toHaveBeenCalled();
	});

	it('navigates to register', async () => {
		const { handlers } = setup();
		
		await fireEvent.click(screen.getByText('Sign up'));
		
		expect(handlers.onNavigateToRegister).toHaveBeenCalled();
	});
	
	it('hides options when configured', () => {
		setup({ 
			showWebAuthn: false, 
			showRememberMe: false, 
			showForgotPassword: false, 
			showRegisterLink: false 
		});

		expect(screen.queryByText(/sign in with biometric/i)).toBeNull();
		expect(screen.queryByText('Remember me')).toBeNull();
		expect(screen.queryByText('Forgot password?')).toBeNull();
		expect(screen.queryByText('Sign up')).toBeNull();
	});
});
