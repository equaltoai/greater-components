import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import OAuthConsent from '../src/OAuthConsent.svelte';

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: (opts: any) => ({
		props: {},
		actions: {
			button: (node: HTMLElement) => {
				// If the component passes onClick in opts, we can't easily attach it here
				// because this is an action. But the component renders `onclick` or uses the action?
				// `OAuthConsent.svelte` uses `use:authorizeButton.actions.button`.
				// The `createButton` in `svelte-headless` usually handles the click internally or exposes it.
				// In `OAuthConsent.svelte`:
				// const authorizeButton = createButton({ onClick: () => handleAuthorize() });
				// ... use:authorizeButton.actions.button

				// So the action handles the event listener.
				// To trigger it in test, we need to fire the event on the node.
				// The mock implementation of the action should probably attach the listener?
				// Or we can just trust that fireEvent.click works if the mock action does nothing?
				// NO. `createButton` logic binds the click event.
				// If we mock `createButton`, we lose that binding unless we implement it.

				// Better strategy: Mock `createButton` to return an object where `actions.button`
				// attaches the `onClick` handler passed in options to the node?
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

// Mock auth context
const mockUpdateState = vi.fn();
const mockClearError = vi.fn();
const mockOnOAuthAuthorize = vi.fn();
const mockOnOAuthDeny = vi.fn();

const mockContext = {
	state: {
		loading: false,
		error: null,
	},
	handlers: {
		onOAuthAuthorize: mockOnOAuthAuthorize,
		onOAuthDeny: mockOnOAuthDeny,
	},
	updateState: mockUpdateState,
	clearError: mockClearError,
};

vi.mock('../src/context.js', () => ({
	getAuthContext: () => mockContext,
}));

describe('OAuthConsent', () => {
	const defaultProps = {
		clientInfo: {
			name: 'Test App',
			website: 'https://example.com',
			description: 'A test app',
			icon: 'https://example.com/icon.png',
		},
		scopes: [
			{ id: 'read', name: 'Read', description: 'Read access' },
			{ id: 'write', name: 'Write', description: 'Write access' },
		],
		clientId: 'client-123',
		redirectUri: 'https://example.com/cb',
		state: 'xyzState',
		user: {
			username: 'testuser',
			displayName: 'Test User',
			avatar: 'https://example.com/avatar.png',
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockContext.state.loading = false;
		mockContext.state.error = null;
	});

	it('renders client info correctly', () => {
		render(OAuthConsent, defaultProps);

		expect(screen.getByRole('heading', { name: 'Authorize Test App' })).toBeTruthy();
		expect(screen.getByText('A test app')).toBeTruthy();
		expect(screen.getByText('example.com')).toBeTruthy(); // Hostname from website
		expect(screen.getByRole('img', { name: 'Test App' })).toBeTruthy();
	});

	it('renders scopes correctly', () => {
		render(OAuthConsent, defaultProps);

		expect(screen.getByText('Read')).toBeTruthy();
		expect(screen.getByText('Read access')).toBeTruthy();
		expect(screen.getByText('Write')).toBeTruthy();
		expect(screen.getByText('Write access')).toBeTruthy();
	});

	it('renders user info correctly', () => {
		render(OAuthConsent, defaultProps);

		expect(screen.getByText('Test User')).toBeTruthy();
		expect(screen.getByText('@testuser')).toBeTruthy();
		expect(screen.getByRole('img', { name: 'testuser' })).toBeTruthy();
	});

	it('handles authorization click', async () => {
		render(OAuthConsent, defaultProps);

		const authBtn = screen.getByRole('button', { name: /authorize test app/i });
		await fireEvent.click(authBtn);

		expect(mockClearError).toHaveBeenCalled();
		expect(mockUpdateState).toHaveBeenCalledWith({ loading: true });
		expect(mockOnOAuthAuthorize).toHaveBeenCalledWith({
			clientId: 'client-123',
			redirectUri: 'https://example.com/cb',
			scope: ['read', 'write'],
			state: 'xyzState',
		});
		expect(mockUpdateState).toHaveBeenCalledWith({ loading: false });
	});

	it('handles denial click', async () => {
		render(OAuthConsent, defaultProps);

		const denyBtn = screen.getByRole('button', { name: /cancel/i });
		await fireEvent.click(denyBtn);

		expect(mockOnOAuthDeny).toHaveBeenCalled();
	});

	it('displays error from context', () => {
		mockContext.state.error = 'Something went wrong';
		render(OAuthConsent, defaultProps);

		expect(screen.getByRole('alert')).toBeTruthy();
		expect(screen.getByText('Something went wrong')).toBeTruthy();
	});

	it('disables buttons when loading', () => {
		mockContext.state.loading = true;
		render(OAuthConsent, defaultProps);

		const authBtn = screen.getByRole('button', { name: /authorizing/i }); // Text changes when loading
		const denyBtn = screen.getByRole('button', { name: /cancel/i });

		expect(authBtn.disabled).toBe(true);
		expect(denyBtn.disabled).toBe(true);
	});

	it('handles authorization failure', async () => {
		mockOnOAuthAuthorize.mockRejectedValueOnce(new Error('Auth failed'));
		render(OAuthConsent, defaultProps);

		const authBtn = screen.getByRole('button', { name: /authorize test app/i });
		await fireEvent.click(authBtn);

		expect(mockUpdateState).toHaveBeenCalledWith({ error: 'Auth failed' });
	});
});
