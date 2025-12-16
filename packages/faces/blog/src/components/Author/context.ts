/**
 * Author Component Context
 *
 * Provides shared state and configuration for compound Author components.
 * Uses Svelte 5's context API for passing data between Author.* components.
 *
 * @module @equaltoai/greater-components/faces/blog/Author/context
 */

import { getContext, setContext } from 'svelte';
import type { AuthorContext, AuthorData } from '../../types.js';

export const AUTHOR_CONTEXT_KEY = Symbol('author-context');

export const DEFAULT_AUTHOR_CONFIG = {
	showBio: true,
	showSocial: true,
} satisfies Pick<AuthorContext, 'showBio' | 'showSocial'>;

export function createAuthorContext(
	author: AuthorData,
	showBio: boolean = DEFAULT_AUTHOR_CONFIG.showBio,
	showSocial: boolean = DEFAULT_AUTHOR_CONFIG.showSocial
): AuthorContext {
	const context: AuthorContext = {
		get author() {
			return author;
		},
		showBio,
		showSocial,
	};

	setContext(AUTHOR_CONTEXT_KEY, context);
	return context;
}

export function getAuthorContext(): AuthorContext {
	const context = getContext<AuthorContext>(AUTHOR_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Author context not found. Make sure this component is used within an Author.Root component.'
		);
	}
	return context;
}

export function hasAuthorContext(): boolean {
	try {
		return !!getContext<AuthorContext>(AUTHOR_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { AuthorContext };

