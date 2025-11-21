/**
 * Authentication Context
 *
 * Provides authentication state and handlers for all auth components.
 * Supports multiple authentication methods: email/password, WebAuthn, OAuth, 2FA.
 *
 * @module Auth/context
 */

import { getContext, setContext } from 'svelte';

const AUTH_CONTEXT_KEY = Symbol('auth-context');

/**
 * Login credentials for email/password authentication
 */
export interface LoginCredentials {
	email: string;
	password: string;
	remember?: boolean;
}

/**
 * Registration data for new account creation
 */
export interface RegisterData {
	email: string;
	password: string;
	username: string;
	displayName?: string;
	agreeToTerms: boolean;
	inviteCode?: string;
}

/**
 * WebAuthn credential data
 */
export interface WebAuthnCredential {
	email: string;
	credential?: PublicKeyCredential;
}

/**
 * OAuth authorization data
 */
export interface OAuthData {
	clientId: string;
	redirectUri: string;
	scope: string[];
	state: string;
}

/**
 * Two-factor authentication data
 */
export interface TwoFactorData {
	code: string;
	method: 'totp' | 'backup';
}

/**
 * Password reset data
 */
export interface PasswordResetData {
	email: string;
	token?: string;
	newPassword?: string;
}

/**
 * Crypto wallet connection data
 */
export interface WalletConnectionData {
	address: string;
	chainId: number;
	provider: string;
	signature: string;
}

/**
 * Authentication event handlers
 */
export interface AuthHandlers {
	/**
	 * Handle OAuth instance selection/start
	 */
	onOAuthStart?: (instanceUrl: string) => Promise<void>;

	/**
	 * Handle email/password login
	 */
	onLogin?: (credentials: LoginCredentials) => Promise<void>;

	/**
	 * Handle account registration
	 */
	onRegister?: (data: RegisterData) => Promise<void>;

	/**
	 * Handle WebAuthn login
	 */
	onWebAuthnLogin?: (credential: WebAuthnCredential) => Promise<void>;

	/**
	 * Handle WebAuthn registration/setup
	 */
	onWebAuthnRegister?: (email: string) => Promise<PublicKeyCredential>;

	/**
	 * Handle OAuth authorization
	 */
	onOAuthAuthorize?: (data: OAuthData) => Promise<void>;

	/**
	 * Deny OAuth authorization
	 */
	onOAuthDeny?: () => void;

	/**
	 * Handle two-factor authentication setup
	 */
	onTwoFactorSetup?: (method: 'totp' | 'backup') => Promise<{ secret?: string; codes?: string[] }>;

	/**
	 * Handle two-factor authentication verification
	 */
	onTwoFactorVerify?: (data: TwoFactorData) => Promise<void>;

	/**
	 * Disable two-factor authentication
	 */
	onTwoFactorDisable?: () => Promise<void>;

	/**
	 * Request password reset
	 */
	onPasswordResetRequest?: (email: string) => Promise<void>;

	/**
	 * Confirm password reset with token
	 */
	onPasswordResetConfirm?: (data: PasswordResetData) => Promise<void>;

	/**
	 * Handle crypto wallet connection
	 */
	onWalletConnect?: (data: WalletConnectionData) => Promise<void>;

	/**
	 * Handle crypto wallet disconnection
	 */
	onWalletDisconnect?: () => Promise<void>;

	/**
	 * Regenerate backup codes
	 */
	onRegenerateBackupCodes?: () => Promise<string[]>;

	/**
	 * Navigate to registration page
	 */
	onNavigateToRegister?: () => void;

	/**
	 * Navigate to login page
	 */
	onNavigateToLogin?: () => void;

	/**
	 * Navigate to forgot password page
	 */
	onNavigateToForgotPassword?: () => void;

	/**
	 * Handle logout
	 */
	onLogout?: () => Promise<void>;
}

/**
 * Current user data
 */
export interface AuthUser {
	id: string;
	email: string;
	username: string;
	displayName?: string;
	avatar?: string;
	emailVerified: boolean;
	twoFactorEnabled: boolean;
	webAuthnEnabled: boolean;
}

/**
 * Authentication state
 */
export interface AuthState {
	/**
	 * Whether user is authenticated
	 */
	authenticated: boolean;

	/**
	 * Current user data
	 */
	user: AuthUser | null;

	/**
	 * Whether an auth operation is in progress
	 */
	loading: boolean;

	/**
	 * Current error message
	 */
	error: string | null;

	/**
	 * Whether 2FA is required for current login
	 */
	requiresTwoFactor: boolean;

	/**
	 * Pending 2FA session data
	 */
	twoFactorSession?: {
		email: string;
		methods: Array<'totp' | 'backup'>;
	};
}

/**
 * Authentication context
 */
export interface AuthContext {
	/**
	 * Current authentication state
	 */
	state: AuthState;

	/**
	 * Authentication event handlers
	 */
	handlers: AuthHandlers;

	/**
	 * Update authentication state
	 */
	updateState: (partial: Partial<AuthState>) => void;

	/**
	 * Clear authentication error
	 */
	clearError: () => void;
}

/**
 * Create authentication context
 *
 * @param initialState - Initial authentication state
 * @param handlers - Authentication event handlers
 * @returns Authentication context
 */
export function createAuthContext(state: AuthState, handlers: AuthHandlers = {}): AuthContext {
	const context: AuthContext = {
		state,
		handlers,
		updateState: (partial: Partial<AuthState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
	};

	setContext(AUTH_CONTEXT_KEY, context);
	return context;
}

/**
 * Get authentication context
 *
 * Must be called within an Auth component tree.
 *
 * @throws Error if called outside Auth component tree
 * @returns Authentication context
 */
export function getAuthContext(): AuthContext {
	const context = getContext<AuthContext>(AUTH_CONTEXT_KEY);
	if (!context) {
		throw new Error('Auth components must be used within an Auth.Root component');
	}
	return context;
}

/**
 * Validation helpers
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters' };
	}
	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain a lowercase letter' };
	}
	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain an uppercase letter' };
	}
	if (!/\d/.test(password)) {
		return { valid: false, message: 'Password must contain a number' };
	}
	return { valid: true };
}

/**
 * Validate instance URL (fediverse host)
 */
export function isValidInstanceUrl(value: string): boolean {
	const trimmed = value.trim();
	if (!trimmed) return false;

	const candidate =
		trimmed.startsWith('http://') || trimmed.startsWith('https://')
			? trimmed
			: `https://${trimmed}`;

	try {
		const url = new URL(candidate);
		return url.hostname.length > 0 && (url.protocol === 'https:' || url.protocol === 'http:');
	} catch {
		return false;
	}
}

/**
 * Validate instance URL (fediverse host)
 */

/**
 * Validate username format
 */
export function isValidUsername(username: string): { valid: boolean; message?: string } {
	if (username.length < 3) {
		return { valid: false, message: 'Username must be at least 3 characters' };
	}
	if (username.length > 30) {
		return { valid: false, message: 'Username must be less than 30 characters' };
	}
	if (!/^[a-zA-Z0-9_]+$/.test(username)) {
		return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
	}
	return { valid: true };
}
