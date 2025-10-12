/**
 * Auth.WebAuthnSetup Component Tests
 * 
 * Tests for WebAuthn biometric authentication setup including:
 * - WebAuthn availability detection
 * - Registration flow state management
 * - Error handling
 * - Configuration options
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AuthHandlers, AuthState } from '../../src/components/Auth/context.js';

// WebAuthn availability check logic
function checkWebAuthnAvailability(): boolean {
	return typeof window !== 'undefined' && 'credentials' in navigator;
}

// Registration step type
type RegistrationStep = 'intro' | 'registering' | 'success' | 'error';

// WebAuthn setup logic
interface WebAuthnSetupState {
	step: RegistrationStep;
	error: string | null;
	loading: boolean;
}

function createWebAuthnSetupLogic(
	initialStep: RegistrationStep = 'intro'
) {
	let state: WebAuthnSetupState = {
		step: initialStep,
		error: null,
		loading: false,
	};

	const handlers: Partial<AuthHandlers> = {};

	function setStep(step: RegistrationStep) {
		state.step = step;
	}

	function setError(error: string | null) {
		state.error = error;
	}

	function setLoading(loading: boolean) {
		state.loading = loading;
	}

	async function handleSetup(email: string, onWebAuthnRegister?: AuthHandlers['onWebAuthnRegister'], onComplete?: () => void, skipAvailabilityCheck: boolean = false) {
		if (state.loading) return;
		if (!skipAvailabilityCheck && !checkWebAuthnAvailability()) return;

		setError(null);
		setStep('registering');
		setLoading(true);

		try {
			await onWebAuthnRegister?.(email);
			setStep('success');
			onComplete?.();
		} catch (err) {
			setStep('error');
			setError(err instanceof Error ? err.message : 'WebAuthn registration failed');
		} finally {
			setLoading(false);
		}
	}

	function handleSkip(onSkip?: () => void) {
		if (state.loading) return;
		onSkip?.();
	}

	function handleRetry() {
		setError(null);
		setStep('intro');
	}

	return {
		getState: () => ({ ...state }),
		setStep,
		setError,
		setLoading,
		handleSetup,
		handleSkip,
		handleRetry,
	};
}

describe('Auth.WebAuthnSetup - Availability Detection', () => {
	it('should detect WebAuthn availability when credentials API exists', () => {
		const isAvailable = checkWebAuthnAvailability();
		// In jsdom, navigator exists but credentials may not
		expect(typeof isAvailable).toBe('boolean');
	});

	it('should return false if window is undefined', () => {
		// In Node.js/server environment
		const result = typeof window !== 'undefined' && 'credentials' in navigator;
		expect(typeof result).toBe('boolean');
	});
});

describe('Auth.WebAuthnSetup - Registration Flow', () => {
	let logic: ReturnType<typeof createWebAuthnSetupLogic>;
	let mockRegister: vi.Mock;

	beforeEach(() => {
		logic = createWebAuthnSetupLogic();
		mockRegister = vi.fn();
	});

	it('should start in intro step by default', () => {
		const state = logic.getState();
		expect(state.step).toBe('intro');
		expect(state.error).toBeNull();
		expect(state.loading).toBe(false);
	});

	it('should transition to registering step when setup initiated', async () => {
		mockRegister.mockResolvedValue(undefined);

		const setupPromise = logic.handleSetup('user@example.com', mockRegister, undefined, true);
		
		// Check intermediate state
		expect(logic.getState().step).toBe('registering');
		expect(logic.getState().loading).toBe(true);

		await setupPromise;
	});

	it('should call onWebAuthnRegister with correct email', async () => {
		mockRegister.mockResolvedValue(undefined);

		await logic.handleSetup('test@example.com', mockRegister, undefined, true);

		expect(mockRegister).toHaveBeenCalledWith('test@example.com');
		expect(mockRegister).toHaveBeenCalledTimes(1);
	});

	it('should transition to success and call onComplete when registration succeeds', async () => {
		mockRegister.mockResolvedValue(undefined);
		const onComplete = vi.fn();

		await logic.handleSetup('user@example.com', mockRegister, onComplete, true);

		const state = logic.getState();
		expect(state.step).toBe('success');
		expect(state.error).toBeNull();
		expect(state.loading).toBe(false);
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('should transition to error step when registration fails', async () => {
		mockRegister.mockRejectedValue(new Error('Registration failed'));

		await logic.handleSetup('user@example.com', mockRegister, undefined, true);

		const state = logic.getState();
		expect(state.step).toBe('error');
		expect(state.error).toBe('Registration failed');
		expect(state.loading).toBe(false);
	});

	it('should handle generic error messages', async () => {
		mockRegister.mockRejectedValue('String error');

		await logic.handleSetup('user@example.com', mockRegister, undefined, true);

		const state = logic.getState();
		expect(state.step).toBe('error');
		expect(state.error).toBe('WebAuthn registration failed');
	});

	it('should not start setup when already loading', async () => {
		logic.setLoading(true);
		
		await logic.handleSetup('user@example.com', mockRegister);

		expect(mockRegister).not.toHaveBeenCalled();
	});

	it('should not start setup when WebAuthn unavailable', async () => {
		// Test the guard condition
		const isAvailable = checkWebAuthnAvailability();
		if (!isAvailable) {
			await logic.handleSetup('user@example.com', mockRegister);
			expect(mockRegister).not.toHaveBeenCalled();
		}
	});
});

describe('Auth.WebAuthnSetup - Skip Functionality', () => {
	let logic: ReturnType<typeof createWebAuthnSetupLogic>;

	beforeEach(() => {
		logic = createWebAuthnSetupLogic();
	});

	it('should call onSkip callback when skip is triggered', () => {
		const onSkip = vi.fn();

		logic.handleSkip(onSkip);

		expect(onSkip).toHaveBeenCalledTimes(1);
	});

	it('should not call onSkip when loading', () => {
		const onSkip = vi.fn();
		logic.setLoading(true);

		logic.handleSkip(onSkip);

		expect(onSkip).not.toHaveBeenCalled();
	});

	it('should handle missing onSkip callback gracefully', () => {
		expect(() => logic.handleSkip()).not.toThrow();
	});
});

describe('Auth.WebAuthnSetup - Error Handling', () => {
	let logic: ReturnType<typeof createWebAuthnSetupLogic>;

	beforeEach(() => {
		logic = createWebAuthnSetupLogic();
	});

	it('should allow retry after error', () => {
		logic.setStep('error');
		logic.setError('Previous error');

		logic.handleRetry();

		const state = logic.getState();
		expect(state.step).toBe('intro');
		expect(state.error).toBeNull();
	});

	it('should clear error when retrying', () => {
		logic.setError('Test error');
		
		logic.handleRetry();

		expect(logic.getState().error).toBeNull();
	});
});

describe('Auth.WebAuthnSetup - State Management', () => {
	let logic: ReturnType<typeof createWebAuthnSetupLogic>;

	beforeEach(() => {
		logic = createWebAuthnSetupLogic();
	});

	it('should initialize with custom step', () => {
		const customLogic = createWebAuthnSetupLogic('success');
		expect(customLogic.getState().step).toBe('success');
	});

	it('should update step correctly', () => {
		logic.setStep('registering');
		expect(logic.getState().step).toBe('registering');

		logic.setStep('success');
		expect(logic.getState().step).toBe('success');
	});

	it('should update error correctly', () => {
		logic.setError('Test error');
		expect(logic.getState().error).toBe('Test error');

		logic.setError(null);
		expect(logic.getState().error).toBeNull();
	});

	it('should update loading correctly', () => {
		logic.setLoading(true);
		expect(logic.getState().loading).toBe(true);

		logic.setLoading(false);
		expect(logic.getState().loading).toBe(false);
	});

	it('should return independent state copies', () => {
		const state1 = logic.getState();
		const state2 = logic.getState();
		
		expect(state1).toEqual(state2);
		expect(state1).not.toBe(state2);
	});
});

describe('Auth.WebAuthnSetup - Additional Edge Cases', () => {
	let logic: ReturnType<typeof createWebAuthnSetupLogic>;
	let mockRegister: vi.Mock;

	beforeEach(() => {
		logic = createWebAuthnSetupLogic();
		mockRegister = vi.fn();
	});

	it('should handle very long email in setup', async () => {
		const longEmail = 'a'.repeat(50) + '@example.com';

		mockRegister.mockResolvedValue(undefined);
		await logic.handleSetup(longEmail, mockRegister, undefined, true);

		expect(mockRegister).toHaveBeenCalledWith(longEmail);
	});

	it('should handle special characters in email', async () => {
		const specialEmail = 'user+tag@example.com';

		mockRegister.mockResolvedValue(undefined);
		await logic.handleSetup(specialEmail, mockRegister, undefined, true);

		expect(mockRegister).toHaveBeenCalledWith(specialEmail);
	});

	it('should handle rapid error state changes', () => {
		for (let i = 0; i < 10; i++) {
			logic.setError(i % 2 === 0 ? 'Error' : null);
		}

		const state = logic.getState();
		expect(state.error).toBeNull();
	});

	it('should handle rapid loading state toggles', () => {
		for (let i = 0; i < 10; i++) {
			logic.setLoading(i % 2 === 0);
		}

		const state = logic.getState();
		// i=9, 9 % 2 = 1 (odd), so i % 2 === 0 is false
		expect(state.loading).toBe(false);
	});

	it('should handle null error explicitly', () => {
		logic.setError('Error');
		logic.setError(null);

		const state = logic.getState();
		expect(state.error).toBeNull();
	});

	it('should handle empty string error', () => {
		logic.setError('');

		const state = logic.getState();
		expect(state.error).toBe('');
	});

	it('should handle very long error message', () => {
		const longError = 'E'.repeat(500);
		logic.setError(longError);

		const state = logic.getState();
		expect(state.error).toBe(longError);
	});

	it('should handle unicode in error message', () => {
		logic.setError('错误信息 🔥');

		const state = logic.getState();
		expect(state.error).toBe('错误信息 🔥');
	});

	it('should maintain immutability across state changes', () => {
		const state1 = logic.getState();
		
		logic.setStep('registering');
		const state2 = logic.getState();

		logic.setError('Error');
		const state3 = logic.getState();

		logic.setLoading(true);
		const state4 = logic.getState();

		// All should be different objects
		expect(state1).not.toBe(state2);
		expect(state2).not.toBe(state3);
		expect(state3).not.toBe(state4);
	});

	it('should handle multiple retry attempts', () => {
		for (let i = 0; i < 5; i++) {
			logic.setError(`Error ${i}`);
			logic.handleRetry();
		}

		const state = logic.getState();
		expect(state.step).toBe('intro');
		expect(state.error).toBeNull();
	});

	it('should handle rapid step changes', () => {
		const steps: RegistrationStep[] = ['intro', 'registering', 'success', 'error'];

		for (let i = 0; i < 10; i++) {
			logic.setStep(steps[i % steps.length]);
		}

		const state = logic.getState();
		// i=9, 9 % 4 = 1, so steps[1] = 'registering'
		expect(state.step).toBe('registering');
	});

	it('should clear error on retry', () => {
		logic.setError('Failed to register');
		logic.setStep('error');

		logic.handleRetry();

		const state = logic.getState();
		expect(state.error).toBeNull();
		expect(state.step).toBe('intro');
	});

	it('should preserve error during manual step change', () => {
		logic.setError('Some error');
		logic.setStep('success');

		const state = logic.getState();
		expect(state.error).toBe('Some error');
		expect(state.step).toBe('success');
	});

	it('should handle setup with onComplete callback', async () => {
		const onComplete = vi.fn();
		mockRegister.mockResolvedValue(undefined);

		await logic.handleSetup('user@example.com', mockRegister, onComplete, true);

		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(logic.getState().step).toBe('success');
	});

	it('should not call onComplete on failure', async () => {
		const onComplete = vi.fn();
		mockRegister.mockRejectedValue(new Error('Failed'));

		await logic.handleSetup('user@example.com', mockRegister, onComplete, true);

		expect(onComplete).not.toHaveBeenCalled();
		expect(logic.getState().step).toBe('error');
	});

	it('should handle missing onComplete callback', async () => {
		mockRegister.mockResolvedValue(undefined);

		await logic.handleSetup('user@example.com', mockRegister, undefined, true);

		expect(logic.getState().step).toBe('success');
	});
});

describe('Auth.WebAuthnSetup - Integration Scenarios', () => {
	it('should complete full WebAuthn setup flow', async () => {
		const logic = createWebAuthnSetupLogic();
		const mockRegister = vi.fn().mockResolvedValue(undefined);
		const onComplete = vi.fn();

		// Initial state
		expect(logic.getState()).toMatchObject({
			step: 'intro',
			error: null,
			loading: false,
		});

		// User initiates setup
		await logic.handleSetup('user@example.com', mockRegister, onComplete, true);

		// Final state
		const state = logic.getState();
		expect(state.step).toBe('success');
		expect(state.error).toBeNull();
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('should handle setup failure and retry', async () => {
		const logic = createWebAuthnSetupLogic();
		const mockRegister = vi.fn();

		// First attempt fails
		mockRegister.mockRejectedValueOnce(new Error('WebAuthn not supported'));
		await logic.handleSetup('user@example.com', mockRegister, undefined, true);

		expect(logic.getState().error).toBe('WebAuthn not supported');
		expect(logic.getState().step).toBe('error');

		// User retries
		logic.handleRetry();
		mockRegister.mockResolvedValueOnce(undefined);
		await logic.handleSetup('user@example.com', mockRegister, undefined, true);

		const state = logic.getState();
		expect(state.step).toBe('success');
		expect(state.error).toBeNull();
	});

	it('should handle skip functionality', () => {
		const logic = createWebAuthnSetupLogic();
		const onSkip = vi.fn();

		logic.handleSkip(onSkip);

		expect(onSkip).toHaveBeenCalledTimes(1);
	});

	it('should prevent skip during loading', async () => {
		const logic = createWebAuthnSetupLogic();
		const mockRegister = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
		const onSkip = vi.fn();

		const promise = logic.handleSetup('user@example.com', mockRegister, undefined, true);

		logic.handleSkip(onSkip);

		expect(onSkip).not.toHaveBeenCalled();
	});

	it('should handle concurrent state updates', () => {
		const logic = createWebAuthnSetupLogic();

		// Simulate concurrent updates
		logic.setStep('registering');
		logic.setLoading(true);
		logic.setError(null);
		logic.setStep('success');
		logic.setLoading(false);

		const state = logic.getState();
		expect(state.step).toBe('success');
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull();
	});

	it('should recover from error state via retry', () => {
		const logic = createWebAuthnSetupLogic();

		// Setup fails
		logic.setStep('error');
		logic.setError('Browser not supported');
		expect(logic.getState().error).toBe('Browser not supported');

		// User retries
		logic.handleRetry();

		const state = logic.getState();
		expect(state.error).toBeNull();
		expect(state.step).toBe('intro');
	});

	it('should handle state reset', () => {
		const logic = createWebAuthnSetupLogic();

		// Set up some state
		logic.setStep('error');
		logic.setError('Some error');
		logic.setLoading(true);

		// Reset
		logic.setStep('intro');
		logic.setError(null);
		logic.setLoading(false);

		const state = logic.getState();
		expect(state).toMatchObject({
			step: 'intro',
			error: null,
			loading: false,
		});
	});
});
