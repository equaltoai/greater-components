/**
 * Wiki Component Context
 *
 * Shared state for community wiki pages (view + edit + history).
 *
 * @module @equaltoai/greater-components/faces/community/Wiki/context
 */

import { getContext, setContext } from 'svelte';
import type { WikiContext } from '../../types.js';

export const WIKI_CONTEXT_KEY = Symbol('wiki-context');

export function createWikiContext(context: WikiContext): WikiContext {
	setContext(WIKI_CONTEXT_KEY, context);
	return context;
}

export function getWikiContext(): WikiContext {
	const context = getContext<WikiContext>(WIKI_CONTEXT_KEY);
	if (!context) {
		throw new Error('Wiki context not found. Make sure this component is used within a Wiki.Root component.');
	}
	return context;
}

export function hasWikiContext(): boolean {
	try {
		return !!getContext<WikiContext>(WIKI_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { WikiContext };

