/**
 * Community Component Context
 *
 * Provides shared state and configuration for compound Community components.
 * Uses Svelte 5's context API for passing data between Community.* components.
 *
 * @module @equaltoai/greater-components/faces/community/Community/context
 */

import { getContext, setContext } from 'svelte';
import type {
	CommunityData,
	CommunityConfig,
	CommunityHandlers,
	CommunityContext,
} from '../../types.js';

/**
 * Community context key
 */
export const COMMUNITY_CONTEXT_KEY = Symbol('community-context');

/**
 * Default community configuration
 */
export const DEFAULT_COMMUNITY_CONFIG: Required<CommunityConfig> = {
	showStats: true,
	showRules: true,
	showModerators: false,
	compact: false,
	class: '',
};

/**
 * Creates and sets the community context
 */
export function createCommunityContext(
	community: CommunityData,
	config: CommunityConfig = {},
	handlers: CommunityHandlers = {},
	isSubscribed: boolean = false,
	isModerator: boolean = false
): CommunityContext {
	const context: CommunityContext = {
		get community() {
			return community;
		},
		get config() {
			return {
				...DEFAULT_COMMUNITY_CONFIG,
				...config,
			};
		},
		get handlers() {
			return handlers;
		},
		isSubscribed,
		isModerator,
	};

	setContext(COMMUNITY_CONTEXT_KEY, context);
	return context;
}

/**
 * Gets the community context from a parent component
 * @throws Error if called outside of a Community.Root component
 */
export function getCommunityContext(): CommunityContext {
	const context = getContext<CommunityContext>(COMMUNITY_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Community context not found. Make sure this component is used within a Community.Root component.'
		);
	}
	return context;
}

/**
 * Checks if community context exists
 */
export function hasCommunityContext(): boolean {
	try {
		return !!getContext<CommunityContext>(COMMUNITY_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { CommunityContext };
