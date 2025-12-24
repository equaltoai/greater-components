import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import WebAuthnSetup from '../src/WebAuthnSetup.svelte';
import TestWrapper from './fixtures/TestWrapper.svelte';
import type { AuthHandlers } from '../src/context.js';

describe('WebAuthnSetup Component', () => {
	const defaultHandlers: AuthHandlers = {
		onWebAuthnRegister: vi.fn(),
	};

	function setup(props = {}, handlers = {}, initialState = {}) {
		const mergedHandlers = { ...defaultHandlers, ...handlers };

		const { component, rerender } = render(TestWrapper, {
			component: WebAuthnSetup,
			handlers: mergedHandlers,
			initialState,
			email: 'test@example.com',
			...props,
		});

		return { handlers: mergedHandlers, component, rerender };
	}

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock window and navigator for WebAuthn check
		Object.defineProperty(window, 'navigator', {
			value: { credentials: {} },
			writable: true,
		});
	});

	it('renders intro step correctly', () => {
		setup();
		expect(screen.getByRole('heading', { name: 'Set Up Biometric Authentication' })).toBeTruthy();
		expect(screen.getByText('Sign in faster and more securely')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Set Up Now' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Skip for now' })).toBeTruthy();
	});

	it('starts setup on button click', async () => {
		const onWebAuthnRegister = vi.fn().mockReturnValue(new Promise(() => {})); // Hang to keep registering state
		const { handlers } = setup({}, { onWebAuthnRegister });

		await fireEvent.click(screen.getByRole('button', { name: 'Set Up Now' }));

		expect(handlers.onWebAuthnRegister).toHaveBeenCalledWith('test@example.com');
		expect(await screen.findByText(/Please follow the prompts/)).toBeTruthy();
	});

	it('completes setup successfully', async () => {
		const onWebAuthnRegister = vi.fn().mockResolvedValue(undefined);
		const onComplete = vi.fn();
		setup({ onComplete }, { onWebAuthnRegister });

		await fireEvent.click(screen.getByRole('button', { name: 'Set Up Now' }));

		expect(await screen.findByText("You're all set!")).toBeTruthy();

		await fireEvent.click(screen.getByRole('button', { name: 'Done' }));
		expect(onComplete).toHaveBeenCalled();
	});

	it('handles setup error', async () => {
		const onWebAuthnRegister = vi.fn().mockRejectedValue(new Error('Registration failed'));
		setup({}, { onWebAuthnRegister });

		await fireEvent.click(screen.getByRole('button', { name: 'Set Up Now' }));

		expect(await screen.findByRole('heading', { name: 'Setup Failed' })).toBeTruthy();
		expect(screen.getByText('Registration failed')).toBeTruthy();

		// Retry button should be present
		expect(screen.getByRole('button', { name: 'Try Again' })).toBeTruthy();
	});

	it('handles skip', async () => {
		const onSkip = vi.fn();
		setup({ onSkip });

		await fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }));

		expect(onSkip).toHaveBeenCalled();
	});

	it('shows unavailable message if WebAuthn not supported', () => {
		// Mock navigator without credentials
		Object.defineProperty(window, 'navigator', {
			value: {},
			writable: true,
		});

		setup();

		expect(screen.getByText(/WebAuthn is not available/)).toBeTruthy();
		expect(screen.queryByRole('button', { name: 'Set Up Now' })).toBeNull();
	});

	it('disables buttons when loading', () => {
		setup({}, {}, { loading: true });

		const setupButton = screen.getByRole('button', { name: 'Setting up...' });
		const skipButton = screen.getByRole('button', { name: 'Skip for now' });

		expect((setupButton as HTMLButtonElement).disabled).toBe(true);
		expect((skipButton as HTMLButtonElement).disabled).toBe(true);
	});
});
