/**
 * Authentication Components
 *
 * Complete authentication flow for ActivityPub/Fediverse applications.
 * Supports email/password, WebAuthn, OAuth, 2FA, and password reset.
 *
 * @module components/Auth
 *
 * @example Form-based authentication
 * ```svelte
 * <script>
 *   import * as Auth from '@equaltoai/greater-components-auth';
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
 *
 * @example OAuth sign-in card
 * ```svelte
 * <script>
 *   import { SignInCard } from '@equaltoai/greater-components-auth';
 *   import { GithubIcon } from '@equaltoai/greater-components-icons';
 *
 *   const providers = [
 *     { id: 'github', name: 'GitHub', icon: GithubIcon },
 *   ];
 * </script>
 *
 * <SignInCard
 *   title="Welcome"
 *   {providers}
 *   onSignIn={async (id) => {}}
 * />
 * ```
 *
 * @example User button with menu
 * ```svelte
 * <script>
 *   import { UserButton } from '@equaltoai/greater-components-auth';
 *
 *   const user = { name: 'Jane', email: 'jane@example.com' };
 * </script>
 *
 * <UserButton {user} onSignOut={async () => {}} />
 * ```
 */

// Form-based authentication components (compound pattern)
export { default as Root } from './Root.svelte';
export { default as LoginForm } from './LoginForm.svelte';
export { default as RegisterForm } from './RegisterForm.svelte';
export { default as WebAuthnSetup } from './WebAuthnSetup.svelte';
export { default as OAuthConsent } from './OAuthConsent.svelte';
export { default as InstanceSelector } from './InstanceSelector.svelte';
export { default as TwoFactorSetup } from './TwoFactorSetup.svelte';
export { default as TwoFactorVerify } from './TwoFactorVerify.svelte';
export { default as PasswordReset } from './PasswordReset.svelte';
export { default as BackupCodes } from './BackupCodes.svelte';
export { default as WalletConnect } from './WalletConnect.svelte';

// OAuth-focused authentication patterns
export { default as SignInCard } from './SignInCard.svelte';
export { default as UserButton } from './UserButton.svelte';

// Export types from context
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

// Export types for SignInCard and UserButton
export type {
	OAuthProvider,
	SignInCardProps,
	AuthUserInfo,
	UserMenuItem,
	UserButtonProps,
} from './types.js';

// Export context utilities
export {
	createAuthContext,
	getAuthContext,
	isValidEmail,
	isValidPassword,
	isValidInstanceUrl,
	isValidUsername,
} from './context.js';
