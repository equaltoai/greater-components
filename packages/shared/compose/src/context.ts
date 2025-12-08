/**
 * Compose Component Context
 *
 * Provides shared state and configuration for compound Compose components.
 * Handles post composition, media attachments, and submission.
 *
 * @module @equaltoai/greater-components/faces/social/Compose/context
 */

import { getContext, setContext } from 'svelte';
import type { MediaAttachment } from './types.js';

/**
 * Compose context key
 */
const COMPOSE_CONTEXT_KEY = Symbol('compose-context');

/**
 * Post visibility options (ActivityPub)
 */
export type PostVisibility = 'public' | 'unlisted' | 'private' | 'direct';

/**
 * Quote permission levels (Lesser-specific)
 */
export type QuotePermission = 'EVERYONE' | 'FOLLOWERS' | 'NONE';

/**
 * Quote type (Lesser-specific)
 */
export type QuoteType = 'FULL' | 'PARTIAL' | 'COMMENTARY' | 'REACTION';

/**
 * Media attachment type for compose
 */
export interface ComposeAttachment extends Partial<MediaAttachment> {
	/**
	 * Local file reference
	 */
	file?: File;

	/**
	 * Upload progress (0-100)
	 */
	progress?: number;

	/**
	 * Upload error
	 */
	error?: string;

	/**
	 * Alt text description
	 */
	description?: string;
}

/**
 * Configuration options for Compose component
 */
export interface ComposeConfig {
	/**
	 * Maximum character limit
	 */
	characterLimit?: number;

	/**
	 * Allow media attachments
	 */
	allowMedia?: boolean;

	/**
	 * Maximum number of media attachments
	 */
	maxMediaAttachments?: number;

	/**
	 * Allow polls
	 */
	allowPolls?: boolean;

	/**
	 * Allow content warnings
	 */
	allowContentWarnings?: boolean;

	/**
	 * Default visibility
	 */
	defaultVisibility?: PostVisibility;

	/**
	 * Enable markdown formatting
	 */
	enableMarkdown?: boolean;

	/**
	 * Placeholder text
	 */
	placeholder?: string;

	/**
	 * Custom CSS class
	 */
	class?: string;
}

/**
 * Compose action handlers
 */
export interface ComposeHandlers {
	/**
	 * Called when post is submitted
	 */
	onSubmit?: (data: {
		content: string;
		visibility: PostVisibility;
		contentWarning?: string;
		mediaAttachments?: ComposeAttachment[];
		inReplyTo?: string;
		quoteUrl?: string;
		quoteType?: QuoteType;
		quotePermissions?: QuotePermission;
	}) => Promise<void> | void;

	/**
	 * Called when media is uploaded
	 */
	onMediaUpload?: (file: File) => Promise<MediaAttachment>;

	/**
	 * Called when media is removed
	 */
	onMediaRemove?: (id: string) => void;

	/**
	 * Called when draft is saved
	 */
	onSaveDraft?: (content: string) => void;

	/**
	 * Called when compose is cancelled
	 */
	onCancel?: () => void;
}

/**
 * Compose state
 */
export interface ComposeState {
	/**
	 * Post content
	 */
	content: string;

	/**
	 * Content warning text
	 */
	contentWarning: string;

	/**
	 * Post visibility
	 */
	visibility: PostVisibility;

	/**
	 * Media attachments
	 */
	mediaAttachments: ComposeAttachment[];

	/**
	 * Whether compose is submitting
	 */
	submitting: boolean;

	/**
	 * Submit error if any
	 */
	error: Error | null;

	/**
	 * Character count
	 */
	characterCount: number;

	/**
	 * Whether character limit is exceeded
	 */
	overLimit: boolean;

	/**
	 * ID of status being replied to
	 */
	inReplyTo?: string;

	/**
	 * Whether content warning is enabled
	 */
	contentWarningEnabled: boolean;

	/**
	 * URL of status being quoted (Lesser-specific)
	 */
	quoteUrl?: string;

	/**
	 * Type of quote (Lesser-specific)
	 */
	quoteType?: QuoteType;

	/**
	 * Who can quote this post (Lesser-specific)
	 */
	quotePermissions?: QuotePermission;
}

/**
 * Compose context value
 */
export interface ComposeContext {
	/**
	 * Configuration options
	 */
	config: Required<ComposeConfig>;

	/**
	 * Action handlers
	 */
	handlers: ComposeHandlers;

	/**
	 * Current compose state
	 */
	state: ComposeState;

	/**
	 * Update state helper
	 */
	updateState: (partial: Partial<ComposeState>) => void;

	/**
	 * Reset to initial state
	 */
	reset: () => void;
}

/**
 * Create and set the compose context
 *
 * @param config - Configuration options
 * @param handlers - Action handlers
 * @param initialState - Initial state
 * @param state - Reactive state object (created with $state in Root component)
 */
export function createComposeContext(
	config: ComposeConfig = {},
	handlers: ComposeHandlers = {},
	initialState: Partial<ComposeState> = {},
	state?: ComposeState
): ComposeContext {
	const characterLimit = config.characterLimit || 500;

	const defaultState: ComposeState = {
		content: '',
		contentWarning: '',
		visibility: config.defaultVisibility || 'public',
		mediaAttachments: [],
		submitting: false,
		error: null,
		characterCount: 0,
		overLimit: false,
		inReplyTo: undefined,
		contentWarningEnabled: false,
	};

	// If state is provided (from Root component with $state), use it
	// Otherwise create a fallback (for testing or non-Svelte environments)
	const reactiveState =
		state ||
		({
			...defaultState,
			...initialState,
		} as ComposeState);

	function reset() {
		Object.assign(reactiveState, defaultState);
		// Character count will be updated by $effect in Root component
	}

	const context: ComposeContext = {
		config: {
			characterLimit,
			allowMedia: config.allowMedia ?? true,
			maxMediaAttachments: config.maxMediaAttachments || 4,
			allowPolls: config.allowPolls ?? true,
			allowContentWarnings: config.allowContentWarnings ?? true,
			defaultVisibility: config.defaultVisibility || 'public',
			enableMarkdown: config.enableMarkdown ?? false,
			placeholder: config.placeholder || "What's on your mind?",
			class: config.class || '',
		},
		handlers,
		state: reactiveState,
		updateState: (partial: Partial<ComposeState>) => {
			Object.assign(reactiveState, partial);
			// Character count will be updated by $effect in Root component
		},
		reset,
	};

	setContext(COMPOSE_CONTEXT_KEY, context);
	return context;
}

/**
 * Get the compose context
 *
 * @throws Error if called outside of Compose.Root
 */
export function getComposeContext(): ComposeContext {
	const context = getContext<ComposeContext>(COMPOSE_CONTEXT_KEY);

	if (!context) {
		throw new Error(
			'Compose context not found. Make sure you are using Compose components inside <Compose.Root>.'
		);
	}

	return context;
}

/**
 * Check if compose context exists
 */
export function hasComposeContext(): boolean {
	try {
		const context = getContext<ComposeContext>(COMPOSE_CONTEXT_KEY);
		return context !== undefined && context !== null;
	} catch {
		return false;
	}
}
