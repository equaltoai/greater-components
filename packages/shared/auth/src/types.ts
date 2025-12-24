/**
 * Authentication Component Types
 *
 * Type definitions for SignInCard and UserButton components.
 *
 * @module Auth/types
 */

import type { Component, Snippet } from 'svelte';

/**
 * OAuth provider configuration for SignInCard
 */
export interface OAuthProvider {
	/** Unique identifier for the provider (e.g., 'google', 'github', 'mastodon') */
	id: string;
	/** Display name for the provider (e.g., 'Google', 'GitHub', 'Mastodon') */
	name: string;
	/** Icon component to display for the provider */
	icon?: Component;
}

/**
 * Props for the SignInCard component
 */
export interface SignInCardProps {
	/**
	 * Title displayed at the top of the card
	 * @default "Sign in to continue"
	 */
	title?: string;

	/**
	 * Optional description text below the title
	 */
	description?: string;

	/**
	 * Array of OAuth providers to display as sign-in options
	 */
	providers: OAuthProvider[];

	/**
	 * Callback invoked when a provider button is clicked
	 * @param providerId - The id of the selected provider
	 */
	onSignIn: (providerId: string) => Promise<void>;

	/**
	 * Whether any sign-in operation is in progress
	 * @default false
	 */
	loading?: boolean;

	/**
	 * The provider ID currently being processed (shows spinner on that button)
	 */
	loadingProvider?: string | null;

	/**
	 * Error message to display
	 */
	error?: string | null;

	/**
	 * Optional callback for retry action when error is displayed
	 */
	onRetry?: () => void;

	/**
	 * Additional CSS class for the component
	 */
	class?: string;

	/**
	 * Optional footer content snippet
	 */
	footer?: Snippet;
}

/**
 * User information for UserButton component
 */
export interface AuthUserInfo {
	/** User's display name */
	name: string;
	/** User's email address */
	email?: string;
	/** URL to user's avatar image */
	imageUrl?: string;
}

/**
 * Menu item configuration for UserButton dropdown
 */
export interface UserMenuItem {
	/** Unique identifier for the menu item */
	id: string;
	/** Display label for the menu item */
	label: string;
	/** Optional icon component */
	icon?: Component;
	/** Click handler for the menu item */
	onClick?: () => void;
	/** Whether the item is destructive (shows in red) */
	destructive?: boolean;
	/** Whether the item is disabled */
	disabled?: boolean;
	/** Optional keyboard shortcut display */
	shortcut?: string;
}

/**
 * Props for the UserButton component
 */
export interface UserButtonProps {
	/**
	 * User information to display
	 */
	user: AuthUserInfo;

	/**
	 * Callback invoked when sign out is triggered
	 */
	onSignOut: () => Promise<void>;

	/**
	 * Display variant
	 * - 'inline': Shows avatar with name, click triggers sign-out directly
	 * - 'dropdown': Avatar trigger with dropdown menu
	 * @default 'dropdown'
	 */
	variant?: 'inline' | 'dropdown';

	/**
	 * Whether sign-out is in progress
	 * @default false
	 */
	loading?: boolean;

	/**
	 * Additional menu items to display in dropdown (only for dropdown variant)
	 */
	menuItems?: UserMenuItem[];

	/**
	 * Additional CSS class for the component
	 */
	class?: string;

	/**
	 * Size of the avatar
	 * @default 'md'
	 */
	size?: 'sm' | 'md' | 'lg';
}
