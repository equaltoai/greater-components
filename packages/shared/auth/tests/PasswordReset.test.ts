import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import PasswordReset from '../src/PasswordReset.svelte';

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: (opts: any) => ({
		props: {},
		actions: {
			button: (node: HTMLElement) => {
				if (opts?.onClick) {
					node.addEventListener('click', opts.onClick);
				}
				return {
					destroy: () => {
						if (opts?.onClick) node.removeEventListener('click', opts.onClick);
					},
				};
			},
		},
	}),
}));

const mockUpdateState = vi.fn();
const mockClearError = vi.fn();
const mockOnPasswordResetRequest = vi.fn();
const mockOnPasswordResetConfirm = vi.fn();
const mockOnNavigateToLogin = vi.fn();

const mockContext = {
	state: {
		loading: false,
		error: null,
	},
	handlers: {
		onPasswordResetRequest: mockOnPasswordResetRequest,
		onPasswordResetConfirm: mockOnPasswordResetConfirm,
		onNavigateToLogin: mockOnNavigateToLogin,
	},
	updateState: mockUpdateState,
	clearError: mockClearError,
};

// Mock validators
const mockIsValidEmail = vi.fn((email) => email.includes('@'));
const mockIsValidPassword = vi.fn((pwd) => ({ valid: pwd.length >= 8, message: 'Too short' }));

vi.mock('../src/context.js', () => ({
	getAuthContext: () => mockContext,
	isValidEmail: (e: string) => mockIsValidEmail(e),
	isValidPassword: (p: string) => mockIsValidPassword(p),
}));

describe('PasswordReset', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockContext.state.loading = false;
		mockContext.state.error = null;
	});

	describe('Request Mode', () => {
		it('renders request form', () => {
			render(PasswordReset, { mode: 'request' });

			expect(screen.getByRole('heading', { name: 'Reset your password' })).toBeTruthy();
			expect(screen.getByLabelText(/email/i)).toBeTruthy();
			expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeTruthy();
		});

		it('validates empty email', async () => {
			render(PasswordReset, { mode: 'request' });

			const submitBtn = screen.getByRole('button', { name: /send reset instructions/i });
			// Button is disabled when empty
			expect((submitBtn as HTMLButtonElement).disabled).toBe(true);
		});

		it('validates invalid email on submit', async () => {
			mockIsValidEmail.mockReturnValue(false);
			render(PasswordReset, { mode: 'request', email: 'invalid' });

			const submitBtn = screen.getByRole('button', { name: /send reset instructions/i });
			// If email prop is passed, input has value.
			await fireEvent.click(submitBtn);

			expect(screen.getByText('Invalid email format')).toBeTruthy();
			expect(mockOnPasswordResetRequest).not.toHaveBeenCalled();
		});

		it('submits valid email', async () => {
			mockIsValidEmail.mockReturnValue(true);
			render(PasswordReset, { mode: 'request' });

			const emailInput = screen.getByLabelText(/email/i);
			await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });

			const submitBtn = screen.getByRole('button', { name: /send reset instructions/i });
			await fireEvent.click(submitBtn);

			expect(mockClearError).toHaveBeenCalled();
			expect(mockUpdateState).toHaveBeenCalledWith({ loading: true });
			expect(mockOnPasswordResetRequest).toHaveBeenCalledWith('user@example.com');
		});

		it('shows success state', async () => {
			mockIsValidEmail.mockReturnValue(true);
			render(PasswordReset, { mode: 'request', email: 'user@example.com' });

			const submitBtn = screen.getByRole('button', { name: /send reset instructions/i });
			await fireEvent.click(submitBtn);

			// Should show success UI
			expect(screen.getByRole('heading', { name: 'Check your email' })).toBeTruthy();
			expect(screen.getByText(/sent password reset instructions to/)).toBeTruthy();
		});

		it('handles server error', async () => {
			mockIsValidEmail.mockReturnValue(true);
			mockOnPasswordResetRequest.mockRejectedValueOnce(new Error('User not found'));

			render(PasswordReset, { mode: 'request' });

			const emailInput = screen.getByLabelText(/email/i);
			await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });

			const submitBtn = screen.getByRole('button', { name: /send reset instructions/i });
			await fireEvent.click(submitBtn);

			expect(mockUpdateState).toHaveBeenCalledWith({ error: 'User not found' });
		});
	});

	describe('Confirm Mode', () => {
		it('renders confirm form', () => {
			render(PasswordReset, { mode: 'confirm', token: 'abc' });

			expect(screen.getByRole('heading', { name: 'Create new password' })).toBeTruthy();
			expect(screen.getByLabelText(/^New Password/i)).toBeTruthy();
			expect(screen.getByLabelText(/^Confirm Password/i)).toBeTruthy();
			expect(screen.getByRole('button', { name: /reset password/i })).toBeTruthy();
		});

		it('validates password match', async () => {
			render(PasswordReset, { mode: 'confirm', token: 'abc' });

			const newPwd = screen.getByLabelText(/^New Password/i);
			const confirmPwd = screen.getByLabelText(/^Confirm Password/i);

			await fireEvent.input(newPwd, { target: { value: 'password123' } });
			await fireEvent.input(confirmPwd, { target: { value: 'mismatch' } });

			const submitBtn = screen.getByRole('button', { name: /reset password/i });
			await fireEvent.click(submitBtn);

			expect(screen.getByText('Passwords do not match')).toBeTruthy();
		});

		it('validates password complexity', async () => {
			mockIsValidPassword.mockReturnValue({ valid: false, message: 'Too simple' });
			render(PasswordReset, { mode: 'confirm', token: 'abc' });

			const newPwd = screen.getByLabelText(/^New Password/i);
			const confirmPwd = screen.getByLabelText(/^Confirm Password/i);

			await fireEvent.input(newPwd, { target: { value: '123' } });
			await fireEvent.input(confirmPwd, { target: { value: '123' } });

			const submitBtn = screen.getByRole('button', { name: /reset password/i });
			await fireEvent.click(submitBtn);

			expect(screen.getByText('Too simple')).toBeTruthy();
		});

		it('submits valid password reset', async () => {
			mockIsValidPassword.mockReturnValue({ valid: true, message: 'OK' });
			render(PasswordReset, { mode: 'confirm', token: 'abc' });

			const newPwd = screen.getByLabelText(/^New Password/i);
			const confirmPwd = screen.getByLabelText(/^Confirm Password/i);

			await fireEvent.input(newPwd, { target: { value: 'ValidPass1!' } });
			await fireEvent.input(confirmPwd, { target: { value: 'ValidPass1!' } });

			const submitBtn = screen.getByRole('button', { name: /reset password/i });
			await fireEvent.click(submitBtn);

			expect(mockOnPasswordResetConfirm).toHaveBeenCalledWith({
				email: '',
				token: 'abc',
				newPassword: 'ValidPass1!',
			});
		});
	});

	it('navigates to login', async () => {
		render(PasswordReset, { mode: 'request' });

		const loginBtn = screen.getByRole('button', { name: /sign in/i });
		await fireEvent.click(loginBtn);

		expect(mockOnNavigateToLogin).toHaveBeenCalled();
	});
});
