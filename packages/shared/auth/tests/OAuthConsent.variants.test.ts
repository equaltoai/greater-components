import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import OAuthConsent from '../src/OAuthConsent.svelte';

// Mock headless button (simplified from existing test)
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

const mockContext = {
	state: { loading: false, error: null },
	handlers: {},
	updateState: vi.fn(),
	clearError: vi.fn(),
};

vi.mock('../src/context.js', () => ({
	getAuthContext: () => mockContext,
}));

describe('OAuthConsent Variants', () => {
	const minimalProps = {
		clientInfo: { name: 'Minimal App' },
		scopes: [{ id: 'basic', name: 'Basic', description: 'Basic access', icon: 'scope-icon.png' }],
		clientId: '123',
		redirectUri: 'cb',
		state: 'st',
		// user missing
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockContext.state.loading = false;
	});

	it('renders without user info', () => {
		render(OAuthConsent, minimalProps);
		expect(screen.queryByText('@testuser')).toBeNull();
	});

	it('renders placeholder app icon when missing', () => {
		render(OAuthConsent, minimalProps);
		// Placeholder is an SVG div, checking for class
		const container = screen.getByRole('heading', { name: 'Authorize Minimal App' }).parentElement;
		expect(container?.querySelector('.auth-oauth__app-icon--placeholder')).toBeTruthy();
	});

	it('renders scope with icon', () => {
		const { container } = render(OAuthConsent, minimalProps);
		const img = container.querySelector('.auth-oauth__permission-icon');
		expect(img?.getAttribute('src')).toBe('scope-icon.png');
	});

	it('does not render website or description if missing', () => {
		render(OAuthConsent, minimalProps);
		expect(screen.queryByText('example.com')).toBeNull();
		expect(screen.queryByRole('link')).toBeNull();
	});

	it('blocks authorize click when loading', async () => {
		mockContext.state.loading = true;
		const { getByRole } = render(OAuthConsent, minimalProps);

		const btn = getByRole('button', { name: /authorizing/i }); // Text changes
		await fireEvent.click(btn);

		expect(mockContext.updateState).not.toHaveBeenCalled(); // Should return early
	});

	it('blocks deny click when loading', async () => {
		const onDeny = vi.fn();
		mockContext.handlers = { onOAuthDeny: onDeny };
		mockContext.state.loading = true;

		const { getByRole } = render(OAuthConsent, minimalProps);
		const btn = getByRole('button', { name: /cancel/i });
		await fireEvent.click(btn);

		expect(onDeny).not.toHaveBeenCalled();
	});
});
