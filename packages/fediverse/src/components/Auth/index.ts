/**
 * Authentication Components
 * 
 * Complete authentication flow for ActivityPub/Fediverse applications.
 * Supports email/password, WebAuthn, OAuth, 2FA, and password reset.
 * 
 * @module components/Auth
 * 
 * @example
 * ```svelte
 * <script>
 *   import * as Auth from '@equaltoai/greater-components-fediverse/Auth';
 * 
 *   const handlers = {
 *     onLogin: async (credentials) => {
 *       // Handle login
 *     },
 *     onRegister: async (data) => {
 *       // Handle registration
 *     },
 *   };
 * </script>
 * 
 * <Auth.Root {handlers}>
 *   <Auth.LoginForm />
 * </Auth.Root>
 * ```
 */

export { default as Root } from './Root.svelte';
export { default as LoginForm } from './LoginForm.svelte';
export { default as RegisterForm } from './RegisterForm.svelte';
export { default as WebAuthnSetup } from './WebAuthnSetup.svelte';
export { default as OAuthConsent } from './OAuthConsent.svelte';
export { default as TwoFactorSetup } from './TwoFactorSetup.svelte';
export { default as TwoFactorVerify } from './TwoFactorVerify.svelte';
export { default as PasswordReset } from './PasswordReset.svelte';
export { default as BackupCodes } from './BackupCodes.svelte';
export { default as WalletConnect } from './WalletConnect.svelte';

// Export types and context utilities
export type {
	LoginCredentials,
	RegisterData,
	WebAuthnCredential,
	OAuthData,
	TwoFactorData,
	PasswordResetData,
	WalletConnectionData,
	AuthHandlers,
	AuthUser,
	AuthState,
	AuthContext,
} from './context.js';

export {
	createAuthContext,
	getAuthContext,
	isValidEmail,
	isValidPassword,
	isValidUsername,
} from './context.js';

