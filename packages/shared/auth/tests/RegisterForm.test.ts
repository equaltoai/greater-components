import { describe, it, expect, beforeEach, vi, expectTypeOf } from 'vitest';
import {
	type AuthHandlers,
	type AuthState,
	type RegisterData,
	isValidEmail,
	isValidPassword,
	isValidUsername,
} from '../src/context.js';

const defaultAuthState: AuthState = {
	authenticated: false,
	user: null,
	loading: false,
	error: null,
	requiresTwoFactor: false,
	twoFactorSession: undefined,
};

interface RegisterHarnessOptions {
	initialState?: Partial<AuthState>;
	requireInvite?: boolean;
	handlers?: Partial<AuthHandlers>;
}

function createRegisterFormHarness(options: RegisterHarnessOptions = {}) {
	const state: AuthState = { ...defaultAuthState, ...options.initialState };
	const handlers: AuthHandlers = {
		...options.handlers,
	};

	const requireInvite = options.requireInvite ?? false;

	const updateState = vi.fn((partial: Partial<AuthState>) => {
		Object.assign(state, partial);
	});
	const clearError = vi.fn(() => {
		state.error = null;
	});

	let email = '';
	let username = '';
	let displayName = '';
	let password = '';
	let confirmPassword = '';
	let inviteCode = '';
	let agreeToTerms = false;

	let emailError: string | null = null;
	let usernameError: string | null = null;
	let passwordError: string | null = null;
	let confirmPasswordError: string | null = null;
	let inviteError: string | null = null;
	let termsError: string | null = null;

	function setEmail(value: string) {
		email = value;
	}

	function setUsername(value: string) {
		username = value;
	}

	function setDisplayName(value: string) {
		displayName = value;
	}

	function setPassword(value: string) {
		password = value;
	}

	function setConfirmPassword(value: string) {
		confirmPassword = value;
	}

	function setInviteCode(value: string) {
		inviteCode = value;
	}

	function setAgreeToTerms(value: boolean) {
		agreeToTerms = value;
	}

	function validateForm(): boolean {
		emailError = null;
		usernameError = null;
		passwordError = null;
		confirmPasswordError = null;
		inviteError = null;
		termsError = null;

		let valid = true;

		const trimmedEmail = email.trim();
		if (!trimmedEmail) {
			emailError = 'Email is required';
			valid = false;
		} else if (!isValidEmail(trimmedEmail)) {
			emailError = 'Invalid email format';
			valid = false;
		}

		const trimmedUsername = username.trim();
		if (!trimmedUsername) {
			usernameError = 'Username is required';
			valid = false;
		} else {
			const validation = isValidUsername(trimmedUsername);
			if (!validation.valid) {
				usernameError = validation.message || 'Invalid username';
				valid = false;
			}
		}

		if (!password) {
			passwordError = 'Password is required';
			valid = false;
		} else {
			const validation = isValidPassword(password);
			if (!validation.valid) {
				passwordError = validation.message || 'Invalid password';
				valid = false;
			}
		}

		if (!confirmPassword) {
			confirmPasswordError = 'Please confirm your password';
			valid = false;
		} else if (password !== confirmPassword) {
			confirmPasswordError = 'Passwords do not match';
			valid = false;
		}

		if (requireInvite && !inviteCode.trim()) {
			inviteError = 'Invite code is required';
			valid = false;
		}

		if (!agreeToTerms) {
			termsError = 'You must agree to the terms to continue';
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
			const data: RegisterData = {
				email: email.trim(),
				username: username.trim(),
				displayName: displayName.trim() || undefined,
				password,
				agreeToTerms: true,
				inviteCode: requireInvite ? inviteCode.trim() || undefined : undefined,
			};

			await handlers.onRegister?.(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Registration failed';
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

	function navigateToLogin() {
		if (state.loading) return;
		handlers.onNavigateToLogin?.();
	}

	return {
		setEmail,
		setUsername,
		setDisplayName,
		setPassword,
		setConfirmPassword,
		setInviteCode,
		setAgreeToTerms,
		validateForm,
		handleSubmit,
		handleKeyDown,
		navigateToLogin,
		requireInvite,
		getErrors: () => ({
			emailError,
			usernameError,
			passwordError,
			confirmPasswordError,
			inviteError,
			termsError,
		}),
		getState: () => state,
		getUpdateStateCalls: () => updateState.mock.calls,
		getClearErrorCalls: () => clearError.mock.calls,
		handlers,
	};
}

describe('Auth.RegisterForm logic', () => {
	let harness: ReturnType<typeof createRegisterFormHarness>;

	beforeEach(() => {
		harness = createRegisterFormHarness();
	});

	it('requires email input', () => {
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().emailError).toBe('Email is required');
	});

	it('validates email format', () => {
		harness.setEmail('invalid');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().emailError).toBe('Invalid email format');
	});

	it('validates username presence', () => {
		harness.setEmail('user@example.com');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().usernameError).toBe('Username is required');
	});

	it('enforces username character rules', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('bad name!');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().usernameError).toBe(
			'Username can only contain letters, numbers, and underscores'
		);
	});

	it('enforces username length bounds', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('ab');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().usernameError).toBe('Username must be at least 3 characters');
	});

	it('validates password strength', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('weak');
		harness.setConfirmPassword('weak');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().passwordError).toBe('Password must be at least 8 characters');
	});

	it('validates confirm password presence', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().confirmPasswordError).toBe('Please confirm your password');
	});

	it('detects password mismatch', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password2');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().confirmPasswordError).toBe('Passwords do not match');
	});

	it('requires invite code when configured', () => {
		harness = createRegisterFormHarness({ requireInvite: true });
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().inviteError).toBe('Invite code is required');
	});

	it('requires agreeing to terms', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().termsError).toBe('You must agree to the terms to continue');
	});

	it('submits registration data with trimmed fields', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('  user@example.com ');
		harness.setUsername(' alice ');
		harness.setDisplayName(' Display Name ');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith({
			email: 'user@example.com',
			username: 'alice',
			displayName: 'Display Name',
			password: 'Password1',
			agreeToTerms: true,
			inviteCode: undefined,
		});
		expect(harness.getUpdateStateCalls()).toEqual([[{ loading: true }], [{ loading: false }]]);
	});

	it('passes invite code when required', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({
			requireInvite: true,
			handlers: { onRegister },
		});

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setInviteCode(' INV123 ');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith({
			email: 'user@example.com',
			username: 'alice',
			displayName: undefined,
			password: 'Password1',
			agreeToTerms: true,
			inviteCode: 'INV123',
		});
	});

	it('records registration errors from handler', async () => {
		const onRegister = vi.fn().mockRejectedValue(new Error('Registration failed'));
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(harness.getState().error).toBe('Registration failed');
	});

	it('prevents submission during loading', async () => {
		const onRegister = vi.fn();
		harness = createRegisterFormHarness({
			handlers: { onRegister },
			initialState: { loading: true },
		});

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).not.toHaveBeenCalled();
		expect(harness.getClearErrorCalls()).toEqual([]);
	});

	it('submits via enter key when valid', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleKeyDown('Enter');

		expect(onRegister).toHaveBeenCalledTimes(1);
	});

	it('navigates to login when requested', () => {
		const onNavigateToLogin = vi.fn();
		harness = createRegisterFormHarness({
			handlers: { onNavigateToLogin },
		});

		harness.navigateToLogin();

		expect(onNavigateToLogin).toHaveBeenCalledTimes(1);
	});

	it('validates RegisterData typing expectations', () => {
		const payload: RegisterData = {
			email: 'user@example.com',
			username: 'alice',
			password: 'Password1',
			agreeToTerms: true,
		};

		expectTypeOf(payload.email).toBeString();
		expectTypeOf(payload.inviteCode).toEqualTypeOf<string | undefined>();
	});

	// Additional comprehensive tests
	it('omits empty displayName from submission', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setDisplayName('');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		const call = onRegister.mock.calls[0][0];
		expect(call.displayName).toBeUndefined();
	});

	it('omits whitespace-only displayName', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setDisplayName('   ');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		const call = onRegister.mock.calls[0][0];
		expect(call.displayName).toBeUndefined();
	});

	it('validates multiple email formats', () => {
		const validEmails = [
			'user@example.com',
			'user.name@example.com',
			'user+tag@subdomain.example.com',
		];

		validEmails.forEach((email) => {
			harness.setEmail(email);
			harness.setUsername('testuser');
			harness.setPassword('Password123');
			harness.setConfirmPassword('Password123');
			harness.setAgreeToTerms(true);
			expect(harness.validateForm()).toBe(true);
		});
	});

	it('trims whitespace from all fields', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('  user@example.com  ');
		harness.setUsername('  alice  ');
		harness.setDisplayName('  Alice Name  ');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				email: 'user@example.com',
				username: 'alice',
				displayName: 'Alice Name',
			})
		);
	});

	it('accepts minimum valid password', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Passw0rd'); // 8 chars with upper, lower, digit
		harness.setConfirmPassword('Passw0rd');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(true);
	});

	it('accepts long password', () => {
		const longPass = 'A1a' + 'x'.repeat(125); // uppercase, number, lowercase + padding
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword(longPass);
		harness.setConfirmPassword(longPass);
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(true);
	});

	it('validates username with underscores', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('user_name_123');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(true);
	});

	it('validates username with numbers', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('user123');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(true);
	});

	it('accepts minimum length username', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('abc'); // 3 chars minimum
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(true);
	});

	it('clears errors before submission', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(harness.getClearErrorCalls()).toHaveLength(1);
	});

	it('clears previous validation errors on revalidation', () => {
		// First validation fails
		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().emailError).toBeTruthy();

		// Set valid values and revalidate
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(true);
		const errors = harness.getErrors();
		expect(errors.emailError).toBeNull();
		expect(errors.usernameError).toBeNull();
		expect(errors.passwordError).toBeNull();
		expect(errors.confirmPasswordError).toBeNull();
		expect(errors.termsError).toBeNull();
	});

	it('handles non-Error exceptions', async () => {
		const onRegister = vi.fn().mockRejectedValue('String error');
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(harness.getState().error).toBe('Registration failed');
	});

	it('ignores non-Enter keypress', async () => {
		const onRegister = vi.fn();
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleKeyDown('Escape');
		await harness.handleKeyDown('Tab');

		expect(onRegister).not.toHaveBeenCalled();
	});

	it('prevents Enter key submission when loading', async () => {
		const onRegister = vi.fn();
		harness = createRegisterFormHarness({
			handlers: { onRegister },
			initialState: { loading: true },
		});

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleKeyDown('Enter');

		expect(onRegister).not.toHaveBeenCalled();
	});

	it('prevents navigation during loading', () => {
		const onNavigateToLogin = vi.fn();
		harness = createRegisterFormHarness({
			handlers: { onNavigateToLogin },
			initialState: { loading: true },
		});

		harness.navigateToLogin();

		expect(onNavigateToLogin).not.toHaveBeenCalled();
	});

	it('does not submit without agreeing to terms', async () => {
		const onRegister = vi.fn();
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(false);

		await harness.handleSubmit();

		expect(onRegister).not.toHaveBeenCalled();
	});

	it('validates all fields simultaneously', () => {
		expect(harness.validateForm()).toBe(false);
		const errors = harness.getErrors();
		expect(errors.emailError).toBe('Email is required');
		expect(errors.usernameError).toBe('Username is required');
		expect(errors.passwordError).toBe('Password is required');
		expect(errors.confirmPasswordError).toBe('Please confirm your password');
		expect(errors.termsError).toBe('You must agree to the terms to continue');
	});

	it('omits invite code when not required', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setInviteCode('CODE123'); // Set but not required
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		const call = onRegister.mock.calls[0][0];
		expect(call.inviteCode).toBeUndefined();
	});

	it('handles empty invite code when required', () => {
		harness = createRegisterFormHarness({ requireInvite: true });
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setInviteCode('');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().inviteError).toBe('Invite code is required');
	});

	it('handles whitespace-only invite code when required', () => {
		harness = createRegisterFormHarness({ requireInvite: true });
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setInviteCode('   ');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().inviteError).toBe('Invite code is required');
	});

	it('preserves password with special characters', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		const specialPass = 'P@ssw0rd!#$%';
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword(specialPass);
		harness.setConfirmPassword(specialPass);
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				password: specialPass,
			})
		);
	});

	it('detects case-sensitive password mismatch', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().confirmPasswordError).toBe('Passwords do not match');
	});

	it('requires both password fields', () => {
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);
		expect(harness.getErrors().passwordError).toBe('Password is required');
		expect(harness.getErrors().confirmPasswordError).toBe('Please confirm your password');
	});

	it('handles rapid state changes', () => {
		for (let i = 0; i < 10; i++) {
			harness.setEmail(`user${i}@example.com`);
			harness.setUsername(`user${i}`);
			harness.setPassword(`Password${i}`);
			harness.setConfirmPassword(`Password${i}`);
			harness.setAgreeToTerms(i % 2 === 0);
		}

		// Final state: i=9, so agreeToTerms = false (9 % 2 === 0 is false)
		// Set it to true for valid state
		harness.setAgreeToTerms(true);
		expect(harness.validateForm()).toBe(true);
	});

	it('handles empty handler object', async () => {
		harness = createRegisterFormHarness({ handlers: {} });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();
		// Should complete without error
	});

	it('preserves case-sensitive email', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('User@Example.COM');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				email: 'User@Example.COM',
			})
		);
	});

	it('always sets agreeToTerms to true in submission', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				agreeToTerms: true,
			})
		);
	});
});

describe('Auth.RegisterForm - Edge Cases', () => {
	it('handles very long username', () => {
		const harness = createRegisterFormHarness();
		const longUsername = 'a'.repeat(100);

		harness.setEmail('user@example.com');
		harness.setUsername(longUsername);
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		// Validation result depends on isValidUsername implementation
		harness.validateForm();
	});

	it('handles very long email', () => {
		const harness = createRegisterFormHarness();
		const longEmail = 'a'.repeat(100) + '@example.com';

		harness.setEmail(longEmail);
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		harness.validateForm();
	});

	it('handles unicode in display name', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		const harness = createRegisterFormHarness({ handlers: { onRegister } });

		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setDisplayName('Alice 🎉 User');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				displayName: 'Alice 🎉 User',
			})
		);
	});
});

describe('Auth.RegisterForm - Integration', () => {
	it('completes full registration flow', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		const harness = createRegisterFormHarness({ handlers: { onRegister } });

		// User fills form
		harness.setEmail('newuser@example.com');
		harness.setUsername('newuser');
		harness.setDisplayName('New User');
		harness.setPassword('SecurePass123');
		harness.setConfirmPassword('SecurePass123');
		harness.setAgreeToTerms(true);

		// Validation passes
		expect(harness.validateForm()).toBe(true);

		// Submission occurs
		await harness.handleSubmit();

		// Handler called correctly
		expect(onRegister).toHaveBeenCalledWith({
			email: 'newuser@example.com',
			username: 'newuser',
			displayName: 'New User',
			password: 'SecurePass123',
			agreeToTerms: true,
			inviteCode: undefined,
		});

		// State transitions
		expect(harness.getUpdateStateCalls()).toEqual([[{ loading: true }], [{ loading: false }]]);
	});

	it('handles failed registration and retry', async () => {
		let attempts = 0;
		const onRegister = vi.fn(async () => {
			attempts++;
			if (attempts === 1) {
				throw new Error('Username taken');
			}
		});

		const harness = createRegisterFormHarness({ handlers: { onRegister } });

		// First attempt
		harness.setEmail('user@example.com');
		harness.setUsername('taken');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		await harness.handleSubmit();
		expect(harness.getState().error).toBe('Username taken');

		// Retry with different username
		harness.setUsername('available');
		await harness.handleSubmit();

		expect(harness.getState().error).toBeNull();
		expect(onRegister).toHaveBeenCalledTimes(2);
	});

	it('handles invite-only registration flow', async () => {
		const onRegister = vi.fn().mockResolvedValue(undefined);
		const harness = createRegisterFormHarness({
			requireInvite: true,
			handlers: { onRegister },
		});

		// Without invite fails
		harness.setEmail('user@example.com');
		harness.setUsername('alice');
		harness.setPassword('Password1');
		harness.setConfirmPassword('Password1');
		harness.setAgreeToTerms(true);

		expect(harness.validateForm()).toBe(false);

		// With invite succeeds
		harness.setInviteCode('VALID123');
		expect(harness.validateForm()).toBe(true);

		await harness.handleSubmit();

		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				inviteCode: 'VALID123',
			})
		);
	});
});
