import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	type AuthHandlers,
	type AuthState,
	type LoginCredentials,
	isValidEmail,
} from '../../src/components/Auth/context.js';

const defaultAuthState: AuthState = {
	authenticated: false,
	user: null,
	loading: false,
	error: null,
	requiresTwoFactor: false,
	twoFactorSession: undefined,
};

interface LoginHarnessOptions {
	initialState?: Partial<AuthState>;
	handlers?: Partial<AuthHandlers>;
}

function createLoginFormHarness(options: LoginHarnessOptions = {}) {
	const state: AuthState = { ...defaultAuthState, ...options.initialState };
	const handlers: AuthHandlers = {
		...options.handlers,
	};

	const updateState = vi.fn((partial: Partial<AuthState>) => {
		Object.assign(state, partial);
	});
	const clearError = vi.fn(() => {
		state.error = null;
	});

	let email = '';
	let password = '';
	let remember = false;
	let emailError: string | null = null;
	let passwordError: string | null = null;

	function setEmail(value: string) {
		email = value;
	}

	function setPassword(value: string) {
		password = value;
	}

	function setRemember(value: boolean) {
		remember = value;
	}

	function validateForm(): boolean {
		emailError = null;
		passwordError = null;
		let valid = true;

		const trimmedEmail = email.trim();

		if (!trimmedEmail) {
			emailError = 'Email is required';
			valid = false;
		} else if (!isValidEmail(trimmedEmail)) {
			emailError = 'Invalid email format';
			valid = false;
		}

		if (!password.trim()) {
			passwordError = 'Password is required';
			valid = false;
		}

		return valid;
	}

	async function handleSubmit() {
		if (state.loading) return;

		clearError();

		if (!validateForm()) return;

		updateState({ loading: true });

		try {
			const credentials: LoginCredentials = {
				email: email.trim(),
				password,
				remember,
			};

			await handlers.onLogin?.(credentials);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Login failed';
			updateState({ error: message });
		} finally {
			updateState({ loading: false });
		}
	}

	async function handleWebAuthn() {
		if (state.loading) return;

		clearError();

		const trimmedEmail = email.trim();
		if (!trimmedEmail) {
			emailError = 'Email is required for WebAuthn';
			return;
		}

		if (!isValidEmail(trimmedEmail)) {
			emailError = 'Invalid email format';
			return;
		}

		updateState({ loading: true });

		try {
			await handlers.onWebAuthnLogin?.({ email: trimmedEmail });
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'WebAuthn login failed';
			updateState({ error: message });
		} finally {
			updateState({ loading: false });
		}
	}

	async function handleKeyDown(key: string) {
		if (key === 'Enter' && !state.loading) {
			await handleSubmit();
		}
	}

	function triggerForgotPassword() {
		if (state.loading) return;
		handlers.onNavigateToForgotPassword?.();
	}

	function triggerRegistration() {
		if (state.loading) return;
		handlers.onNavigateToRegister?.();
	}

	return {
		setEmail,
		setPassword,
		setRemember,
		validateForm,
		handleSubmit,
		handleWebAuthn,
		handleKeyDown,
		triggerForgotPassword,
		triggerRegistration,
		getErrors: () => ({ emailError, passwordError }),
		getState: () => state,
		getUpdateStateCalls: () => updateState.mock.calls,
		getClearErrorCalls: () => clearError.mock.calls,
		handlers,
	};
}

describe('Auth.LoginForm logic', () => {
	let harness: ReturnType<typeof createLoginFormHarness>;

	beforeEach(() => {
		harness = createLoginFormHarness();
	});

	it('validates email presence', () => {
		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().emailError).toBe('Email is required');
	});

	it('validates email format', () => {
		harness.setEmail('invalid-email');
		harness.setPassword('password123');

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().emailError).toBe('Invalid email format');
	});

	it('validates password presence', () => {
		harness.setEmail('user@example.com');

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().passwordError).toBe('Password is required');
	});

	it('submits trimmed credentials and remember state', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('  user@example.com ');
		harness.setPassword('password123');
		harness.setRemember(true);

		await harness.handleSubmit();

		expect(onLogin).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'password123',
			remember: true,
		});
		expect(harness.getUpdateStateCalls()).toEqual([
			[{ loading: true }],
			[{ loading: false }],
		]);
	});

	it('does not submit when validation fails', async () => {
		const onLogin = vi.fn();
		harness = createLoginFormHarness({ handlers: { onLogin } });

		await harness.handleSubmit();

		expect(onLogin).not.toHaveBeenCalled();
		expect(harness.getUpdateStateCalls()).toEqual([]);
	});

	it('prevents submission while loading', async () => {
		const onLogin = vi.fn();
		harness = createLoginFormHarness({
			handlers: { onLogin },
			initialState: { loading: true },
		});

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleSubmit();

		expect(onLogin).not.toHaveBeenCalled();
		expect(harness.getClearErrorCalls()).toEqual([]);
	});

	it('stores handler error message', async () => {
		const onLogin = vi.fn().mockRejectedValue(new Error('Login failed'));
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleSubmit();

		expect(harness.getState().error).toBe('Login failed');
	});

	it('requires email before WebAuthn', async () => {
		await harness.handleWebAuthn();

		expect(harness.getErrors().emailError).toBe(
			'Email is required for WebAuthn',
		);
	});

	it('validates WebAuthn email format', async () => {
		harness.setEmail('invalid');

		await harness.handleWebAuthn();

		expect(harness.getErrors().emailError).toBe('Invalid email format');
	});

	it('invokes WebAuthn handler with trimmed email', async () => {
		const onWebAuthnLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onWebAuthnLogin } });

		harness.setEmail('  user@example.com ');

		await harness.handleWebAuthn();

		expect(onWebAuthnLogin).toHaveBeenCalledWith({ email: 'user@example.com' });
		expect(harness.getUpdateStateCalls()).toEqual([
			[{ loading: true }],
			[{ loading: false }],
		]);
	});

	it('records WebAuthn failure message', async () => {
		const onWebAuthnLogin = vi
			.fn()
			.mockRejectedValue(new Error('Hardware error'));
		harness = createLoginFormHarness({ handlers: { onWebAuthnLogin } });

		harness.setEmail('user@example.com');

		await harness.handleWebAuthn();

		expect(harness.getState().error).toBe('Hardware error');
	});

	it('submits on enter key press', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleKeyDown('Enter');

		expect(onLogin).toHaveBeenCalledTimes(1);
	});

	it('ignores enter key when loading', async () => {
		const onLogin = vi.fn();
		harness = createLoginFormHarness({
			handlers: { onLogin },
			initialState: { loading: true },
		});

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleKeyDown('Enter');

		expect(onLogin).not.toHaveBeenCalled();
	});

	it('routes to forgot password when available', () => {
		const onNavigateToForgotPassword = vi.fn();
		harness = createLoginFormHarness({
			handlers: { onNavigateToForgotPassword },
		});

		harness.triggerForgotPassword();

		expect(onNavigateToForgotPassword).toHaveBeenCalledTimes(1);
	});

	it('does not trigger navigation when loading', () => {
		const onNavigateToRegister = vi.fn();
		harness = createLoginFormHarness({
			handlers: { onNavigateToRegister },
			initialState: { loading: true },
		});

		harness.triggerRegistration();

		expect(onNavigateToRegister).not.toHaveBeenCalled();
	});

	// Additional comprehensive tests
	it('trims whitespace from email during validation', () => {
		harness.setEmail('   user@example.com   ');
		harness.setPassword('password123');

		expect(harness.validateForm()).toBe(true);
		expect(harness.getErrors().emailError).toBeNull();
	});

	it('validates various valid email formats', () => {
		const validEmails = [
			'user@example.com',
			'user.name@example.com',
			'user+tag@example.co.uk',
			'user_name@example-domain.com',
		];

		validEmails.forEach(email => {
			harness.setEmail(email);
			harness.setPassword('password');
			expect(harness.validateForm()).toBe(true);
		});
	});

	it('rejects various invalid email formats', () => {
		const invalidEmails = [
			'invalid',
			'@example.com',
			'user@',
			'user @example.com',
		];

		invalidEmails.forEach(email => {
			harness.setEmail(email);
			harness.setPassword('password');
			expect(harness.validateForm()).toBe(false);
			expect(harness.getErrors().emailError).toBe('Invalid email format');
		});
	});

	it('accepts password with special characters', () => {
		harness.setEmail('user@example.com');
		harness.setPassword('P@ssw0rd!#$%');

		expect(harness.validateForm()).toBe(true);
	});

	it('accepts very long password', () => {
		harness.setEmail('user@example.com');
		harness.setPassword('a'.repeat(100));

		expect(harness.validateForm()).toBe(true);
	});

	it('rejects whitespace-only password', () => {
		harness.setEmail('user@example.com');
		harness.setPassword('   ');

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().passwordError).toBe('Password is required');
	});

	it('clears errors before new submission', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleSubmit();

		expect(harness.getClearErrorCalls()).toHaveLength(1);
	});

	it('handles non-Error exceptions', async () => {
		const onLogin = vi.fn().mockRejectedValue('String error');
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleSubmit();

		expect(harness.getState().error).toBe('Login failed');
	});

	it('handles login with remember=false', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');
		harness.setRemember(false);

		await harness.handleSubmit();

		expect(onLogin).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'password123',
			remember: false,
		});
	});

	it('toggles remember me state', () => {
		harness.setRemember(false);
		harness.setRemember(true);
		harness.setRemember(false);
		// No assertion needed, just verify no errors
	});

	it('prevents WebAuthn when loading', async () => {
		const onWebAuthnLogin = vi.fn();
		harness = createLoginFormHarness({
			handlers: { onWebAuthnLogin },
			initialState: { loading: true },
		});

		harness.setEmail('user@example.com');

		await harness.handleWebAuthn();

		expect(onWebAuthnLogin).not.toHaveBeenCalled();
	});

	it('handles WebAuthn non-Error exceptions', async () => {
		const onWebAuthnLogin = vi.fn().mockRejectedValue('Hardware unavailable');
		harness = createLoginFormHarness({ handlers: { onWebAuthnLogin } });

		harness.setEmail('user@example.com');

		await harness.handleWebAuthn();

		expect(harness.getState().error).toBe('WebAuthn login failed');
	});

	it('clears errors before WebAuthn', async () => {
		const onWebAuthnLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onWebAuthnLogin } });

		harness.setEmail('user@example.com');

		await harness.handleWebAuthn();

		expect(harness.getClearErrorCalls()).toHaveLength(1);
	});

	it('ignores non-Enter key presses', async () => {
		const onLogin = vi.fn();
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleKeyDown('Escape');
		await harness.handleKeyDown('Tab');
		await harness.handleKeyDown('A');

		expect(onLogin).not.toHaveBeenCalled();
	});

	it('does not trigger forgot password without handler', () => {
		// No handler provided
		expect(() => harness.triggerForgotPassword()).not.toThrow();
	});

	it('does not trigger registration without handler', () => {
		// No handler provided
		expect(() => harness.triggerRegistration()).not.toThrow();
	});

	it('validates both fields simultaneously', () => {
		expect(harness.validateForm()).toBe(false);
		const errors = harness.getErrors();
		expect(errors.emailError).toBe('Email is required');
		expect(errors.passwordError).toBe('Password is required');
	});

	it('clears previous validation errors on revalidation', () => {
		// First validation fails
		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().emailError).toBeTruthy();

		// Set valid email and revalidate
		harness.setEmail('user@example.com');
		harness.setPassword('password123');
		expect(harness.validateForm()).toBe(true);
		expect(harness.getErrors().emailError).toBeNull();
		expect(harness.getErrors().passwordError).toBeNull();
	});

	it('handles successful login without error', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleSubmit();

		expect(harness.getState().error).toBeNull();
	});

	it('handles case-sensitive email', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('User@Example.COM');
		harness.setPassword('password123');

		await harness.handleSubmit();

		expect(onLogin).toHaveBeenCalledWith({
			email: 'User@Example.COM',
			password: 'password123',
			remember: false,
		});
	});

	it('preserves password with leading/trailing spaces', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('  password  ');

		await harness.handleSubmit();

		expect(onLogin).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: '  password  ',
			remember: false,
		});
	});

	it('handles multiple validation failures', () => {
		harness.setEmail('invalid-email');
		harness.setPassword('');

		expect(harness.validateForm()).toBe(false);
		const errors = harness.getErrors();
		expect(errors.emailError).toBe('Invalid email format');
		expect(errors.passwordError).toBe('Password is required');
	});

	it('accepts minimum valid inputs', () => {
		harness.setEmail('a@b.c');
		harness.setPassword('p');

		expect(harness.validateForm()).toBe(true);
	});

	it('handles rapid state changes', () => {
		for (let i = 0; i < 10; i++) {
			harness.setEmail(`user${i}@example.com`);
			harness.setPassword(`password${i}`);
			harness.setRemember(i % 2 === 0);
		}

		expect(harness.validateForm()).toBe(true);
	});

	it('handles empty handler object', async () => {
		harness = createLoginFormHarness({ handlers: {} });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		await harness.handleSubmit();
		// Should complete without error
	});

	it('preserves loading state during submission', async () => {
		const onLogin = vi.fn(async () => {
			// During this promise, loading should be true
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		harness = createLoginFormHarness({ handlers: { onLogin } });

		harness.setEmail('user@example.com');
		harness.setPassword('password123');

		const submitPromise = harness.handleSubmit();

		// Check loading is set immediately
		const calls = harness.getUpdateStateCalls();
		expect(calls[0]).toEqual([{ loading: true }]);

		await submitPromise;

		// Check loading is cleared after
		expect(calls[calls.length - 1]).toEqual([{ loading: false }]);
	});

	it('validates email with international characters', () => {
		harness.setEmail('üser@ëxample.com');
		harness.setPassword('password');

		// Behavior depends on email validator implementation
		harness.validateForm();
		// Just verify it doesn't crash
	});
});

describe('Auth.LoginForm - Edge Cases', () => {
	it('handles very long email', () => {
		const longEmail = 'a'.repeat(100) + '@example.com';
		const harness = createLoginFormHarness();

		harness.setEmail(longEmail);
		harness.setPassword('password');

		harness.validateForm();
		// Should not crash
	});

	it('handles email with multiple @ symbols', () => {
		const harness = createLoginFormHarness();

		harness.setEmail('user@@example.com');
		harness.setPassword('password');

		expect(harness.validateForm()).toBe(false);
	});

	it('handles empty string password after setting value', () => {
		const harness = createLoginFormHarness();

		harness.setPassword('password');
		harness.setPassword('');
		harness.setEmail('user@example.com');

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().passwordError).toBe('Password is required');
	});
});

describe('Auth.LoginForm - Integration', () => {
	it('completes full login flow', async () => {
		const onLogin = vi.fn().mockResolvedValue(undefined);
		const harness = createLoginFormHarness({ handlers: { onLogin } });

		// User enters credentials
		harness.setEmail('user@example.com');
		harness.setPassword('securepassword');
		harness.setRemember(true);

		// Form validates
		expect(harness.validateForm()).toBe(true);

		// Submission occurs
		await harness.handleSubmit();

		// Handler called correctly
		expect(onLogin).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'securepassword',
			remember: true,
		});

		// State transitions correctly
		expect(harness.getUpdateStateCalls()).toEqual([
			[{ loading: true }],
			[{ loading: false }],
		]);
	});

	it('handles failed login and retry', async () => {
		let loginAttempts = 0;
		const onLogin = vi.fn(async () => {
			loginAttempts++;
			if (loginAttempts === 1) {
				throw new Error('Invalid credentials');
			}
		});

		const harness = createLoginFormHarness({ handlers: { onLogin } });

		// First attempt fails
		harness.setEmail('user@example.com');
		harness.setPassword('wrongpassword');
		await harness.handleSubmit();

		expect(harness.getState().error).toBe('Invalid credentials');

		// Second attempt succeeds
		harness.setPassword('correctpassword');
		await harness.handleSubmit();

		expect(harness.getState().error).toBeNull();
		expect(onLogin).toHaveBeenCalledTimes(2);
	});

	it('handles WebAuthn fallback to password', async () => {
		const onWebAuthnLogin = vi.fn().mockRejectedValue(new Error('WebAuthn not available'));
		const onLogin = vi.fn().mockResolvedValue(undefined);

		const harness = createLoginFormHarness({
			handlers: { onWebAuthnLogin, onLogin },
		});

		// Try WebAuthn first
		harness.setEmail('user@example.com');
		await harness.handleWebAuthn();

		expect(harness.getState().error).toBe('WebAuthn not available');

		// Fall back to password
		harness.setPassword('password123');
		await harness.handleSubmit();

		expect(onLogin).toHaveBeenCalled();
	});
});
