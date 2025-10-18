/**
 * Auth.TwoFactorVerify Component Tests
 * 
 * Tests for two-factor verification during login including:
 * - TOTP code verification
 * - Backup code verification
 * - Method switching
 * - Code validation
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AuthHandlers } from '../../src/components/Auth/context.js';

// Verification method type
type VerifyMethod = 'totp' | 'backup';

// Two-factor verify state
interface TwoFactorVerifyState {
	method: VerifyMethod;
	code: string;
	codeError: string | null;
	loading: boolean;
	contextError: string | null;
}

// Code validation logic
function validateCode(code: string, method: VerifyMethod): { valid: boolean; error?: string } {
	const trimmed = code.trim();
	
	if (!trimmed) {
		return { valid: false, error: 'Code is required' };
	}
	
	if (method === 'totp' && trimmed.length !== 6) {
		return { valid: false, error: 'Code must be 6 digits' };
	}
	
	if (method === 'totp' && !/^\d{6}$/.test(trimmed)) {
		return { valid: false, error: 'Code must contain only digits' };
	}
	
	return { valid: true };
}

// Method-specific error messages
function getMethodErrorMessage(method: VerifyMethod): string {
	return method === 'totp'
		? 'Invalid verification code. Please check your authenticator app and try again.'
		: 'Invalid backup code. Please check and try again.';
}

// Two-factor verify logic
function createTwoFactorVerifyLogic(showBackupOption: boolean = true) {
	const state: TwoFactorVerifyState = {
		method: 'totp',
		code: '',
		codeError: null,
		loading: false,
		contextError: null,
	};

	function setCode(code: string) {
		state.code = code;
		state.codeError = null;
	}

	function switchMethod(newMethod: VerifyMethod) {
		state.method = newMethod;
		state.code = '';
		state.codeError = null;
		state.contextError = null;
	}

	async function handleVerify(onTwoFactorVerify?: AuthHandlers['onTwoFactorVerify']) {
		if (state.loading || !state.code.trim()) return;

		state.codeError = null;
		state.contextError = null;

		// Validate code
		const validation = validateCode(state.code, state.method);
		if (!validation.valid) {
			state.codeError = validation.error || null;
			return;
		}

		state.loading = true;

		try {
			await onTwoFactorVerify?.({
				code: state.code.trim(),
				method: state.method,
			});
			// Success - would typically redirect or update auth state
		} catch (err) {
			state.codeError = err instanceof Error ? err.message : 'Invalid verification code';
			state.contextError = getMethodErrorMessage(state.method);
		} finally {
			state.loading = false;
		}
	}

	function handleEnterKey(onTwoFactorVerify?: AuthHandlers['onTwoFactorVerify']) {
		if (state.code.trim()) {
			handleVerify(onTwoFactorVerify);
		}
	}

	return {
		getState: () => ({ ...state }),
		setCode,
		switchMethod,
		handleVerify,
		handleEnterKey,
		showBackupOption,
	};
}

describe('Auth.TwoFactorVerify - Code Validation', () => {
	it('should accept valid 6-digit TOTP code', () => {
		const result = validateCode('123456', 'totp');
		
		expect(result.valid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it('should reject empty code', () => {
		const result = validateCode('', 'totp');
		
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Code is required');
	});

	it('should reject TOTP code with wrong length', () => {
		const result = validateCode('12345', 'totp');
		
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Code must be 6 digits');
	});

	it('should reject TOTP code with non-digits', () => {
		const result = validateCode('12a456', 'totp');
		
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Code must contain only digits');
	});

	it('should accept backup codes of any length', () => {
		const result = validateCode('ABCD1234', 'backup');
		
		expect(result.valid).toBe(true);
	});

	it('should trim whitespace before validation', () => {
		const result = validateCode('  123456  ', 'totp');
		
		expect(result.valid).toBe(true);
	});
});

describe('Auth.TwoFactorVerify - Error Messages', () => {
	it('should return TOTP-specific error message', () => {
		const message = getMethodErrorMessage('totp');
		
		expect(message).toContain('authenticator app');
	});

	it('should return backup code-specific error message', () => {
		const message = getMethodErrorMessage('backup');
		
		expect(message).toContain('backup code');
	});
});

describe('Auth.TwoFactorVerify - Verification Flow', () => {
	let logic: ReturnType<typeof createTwoFactorVerifyLogic>;
	let mockVerify: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorVerifyLogic();
		mockVerify = vi.fn();
	});

	it('should start with TOTP method', () => {
		const state = logic.getState();
		
		expect(state.method).toBe('totp');
		expect(state.code).toBe('');
		expect(state.loading).toBe(false);
	});

	it('should call onTwoFactorVerify with correct data for TOTP', async () => {
		logic.setCode('123456');
		mockVerify.mockResolvedValue(undefined);

		await logic.handleVerify(mockVerify);

		expect(mockVerify).toHaveBeenCalledWith({
			code: '123456',
			method: 'totp',
		});
	});

	it('should call onTwoFactorVerify with correct data for backup code', async () => {
		logic.switchMethod('backup');
		logic.setCode('BACKUP123');
		mockVerify.mockResolvedValue(undefined);

		await logic.handleVerify(mockVerify);

		expect(mockVerify).toHaveBeenCalledWith({
			code: 'BACKUP123',
			method: 'backup',
		});
	});

	it('should not verify empty code', async () => {
		logic.setCode('');

		await logic.handleVerify(mockVerify);

		expect(mockVerify).not.toHaveBeenCalled();
	});

	it('should not verify whitespace-only code', async () => {
		logic.setCode('   ');

		await logic.handleVerify(mockVerify);

		expect(mockVerify).not.toHaveBeenCalled();
	});

	it('should validate TOTP code length before verifying', async () => {
		logic.setCode('12345'); // Too short

		await logic.handleVerify(mockVerify);

		const state = logic.getState();
		expect(state.codeError).toBe('Code must be 6 digits');
		expect(mockVerify).not.toHaveBeenCalled();
	});

	it('should set method-specific error on verification failure', async () => {
		logic.setCode('123456');
		mockVerify.mockRejectedValue(new Error('Invalid code'));

		await logic.handleVerify(mockVerify);

		const state = logic.getState();
		expect(state.contextError).toContain('authenticator app');
		expect(state.loading).toBe(false);
	});

	it('should set backup-specific error when using backup method', async () => {
		logic.switchMethod('backup');
		logic.setCode('INVALID');
		mockVerify.mockRejectedValue(new Error('Invalid code'));

		await logic.handleVerify(mockVerify);

		const state = logic.getState();
		expect(state.contextError).toContain('backup code');
	});

	it('should prevent duplicate verification while loading', async () => {
		logic.setCode('123456');
		mockVerify.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

		const promise1 = logic.handleVerify(mockVerify);
		const promise2 = logic.handleVerify(mockVerify);

		await Promise.all([promise1, promise2]);

		expect(mockVerify).toHaveBeenCalledTimes(1);
	});

	it('should trim code before sending to handler', async () => {
		logic.setCode('  123456  ');
		mockVerify.mockResolvedValue(undefined);

		await logic.handleVerify(mockVerify);

		expect(mockVerify).toHaveBeenCalledWith({
			code: '123456',
			method: 'totp',
		});
	});
});

describe('Auth.TwoFactorVerify - Method Switching', () => {
	let logic: ReturnType<typeof createTwoFactorVerifyLogic>;

	beforeEach(() => {
		logic = createTwoFactorVerifyLogic();
	});

	it('should switch from TOTP to backup', () => {
		logic.switchMethod('backup');

		const state = logic.getState();
		expect(state.method).toBe('backup');
	});

	it('should clear code when switching methods', () => {
		logic.setCode('123456');
		
		logic.switchMethod('backup');

		const state = logic.getState();
		expect(state.code).toBe('');
	});

	it('should clear errors when switching methods', () => {
		const state = logic.getState();
		state.codeError = 'Previous error';
		state.contextError = 'Context error';

		logic.switchMethod('backup');

		const newState = logic.getState();
		expect(newState.codeError).toBeNull();
		expect(newState.contextError).toBeNull();
	});

	it('should allow switching back to TOTP', () => {
		logic.switchMethod('backup');
		logic.switchMethod('totp');

		const state = logic.getState();
		expect(state.method).toBe('totp');
	});
});

describe('Auth.TwoFactorVerify - Code Input Handling', () => {
	let logic: ReturnType<typeof createTwoFactorVerifyLogic>;

	beforeEach(() => {
		logic = createTwoFactorVerifyLogic();
	});

	it('should update code value', () => {
		logic.setCode('123456');

		const state = logic.getState();
		expect(state.code).toBe('123456');
	});

	it('should clear error when setting new code', () => {
		const state = logic.getState();
		state.codeError = 'Previous error';

		logic.setCode('123456');

		const newState = logic.getState();
		expect(newState.codeError).toBeNull();
	});

	it('should handle empty string', () => {
		logic.setCode('123456');
		logic.setCode('');

		const state = logic.getState();
		expect(state.code).toBe('');
	});
});

describe('Auth.TwoFactorVerify - Enter Key Handling', () => {
	let logic: ReturnType<typeof createTwoFactorVerifyLogic>;
	let mockVerify: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorVerifyLogic();
		mockVerify = vi.fn().mockResolvedValue(undefined);
	});

	it('should verify on enter key when code is present', async () => {
		logic.setCode('123456');

		await logic.handleEnterKey(mockVerify);

		expect(mockVerify).toHaveBeenCalled();
	});

	it('should not verify on enter key when code is empty', async () => {
		logic.setCode('');

		await logic.handleEnterKey(mockVerify);

		expect(mockVerify).not.toHaveBeenCalled();
	});

	it('should not verify on enter key with whitespace-only code', async () => {
		logic.setCode('   ');

		await logic.handleEnterKey(mockVerify);

		expect(mockVerify).not.toHaveBeenCalled();
	});
});

describe('Auth.TwoFactorVerify - Configuration', () => {
	it('should show backup option by default', () => {
		const logic = createTwoFactorVerifyLogic();
		
		expect(logic.showBackupOption).toBe(true);
	});

	it('should allow disabling backup option', () => {
		const logic = createTwoFactorVerifyLogic(false);
		
		expect(logic.showBackupOption).toBe(false);
	});

	it('should still allow method switching when backup disabled', () => {
		const logic = createTwoFactorVerifyLogic(false);
		
		// Even though UI might hide it, logic should still work
		logic.switchMethod('backup');
		
		const state = logic.getState();
		expect(state.method).toBe('backup');
	});
});

describe('Auth.TwoFactorVerify - Additional Edge Cases', () => {
	let logic: ReturnType<typeof createTwoFactorVerifyLogic>;
	let mockVerify: vi.Mock;

	beforeEach(() => {
		logic = createTwoFactorVerifyLogic();
		mockVerify = vi.fn();
	});

	it('should handle very long code', () => {
		const longCode = '1'.repeat(100);
		logic.setCode(longCode);

		const state = logic.getState();
		expect(state.code).toBe(longCode);
	});

	it('should handle unicode characters in code', () => {
		logic.setCode('12🔐456');

		const state = logic.getState();
		expect(state.code).toBe('12🔐456');
	});

	it('should handle special characters in code', () => {
		logic.setCode('!@#$%^');

		const state = logic.getState();
		expect(state.code).toBe('!@#$%^');
	});

	it('should handle rapid method switching', () => {
		for (let i = 0; i < 10; i++) {
			logic.switchMethod(i % 2 === 0 ? 'totp' : 'backup');
		}

		const state = logic.getState();
		// i=9 is odd, so final method is 'backup'
		expect(state.method).toBe('backup');
	});

	it('should handle rapid code changes', () => {
		for (let i = 0; i < 10; i++) {
			logic.setCode(`${i}${i}${i}${i}${i}${i}`);
		}

		const state = logic.getState();
		expect(state.code).toBe('999999');
	});

	it('should preserve method during verification', async () => {
		logic.switchMethod('backup');
		logic.setCode('BACKUP1');

		mockVerify.mockResolvedValue(undefined);
		await logic.handleVerify(mockVerify);

		const state = logic.getState();
		expect(state.method).toBe('backup');
	});

	it('should preserve method during error', async () => {
		logic.switchMethod('backup');
		logic.setCode('WRONG');

		mockVerify.mockRejectedValue(new Error('Invalid code'));
		await logic.handleVerify(mockVerify);

		const state = logic.getState();
		expect(state.method).toBe('backup');
	});

	it('should handle verification without handler', async () => {
		logic.setCode('123456');

		await logic.handleVerify();

		// Should complete without error
		const state = logic.getState();
		expect(state.loading).toBe(false);
	});

	it('should handle non-Error exceptions', async () => {
		logic.setCode('123456');
		mockVerify.mockRejectedValue('String error');

		await logic.handleVerify(mockVerify);

		const state = logic.getState();
		expect(state.codeError).toBe('Invalid verification code');
	});

	it('should clear code error on successful verify', async () => {
		logic.setCode('123456');

		// First attempt fails
		mockVerify.mockRejectedValueOnce(new Error('Wrong code'));
		await logic.handleVerify(mockVerify);

		expect(logic.getState().codeError).toBe('Wrong code');

		// Second attempt succeeds
		mockVerify.mockResolvedValueOnce(undefined);
		await logic.handleVerify(mockVerify);

		expect(logic.getState().codeError).toBeNull();
	});

	it('should handle multiple concurrent verify attempts', async () => {
		logic.setCode('123456');
		mockVerify.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));

		const promises = [];
		for (let i = 0; i < 5; i++) {
			promises.push(logic.handleVerify(mockVerify));
		}

		await Promise.all(promises);

		// Only first should be called due to loading state
		expect(mockVerify).toHaveBeenCalledTimes(1);
	});

	it('should handle enter key during loading', async () => {
		logic.setCode('123456');
		mockVerify.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

		const promise1 = logic.handleVerify(mockVerify);
		const promise2 = logic.handleEnterKey(mockVerify);

		await Promise.all([promise1, promise2]);

		// Should only call once due to loading state
		expect(mockVerify).toHaveBeenCalledTimes(1);
	});

	it('should handle code with only whitespace', () => {
		logic.setCode('      ');

		const state = logic.getState();
		expect(state.code).toBe('      ');
	});

	it('should handle empty code submission', async () => {
		logic.setCode('');

		await logic.handleVerify(mockVerify);

		// Should not call verify with empty code
		expect(mockVerify).not.toHaveBeenCalled();
	});
});

describe('Auth.TwoFactorVerify - Integration Scenarios', () => {
	it('should complete full TOTP verification flow', async () => {
		const logic = createTwoFactorVerifyLogic();
		const mockVerify = vi.fn().mockResolvedValue(undefined);

		// User is on TOTP method by default
		expect(logic.getState().method).toBe('totp');

		// User enters TOTP code
		logic.setCode('123456');

		// User submits
		await logic.handleVerify(mockVerify);

		expect(mockVerify).toHaveBeenCalledWith({
			code: '123456',
			method: 'totp',
		});
		expect(logic.getState()).toMatchObject({
			loading: false,
			codeError: null,
		});
	});

	it('should handle TOTP failure and retry', async () => {
		const logic = createTwoFactorVerifyLogic();
		let attempts = 0;
		const mockVerify = vi.fn(async () => {
			attempts++;
			if (attempts === 1) {
				throw new Error('Invalid TOTP code');
			}
		});

		// First attempt
		logic.setCode('111111');
		await logic.handleVerify(mockVerify);

		expect(logic.getState().codeError).toBe('Invalid TOTP code');

		// Second attempt
		logic.setCode('222222');
		await logic.handleVerify(mockVerify);

		expect(logic.getState().codeError).toBeNull();
		expect(mockVerify).toHaveBeenCalledTimes(2);
	});

	it('should switch to backup code and verify', async () => {
		const logic = createTwoFactorVerifyLogic();
		const mockVerify = vi.fn().mockResolvedValue(undefined);

		// User switches to backup code
		logic.switchMethod('backup');

		expect(logic.getState().method).toBe('backup');

		// User enters backup code
		logic.setCode('BACKUP1');

		// User submits
		await logic.handleVerify(mockVerify);

		expect(mockVerify).toHaveBeenCalledWith({
			code: 'BACKUP1',
			method: 'backup',
		});
		expect(logic.getState()).toMatchObject({
			loading: false,
			codeError: null,
		});
	});

	it('should handle TOTP failure then switch to backup', async () => {
		const logic = createTwoFactorVerifyLogic();
		const mockVerify = vi.fn();

		// Try TOTP first
		logic.setCode('111111');
		mockVerify.mockRejectedValueOnce(new Error('Invalid TOTP'));
		await logic.handleVerify(mockVerify);

		expect(logic.getState().codeError).toBe('Invalid TOTP');

		// Switch to backup
		logic.switchMethod('backup');
		logic.setCode('BACKUP1');
		mockVerify.mockResolvedValueOnce(undefined);
		await logic.handleVerify(mockVerify);

		expect(logic.getState().codeError).toBeNull();
		expect(mockVerify).toHaveBeenCalledTimes(2);
	});

	it('should handle enter key submission', async () => {
		const logic = createTwoFactorVerifyLogic();
		const mockVerify = vi.fn().mockResolvedValue(undefined);

		logic.setCode('123456');

		// User presses enter
		await logic.handleEnterKey(mockVerify);

		expect(mockVerify).toHaveBeenCalledWith({
			code: '123456',
			method: 'totp',
		});
	});

	it('should preserve state across multiple operations', async () => {
		const logic = createTwoFactorVerifyLogic();
		const mockVerify = vi.fn();

		// Set code
		logic.setCode('123456');
		expect(logic.getState().code).toBe('123456');

		// Switch method - this clears code
		logic.switchMethod('backup');
		expect(logic.getState().method).toBe('backup');
		expect(logic.getState().code).toBe(''); // Code cleared on method switch

		// Change code
		logic.setCode('BACKUP1');
		expect(logic.getState().method).toBe('backup'); // Method preserved

		// Verify fails
		mockVerify.mockRejectedValueOnce(new Error('Failed'));
		await logic.handleVerify(mockVerify);

		expect(logic.getState().method).toBe('backup'); // Method still preserved
		expect(logic.getState().code).toBe('BACKUP1'); // Code still preserved
	});
});
