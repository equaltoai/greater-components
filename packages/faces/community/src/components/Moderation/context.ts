/**
 * Moderation Component Context
 *
 * Shared state for moderation tooling (queue + log).
 *
 * @module @equaltoai/greater-components/faces/community/Moderation/context
 */

import { getContext, setContext } from 'svelte';
import type { ModerationContext } from '../../types.js';

export const MODERATION_CONTEXT_KEY = Symbol('moderation-context');

export function createModerationContext(context: ModerationContext): ModerationContext {
	setContext(MODERATION_CONTEXT_KEY, context);
	return context;
}

export function getModerationContext(): ModerationContext {
	const context = getContext<ModerationContext>(MODERATION_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Moderation context not found. Make sure this component is used within a Moderation.Root component.'
		);
	}
	return context;
}

export function hasModerationContext(): boolean {
	try {
		return !!getContext<ModerationContext>(MODERATION_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { ModerationContext };

