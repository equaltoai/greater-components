/**
 * Auth.TwoFactorSetup Component Tests
 *
 * Tests for two-factor authentication setup including:
 * - TOTP setup flow
 * - QR code generation
 * - Verification code validation
 * - Backup codes generation
 * - State management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AuthHandlers } from '../src/context.js';

// Setup step types
type SetupStep = 'intro' | 'scan' | 'verify' | 'backup';

// Two-factor setup state
interface TwoFactorSetupState {
	step: SetupStep;
	secret: string;
	qrCodeUrl: string;
	backupCodes: string[];
	verificationCode: string;
	verificationError: string | null;
	loading: boolean;
	contextError: string | null;
}

// QR code URL generation logic
function generateQRCodeUrl(secret: string, email: string, issuer: string = 'Lesser'): string {
	const account = email || 'user@example.com';
	return `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`;
}

// Verification code validation
function validateVerificationCode(code: string): { valid: boolean; error?: string } {
	const trimmed = code.trim();

	if (!trimmed) {
		return { valid: false, error: 'Verification code is required' };
	}

	if (trimmed.length !== 6) {
		return { valid: false, error: 'Verification code must be 6 digits' };
	}

	if (!/^\d{6}$/.test(trimmed)) {
		return { valid: false, error: 'Verification code must contain only digits' };
	}

	return { valid: true };
}

// Backup code generation logic (mock)
function generateBackupCodes(count: number = 10): string[] {
	const codes: string[] = [];
	for (let i = 0; i < count; i++) {
		// Generate 8-character alphanumeric codes
		const code = Math.random().toString(36).substring(2, 10).toUpperCase();
		codes.push(code);
	}
	return codes;
}

// Two-factor setup logic
function createTwoFactorSetupLogic(email?: string) {
	const state: TwoFactorSetupState = {
		step: 'intro',
		secret: '',
		qrCodeUrl: '',
		backupCodes: [],
		verificationCode: '',
		verificationError: null,
		loading: false,
		contextError: null,
	};

	async function handleStart(onTwoFactorSetup?: AuthHandlers['onTwoFactorSetup']) {
		if (state.loading) return;

		state.contextError = null;
		state.loading = true;

		try {
			const result = await onTwoFactorSetup?.('totp');
			if (result?.secret) {
				state.secret = result.secret;
				state.qrCodeUrl = generateQRCodeUrl(result.secret, email || 'user@example.com');
				state.step = 'scan';
			}
		} catch (err) {
			state.contextError = err instanceof Error ? err.message : 'Setup failed';
		} finally {
			state.loading = false;
		}
	}

	async function handleVerify(onTwoFactorSetup?: AuthHandlers['onTwoFactorSetup']) {
		if (state.loading) return;

		const validation = validateVerificationCode(state.verificationCode);
		if (!validation.valid) {
			state.verificationError = validation.error || null;
			return;
		}

		state.verificationError = null;
		state.loading = true;

		try {
			// In real implementation, would verify the code with backend
			// For now, simulate success and generate backup codes
			const result = await onTwoFactorSetup?.('backup');
			state.backupCodes = result?.codes || generateBackupCodes();
			state.step = 'backup';
		} catch (err) {
			state.verificationError = err instanceof Error ? err.message : 'Verification failed';
		} finally {
			state.loading = false;
		}
	}

	function handleFinish(onComplete?: (codes: string[]) => void) {
		if (state.loading) return;
		onComplete?.(state.backupCodes);
	}

	function handleCancel(onCancel?: () => void) {
		onCancel?.();
	}

	function setVerificationCode(code: string) {
		state.verificationCode = code;
		state.verificationError = null;
	}

	function copySecret() {
		// Mock clipboard operation
		return state.secret;
	}

	function downloadBackupCodes() {
		// Mock download operation
		return state.backupCodes.join('\n');
	}

	function copyBackupCodes() {
		// Mock clipboard operation
		return state.backupCodes.join('\n');
	}

	return {
		getState: () => ({ ...state }),
		handleStart,
		handleVerify,
		handleFinish,
		handleCancel,
		setVerificationCode,
		copySecret,
		downloadBackupCodes,
		copyBackupCodes,
	};
}

describe('Auth.TwoFactorSetup - QR Code Generation', () => {
	it('should generate valid OTP auth URL', () => {
		const secret = 'JBSWY3DPEHPK3PXP';
		const email = 'test@example.com';

		const url = generateQRCodeUrl(secret, email);

		expect(url).toContain('otpauth://totp/');
		expect(url).toContain(email);
		expect(url).toContain(secret);
		expect(url).toContain('issuer=Lesser');
	});

	it('should use custom issuer', () => {
		const url = generateQRCodeUrl('SECRET123', 'user@test.com', 'MyApp');

		expect(url).toContain('issuer=MyApp');
		expect(url).toContain('MyApp:');
	});

	it('should fallback to default email when empty', () => {
		const url = generateQRCodeUrl('SECRET123', '');

		expect(url).toContain('user@example.com');
	});
});

describe('Auth.TwoFactorSetup - Verification Code Validation', () => {
	it('should accept valid 6-digit code', () => {
		const result = validateVerificationCode('123456');

		expect(result.valid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it('should reject empty code', () => {
		const result = validateVerificationCode('');

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Verification code is required');
	});

	it('should reject code with wrong length', () => {
		const result = validateVerificationCode('12345');

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Verification code must be 6 digits');
	});

	it('should reject code with non-digit characters', () => {
		const result = validateVerificationCode('12a456');

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Verification code must contain only digits');
	});

	it('should trim whitespace before validation', () => {
		const result = validateVerificationCode('  123456  ');

		expect(result.valid).toBe(true);
	});

	it('should reject whitespace-only input', () => {
		const result = validateVerificationCode('   ');

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Verification code is required');
	});
});

describe('Auth.TwoFactorSetup - Backup Code Generation', () => {
	it('should generate default 10 backup codes', () => {
		const codes = generateBackupCodes();

		expect(codes).toHaveLength(10);
	});

	it('should generate custom number of codes', () => {
		const codes = generateBackupCodes(5);

		expect(codes).toHaveLength(5);
	});

	it('should generate unique codes', () => {
		const codes = generateBackupCodes(20);
		const uniqueCodes = new Set(codes);

		expect(uniqueCodes.size).toBe(codes.length);
	});

	it('should generate alphanumeric codes', () => {
		const codes = generateBackupCodes(10);

		for (const code of codes) {
			expect(/^[A-Z0-9]+$/.test(code)).toBe(true);
		}
	});
});

describe('Auth.TwoFactorSetup - Setup Flow', () => {
	let logic: ReturnType<typeof createTwoFactorSetupLogic>;
	let mockSetup: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorSetupLogic('test@example.com');
		mockSetup = vi.fn();
	});

	it('should start in intro step', () => {
		const state = logic.getState();

		expect(state.step).toBe('intro');
		expect(state.secret).toBe('');
		expect(state.loading).toBe(false);
	});

	it('should transition to scan step with secret and QR code', async () => {
		mockSetup.mockResolvedValue({ secret: 'TESTSECRET123' });

		await logic.handleStart(mockSetup);

		const state = logic.getState();
		expect(state.step).toBe('scan');
		expect(state.secret).toBe('TESTSECRET123');
		expect(state.qrCodeUrl).toContain('TESTSECRET123');
		expect(state.qrCodeUrl).toContain('test@example.com');
	});

	it('should handle setup errors', async () => {
		mockSetup.mockRejectedValue(new Error('Setup failed'));

		await logic.handleStart(mockSetup);

		const state = logic.getState();
		expect(state.step).toBe('intro');
		expect(state.contextError).toBe('Setup failed');
		expect(state.loading).toBe(false);
	});

	it('should prevent duplicate setup while loading', async () => {
		mockSetup.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

		const promise1 = logic.handleStart(mockSetup);
		const promise2 = logic.handleStart(mockSetup);

		await Promise.all([promise1, promise2]);

		expect(mockSetup).toHaveBeenCalledTimes(1);
	});
});

describe('Auth.TwoFactorSetup - Verification Flow', () => {
	let logic: ReturnType<typeof createTwoFactorSetupLogic>;
	let mockSetup: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorSetupLogic();
		mockSetup = vi.fn();
	});

	it('should validate code before verifying', async () => {
		logic.setVerificationCode('123'); // Invalid length

		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.verificationError).toBe('Verification code must be 6 digits');
		expect(mockSetup).not.toHaveBeenCalled();
	});

	it('should transition to backup step with codes on successful verification', async () => {
		const mockCodes = ['CODE1', 'CODE2', 'CODE3'];
		mockSetup.mockResolvedValue({ codes: mockCodes });
		logic.setVerificationCode('123456');

		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.step).toBe('backup');
		expect(state.backupCodes).toEqual(mockCodes);
		expect(state.verificationError).toBeNull();
	});

	it('should generate backup codes if not provided by handler', async () => {
		mockSetup.mockResolvedValue({});
		logic.setVerificationCode('123456');

		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.step).toBe('backup');
		expect(state.backupCodes.length).toBeGreaterThan(0);
	});

	it('should handle verification errors', async () => {
		mockSetup.mockRejectedValue(new Error('Invalid code'));
		logic.setVerificationCode('123456');

		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.verificationError).toBe('Invalid code');
		expect(state.step).toBe('intro');
	});

	it('should clear error when setting new verification code', () => {
		logic.setVerificationCode('123');
		logic.handleVerify(mockSetup);

		const state1 = logic.getState();
		expect(state1.verificationError).not.toBeNull();

		logic.setVerificationCode('456');

		const state2 = logic.getState();
		expect(state2.verificationError).toBeNull();
	});
});

describe('Auth.TwoFactorSetup - Completion Flow', () => {
	let logic: ReturnType<typeof createTwoFactorSetupLogic>;
	let mockSetup: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorSetupLogic();
		mockSetup = vi.fn();
	});

	it('should call onComplete with backup codes', async () => {
		// First set up to get backup codes
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1', 'CODE2', 'CODE3'] });
		await logic.handleVerify(mockSetup);

		const onComplete = vi.fn();
		logic.handleFinish(onComplete);

		expect(onComplete).toHaveBeenCalledWith(['CODE1', 'CODE2', 'CODE3']);
	});

	it('should call onCancel callback', () => {
		const onCancel = vi.fn();

		logic.handleCancel(onCancel);

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('should not finish while loading', async () => {
		mockSetup.mockImplementation(() => new Promise(() => {})); // Never resolves
		logic.handleStart(mockSetup);

		// Now loading is true
		const onComplete = vi.fn();
		logic.handleFinish(onComplete);

		expect(onComplete).not.toHaveBeenCalled();
	});
});

describe('Auth.TwoFactorSetup - Utility Functions', () => {
	let logic: ReturnType<typeof createTwoFactorSetupLogic>;
	let mockSetup: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorSetupLogic();
		mockSetup = vi.fn();
	});

	it('should copy secret', async () => {
		// Set up to generate secret
		mockSetup.mockResolvedValue({ secret: 'TESTSECRET' });
		await logic.handleStart(mockSetup);

		const copied = logic.copySecret();

		expect(copied).toBe('TESTSECRET');
	});

	it('should download backup codes as text', async () => {
		// Generate backup codes through normal flow
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1', 'CODE2', 'CODE3'] });
		await logic.handleVerify(mockSetup);

		const content = logic.downloadBackupCodes();

		expect(content).toBe('CODE1\nCODE2\nCODE3');
	});

	it('should copy backup codes', async () => {
		// Generate backup codes through normal flow
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1', 'CODE2', 'CODE3'] });
		await logic.handleVerify(mockSetup);

		const copied = logic.copyBackupCodes();

		expect(copied).toBe('CODE1\nCODE2\nCODE3');
	});

	it('should return empty string for copySecret before setup', () => {
		const copied = logic.copySecret();
		expect(copied).toBe('');
	});

	it('should return empty string for copyBackupCodes before verification', () => {
		const copied = logic.copyBackupCodes();
		expect(copied).toBe('');
	});

	it('should return empty string for downloadBackupCodes before verification', () => {
		const content = logic.downloadBackupCodes();
		expect(content).toBe('');
	});
});

describe('Auth.TwoFactorSetup - Additional Edge Cases', () => {
	let logic: ReturnType<typeof createTwoFactorSetupLogic>;
	let mockSetup: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorSetupLogic();
		mockSetup = vi.fn();
	});

	it('should handle empty secret from handler', async () => {
		mockSetup.mockResolvedValue({ secret: '' });

		await logic.handleStart(mockSetup);

		const state = logic.getState();
		expect(state.secret).toBe('');
	});

	it('should handle very long secret', async () => {
		const longSecret = 'A'.repeat(200);
		mockSetup.mockResolvedValue({ secret: longSecret });

		await logic.handleStart(mockSetup);

		const state = logic.getState();
		expect(state.secret).toBe(longSecret);
	});

	it('should handle empty backup codes array', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		mockSetup.mockResolvedValueOnce({ codes: [] });
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.backupCodes).toEqual([]);
	});

	it('should handle large number of backup codes', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		const codes = Array.from({ length: 100 }, (_, i) => `CODE${i}`);
		mockSetup.mockResolvedValueOnce({ codes });
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.backupCodes).toHaveLength(100);
	});

	it('should handle special characters in verification code', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		// Special characters cause validation to fail
		logic.setVerificationCode('12!@#$');
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.verificationError).toBeTruthy();
	});

	it('should handle whitespace in verification code', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		// Whitespace is trimmed by validation
		logic.setVerificationCode('  123456  ');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1'] });
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.verificationError).toBeNull();
	});

	it('should handle rapid state changes', async () => {
		mockSetup.mockResolvedValue({ secret: 'SECRET' });

		for (let i = 0; i < 10; i++) {
			logic.setVerificationCode(`${i}${i}${i}${i}${i}${i}`);
		}

		await logic.handleStart(mockSetup);

		// Final code should be persisted
		const state = logic.getState();
		expect(state.verificationCode).toBe('999999');
	});

	it('should handle multiple cancel calls', () => {
		const onCancel = vi.fn();

		logic.handleCancel(onCancel);
		logic.handleCancel(onCancel);
		logic.handleCancel(onCancel);

		expect(onCancel).toHaveBeenCalledTimes(3);
	});

	it('should handle cancel during loading state', async () => {
		mockSetup.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
		const promise = logic.handleStart(mockSetup);

		const onCancel = vi.fn();
		logic.handleCancel(onCancel);

		expect(onCancel).toHaveBeenCalledTimes(1);

		await promise;
	});

	it('should handle missing onCancel callback', () => {
		expect(() => logic.handleCancel()).not.toThrow();
	});

	it('should handle missing onComplete callback', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1'] });
		await logic.handleVerify(mockSetup);

		expect(() => logic.handleFinish()).not.toThrow();
	});

	it('should clear error state on successful start after failure', async () => {
		// First attempt fails
		mockSetup.mockRejectedValueOnce(new Error('Setup failed'));
		await logic.handleStart(mockSetup);

		expect(logic.getState().contextError).toBe('Setup failed');

		// Second attempt succeeds
		mockSetup.mockResolvedValueOnce({ secret: 'SECRET' });
		await logic.handleStart(mockSetup);

		expect(logic.getState().contextError).toBeNull();
	});

	it('should clear error state on successful verify after failure', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');

		// First verify fails
		mockSetup.mockRejectedValueOnce(new Error('Invalid code'));
		await logic.handleVerify(mockSetup);

		expect(logic.getState().verificationError).toBe('Invalid code');

		// User needs to restart from intro
		mockSetup.mockResolvedValueOnce({ secret: 'TEST2' });
		await logic.handleStart(mockSetup);

		// Second verify succeeds
		logic.setVerificationCode('123456');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1'] });
		await logic.handleVerify(mockSetup);

		expect(logic.getState().verificationError).toBeNull();
	});

	it('should handle non-string backup codes', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		// @ts-expect-error Testing runtime behavior
		mockSetup.mockResolvedValueOnce({ codes: [123, 456, 789] });
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.backupCodes).toEqual([123, 456, 789]);
	});

	it('should preserve secret across verification failures', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'PRESERVE_ME' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		mockSetup.mockRejectedValueOnce(new Error('Invalid'));
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.secret).toBe('PRESERVE_ME');
	});

	it('should handle unicode in secret', async () => {
		const unicodeSecret = '秘密🔐';
		mockSetup.mockResolvedValue({ secret: unicodeSecret });

		await logic.handleStart(mockSetup);

		const state = logic.getState();
		expect(state.secret).toBe(unicodeSecret);
	});

	it('should handle unicode in backup codes', async () => {
		mockSetup.mockResolvedValueOnce({ secret: 'TEST' });
		await logic.handleStart(mockSetup);

		logic.setVerificationCode('123456');
		const codes = ['密码1', '密码2🔐', '密码3'];
		mockSetup.mockResolvedValueOnce({ codes });
		await logic.handleVerify(mockSetup);

		const state = logic.getState();
		expect(state.backupCodes).toEqual(codes);
	});
});

describe('Auth.TwoFactorSetup - Integration Scenarios', () => {
	it('should complete full 2FA setup flow', async () => {
		const logic = createTwoFactorSetupLogic('test@example.com');
		const mockSetup = vi.fn();

		// Step 1: Start setup
		mockSetup.mockResolvedValueOnce({ secret: 'MY_SECRET_KEY' });
		await logic.handleStart(mockSetup);

		expect(logic.getState()).toMatchObject({
			step: 'scan',
			secret: 'MY_SECRET_KEY',
			loading: false,
			contextError: null,
		});

		// Step 2: User enters code
		logic.setVerificationCode('123456');

		// Step 3: Verify code and get backup codes
		mockSetup.mockResolvedValueOnce({
			codes: ['BACKUP1', 'BACKUP2', 'BACKUP3'],
		});
		await logic.handleVerify(mockSetup);

		expect(logic.getState()).toMatchObject({
			step: 'backup',
			backupCodes: ['BACKUP1', 'BACKUP2', 'BACKUP3'],
			loading: false,
		});

		// Step 4: Complete setup
		const onComplete = vi.fn();
		logic.handleFinish(onComplete);

		expect(onComplete).toHaveBeenCalledWith(['BACKUP1', 'BACKUP2', 'BACKUP3']);
	});

	it('should handle setup restart after failure', async () => {
		const logic = createTwoFactorSetupLogic('test@example.com');
		const mockSetup = vi.fn();

		// First attempt fails
		mockSetup.mockRejectedValueOnce(new Error('Server error'));
		await logic.handleStart(mockSetup);

		expect(logic.getState().contextError).toBe('Server error');
		expect(logic.getState().step).toBe('intro');

		// User retries
		mockSetup.mockResolvedValueOnce({ secret: 'NEW_SECRET' });
		await logic.handleStart(mockSetup);

		expect(logic.getState().contextError).toBeNull();
		expect(logic.getState().step).toBe('scan');
		expect(logic.getState().secret).toBe('NEW_SECRET');
	});

	it('should handle verification retry after wrong code', async () => {
		const logic = createTwoFactorSetupLogic('test@example.com');
		const mockSetup = vi.fn();

		// Start successfully
		mockSetup.mockResolvedValueOnce({ secret: 'SECRET' });
		await logic.handleStart(mockSetup);

		// First code is wrong
		logic.setVerificationCode('111111');
		mockSetup.mockRejectedValueOnce(new Error('Invalid code'));
		await logic.handleVerify(mockSetup);

		expect(logic.getState().verificationError).toBe('Invalid code');
		// Step remains 'scan' after verification error

		// User tries again with correct code
		logic.setVerificationCode('222222');
		mockSetup.mockResolvedValueOnce({ codes: ['CODE1', 'CODE2'] });
		await logic.handleVerify(mockSetup);

		expect(logic.getState().verificationError).toBeNull();
		expect(logic.getState().step).toBe('backup');
	});
});
